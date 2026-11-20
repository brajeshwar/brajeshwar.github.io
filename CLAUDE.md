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

## /odo

The work queue follows the global `~/.claude/CLAUDE.md`; nothing about it lives here.
`.gitignore` and `_config.yml`'s `exclude:` still name `CLAUDE.local.md` and
`CLAUDE.local.log.md`, where the queue used to be. Leave both: keeping a file out of the repo
and keeping it out of the build are two separate switches.

## What this site is
A Jekyll site (kramdown) with **1,468 post files (2001–2026)** — 1,457 publish, since 11 are
future-dated and `future: false` holds them back (the 2099-dated drafts in `_posts/todo/`, plus
any post scheduled ahead) — of which **1,397 have no YAML front matter** — titles come from the
`# H1` via `jekyll-titles-from-headings` + `jekyll-optional-front-matter`. Search is **Pagefind**,
run as a post-build step.
Deploy is **GitHub Pages via GitHub Actions** (`.github/workflows/jekyll-build-deploy.yml`):
Ruby → `jekyll build` → Node → `pagefind` → `deploy-pages`, on push, daily cron, and manual.

[WARNING] **`_posts/todo/` IS JUST A FOLDER — IT PUBLISHES NOTHING AND HIDES NOTHING.** Jekyll collects
`_posts/**` recursively, so a subdirectory namespaces nothing: **the DATE is the only thing that
holds a post back.** Verified 2026-08-09 — five past-dated files in `_posts/todo/` were live at
that moment (`/2009/bombay/`, `/2025/people-of-the-internet/`, `/2026/books/`,
`/2026/childhood-computing/`, `/2026/ux-nomenclature/`), and for four of them the `todo/` copy is
the ONLY source for that URL. Moving a post there does not unpublish it; re-dating it to 2099
does. His words: *"anything in 'todo' but with a past date is published. That is how Jekyll
work."*

[WARNING] **The SHELF has since changed; the RULE has not.** Re-counted 2026-08-11: `_posts/todo/` holds
eleven files, of which **one** is past-dated and live — `/2025/people-of-the-internet/`. The
other four came off the shelf in `579b6e09` (*"Four posts come off the work-in-progress shelf"*).
[WARNING] **All five URLs are still built** — they moved folder, they did not unpublish, which is the
rule above demonstrating itself. Do not read the 2026-08-09 list as a current inventory; measure
it (`ls _posts/todo/`) when it matters.

[WARNING] **SO `_posts/todo/` HOLDS TWO DIFFERENT THINGS, and the date tells them apart:**

| date | state | what the folder means |
|---|---|---|
| **2099** | not published | a genuine draft, parked until it is ready |
| **past** | **PUBLISHED AND LIVE** | *"it is published but I want to remember to continue to work on it"* — a work-in-progress that is already public |

**A past-dated file in `_posts/todo/` is not a mistake to correct.** It is his shelf for live
articles he intends to keep editing (2026-08-09: *"when I add a published article to 'todo', it
simply means, it is published but I want to remember to continue to work on it. The article is a
work-in-progress but published."*).

[WARNING] **NEVER re-date one to 2099 to "tidy" the folder, and never move one out of it.** Either would
unpublish a live article at a URL that is already shared — guardrail 2. If a post genuinely needs
withdrawing, that is his call and his edit, not a cleanup.

## Content style — his standing principle (2026-08-09)

> *"my idea is to be as simplified and clean as possible in the contents, be consistent there.
> The heavy lifting is done by the CSS styles and some tiny uses of raw JavaScript that can keep
> changing."*

**So the content files are the thing to protect, and the CSS is the thing to spend on.** When a
page can be plainer Markdown at the cost of a more complicated selector, take that trade — the
prose outlives the stylesheet. `/about/` and `/cv/` became Markdown for exactly this reason.

[WARNING] **kramdown DOES take CSS classes — use an IAL, not a tag.** `{: .timeline-when}` under a
paragraph beats wrapping it in `<p class="…">`. What an IAL CANNOT do, verified 2026-08-09:

| want | works? |
|---|---|
| class on a heading, paragraph or list | **yes** |
| id — but ONLY as `id="x"` | **yes**, quoted — though no page uses it; see below |
| id as bare `#x` | [WARNING] **NO — silently ignored, auto id kept** |
| class on ONE list item | no — the IAL is ignored inside a list |
| a real `<figure>` + `<figcaption>` | no — an image + IAL gives `<p class>` round an `<img>` |
| wrapping a RANGE of blocks | no — that is what the one `markdown="1"` div is for |

[WARNING] **AND THIS SITE IS PLAIN KRAMDOWN, NOT GFM** — `_config.yml` sets `markdown: kramdown` with no
`input:`. kramdown prefixes `section` to any auto id that does not start with a letter, so
`## Razorfish` is `razorfish` but `## 2005-2006` is `section`. That is accepted on `/about/`,
whose date headings ship as `section-1`…`section-7` by his decision — **no ids in the content**.
Anything claiming this site parses GFM is wrong; it cost two debugging passes.

## No emoji, anywhere in code or UI (2026-11-15)

His words: *"Let's get rid of all the emoticons from the code. If you need a warning for
yourself, use something like `[WARNING]`,"* and later the same day, *"remove any form of
emoticons anywhere in code and UI, unless/otherwise really needed."* So plain-text markers
only: `[WARNING]`, `[DONE]`, `[PAUSED]`, `[NOTE]`. That covers code, `_data`, layouts,
includes, the `_pages` templates and visible pages like `/styleguide/`, the redirect stubs,
`_docs/` and this file. Typographic symbols that name a real glyph (the ↗ external-link mark,
the ↩ footnote return, ©) are not emoji and stay. Posts are content and are left alone
(guardrail 1). `_test/build.spec.mjs` fails on any emoji that creeps back.

## Code like poetry (2026-11-15)

His words: *"I want our code to be like poetry, written by a veteran programmer in leisure."*

This refines "comment generously" below; it does not reverse it. A veteran's comments are
generous with reasons and sparing with words. The dated gotchas are scars worth keeping; the
shouting and the changelog are not.

- **Say why, once, where the reader meets it.** The comment holds the current truth. History
  lives in git, so keep only the one date that explains a surprising choice.
- **`[WARNING]` is the whole alarm.** The sentence after it is in ordinary sentence case, not
  capitals, and not bold.
- **Quote him only where the quote settles a decision.**
- **Nothing repeated across files, nothing hedged.** One home per fact, with a pointer from
  anywhere else.
- **Calm code too:** plain names, short functions, and no cleverness the next reader has to
  decode.

The sample is `assets/scripts/anchors.js`, rewritten on that day. Its minified hash did not
change, which is the proof that only prose moved. The rest of the code has not been through
this pass; that is a sweep for him to ask for, not a tidy-up to do unasked.

## Everything here is public (2026-11-20)

His words: *"all of our code for this project is public, we should be very careful about what
we write, document, how we write, especially the ones generated by AI ... our writing,
information should also be prepared that someone will see and read it."*

The repository is public on GitHub, so every file, comment, doc, and commit message is
published the moment it is pushed, and history keeps it after a later edit. Write each one
for a stranger who will read it.

- **Nothing private.** No personal details (his or anyone's), no paths from his machine
  beyond the repo, no account or device IDs, no secrets, and nothing about other projects or
  his private folders. A command that needs a local path says `<cache-folder>`, not the
  path.
- **Docs record decisions, not sessions.** Say what is true and why. A chat is not a
  changelog: quote him only where the quote settles a decision, as above. Never fix a
  quote's spelling; pick a line that reads well, or say it in your own words.
- **AI-written text meets the same bar as his**: accurate, plain, and kind about everyone it
  names. No guessing presented as fact, and no blaming.
- **Check before committing**: read the diff as a stranger would. Lint, formatting, and
  tests are the floor, not the bar.

## Hard guardrails (do not violate)
1. **Never modify content.** No edits and no added front matter under `_posts/**`, `_drafts/**`,
   or `_pages/**` prose bodies. Do not touch `_data/**` except when asked — the books shelf
   (`_data/books/`, `_data/books-favorites.yaml`) is edited constantly and `nav.yaml` needs
   approval.
   [WARNING] **`_data/albums.yaml` IS GENERATED — NEVER EDIT IT** (2026-09-01). `scripts/fetch-albums.rb`
   overwrites it from `https://albums.oinam.com/feed.xml` before every build, and it is
   gitignored, so an edit is lost and never reaches the deploy. The hand-maintained
   `_data/album.yaml` it replaced is deleted.
   [WARNING] **And run it as `ruby scripts/fetch-albums.rb`, never `bundle exec ruby`** — it is
   stdlib-only, but rexml is a *bundled gem* and bundler hides those unless the Gemfile names
   them. **A checkout that has not run `make albums` has no Albums strip on the home page**;
   an absent section is a missing data file, not a broken include.
2. **Preserve every URL.** Permalink is `/:title/`. Do not change permalinks, slugs, or structure.
   [WARNING] **A page that genuinely goes away leaves a redirect stub behind** — `_redirect/<name>.md`,
   four lines of front matter on `layout: redirect`, `sitemap: false`. Three exist: `/photos/`,
   `/resume/` and `/album/`, the last pointing OFF-SITE to `https://albums.oinam.com`
   (2026-09-01, when the album moved there wholesale). [WARNING] **Do not chain them** — `/photos/`
   was re-pointed at albums.oinam.com directly rather than left aimed at `/album/`, which had
   itself become a stub. Deleting a page without a stub is a broken URL, and guardrail 2 does
   not stop applying because the page was his idea to delete.
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
  [WARNING] **The count and the byte size used to be written here and are deliberately gone.** Both are
  one command away (`ls _sass/`, `gzip -c _site/assets/styles/site.css | wc -c`), and both went
  stale repeatedly — the size five times in a single day, the count within an hour of being
  corrected. A number that has to be hand-synced with the build is a number that will lie to
  you. Measure it when you need it; never cite it in a commit message.
  [WARNING] And do not infer size from the count: the stylesheet keeps getting SMALLER while gaining
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
- [WARNING] **A year-long cache means filenames must change when bytes do.**
  `scripts/hash-assets.mjs` renames CSS/JS **and fonts** to `<name>.<hash>.ext` after the build
  and rewrites every reference, in two passes — fonts first, then the CSS that points at them,
  so the stylesheet's hash covers its own font URLs. Must run AFTER the esbuild minify step.
  (A `?v=<date>` query string was the alternative and is worse: the daily cron would bust it
  every day for unchanged bytes, and some caches ignore query strings outright.) It runs in Actions only; local `jekyll serve` serves the unhashed paths and
  is internally consistent, as is the Cloudflare Pages backup.
- [WARNING] **Every stylesheet now applies to every page.** There is no layout gate any more, so a
  selector must anchor to something page-specific — a class (`.page`, `.post`) or a custom
  element (`<photo-cover>`) — never a bare `main > article > h2`. `page.scss` was the one file
  that got this wrong; unscoped it would have clamped all ~1,457 post titles to the measure.
  The `styles:` front-matter key is **gone** (`style:` = a class on `<main>` — still live, and
  the two were easily confused).
- **All themeable values are CSS custom properties; no hardcoded colors outside `themes.scss`.**
- **Comment CSS generously.** `sass: style: compressed` strips block comments, so prose in
  `_sass/*.scss` costs **zero bytes** in the shipped page — verified. Explain *why*,
  record gotchas, date non-obvious decisions. Three hard rules: **never use a bang comment**
  (slash-star-bang survives compression and ships); **never write a literal star-slash
  inside comment prose** (it closes the comment early; the build then fails with a misleading
  "expected selector" pointing at `assets/styles/site.scss` — the entry point, never the
  partial with the broken comment); and [WARNING] **never leave a comment unterminated**, which is the
  same mistake in reverse and far nastier — an unclosed block comment is VALID CSS, so the
  build stays green while the comment runs on and swallows every declaration until the next
  star-slash. On 2026-08-09 that silently ate `margin` and `max-width` off `.timeline h2` and
  showed up days later as "the sub-title is too far from the heading".
  **So verify a CSS change by grepping the BUILT rule, not by the build's exit code:**
  `grep -o '\.your-selector{[^}]*}' _site/assets/styles/site.css`.
- `container-ideal` = reading width; `page.style` = full-width page hook.
- **One-off pages live in `misc/<name>/`**, each a self-contained folder that never
  loads the site's CSS or JS. The rules are in [`_docs/misc.md`](_docs/misc.md), with
  how the South Bank model and its data were made.

## Page titles (added 2026-08-08 — read before touching a layout)
- **The layouts emit the `<h1>`, not the pages.** `page.html` and `album.html` write
  `<h1 class="page-title">{{ page.title }}</h1>`, guarded by
  `{% unless content contains '<h1' %}` so the handful of pages that write their own
  (`/hire/`, `/random/`, `/styleguide/`) do not get two. `force_title: true` overrides the
  guard; `/archives/` writes its own because it is the one page on `layout: default`.
- **No vertical titles.** The spine (a huge uppercase word down the left gutter on wide
  screens) was removed everywhere on 2026-11-15: *"I'm just overdoing it."* Every page title is
  the ordinary `.page-title` at the top. `title_style: vertical` is still in a few pages' front
  matter, left alone under guardrail 1; it now only forces a title, like `force_title`.
- `.spine-only` is the `/archives/` h1, kept for screen readers and painted nowhere, because
  that page's sticky year strip owns the top. The name is a fossil of the spine.
- **Posts opt out of the uppercase only** (`.post h1.page-title { text-transform: none }`).
  A page title is a label; an article title is a sentence and its own capitalisation carries
  meaning.

## Quick verification before handing back
`git diff --name-only main` should touch only layouts / includes / css / js / docs / build config —
never content. Permalinks unchanged. **`make test` passes** — it builds its own copy into
`_test/site/` and runs the suite there, never against the `_site/` a `jekyll serve --future`
may be writing; CI runs the same suite before deploying ([`_docs/testing.md`](_docs/testing.md)).
