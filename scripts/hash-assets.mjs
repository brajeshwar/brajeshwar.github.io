#!/usr/bin/env node
/**
 * hash-assets.mjs — content-hash the long-cached assets and rewrite every
 * reference to them. Runs against _site/ after Jekyll, after esbuild.
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
 * the CSS, JS and fonts they already have, for up to a year, no matter what
 * we deploy. Renaming the file on every content change is the only thing that
 * reaches them, because a new URL is the one thing a cache cannot satisfy.
 *
 * WHY A HASH AND NOT `?v=<published-date>`
 *
 * (Brajeshwar asked, 2026-07-27.) Same goal, and the query string is the older
 * way of doing it, but it loses on both counts:
 *
 *   - A DATE BUSTS WHEN NOTHING CHANGED. This site rebuilds on a daily cron,
 *     so `?v=2026-07-28` would hand every returning reader a new URL every
 *     single day and re-download byte-identical CSS ~365 times a year. A
 *     content hash changes only when the bytes change, which is a handful of
 *     times a year. The date answers "when did we build", and the question is
 *     "did this file change".
 *   - SOME CACHES IGNORE QUERY STRINGS. A hashed filename is a genuinely
 *     different resource to every cache, proxy and browser there is; a query
 *     string is a hint that intermediaries are free to disregard, and
 *     Cloudflare has a cache level ("Ignore Query String") that does exactly
 *     that. The bust would silently stop working and nothing would look wrong.
 *
 * WHAT IT DOES, IN TWO PASSES
 *
 * The order matters, because CSS references fonts and HTML references CSS.
 * Hash the leaves first, rewrite their referrers, then hash the referrers —
 * otherwise the CSS hash would describe content that is about to change.
 *
 *   Pass 1  assets/fonts/**.woff2  ->  <name>.<hash>.woff2
 *           ...and rewrite those URLs inside the built CSS.
 *   Pass 2  assets/styles/site.css ->  site.<hash>.css
 *           assets/print.css       ->  print.<hash>.css
 *           assets/scripts/*.js    ->  <name>.<hash>.js
 *           ...and rewrite those URLs inside every built .html.
 *
 * ⚠️ MUST RUN AFTER THE ESBUILD MINIFY STEP, or the hash names bytes that are
 * not the bytes we ship, and the next build — same source, differently
 * minified — would not bust the cache.
 *
 * The JavaScript needed this as much as the CSS: every fix shipped to
 * assets/scripts/ since the move to this host could take a year to reach a
 * returning reader. Inlined CSS was accidentally immune, riding along with
 * max-age=600 HTML; externalising it on 2026-07-27 made the problem
 * load-bearing, and fixing it fixed the scripts and fonts too.
 *
 * Local `jekyll serve` never runs this, and neither does the Cloudflare Pages
 * backup. Both stay on the unhashed paths, internally consistent, and work
 * unchanged — this step renames files and their references together.
 *
 * Matching is on the path WITHOUT a leading slash ("assets/styles/site.css"),
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

/** site-relative, forward slashes, no leading slash */
const rel = (p) => path.relative(SITE, p).split(path.sep).join('/');

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
  return [rel(abs), rel(hashed)];
}

/**
 * Replace every [from, to] in every file, literally. Returns a Map of
 * from -> replacement count, and the number of files touched.
 */
async function rewrite(files, renames) {
  /* Longest path first. Guards against one target being a prefix of another —
     "assets/scripts/search.js" would otherwise also match inside a
     hypothetical "assets/scripts/search.js.map" and corrupt it. */
  const ordered = [...renames].sort((a, b) => b[0].length - a[0].length);
  const hits = new Map(ordered.map(([from]) => [from, 0]));
  let touched = 0;

  await Promise.all(
    files.map(async (file) => {
      const before = await readFile(file, 'utf8');
      let after = before;
      for (const [from, to] of ordered) {
        // split/join rather than a regex: paths contain "." and "/", and this
        // needs to be a literal substring match with no escaping to get wrong
        const parts = after.split(from);
        if (parts.length > 1) {
          hits.set(from, hits.get(from) + parts.length - 1);
          after = parts.join(to);
        }
      }
      if (after !== before) {
        await writeFile(file, after);
        touched++;
      }
    })
  );
  return { hits, touched };
}

const report = (label, hits, renames) => {
  for (const [from, to] of renames) {
    console.log(`  ${String(hits.get(from)).padStart(5)}x  ${from}  ->  ${path.basename(to)}`);
  }
};

// ---------------------------------------------------------------------------
// PASS 1 — fonts, referenced from inside the CSS.
// ---------------------------------------------------------------------------

const sheets = await walk(path.join(SITE, 'assets'), (f) => f.endsWith('.css'));

/* Only hash a font something actually points at. Renaming an unreferenced one
   would move it to a URL nobody links to, which is not wrong but is not useful
   either — and it would then trip the orphan check below for no reason. The
   .ttf source is already excluded from the build in _config.yml; this also
   quietly skips anything else that happens to be sitting in the fonts tree. */
const cssBlob = (await Promise.all(sheets.map((f) => readFile(f, 'utf8')))).join('\n');
const allFonts = await walk(path.join(SITE, 'assets/fonts'), (f) => /\.(woff2?|ttf|otf)$/i.test(f));
const usedFonts = allFonts.filter((f) => cssBlob.includes(rel(f)));
const skippedFonts = allFonts.filter((f) => !usedFonts.includes(f));

const fontRenames = (await Promise.all(usedFonts.map(hashOne))).filter(Boolean);

if (fontRenames.length) {
  const { hits, touched } = await rewrite(sheets, fontRenames);
  console.log(`hash-assets: pass 1 — ${fontRenames.length} fonts, rewritten across ${touched} of ${sheets.length} stylesheets`);
  report('font', hits, fontRenames);
}
for (const f of skippedFonts) console.log(`         --  ${rel(f)}  (not referenced by any CSS, left alone)`);

// ---------------------------------------------------------------------------
// PASS 2 — stylesheets and scripts, referenced from the HTML.
// Hashed AFTER pass 1 so their hashes cover the rewritten font URLs.
// ---------------------------------------------------------------------------

const targets = [
  ...sheets,
  ...(await walk(path.join(SITE, 'assets/scripts'), (f) => f.endsWith('.js'))),
];

const renames = (await Promise.all(targets.map(hashOne))).filter(Boolean);

if (renames.length === 0) {
  console.error('hash-assets: found nothing to hash under _site/assets — is this running after `jekyll build`?');
  process.exit(1);
}

const pages = await walk(SITE, (f) => f.endsWith('.html'));
const { hits, touched } = await rewrite(pages, renames);

const total = [...hits.values()].reduce((a, b) => a + b, 0);
console.log(`hash-assets: pass 2 — ${renames.length} assets, ${total} references rewritten across ${touched} of ${pages.length} pages`);
report('asset', hits, renames);

/* A hashed asset that nothing links to is now unreachable — the old URL 404s
   and no page points at the new one. That is either a dead file or, worse, a
   rewrite that silently missed, and it should fail the build rather than
   deploy a page with no stylesheet.

   site.css and print.css are on every page via _layouts/default.html. The
   scripts are conditional by design — sidenotes.js and anchors.js only ship
   where the page has footnotes or headings — but each is still on hundreds of
   pages, so zero always means something is wrong. */
const orphans = renames.filter(([from]) => hits.get(from) === 0);
if (orphans.length) {
  console.error('hash-assets: FAILED — these were hashed but nothing references them:');
  for (const [from] of orphans) console.error(`  ${from}`);
  process.exit(1);
}
