# CLAUDE.md — brajeshwar.com

Guidance for AI agents (Claude Code) working in this repo.

## Active work
There is no big-bang redesign in flight and no version to work toward — the site just keeps
evolving. Work happens on **`main`**, and **every push to `main` auto-deploys** via GitHub
Actions, so keep changes small and reviewable. **Read [`_docs/memory.md`](_docs/memory.md)
first each session** ("Where we are"), then [`_docs/todo.md`](_docs/todo.md). Design
philosophy is [`_docs/design.md`](_docs/design.md), the visual system and CSS architecture
are [`_docs/styles.md`](_docs/styles.md), hosting is [`_docs/hosting.md`](_docs/hosting.md).
Re-read the guardrails below before any commit-worthy change.

## What this site is
A Jekyll site (kramdown) with **~1,463 posts (2001–2026)**, of which **~1,393 have no YAML
front matter** — titles come from the `# H1` via `jekyll-titles-from-headings` +
`jekyll-optional-front-matter`. Search is **Pagefind**, run as a post-build step.
Deploy is **GitHub Pages via GitHub Actions** (`.github/workflows/jekyll-build-deploy.yml`):
Ruby → `jekyll build` → Node → `pagefind` → `deploy-pages`, on push, daily cron, and manual.

## Hard guardrails (do not violate)
1. **Never modify content.** No edits and no added front matter under `_posts/**`, `_drafts/**`,
   or `_pages/**` prose bodies. Do not touch `_data/*.yaml` except `nav.yaml` (with approval).
2. **Preserve every URL.** Permalink is `/:title/`. Do not change permalinks, slugs, or structure.
3. **Stay on Jekyll + Pagefind + kramdown.** No new SSG, no Markdown-engine swap, no new plugins
   unless the spec calls for it. No `_plugins/` hooks (GitHub Pages-incompatible).
4. **Progressive enhancement.** The site must fully work with JavaScript disabled — real footnotes
   at the article foot, a sensible default theme. JS only enhances (sidenotes, theme persistence).
5. **Sidenotes come from existing footnotes** via CSS/JS only. No new authoring syntax, no per-post
   markup, no content edits.
6. **Vanilla JS only.** No frameworks, ever — raw browser JS, one small file per function,
   used sparingly and only where CSS can't do the job. Every page must work with it disabled.
   No CSS build step beyond Jekyll's SCSSify include pipeline. **Amended 2026-07-27:** a
   concatenate+minify step for JS *on publish* is permitted (a build tool, not a runtime
   dependency) — not yet built. See [`_docs/javascript.md`](_docs/javascript.md).
7. **Commit authorship.** Never create commits attributed to Claude/Anthropic; never add
   "Generated with Claude", co-author trailers, or AI references in commit messages or code
   comments. Brajeshwar makes the commits — prepare and show changes for review rather than
   committing, unless he explicitly asks (still with no AI attribution).
8. **Reviewable diffs.** Work phase by phase per the spec; don't mix refactor and redesign.

## Project shape (keep it)
- CSS = **12 plainly-named files** in `_includes/css/` (`config`, `themes`, `base`, `chrome`,
  `post`, `page`, `album`, + per-page one-offs), **inlined** into `<head>` via `styles.html`
  (SCSSify). Flattened from 25 numbered ITCSS partials on 2026-07-19 — **don't reintroduce
  numeric prefixes**; cascade order lives in `styles.html`, and `config.css` must stay first.
  Base bundle stays embedded and **under 13KB gzipped** (over the wire, per page). Today's pages
  measure 6.1–7.2KB gzip (27–34KB raw), so there is real headroom — re-measure when adding to base.
- Layouts select a CSS bundle through the `styles:` front-matter key. **CSS splits by layout, not
  by page** — base → per-layout bundle → per-page opt-in for one-offs only. New page type means a
  new layout + one bundle. See [`_docs/styles.md`](_docs/styles.md) §5.
  (`styles:` = a CSS include; `style:` = a class on `<main>` — different keys, easily confused.)
- **All themeable values are CSS custom properties; no hardcoded colors outside `themes.css`.**
- **Comment CSS generously.** `sass: style: compressed` strips block comments, so prose in
  `_includes/css/*.css` costs **zero bytes** in the shipped page — verified. Explain *why*,
  record gotchas, date non-obvious decisions. Two hard rules: **never use a bang comment**
  (slash-star-bang survives compression and ships), and **never write a literal star-slash
  inside comment prose** (it closes the comment early; the build then fails with a misleading
  "expected selector" pointing at `styles.html`).
- `container-ideal` = reading width; `page.style` = full-width page hook.

## Quick verification before handing back
`git diff --name-only main` should touch only layouts / includes / css / js / docs / build config —
never content. Permalinks unchanged. Jekyll builds clean and Pagefind still indexes.
