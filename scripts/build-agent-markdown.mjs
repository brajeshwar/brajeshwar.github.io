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

// ⚠️ AUTHOR-ONLY BUILD NOTES MUST NOT SHIP HERE (added 2026-08-09).
// Liquid comments are stripped by Jekyll for the HTML, but this script reads
// the SOURCE file, so they survived into the .md twin — and the pages carry
// long ones. /cv.md opened with 30 lines about why /cv/ stopped using the
// timeline component, ahead of any of his actual CV. Audited across the site:
// 14 of 24 pages were shipping them, straight into /llms.txt consumers.
//
// Both spellings, since the codebase uses {%- comment -%} and {% comment %}.
const stripLiquidComments = (src) =>
  src.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}\s*/g, '')
     // HTML comments too: same problem, and about.html used one until today.
     .replace(/<!--[\s\S]*?-->\s*/g, '')
     // ⚠️ And <script> (added 2026-08-10). A Markdown page may still end with a
     // tag that loads its behaviour — /about/ closes with the anchors.js line —
     // which is markup with an unevaluated Liquid URL inside it, in a file whose
     // whole promise is plain text. Exactly ONE twin was affected, and it is the
     // page most likely to be opened through the [md] icon. Scripts are the only
     // tag stripped here: anything else in a Markdown source was authored to be
     // read. The HTML branch below drops far more, because there it is furniture.
     .replace(/<script\b[\s\S]*?<\/script>\s*/gi, '');

// ============================================================================
// HTML SOURCES: convert the RENDERED page, not the source file.
// ----------------------------------------------------------------------------
// ⚠️ ADDED 2026-08-10. Reading the source is right for the 1,457 posts and the
// Markdown pages, and completely wrong for the twelve pages in _pages/*.html —
// their sources are Liquid, so the twin shipped UNEVALUATED template code.
// /books.md opened with `{% include card-grid.html %}` and listed no books at
// all; /devices.md shipped a `{% for phones in site.data.devices %}` loop. An
// LLM does not "read the HTML fine", which is what _docs/todo.md assumed — it
// reads a template that never ran.
//
// So for those pages the only place the content exists is _site/<url>/index.html,
// after Jekyll has run the loops. The branch is on the SOURCE EXTENSION, from
// the manifest, so a page converted to .html tomorrow is handled without an edit
// here — and a page converted back to .md silently returns to the source path.
//
// ⚠️ NO DEPENDENCY, DELIBERATELY. A real HTML->Markdown library (turndown and
// friends) would mean the repo's first package.json, which the deploy workflow
// comments call out as a behaviour change for setup-node's caching. The markup
// being converted is our own and narrow — about twenty tags across twelve pages
// — so it is parsed here instead. This is a convenience artifact, not the site;
// a slightly plain twin is a bounded cost, a permanent dependency is not.
// ============================================================================

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr']);

// Interactive and presentational furniture with no meaning in a text twin:
// /own/'s sixteen scroll buttons, /archives/'s year jump strip (its anchors
// point at a page the twin is not), and every inline script.
const DROP = new Set(['script', 'style', 'svg', 'button', 'nav', 'form',
  'select', 'textarea', 'template']);

const INLINE = new Set(['a', 'em', 'i', 'strong', 'b', 'code', 'del', 's', 'mark',
  'small', 'span', 'time', 'sup', 'sub', 'abbr', 'cite', 'q', 'u', 'br', 'img',
  'var', 'kbd', 'samp']);

// ⚠️ Kramdown emits the SMART-PUNCTUATION entities by name, so a map of the
// five XML ones is not enough — `&rsquo;` is the commonest non-ASCII character
// on this site and `&hellip;` / `&mdash;` shipped raw into /random.md on the
// first run. Numeric forms are handled generically below; only named ones need
// a table, and this covers what the built pages actually contain.
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', minus: '−', shy: '',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', sbquo: '‚', bdquo: '„',
  laquo: '«', raquo: '»', lsaquo: '‹', rsaquo: '›',
  bull: '•', middot: '·', times: '×', divide: '÷', deg: '°', prime: '′',
  copy: '©', reg: '®', trade: '™', sect: '§', para: '¶', dagger: '†',
  euro: '€', pound: '£', yen: '¥', cent: '¢', plusmn: '±',
  frac12: '½', frac14: '¼', frac34: '¾',
};

// Generic containers, as opposed to the semantic inline formatting below them.
const GENERIC = new Set(['span', 'div']);

// ⚠️ Entities MUST be decoded. Rendered HTML is full of `&amp;` and `&#39;`, and
// a twin that ships them has simply traded one kind of markup for another.
const decode = (s) =>
  s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (all, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : all;
    }
    return e in NAMED ? NAMED[e] : all;
  });

function parseAttrs(str) {
  const attrs = {};
  const re = /([\w:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
  let m;
  while ((m = re.exec(str))) {
    let v = m[2] ?? '';
    if (v && (v[0] === '"' || v[0] === "'")) v = v.slice(1, -1);
    attrs[m[1].toLowerCase()] = decode(v);
  }
  return attrs;
}

// A tree, not a regex sweep. Nested lists and /hire/'s eight inner <article>s
// are exactly what a flat pass gets wrong.
function parseHtml(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const push = (node) => stack[stack.length - 1].children.push(node);
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\/?>/g;
  let last = 0, m;
  while ((m = re.exec(html))) {
    if (m.index > last) push({ tag: '#text', text: html.slice(last, m.index) });
    last = re.lastIndex;
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    const tag = m[2].toLowerCase();
    const node = { tag, attrs: parseAttrs(m[3] || ''), children: [] };
    push(node);
    if (!VOID.has(tag) && !m[0].endsWith('/>')) stack.push(node);
  }
  if (last < html.length) push({ tag: '#text', text: html.slice(last) });
  return root;
}

const rawText = (n) =>
  n.tag === '#text' ? decode(n.text) : n.children.map(rawText).join('');

const tidy = (s) => s.replace(/\s+/g, ' ').trim();

// ⚠️ ADJACENT ELEMENT SIBLINGS NEED A SEPARATOR, and only elements do.
// /own/ renders each item as four touching spans with no whitespace between
// them — `<span>P</span><span>Placeholder</span><span>Oxford button-down</span>`
// — which concatenated to "PPlaceholderOxford button-downwhite, 2". A gap is
// inserted only when the two would otherwise jam, so `<strong>x</strong>y` and
// anything already separated by whitespace are untouched. Two GENERIC
// containers side by side are separate FIELDS rather than one sentence, so they
// get an em dash; anything else gets a space.
function joinInline(children) {
  let out = '';
  let prevTag = null;
  for (const c of children) {
    const s = inline(c);
    if (!s) continue;
    if (out && prevTag && c.tag !== '#text' && !/\s$/.test(out) && !/^\s/.test(s)) {
      out += GENERIC.has(prevTag) && GENERIC.has(c.tag) ? ' — ' : ' ';
    }
    out += s;
    prevTag = c.tag === '#text' ? null : c.tag;
  }
  return out;
}

function inline(n) {
  if (n.tag === '#text') return decode(n.text).replace(/\s+/g, ' ');
  if (DROP.has(n.tag)) return '';
  // Explicitly decorative. A plain-text twin has the same audience a screen
  // reader does, so what is hidden from one is noise in the other — /own/'s
  // fake brand plates are single letters that read as "PPlaceholder".
  if (n.attrs && n.attrs['aria-hidden'] === 'true') return '';
  const kids = () => joinInline(n.children);
  switch (n.tag) {
    case 'br': return '\n';
    case 'img': {
      const src = n.attrs.src || '';
      return src ? `![${tidy(n.attrs.alt || '')}](${src})` : '';
    }
    case 'a': {
      const t = kids().trim();
      const href = n.attrs.href || '';
      return href && t ? `[${t}](${href})` : t;
    }
    case 'strong': case 'b': { const t = kids().trim(); return t ? `**${t}**` : ''; }
    case 'em': case 'i': { const t = kids().trim(); return t ? `*${t}*` : ''; }
    case 'code': { const t = kids().trim(); return t ? '`' + t + '`' : ''; }
    case 'del': case 's': { const t = kids().trim(); return t ? `~~${t}~~` : ''; }
    default: return kids();
  }
}

function renderList(n, ordered) {
  const lines = [];
  let i = 0;
  for (const li of n.children.filter((c) => c.tag === 'li')) {
    const body = renderChildren(li);
    if (!body) continue;
    const [first, ...rest] = body.split('\n');
    lines.push((ordered ? `${++i}. ` : '- ') + first);
    for (const r of rest) lines.push(r ? '  ' + r : '');
  }
  return lines.join('\n');
}

// ⚠️ A HEADER-LESS TABLE BECOMES A LIST, not a pipe table with a faked header
// row. /archives/ is the only table among the twelve — 26 tables of
// `<caption>YYYY</caption>` plus date/title rows and no <th> anywhere — and
// `- Aug 05 — [Title](/url/)` is what that actually means.
function renderTable(n) {
  const out = [];
  const cap = n.children.find((c) => c.tag === 'caption');
  if (cap) {
    const t = tidy(joinInline(cap.children)).replace(/^\*\*|\*\*$/g, '');
    if (t) out.push('### ' + t, '');   // blank line so the heading stands off its list
  }
  const rows = [];
  (function walk(x) {
    for (const c of x.children) {
      if (c.tag === 'tr') rows.push(c);
      else if (c.tag === 'thead' || c.tag === 'tbody' || c.tag === 'tfoot') walk(c);
    }
  })(n);
  const cells = (tr) =>
    tr.children.filter((c) => c.tag === 'td' || c.tag === 'th')
      .map((c) => tidy(joinInline(c.children)));
  if (rows.some((tr) => tr.children.some((c) => c.tag === 'th'))) {
    const head = cells(rows[0]);
    out.push('| ' + head.join(' | ') + ' |');
    out.push('|' + head.map(() => ' --- ').join('|') + '|');
    for (const r of rows.slice(1)) out.push('| ' + cells(r).join(' | ') + ' |');
  } else {
    for (const r of rows) {
      const c = cells(r).filter(Boolean);
      if (c.length) out.push('- ' + c.join(' — '));
    }
  }
  return out.join('\n');
}

function renderBlock(n) {
  if (DROP.has(n.tag)) return '';
  if (n.attrs && n.attrs['aria-hidden'] === 'true') return '';
  switch (n.tag) {
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
      const t = tidy(joinInline(n.children));
      return t ? '#'.repeat(Number(n.tag[1])) + ' ' + t : '';
    }
    case 'hr': return '---';
    case 'ul': return renderList(n, false);
    case 'ol': return renderList(n, true);
    case 'pre': return '```\n' + rawText(n).replace(/^\n+|\n+$/g, '') + '\n```';
    case 'blockquote': {
      const b = renderChildren(n);
      return b ? b.split('\n').map((l) => (l ? '> ' + l : '>')).join('\n') : '';
    }
    case 'table': return renderTable(n);
    default: return renderChildren(n);
  }
}

// Runs of inline content between block children become one paragraph each.
function renderChildren(n) {
  const out = [];
  let run = [];
  const flush = () => {
    const t = joinInline(run).replace(/[ \t]+/g, ' ').trim();
    run = [];
    if (t) out.push(t);
  };
  for (const c of n.children) {
    if (c.tag === '#text' || INLINE.has(c.tag)) { run.push(c); continue; }
    flush();
    const b = renderBlock(c);
    if (b) out.push(b);
  }
  flush();
  return out.join('\n\n');
}

const htmlToMarkdown = (html) =>
  renderChildren(parseHtml(html)).replace(/\n{3,}/g, '\n\n').trim();

// The article region of a built page. <article> when the layout wraps one —
// which is every page except /archives/, the lone `layout: default` page — and
// the whole of <main> otherwise. Both regexes are greedy on purpose: /hire/
// nests eight <article>s inside the outer one.
function renderedBody(url) {
  const file = join(SITE, url.replace(/^\//, ''), 'index.html');
  let html;
  try { html = readFileSync(file, 'utf8'); } catch { return null; }
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i);
  if (!main) return null;
  const art = main[1].match(/<article\b[^>]*>([\s\S]*)<\/article>/i);
  return art ? art[1] : main[1];
}

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
let converted = 0;
let leaked = 0;

for (const d of docs) {
  let src;
  try {
    src = readFileSync(d.path, 'utf8');
  } catch {
    console.warn('  skip (no source):', d.path);
    continue;
  }

  const fromHtml = d.path.endsWith('.html');
  let body;
  if (fromHtml) {
    const rendered = renderedBody(d.url);
    if (rendered === null) {
      console.warn('  no built HTML for', d.url, '— falling back to the source');
      body = stripLiquidComments(stripFrontMatter(src));
    } else {
      body = htmlToMarkdown(rendered);
      converted++;
      // ⚠️ THE GUARD IS THE POINT, not the conversion. This whole class of bug
      // was invisible for nine days because nothing ever looked at the output.
      // A page that grows markup the converter does not know about now says so
      // in the build log instead of shipping tags to a reader.
      if (/\{%|\{\{/.test(body) || /<(?:div|section|ul|ol|li|p|a|img|figure|table|h[1-6])\b/i.test(body)) {
        console.warn('  ⚠️ markup survived the conversion:', d.url);
        leaked++;
      }
    }
  } else {
    body = stripLiquidComments(stripFrontMatter(src));
  }
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
  `agent-markdown: wrote ${written} .md files (${pages.length} pages, ${posts.length} posts) + llms.txt` +
  `, ${converted} converted from built HTML` +
  (leaked ? `, ⚠️ ${leaked} with markup left in` : '')
);
