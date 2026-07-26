# JavaScript — the policy

Brajeshwar, 2026-07-27:

> For JavaScript, absolutely no frameworks. But we are OK with raw JavaScript for each
> function and concatenate+minified on publish. We will use it sparingly only where it is
> needed. Of course, pages should still work without JavaScript. JS is the beauty on top of
> the content that already works on its own.

## The rules

1. **No frameworks. Ever.** No React, no Alpine, no jQuery, no build-time framework. Raw
   browser JavaScript only.
2. **One file per function.** Each behaviour is its own small script, readable on its own.
   Don't grow a `main.js`.
3. **Sparingly.** Reach for CSS first. The `/about/` filter is the worked example: three
   states, zero JavaScript, because `:has()` and `:checked` already do it.
4. **The page works without it.** This is not aspiration, it is the acceptance test. JS is
   *"the beauty on top of the content that already works on its own"* — an enhancement layer,
   never a dependency. Same as CLAUDE.md guardrail 4.
5. **Minify on publish.** Ship minified, keep the sources readable. **Built 2026-07-27** —
   see below. Concatenation was considered and deliberately not done.

## What exists today

| Script | Raw | Loaded on |
|---|---:|---|
| `appearance.js` | 8.2 KB | every page (theme/font/accent panel) |
| `sidenotes.js` | 11.4 KB | posts |
| `search.js` | 3.8 KB | every page (⌘K palette) |
| `pagefind-custom.js` | 4.4 KB | `/search/` |
| `pagefind-autofocus.js` | 0.4 KB | `/search/` |
| `anchors.js` | 1.4 KB | posts, `/about/` |
| `timeline.js` | 2.3 KB | `/about/` |
| `back-to-top.js` | 3.5 KB | every page, but **self-limiting** — returns immediately unless the page is >2.5 viewports tall, so a short page pays a parse and nothing else. Its only job is a show/hide threshold; the float-then-settle is CSS `position: sticky` ([`styles.md`](styles.md) §6) |

**~35.5 KB raw across all eight** (re-measured 2026-07-27) — but **15.2 KB as shipped**, since
2026-07-27; the table is source size. Each is a separate request, and no page loads all of them.

Every one degrades cleanly: with JS off you get real footnotes instead of sidenotes, the
default theme instead of a remembered one, `/search/` instead of the ⌘K palette, no `§`
anchors, the timeline unfiltered — which is its default view anyway — and no Back to Top
control, which costs nothing since scrolling up is always possible.

## Minify on publish — BUILT 2026-07-27

`npx esbuild _site/assets/scripts/*.js --minify --outdir=_site/assets/scripts --allow-overwrite`,
run in the Actions workflow after `jekyll build`, and in `make build` so local
production-parity matches CI.

**36.7 KB → 15.2 KB raw; 13.9 KB → 6.6 KB gzipped.** A 59% cut raw, 52% gzipped.

### In place, and that is the whole design

The step rewrites the files in `_site`; it changes no HTML. Every page still loads
`/assets/scripts/<name>.js`, exactly as before. That matters because two other environments
never run this step:

- **local `jekyll serve`** — you get the readable originals, which is what you want while working;
- **the Cloudflare Pages backup**, whose build command is set dashboard-side and is deliberately
  left alone (see [`hosting.md`](hosting.md)). It keeps serving the unminified files.

Both work, unchanged. Pointing the layout at bundle files that only CI produces would have left
both of them with **no JavaScript at all** — a silent, total failure of the enhancement layer on
the standby host, discovered only when it was needed.

### Concatenation: considered, not done

The earlier plan was per-page-type bundles. Rejected for now:

- It requires the layout to reference bundle names, which is exactly the coupling the in-place
  design avoids, and which breaks both environments above.
- The gain was always in minification, not in merging. Under HTTP/2 the request count is not
  what costs — the bytes are, and those are now down 52% gzipped without touching a reference.
- One bundle for everything is a regression regardless: `sidenotes.js` (4.7 KB minified) is
  posts-only and `pagefind-custom.js` is `/search/`-only, so a single bundle would put ~15 KB on
  a homepage that needs about 7 KB of it.

If concatenation is ever wanted, the shape is bundle-per-layout mirroring the CSS
([`styles.md`](styles.md) §5) — and it needs a plan for the two non-CI environments first.

### Sources stay readable

These files carry a lot of explanatory comment and it all survives; minification touches only
the shipped copy. Verified after the change: `back-to-top.js` in `_site` starts
`(function(){"use strict";var l=2.5…` while the source is untouched.

**Verified on a real minified build**, not by trusting the byte count: sidenotes placed (4),
anchors built (10), Back to Top inserted, the appearance panel built with its pills, the search
palette present, and zero console errors.

### It adds a build dependency

esbuild in the workflow. That is a build tool, not a runtime framework, so it does not break
"no frameworks" — and CLAUDE.md guardrail 6 was amended on 2026-07-27 to permit exactly this
and nothing more.

## Related

- CLAUDE.md guardrail 4 (progressive enhancement) and 6 (vanilla only).
- [`design.md`](design.md) → *Performance budget* — "only the JS a page needs".
- [`timeline.md`](timeline.md) — the CSS-only filter, as the example of rule 3.
