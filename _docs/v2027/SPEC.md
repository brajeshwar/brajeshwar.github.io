# brajeshwar.com — v2027 Redesign Spec

> Working branch: `brajeshwar.com-v2027`
> Status: specification for Claude Code to implement. **Do not treat any code in this repo as already redesigned.**
> Stack stays: **Jekyll + Pagefind**, deployed to **GitHub Pages via GitHub Actions**.

This document is the single source of truth for the v2027 redesign. It is written so an implementing agent (Claude Code) can pick up the work phase by phase without further clarification. Read the **Guardrails** section first and re-read it before every commit-worthy change.

---

## 1. Goal in one paragraph

Re-skin brajeshwar.com with a serif, reading-first aesthetic inspired by Tufte CSS — long-form articles with **sidenotes in the right margin derived from existing footnotes** — while keeping a modern, clean design language. Add a **reader theme selector** (Light, Dark, Warm/Sepia, Grayscale) that remembers the reader's choice. Keep the codebase tight, keep content and presentation cleanly separated, and **change zero content files**. The site must remain a Jekyll site that builds on GitHub Actions and publishes to GitHub Pages, with Pagefind continuing to power search.

---

## 2. Non-negotiable guardrails

These are hard constraints. Violating any of them is a failed change.

1. **Never modify content.** Do not edit, reformat, or add front matter to anything under `_posts/**`, `_drafts/**`, or the prose bodies of `_pages/**`. Do not touch `_data/*.yaml` except `nav.yaml`, and only with explicit approval. The ~1,393 posts that have **no YAML front matter** must keep working through `jekyll-optional-front-matter` + `jekyll-titles-from-headings`. The redesign lives entirely in layouts, includes, CSS, JS, and build config.
2. **Preserve every URL.** Permalink scheme is `/:title/`. Twenty-five years of links (2001–2026) must not break. Do not change `permalink`, slugs, or directory conventions.
3. **Stay on Jekyll + Pagefind.** No new static site generator. No swap of the Markdown engine (kramdown stays). Keep the existing plugin set; do not add plugins unless a phase explicitly calls for it.
4. **Progressive enhancement, always.** The site must be fully readable with JavaScript disabled: footnotes remain real footnotes at the bottom of the article, and a sensible default theme renders. JS only *enhances* (sidenotes, theme persistence).
5. **No content edits to enable sidenotes.** Sidenotes are produced from the footnotes kramdown already generates. No new authoring syntax, no per-post markup.
6. **Vanilla only.** Any JavaScript is dependency-free vanilla JS. No frameworks, no build step for JS/CSS beyond Jekyll's existing SCSSify include pipeline.
7. **Commit authorship.** Do **not** create commits attributed to Claude/Anthropic, and do **not** add "Generated with Claude", co-author trailers, or AI references in commit messages or code comments. Leave commits to Brajeshwar — stage/show changes for his review rather than committing, unless he explicitly asks you to commit (still with no AI attribution).
8. **Reviewable diffs.** Work in the phases below. Keep each phase self-contained and easy to review. Do not mix a refactor with a redesign in the same change.

---

## 3. Current structure (preserve this shape)

```
_layouts/      default.html · post.html · page.html · page-full.html
_includes/     header.html · footer.html · footer column data via _data/nav.yaml
               home-blog.html · home-books.html · home-connect.html · home-support.html
               styles.html · styles-posts.html · styles-pages.html   (CSS bundlers)
               search-pagefind.html · brajeshwar-logo.svg
_includes/css/ ITCSS-style numbered partials, inlined via styles.html SCSSify:
               0.0-config · 0.0-fonts · 0.1-color
               1.1-base · 1.2-typography · 1.3-table
               2.1-cards · 2.1-code · 2.1-footnotes · 2.1-images · 2.1-images-gallery
               3.1-header · 3.1-footer
               4.1-home · 4.1-posts · 4.1-pages · 4.1-archives · 4.1-search(-pagefind)
               4.1-pages-{books,film,now,bookmarks}
               8.1-tools-theme-toggle · 9.1-utils-ui · 9.9-utils-anchorjs
_data/         nav.yaml · books · devices · movies · tv · posts-popular · ui
_pages/        22 pages (about, archives, books, film, now, contact, …)
_posts/        YYYY/ year folders, 1,463 posts, mostly no front matter
assets/        scripts/ (pagefind-*, anchor.min.js) · fonts/libre-baskerville · print.css
.github/workflows/jekyll-build-deploy.yml   Ruby→jekyll→Node→pagefind→Pages
```

Key conventions to honor:

- CSS is authored as small numbered partials and **inlined** into `<head>` through `styles.html` (a `{% capture %}` + SCSSify pass). The base bundle is embedded, not linked. Keep this pattern.
- Layouts carry a `styles:` front-matter key (`styles-posts.html`, `styles-pages.html`) that selects which CSS bundle to inline. Keep this mechanism.
- `container-ideal` is the reading-width wrapper. `page.style` is a class hook on full-width pages.

---

## 4. Design language

North stars (for reference, not for copying): **Tufte CSS** (sidenotes), **Yale e360** (clean blockquotes, figure/caption restraint, multi-image splits), **BBC** and **The Walrus** (typographic spacing that needs no ornament), **iDiallo** (article page craft), **Simon Willison's archives** (year-archive pattern).

### 4.1 Typography
- **Sans-serif for UI** (header, nav, footer, post meta, theme selector). **Serif for long-form content** (post and page article bodies).
- Use **Modern Font Stacks** (modernfontstacks.com) — already adopted. Prefer system stacks (no network fonts) for speed and portability. The self-hosted Libre Baskerville woff2 may be kept as an optional serif upgrade behind the same `--font-serif` token, but system serif is the default. Decide in Phase 1; document the choice in `0.0-fonts.css`.
- Establish a vertical rhythm / spacing scale once (in `1.2-typography.css`) and let spacing — not rules or boxes — do the work.

### 4.2 Color & theming (the core of clean theming)
- **All themeable values are CSS custom properties.** No hardcoded colors anywhere outside `0.1-color.css`. This single rule is what makes the four themes cheap and the code tight.
- Define **semantic tokens**, not raw colors, e.g.: `--bg`, `--bg-subtle`, `--text`, `--text-muted`, `--rule` (borders/hr), `--accent` (links), `--accent-hover`, `--mark` (highlight), `--sidenote-text`, `--code-bg`. Components reference only these.
- Themes override the token set under an attribute selector on `<html>`:
  - default (no attribute) = **Light**, and `@media (prefers-color-scheme: dark)` maps to the Dark token values *only when the reader has made no explicit choice*.
  - `[data-theme="light"]`, `[data-theme="dark"]`, `[data-theme="sepia"]` (warm/Kindle), `[data-theme="gray"]` (grayscale).
- Token palettes to define (Phase 1):
  - **Light** — modern, near-white bg, near-black text, restrained accent.
  - **Dark** — low-light, not pure black; soft off-white text.
  - **Sepia/Warm** — warm paper bg (e.g. warm cream), brown-black text; the comfortable long-read mode.
  - **Grayscale** — neutral grays, print-like, higher contrast, accent desaturated.

### 4.3 Layout
- **Header**: logo + primary nav, centered, with a full-width `border-bottom`. Nav from `_data/nav.yaml` `main`.
- **Footer**: column-categorized links from `_data/nav.yaml` `footer`.
- **Reading column**: ideal measure ~60–70ch for serif body. Article uses a content column plus a **right-hand margin gutter** wide enough for sidenotes on large screens.
- **Blockquote**: no background; clear separation from body; subtle presence (Yale e360 style).
- **Figures/images**: `<figure>` + minimal-treatment `<figcaption>`. Support multi-image split rows (gallery). Caption alignment as a **utility class** (left default, center, right). Media is ornamental — every article must read fine if images fail to load.

---

## 5. Tufte sidenotes (key feature)

**Source material:** kramdown footnotes already emitted by existing posts. Reference markup is roughly:
```html
… text<sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote">1</a></sup> …
<div class="footnotes" role="doc-endnotes">
  <ol><li id="fn:1"><p>Note body. <a href="#fnref:1" class="reversefootnote">↩</a></p></li></ol>
</div>
```

**Approach — CSS + minimal vanilla JS, no content changes:**

- **Wide screens** (≥ a defined breakpoint, e.g. the point where the margin gutter fits): JS walks the `.footnotes` list and, for each `li#fn:N`, creates an `<aside class="sidenote">` placed in the right gutter, vertically aligned to its `sup#fnref:N` reference. Strip the `↩` back-link in the sidenote rendering. Keep the reference number. Hide the bottom `.footnotes` block when sidenotes are active.
- **Narrow screens**: no gutter — leave (or restore) standard footnotes at the bottom; optionally make a reference tap reveal its note inline. Must remain usable.
- **JS disabled**: nothing runs; the kramdown footnotes render normally at the article foot and all anchor links work. This is the guarantee that 1,463 historical posts never break.
- **Robustness**: compute positions after fonts and images settle (avoid layout shift); debounce on resize; handle long notes and clustered references without overlap (stack/space them). Must not janks on long posts.
- **Files**: replace/extend `_includes/css/2.1-footnotes.css` with sidenote styles (consider renaming to `2.1-sidenotes.css`); add `assets/scripts/sidenotes.js`. Load the script `defer`. Scope behavior to the reading layout only (`container-ideal` / `article.post`).

Acceptance: open any old post with footnotes → on desktop the notes appear in the margin beside their references; shrink the window → they fold back to footnotes; disable JS → plain footnotes. No Markdown was edited.

---

## 6. Theme selector

- **UI**: a small, accessible control in the header (or footer) to choose among the four themes — a `<select>` or an ARIA radio/button group. Labelled, keyboard-operable.
- **Persistence**: minimal vanilla JS (~30 lines), e.g. `assets/scripts/theme.js`:
  - On change: set `document.documentElement.dataset.theme` and `localStorage.setItem('theme', value)`.
  - On load: if `localStorage.theme` exists, apply it; otherwise leave the attribute unset so `prefers-color-scheme` governs.
- **No flash**: apply the stored theme **before first paint** via a tiny inline `<head>` script that reads `localStorage` and sets `data-theme` synchronously (this snippet is the one allowed inline script; keep it ~5 lines).
- **CSS**: lives in `0.1-color.css` (tokens per theme) + `8.1-tools-theme-toggle.css` (the control's styling). No external libraries.

Acceptance: pick Sepia, navigate to another page, reload, close and reopen the tab → still Sepia. With no choice ever made, OS dark mode shows the Dark palette.

---

## 7. CSS architecture & cleanliness

- Keep the numbered-partial ITCSS structure, inlined via `styles.html`. 
- **Critical base bundle** (config + color tokens + base + typography + header + footer) stays embedded and should land **under ~10KB** (per Brajeshwar's note). Verify the byte size in Phase 4.
- Page-type styles stay split (posts, pages, home, archives, search) and continue to load through the `styles:` layout key. Posts vs pages may share base; confirm whether post styles embed-with-base or load separately and document the decision (open question from the notes).
- **One color file to rule them all**: enforce "no hardcoded color outside `0.1-color.css`." A quick grep for hex/rgb/hsl in other partials should come back clean.
- **Dead code pass** (Phase 4): remove unused partials/selectors. Audit each `4.1-pages-*` against pages that still exist.
- **AnchorJS decision** (open question in notes, "Do I need AnchorJS?"): prefer dropping the external `anchor.min.js` + `9.9-utils-anchorjs.css` in favor of CSS-only heading anchors (e.g. a `.headerlink`/`::before §` on `:hover`/`:focus-within` using the heading `id`). If a tiny JS helper is still needed, keep it vanilla and `defer`. Document the outcome.

---

## 8. Page templates

Two reading widths plus special templates (from the notes):

- **Ideal/reading width** — posts and long-form articles. Serif body, sidenotes enabled. (`post.html`, article pages.)
- **Full width** — Pages, Photos, Wear, Devices, Books, Films, Archives, Search. (`page-full.html`, `page.html` with `page.style`.)
- **Home** — text-first. Books reduced to a "top rereads" list. (Microblog/"jottings" stream on home with its own page is **future/optional**, not in scope unless a later phase adds it.)
- **Timeline** — `/about` timeline (eventually absorbing `cv.brajeshwar.com`) is **future/optional**, documented but not blocking.
- **Year archives** — `/2001/`, `/2002/`, … in the Simon Willison style is a **nice-to-have**; specify but defer unless prioritized.

Each template must map to the existing layouts; do not invent a new layout system.

---

## 9. Build, dev loop & deploy

- **Production unchanged in shape**: keep `.github/workflows/jekyll-build-deploy.yml` — Ruby → `bundle exec jekyll build` → Node → `npx pagefind --site _site` → `actions/deploy-pages`. Keep the daily `cron` (it publishes future-dated posts), `push`, and `workflow_dispatch` triggers. (Note for Brajeshwar's awareness, not an action item: `future: false` is the Jekyll default, so post-dated articles only appear once their date arrives — that's why the daily cron exists.)
- **Local dev loop** (from the notes, implement the lightweight options): add a `Makefile` with `make build` (jekyll build + pagefind), `make serve` (jekyll serve), and an optional `make watch` (rebuild + reindex on `_posts`/`_pages` change). Keep this dev-only; it must not become a production dependency. A Jekyll `_plugins/` hook is explicitly **out of scope** (GitHub Pages-incompatible and heavier than needed).
- **Pagefind**: leave as-is. (Optional, low priority, only if revisited: scoping the index with `data-pagefind-body` on content layouts improves relevance — but it must be added to *every* content layout at once or it silently drops untagged pages. Not in scope for now.)

---

## 10. Phasing (suggested execution order)

0. **Scaffold** — branch (done), this spec, `CLAUDE.md`. Introduce the token layer in `0.1-color.css` with no visual change yet.
1. **Design system** — typography (`0.0-fonts.css`, `1.2-typography.css`), semantic color tokens + four theme palettes, theme selector UI + `theme.js` + no-flash inline snippet.
2. **Reading layout + sidenotes** — ideal-width article layout, `sidenotes.js`, sidenote CSS, responsive fold-back, JS-off fallback verified.
3. **Templates & chrome** — header (centered logo+nav, full-width rule), column footer, full-width vs ideal-width page templates, figure/caption + gallery + caption-alignment utility, blockquote treatment.
4. **Cleanup** — dead CSS removal, AnchorJS decision, "no hardcoded color" grep, base bundle < 10KB verification.
5. **Verification** — the checklist in §11.

Keep each phase a reviewable unit.

---

## 11. Definition of done / verification checklist

- [ ] No file under `_posts/`, `_drafts/`, `_pages/*` bodies, or `_data/*` (except possibly `nav.yaml`) was modified. `git diff --name-only main` touches only layouts/includes/css/js/docs/build config.
- [ ] No front matter was added to any post; `jekyll-titles-from-headings` still resolves titles.
- [ ] Permalinks unchanged; spot-check a 2001, a 2013, and a 2026 post URL against `main`.
- [ ] Jekyll builds clean locally and on Actions; Pagefind still indexes (compare "Indexed N pages" to post count).
- [ ] Four themes render correctly; selection persists across navigation, reload, and tab reopen; no theme flash on load; OS dark mode honored when no explicit choice.
- [ ] Sidenotes appear in the margin on desktop for old footnoted posts, fold to footnotes when narrow, and degrade to plain footnotes with JS disabled.
- [ ] Base CSS bundle embedded and under ~10KB; no hardcoded colors outside `0.1-color.css`.
- [ ] Site fully readable with JavaScript disabled.
- [ ] No commit attributed to Claude/Anthropic; no AI references in messages or comments.

---

## 12. Open questions to resolve during implementation

- Serif: keep self-hosted Libre Baskerville or go pure system serif stack? (Lean toward system.)
- Post CSS: embed-with-base or load separately? (Decide on byte budget.)
- AnchorJS: drop for CSS-only anchors? (Lean toward dropping.)
- Year archives + home microblog + `/about` timeline: confirm whether any are in the v2027 scope or deferred.

These are noted, not blockers; pick sensible defaults and flag the choice in the relevant partial.
