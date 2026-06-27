# MEMORY — brajeshwar.com docs hub

> `_docs/` is the home for brajeshwar.com documentation. This file is the index +
> working memory: what we're building, the rules, and where things stand. Read it
> first each session; keep it current.

## Docs index
- [`v2027/SPEC.md`](v2027/SPEC.md) — single source of truth for the v2027 redesign (the brief Brajeshwar built with Claude CoWork).
- [`TYPOGRAPHY.md`](TYPOGRAPHY.md) — type scale, spacing, rhythm; sans default + reader font selector (`--font-reading`).
- [`COLOR.md`](COLOR.md) — **Ovellum two-axis theming**: mode (`data-theme` auto/light/dark) × palette (`data-palette` default/eink/flexoki/nord/solarized), bridge, no-flash.
- [`SIDENOTES.md`](SIDENOTES.md) — Tufte margin sidenotes built from kramdown footnotes (Phase 2).
- [`SEARCH.md`](SEARCH.md) — site-wide header search, lazy-loaded Pagefind.
- [`/CLAUDE.md`](../CLAUDE.md) — short guardrails for AI agents working in the repo.

---

## What we're building (v2027 redesign)

Re-skin brajeshwar.com into a **serif, reading-first** site inspired by **Tufte CSS** —
long-form articles with **right-margin sidenotes derived from the footnotes kramdown
already emits** — plus a **reader theme selector** (Light · Dark · Sepia/Warm · Grayscale)
that remembers the reader's choice. Tight code, content and presentation cleanly separated,
**zero content files touched**.

- **Stack stays:** Jekyll + kramdown + Pagefind, deployed to GitHub Pages via GitHub Actions.
- **Branch:** `brajeshwar.com-v2027` (active; branched from `main` at `cd3227e0`, no redesign commits yet).
- The redesign lives **only** in layouts, includes, CSS, JS, and build config.

## Non-negotiable guardrails (full list in SPEC §2 / CLAUDE.md)
1. **Never modify content** — no edits/no added front matter under `_posts/**`, `_drafts/**`, `_pages/**` bodies. `_data/*.yaml` off-limits except `nav.yaml` (with approval). ~1,393 of ~1,463 posts have **no front matter**; titles come from the `# H1` via `jekyll-titles-from-headings` + `jekyll-optional-front-matter`.
2. **Preserve every URL** — permalink `/:title/`; 25 years of links (2001–2026) must not break.
3. **Stay on Jekyll + Pagefind + kramdown** — no new SSG, no Markdown-engine swap, no new plugins unless a phase calls for it, no `_plugins/` hooks.
4. **Progressive enhancement** — fully readable with JS disabled (real footnotes at article foot, sensible default theme). JS only *enhances* (sidenotes, theme persistence).
5. **Sidenotes from existing footnotes only** — CSS/JS, no new authoring syntax, no per-post markup.
6. **Vanilla JS only** — no frameworks, no JS/CSS build step beyond Jekyll's SCSSify includes.
7. **Commit authorship** — never attribute commits to Claude/Anthropic; no "Generated with Claude", co-author trailers, or AI references in messages/comments. **Brajeshwar makes the commits** — prepare and show diffs for review; commit only if he explicitly asks (still no AI attribution).
8. **Reviewable diffs** — work phase by phase; don't mix refactor with redesign.

## Architecture to honor
- CSS = small numbered **ITCSS partials** in `_includes/css/`, **inlined** into `<head>` via `styles.html` (`{% capture %}` + SCSSify). Base bundle stays embedded and **under ~10KB**.
- Layouts pick a CSS bundle through the `styles:` front-matter key (`styles-posts.html`, `styles-pages.html`).
- **All themeable values are CSS custom properties; no hardcoded colors outside `0.1-color.css`.** Use semantic tokens: `--bg`, `--bg-subtle`, `--text`, `--text-muted`, `--rule`, `--accent`, `--accent-hover`, `--mark`, `--sidenote-text`, `--code-bg`.
- `container-ideal` = reading width (~60–70ch serif + right gutter for sidenotes); `page.style` = full-width page hook.
- Theme overrides via `<html data-theme="light|dark|sepia|gray">`; no attribute = Light, and `prefers-color-scheme: dark` → Dark **only when reader made no explicit choice**.

## Key features (as built)
- **Sidenotes** — `assets/scripts/sidenotes.js` (defer) walks `.footnotes`, builds `<aside class="sidenote">` in the right gutter aligned to each `sup#fnref:N`; strips the `↩`, keeps the number, hides the bottom block when active. Narrow → fold back to footnotes. JS off → plain footnotes. CSS in `2.1-footnotes.css`. **Live-verified.** See [`SIDENOTES.md`](SIDENOTES.md).
- **Reader settings** — `<reader-settings>` in the header, built by `assets/scripts/reader.js` (defer): two native `<select>`s — **font** (Sans default / Serif / Mono → `[data-font]` → `--font-reading`) and **theme** (Auto / Light / Dark / Sepia / Gray → `[data-theme]`). Persists `localStorage.font` + `localStorage.theme`. **No-flash** inline `<head>` snippet applies both before first paint. CSS in `0.1-color.css` + `0.0-config.css` (font tokens) + `8.1-tools-theme-toggle.css`.

## Phasing (SPEC §10)
0. **Scaffold** — branch + spec + CLAUDE.md (done); add token layer in `0.1-color.css`, no visual change yet.
1. **Design system** — typography, semantic tokens + 4 theme palettes, theme selector UI + `theme.js` + no-flash snippet.
2. **Reading layout + sidenotes** — ideal-width article, `sidenotes.js`, responsive fold-back, JS-off fallback.
3. **Templates & chrome** — centered header logo+nav w/ full-width rule, column footer, full-width vs ideal-width templates, figure/caption + gallery + caption-align utility, blockquote.
4. **Cleanup** — dead-CSS pass, AnchorJS decision, "no hardcoded color" grep, base bundle <10KB.
5. **Verification** — checklist in SPEC §11.

## Open questions (defaults chosen, flag in the partial when resolved)
- Serif: self-hosted Libre Baskerville vs pure system serif stack → **lean system**.
- Post CSS: embed-with-base vs load separately → decide on byte budget.
- AnchorJS: drop `anchor.min.js` + `9.9-utils-anchorjs.css` for CSS-only heading anchors → **lean drop**.
- Year archives / home microblog / `/about` timeline → **deferred / future** unless prioritized.

## Status
- **Phase 0 done.** Semantic token layer introduced in `0.1-color.css` (additive, zero visual change).
- **Phase 1 done + live-verified.** See [`COLOR.md`](COLOR.md) + [`TYPOGRAPHY.md`](TYPOGRAPHY.md).
  - `0.1-color.css` restructured: `.theme-*` classes → `[data-theme]` attributes; **four palettes** (light/dark/sepia/gray); auto-dark via `:root:not([data-theme])`; semantic aliases declared once.
  - **Reading surface defaults to SANS** with a **reader font selector** (Sans/Serif/Mono via `--font-reading` + `[data-font]`). Brajeshwar's call: sans default, font is a reader choice (Kindle/Reader-style). Supersedes the earlier serif-default draft (and the `cd3227e0` sans commit) — both reconciled.
  - **Reader settings control** — `reader.js` builds `<reader-settings>` (font + theme selects); old inline `ThemeToggle` removed from `header.html`; `theme.js` renamed → `reader.js`. No-flash `<head>` snippet applies theme+font before paint. Theme selector = **Auto + 4 themes** (Auto approved).
  - `8.1-tools-theme-toggle.css` restyled (`.reader-select`, semantic tokens).
- **Phase 2 done + live-verified.** Tufte sidenotes. See [`SIDENOTES.md`](SIDENOTES.md). `sidenotes.js` + `2.1-footnotes.css` + sidenote tokens in `0.0-config.css`.
  - **Browser-verified at 1440px**: footnotes → clean margin sidenotes aligned to refs (after resetting the inherited generic `aside{}` box); at 760px → fold back to foot footnotes with `↩`; sepia+serif persisted across reload with no flash; selects reflect stored state.
- **Phase 3 done + live-verified.** Templates & chrome.
  - **Header** — already centered logo+nav with full-width rule; removed the dead `mode-toggle` CSS (now `reader-settings`).
  - **Footer** — restructured `_data/nav.yaml` `footer` from a flat list into **4 categorised groups** (Browse / Reading / About / Connect — all 13 original links preserved); `footer.html` renders columns; `3.1-footer.css` is a responsive `auto-fit` grid + centered colophon. ⚠️ The grouping is my IA guess — easy to re-bucket; iterate freely.
  - **Blockquote** — Yale e360 style: no background box, quiet left rule, italic serif, muted (`1.2-typography.css`).
  - **Figures** — captions muted/restrained + caption-alignment utilities (`figcaption.center/.right`, default left) in `2.1-images.css`. Gallery already existed.
  - Browser-verified: footer columns on home + posts, header, sidenotes still work post-refactor.
- **Phase 4 done.** Cleanup.
  - **AnchorJS dropped** — removed vendored `assets/scripts/anchor.min.js`; new vanilla `assets/scripts/anchors.js` (defer, in `post.html`) injects `§` heading links; `9.9-utils-anchorjs.css` repurposed to `.headerlink` styles (reveal on hover, hidden on small screens). Browser-verified (§ appears on h2 hover).
  - **Dead CSS** — removed `_includes/css/4.1-search.css` (Google CSE `.gsc-*`, unreferenced since the Pagefind move).
  - **Hardcoded colors** — clean outside the known exceptions: `2.1-code.css` (pygments) and `4.1-search-pagefind.css` (Pagefind UI vars — left as-is per SPEC §9). No stray colors elsewhere.
  - **CSS budget** — Brajeshwar set the budget at **≤ 42KB** (supersedes the old ~10KB note). Inlined `<style>` per page (compressed): ~17KB (pages) to ~25KB (search w/ Pagefind UI). **Well under budget.**
- **Phase 5 (verification) — passing.** Builds clean; only layouts/includes/css/js/`nav.yaml` touched (no post/draft/page-body content); permalinks unchanged; 4 themes + font selector persist with no flash; sidenotes work + fold back; JS-off → real footnotes + default theme; CSS under budget; no AI-attributed commits (nothing committed — staged for review).
  - Files touched (Phases 0–4): `_data/nav.yaml`; `_includes/css/{0.0-config,0.1-color,1.2-typography,2.1-footnotes,2.1-images,3.1-header,3.1-footer,8.1-tools-theme-toggle,9.9-utils-anchorjs}.css`; deleted `4.1-search.css`; `_includes/{header,footer}.html`; `_layouts/{default,post}.html`; `assets/scripts/{reader,sidenotes,anchors}.js` (new); deleted `assets/scripts/anchor.min.js` + old `theme.js`.
- **Header search added + live-verified.** Site-wide search via lazy-loaded Pagefind (Option 1 — zero page-load cost). See [`SEARCH.md`](SEARCH.md). `<site-search>` trigger in `header.html` (links to `/search/` as JS-off fallback) + `assets/scripts/search.js` (defer, opens an inline themed panel, lazy-loads `pagefind-ui.*` on first click) + `_includes/css/8.2-tools-search.css` (in base bundle). Browser-verified: page load injects no Pagefind; click → panel + lazy-load; "cherrapunji" → 1 highlighted result.
  - ⚠️ **Cache gotcha (testing only):** `jekyll serve` wipes `_site/pagefind/` on regeneration and caches `search.js` hard — test with `--skip-initial-build --no-watch` after `npx pagefind --site _site`, and hard-reload. The `DOMContentLoaded` ready-guard in search.js is required (don't remove).
  - **Reworked into a ⌘K command palette (live-verified on a plain serve).** Now opens a **centered in-place popup** via the trigger **or ⌘K / Ctrl+K**; Esc/backdrop close; **never navigates** while JS is on (removed the auto-redirect — shows an in-panel "open the search page" message if Pagefind can't load). ⌘K hint badge in the header (platform-aware). **Root cause of "search just goes to /search/": all `assets/scripts/*.js` were loaded via `prepend: site.url` → `https://brajeshwar.com/...`, which 404s under local `jekyll serve` so no JS attached. Fixed to `relative_url` (root-relative) in `default.html` + `post.html`.** `/search/` page unchanged (auto-focused input, JS-off fallback).
  - **Switched to Pagefind's Modular UI (live-verified).** We're on Pagefind 1.5.2 (current — not a version bump). Default UI → **Modular UI** (`pagefind-modular-ui.js`): our ⌘K shell builds `PagefindModularUI.Instance` + `Input`+`Summary`+`ResultList` (`showImages:false`) into 3 mounts in the panel; same `--pagefind-ui-*` theming on `.site-search__panel`. Eager search payload **~32KB → ~5KB gz**. Considered the Component UI (`<pagefind-modal>`, ~40KB, heavier/harder to theme) and rejected it. Verified: "monaco" → 2 themed text-only results.
  - **`data-pagefind-ignore` on `<header>` + `<footer>`** so repeating chrome (nav, the ⌘K hint badge, footer columns) isn't indexed — without it the header's ⌘K led every result excerpt. Verified: "bombay flood" → clean content excerpts.
- **Theming reworked → Ovellum parity (live-verified).** Replaced the single-axis `[data-theme]` light/dark/sepia/gray with Ovellum's (ovellum.oss.oinam.com) **two independent axes**: **mode** (`data-theme`: auto/light/dark) × **palette** (`data-palette`: default/eink/flexoki/nord/solarized). Plus **font axis** (`data-font`: sans/serif/inter/geist) with self-hosted **Inter** + **Geist** variable fonts (`assets/fonts/`, `0.0-fonts.css`, `font-display:swap` so they load only when chosen). See [`COLOR.md`](COLOR.md) + [`TYPOGRAPHY.md`](TYPOGRAPHY.md).
  - `0.1-color.css` fully rewritten: raw `--color-gray-*` scale (palettes re-tint) → semantic `--color-*` (mode flips light↔dark) → **bridge** aliasing all legacy `--bg-color-*`/`--text-color-*`/`--border-color-*` + v2027 `--bg/--text/--rule/--accent` onto the semantic layer, so every component themes with zero edits. `color-mix()` for borders.
  - `--font-body` (default `--font-sans`) drives `body`; legacy `--font-family-*` aliased.
  - Controls: `<appearance-settings>` panel (`appearance.js`, replaces `reader.js`) — Mode/Palette/Font button groups; no-flash snippet applies all 3 axes before paint; `localStorage` keys `theme`/`palette`/`font`. CSS in `8.1-tools-theme-toggle.css`.
  - **Browser-verified**: default light/neutral/sans; Nord+Dark+Geist → Nord-dark slate bg, Geist font; persisted across reload with no flash. Builds clean; inlined CSS ~29KB (<42KB).
  - **Accent axis wired (live-verified).** Appearance panel has an **Accent** group: 6 swatches (Blue/Purple/Green/Amber/Red/Cyan, Ovellum's oklch values) + Default + custom `<input type=color>`. Sets inline `--ov-accent` + `data-accent=custom`, persisted to `localStorage('accent')`, applied by the no-flash snippet. The ported `[data-accent]³` rule maps it onto `--color-accent` + `--color-primary` (links, nav pill, logo recolour). Verified: Blue accent → blue links/nav/logo, persists across reload.
  - **Still deferred:** `data-text-size` (conflicts with the site's Utopia `--step-*` scale — would need a base-size multiplier).
- **Carry-over / iterate-later:**
  - Footer grouping is a guess — re-bucket as you like.
  - Sidenote hover/focus highlight; tune `--sidenote-width`/breakpoint on long or clustered notes.
  - Migrate components off legacy color tokens (`--bg-color-*` etc.) onto the semantic ones (`--bg`, `--text`, …) — a tidy-up, not required for function.
  - Optional further CSS trimming by moving content-only partials out of the always-inlined base — not needed given the 42KB budget.
- **Local dev loop (`Makefile`).** `jekyll serve` does NOT build the Pagefind index (only CI does) → ⌘K shows "Search isn't available right now" locally. Use **`make serve`** (build + `npx pagefind --site _site` + `jekyll serve --skip-initial-build --no-watch`) for working local search; `make dev` for fast live-reload without search; `make build` / `make pagefind` / `make clean`. See [`SEARCH.md`](SEARCH.md).
- Note: `.gitignore` has a pre-existing uncommitted `tmp/` line from before this work (not ours) — leave it.
