# MEMORY — brajeshwar.com docs hub

> `_docs/` is the home for brajeshwar.com documentation. This file is the index +
> working memory: what we're building, the rules, and where things stand. Read it
> first each session; keep it current.

## Where we are (updated 2026-07-26) — READ FIRST

### ⚠️ 11 commits on `main`, COMMITTED BUT NOT PUSHED — plus uncommitted work on top
`main` is **ahead of `origin/main` by 11**, and the 2026-07-26 session below left further
changes **uncommitted** in the working tree. Nothing has deployed — remember every push to
`main` auto-deploys, so pushing publishes the whole stack at once.

    a3880da8  Footer: bring back the site's age, and comma the post count
    06199b1a  Docs: session handoff — state, decisions, and what to pick up next
    aa7d8519  Docs: record the font-axis change to two options
    03a2ebd6  Drop the Geist font option; the font axis is now two choices
    d8347e43  Docs: record the CSS audit, its fixes, and the remaining backlog
    b7a4d6e1  Audit all 12 CSS files: fix theming bugs, drop verified dead weight
    d6a83702  Move the 2026 books post into _posts/todo/      ← Brajeshwar's own change
    c96665cb  Docs: CSS architecture, budget, and findings from the restructure
    299212e4  Flatten CSS into 12 named files; fix + tokenise syntax highlighting
    23385363  Add album layout for galleries; merge page-full into page
    2833edb1  Ignore .claude/ (local agent config)

Ordered so **each commit builds on its own**. To resume: `git log --oneline origin/main..HEAD`.
Push with `git push origin main`, then watch the Actions run.

**Reader-visible changes in this batch** (everything else is structural or docs):
1. **Syntax highlighting now works** on the 55 posts with code blocks — it had never shipped.
2. **The font panel has 2 options, not 3** — Geist removed.
3. **`/devices/` gallery is styled** — it had shipped with no gallery CSS at all.
4. **`/search/` follows the theme** — it was rendering hardcoded `#0066cc`/`#fff` regardless.
5. **The footer says the site's age again** — "© 2001–2026 … · 1,456 posts · 25 years, 1
   month". Both numbers now render at build time in Liquid, not by JS, which also fixes the
   copyright year rendering blank with JavaScript disabled.

### What happened 2026-07-26
Docs and README, no reader-visible change. **Uncommitted.**

- **Retired the "v2027" framing.** `_docs/v2027/` is gone: `inspirations.md` moved up to
  `_docs/`, and `spec.md` was **deleted** — it briefed a redesign that shipped, and its
  §3/§7 still described the numbered CSS partials and a four-theme selector that no longer
  exist. Everything durable in it already lived elsewhere; the one exception, why the daily
  cron exists (`future: false` hides post-dated articles), was salvaged into `hosting.md`.
- **`css-architecture.md` folded into [`styles.md`](styles.md) as §5**, in full. One doc now
  covers type, colour, branding, icons, and how the CSS is split.
- **`README.md` is human-only again** — the tooling/versions note moved to `hosting.md`,
  which now covers all hosting: GitHub Actions, the Cloudflare Pages backup, DNS/CDN, domain.
- Net: **9 docs where there were 11**, and every cross-reference repointed (docs, `CLAUDE.md`,
  and the comments in `styles.html`, `page.html`, `album.html`, `base.css`, `themes.css`).
- **Cloudflare Pages runs on Cloudflare's defaults** (Brajeshwar's call). No `.ruby-version`,
  no `.nvmrc`, no `RUBY_VERSION`/`NODE_VERSION` in the dashboard. The two builders therefore
  run different Ruby/Node versions on purpose — if a default moves and the backup breaks, we
  fix it then. Details in [`hosting.md`](hosting.md).
- **Process, from Brajeshwar: log history, don't erase it.** Reverse decisions in place with a
  date; leave dated log entries as written even when they name things since retired.

### Archives year jump-nav (2026-07-26/27, built + browser-verified)
A jump-nav for all 26 years on `/archives/`, pointing at the `#YYYY` anchors the
`<caption id>` elements already provided. `_pages/archives.html` + `archives.css` only —
**no new layout was needed** (it's a tier-2 per-page bundle, zero impact on other pages).
CSS-only, so it works with JS off.

**Revised 2026-07-27 — wide page, scrubber inside it.** `/archives/` moved off
`container-ideal` (665px) onto a new **`.container-wide` (`--body-width-wide`, 80rem/1280px)**,
the desktop target from the width research. **Opt-in per page, not a site-wide change** —
`--body-width-max` also sizes the header, footer and `.gallery` on every page, so bumping it
is the parked standardisation, not this. `.container-wide` is in `base.css` for `/books/` and
`/film/` to reuse.

That width forced the scrubber's architecture: it used to be `position: fixed`, offset from
the centred column into the viewport margin — which only worked *because* a 665px column
leaves a wide margin. At 1280px **there is no margin**, so it became a **grid column**
(`grid-template-columns: auto minmax(0,1fr)`) with `position: sticky` inside it. Measured:
38px wide (was 47), 20px gap, no overlap.

Also this pass: thinner rail, subdued rest colour (`--text-color-low`), and a hover that
darkens the text *and* adds a background. The hover background is
`color-mix(in oklch, var(--text-color) 12%, transparent)` — mixing the foreground rather than
using any `--bg-*` token, because none differs from the rail's own background in **both**
modes. Contrast measured by canvas pixel readback, not assumed: rest **12.01:1** in both
modes, hover **12.08:1** light / **10.09:1** dark, all clear of AA at this size.

⚠️ **The pill's effective corner radius is not the declared one.** `--border-radius-larger` is
25px, but top-left + top-right (50px) exceed the rail's ~38px width, so the browser scales
every radius by `width / sum` — **19px** in practice. The rail's vertical padding is
`--space-s` (20px) to clear that, so `26` and `01` start below where the curve finishes rather
than being pinched by it (measured: 21px inset against a 19px curve). If the rail's width or
that radius token changes, the effective radius moves with it — re-measure, don't assume 25.

The rail starts **11px below the first article row** (row top 191px, rail 202px) — it drops
past the year caption to sit with the rows it indexes. `margin-top` sets that resting offset
and `top` sets where it parks once stuck; they differ deliberately and it does not jump,
because sticky only displaces when `top` exceeds the resting position.

**Final shape (2026-07-27, after four passes): a HORIZONTAL strip across the content width,
hanging off the header rule.** Brajeshwar's iterations went top bar → left rail → right rail →
horizontal strip; only this last one is live. Its top edge is exactly the header's
`border-bottom` — *"the border becomes the start of the year scrubber"*. Square top with **no
top border** (the header rule already draws that line; a second reads as a 2px seam), rounded
foot only. It rises to meet the rule via `margin-top: calc(-1 * var(--space-l))`, cancelling
the header's bottom margin — ⚠️ **keep those two in step**, or the strip detaches and floats.

- **An auto-fit grid, not a flex row.** `repeat(auto-fit, minmax(2.5rem, 1fr))` is what lets it
  *"expand to fit all the years"* on a small screen: equal tracks, as many per row as fit, all
  26 always visible, no horizontal scrolling and **no ragged last row** — which is exactly what
  flex-grow would have produced (two leftover items stretched to half the width each). The two
  spare tracks collapse to 0px, so the years sit flush to both edges.
- **Row counts, measured** (against `main`'s width, with the list hidden so only the strip
  reflowed): `>=1200` → 1 row / 57px · `737–1186` → 2 rows / 98px · `460–600` → 3 rows / 139px ·
  `346–400` → 4 rows / 180px.
- **Sticky from 768px up, static below.** One or two rows are fine to follow the reader (98px
  is ~12% of a laptop viewport); three or four is not — on a phone that is a fifth of the
  screen held permanently, worse than just scrolling past it.
- ⚠️ **`scroll-margin-top` has to track the row count.** A wrapped 2-row strip is 98px, and the
  original 4.5rem/72px dropped the caption *underneath* it — the same bug as the first build,
  in a new place. Now 7rem from 768px and back to 4.5rem from 1250px, both verified clearing by
  ~15px. Re-check whenever the strip's padding, font size or row count changes.
- **DOM order is unchanged** throughout all four passes: the nav is first in the source, so
  keyboard and screen-reader users meet the 26-year jump list before ~1,456 rows of links.
- **Labels are 2-digit, anchors are not.** `href` and `id` keep the full year, so
  `/archives/#2024` still works; `aria-label` restores the full year for screen readers.
  Safe because `site.posts` spans 2001–2026 — the 2100-dated drafts in `_posts/todo/` are
  future-dated, so Jekyll never builds them in.

- **Single page with anchors, not `/archives/YYYY/` pages.** Vanilla Jekyll can't generate a
  page per year without a plugin (guardrail 3) — per-year URLs would mean 26 committed stubs
  plus one every January.
- **Rewrote the list with `group_by_exp`.** One grouping now feeds both the nav and the tables,
  so they can't disagree. Kills the old running-`date` variable that opened and closed
  `<table>` from two branches and shadowed Liquid's own `date` filter.
- **1,459 absolute URLs → 3.** The links were built with `prepend: site.url`; `relative_url`
  saved **27.6 KB** raw (356,037 → 328,381) and makes local preview work. Same bug class as
  the `assets/scripts/*.js` one recorded further down.
- **Two bugs caught by measuring in the browser, both of which would have shipped silently:**
  1. `scroll-margin-top: 3.25rem` (52px) put the caption **5px underneath** the 57px sticky
     bar. Now 4.5rem. The strip's height is content-derived and can't be read from a token —
     re-verify if its padding or font size changes.
  2. `--bg-color-high` is **not** a raised background — it bridges to `--color-primary`, the
     *foreground*. Using it for the hover and `:target` styles painted a near-black chip under
     dark text in light mode. Safe background steps are `--bg-color-lowest/-lower/-low` only.
     Replaced with a colour shift (matching `site-nav` in chrome.css) and an accent rule.
     Verified in both light and dark; a background highlight can't work here anyway, since the
     only distinguishable step collapses to the caption's own colour in dark mode.
- **Weight:** the page is **328 KB raw / 74 KB gzip** — 3.5× over the `design.md` non-article
  budget. Pre-existing; logged in [`todo.md`](todo.md) as a decision, not fixed silently.
- Verified in Chrome: build clean, Pagefind indexes the site, nav is `data-pagefind-ignore`d,
  rail and strip both jump correctly, both render in light **and** dark. The strip stays one
  row and scrolls sideways — it would wrap to 4 rows at 360px.
- ⚠️ **`resize_window` does not work on this machine** (reports success, `innerWidth` never
  changes — the OS window is maximised). To test a breakpoint, neutralise the `@media` rule
  through CSSOM (`rule.media.mediaText = '(min-width: 99999px)'`), measure, then restore it.
  That is how the narrow fallback was verified; don't waste time re-trying the resize.

### Header reworked (2026-07-27, built + browser-verified)
`_includes/css/chrome.css` + two new tokens in `config.css`. Affects **every page**.

- **Centred again.** `justify-content: space-between` → `center`. Brajeshwar's call: the logo
  and menu were pinned to opposite edges, making the nav a long mouse trip.
- **Narrow screens are one row, and shorter.** It used to stack into a column — logo, then
  nav, then tools, three rows of chrome before a phone reader saw content. Header height at
  narrow is now **51px vs 82px** on desktop; padding and bottom margin are reduced *only* at
  the breakpoint, since desktop spacing wasn't the complaint.
- **Icons are quieter than the words now.** They were on `--text-muted` (`--color-fg-muted`),
  *darker* than the nav's `--text-color-lower` (`--color-fg-subtle`) — the loudest thing in
  the header. The ladder bottoms out at fg-subtle, so going quieter meant `color-mix` toward
  the background, not a token swap. Measured: icons **3.83:1** light / **3.95:1** dark against
  the page vs the nav's 7.17 / 6.94 — about half the contrast, still clear of the WCAG 1.4.11
  **3:1** bar for non-text UI.
- **Vertical hairline** (`border-left` on `site-tools`) separates words from glyphs. Safe
  unconditionally because `site-nav` no longer wraps at any width, so it can't be orphaned.
- **Icon size decoupled from the logo.** New `--icon-button-size` / `--icon-glyph-size`; both
  used to be `--logo-size: 42px`, so shrinking icons would have shrunk the logo too. 32px
  buttons / 17px glyphs, stepping to 26/15 under 600px and **24/14 under 360px** — 24px is the
  WCAG 2.2 target-size floor, so savings below that come from padding, never the hit area.
- **Logo: 42px → 34px**, holding its proportion against the icons' 42 → 32 (ratio now 1.06).
  New `--logo-inset` (2px, 1px at the smallest step) with `box-sizing: border-box` insets the
  glyph so it sits inside the hover circle *without* changing the outer box — the header row
  measurements are unaffected.
- **Logo hover: the glyph's dark fills a circle and the β knocks out of it**, in 0.15s (was
  `transition: all 0.5s`, half a second on every property). **No `[data-theme]` branch needed
  for dark mode**: the fill is `--bg-color-high` (→ `--color-primary`) and the glyph
  `--bg-color-lower` (→ `--color-bg`), and both flip with mode, so the inversion is automatic.
  Verified in both. The glyph's bbox reaches ~95% of the circle radius, so it clears the edge.
- **Nav links underline on hover/focus** — the affordance `design.md` asks of every link, and
  the header was the exception. Deliberately **not** on `.active`: the current page should
  read as "you are here", not as something to click.
- **Appearance panel now hangs off its trigger** (2026-07-27). It was
  `position: fixed; top: 4rem; right: var(--space-s)` — pinned to the *viewport's* right
  corner, which was fine while the header was right-aligned but left the panel ~495px away
  from the icon once the header was centred. Now `position: absolute` inside
  `appearance-settings` (`position: relative`), `right: 0` so it opens **inward** and cannot
  run off a phone screen. Verified: right edges align exactly, 10px below the trigger, above
  the backdrop, and still on-screen at a 360px-wide header.
- Verified: fits in one row at 430/390/375/360/**320**px, all targets ≥24px, appearance panel
  and search palette still anchor inside the viewport, base CSS ~6.8 KB gzip on the homepage.

⚠️ **The bug worth remembering — @media blocks lose on source order.** The narrow-header block
was written *before* the `site-logo` / `site-nav` / `site-tools` rules it overrides. Those are
element selectors of equal specificity, so the later base rules won and the media block
silently did nothing: the nav kept `--step--1` and 10px padding, and the header needed **445px
at a 360px viewport** — a horizontal-scroll bug. What made it hard to spot is that
**custom-property overrides in the same block *did* work**, because those cascade by
inheritance rather than source order. So the icons shrank while the font and padding didn't,
and it looked half-applied rather than broken. **Media blocks must come after the rules they
override**; the comment in `chrome.css` says so at both ends.

### Chrome rules + ONE site width (2026-07-27, browser-verified)
- **Thin rules are back on the header and footer, at content width — not browser width.**
  The header's `border-bottom` sits on the header box, which is already the content band, so
  it stops at the content edges. The footer's `border-top` **moved from `<footer>` to
  `.footer-inner`** for the same reason — that reverses the earlier "outer footer spans the
  full viewport so the rule is edge-to-edge" decision, which is why the outer element exists;
  it now carries only spacing and the muted colour. Both use `--rule` (a 10% foreground mix),
  so they stay hairlines in light and dark; verified identical in both.
- **`--body-width-max` is 81rem / 1296px, and it is the ONLY content width.** Brajeshwar:
  *"Archives, and everything on the website should now run on the same width"*, then
  *"standardize at the size that encompasses the sidenotes too."* Verified aligned on `/`,
  `/about/`, `/archives/`, `/film/` and an article.
- **The width is derived, not picked:** `--measure` (665) + 2 × (`--sidenote-gap` 56 +
  `--sidenote-width` 256) = **1289**, rounded up to a whole 81rem. The article is centred, so
  the gutter is paid for on *both* sides — that doubling is the number. 1280 was 9px short,
  and measurement showed sidenotes rendering **5px past** the band, overhanging the header and
  footer rules that had just been added. Adding those rules is what made the gap visible.
- **`.sidenote` width now measures against the band, not `100vw`.** `min(96vw,
  --body-width-max)` replaces `100vw`, so notes clamp to the band instead of drifting into the
  margin outside it. Verified: 0px slack (exactly touching) at bands of 1200/1100/1000px, 3px
  inside at full width. The token and the formula now agree by construction — change one and
  the other still holds.
- **`--body-width-wide` and `.container-wide` are deleted.** They lasted about a day. Adding
  the chrome rules is what exposed the problem: with archives at 1280 and the header at 1216,
  archives content overhung its own header rule by **32px a side**. One width removed both the
  misalignment and the duplication.
- The **reading column is unchanged** (665px, `--body-width-ideal`) and is not a second site
  width — it's a reading constraint inside the band. Centres align; sidenotes still render.
- ⚠️ The wider band does **not** improve the sidenote floor. That gutter is measured from the
  reading column, which didn't move. Going asymmetric is still the only lever there.

### Earlier that day — standardise the site width (now resolved above)
Brajeshwar wants **one width instead of the current two** (`container-ideal` vs the full-width
`main`); the split exists because it was easier to maintain by hand, not because it was
designed. **Nothing is decided or built yet.**

The task, the research, and the open decisions are written up in
[`todo.md`](todo.md) → *Standardise the site width*. Two measured facts came out of it and now
live in the reference docs:

- **`1rch` = 10.08px**, so `--measure: 66rch` is a **665px** column — the ~8px/ch rule of thumb
  under-estimates it by ~130px. ([`styles.md`](styles.md) §1)
- **Sidenotes need a 1210px viewport**, because the centred column spends as much on the dead
  left margin as on the working right gutter. Going asymmetric would drop that to ~970–1010px.
  ([`sidenotes.md`](sidenotes.md) → *The viewport floor*)

Both were measured in Chrome against the built site (`/2022/plain-text/`), not calculated —
the first attempt at deriving them from the CSS was wrong.

### What happened this session (2026-07-19)
A CSS consolidation pass, start to finish. Full detail in [`styles.md`](styles.md) §5 —
`styles.md` is now the primary CSS doc.

- **CSS budget reconciled** — docs carried both "~10KB" and "≤42KB". Now one figure:
  **≤ 13 KB gzipped per page**, measured over the wire. Pages sit at 5.8–6.8 KB.
- **Flattened 25 numbered ITCSS partials → 12 named files.** `config` · `themes` · `base` ·
  `chrome` · `post` · `page` · `album` + per-page one-offs + `bookmarks`. **Don't reintroduce
  numeric prefixes.** Cascade order lives only in `styles.html`; `config.css` must stay first
  (it defines the `$breakpoint-*` SCSS vars, and media queries can't read custom properties).
- **New `album` layout** for galleries (film + devices). **`books` is prose, not a gallery.**
- **`page-full.html` merged into `page.html`** with a `full:` flag (currently no users).
- **Audited all 12 files** — fixed 2 real bugs, removed 35 dead custom properties.
  −2,012 B raw / −0.35 KB gzip on every page.
- **Dropped Geist** — near-duplicate of the system stack, 165 KB unsubsetted ttf.

### Rules learned this session — worth not re-learning
- **CSS comments are free; HTML/Liquid comments are not.** `sass: style: compressed` strips
  block comments from CSS, so prose in `_includes/css/*.css` costs zero shipped bytes.
  An `<!-- HTML comment -->` in a layout **does** ship to all ~1,456 pages — use
  `{%- comment -%}` there. Verified both ways.
- **Custom property DECLARATIONS ship even when nothing reads them.** Comments are stripped;
  declarations are not. An earlier note in `config.css` claimed otherwise and had licensed
  ~1.6 KB of dead tokens. Don't add speculative tokens.
- **Never use a bang comment** (`slash-star-bang`) — it survives compression.
- **Never write a literal `*/` inside comment prose** — it closes the block early and the build
  fails with a misleading "expected selector" pointing at `styles.html`. Cost one build.
- **Browser caches JS hard on a plain `python3 -m http.server` / `jekyll serve`.** A JS change
  can look like it didn't take when the built file is correct. Hard-reload (cmd+shift+r) before
  concluding anything. Same trap `search.md` documents for `search.js`.
- **Verify, don't infer.** Two claims in the old docs were wrong on inspection (`/books/`
  "unstyled"; footnotes "posts-only"). Both were caught by checking the actual files.

### Verification state
Build clean. Rule-set diffs confirm only intended changes. Browser-verified at 1440px across
light/dark and default/nord/eink: homepage, `/about/`, `/film/`, `/devices/`, `/search/`, and a
post with code. Contrast measured on code blocks: light ≥ 5.68:1, dark ≥ 7.66:1, nord-dark
≥ 5.92:1, eink-light 4.49:1 (comments, a hair under AA — a property of the shared
`--color-fg-subtle` token, documented, not introduced here).

### Picking this back up
1. **Push** (or review first): `git log -p origin/main..HEAD`.
2. **Highest-value next task**, with evidence already gathered: `search.css` hand-copies ~6 KB
   of Pagefind's own stylesheet, which `_pages/search.html` already links separately. Needs
   `make serve` (Pagefind built) to byte-compare before cutting. See
   [`todo.md`](todo.md) → *From the 2026-07-19 CSS audit*, which has 7 verified-but-not-done items.
3. **Two open design calls for Brajeshwar**, not bugs to fix silently:
   - Dark-mode image dimming is dormant *and* inverted (keys off OS, not `[data-theme]`).
     Turning it on correctly changes every image on the site.
   - The design hook flags **Geist** as an overused font in `themes.css` — now moot, the font
     is gone, but if the warning reappears for another face the suppression command is
     `/impeccable hooks ignore-value overused-font <Face> --shared`. Only Brajeshwar runs it.

### Older state (still true)
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
- **Hosting decided** — keep the `brajeshwar.github.io` repo name (don't rename), use
  Cloudflare for DNS + CDN proxy. **Reversed 2026-07-26: Cloudflare Pages is no longer
  dormant** — it now builds the same repo as a backup, while brajeshwar.com stays on GitHub
  Pages. The build versions moved out of `README.md` into `hosting.md` at the same time. See
  [`hosting.md`](hosting.md).
- **Fixed 2026-07-05:** dev files (`CLAUDE.md`→`/CLAUDE/`, `Makefile`, `scripts/`) were being
  published — now in `_config.yml` `exclude`. Re-check `_site/` after editing `exclude`.

## Docs index
- [`design.md`](design.md) — **design philosophy** (the *why*): text-first, ornament-free, decoupled/portable styles, progressive enhancement, reader's choice.
- [`styles.md`](styles.md) — the **style specifics and the CSS architecture**, five sections: §1 typography (scales, font axis Default/Sans-Serif/Serif, Kindle text-size), §2 color & theming (**Ovellum two-axis**: mode `data-theme` auto/light/dark × palette `data-palette` default/nord(Cool)/eink(Warm), + accent, bridge, no-flash), §3 branding, §4 icons, §5 **how CSS is split** (12 named files, three tiers, which layout pulls which bundle, the rules for adding more, the old→new filename map, the 2026-07-19 audit + backlog). **Read §5 before touching `_includes/css/`.** Absorbed `css-architecture.md` on 2026-07-26.
- [`sidenotes.md`](sidenotes.md) — Tufte margin sidenotes built from kramdown footnotes (Phase 2) + Aresluna wayfinding.
- [`search.md`](search.md) — site-wide header search, lazy-loaded Pagefind.
- [`agents.md`](agents.md) — plain-text Markdown twins (`/x.md`) + `/llms.txt` for AI agents; post-build step like Pagefind.
- [`hosting.md`](hosting.md) — **everything hosting**: GitHub Pages + Actions (and the build
  versions, moved from `README.md`), the Cloudflare Pages backup build, DNS/CDN, and the
  domain decisions.
- [`todo.md`](todo.md) — running site task list.
- [`inspirations.md`](inspirations.md) — article-craft studies (Aresluna deep-dive; Yale e360, BBC, The Walrus, iDiallo).
- [`/CLAUDE.md`](../CLAUDE.md) — short guardrails for AI agents working in the repo.

---

## What this site is

A **serif, reading-first** site in the spirit of **Tufte CSS** — long-form articles with
**right-margin sidenotes derived from the footnotes kramdown already emits**, plus reader-set
appearance (theme mode × palette, font, accent) that persists across visits. Tight code,
content and presentation cleanly separated, **zero content files touched**.

There is no versioned redesign to work toward. The 2026 re-skin shipped; from here the site
just keeps evolving in small, reviewable steps. (It was called "v2027" while in flight — the
name was retired 2026-07-26 along with `_docs/v2027/`.)

- **Stack:** Jekyll + kramdown + Pagefind, deployed to GitHub Pages via GitHub Actions.
- **Branch:** `main`. Every push auto-deploys.
- Presentation lives **only** in layouts, includes, CSS, JS, and build config.

## Non-negotiable guardrails (full list in CLAUDE.md)
1. **Never modify content** — no edits/no added front matter under `_posts/**`, `_drafts/**`, `_pages/**` bodies. `_data/*.yaml` off-limits except `nav.yaml` (with approval). ~1,393 of ~1,463 posts have **no front matter**; titles come from the `# H1` via `jekyll-titles-from-headings` + `jekyll-optional-front-matter`.
2. **Preserve every URL** — permalink `/:title/`; 25 years of links (2001–2026) must not break.
3. **Stay on Jekyll + Pagefind + kramdown** — no new SSG, no Markdown-engine swap, no new plugins unless a phase calls for it, no `_plugins/` hooks.
4. **Progressive enhancement** — fully readable with JS disabled (real footnotes at article foot, sensible default theme). JS only *enhances* (sidenotes, theme persistence).
5. **Sidenotes from existing footnotes only** — CSS/JS, no new authoring syntax, no per-post markup.
6. **Vanilla JS only** — no frameworks, no JS/CSS build step beyond Jekyll's SCSSify includes.
7. **Commit authorship** — never attribute commits to Claude/Anthropic; no "Generated with Claude", co-author trailers, or AI references in messages/comments. **Brajeshwar makes the commits** — prepare and show diffs for review; commit only if he explicitly asks (still no AI attribution).
8. **Reviewable diffs** — one concern per change; don't mix a refactor with a redesign.

## Architecture to honor
- CSS = **12 plainly-named files** in `_includes/css/`, **inlined** into `<head>` via `styles.html` (`{% capture %}` + SCSSify). Base bundle stays embedded and **under 13KB gzipped** per page (measured over the wire, not raw).
- ⚠️ **Filenames changed 2026-07-19.** Flattened from 25 numbered ITCSS partials (`0.0-config.css`, `2.1-code.css`, …) to `config` / `themes` / `base` / `chrome` / `post` / `page` / `album` + per-page one-offs. **Older entries below still use the numbered names** — see the old→new map in [`styles.md`](styles.md) §5 → *Old → new filename map*. Cascade order now lives only in `styles.html`; `config.css` must stay first (it defines the `$breakpoint-*` SCSS vars).
- **CSS tiering decided + implemented 2026-07-19** — stay embedded (no external stylesheet); split by **layout**, not by page: base on every page → one bundle per layout (`post`/`page`/`album`) → per-page opt-in for genuine one-offs only. Shipped the same day: syntax highlighting fixed + tokenised onto `--code-*`; new `album` layout (film + devices, **not** books — that's prose); `page-full.html` merged into `page.html` with a `full:` flag. Full rationale + the orphan-partial findings: [`styles.md`](styles.md) §5.
- **Layouts are now**: `default` · `post` · `page` (reading width, `full: true` for full-bleed) · `album` (galleries) · `redirect`.
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
4. **Cleanup** — dead-CSS pass, AnchorJS decision, "no hardcoded color" grep, base bundle under budget.
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
  - **Hardcoded colors** — clean outside the known exceptions: `2.1-code.css` (pygments) and `4.1-search-pagefind.css` (Pagefind UI vars — left as-is per SPEC §9). No stray colors elsewhere. **Update 2026-07-19: `2.1-code.css` is now tokenised onto `--code-*`, so `4.1-search-pagefind.css` is the only remaining exception.**
  - **CSS budget** — history: original note ~10KB → raised to ≤42KB → **tightened to ≤13KB gzipped per page (2026-07-19, current rule)**. The budget is measured **gzipped over the wire**, not raw. Measured 2026-07-19 from `_site`: books 6.1KB, archives 6.3KB, article 6.6KB, home 6.8KB, search 7.2KB gzip (27.3–34.4KB raw). **All pass with ~5.8KB headroom.**
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
  - **Browser-verified**: default light/neutral/sans; Nord+Dark+Geist → Nord-dark slate bg, Geist font; persisted across reload with no flash. Builds clean; inlined CSS ~29KB raw (budget is now ≤13KB gzip — see the CSS budget note above).
  - **Accent axis wired (live-verified).** Appearance panel has an **Accent** group: 6 swatches (Blue/Purple/Green/Amber/Red/Cyan, Ovellum's oklch values) + Default + custom `<input type=color>`. Sets inline `--ov-accent` + `data-accent=custom`, persisted to `localStorage('accent')`, applied by the no-flash snippet. The ported `[data-accent]³` rule maps it onto `--color-accent` + `--color-primary` (links, nav pill, logo recolour). Verified: Blue accent → blue links/nav/logo, persists across reload.
  - **Still deferred:** `data-text-size` (conflicts with the site's Utopia `--step-*` scale — would need a base-size multiplier).
- **Carry-over / iterate-later:**
  - Footer grouping is a guess — re-bucket as you like.
  - Sidenote hover/focus highlight; tune `--sidenote-width`/breakpoint on long or clustered notes.
  - Migrate components off legacy color tokens (`--bg-color-*` etc.) onto the semantic ones (`--bg`, `--text`, …) — a tidy-up, not required for function.
  - Optional further CSS trimming by moving content-only partials out of the always-inlined base — not needed given the current headroom under the 13KB gzip budget.
- **Local dev loop (`Makefile`).** `jekyll serve` does NOT build the Pagefind index (only CI does) → ⌘K shows "Search isn't available right now" locally. Use **`make serve`** (build + `npx pagefind --site _site` + `jekyll serve --skip-initial-build --no-watch`) for working local search; `make dev` for fast live-reload without search; `make build` / `make pagefind` / `make clean`. See [`search.md`](search.md).
- **Appearance panel reworked (Brajeshwar; browser-verified).** `appearance.js` axes:
  - **Font** → 3 choices: **Default** = `sans` (system, no webfont, fast), **Sans-Serif** = `geist`, **Serif** = `serif` (Libre Baskerville). Inter removed (option, `@font-face`, and `assets/fonts/inter/` deleted). **Superseded 2026-07-19: Geist removed too — the axis is now TWO choices, Default (system) + Serif (Libre Baskerville).** Geist was a neo-grotesque sitting very close to the system stack it was an alternative to, and shipped as a 165 KB unsubsetted `.ttf` (the site's heaviest asset). Libre Baskerville is now the only webfont. Stale `localStorage` values need no migration — `appearance.js` validates against its option list and the no-flash snippet whitelists `'serif'`. See [`styles.md`](styles.md).
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
- **Docs reorg (this session).** `_docs` filenames lowercased; `COLOR.md`+`TYPOGRAPHY.md` folded into **[`styles.md`](styles.md)** (type → colour → branding); new **[`design.md`](design.md)** (philosophy) and **[`todo.md`](todo.md)** (site task list, from the `tmp/` braindump); article-craft studies (Yale e360, BBC, The Walrus, iDiallo) added to [`inspirations.md`](inspirations.md). Empty root `TODO.md` stub removed (consolidated into `todo.md`).
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
- **Sidenote/layout iteration (this session; headless-Chrome-verified at 1512/1280px).**
  Sidenotes were colliding with the negative-margin breakout designs (`.large`/`.full`
  images, `.gallery`, `aside.right` all poke into the same right viewport margin the notes
  hang in). **Tried a left-aligned article layout** (column flush left in a homepage-width
  container, notes in the structural right gutter) — **Brajeshwar rejected it ("too lefty");
  the article column stays viewport-centered**, all left-alignment CSS reverted (no
  `.container-article`; breakouts keep their original viewport-centered rules). What the
  exercise produced and **kept**:
  - **Measure fixed: `--measure: 66ch → 66rch`** (surfaced when the article briefly carried
    its own cap and `66ch` inflated ~665→822px — Brajeshwar: "too wide"). `ch` resolves
    against each element's own font-size; `rch` resolves at the root (16px), so every use of
    the token (`.container-ideal`, `figcaption`, `photo-cover__desc`) is the same ~665px
    column, stable across reader font choices. Needs ~2023+ browsers (Safari 16.4 / Chrome
    111 / Firefox 128). See [`styles.md`](styles.md) §Reading measure.
  - **`sidenotes.js` dodges wide media**: `collectObstacles()` records the vertical ranges of
    `.full`/`.large`/`.gallery`/`aside.right` elements that cross past the column's right
    edge; a note whose slot intersects one is pushed below it (verified: notes clear the
    full-bleed floppy + `.large` flower on `/2025/fixing-a-dos-computer-for-the-army-1993/`).
    This was the actual fix for "sidenotes break article designs".
  - **Sidenote fit**: `--sidenote-gap` 2.5→**3.5rem**; `.sidenote` width now **fluid** —
    `min(16rem, (100vw − column)/2 − gap − 1rem)` (`2.1-footnotes.css`) so notes shrink to
    the available margin instead of overflowing the viewport (they previously overflowed at
    ~1120–1300px widths); `--sidenote-min-gutter` 14→**17rem** + `MIN_GUTTER_REM` synced, so
    notes only appear (from ~1210px viewports) when a ≥12rem note genuinely fits.
  - Net files: `0.0-config.css`, `2.1-footnotes.css`, `sidenotes.js` (+ docs `styles.md`,
    `sidenotes.md`). **Uncommitted — staged for review.**
