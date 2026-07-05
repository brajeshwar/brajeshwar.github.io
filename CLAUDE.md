# CLAUDE.md — brajeshwar.com

Guidance for AI agents (Claude Code) working in this repo.

## Active work
The **v2027 redesign is merged to `main` and deployed** (live at brajeshwar.com, as of
2026-07-05). Work now happens on **`main`**, and **every push to `main` auto-deploys** via
GitHub Actions — so keep changes small and reviewable. We're in **incremental-improvement**
mode. **Read [`_docs/memory.md`](_docs/memory.md) first each session** ("Where we are"), then
[`_docs/todo.md`](_docs/todo.md). The redesign spec is [`_docs/v2027/spec.md`](_docs/v2027/spec.md);
hosting/DNS is [`_docs/hosting.md`](_docs/hosting.md). Re-read the guardrails before any
commit-worthy change.

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
6. **Vanilla JS only.** No frameworks; no JS/CSS build step beyond Jekyll's SCSSify include pipeline.
7. **Commit authorship.** Never create commits attributed to Claude/Anthropic; never add
   "Generated with Claude", co-author trailers, or AI references in commit messages or code
   comments. Brajeshwar makes the commits — prepare and show changes for review rather than
   committing, unless he explicitly asks (still with no AI attribution).
8. **Reviewable diffs.** Work phase by phase per the spec; don't mix refactor and redesign.

## Project shape (keep it)
- CSS = small numbered ITCSS partials in `_includes/css/`, **inlined** into `<head>` via
  `styles.html` (SCSSify). Base bundle stays embedded and **under ~10KB**.
- Layouts select a CSS bundle through the `styles:` front-matter key.
- **All themeable values are CSS custom properties; no hardcoded colors outside `0.1-color.css`.**
- `container-ideal` = reading width; `page.style` = full-width page hook.

## Quick verification before handing back
`git diff --name-only main` should touch only layouts / includes / css / js / docs / build config —
never content. Permalinks unchanged. Jekyll builds clean and Pagefind still indexes.
