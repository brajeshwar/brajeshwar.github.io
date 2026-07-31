# JavaScript — the policy

Brajeshwar, 2026-07-27:

> For JavaScript, absolutely no frameworks. But we are OK with raw JavaScript for each
> function and concatenate+minified on publish. We will use it sparingly only where it is
> needed. Of course, pages should still work without JavaScript. JS is the beauty on top of
> the content that already works on its own.

## The rules

1. No frameworks, ever. No React, no Alpine, no jQuery, no build-time framework. Raw browser
   JavaScript only.
2. One file per function. Each behavior is its own small script, readable on its own; don't
   grow a `main.js`.
3. Sparingly. Reach for CSS first. The `/about/` filter is the worked example: three states,
   zero JavaScript, because `:has()` and `:checked` already do it.
4. The page works without it. This is not aspiration, it is the acceptance test. JS is *"the
   beauty on top of the content that already works on its own"*, an enhancement layer and
   never a dependency. Same as CLAUDE.md guardrail 4.
5. Minify on publish. Ship minified, keep the sources readable. Built 2026-07-27; see below.
   Concatenation was considered and deliberately not done.

## What exists today

| Script | Raw | Loaded on |
|---|---:|---|
| `appearance.js` | 8.2 KB | every page (theme/font/accent panel) |
| `sidenotes.js` | 11.4 KB | **87 pages** — only where footnotes exist (2026-07-27) |
| `search.js` | 3.8 KB | every page (⌘K palette, and `/`) |
| `pagefind-custom.js` | 4.4 KB | `/search/` |
| `pagefind-autofocus.js` | 0.4 KB | `/search/` |
| `anchors.js` | 1.4 KB | **453 posts** — only where an `h2`+ exists (2026-07-27) |
| `timeline.js` | 2.3 KB | `/about/` |
| `random.js` | 1.8 KB | `/random/` only (2026-07-27) |
| `back-to-top.js` | 3.5 KB | every page, but **self-limiting** — returns immediately unless the page is >2.5 viewports tall, so a short page pays a parse and nothing else. Its only job is a show/hide threshold; the float-then-settle is CSS `position: sticky` ([`styles.md`](styles.md) §6) |

All eight together are ~35.5 KB raw (re-measured 2026-07-27), but 15.2 KB as shipped since
2026-07-27; the table is source size. Each is a separate request, and no page loads all of
them.

Since 2026-07-27, scripts load only where there is work to do. `sidenotes.js` is the largest
script on the site, and only 85 of 1,456 posts have footnotes; on every other page it loaded,
ran, found nothing, and returned. Both it and `anchors.js` are now gated on the rendered
content:

    {% if content contains 'class="footnotes"' %}…{% endif %}

⚠️ **The test must be inline in the `if`.** Liquid's `assign` does not evaluate `contains`;
it fails silently *and truthily*, so hoisting it to a variable ships the script everywhere
while reading as correct. Same trap as `page.html` and the old conditional `code.css`.

A typical post now fetches three scripts instead of five, a saving of 2,189 bytes gzipped.
For four days it also made no cross-origin request at all, the analytics beacon having been
removed the same day; that beacon was restored 2026-07-31, so the DNS lookup and TLS
handshake are back and the script-count saving stands on its own.

⚠️ **Scripts are content-hashed on publish** (`scripts/hash-assets.mjs`). `/assets/*` is
served `max-age=31536000`, so before this every JS fix could take a year to reach a returning
reader. See [`hosting.md`](hosting.md) → *Cache headers we actually get*.

## Random post (built 2026-07-27)

A circle in the middle of the prev/next bar goes to `/random/`, which sends the reader to a
random post. It is self-contained by request — Brajeshwar: *"A standalone independent module
that I can carry with my website and not worry about CloudFlare or others."* One page, one
small script, nothing outside the repo. A Cloudflare Worker was the alternative and was
rejected on exactly that ground.

The index is inlined into `/random/`, not fetched from `/assets/`, and that is the whole
design decision. An index under `/assets/` would inherit `max-age=31536000` and freeze for a
year: posts written afterwards would silently never appear in the pool, and nothing would
look broken. Hashing the filename fixes it, but then the script needs the hashed name, which
has to come from the HTML anyway. Since `/random/` is the only page that wants the index, it
carries it. The HTML is `max-age=600`, so a new post is in the pool within ten minutes of a
deploy, with no extra request and no second cache to reason about.

The index costs ~62 KB raw / ~23 KB gzipped of URLs, paid only by someone who clicked Random.
Measured: packing them more cleverly (dropping slashes, grouping by year) saves ~1.5 KB
gzipped, because gzip already eats the repetition — not worth JS that reassembles URLs. The
URLs are pipe-separated rather than newline-separated, so the Liquid loop needs no
whitespace-control gymnastics.

The script uses `location.replace`, not `.href`, so Back from the post you land on returns to
where you clicked Random instead of bouncing you forward through `/random/` again. It never
returns you to the post you came from, checked via `document.referrer`; the odds are 1 in
1,456, but that once reads as a broken button rather than a coincidence. Verified: 0
self-hits in 20,000 draws, 1,455 distinct landings out of 1,455 possible. With JS off, the
page shows a real link to a post picked at *build* time (Liquid has no random filter, so the
seed is `site.time | date: '%s' | modulo: site.posts.size`), and the daily cron rotates it on
its own. This is deliberately not a `<meta http-equiv="refresh">`: an auto-redirect with no
JS to replace the history entry traps the Back button. The page is `noindex, follow` with
`sitemap: false` and `data-pagefind-ignore` — it is a doorway, not a destination, and its
content changes every build.

Every one degrades cleanly. With JS off you get real footnotes instead of sidenotes, the
default theme instead of a remembered one, `/search/` instead of the ⌘K palette, no `§`
anchors, the timeline unfiltered (which is its default view anyway), and no Back to Top
control, which costs nothing since scrolling up is always possible.

## Minify on publish — BUILT 2026-07-27

`npx esbuild _site/assets/scripts/*.js --minify --outdir=_site/assets/scripts --allow-overwrite`,
run in the Actions workflow after `jekyll build`, and in `make build` so local
production-parity matches CI. The result: 36.7 KB → 15.2 KB raw, and 13.9 KB → 6.6 KB
gzipped. A 59% cut raw, 52% gzipped.

### In place, and that is the whole design

The step rewrites the files in `_site`; it changes no HTML. Every page still loads
`/assets/scripts/<name>.js`, exactly as before. That matters because two other environments
never run this step: local `jekyll serve`, where you get the readable originals — which is
what you want while working — and the Cloudflare Pages backup, whose build command is set
dashboard-side and is deliberately left alone (see [`hosting.md`](hosting.md)), so it keeps
serving the unminified files. Both work, unchanged. Pointing the layout at bundle files that
only CI produces would have left both of them with no JavaScript at all: a silent, total
failure of the enhancement layer on the standby host, discovered only when it was needed.

### Concatenation: considered, not done

The earlier plan was per-page-type bundles, rejected for now. It requires the layout to
reference bundle names, which is exactly the coupling the in-place design avoids, and which
breaks both environments above. The gain was always in minification, not in merging: under
HTTP/2 the request count is not what costs, the bytes are, and those are now down 52% gzipped
without touching a reference. And one bundle for everything is a regression regardless, since
`sidenotes.js` (4.7 KB minified) is posts-only and `pagefind-custom.js` is `/search/`-only,
so a single bundle would put ~15 KB on a homepage that needs about 7 KB of it.

If concatenation is ever wanted, the shape is bundle-per-layout mirroring the CSS
([`styles.md`](styles.md) §5), and it needs a plan for the two non-CI environments first.

### Sources stay readable

These files carry a lot of explanatory comment and it all survives; minification touches only
the shipped copy. Verified after the change: `back-to-top.js` in `_site` starts
`(function(){"use strict";var l=2.5…` while the source is untouched.

The build was verified on a real minified copy, not by trusting the byte count: sidenotes
placed (4), anchors built (10), Back to Top inserted, the appearance panel built with its
pills, the search palette present, and zero console errors.

### It adds a build dependency

esbuild in the workflow. That is a build tool, not a runtime framework, so it does not break
"no frameworks" — and CLAUDE.md guardrail 6 was amended on 2026-07-27 to permit exactly this
and nothing more.

## Related

- CLAUDE.md guardrail 4 (progressive enhancement) and 6 (vanilla only).
- [`design.md`](design.md) → *Performance budget* — "only the JS a page needs".
- [`timeline.md`](timeline.md) — the CSS-only filter, as the example of rule 3.
