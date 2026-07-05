// Post-build step (runs after `jekyll build`, like Pagefind): writes a plain-text
// Markdown twin of every post/page into _site, plus a /llms.txt index.
//
//   /about/                     -> _site/about.md
//   /2026/childhood-computing/  -> _site/2026/childhood-computing.md
//
// Source of truth is _site/agents-manifest.json (emitted by agents-manifest.json,
// the Jekyll template). We read the ORIGINAL Markdown source for clean text —
// not the rendered HTML — strip its YAML front matter, and prepend a small header.
// No Jekyll plugin, no content files touched. See _docs/agents.md.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SITE = '_site';
const MANIFEST = join(SITE, 'agents-manifest.json');

const { site, docs } = JSON.parse(readFileSync(MANIFEST, 'utf8'));

const stripFrontMatter = (src) =>
  src.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

// Drop a leading title heading that duplicates our prepended `# {title}`.
function stripLeadingTitle(body, title) {
  body = body.replace(/^\s+/, '');
  const t = (title || '').trim();
  if (!t) return body;
  const md = body.match(/^#\s+(.+?)[ \t]*\r?\n/);
  if (md && md[1].trim() === t) return body.slice(md[0].length).replace(/^\s+/, '');
  const html = body.match(/^<h1[^>]*>([\s\S]*?)<\/h1>[ \t]*\r?\n?/i);
  if (html && html[1].replace(/<[^>]+>/g, '').trim() === t)
    return body.slice(html[0].length).replace(/^\s+/, '');
  return body;
}

// /about/ -> about.md ; /2026/foo/ -> 2026/foo.md ; / -> index.md
function slugPath(url) {
  let u = url.endsWith('/') ? url.slice(0, -1) : url;
  if (u.startsWith('/')) u = u.slice(1);
  return (u === '' ? 'index' : u) + '.md';
}

const pages = [];
const posts = [];
let written = 0;

for (const d of docs) {
  let src;
  try {
    src = readFileSync(d.path, 'utf8');
  } catch {
    console.warn('  skip (no source):', d.path);
    continue;
  }

  let body = stripFrontMatter(src);
  // Fall back to the source H1 if Jekyll gave no title (belt and suspenders).
  let title = d.title;
  if (!title) {
    const h1 = body.match(/^\s*#\s+(.+)/);
    title = h1 ? h1[1].trim() : d.url;
  }
  body = stripLeadingTitle(body, title);

  const canonical = `${site.url}${d.url}`;
  const isPost = d.collection === 'posts';
  const meta = isPost && d.date
    ? `> Markdown version of ${canonical} — ${d.date}`
    : `> Markdown version of ${canonical}`;
  const out = `# ${title}\n\n${meta}\n\n${body.trimEnd()}\n`;

  const rel = slugPath(d.url);
  const dest = join(SITE, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, out);
  written++;

  (d.collection === 'posts' ? posts : pages).push({ title, href: '/' + rel, date: d.date });
}

// ---- /llms.txt : a Markdown index of the whole site for AI agents ----
pages.sort((a, b) => a.title.localeCompare(b.title));
posts.sort((a, b) => (b.date || '').localeCompare(a.date || '')); // newest first

let llms = `# ${site.title}\n\n> ${site.description}\n\n`;
llms +=
  'Every page and post on this site has a plain-text Markdown version for AI agents: ' +
  'append `.md` to any page URL, or use the links below.\n\n';

llms += '## Pages\n\n';
for (const p of pages) llms += `- [${p.title}](${p.href})\n`;

llms += '\n## Posts\n\n';
let year = '';
for (const p of posts) {
  const y = (p.date || '').slice(0, 4);
  if (y && y !== year) {
    year = y;
    llms += `\n### ${year}\n\n`;
  }
  llms += `- [${p.title}](${p.href})${p.date ? ` — ${p.date}` : ''}\n`;
}

writeFileSync(join(SITE, 'llms.txt'), llms);

// The manifest is a build artifact only — don't deploy it.
rmSync(MANIFEST, { force: true });

console.log(
  `agent-markdown: wrote ${written} .md files (${pages.length} pages, ${posts.length} posts) + llms.txt`
);
