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
A Jekyll site (kramdown) with **1,464 post files (2001–2026)** — 1,456 build, since 12 in
`_posts/todo/` are dated 2099 and `future: false` holds them back — of which **1,394 have no
YAML front matter** — titles come from the `# H1` via `jekyll-titles-from-headings` +
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
   dependency). **Built 2026-07-27**, as minify-only: esbuild rewrites `_site/assets/scripts/*.js`
   in place, so no HTML reference changes and the environments that skip the step (local
   `jekyll serve`, the Cloudflare backup) keep working. Concatenation was considered and
   deliberately not done. See [`_docs/javascript.md`](_docs/javascript.md).
7. **Commits: signed, in Brajeshwar's name, and never pushed unasked.**
   - **Every commit is GPG-signed.** `commit.gpgsign = true` is already set and the key is in
     the agent, so `git commit` signs without a prompt — there is nothing to configure and no
     excuse for an unsigned commit. **Verify with `git log --format='%h %G?'`; `G` is the only
     acceptable result.** *(Confirmed working from an agent shell 2026-07-27.)*
   - **All commits are in Brajeshwar's name. None in anyone else's.** Author and committer are
     always `Brajeshwar Oinam <brajeshwar@oinam.com>`. Never attribute to Claude/Anthropic,
     never add "Generated with Claude", co-author trailers, or any AI reference — not in commit
     messages, not in code comments, not in docs.
   - **Committing is fine. PUSHING IS NOT, until he says so** — every push to `main`
     auto-deploys. Prepare, commit, report; wait to be asked before `git push`.
8. **History rewrites destroy signatures — check before, not after.** `git filter-branch` and
   `git filter-repo` both discard GPG signatures: a signature covers the commit object, so
   changing a tree or a parent invalidates it and neither tool re-signs. **This already cost
   882 signed commits spanning 2022-2026** (see `_docs/memory.md`). Before any rewrite:
   `git log --format='%G?' <range> | sort | uniq -c` — take the count, warn Brajeshwar what it
   will cost, and get his answer first. A rewrite is his decision, not a tidy-up.
9. **Reviewable diffs.** Work phase by phase per the spec; don't mix refactor and redesign.

## Project shape (keep it)
- CSS = **13 plainly-named Sass partials** in **`_sass/`** (`config`, `themes`, `base`, `chrome`,
  `post`, `page`, `album`, + per-page one-offs `home`/`archives`/`search`/`now`/`timeline`, plus
  the not-yet-wired `bookmarks`), compiled by **`assets/styles/site.scss`** into ONE external
  stylesheet. Flattened from 25 numbered ITCSS partials on 2026-07-19 — **don't reintroduce
  numeric prefixes**; cascade order lives in `site.scss`, and `config` must stay first.
  One file, 9.5KB gzip / 49KB raw, fetched once and then cached.
- **Moved out of `_includes/css/` on 2026-07-27.** They were Liquid includes; nothing includes
  them into HTML any more, so they are Sass partials now. `_sass/` and not `assets/styles/`
  because an underscore directory is never copied to the output — sources under `assets/`
  would publish 14 raw `.scss` files at public URLs. **`@use`, not `@import`** (Dart Sass
  removes `@import` in 3.0): a module emits its CSS at FIRST load, so the order in `site.scss`
  is still the entire cascade. `base`/`album`/`home` each open with `@use "config" as *` for
  `$breakpoint-*`. Verified byte-identical across the move.
- One trap **went away** with it: a literal Liquid tag in a CSS comment used to break the
  build. These are no longer parsed as Liquid, so a stray tag in a comment is just text.
- **Externalised 2026-07-27, reversing the inlining.** `/assets/*` is served
  `cache-control: max-age=31536000` — a year, gzipped, no `_headers` file, just what the host
  does. Inlining re-sent ~6.6KB gzip on *every* page view and could never be cached (the HTML
  is only `max-age=600`); external is one fetch, then free. Break-even is under two page views.
  Per-layout splitting existed to keep the *inline* payload small and is now pointless: one URL
  shared by every page is one cache entry, where per-layout files would each miss separately.
- ⚠️ **A year-long cache means filenames must change when bytes do.**
  `scripts/hash-assets.mjs` renames CSS/JS **and fonts** to `<name>.<hash>.ext` after the build
  and rewrites every reference, in two passes — fonts first, then the CSS that points at them,
  so the stylesheet's hash covers its own font URLs. Must run AFTER the esbuild minify step.
  (A `?v=<date>` query string was the alternative and is worse: the daily cron would bust it
  every day for unchanged bytes, and some caches ignore query strings outright.) It runs in Actions only; local `jekyll serve` serves the unhashed paths and
  is internally consistent, as is the Cloudflare Pages backup.
- ⚠️ **Every stylesheet now applies to every page.** There is no layout gate any more, so a
  selector must anchor to something page-specific — a class (`.page`, `.post`) or a custom
  element (`<photo-cover>`) — never a bare `main > article > h2`. `page.scss` was the one file
  that got this wrong; unscoped it would have clamped all ~1,456 post titles to the measure.
  The `styles:` front-matter key is **gone** (`style:` = a class on `<main>` — still live, and
  the two were easily confused).
- **All themeable values are CSS custom properties; no hardcoded colors outside `themes.scss`.**
- **Comment CSS generously.** `sass: style: compressed` strips block comments, so prose in
  `_sass/*.scss` costs **zero bytes** in the shipped page — verified. Explain *why*,
  record gotchas, date non-obvious decisions. Two hard rules: **never use a bang comment**
  (slash-star-bang survives compression and ships), and **never write a literal star-slash
  inside comment prose** (it closes the comment early; the build then fails with a misleading
  "expected selector" pointing at `assets/styles/site.scss` — the entry point, never the
  partial with the broken comment).
- `container-ideal` = reading width; `page.style` = full-width page hook.

## Quick verification before handing back
`git diff --name-only main` should touch only layouts / includes / css / js / docs / build config —
never content. Permalinks unchanged. Jekyll builds clean and Pagefind still indexes.
