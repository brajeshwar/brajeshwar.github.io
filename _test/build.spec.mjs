// Build checks — read the built site as files, no browser. Each one encodes a
// rule from CLAUDE.md or a bug that already shipped once. See _docs/testing.md.

import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  SITE,
  assertSite,
  htmlFiles,
  read,
  exists,
  fileFor,
  redirectStubs,
  SITE_CSS,
  stylesheetPath,
} from './helpers.mjs';

test.beforeAll(assertSite);

const pages = () => htmlFiles();
const ownPages = () => pages().filter((p) => SITE_CSS.test(read(p)));

// ---- URLs (guardrail 2) ------------------------------------------------

test('every URL in _test/urls.txt still resolves', () => {
  const urls = readFileSync('_test/urls.txt', 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('/'));
  expect(urls.length).toBeGreaterThan(1000);
  const missing = urls.filter((u) => !exists(fileFor(u)));
  expect(missing, 'URLs that no longer build — restore them, or leave a _redirect/ stub').toEqual(
    []
  );
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
  for (const s of stubs)
    expect(from.has(s.redirect_to), `${s.file} → ${s.redirect_to}`).toBe(false);
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
    /^(CLAUDE|TODO|README|Makefile|Gemfile|package(-lock)?\.json|[a-z]+\.config\.m?js|node_modules|scripts|_test|_docs|_sass|\.)/i.test(
      n
    )
  );
  expect(leaked).toEqual([]);
});

test('no Sass source is published', () => {
  const walk = (d) =>
    readdirSync(`${SITE}${d}`, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]
    );
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

test('every page preloads the fonts the stylesheet uses', () => {
  // A preload on a name the CSS does not use is a wasted download, and one
  // without crossorigin is fetched twice. Either way the font misses
  // font-display: optional's window and the reader gets the fallback.
  const css = read(stylesheetPath());
  const faces = [...css.matchAll(/url\("?(\/assets\/fonts\/[^")]+\.woff2)/g)].map((m) => m[1]);
  expect(faces.length).toBe(2);
  const bad = [];
  for (const p of ownPages()) {
    const preloads = [...read(p).matchAll(/<link rel="preload"[^>]*>/g)].map((m) => m[0]);
    for (const face of faces) {
      const tag = preloads.find((t) => t.includes(`href="${face}"`));
      if (!tag || !/\bcrossorigin\b/.test(tag)) bad.push(`${p} ${face}`);
    }
  }
  expect(bad).toEqual([]);
  expect(faces.filter((f) => !exists(f))).toEqual([]);
});

test('every page applies the saved theme before first paint', () => {
  const bad = ownPages().filter((p) => {
    const html = read(p);
    const head = html.slice(0, html.indexOf('</head>'));
    const metas = head.match(/<meta name="color-scheme"/g) || [];
    const snippet = head.indexOf('d.dataset.theme=');
    const css = head.search(SITE_CSS);
    // One meta, the no-flash snippet present, it rewrites the meta, and it
    // runs before the stylesheet link. data-cfasync="false" keeps Rocket
    // Loader from running it after the page has painted.
    return (
      metas.length !== 1 ||
      snippet < 0 ||
      !/<script data-cfasync="false">[^<]*$/.test(head.slice(0, snippet)) ||
      css < snippet ||
      !head.includes("meta[name=color-scheme]').content=t")
    );
  });
  expect(bad).toEqual([]);
});

test('nothing sets a theme-color', () => {
  // Safari tints its toolbar from <meta name="theme-color">. Written by a
  // script after first paint, it recolored the toolbar on every page in Dark;
  // with none, Safari follows the page background from the start.
  const offenders = ownPages().filter((p) => read(p).includes('theme-color'));
  const scripts = readdirSync(`${SITE}/assets/scripts`).filter((f) =>
    read(`/assets/scripts/${f}`).includes('theme-color')
  );
  expect([...offenders, ...scripts]).toEqual([]);
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
          open = i + 1;
          rest = rest.slice(at + 2);
        } else {
          if (/^\s*\/\*/.test(rest) && rest === line)
            problems.push(`${f}:${i + 1} opens inside the comment from line ${open}`);
          const end = rest.indexOf('*/');
          if (end < 0) break;
          open = 0;
          rest = rest.slice(end + 2);
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
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const m of src.matchAll(
      /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^)]*\)/g
    )) {
      if (!ALLOWED.includes(`${f} ${m[0]}`)) found.push(`${f} ${m[0]}`);
    }
  }
  expect(found).toEqual([]);
});

test('no emoji in code, data, templates or docs', () => {
  // 2026-11-15: "remove any form of emoticons anywhere in code and UI." A
  // warning is [WARNING]. Typographic symbols that name a real glyph (the
  // external-link arrow, the footnote return, ©) are not emoji and stay.
  // Posts are content and are not scanned; albums.yaml is generated.
  const ALLOWED = new Set(['↗', '↔', '↩', '©', '®', '™', '→', '←']);
  const roots = [
    '_sass',
    'assets/scripts',
    'scripts',
    '_includes',
    '_layouts',
    '_data',
    '_pages',
    '_redirect',
    'misc',
    '_docs',
    '_test',
    'CLAUDE.md',
    'README.md',
    'Makefile',
    '_config.yml',
    '.github/workflows',
  ];
  const walk = (p) =>
    statSync(p).isDirectory()
      ? readdirSync(p).flatMap((n) => (n === 'site' || n === 'results' ? [] : walk(`${p}/${n}`)))
      : [p];
  const found = [];
  for (const f of roots.flatMap(walk)) {
    if (
      f.endsWith('albums.yaml') ||
      !/\.(scss|js|mjs|rb|sh|html|ya?ml|md|txt|json)$|Makefile$/.test(f)
    )
      continue;
    const hits = (readFileSync(f, 'utf8').match(/\p{Extended_Pictographic}/gu) || []).filter(
      (c) => !ALLOWED.has(c)
    );
    if (hits.length) found.push(`${f} ${[...new Set(hits)].join(' ')}`);
  }
  expect(found).toEqual([]);
});

// ---- One-off pages (_docs/misc.md) -------------------------------------

test('the South Bank walk keeps to its folder, and its list matches its model', () => {
  const dir = '/misc/london-southbank/';
  const html = read(dir + 'index.html');
  // Nothing of the site's, and nothing fetched from anywhere else: every
  // file the page names is in the folder beside it.
  expect(html).not.toContain('/assets/');
  // Day or night is settled before paint, so Rocket Loader must leave it be.
  expect(html).toContain('<script data-cfasync="false">\n// Day or night');
  const named = [...html.matchAll(/<(?:script|img|source)\b[^>]*?\s(?:src|srcset)="([^"]+)"/g)];
  expect(named.length).toBeGreaterThan(2);
  for (const [, file] of named) expect(exists(dir + file), file).toBe(true);
  for (const file of ['city.js', 'draw.js', 'city.json'])
    expect(exists(dir + file), file).toBe(true);
  // A stop is in two places, the list in the page and the model's data. One
  // without the other is a pin that goes nowhere or a stop with no pin.
  const city = JSON.parse(read(dir + 'city.json'));
  const modelled = city.stops.map((s) => s[0]).sort();
  const listed = [...html.matchAll(/<li id="([^"]+)" data-stop="\d+"/g)].map((m) => m[1]).sort();
  expect(listed).toEqual(modelled);
  // Every building has a color for its walls and one for its roof.
  for (const layer of [city.blocks, city.roofs]) {
    const count = (layer.parts || layer.base).length;
    expect(layer.wallColor.length).toBe(count);
    expect(layer.roofColor.length).toBe(count);
  }
  // Every tree has a surveyed height, or a 0 where the survey has none; and
  // the page credits the survey the heights came from.
  expect(city.treeTops.length).toBe(city.trees.length / 2);
  expect(html).toContain('Environment Agency');
  // Every landmark's name is said once, and stands somewhere on the board.
  const names = city.places.map((p) => p[0]);
  expect(names.length).toBeGreaterThan(40);
  expect(new Set(names).size).toBe(names.length);
  const lost = city.places.filter(
    ([, x, y]) => x < 0 || y < 0 || x > city.size[0] || y > city.size[1]
  );
  expect(lost).toEqual([]);
});

test('the Dubai Marina walk keeps to its folder, and its list matches its model', () => {
  const dir = '/misc/dubai-marina/';
  const html = read(dir + 'index.html');
  expect(html).not.toContain('/assets/');
  expect(html).toContain('<script data-cfasync="false">\n// Day or night');
  const named = [...html.matchAll(/<(?:script|img|source)\b[^>]*?\s(?:src|srcset)="([^"]+)"/g)];
  expect(named.length).toBeGreaterThan(2);
  for (const [, file] of named) expect(exists(dir + file), file).toBe(true);
  const city = JSON.parse(read(dir + 'city.json'));
  const modelled = city.stops.map((s) => s[0]).sort();
  const listed = [...html.matchAll(/<li id="([^"]+)" data-stop="\d+"/g)].map((m) => m[1]).sort();
  expect(listed).toEqual(modelled);
  expect(city.blocks.wallColor.length).toBe(city.blocks.parts.length);
  expect(city.blocks.roofColor.length).toBe(city.blocks.parts.length);
  // The reader stores positions as unsigned numbers, so a corner past the
  // board's edge wraps round and draws a sliver across the whole model.
  const [w, h] = city.size;
  for (const name of ['land', 'river', 'green', 'squares', 'piers', 'decks', 'legs', 'blocks']) {
    let x = 0;
    let y = 0;
    let off = 0;
    const xy = city[name].xy;
    for (let i = 0; i < xy.length; i += 2) {
      x += xy[i];
      y += xy[i + 1];
      if (x < 0 || y < 0 || x > w || y > h) off++;
    }
    expect(off, name).toBe(0);
  }
  // The script that made the data is kept, beside the site's others.
  expect(statSync('scripts/dubai-marina-city.mjs').isFile()).toBe(true);
});

test('the one-off pages say when they were last updated, and it is not older', () => {
  // The date in each foot is written by hand, so it is held to the last
  // commit of the live page's own files; the kept versions beside it do not
  // count. A shallow checkout (CI) has no history to ask, and skips this.
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  test.skip(git('rev-parse', '--is-shallow-repository') === 'true', 'no history');
  for (const folder of ['london-southbank', 'dubai-marina']) {
    const html = read(`/misc/${folder}/index.html`);
    const stated = html.match(/Last updated <time datetime="(\d{4}-\d{2}-\d{2})">/)?.[1];
    expect(stated, folder).toBeTruthy();
    const live = ['index.html', 'walk.js', 'city.js', 'draw.js', 'city.json'];
    const committed = git(
      'log',
      '-1',
      '--format=%cs',
      '--',
      ...live.map((f) => `misc/${folder}/${f}`)
    );
    expect(stated >= committed, `${folder}: ${stated} is older than ${committed}`).toBe(true);
  }
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
    for (const [script, needs] of gates)
      if (script.test(html) && !needs(html)) bad.push(`${p} ${script.source}`);
  }
  expect(bad).toEqual([]);
});

test('the search index is built', () => {
  expect(exists('/pagefind/pagefind.js')).toBe(true);
});
