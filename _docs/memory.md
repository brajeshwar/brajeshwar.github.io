# MEMORY — brajeshwar.com docs hub

> `_docs/` is the home for brajeshwar.com documentation. This file is the index +
> working memory: what we're building, the rules, and where things stand. Read it
> first each session; keep it current.

## Where we are (updated 2026-07-05) — READ FIRST
- **The v2027 redesign is DONE, MERGED to `main`, and DEPLOYED (live at brajeshwar.com).**
  `brajeshwar.com-v2027` was fast-forward-merged into `main` (`cd3227e0 → 2826a518`, 18 commits)
  and pushed; the GitHub Actions deploy ran **green** (build incl. the new agent-markdown step,
  + Pagefind, + deploy-pages).
- **Working branch is now `main`.** Each **push to `main` auto-deploys** (workflow trigger).
  So: commit small, reviewable changes; pushing publishes. (Optionally branch + merge for bigger
  work.) Same guardrails apply — no content edits, no AI attribution, Brajeshwar makes/pushes
  the commits unless he asks otherwise.
- **Mode: incremental improvement.** Brajeshwar is reviewing pages/articles live and will point
  out things to refine. Open work is in [`todo.md`](todo.md).
- **Hosting/DNS decided** — keep the `brajeshwar.github.io` repo name (don't rename), keep
  Cloudflare Pages dormant, use Cloudflare for DNS (+ proxy later for Workers/redirects). See
  [`hosting.md`](hosting.md).
- **Fixed 2026-07-05:** dev files (`CLAUDE.md`→`/CLAUDE/`, `Makefile`, `scripts/`) were being
  published — now in `_config.yml` `exclude`. Re-check `_site/` after editing `exclude`.

## Docs index
- [`design.md`](design.md) — **design philosophy** (the *why*): text-first, ornament-free, decoupled/portable styles, progressive enhancement, reader's choice.
- [`styles.md`](styles.md) — the **style specifics**: typography (scales, font axis Default/Sans-Serif/Serif, Kindle text-size), color & theming (**Ovellum two-axis**: mode `data-theme` auto/light/dark × palette `data-palette` default/nord(Cool)/eink(Warm), + accent, bridge, no-flash), branding.
- [`sidenotes.md`](sidenotes.md) — Tufte margin sidenotes built from kramdown footnotes (Phase 2) + Aresluna wayfinding.
- [`search.md`](search.md) — site-wide header search, lazy-loaded Pagefind.
- [`agents.md`](agents.md) — plain-text Markdown twins (`/x.md`) + `/llms.txt` for AI agents; post-build step like Pagefind.
- [`hosting.md`](hosting.md) — GitHub Pages + Cloudflare hosting/DNS setup and decisions.
- [`todo.md`](todo.md) — running site task list (beyond the redesign phases).
- [`v2027/spec.md`](v2027/spec.md) — single source of truth for the v2027 redesign (the brief Brajeshwar built with Claude CoWork).
- [`v2027/inspirations.md`](v2027/inspirations.md) — article-craft studies (Aresluna deep-dive; Yale e360, BBC, The Walrus, iDiallo).
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
- **Sidenotes** — `assets/scripts/sidenotes.js` (defer) walks `.footnotes`, builds `<aside class="sidenote">` in the right gutter aligned to each `sup#fnref:N`; strips the `↩`, keeps the number, hides the bottom block when active. Narrow → fold back to footnotes. JS off → plain footnotes. CSS in `2.1-footnotes.css`. **Live-verified.** See [`sidenotes.md`](sidenotes.md).
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
- **Phase 1 done + live-verified.** See [`styles.md`](styles.md).
  - `0.1-color.css` restructured: `.theme-*` classes → `[data-theme]` attributes; **four palettes** (light/dark/sepia/gray); auto-dark via `:root:not([data-theme])`; semantic aliases declared once.
  - **Reading surface defaults to SANS** with a **reader font selector** (Sans/Serif/Mono via `--font-reading` + `[data-font]`). Brajeshwar's call: sans default, font is a reader choice (Kindle/Reader-style). Supersedes the earlier serif-default draft (and the `cd3227e0` sans commit) — both reconciled.
  - **Reader settings control** — `reader.js` builds `<reader-settings>` (font + theme selects); old inline `ThemeToggle` removed from `header.html`; `theme.js` renamed → `reader.js`. No-flash `<head>` snippet applies theme+font before paint. Theme selector = **Auto + 4 themes** (Auto approved).
  - `8.1-tools-theme-toggle.css` restyled (`.reader-select`, semantic tokens).
- **Phase 2 done + live-verified.** Tufte sidenotes. See [`sidenotes.md`](sidenotes.md). `sidenotes.js` + `2.1-footnotes.css` + sidenote tokens in `0.0-config.css`.
  - **Browser-verified at 1440px**: footnotes → clean margin sidenotes aligned to refs (after resetting the inherited generic `aside{}` box); at 760px → fold back to foot footnotes with `↩`; sepia+serif persisted across reload with no flash; selects reflect stored state.
- **Phase 3 done + live-verified.** Templates & chrome.
  - **Header** — already centered logo+nav with full-width rule; removed the dead `mode-toggle` CSS (now `reader-settings`).
  - **Footer** — restructured `_data/nav.yaml` `footer` from a flat list into **4 categorised groups** (Browse / Reading / About / Connect — all 13 original links preserved); `footer.html` renders columns; `3.1-footer.css` is a responsive `auto-fit` grid + centered colophon. ⚠️ The grouping is my IA guess — easy to re-bucket; iterate freely.
  - **Blockquote** — Yale e360 style: quiet left rule, italic, muted; **font-family follows the global `--font-body`** (the reader's font choice), not a fixed serif (`1.2-typography.css`).
  - **Figures** — captions muted/restrained + caption-alignment utilities (`figcaption.center/.right`, default left) in `2.1-images.css`. Gallery already existed.
  - Browser-verified: footer columns on home + posts, header, sidenotes still work post-refactor.
- **Phase 4 done.** Cleanup.
  - **AnchorJS dropped** — removed vendored `assets/scripts/anchor.min.js`; new vanilla `assets/scripts/anchors.js` (defer, in `post.html`) injects `§` heading links; `9.9-utils-anchorjs.css` repurposed to `.headerlink` styles (reveal on hover, hidden on small screens). Browser-verified (§ appears on h2 hover).
  - **Dead CSS** — removed `_includes/css/4.1-search.css` (Google CSE `.gsc-*`, unreferenced since the Pagefind move).
  - **Hardcoded colors** — clean outside the known exceptions: `2.1-code.css` (pygments) and `4.1-search-pagefind.css` (Pagefind UI vars — left as-is per SPEC §9). No stray colors elsewhere.
  - **CSS budget** — Brajeshwar set the budget at **≤ 42KB** (supersedes the old ~10KB note). Inlined `<style>` per page (compressed): ~17KB (pages) to ~25KB (search w/ Pagefind UI). **Well under budget.**
- **Phase 5 (verification) — passing.** Builds clean; only layouts/includes/css/js/`nav.yaml` touched (no post/draft/page-body content); permalinks unchanged; 4 themes + font selector persist with no flash; sidenotes work + fold back; JS-off → real footnotes + default theme; CSS under budget; no AI-attributed commits (nothing committed — staged for review).
  - Files touched (Phases 0–4): `_data/nav.yaml`; `_includes/css/{0.0-config,0.1-color,1.2-typography,2.1-footnotes,2.1-images,3.1-header,3.1-footer,8.1-tools-theme-toggle,9.9-utils-anchorjs}.css`; deleted `4.1-search.css`; `_includes/{header,footer}.html`; `_layouts/{default,post}.html`; `assets/scripts/{reader,sidenotes,anchors}.js` (new); deleted `assets/scripts/anchor.min.js` + old `theme.js`.
- **Header search added + live-verified.** Site-wide search via lazy-loaded Pagefind (Option 1 — zero page-load cost). See [`search.md`](search.md). `<site-search>` trigger in `header.html` (links to `/search/` as JS-off fallback) + `assets/scripts/search.js` (defer, opens an inline themed panel, lazy-loads `pagefind-ui.*` on first click) + `_includes/css/8.2-tools-search.css` (in base bundle). Browser-verified: page load injects no Pagefind; click → panel + lazy-load; "cherrapunji" → 1 highlighted result.
  - ⚠️ **Cache gotcha (testing only):** `jekyll serve` wipes `_site/pagefind/` on regeneration and caches `search.js` hard — test with `--skip-initial-build --no-watch` after `npx pagefind --site _site`, and hard-reload. The `DOMContentLoaded` ready-guard in search.js is required (don't remove).
  - **Reworked into a ⌘K command palette (live-verified on a plain serve).** Now opens a **centered in-place popup** via the trigger **or ⌘K / Ctrl+K**; Esc/backdrop close; **never navigates** while JS is on (removed the auto-redirect — shows an in-panel "open the search page" message if Pagefind can't load). ⌘K hint badge in the header (platform-aware). **Root cause of "search just goes to /search/": all `assets/scripts/*.js` were loaded via `prepend: site.url` → `https://brajeshwar.com/...`, which 404s under local `jekyll serve` so no JS attached. Fixed to `relative_url` (root-relative) in `default.html` + `post.html`.** `/search/` page unchanged (auto-focused input, JS-off fallback).
  - **Switched to Pagefind's Modular UI (live-verified).** We're on Pagefind 1.5.2 (current — not a version bump). Default UI → **Modular UI** (`pagefind-modular-ui.js`): our ⌘K shell builds `PagefindModularUI.Instance` + `Input`+`Summary`+`ResultList` (`showImages:false`) into 3 mounts in the panel; same `--pagefind-ui-*` theming on `.site-search__panel`. Eager search payload **~32KB → ~5KB gz**. Considered the Component UI (`<pagefind-modal>`, ~40KB, heavier/harder to theme) and rejected it. Verified: "monaco" → 2 themed text-only results.
  - **`data-pagefind-ignore` on `<header>` + `<footer>`** so repeating chrome (nav, the ⌘K hint badge, footer columns) isn't indexed — without it the header's ⌘K led every result excerpt. Verified: "bombay flood" → clean content excerpts.
- **Theming reworked → Ovellum parity (live-verified).** Replaced the single-axis `[data-theme]` light/dark/sepia/gray with Ovellum's (ovellum.oss.oinam.com) **two independent axes**: **mode** (`data-theme`: auto/light/dark) × **palette** (`data-palette`: default/eink/flexoki/nord/solarized). Plus **font axis** (`data-font`: sans/serif/inter/geist) with self-hosted **Inter** + **Geist** variable fonts (`assets/fonts/`, `0.0-fonts.css`, `font-display:swap` so they load only when chosen). See [`styles.md`](styles.md).
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
- **Local dev loop (`Makefile`).** `jekyll serve` does NOT build the Pagefind index (only CI does) → ⌘K shows "Search isn't available right now" locally. Use **`make serve`** (build + `npx pagefind --site _site` + `jekyll serve --skip-initial-build --no-watch`) for working local search; `make dev` for fast live-reload without search; `make build` / `make pagefind` / `make clean`. See [`search.md`](search.md).
- **Appearance panel reworked (Brajeshwar; browser-verified).** `appearance.js` axes:
  - **Font** → 3 choices: **Default** = `sans` (system, no webfont, fast), **Sans-Serif** = `geist`, **Serif** = `serif` (Libre Baskerville). Inter removed (option, `@font-face`, and `assets/fonts/inter/` deleted).
  - **Palette** → 3: **Default**, **Cool** = `nord`, **Warm** = `eink` (sepia). Flexoki + Solarized removed (light re-tints + dark accent blocks in `0.1-color.css`).
  - **Text Size** → NEW axis `[data-text-size]` (`xs`/`s`/**m default**/`l`/`xl`), five growing "A" buttons (Kindle-style). Scales the **reading column only** via `--text-scale` (`0.0-config.css` → `.container-ideal article` body/headings/blockquote in `1.1-base.css`); interface unaffected. Persisted `localStorage('textsize')`; no-flash snippet applies it (`data-text-size`, camelCase `dataset.textSize`).
  - Panel **compacted** (`8.1-tools-theme-toggle.css`: tighter padding/gaps, ~15.5rem wide, smaller swatches).
  - **Accent trimmed** (follow-up) to **Default + Blue + Amber** (a cool + a warm swatch complementing Cool/Warm palettes); **custom colour picker removed** (+ its dead CSS). `appearance.js` `ACCENTS`.
  - Verified: 5 groups render; text size 20px→23.8px(xl)/17.6px(xs), headings scale, nav unaffected; Cool=blue-slate, Warm=warm paper; all persist. Files: `appearance.js`, `0.0-config.css`, `0.0-fonts.css`, `0.1-color.css`, `1.1-base.css`, `8.1-tools-theme-toggle.css`, `default.html` (no-flash). See [`styles.md`](styles.md) §1–2.
- **Font/text-size scope widened + panel redesigned (Brajeshwar; browser-verified).**
  - **Font choice now applies to ALL content** (home body, pages, articles), not just articles: `body { font-family: var(--font-body) }`; only **`header, footer` pinned to `var(--font-sans)`** (`1.1-base.css`). Sidenotes/post-meta still re-assert sans. Verified: home intro + h1 → Libre Baskerville on Serif; nav/footer stay sans.
  - **Text size now scales ALL content**, not just the reading column. Mechanism: raw clamps renamed `--step-N-base`; `:root` aliases `--step-N: var(--step-N-base)`; **`main` redefines `--step-N: calc(base * --text-scale)`** (`0.0-config.css`). Content (inside `<main>`) scales; header/footer (outside `main`) don't. Removed the old per-element `.container-ideal article` calc rules. Verified: home intro 31→37px at xl, nav stays 16px.
  - **Accent → 5 swatches** (Default + Blue/Green/Amber/Red), rendered **inline with the "Accent" label** (`.appearance-group--inline`).
  - **Buttons redesigned → segmented pills**: `.appearance-options` is one rounded (999px) pill with `overflow:hidden`; options are flat cells with hairline `border-inline-end` dividers; single line (`flex-wrap:nowrap`), compact (reduced padding, `--step--2` font). Font (Default/Sans-Serif/Serif) + Text Size (5 A's) both fit one line. `8.1-tools-theme-toggle.css`.
- **[superseded] Interface = sans, content = reader's font (Brajeshwar; browser-verified).** The reader's font choice now applies to **article prose + its headings only** (`.container-ideal article { font-family: var(--font-body) }`); `body` is pinned to `var(--font-sans)`, so **header / footer / home / nav / post-meta / sidenotes stay system sans** even in Serif/Inter/Geist mode. Blockquotes inherit context. Verified at data-font=serif: nav/footer/copyright/sidenote/meta = ui-sans-serif, article p/headings = Libre Baskerville. `1.1-base.css` + `1.2-typography.css` (blockquote). See [`styles.md`](styles.md) §1.
- **Higher contrast (Brajeshwar; browser-verified).** Text tiers pushed one step toward the extreme in both modes (backgrounds unchanged): light `--color-fg` gray-900→**950**, `-muted` 700→**800**, `-subtle` 500→**600**; dark `--color-fg` 100→**50**, `-muted` 300→**200**, `-subtle` 500→**400** (edited both the `[data-theme=dark]` block and the `prefers-color-scheme` auto block). All palettes inherit it via the token layer. `0.1-color.css`. See [`styles.md`](styles.md) §2.
- **Agent Markdown twins + `/llms.txt` (this session; build-verified, served locally).** Every post/page gets a plain-text `.md` twin (`/about.md`, `/2026/childhood-computing.md`) for AI agents, plus a `/llms.txt` index. **Post-build like Pagefind, no plugin, zero content touched.** Pieces: `agents-manifest.json` (Jekyll template → url↔source-path manifest, `sitemap:false`, deleted after use) → `scripts/build-agent-markdown.mjs` (reads source md, strips front matter, prepends `# title` + `> Markdown version of <url>` (date on **posts only** — pages default to build-time), writes `_site/<slug>.md` + `_site/llms.txt`). Head **`<link rel="alternate" type="text/markdown">`** in `default.html` (gated on `page.collection`). Wired into `.github/workflows/jekyll-build-deploy.yml` (after jekyll build, before pagefind) and `make build`. Extension is **`.md`** (Brajeshwar's call). Local run wrote **1478 twins** (23 pages, 1455 posts); `.md`→`text/markdown`, `llms.txt`→`text/plain`. See [`agents.md`](agents.md). **Uncommitted.**
- **Docs reorg (this session).** `_docs` filenames lowercased; `COLOR.md`+`TYPOGRAPHY.md` folded into **[`styles.md`](styles.md)** (type → colour → branding); new **[`design.md`](design.md)** (philosophy) and **[`todo.md`](todo.md)** (site task list, from the `tmp/` braindump); article-craft studies (Yale e360, BBC, The Walrus, iDiallo) added to [`v2027/inspirations.md`](v2027/inspirations.md). Empty root `TODO.md` stub removed (consolidated into `todo.md`).
- **Design decisions locked + built (this session; build-verified, measure browser-checked):**
  - **Reading measure = character-based** — `--measure: 66ch` (~60–70 chars/line) → `--body-width-ideal`; was `46rem`≈80ch. Video embeds → `aspect-ratio: 16/9` (width-derived height no longer valid). Browser-checked at 1512px: column ~665px ≈ 66ch. See [`styles.md`](styles.md) §1.
  - **Default theme = monotone grayscale** (already true; now explicitly locked with a header comment in `0.1-color.css`). Zero-chroma scale + gray accent → links carry no hue; affordance is the **underline**. Colour is opt-in (tinted palette or accent axis). See [`styles.md`](styles.md) §2.
  - **Page-load budget < 100 KB** for non-article pages (hard target, documented). Homepage today ~48 KB raw / ~13 KB gzip (31 KB inlined CSS + ~20 KB first-party JS, **zero images**), comfortably under. See [`design.md`](design.md) → *Performance budget*.
  - **Icons → Lucide** (MIT) recommended, **inline SVG / currentColor / zero-fetch**, home `_includes/icons/`. Not yet adopted in markup — a [`todo.md`](todo.md) follow-up. Header search icon is already this style. See [`styles.md`](styles.md) §4.
  - **`.gitignore`** properly filled: `tmp/`, `node_modules/`, `vendor/`, `.vscode/`, `.idea/`, `.pagefind-cache/` (keep committing `package.json`/lockfile). Supersedes the old stale "pre-existing tmp/ line" note.
  - Follow-ups queued in [`todo.md`](todo.md): adopt Lucide, Geist `.ttf`→`.woff2`, scope `sidenotes.js` to article pages.
- **Typography refinements (committed `0b0b5d09`):** reader **Serif = self-hosted Libre Baskerville** (`[data-font="serif"]`, loads only when chosen); **sidenotes bumped one step** to `--step--1`; **blockquotes use `--font-body`** (follow the reader's font, not a fixed serif). See [`styles.md`](styles.md) §1 + [`sidenotes.md`](sidenotes.md).
- **Footer simplified (this session; browser-verified desktop + mobile):** three centred rows — (1) **page links**, (2) **social icons**, (3) **copyright** line last (`© 2001–<year> Brajeshwar Oinam · N posts`, year via JS). Icons live in `_includes/icons/*.svg` — brand glyphs from **Simple Icons (CC0)**, `memos` hand-authored filled; footer template pulls them via a **data-driven `{% include {{ var }} %}`** (works). Files: `footer.html`, `3.1-footer.css`, `_data/nav.yaml`, `_includes/icons/`.
  - **Refinements (Brajeshwar):** page links are now **grouped with a subtle bullet between groups** (`.footer-links__sep`), order `Home • About Archives Books Now Photos Film Ideas • Hire Legal Newsletter Search Contact` — `_data/nav.yaml` `footer` is a list of `{links:[…]}` groups. **Outer `footer` spans the full viewport** (border-top edge-to-edge); a `.footer-inner` wrapper holds the content at `--body-width` / `--body-width-max`. Social: **Oinam removed** (`oinam.svg` deleted), **Memos → `https://bits.oinam.com/`**. Instagram = `instagram.com/oinam`.
  - **`/photos/` created** as a coming-soon page: `_pages/photos.md` (`layout: page`, `title: Photos`, an **HTML `<h1>`** — a markdown `#` heading gets stripped by `titles_from_headings: strip_title` in `_config.yml`, so pages use HTML headings; cf. `hire.html`). Body is just "Coming Soon."
- **Header redesigned (this session; browser-verified desktop + narrow):** logo **left** (→ `/`); on the **right**, nav (About · Archives · **Now** · Contact) then tool icons — **Search** (⌘K palette; visible `⌘K` badge removed, shortcut still fires via `search.js` global keydown), **RSS** (`/feed.xml`), **theme changer** far right. **Removed the `border-bottom` rule**; separated from body by `margin-bottom: var(--space-l)`. Nav is now **flat text** (dropped the pill). Header constrained to `--body-width-max`, `justify-content: space-between`. **Stacks + centers ≤600px** (no hamburger). Added `Now` to `_data/nav.yaml` `main`. Removed dead `.site-search__hint` CSS. Files: `header.html`, `3.1-header.css`, `8.2-tools-search.css`, `_data/nav.yaml`.
  - **Header icons now match the footer** (Brajeshwar's follow-up): all **filled, 20px, `currentColor`**, pulled from `_includes/icons/` — **RSS is the exact same file as the footer** (`icons/rss.svg`, Simple Icons); **search** is a hand-authored filled magnifier (the old stroke one read too thin); **theme** is a hand-authored filled contrast circle (the old circle-with-dots looked bad). New files: `icons/search.svg`, `icons/theme.svg`.
  - Supersedes the Phase-3 "centered logo+nav + full-width rule" note above and spec §4.3. **Uncommitted — staged for review.**
