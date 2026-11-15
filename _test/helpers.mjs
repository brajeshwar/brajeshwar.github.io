// Shared by the specs and update-urls.mjs. Plain Node, no dependencies.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// The build under test. `make test` points this at _test/site, a production-
// parity build of its own; CI points it at _site, which IS the artifact that
// deploys. Never the _site a `jekyll serve --future` is writing into.
export const SITE = process.env.SITE || '_site';

export function assertSite() {
  if (!existsSync(join(SITE, 'index.html'))) {
    throw new Error(`No build at ${SITE}/ — run \`make test\`, which builds one first.`);
  }
}

// Every built HTML file, as a site path ('/about/index.html'). Pagefind's own
// UI fragments are not pages of ours.
export function htmlFiles() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (p !== join(SITE, 'pagefind')) walk(p);
      } else if (name.endsWith('.html')) {
        out.push('/' + relative(SITE, p).split(sep).join('/'));
      }
    }
  };
  walk(SITE);
  return out.sort();
}

export const read = (sitePath) => readFileSync(join(SITE, sitePath), 'utf8');
export const exists = (sitePath) => existsSync(join(SITE, sitePath));

// A URL path ('/about/') to the file a static host serves for it.
export function fileFor(url) {
  return url.endsWith('/') ? url + 'index.html' : url;
}

// The redirect stubs, read from their source so a new one is covered the day
// it is added: [{ file, permalink, redirect_to }].
export function redirectStubs() {
  return readdirSync('_redirect')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(join('_redirect', f), 'utf8').split('---')[1] || '';
      const get = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim();
      return { file: f, permalink: get('permalink'), redirect_to: get('redirect_to') };
    });
}

// The stylesheet link is what marks a page as one of the site's own layouts
// (redirect stubs and the 2005 backup pages under /backups/ have none).
// Hashed in CI (site.2e1471f0.css), plain locally — match both.
export const SITE_CSS = /\/assets\/styles\/site(?:\.[0-9a-f]{8})?\.css/;

export function stylesheetPath() {
  const m = read('/index.html').match(SITE_CSS);
  if (!m) throw new Error('index.html links no site stylesheet');
  return m[0];
}
