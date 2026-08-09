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

## CLAUDE.local.md — the work queue (restructured 2026-08-09)

`CLAUDE.local.md` at the repo root is Brajeshwar's running list of what to do next. **He writes
it by hand, so it is kept bare** — no headings, no commentary, nothing but his own lines.
**`/odo`** is the shortcut for "run it"; the full mechanics live in `.claude/commands/odo.md`
rather than here, so they load when the command runs instead of every session.

⚠️ **THE WHOLE FILE IS THE QUEUE.** There is no `## DO` heading any more, and no
`## MAYBE / LATER / ICEBOX` — *"anything in this file is now a do"* (2026-08-09). Everything
below the H1 is work. The finished-item log moved out to **`CLAUDE.local.log.md`**, which is why:
it had grown to ~1.4k tokens of completed work being read into context every session.

- **Items are prose OR bullets** — a `- ` bullet, a bare sentence, a paragraph. One paragraph is
  one item. He types straight into this file; do not normalise what he wrote into a list.
- ⚠️ **`WIP` AT THE START OF A LINE means leave it alone.** He is still writing it — do not
  start it, ask about it, or tick it. It cascades to anything nested beneath it.
- **Work TOP-DOWN**, one item at a time, finished — built, verified, committed — before the next.
- ⚠️ **Do not stop between items.** Finish one, take the next, until the file is empty. The queue
  having items in it IS the instruction. Stop early only for a genuinely blocking question.
- **Never reorder, reword or delete his lines.** Position is his instruction.
- **Never push** because a queue item is done; guardrail 7 is unchanged.
- **Done means:** move the line to `CLAUDE.local.log.md` as `- [x] [HH:MM] <his original text>`
  (24-hour local, when it was finished) under today's `- YYYY-MM-DD` root item, newest date
  first. Prose becomes a list item only at that point — the log wants one shape, the inbox does
  not. Abandoned rather than finished → strike it through with a one-line reason. Log history,
  never erase it.
- **Leave the file as the H1 plus three blank lines** when the queue is empty, so his cursor
  lands on the middle one.

⚠️ **Both local files need TWO edits to stay out of the world**: `.gitignore` keeps them out of
the repo, `_config.yml`'s `exclude:` keeps them out of the build. Neither implies the other —
`CLAUDE.local.md` was gitignored and still rendering to `_site/CLAUDE.local/`.

⚠️ **`/odo` is PROJECT-SCOPED on purpose — do not promote it to `~/.claude/commands/`.** It is
tracked in this repo (`.gitignore` excludes `.claude/*` and re-includes `commands/`), so it
travels to any clone of brajeshwar.com and nowhere else. Its body names `CLAUDE.local.md`,
`_docs/`, guardrail 7 and this build's verify loop — none of which exist elsewhere. His call,
2026-08-08: *"Keep it here for now."* Where the PORTABLE half eventually lives is not this
repo's question; it moved to his vault at
`~/_/Oinam/3-Resources/AI/Claude/Claude Code - Portable Setup.md`.

## What this site is
A Jekyll site (kramdown) with **1,468 post files (2001–2026)** — 1,457 publish, since 11 are
future-dated and `future: false` holds them back (the 2099-dated drafts in `_posts/todo/`, plus
any post scheduled ahead)

⚠️ **`_posts/todo/` IS JUST A FOLDER — IT PUBLISHES NOTHING AND HIDES NOTHING.** Jekyll collects
`_posts/**` recursively, so a subdirectory namespaces nothing: **the DATE is the only thing that
holds a post back.** Verified 2026-08-09 — five past-dated files in `_posts/todo/` were live at
that moment (`/2009/bombay/`, `/2025/people-of-the-internet/`, `/2026/books/`,
`/2026/childhood-computing/`, `/2026/ux-nomenclature/`), and for four of them the `todo/` copy is
the ONLY source for that URL. Moving a post there does not unpublish it; re-dating it to 2099
does. His words: *"anything in 'todo' but with a past date is published. That is how Jekyll
work."*

⚠️ **SO `_posts/todo/` HOLDS TWO DIFFERENT THINGS, and the date tells them apart:**

| date | state | what the folder means |
|---|---|---|
| **2099** | not published | a genuine draft, parked until it is ready |
| **past** | **PUBLISHED AND LIVE** | *"it is published but I want to remember to continue to work on it"* — a work-in-progress that is already public |

**A past-dated file in `_posts/todo/` is not a mistake to correct.** It is his shelf for live
articles he intends to keep editing (2026-08-09: *"when I add a published article to 'todo', it
simply means, it is published but I want to remember to continue to work on it. The article is a
work-in-progress but published."*).

⚠️ **NEVER re-date one to 2099 to "tidy" the folder, and never move one out of it.** Either would
unpublish a live article at a URL that is already shared — guardrail 2. If a post genuinely needs
withdrawing, that is his call and his edit, not a cleanup. — of which **1,397 have no YAML front matter** — titles come from the `# H1` via `jekyll-titles-from-headings` +
`jekyll-optional-front-matter`. Search is **Pagefind**, run as a post-build step.
Deploy is **GitHub Pages via GitHub Actions** (`.github/workflows/jekyll-build-deploy.yml`):
Ruby → `jekyll build` → Node → `pagefind` → `deploy-pages`, on push, daily cron, and manual.

## Hard guardrails (do not violate)
1. **Never modify content.** No edits and no added front matter under `_posts/**`, `_drafts/**`,
   or `_pages/**` prose bodies. Do not touch `_data/**` except when asked — the books shelf
   (`_data/books/`, `_data/books-favorites.yaml`) is edited constantly and `nav.yaml` needs
   approval.
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
- CSS = **plainly-named Sass partials in `_sass/`**, compiled by
  **`assets/styles/site.scss`** into ONE external stylesheet. Flattened from 25 numbered ITCSS
  partials on 2026-07-19 — **don't reintroduce numeric prefixes**; cascade order lives in
  `site.scss`, and `config` must stay first.
  ⚠️ **The count and the byte size used to be written here and are deliberately gone.** Both are
  one command away (`ls _sass/`, `gzip -c _site/assets/styles/site.css | wc -c`), and both went
  stale repeatedly — the size five times in a single day, the count within an hour of being
  corrected. A number that has to be hand-synced with the build is a number that will lie to
  you. Measure it when you need it; never cite it in a commit message.
  ⚠️ And do not infer size from the count: the stylesheet keeps getting SMALLER while gaining
  partials, because most partials that arrive replace something larger.
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
  that got this wrong; unscoped it would have clamped all ~1,457 post titles to the measure.
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

## Page titles (added 2026-08-08 — read before touching a layout)
- **The layouts emit the `<h1>`, not the pages.** `page.html` and `album.html` write
  `<h1 class="page-title">{{ page.title }}</h1>`, guarded by
  `{% unless content contains '<h1' %}` so the handful of pages that write their own
  (`/hire/`, `/random/`, `/styleguide/`) do not get two. `force_title: true` overrides the
  guard; `/archives/` writes its own because it is the one page on `layout: default`.
- **`title_style: vertical`** adds `.vertical-title` beside `.page-title`. Every spine rule
  lives inside `@media (min-width: 1250px)`, so a narrow screen falls back to the ordinary
  title with nothing to undo. **Do not re-write this as `display: none` below the
  breakpoint** — that shipped once and left six pages with no title at all on a laptop.
- `.spine-only` is for a page that must have the spine or nothing (`/archives/`, whose
  sticky year strip owns the top of the page).
- **Posts opt out of the uppercase only** (`.post h1.page-title { text-transform: none }`).
  A page title is a label; an article title is a sentence and its own capitalisation carries
  meaning.

## Quick verification before handing back
`git diff --name-only main` should touch only layouts / includes / css / js / docs / build config —
never content. Permalinks unchanged. Jekyll builds clean and Pagefind still indexes.
