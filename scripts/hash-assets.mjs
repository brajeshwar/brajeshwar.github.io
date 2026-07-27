#!/usr/bin/env node
/**
 * hash-assets.mjs — content-hash the long-cached assets and rewrite the
 * references to them. Runs against _site/ after Jekyll, after esbuild.
 *
 * WHY THIS EXISTS
 *
 * Every file under /assets/ is served with a one-year cache:
 *
 *     $ curl -sSI https://brajeshwar.com/assets/print.css
 *     cache-control: max-age=31536000
 *
 * There is no _headers file; that is simply what the host serves. `max-age`
 * that long means the browser does not re-request and does not even
 * revalidate — it uses its copy. So a reader who has been here before keeps
 * the CSS and JS they already have, for up to a year, no matter what we
 * deploy. Renaming the file on every content change is the only thing that
 * reaches them, because a new URL is the one thing a cache cannot satisfy.
 *
 * This was already true of the JavaScript before the CSS moved out of the
 * page (2026-07-27) — every fix shipped to assets/scripts/ since the site
 * moved to this host could take a year to arrive for a returning reader.
 * Inlined CSS was accidentally immune, since it rode along with the HTML at
 * max-age=600. Externalising it made the problem load-bearing, and fixing it
 * fixes the scripts too.
 *
 * WHAT IT DOES
 *
 *   assets/styles/site.css  ->  assets/styles/site.<hash>.css
 *   assets/print.css        ->  assets/print.<hash>.css
 *   assets/scripts/*.js     ->  assets/scripts/<name>.<hash>.js
 *
 * then rewrites those paths in every built .html file.
 *
 * ORDER MATTERS: this must run AFTER the esbuild minify step, or the hash
 * describes bytes that are not the bytes we ship, and the next build — same
 * source, differently minified — would not bust the cache.
 *
 * Local `jekyll serve` never runs this. The unhashed paths are what the
 * layouts emit, so development just works and nothing needs a dev branch.
 *
 * The match is on the path WITHOUT a leading slash ("assets/styles/site.css"),
 * so it survives the `--baseurl` the deploy workflow passes: a prefixed
 * "/some-base/assets/..." still contains the substring and is rewritten in
 * place, prefix untouched.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, rename, readdir } from 'node:fs/promises';
import path from 'node:path';

/* Destination defaults to _site and can be overridden:  node scripts/hash-assets.mjs <dir>
   Not for the deploy, which uses the default — it is so this can be tested
   against a throwaway build. Running it on _site while `jekyll serve --watch`
   is up appears to fail: the rename succeeds, the watcher rebuilds a second
   later, and the unhashed files are back as though nothing happened. */
const SITE = process.argv[2] || '_site';
const HASH_LEN = 8; // 8 hex chars = 32 bits; collision risk is nil at this scale

/** Every file under dir matching a predicate, recursively. */
async function walk(dir, keep, found = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found; // directory absent — nothing to do
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, keep, found);
    else if (keep(full)) found.push(full);
  }
  return found;
}

/** Rename one asset to include a hash of its bytes. Returns [oldRel, newRel]. */
async function hashOne(abs) {
  let bytes;
  try {
    bytes = await readFile(abs);
  } catch {
    return null; // not built this run (e.g. run twice) — skip quietly
  }
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, HASH_LEN);
  const ext = path.extname(abs);
  const hashed = `${abs.slice(0, -ext.length)}.${hash}${ext}`;
  await rename(abs, hashed);
  // site-relative, no leading slash — see the note on --baseurl above
  const rel = (p) => path.relative(SITE, p).split(path.sep).join('/');
  return [rel(abs), rel(hashed)];
}

const targets = [
  path.join(SITE, 'assets/styles/site.css'),
  path.join(SITE, 'assets/print.css'),
  ...(await walk(path.join(SITE, 'assets/scripts'), (f) => f.endsWith('.js'))),
];

const renames = (await Promise.all(targets.map(hashOne))).filter(Boolean);

if (renames.length === 0) {
  console.error('hash-assets: found nothing to hash under _site/assets — is this running after `jekyll build`?');
  process.exit(1);
}

/* Longest path first. Guards against one target being a prefix of another —
   "assets/scripts/search.js" would otherwise also match inside a
   hypothetical "assets/scripts/search.js.map" and corrupt it. */
renames.sort((a, b) => b[0].length - a[0].length);

const pages = await walk(SITE, (f) => f.endsWith('.html'));
const hits = new Map(renames.map(([from]) => [from, 0]));
let rewritten = 0;

await Promise.all(
  pages.map(async (page) => {
    const before = await readFile(page, 'utf8');
    let after = before;
    for (const [from, to] of renames) {
      // split/join rather than a regex: paths contain "." and "/", and this
      // needs to be a literal substring match with no escaping to get wrong
      const parts = after.split(from);
      if (parts.length > 1) {
        hits.set(from, hits.get(from) + parts.length - 1);
        after = parts.join(to);
      }
    }
    if (after !== before) {
      await writeFile(page, after);
      rewritten++;
    }
  })
);

const total = [...hits.values()].reduce((a, b) => a + b, 0);
console.log(`hash-assets: hashed ${renames.length} assets, rewrote ${total} references across ${rewritten} of ${pages.length} pages`);
for (const [from, to] of renames) {
  console.log(`  ${String(hits.get(from)).padStart(5)}x  ${from}  ->  ${path.basename(to)}`);
}

/* A hashed asset that nothing links to is now unreachable — the old URL 404s
   and no page points at the new one. That is either a dead file or, worse, a
   rewrite that silently missed, and it should fail the build rather than
   deploy a page with no stylesheet.

   site.css and print.css are on every page via _layouts/default.html.
   The scripts are conditional by design — sidenotes.js and anchors.js only
   ship where the page has footnotes or headings — but each is still on
   hundreds of pages, so zero always means something is wrong. */
const orphans = renames.filter(([from]) => hits.get(from) === 0);
if (orphans.length) {
  console.error('hash-assets: FAILED — these were hashed but nothing references them:');
  for (const [from] of orphans) console.error(`  ${from}`);
  process.exit(1);
}
