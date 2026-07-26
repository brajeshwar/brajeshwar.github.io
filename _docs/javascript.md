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
5. **Concatenate + minify on publish.** Ship one minified bundle, keep the sources separate.
   **Not built yet** — see below.

## What exists today

| Script | Raw | Loaded on |
|---|---:|---|
| `appearance.js` | 7.8 KB | every page (theme/font/accent panel) |
| `sidenotes.js` | 10.7 KB | posts |
| `search.js` | 3.9 KB | every page (⌘K palette) |
| `pagefind-custom.js` | 4.5 KB | `/search/` |
| `pagefind-autofocus.js` | 0.4 KB | `/search/` |
| `anchors.js` | 1.2 KB | posts, `/about/` |
| `timeline.js` | 2.4 KB | `/about/` |

**~30.9 KB raw across all seven**, none minified, each a separate request. No page loads all
of them.

Every one degrades cleanly: with JS off you get real footnotes instead of sidenotes, the
default theme instead of a remembered one, `/search/` instead of the ⌘K palette, no `§`
anchors, and the timeline unfiltered — which is its default view anyway.

## Concatenate + minify — NOT BUILT

The policy says do it "on publish", which means the Actions workflow
(`.github/workflows/jekyll-build-deploy.yml`), after `jekyll build` and alongside the
Pagefind and agent-markdown steps. It is **not implemented**; the site still ships seven
unminified files.

Worth thinking through before building it, because a naive concat is worse than nothing here:

- **One bundle for everything is a regression.** `sidenotes.js` is 10.7 KB and only posts need
  it; `pagefind-custom.js` is only for `/search/`. Concatenating all seven would put ~31 KB on
  the homepage, which today loads about 12 KB of JS. The gain has to come from minification,
  not from merging unrelated scripts.
- **Bundle per page type** matches how the CSS already works (base + per-layout, see
  [`styles.md`](styles.md) §5) and is the obvious shape: a chrome bundle for every page, plus
  post and search bundles.
- **It adds a dependency**, which is the tension — a minifier (esbuild/terser) in the workflow.
  That is a build tool, not a runtime framework, so it does not break "no frameworks", but it
  does amend CLAUDE.md guardrail 6, which previously said "no JS/CSS build step beyond
  Jekyll's SCSSify include pipeline". Guardrail 6 has been updated to permit exactly this and
  nothing more.
- **Keep sources readable.** These files carry a lot of explanatory comment; minification is
  for the shipped copy only, never the source.

## Related

- CLAUDE.md guardrail 4 (progressive enhancement) and 6 (vanilla only).
- [`design.md`](design.md) → *Performance budget* — "only the JS a page needs".
- [`timeline.md`](timeline.md) — the CSS-only filter, as the example of rule 3.
