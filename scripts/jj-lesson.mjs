// jj-lesson.mjs — write the jj page's lesson into its HTML, for readers without JavaScript.
//
//   node scripts/jj-lesson.mjs
//
// The lesson lives in misc/jj/js/lessons.js, and its terminal replies come from running
// it against the model in sim.js. This plays it once, here in Node, with the page's own
// seed, and writes every step between the two lesson markers in misc/jj/index.html.
// With JavaScript the page hides this copy and shows one step at a time instead.
// `make test` fails when the copy and lessons.js disagree; run this to bring them back.

import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const DIR = new URL('../misc/jj/', import.meta.url);
const PAGE = new URL('index.html', DIR);
const OPEN = '<!-- lesson: written by scripts/jj-lesson.mjs -->';
const CLOSE = '<!-- /lesson -->';

export function lessonHtml() {
  // The page's scripts hang everything on `window.JJ`; give them a window of their own.
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const name of ['sim.js', 'layout.js', 'git.js', 'lessons.js']) {
    const file = new URL(`js/${name}`, DIR);
    vm.runInContext(readFileSync(file, 'utf8'), sandbox, { filename: file.pathname });
  }
  // The same seed the page uses, read from its script, so the IDs match the stage's.
  const seed = Number(readFileSync(new URL('js/app.js', DIR), 'utf8').match(/SEED = (\d+)/)[1]);
  const { JJ } = sandbox;
  const steps = JJ.buildLesson(new JJ.Repo(seed), new JJ.Git(seed));

  const wrap = (lines) => lines.map((line) => `<div>${line}</div>`).join('');
  const out = [];
  let chapter = null;
  steps.forEach((step, i) => {
    if (step.chapter !== chapter) {
      if (chapter !== null) out.push('</section>');
      chapter = step.chapter;
      out.push(`<section class="chapter-text"><h2>${chapter}</h2>`);
    }
    const terminal = JJ.terminalLines(step);
    out.push(
      `<article class="step" id="${i + 1}">`,
      `<h3>${i + 1}. ${step.title}</h3>`,
      `<div class="body">${step.body.replace(/\s*\n\s*/g, ' ').trim()}</div>`,
      terminal.length ? `<div class="terminal">${wrap(terminal)}</div>` : '',
      '<aside class="git">',
      `<p class="git-label">${step.git.label}</p>`,
      `<div class="git-commands">${wrap(JJ.gitLines(step))}</div>`,
      `<p class="git-note">${step.git.note.replace(/\s*\n\s*/g, ' ').trim()}</p>`,
      '</aside>',
      '</article>'
    );
  });
  out.push('</section>');
  return out.filter(Boolean).join('\n');
}

// The page as it is, and the page as this would write it.
export function pages() {
  const html = readFileSync(PAGE, 'utf8');
  const start = html.indexOf(OPEN);
  const end = html.indexOf(CLOSE);
  if (start < 0 || end < start) throw new Error('index.html has lost its lesson markers');
  const made = html.slice(0, start + OPEN.length) + '\n' + lessonHtml() + '\n' + html.slice(end);
  return { html, made };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { html, made } = pages();
  if (made === html) console.log('misc/jj/index.html: the lesson is already current');
  else {
    writeFileSync(PAGE, made);
    console.log('misc/jj/index.html: lesson written');
  }
}
