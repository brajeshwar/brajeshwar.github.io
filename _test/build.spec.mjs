// Build checks — read the built site as files, no browser. Each one encodes a
// rule from CLAUDE.md or a bug that already shipped once. See _docs/testing.md.

import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import {
  SITE, assertSite, htmlFiles, read, exists, fileFor,
  redirectStubs, SITE_CSS, stylesheetPath,
} from './helpers.mjs';

test.beforeAll(assertSite);

const pages = () => htmlFiles();
const ownPages = () => pages().filter((p) => SITE_CSS.test(read(p)));

// ---- URLs (guardrail 2) ------------------------------------------------

test('every URL in _test/urls.txt still resolves', () => {
  const urls = readFileSync('_test/urls.txt', 'utf8')
    .split('\n').filter((l) => l.startsWith('/'));
  expect(urls.length).toBeGreaterThan(1000);
  const missing = urls.filter((u) => !exists(fileFor(u)));
  expect(missing, 'URLs that no longer build — restore them, or leave a _redirect/ stub').toEqual([]);
});

test('every redirect stub refreshes to its target', () => {
  const stubs = redirectStubs();
  expect(stubs.length).toBeGreaterThan(0);
  for (const s of stubs) {
    const html = read(fileFor(s.permalink));
    expect(html, s.file).toContain(`<meta http-equiv="refresh" content="0; url=${s.redirect_to}">`);
    expect(html, s.file).toContain('noindex');
  }
});

test('no stub redirects to another stub', () => {
  // Chained meta-refreshes are slow and some crawlers stop following them.
  const stubs = redirectStubs();
  const from = new Set(stubs.map((s) => s.permalink));
  for (const s of stubs) expect(from.has(s.redirect_to), `${s.file} → ${s.redirect_to}`).toBe(false);
});

// ---- What must not publish ---------------------------------------------

test('2099 drafts are not published', () => {
  // The date is the only thing holding a draft back (_posts/todo/ is just a
  // folder). A `jekyll serve --future` builds them; a deploy must not.
  expect(exists('/2099')).toBe(false);
  expect(read('/sitemap.xml')).not.toContain('/2099/');
});

test('no private or tooling file is published', () => {
  const top = readdirSync(SITE);
  const leaked = top.filter((n) =>
    /^(CLAUDE|TODO|README|Makefile|Gemfile|package(-lock)?\.json|node_modules|scripts|_test|_docs|_sass|\.)/i.test(n));
  expect(leaked).toEqual([]);
});

test('no Sass source is published', () => {
  const walk = (d) => readdirSync(`${SITE}${d}`, { withFileTypes: true })
    .flatMap((e) => e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]);
  expect(walk('/assets').filter((f) => f.endsWith('.scss'))).toEqual([]);
});

// ---- The theme (the dark-mode flash, 2026-11-15) -------------------------

test('an explicit mode pins color-scheme in the stylesheet', () => {
  // `light dark` alone follows the OS, so Dark on a light OS kept a white
  // browser canvas and every navigation flashed white.
  const css = read(stylesheetPath());
  expect(css).toMatch(/:root\[data-theme="?dark"?\]\{color-scheme:dark\}/);
  expect(css).toMatch(/:root\[data-theme="?light"?\]\{color-scheme:light\}/);
});

test('every page applies the saved theme before first paint', () => {
  const bad = ownPages().filter((p) => {
    const html = read(p);
    const head = html.slice(0, html.indexOf('</head>'));
    const metas = head.match(/<meta name="color-scheme"/g) || [];
    const snippet = head.indexOf('d.dataset.theme=');
    const css = head.search(SITE_CSS);
    // One meta, the no-flash snippet present, it rewrites the meta, and it
    // runs before the stylesheet link.
    return metas.length !== 1 || snippet < 0 || css < snippet
      || !head.includes("meta[name=color-scheme]').content=t");
  });
  expect(bad).toEqual([]);
});

// ---- CSS hygiene (CLAUDE.md "Project shape") ---------------------------

test('the built stylesheet carries no bang comment', () => {
  // `/*!` survives compression and ships to every reader.
  expect(read(stylesheetPath())).not.toContain('/*!');
});

test('no Sass block comment is left unterminated', () => {
  // An unclosed comment is valid CSS: it silently eats every rule up to the
  // next star-slash. That took margin and max-width off `.timeline h2` on
  // 2026-08-09 with a green build. The tell is a new comment opening on its
  // own line while one is still open.
  const problems = [];
  for (const f of readdirSync('_sass').filter((n) => n.endsWith('.scss'))) {
    const lines = readFileSync(`_sass/${f}`, 'utf8').split('\n');
    let open = 0;
    lines.forEach((line, i) => {
      let rest = line;
      // A Sass line comment, but not the // in a URL (https://…).
      if (!open) rest = rest.replace(/(^|\s)\/\/.*$/, '$1');
      while (rest.length) {
        if (!open) {
          const at = rest.indexOf('/*');
          if (at < 0) break;
          open = i + 1; rest = rest.slice(at + 2);
        } else {
          if (/^\s*\/\*/.test(rest) && rest === line) problems.push(`${f}:${i + 1} opens inside the comment from line ${open}`);
          const end = rest.indexOf('*/');
          if (end < 0) break;
          open = 0; rest = rest.slice(end + 2);
        }
      }
    });
    if (open) problems.push(`${f}:${open} is never closed`);
  }
  expect(problems).toEqual([]);
});

test('no hardcoded colors outside themes.scss', () => {
  // All themeable values are custom properties. The exceptions are not
  // themeable by design: the .media-badge scrim sits on a photograph, whose
  // brightness no theme knows (see home.scss).
  const ALLOWED = ['home.scss oklch(97% 0 0)', 'home.scss oklch(12% 0 0 / 0.66)'];
  const found = [];
  for (const f of readdirSync('_sass').filter((n) => n.endsWith('.scss') && n !== 'themes.scss')) {
    const src = readFileSync(`_sass/${f}`, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^)]*\)/g)) {
      if (!ALLOWED.includes(`${f} ${m[0]}`)) found.push(`${f} ${m[0]}`);
    }
  }
  expect(found).toEqual([]);
});

// ---- Pages and assets --------------------------------------------------

test('every page has a title and a language', () => {
  const bad = ownPages().filter((p) => {
    const html = read(p);
    return !/<html lang="[a-z]/.test(html) || !/<title>\s*\S[^<]*<\/title>/.test(html);
  });
  expect(bad).toEqual([]);
});

test('every page has an <h1>', () => {
  // Layouts emit it, guarded so pages that write their own do not get two.
  expect(ownPages().filter((p) => !read(p).includes('<h1'))).toEqual([]);
});

test('every /assets/ reference resolves', () => {
  // The template's own files. Hash renaming rewrites these, so a miss here is
  // a broken stylesheet or script on every page.
  const refs = new Set();
  for (const p of ownPages()) {
    for (const m of read(p).matchAll(/(?:src|href)="(\/assets\/[^"#?]+)/g)) refs.add(m[1]);
  }
  expect(refs.size).toBeGreaterThan(5);
  expect([...refs].filter((r) => !exists(r))).toEqual([]);
});

test('page-specific scripts load only where they have work', () => {
  // The Liquid gates in the layouts. A gate written as `assign … contains`
  // fails silently and truthily and ships the script everywhere.
  const gates = [
    [/sidenotes(?:\.[0-9a-f]{8})?\.js/, (h) => h.includes('class="footnotes"')],
    [/anchors(?:\.[0-9a-f]{8})?\.js/, (h) => /<h[2-6]/.test(h)],
    [/strip-nav(?:\.[0-9a-f]{8})?\.js/, (h) => h.includes('class="strip__viewport"')],
  ];
  const bad = [];
  for (const p of ownPages()) {
    const html = read(p);
    for (const [script, needs] of gates) if (script.test(html) && !needs(html)) bad.push(`${p} ${script.source}`);
  }
  expect(bad).toEqual([]);
});

test('the search index is built', () => {
  expect(exists('/pagefind/pagefind.js')).toBe(true);
});
