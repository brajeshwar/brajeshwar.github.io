# MEMORY — brajeshwar.com docs hub

> `_docs/` is the home for brajeshwar.com documentation. This file is the index +
> working memory: what we're building, the rules, and where things stand. Read it
> first each session; keep it current.

## Where we are (updated 2026-07-27) — READ FIRST

### ⏸ 2026-07-27, second session — 4 commits ready, NOT pushed.
All signed (`%G?` = `G`) and in Brajeshwar's name. Nothing is broken and the tree is clean;
these are simply waiting on his word, per guardrail 7.

    e359263c  Externalise the CSS into one cache-busted stylesheet
    3b4218f3  Load sidenotes and anchors only where they have work, drop analytics
    0ba0cb72  Turn syntax highlighting off and delete its stylesheet
    22cb3522  Split code and cards out of the base CSS tier

**All four are page-weight work, and the last one is the big change:** the CSS is no longer
inlined. See *Architecture to honor* below and [`styles.md`](styles.md) §5 for the reasoning,
which reverses a decision made the day before — after measuring the live cache headers rather
than assuming them.

⚠️ **The first deploy after this exercises `scripts/hash-assets.mjs` for the first time.**
It has been verified against a full local build (1,486 pages, 7,955 references rewritten, and
it fails the build if anything it hashed ends up referenced by nothing), but it has never run
in CI. Watch that first Actions run.

⚠️ **Push only when Brajeshwar asks** (CLAUDE.md guardrail 7). Committing is fine; every push to
`main` auto-deploys.

⚠️ **All commits are signed and in his name.** `commit.gpgsign` is on and the key is in the
agent, so it is automatic — but **verify** with `git log --format='%h %G?'`. A history rewrite
already cost 882 signatures once; see the entry below before running one.

**Node 22, the esbuild minify step and the Geist woff2 all ran green in CI** and were verified
on the live site: `Geist-Variable.woff2` serves at 47,596 bytes, the `.ttf` 404s as intended, and
`back-to-top.js` arrives minified. That whole risk is now closed.

### The state, in one paragraph
The site is on **one width — 64rem/1024px — and everything agrees on it**: header, footer,
`main`, post titles, wide images, captions, videos and embeds, the prev/next bar. Wide media
breaks out **to the right only**, never into the left margin, because the reading column is
left-aligned in the band and that left edge is the page's alignment line. **`photo-cover` is the
one deliberate exception** — a full-bleed hero to 1600px, flush under the header rule. Colour is monotone by default with three
palettes (Warm is now **Flexoki**); the reader also picks mode, font (System / Sans-Serif /
Serif) and text size, all persisted. JS is eight small vanilla files, minified on publish.

### What changed this session (2026-07-27), reader-visible
1. **Warm palette is Flexoki** — ink-on-paper `#FFFCF0` / `#100F0F`.
2. **Wide images break out rightward** and stop at the band, instead of spilling into both
   margins. Post titles and captions take the band too.
3. **Prev/Next reworked** — flush edges, a notch divider, hover, moving arrow; full width when
   there is only one link.
4. **Back to Top floats then settles** above the footer; arrow only.
5. **Search results are themed** — they had been rendering as default Pagefind, yellow
   highlights and all.
6. **Serif readers get their apostrophes back** — a `unicode-range` bug had been sending
   `’ “ ” – — • …` to the fallback font, 3,197 times in a 400-page sample.
7. **Images are no longer dimmed in dark mode.**
8. **The appearance panel is a two-column grid**; Font's first option is "System", not "Default".

### Rules learned this session — these will bite again
- **`post.css` loads after `base.css` at equal specificity, so it silently wins.** Four separate
  bugs from this: `.post { margin }`, `.post-nav { margin }`, `.post img { width }` beating
  `img.full`, and the `.container-ideal` shorthand cases. **In `post.css`, set only the axis or
  property that rule has business setting, and exclude what `base.css` sizes.**
- **A `margin: X auto` shorthand cancels `.container-ideal`'s `margin-inline`.** Use
  `margin-block`.
- **Font-scope bugs are invisible by default** — they only show for readers who picked Serif or
  Sans-Serif. New controls inside `main` must be added to the sans list in `base.css`.
- **Audit entries written from reading are unreliable.** Three of the five "highest value" items
  were misfiled; measuring disagreed each time. Measure first.
- **`nowrap` lets a cell overflow without ever wrapping** — so "did it wrap" is the wrong test.
  Compare content box against text width.
- **The browser caches `assets/scripts/*.js` across a normal reload.** `cmd+shift+r` after
  editing JS; a query string on the page URL does not help.
- **`python3 -m http.server` is single-threaded** and starves under a blocking CDP eval, which
  makes images look permanently unloaded. Use `ThreadingHTTPServer` for anything image-dependent.

### How to verify a change (the loop that works)
    make build          # jekyll + agent-md + esbuild minify + pagefind — production parity
Then serve `_site` statically and check in a browser.

⚠️ **A long-running `jekyll serve` will fight you, in two ways.**
1. It does not build the search index, and its `--watch` **wipes `_site/pagefind/`** on every
   rebuild.
2. **It reads `_config.yml` once, at startup.** A server left running from before a config
   change keeps regenerating `_site` with the OLD config. Caught at the end of 2026-07-27: the
   excluded `Geist-Variable.ttf` kept reappearing in `_site` and `llms.txt` kept vanishing,
   which looked like the `exclude` had failed. A fresh `jekyll build` was correct both times.
   **If `_site` disagrees with the config, restart the server before debugging anything else.**
3. **It also overwrites `_site` mid-comparison.** An A/B of two builds gave a "difference" that
   was really their `--future` localhost build landing between the build and the copy. Use
   `jekyll build --destination <dir>` for any before/after comparison, never the shared `_site`.

For anything involving sidenotes, images, search or `_config.yml`, use the full build and serve
it statically. `python3 -m http.server` is single-threaded and starves under a blocking eval —
use `ThreadingHTTPServer` when images matter.

Guardrail check before handing back:

    git diff --name-only origin/main..HEAD | grep -E '^_posts/|^_drafts/|^_data/'

Should return nothing but Brajeshwar's own content commits.

### Picking this back up — the shortlist
Full list in [`todo.md`](todo.md). The ones worth doing next, in order:
1. **`.sidenote` is declared in two blocks** (`base.css` 563 and 609) and repeats 6 declarations
   with `.sidenote-inline`. Deliberately left: it is a refactor of live behaviour, best done with
   the sidenote work rather than as a tidy.
2. **Two spacing systems** — ratio `--space`/`--space-smaller` vs fluid `--space-*`, **10 call
   sites** across five files (the old entry claimed 3). Each is a visible value, so it needs a
   look, not a sweep.
3. **Images have no `width`/`height` attributes.** This causes layout shift on every image and
   was the root of the sidenote-overlap bug (patched with a `ResizeObserver`, not cured).
   Fixing it properly is content-adjacent — Brajeshwar's call.
4. **Home** is parked pending his decision on the books treatment (SVG covers vs text block).

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

### The pill becomes a component; Back to Top comes in from the corner (2026-07-27, browser-verified)

Brajeshwar: *"Create a pill-like component, which we will re-use where needed. For instance,
the one from the Theme Selector. Use that clean, minimal, pill selector in `/about/` for
Life / Work too. Instead of the square selection icon, let's change that to a clean, darker
circle."* And: *"For the Scroll to Top, it needs a hover (darken the background). Bring it
within the body width… positioned just above the footer, separating with our standard
rhythmic spacing."*

**`.pill` extracted into `chrome.css`.** The appearance panel's segmented look is now a shared
component — `.pill` (track) / `.pill__option` (segment) / `.pill__marker` (dot). Both users
emit both class sets: `appearance.js` writes `pill appearance-options …` and
`pill__option appearance-option`, so `.appearance-*` survives purely as the hook for
panel-specific sizing (the text-size row). `.appearance-options` is now **one declaration**
where it used to carry the whole look.

**`/about/` Life/Work wears it.** The old square `label::before` checkboxes are gone; each
label is a `.pill__option` holding a `.pill__marker` — a ring at rest, filled once chosen —
and the chosen segment darkens. Still zero JavaScript: real `<input type="checkbox">`
elements drive it, so `:checked + .pill__option` re-declares the "on" look that
`[aria-pressed="true"]` gives the panel. Three selectors, one set of declarations.

Verified live: both on (light + dark), one on, and the **no-JS `:target` path** — with
`.timeline-js` removed and `#work` in the hash, 12 work entries showed, 2 life entries hid,
and the pill reflected it rather than contradicting the page. The *"at least one always
selected"* guard survives the new markup: with Work off, both the Life label **and its marker
span** compute `pointer-events: none`, and hit-testing at each of their centres falls through
to the fieldset — so a pointer cannot clear the last track.

**Fixed while extracting: the focus ring was invisible on a chosen segment.** It was
`outline: … solid var(--accent)` with `outline-offset: -3px`, so the ring is drawn *inside*
the segment on its own fill — and on a chosen segment that fill is `--color-primary`, which is
essentially the same colour `--accent` resolves to. Near-black on near-black in light, near-
white on near-white in dark. **Invisible in both**, and it had been shipping that way in the
appearance panel. Now `solid currentColor`, which is `--color-primary-fg` when chosen and
`--text-muted` when not, so it contrasts with whatever it sits on by construction. Verified by
tabbing in for real (`.focus()` does not reliably match `:focus-visible`) in both modes and on
both a selected and an unselected segment. The accent swatches keep `--accent` — their offset
is positive, so their ring lands on the page background.

**Back to Top: floats, then settles — and lost its label.** Brajeshwar: *"Remove the text
'Back to Top'. Keep the arrow. It is not fixed at the footer. I wanted it to be visible once a
user starts scrolling and beyond certain scroll height. So, this should start floating and
then settle above the footer (what it is currently)."*

Now a 32px circle with just the arrow (`aria-label` + `title` carry the name), and **both the
float and the settle come from one `position: sticky; bottom: var(--space-l)`** on the row —
no fixed/static swap, no per-scroll measuring. Mid-page the row's own place in the document
is far below the fold, so sticky pulls it up off the viewport bottom; near the end that place
scrolls into view and the row comes to rest where it actually lives. The settle is not an
effect, it is the row arriving at itself. Measured: floating at exactly 40px off the viewport
bottom, released to 288px at the foot of a long post, settled at 80 above / 30 below.

JS decides only *whether* it shows (`scrollY > 1 viewport`, coalesced into a rAF), never
where.

⚠️ **This needed a change in `base.css`: `body { height: 100% }` → `min-height: 100%`.** The
definite height made the body BOX exactly one viewport tall on every page — content just
overflowed it visibly, so nothing ever looked wrong — but a sticky child is clamped to its
containing block, so the control could not float past the first screen. Verified nothing
depended on it: the four other `height: 100%` rules in the CSS are all deep in the tree with
their own sized parents, `/contact/` still fills the viewport (body 861 = innerHeight), and
the homepage's `height: 100%` cards are unaffected.

Two more non-obvious pieces:
- **Row `pointer-events: none`, button `auto`.** The row is a full-band-width strip lying
  across the content while it floats; without this it would swallow clicks on the text
  underneath. Hit-tested: a point in the strip 60px left of the button returns the article.
- **The disc must be opaque** (`--bg-color-lower`), and the hover mix goes *into* that rather
  than into `transparent` — a see-through disc with prose crossing it is unreadable.

Hover darkens via `color-mix` of the foreground — **not** a `--bg-*` token, because
`--bg-color-high`/`--bg-color-higher` both bridge to `--color-primary`, which is a
*foreground* colour and would paint a near-black chip under dark text. That trap has now been
hit twice; the comment in `chrome.css` names it.

Spacing at rest: the row takes the `--space-2xl` seam the footer used to own and sits
`--space-m` above it, so it reads as the footer's approach rather than as something tacked
onto the article. This needs `.back-to-top-row + footer { margin-top: 0 }` — **adjacent
margins collapse to the larger**, so the footer's own `2xl` otherwise stranded the control
mid-gap. Caught by measuring, not by looking. The hide is `visibility`/`opacity`, not
`display`, so the row keeps its box and the footer never jumps as it fades in.

⚠️ **Verified with the `computer` scroll action, not `window.scrollTo`** — see the automation
note below; programmatic scrolling fires no scroll events here, so the show/hide threshold
would have looked broken. Full sequence checked on a 38,000px post: hidden at the top, fades
in past one viewport, floats at the band's right edge, settles above the footer, fades out
again on the way back up.

⚠️ **The browser caches `assets/scripts/*.js` across a normal reload.** A `jekyll build` plus
`navigate` showed the NEW inlined CSS with the OLD script still running — the arrow-only
markup was simply absent and it read as a broken script. `cmd+shift+r` is required after
editing a JS file; a `?cachebust` query on the page URL does not help, since it is the script
request that is cached.

Budget after all of this: **6.9–7.3 KB gzip** inlined per page (33–35 KB raw), well under 13 KB.

### Back to Top, first cut (2026-07-27) — superseded above
Replaces the per-period *"↑ earlier / ↓ back to the start"* links on `/about/`, which were
hand-maintained — each named a sibling id, so adding or reordering a period silently pointed
them somewhere wrong — and existed on that page only.

`assets/scripts/back-to-top.js` + `.back-to-top` in `chrome.css`. Two conditions, both
deliberate: the control is only **built** on a page taller than 2.5 viewports, and only
**appears** once the reader is a viewport down. Verified `/about/` (6.15× tall) builds it and
`/contact/` (1×) does not. *(The "appears once a viewport down" half was dropped when the
control moved into the flow — see above. The 2.5-viewport build condition stands.)*

It is a real `<a href="#top">` — `#top` is defined by HTML as the document top, so the link
works with no click handler, and the global `scroll-behavior: smooth` animates it, which also
means it inherits the `prefers-reduced-motion` kill switch instead of needing its own check.
JS only toggles visibility.

⚠️ **Testing note: programmatic scrolling fires NO scroll events in this automation context.**
`window.scrollTo` moved the page 1,722px and produced **0** events, which made the control look
broken across several checks while the logic was fine — a manually dispatched event toggled it
correctly, and real wheel scrolling worked first time. **Verify scroll behaviour with the
`computer` scroll action, not `window.scrollTo`.**

### Copy-paste templates, and a sidenote regression fixed (2026-07-27)
- **Templates in `_pages/about.html`** — a period and a sidenote, in a **Liquid** comment so
  they cost nothing to ship. As an HTML comment they added **3,725 bytes** to `/about/` for
  something only the author reads. Verified inert: absent from the built HTML, present in source.

⚠️ **Making pages full-width silently broke sidenotes on pages** (commit `54ea75e8`).
`sidenotes.js` looks for the reading column to hang notes off; removing `.container-ideal` from
`page.html`'s article removed the column. `/books/` and `/about/brajeshwar.com/` lost their
margin notes — **and nothing looked broken**, because footnotes still rendered at the foot,
which is the designed fallback. Found by measuring: 2 refs, 0 sidenotes.

Fixed two ways:
1. `sidenotes.js` now matches **`.container-ideal`** rather than `article.container-ideal`, so a
   hand-written page can opt in with a `<div class="container-ideal">` wrapper.
2. `page.html` puts the class back **when the rendered content contains a footnotes block**.
   Detected from content, not a front-matter flag, so it cannot drift.

⚠️⚠️ **Liquid's `assign` does NOT evaluate `contains`.** The first attempt hoisted the test into
`{%- assign has_footnotes = content contains '…' -%}` — which fails *silently and truthily*, so
**all 22 pages** got the class. `contains` is only evaluated by `if` / `unless` / `case`; the
test has to live inline in the `if`. Caught by checking a page that has no footnotes.

Trade-off recorded in the layout: a footnoted page is measure-width throughout, so a grid on it
will not span the band. Both current users are pure prose. A page needing both should wrap only
the footnoted part.

### Content base moves onto `main` — pages match posts (2026-07-27)
Brajeshwar: *"the font-size of the articles (posts) are good, but I see the ones in the pages
are smaller."* Root cause: `body { font-size: var(--font-size) }` is a flat **16px** that
bypasses the type scale, and **`.post` was the only rule reading `--step-0`**. Posts were never
special — they were the only content on the scale. Everything else inherited 16px.

**`main { font-size: var(--step-0) }`** now, which fixed a second, unreported bug at the same
time:

⚠️ **The Kindle text-size control did nothing on pages.** The A-buttons multiply `--step-*`
inside `main`, but page prose was inheriting body's literal 16px, which no multiplier touches —
**measured identical at xs/s/m/l/xl before the change**. Reading the size from `--step-0` *at
main*, where the scaled values are defined, is what lets the control reach it. After: pages run
17 / 18.5 / **20** / 21.5 / 23px across the five settings, exactly like posts.

- Deliberately on `main`, **not `body`** — body also parents the header and footer, and raising
  it would have inflated the chrome with the content. Verified unchanged: nav 16px, colophon
  10.67px, body 16px.
- `.post { font-size: var(--step-0) }` removed as a restatement. Posts verified still 20px,
  text-scale still working, sidenotes still rendering.
- `--font-size: 16px` in `config.css` is now referenced by `body` only. It is a hand-picked
  number in a codebase whose golden rule is *"never hand-pick a font-size"* — left alone for now
  because body's value is what the chrome inherits, but it is the next thing to put on the scale.

### Pages fill the band; the card grid goes fluid (2026-07-27)
- **`/about/` gained an intro slot** above the timeline and outside `.timeline-period`, so the
  Life/Work filter can never hide it — verified visible under both filters. Placeholder text
  and the `/about/brajeshwar.com/` link are there for Brajeshwar to replace.
- **Every page fills the standard band.** `page.html`'s `.container-ideal` wrapper is gone —
  that was what held prose pages at 665px inside a 1024px band. `page.css` now caps the TEXT
  elements at `--measure` instead, so a grid or table spans the width while paragraphs keep
  ~66 characters. Verified on `/books/`: article 1024, prose 665, left-aligned, **content
  untouched** (he asked for his text to be left alone). **`full: true` is now inert.**
- **`ul.item__cards` is a fluid grid**, was `flex-flow: row wrap` with a fixed 220px card cap —
  which packed left and left a ragged gap that grew with the window.
  `repeat(auto-fill, minmax(var(--card-min), 1fr))` now. Verified on `/film/`: 5 equal 193px
  columns spanning exactly 1024px, images filling their cards.
  ⚠️ **auto-fill, NOT auto-fit** — auto-fit collapses empty tracks, so a two-item section would
  stretch across the whole band. The archives strip wants exactly the opposite and uses
  auto-fit; the difference is whether a short row should fill or stay card-sized.
- Card density is now one knob, `--card-min` (11rem, 8rem on phones), not a max-width per card.
- **Layout patterns are named in [`styles.md`](styles.md) §6** — reading, timeline, album,
  listing — with the rule that timeline is a shared *look* with no shared file, and that a
  third timeline page is the trigger to extract a real layout.
- `/books/`, `/photos/`, `/wear/` were **not** converted: none has thumbnail data yet, and
  Brajeshwar explicitly asked that `/books/` text not be replaced.

### Headings follow the ONE shared scale (2026-07-27)
Brajeshwar: *"we already have a common style for all titles … all Hx styles should be the
same."* He was right — `base.css` has defined it all along: `h1`–`h6` at
`--font-weight-light` on the Utopia steps (h1 `--step-3` … h6 `--step--2`), `line-height:
var(--scale-small)`, `text-wrap: pretty`. The timeline and /now/ were overriding it.

**Removed every typographic override** from `.timeline-head h1`, `.timeline-when`,
`.timeline-title` and `.page-now h1` — size, weight, colour, letter-spacing, tabular figures.
They now take the shared scale purely from their heading LEVEL. Verified computed values match
a bare `h1`/`h2`/`h3` exactly: **39.06 / 31.25 / 25px, weight 200**, same colour; a clean
descending hierarchy of page title → period → entry title.

What stays in those rules is structural only: the `position: relative` the § anchor needs, the
spacing, `scroll-margin-top`, and the `-0.06em` optical nudge. That nudge is an *alignment*
correction, not typography — larger digits carry more left side bearing, so the painted glyph
drifts right of the spine. Being em-based it now tracks whatever size the shared scale gives.

**To resize a heading, change its LEVEL or the shared scale — never the component rule.** That
is the whole lesson: the previous pass had reached for `--step-2` directly and produced a
timeline whose headings agreed with nothing else on the site.

⚠️ **`/now/`'s years are `h1`, `/about/`'s periods are `h2`**, so /now/ renders one step larger
(step-3 vs step-2). That is the shared scale behaving correctly on different levels, not a
style difference. Matching them means changing `#` to `##` in the `now/` fragments — a content
edit, and Brajeshwar's call.

### Timeline section titles: bigger, nudged left (2026-07-27) — superseded above
Brajeshwar: *"the breaks in the timeline due to the section titles is too jarring."* The cause
was that the year sat at `--step-0`, barely above the entry text — so it read as an
interruption in the flow rather than a marker for the block beneath it. A title that isn't
clearly doing a different job reads as a break rather than a heading.

- **`--step-0` → `--step-2`** (20px → 31px, now ~1.95× the 16px entry text).
- **`margin-left: -0.06em`** — optical, the same idea as the logo's nudge: larger digits carry
  more left side bearing, so the painted glyph drifts right of the spine it should line up
  with. At 31px that is 1.9px back. Em-based, so it stays proportional if the size changes.
- Applied to **both** `.timeline-when` (about) and `.page-now h1` (now) — they are a deliberate
  copy of each other, and this is exactly the kind of change that has to be mirrored. The
  comment in `now.css` now says so explicitly.
- The § headerlink is positioned in `em` off the heading, so it scaled with it; verified still
  attached and placed.

### Gear icon; archives hairline; /now/ wears the timeline (2026-07-27)
- **Theme icon → gear.** The half-filled contrast circle read as "light/dark" when the panel it
  opens is really all of settings — mode, palette, font, size, accent. Filled gear traced from
  Heroicons (MIT), which `styles.md` §4 already names as an acceptable source for a filled
  glyph. Same 24-viewBox / `currentColor` / 20px shape as the rest of the set, so it inherits
  the icon sizing and the quieter icon colour with no extra rules.
- **Archives: a 1px hairline between the "20" and the tray.** The century was centred exactly on
  the tray's edge, so the glyph and the border touched and read as one shape.
  `translate(calc(-50% - 1px), -50%)` gives it daylight without breaking the illusion that the
  rest of the number continues underneath. Measured: 43px visible / 41px hidden.
- **`/now/` now wears the `/about/` timeline's visuals** — spine, dots, quiet year headings,
  prose held at the measure. **Done purely in CSS against the markup kramdown already emits, so
  not one word of content moved.** `now.md` include_relative's eleven year fragments from
  `now/`, each `# YYYY` + a bullet list, which maps straight onto the timeline's shape:
  `h1` → `.timeline-when`, `<ul>` → `.timeline-entries` (the spine is its `border-left`),
  `<li>` → `.timeline-entry` (the dot). Year headings also gained § anchors, so `/now/#2024`
  works — `anchors.js` picked up a third selector rather than a third script.
  ⚠️ Those visual rules are a **deliberate copy** of timeline.css's, not a shared import: both
  are tier-2 page bundles never loaded together, so sharing means promoting to base.css and
  charging ~1,456 pages for what two use. Same call as `.headerlink`. **Keep them in step.**

### Appearance panel: Sans-Serif back, every group on one line (2026-07-27)
- **"Sans-Serif" (Geist) restored** as a third font option. It was dropped 2026-07-19 for its
  weight; Brajeshwar re-added the file and asked for the option back. **FOUR places must agree**
  and all four were changed: `AXES.font.opts` in `appearance.js`, the `[data-font="geist"]` rule
  in `config.css`, the `@font-face` in `themes.css`, and the **no-flash whitelist in
  `default.html`** — miss that last one and picking Sans-Serif flashes the default font on every
  load. The comment there already warned about this; it is now cross-referenced from the JS too.
  Verified end to end: attribute set, value stored, `--font-body` resolves to Geist, and
  `document.fonts` reports the face loaded.
- ⚠️ The file is a **169 KB unsubsetted TTF**, which is exactly why it was dropped before. Costs
  nothing unless chosen, but a subset woff2 would be ~10× smaller — logged in `todo.md`.
- **Every group is now label-left / options-right on one line**, matching what Accent already
  did: `buildEnumGroup` adds `appearance-group--inline`. The panel widened **15.5rem → 21rem**
  because "FONT  Default Sans-Serif Serif" and "TEXT SIZE  A A A A A" wrapped at the old width —
  which is the layout the change existed to remove. Verified all five groups inline, options on
  a single row, nothing overflowing.

⚠️ **`jekyll serve --incremental --future --livereload` is what put 2100 posts on the site.**
Brajeshwar runs that locally, and **`--future` builds the never-publish drafts in
`_posts/todo/`** (the 2100-dated ones) into `_site` — 1,464 posts instead of 1,456, `/2100/`
pages, and a 27th "00" year in the archives. His watcher and any `jekyll build` here share the
same `_site`, so they overwrite each other and local measurements flip depending on who built
last. **Production is unaffected** — the Actions workflow runs a plain `jekyll build` on a fresh
checkout. If a local count looks wrong, run `jekyll clean` and rebuild before believing it.

### Post media and the footer seam, finished (2026-07-27, late)
The last run of changes before the session closed, all on how a post ends and how it carries
media.

**The footer seam.** It was **182px** between the prev/next bar and the footer, against the
**80px** a page with no Back to Top gets. Four margins made it, and the surprising one is worth
keeping: **`.post-nav`'s bottom margin did not collapse away**, because `main` is
`container-type: inline-size` and that establishes an independent formatting context — the last
child's bottom margin is trapped inside instead of merging with what follows, so it *stacked*.
Then the order changed on request: the arrow moved **above** the bar and the bar went tight to
the footer. It is now **article → arrow → PREV|NEXT → footer, 30px between each**.

Two traps in that one change:
- **`~`, not `+`.** `main:has(.post-nav) + footer` matched nothing, because `post.html` emits a
  `<script>` between `</main>` and `<footer>`. The footer silently kept its 80px and the change
  read as having failed rather than as having missed. **In this repo, never assume `main` and
  `footer` are adjacent.**
- **`width: var(--body-width)` applied twice.** Moving the row inside `main` meant the 96% was
  taken of the band rather than the viewport — the arrow landed 20px short of the edge
  everything else lines up on. `main > .back-to-top-row { width: 100% }`.

**The divider is gone.** Two versions were tried — a foreground hairline, then an inverted notch
— and both were a mark asking to be noticed on a control whose job is to be quiet. The halves
touch; the hover tint draws the boundary only while it matters. It also deleted the
first/last-post special case, since no rule is left that needs to know how many links there are.

**Media.** Videos and embeds take the band like the wide images (665 → 1024). Content media gets
`--border-radius`, via `main :where(img, video, iframe)` — `:where()` keeps it at (0,0,1) so
anything with an opinion overrides it, and the `main` scope keeps it off the header logo and
footer icons.

⚠️ **`photo-cover` is full-bleed again, and is now the site's ONE documented exception** to
"nothing goes past the band". It had been brought onto the band earlier the same day; that was
wrong for this element. It is a flourish, not content. Its caption stays on the body width — the
only caption on the site that does not match its own figure. See `styles.md` §6.

### ⚠️ 882 GPG signatures lost to a history rewrite (2026-07-27)
**What happened.** Two `.afphoto` purges were run to get past GitHub's 100 MB file limit — first
`git filter-branch` over the unpushed range, then `git filter-repo` over the whole history to
remove `static/*.afphoto` (191 MB). Both tools **discard GPG signatures**: a signature covers the
commit object, so changing a tree or a parent invalidates it, and neither tool re-signs.

**The cost, measured after the fact:**

    before   882 G   347 N   9 E      (1,238 commits)
    after      0 G  1,237 N            (1,237 commits)

    Brajeshwar Oinam    867 signed commits
    Brajeshwar           15 signed commits
    span                 2022-10-07 → 2026-07-26

The remote was force-pushed to the rewritten history, so the signed copy exists nowhere any
more. Brajeshwar's call: *"What ever done so far be done."* Not restored.

**Why it was not caught.** The rewrites were verified thoroughly for CONTENT — tree hashes
identical, 1,237/1,237 commits matched by date+subject, 31 commits deep-compared with zero
non-`.afphoto` differences — and not at all for METADATA. Signatures are commit metadata. A
verification plan that only checks what it thought to check is how this passes.

**The rule now, in CLAUDE.md guardrail 8:** before any history rewrite, run
`git log --format='%G?' <range> | sort | uniq -c`, tell Brajeshwar what it will cost, and get his
answer first. A rewrite is his decision, not a tidy-up.

**Also worth keeping:** the 166 MB file that started this was blocking the push because **GitHub
rejects on the BLOB, not on the tree** — deleting a large file in a later commit does not help,
because the blob is still in the history being pushed. That is why a rewrite was the only fix,
and why `*.afphoto`, `*.psd`, `*.sketch`, `*.fig` and friends are now in `.gitignore`: the
failure arrives as a push rejection long after the mistake.

### Commits are signed, in Brajeshwar's name, and pushed only on request (2026-07-27)
Brajeshwar: *"going forward, all commits will be signed. You can even push but only after I say
so. But, all commits are in my name, none others."*

- **Signing is not a limitation of the agent environment** — this was checked, not assumed.
  `commit.gpgsign = true` is set, the key is in the agent, and `git commit` from an agent shell
  signs with no prompt. `f19eab95` was made from one and verified `G`. Anything unsigned in this
  repo's recent history was stripped by the rewrites above, not left unsigned at creation.
- **Verify, don't trust:** `git log --format='%h %G?'` after committing. `G` or it is wrong.
- **All commits are Brajeshwar's.** No Claude/Anthropic attribution anywhere — not authorship,
  not co-author trailers, not "Generated with", not in code comments or docs.
- **Committing is fine; pushing waits for him.** Every push to `main` auto-deploys.

### Documentation clean-up + handoff (2026-07-27, end of session)
A full pass over every doc, because several had drifted far enough to mislead rather than help.

**Corrected in `CLAUDE.md`** (all four were current-state claims, not history):
- post count `~1,463` → **1,464 files / 1,456 built** (12 in `_posts/todo/` are 2099-dated and
  held back by `future: false`);
- `12 CSS files` → **13** (`timeline.css` arrived with the `/about/` rework);
- guardrail 6's *"concatenate+minify … not yet built"* → **built, as minify-only**, with the
  in-place design and the concat decision recorded;
- the budget line re-measured: heaviest page is **7.3 KB gzip / 34 KB raw** against the 13 KB
  ceiling.

**`styles.md` and `sidenotes.md` were still citing the PRE-FLATTEN filenames** — `0.0-config.css`,
`1.1-base.css`, `0.1-color.css` and friends, eight days after the flatten. Every one repointed.
The remaining hits are inside the old→new map and the audit tables, which are history and stay.

**New reference material** (this session's rules, written where they will be looked for):
- `styles.md` §6 → **Breaking out of the reading column — RIGHT ONLY**: the `100cqi` idiom, what
  it replaced, everything that takes the band, and the two traps (`photo-cover` cannot use `cqi`;
  wide media now sits in the sidenote gutter).
- `styles.md` §1 → the **interface-vs-prose font rule**, stated as a principle with the opt-out
  list and the warning that the failure is invisible at the default font.
- `sidenotes.md` → **Images without dimensions**: the placement race, the measured numbers, the
  `ResizeObserver` patch, and why it is a patch.
- `hosting.md` → Node 22, esbuild unpinned, and an explicit note that the Cloudflare build
  command deliberately omits the minify step.

**Verified mechanically, not by eye:** 0 broken cross-doc links across all 11 docs + `CLAUDE.md`
+ `README.md`; 0 docs missing from the index; `todo.md` reconciled to **17 open / 38 done**.

**The `## Where we are` block at the top of this file was 40 commits stale** — it described an
11-commit push that had long since been superseded, and still said Geist was removed. Rewritten
as a real handoff: what to push and what to watch, the state in a paragraph, the reader-visible
changes, the rules learned, the verification loop, and a five-item shortlist.

### Interface stays sans; post titles take the band (2026-07-27)
Brajeshwar: *"UI Elements such as the PREV | NEXT should always be in the sans-serif system
fonts. Making it serif is weird."* and *"Posts titles should extend the full length of the body
width."*

**The font-scope rule is now stated as a principle, not a list of accidents.** Prose follows the
reader (`--font-body`); interface is pinned to system sans. The distinction is what the text
IS, not where it sits: prose is the reader's to set, controls and labels are the site's. A
Prev/Next bar set in Libre Baskerville reads as a sentence, which was the complaint.

`header` and `footer` are chrome by position and were already covered. Everything else inherits
`--font-body` and has to opt out by name — now `.post-nav`, `.pill` (the /about/ Life/Work
filter; the appearance panel's copy was already sans only because the panel is) and
`.back-to-top-row`. That last one had a `font-family` until it became icon-only and lost it
silently — which is precisely the failure this list exists to prevent.

⚠️ **This class of bug is invisible by default.** It only appears for readers who picked Serif
or Sans-Serif, and the default is System — so casual checking will never show it. Add to the
list when adding a control inside `main`.

**Post titles span the band**, using the same `100cqi` idiom as the wide images, so the title,
the images, the header rule and the footer rule all end on one line. The measure is a constraint
on READING, and a title is scanned rather than read — a longer line costs nothing there and buys
fewer wrapped lines. The title still follows the reader's font, correctly: it is content.

### One width, finally — and the nav divider becomes a notch (2026-07-27)
Brajeshwar: *"The full width of the content, such as in the articles, is not the same the
header, footer, etc. They should all be the same width."* and *"The vertical bar in the posts
PREV | NEXT looks weird. Either replace with a transparent bar or invert the color."*

**The mismatch was 64px, and only `.large` had it.** Measured on a post: header, `.footer-inner`,
`main` and `.post-nav` were all 244→1268 already. `figure.large` stopped at 1204 — the
`--image-width-max` middle step (60rem/960px) kept from the breakout change the day before.
Everything else on the page agreed; that one class did not. Removed the step: `.large` and
`.full` are now both `100cqi`, so a wide image ends on the same line as the header rule and the
footer rule. Verified: **one distinct right edge across all six elements.**

The two classes are now identical in behaviour. Both are kept — 24 `.full` and 58 `.large` in the
content, and content is not ours to edit — but there is one behaviour to maintain, not two.
`--image-width-max` is gone with the step (and `--body-width-medium` before it, same lineage):
there is no intermediate left to name.

**The divider is now a notch cut through the bar, not a line drawn on it.** It was
`--border-color`, a mix of the foreground — correct as a hairline between paragraphs, wrong
inside a filled bar with a link either side. It takes the PAGE background now, so it reads as a
slit. That inverts by construction in both modes: the bar is `--bg-color-low`, the page is
`--bg-color-lower`, and one is lighter than the other in light and darker in dark, so the notch
contrasts with what surrounds it without a second rule. It also survives the hover tint, which
the foreground-mix hairline had started to disappear into. Verified in both modes, hovered and
at rest.

### Nav spans the band; captions match their figures (2026-07-27)
Brajeshwar: *"The PREV | NEXT should extend the whole width of the content. Now that our article
contents including FIGURES are inside, make the figcaption the same width as the FIGURE
container."*

Both are the same consequence of the breakout change: things that were capped at the reading
measure now sit next to things that span the band.

- **`.post-nav` dropped `.container-ideal`.** It was held at the measure to match the article,
  which was right while nothing in a post was wider. It is a direct child of `main` and carries
  no width of its own, so removing the class is the whole fix — it fills the band, and its two
  halves reach the same edges the images do.
- **`figcaption` lost `max-width: --body-width-ideal; margin: 0 auto`.** Capped at the measure
  and CENTRED inside its figure: invisible while every figure was column-width, wrong the moment
  one was 1024px — the caption's rule sat inset from both edges of the image above it and lined
  up with nothing. Now full width of its parent, so the underline always tracks the figure's own
  edges. `photo-cover__desc` got the same treatment against `photo-cover`.
- Removed with it: `figure.full figcaption, figure.large figcaption { padding-inline: 0 }`, which
  was a **no-op** — the base rule already sets `padding: X 0`. It existed to compensate for the
  centring that is now gone.

⚠️ **And a real bug the breakout change exposed: sidenotes landing on top of images.**
`sidenotes.js` dodges wide media via `collectObstacles()`, and that logic was fine — the
*timing* was not. Images here carry no width/height attributes, so they contribute almost no
height at first layout. Measured on `/2005/mumbai-marooned/`: the figure was **79px tall when
the note was positioned and 675px once the image decoded**, leaving the note sitting on the
photograph with `readyState: complete` and `img.complete === true`. `window.load` was supposed
to cover this and can fire before a cached image has been laid out, so it was a race the page
only usually won — and it started losing once wide media stopped spilling left and began
extending RIGHT, into the gutter the notes live in.

Fixed with a `ResizeObserver` on the **images**, not the article: placing a note changes the
article's size, so observing the article would re-trigger the observer on its own output. An
image's size does not depend on where a note sits, so there is no loop.

⚠️ **Testing note:** `python3 -m http.server` is single-threaded and starved under a blocking
CDP eval, so images reported `complete: false` for minutes and the page looked broken in ways
the code was not. Use `ThreadingHTTPServer` when checking anything image-dependent.

### Breakouts extend right only, never left (2026-07-27)
Brajeshwar: *"For images, videos and other contents inside the articles, should no longer be
extended to the left side. No contents cannot go beyond the left container. If we are extending
it, then we will do it to the right, so it is still within the body width."*

Four breakout kinds, all in real use across the archive — `photo-cover` (72), `img/figure.full`
(24), `img/figure.large` (58), `.gallery` (7). All did the same thing: viewport-wide, then
re-centred, so they spilled equally into BOTH margins. On this asymmetric layout the left margin
is the page's alignment edge — the line the prose, the header rule and the footer rule all start
from — so spilling into it was the visible problem.

**The mechanism is `100cqi`, not the old `100vw` + negative-margin + `translateX` dance.** `main`
declares `container: main / inline-size`, so inside an article 1cqi is 1% of THE BAND. The idiom
is two lines — `margin-inline: 0` to keep the left edge, `width: 100cqi` to grow right — with no
viewport arithmetic, so it cannot drift when the site width changes and it does not have to know
about scrollbars (100vw includes them, 100cqi does not).

⚠️ **`photo-cover` cannot use it.** `post.html` emits it before `<main>`, so it is a `<body>`
child with no container ancestor and cqi falls back to the viewport — exactly the full-bleed
being removed. It is given the band's own three lines instead (`--body-width` /
`--body-width-max` / `margin-inline: auto`), which must be kept in step with `main` by hand.

⚠️ **`.post img { width: 100% }` was silently beating `img.full`.** Both are (0,1,1) and post.css
loads after base.css, so an `img.full` measured 665px — the column — while a `figure.full` got
the full band, because `.post img` does not match a `<figure>`. **Two authoring forms, two
different results, no error anywhere.** Now `.post img:not(.full):not(.large)`.

**That is the fourth instance this session of base.css setting geometry and post.css quietly
overriding it** (`.post { margin }`, `.post-nav { margin }`, `.post img { width }`, plus the
`.container-ideal` shorthand cases). The rule is now explicit in post.css: in this file, set only
what this file has business setting, and exclude the classes base.css sizes.

`--body-width-full` (1600px) is gone — its only readers were these breakouts, and nothing is
allowed past the band any more, so a token naming a width beyond it named nothing.

Verified on one post of each kind at 390 / 768 / 1024 / 1512px: left edge exactly on the band in
every case, nothing past the band, no horizontal scroll anywhere. Sidenote collisions are already
handled — `collectObstacles()` in sidenotes.js looks for `.full, .large, .gallery` and pushes
overlapping notes below them; confirmed it self-corrects on `window.load` once images have height.

### Post nav: flush edges, a divider, and an alignment bug that predated it (2026-07-27)
Brajeshwar: *"the navigation of PREV and NEXT needs to be flushed left and right… hover where
the background color changes… a vertical separator bar when it has both… the ones with NEXT or
PREV should have the full width… move the arrow a bit to the left or right in hover."*

All five done, and the markup changed to make three of them fall out rather than be special-cased:

- **Wrapper `<div>`s gone.** The links are direct children of the nav now. The old markup
  emitted an empty `<div>` for the missing side, so on the **first and last posts** — the only
  two with a single link — half the bar sat visibly blank.
- **flex + `flex: 1`, not `grid-template-columns: repeat(2, 1fr)`.** The grid always reserved two
  equal tracks. With flex, one child takes the whole width and two split it, no special case.
- **The divider is `a + a`.** It cannot match a lone child, so the single-link posts get an
  unbroken bar without a rule of their own.
- **Flush** via `justify-content: flex-start / flex-end`, and the arrow is its own `<span>` so it
  can `translateX(±0.25em)` on hover without reflowing the label. Transform only; the global
  reduced-motion block zeroes the duration.
- **Hover** mixes 8% of the foreground INTO the bar's own background rather than into
  `transparent`, so the hovered half reads as a solid step rather than a translucent patch.
  Verified it differs from the bar in both modes: light 0.922 → 0.860, dark 0.269 → 0.326.

⚠️ **The bar had never been aligned with the article it belongs to.** `.post-nav` carried
`margin: var(--space-l) auto` while also wearing `.container-ideal`, whose whole job is
`margin-inline: 0 auto`. post.css loads after base.css at equal specificity, so `auto` won and
the nav was **centred while the article was left-aligned — measured 179px out of step**. Fixed
with `margin-block`, setting only the axis this rule has business setting.

**This is the third time this session that a `margin` shorthand has silently cancelled
`.container-ideal`'s `margin-inline`.** The pattern is now: in any rule that also wears
`.container-ideal`, use `margin-block`, never the shorthand.

### The five highest-value items, plus the tidies (2026-07-27)
Brajeshwar: *"Do all of the Highest Values (1 to 5). Git commit for each of them meaningful
feature completion."* Nine commits. **Three of the five turned out to be misfiled**, which is
the useful part of this session — the audit's descriptions were written from reading, and
measuring disagreed.

**1. search.css.** Filed as "re-implements Pagefind's own stylesheet, ~6 KB of 9.7 KB". A
rule-by-rule comparison against a real `pagefind-ui.css` found **zero shared selectors** —
Pagefind's carry Svelte scoping hashes, so they are (0,3,0) against our (0,1,0), and its
`<link>` sits in the page body so it also won every tie against our inlined `<head>` styles.
**The file was almost entirely inert.** Proved by A/B: removing it completely changed nothing —
same padding, same radius, same 21px title, same browser-default *yellow* `<mark>`. Fixed by
scoping under `#search`. Two real bugs fell out: a focus style with inverted nesting that never
matched (no focus ring on any result, ever) and an empty `result-thumb` reserving a blank column.

**2. chrome.css repetition.** Real, and done: `.icon-button` for the three round header
controls, the two backdrops and the shared half of the two cards grouped. **1,010 bytes raw /
74 gzip off every page.** `.footer-social a` was listed with the icon buttons in the audit and
deliberately NOT merged — measuring says it is a different treatment.

**3. Node 18 → 22 LTS.** Straightforward.

**4. Minify on publish.** esbuild, **36.7 → 15.2 KB raw, 13.9 → 6.6 KB gzipped**. In place,
changing no HTML reference — that is the design: local `jekyll serve` and the Cloudflare backup
never run the step and keep the readable originals. Pointing the layout at CI-only bundles
would have left the standby host with **no JavaScript at all**. Concatenation considered and
deliberately dropped.

**5. Geist → woff2.** 169,056 → 47,596 bytes, 72%. The variable axis survives — verified by
reading `fvar` back out AND by measuring three different rendered widths at 100/400/900,
because a naive subset flattens a variable font and every weight silently becomes 400. The
`.ttf` was still shipping; now excluded from the build.

⚠️ **And it turned up a real typographic bug.** Libre Baskerville's three faces declared
`unicode-range: U+000-5FF`, but the files contain `’ “ ” – — • …` — all above U+05FF. The range
forbade the browser from using the font for exactly the characters that carry a serif's voice,
so a reader on Serif got Libre Baskerville for the letters and the *system* serif for every
apostrophe: **3,197 times in a 400-page sample**. All four faces now declare ranges read off
their own cmaps.

**Dark mode: removed, not repaired.** Brajeshwar asked for "the best practice that is the
standard on the Internet", and that is to leave photographs alone — `color-scheme: light dark`
for UA surfaces (already declared), nothing on content images. The old rule also keyed off the
OS rather than `[data-theme]`, but fixing the selector would have shipped a worse page.

**Tidies.** Dead selectors removed after re-verifying against the 1,456 *built* pages;
`scroll-behavior` duplicate, `--sidenote-min-gutter` and `--body-width-medium` gone. Two were
NOT done and are re-scoped in todo.md: the `.sidenote` double-declaration is a refactor of live
behaviour rather than a tidy, and "two spacing systems, only 3 rules" is **10 call sites**, each
a visible spacing value.

**Closed by decision:** Home parked (books treatment is Brajeshwar's call — SVG or text block),
theme-toggle-without-JS closed as *no* (persistence is the point), analytics closed (the width
stands on the sidenote arithmetic).

### Panel in two columns · Font "System" · Warm is now Flexoki (2026-07-27)

**1. The appearance panel is a two-column grid.** Brajeshwar: *"align them into two columns,
the labels on the left and the content (options on the right)."* Each row used to be its own
flex line with `justify-content: space-between` — label left, control right, but every control
STARTING at a different x, because the label's own width decided where its pill began. Five
ragged rows.

The fix is that alignment is the panel's job, not the row's: `display: grid` with
`grid-template-columns: max-content 1fr` on `.appearance-panel`, and `.appearance-group` reduced
to `display: contents` so each label/control pair drops into the panel's own columns.
`max-content` rather than `auto` so the label column never claims space when a control is
narrow. `.appearance-group--inline` is gone from both the CSS and the JS — it existed only to
make a row lay itself out.

`display: contents` is safe here: the group is a plain `<div>` with no role, and the
label↔control association is `aria-labelledby`, which is id-based and indifferent to the box
tree. Measured after: all five labels at x=905, all five controls at x=997.2, right edges at
1247, every label on one line ("TEXT SIZE" no longer wraps).

Panel widened 21rem → 24rem, since a dedicated label column takes width from the controls.
Checked down to a 320px viewport: no control overflows its track and no pill segment clips its
own text (`min-width: 0` on the segments means the track can look fine while the buttons clip,
so both were measured).

**2. Font: "Default" → "System".** Label only. It names what the option is — the OS UI face —
where "Default" only said it was the one you get without choosing, which is true of the first
option on every axis. The stored value is still `sans`, so none of the other three places that
must agree for a font option changed, and no reader's saved choice needs migrating.

**3. Warm is now [Flexoki](https://github.com/kepano/flexoki).** Brajeshwar: *"Our 'Warm' theme
should be based on…"*. Note the history: Flexoki was ONE OF FIVE palettes until the trim to
three (logged further down this file, 2026-07-19), when it was cut and Warm stayed a
hand-rolled sepia ramp. It is now back as the basis for Warm itself.

- **Hex, not `oklch`** — the only palette in the file written that way, deliberately. These are
  upstream's published values copied verbatim from `kepano/flexoki` `css/flexoki.css` so they
  can be diffed against it; converting would round every one and lose that. `color-mix(in
  oklch, …)` takes hex without complaint.
- **11 slots, 15 steps** — base-150/-800/-850/-950 get none. Each line names its source step.
- **Its own dark mixin** (`eink-dark-semantics`), because Flexoki's dark form is not the generic
  dark remap applied to a warm ramp. Left to the shared mixin, Warm-dark would have landed on
  base-900 with paper-white text; Flexoki puts the page on `black` and the text on base-200,
  which is the whole character of it. Mappings taken from kepano's own docs theme
  (`vitepress/index.css`), and wired into BOTH dark branches (explicit and inside the
  `prefers-color-scheme` media query) exactly as nord's accent already is — the specificity note
  further down this file explains why both are required.
- **One deliberate divergence.** Flexoki's `tx-3` is base-300, which measures **2.00:1** on
  paper — right for the hairlines it is meant for, unreadable for what this site spends
  `--color-fg-subtle` on (sidenote body text). Stepped one notch: base-600 (**4.97:1**) light,
  base-500 (**5.19:1**) dark. The same bump the default palette already makes, for the same
  reason.
- **Accent stays monotone**, drawn from the same ramp. Colour on this site is opt-in through the
  Accent axis (design.md), so a palette does not get to introduce a hue. Flexoki ships eight
  accent hues if that ever changes; kepano's own docs theme uses cyan-600.

Verified live, both modes. Light: page `#FFFCF0`, text `#100F0F`, surface `#F2F0E5`, bg-muted
`#E6E4D9`. Dark: page `#100F0F`, text `#CECDC3` (11.98:1), fg-muted `#9F9D96` (7.05:1),
fg-subtle `#878580` (5.19:1). Checked on a post and on `/archives/`.

⚠️ **The attribute value stays `eink`**, not renamed to `flexoki`. Renaming it would invalidate
every reader's saved `localStorage('palette')` for no visible gain — `read()` validates against
the option list and would silently drop them back to Default.

### Archives: the date column now sizes itself in `ch` (2026-07-27)
Brajeshwar: *"the 'MMM DD' are now too narrow and squashed. It should always be in a single
line… can we make it always fit whatever the font-size."*

His diagnosis was right — the base font-size went up and the column did not. `width: 5rem`
uses the ROOT font size, and the reader's Text Size axis never touches the root; it scales
`--step-*`. Measured against the old 60px content box: **XS had 8.8px spare, M was already at
−0.2px, XL was 9.2px over.** So it had been failing at the default size too, not just XL.

⚠️ **The obvious fixes are dead ends here, because `base.css` sets `table-layout: fixed`.**
Under fixed layout the specified width is used literally and the cell's content is never
consulted:
- `width: auto` → the table just split 50/50 and gave the date **510px**.
- `width: 1%` + `nowrap` (the standard shrink-to-fit idiom) → **10px**, with the date
  overflowing straight across the titles. I shipped this one to the browser before catching it;
  `nowrap` means a cell can overflow without ever wrapping, so "did it wrap" is the **wrong
  test** — check `content box − text width`, not `getClientRects().length`.

Fixed layout means an explicit number, so the only question was the unit. **`ch` resolves
against the element's own font**, which is `smaller` of whatever the reader picked, so the
column tracks the text automatically — and the cell is monospaced, so 1ch is exactly one
character. "MMM DD" is 6; `calc(6.5ch + 2 * var(--space-2xs))` (the padding added back because
`box-sizing: border-box` is global), the half-character being slack against sub-pixel rounding.

Verified across **all 1,456 rows × 5 text sizes × 3 font choices**: zero overflowing, zero
wrapped, 4.3–5.8px of slack throughout, cell width tracking 75.4px (XS) → 95px (XL). Bare 6ch
measured slack 0.00 at every step, which is correct but too tight to ship.

### Archives: the century stops hiding and starts being two digits (2026-07-27)
Brajeshwar: *"move the '20' just a tiny bit to the left to add at-least 1px of space with the
year container."*

**A translate could not do it, and measuring showed why.** The mark rendered the whole "2026"
centred on the tray's left edge, so the visible "20" and the hidden "26" were **one string**:
sliding it left to open a gap beside the "0" dragged the "2" of "26" out into the margin with
it. At 36px with -0.02em tracking the "0" ink ended at **242.14** and the next digit's ink
began at **242.49** — 0.35px apart — with the tray edge at **244**. So **1.51px of that third
digit was already showing**, and *that* was what read as the "20" touching the tray; the "0"
was never clipped. 0.35px was the most daylight any cut line could yield.

Fix: **emit only the two digits that were ever visible** (`{{ years[0].name | slice: 0, 2 }}`)
and position by the right edge — `right: 100%; margin-right: 2px` — instead of centring a
four-digit string. Nothing visible was lost, because nothing of the "26" was ever on screen.
The gap is now just a margin: 2px of box renders as **2.87px of visible daylight** (the italic
"0" carries a little right side bearing of its own). Verified at rest, stuck at `top: 0`, and
in dark mode; the mark still fits inside the tray vertically (83.9–119.9 within 81–122.7) and
still needs the same ~44px of margin, so the 1250px cut-off is unchanged.

Lesson worth keeping: **a mask is not spacing.** Hiding half a string with an opaque box looks
identical to drawing half a string right up until you need to move one of them.

The original construction, for the record:

- **Centre on the tray's left edge.** `left: 0; transform: translate(-50%, -50%)` puts exactly
  two digits outside and two under. The halving is exact *because the face is monospaced with
  tabular figures* — measured 47px visible / 47px hidden. *(Superseded above.)*
- **It must be a SIBLING of the nav, not a child or a pseudo-element.** Inside a stacking
  context a negative-`z-index` child still paints **above its parent's background**, so it could
  never be hidden by the very tray it sits behind. Hence the new `.archive-strip` wrapper:
  century `z-index: 0`, nav `z-index: 1` with its opaque background doing the masking.
- **The wrapper took over the sticky** (was on the nav), so the mark and the tray travel
  together. Verified their centres stay within 2px when stuck.
- ⚠️ **Capped to the tray's height.** At 3.25rem it was 52px against a 42px tray and overhung
  ~5px, invisible at rest but clipped by the viewport edge the moment the strip stuck at
  `top: 0`. Now max 2.5rem/40px inside 42px, verified unclipped when stuck.
- Hidden below 1250px, where the margin can no longer hold the mark. Derived from
  `years[0].name`, not a hardcoded string, so it follows the archive into 2100. `aria-hidden` —
  it is a typographic device, and each link already carries the full year in `aria-label`.

### Logo optical nudge + archives tightened to the new width (2026-07-27)
- **Logo: align the GLYPH, not the box.** It had been pulled out by a whole `--logo-size`
  (40px), which put the beta ~29px into the margin and read as detached. Measured the path's
  bbox in `brajeshwar-logo.svg`: `x = 49.6` of a 200 viewBox, so the glyph's painted left edge
  sits **24.8%** in — about **11px** at 40px once `--logo-inset` is added. The pull is now
  exactly that emptiness (`--logo-optical-inset: 0.248`, applied in `chrome.css`), so the
  **glyph** lands on the band edge while the box overhangs by 11px. Verified: glyph left 244 =
  band left 244. Small enough to read as flush, which was the ask. No media query needed —
  11px always fits inside the margin `--body-width: 96%` leaves.
- **Archives strip back to ONE row.** Tracks `2.5rem → 2rem`, font `--step--1 → --step--2`,
  tray padding `--space-2xs → --space-3xs`. At the 64rem band that is 26 × 32 + 25 gaps = 957px
  inside ~1002px of content, so it fits on one line again — at 2.5rem it needed 1165px and had
  wrapped to two. Strip height **98px → 42px**. Links render ~34 × 31px, still over the WCAG
  24 × 24 target.
- **Hover background verified inside the tray**: first link's left edge and last link's right
  edge sit exactly on the tray's content box, so the highlight never bleeds onto the border.

⚠️ **`scroll-margin-top` needed retuning for the FOURTH time.** Re-measured row counts at the
new sizing: band 983–1024 → 1 row / 42px · 500–900 → 2 rows / 77px · 346–400 → 3 rows / 113px ·
307 → 4 rows / 149px. Now 4.5rem base (unstuck), **5.5rem from 768px** (clears 77), **3.5rem
from 1024px** (clears 42) — both verified clearing by 14px and 11px. The strip's height is
content-derived and not readable from a token, so **this must be measured in a browser after
any change to its padding, font size, track width, or the site width.** That warning is now in
the CSS itself.

### Narrower: 64rem, and the column goes asymmetric (2026-07-27)
Brajeshwar, on seeing 81rem/1296px live: *"this is too wide, what is the next logical narrower
body width. Think readable length of the articles + the sidenote + the padding and margin
spaces."*

**The answer required un-centring the column.** A centred article reserves the gutter on BOTH
sides and only uses the right one, so 1289px was the hard floor — 1296 could not be narrowed
without starving the notes. Paying for the gutter once gives:

    --measure 665 + --sidenote-gap 56 + --sidenote-width 256 = 977
    + 47px breathing room = 1024px = 64rem

- **`--body-width-max: 64rem`.** `.container-ideal` is now `margin-inline: 0 auto` — the column
  sits at the LEFT of the band, gutter to the right. Prose's left edge is the band edge, which
  is the line the header and footer rules already draw.
- **Sidenote floor 1210px → ~980px viewport**, measured by shrinking the band until notes fold
  (they survive to a 940px band). The long-standing asymmetric todo is done, and it is what
  bought the narrower site.
- **Header: back to `space-between`.** Centred read adrift on small screens and, with the new
  border-bottom, a centred cluster floating over a full-width rule looks unanchored.
- **Logo 34px → 40px, and optically pulled out.** Above 1150px it gets
  `margin-left: calc(-1 * var(--logo-size))` so its RIGHT edge lands on the band edge — the
  slanted beta reads as pushed inwards otherwise. Below that it sits in flow; no clipping.
  Verified one row and fitting at 1512/1200/1150/1100/768/430/390/360/320.

⚠️ **Three things this broke, all found by measuring:**
1. **The `/ 2` in `.sidenote`'s width** assumed a centred column splitting the leftover between
   two margins. Left in, it would have halved every note.
2. **`gutterFits()` measured `window.innerWidth`.** Correct only while the gutter was viewport
   margin; now measures the band.
3. **Archives' `scroll-margin-top` override at `min-width: 1250px`** put captions 26px UNDER
   the strip. One row needs ~1200px of content and the band now caps at 1024 — the strip can
   **never** be one row again, so the override was dead and wrong. Removed. *Third time this
   exact bug class has appeared; the strip's height is variable and the clearance must track it.*

⚠️ **Local `_site` goes stale.** `jekyll build` does not delete output whose source stopped
qualifying, so `/2100/` pages and a 1,464 post count persisted from earlier builds and were
briefly measured as real. `jekyll clean` restored 1,456 and 26 archive years. **CI is safe** —
Actions builds from a fresh checkout. Run `make clean` before trusting local counts.

### ONE width, finished — posts and pages too (2026-07-27)
The earlier pass standardised the *chrome* band; posts and 22 pages still put `.container-ideal`
on `main` itself, so their content band was 665px while listing pages were 1296px — two visibly
different site widths depending on where you landed. Brajeshwar: *"One Standard Website width."*

- **`main` is now the standard width on every page type** — post, page, archives, album, home.
  Verified `main`, the header rule and the footer rule share edges on all of them.
- **The measure moved onto the `<article>`**, centred. Prose still wraps at ~66 characters; only
  its container changed. Deliberately **not** left-aligned — text on 1,456 posts stays exactly
  where it was.
- **`full: true`** (a `page.html` capability that had no users) now means *"fill the standard
  width"*, and `/about/`'s timeline uses it. It no longer means full-bleed, because `main` is
  capped at `--body-width-max`.
- Timeline entry prose is capped at `--measure` too — the structure wants the width, the
  sentences don't.

⚠️ **Two things this broke, both caught by measuring, both of the same class:**
1. **`sidenotes.js` queried `.container-ideal article`.** Moving the class onto the article made
   that match nothing — sidenotes would have silently vanished from every footnoted post. Now
   `article.container-ideal`. Verified 3 notes still render, inside the band, footnotes hidden.
2. **`.post { margin: var(--space-s) 0 }` silently cancelled `margin-inline: auto`.** The
   shorthand's `0` beat `.container-ideal` because `post.css` loads after `base.css` at equal
   specificity — **source order again**, the same trap as the header `@media` block. The article
   rendered flush left. Now `margin: var(--space-s) auto`. *Shorthand margin is a cascade
   hazard whenever a layout class supplies `margin-inline: auto`.*

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
- [`styles.md`](styles.md) — the **style specifics and the CSS architecture**, six sections:
  §1 typography (scales, font axis **System/Sans-Serif/Serif**, Kindle text-size, and the
  interface-vs-prose font rule), §2 colour & theming (mode `data-theme` × palette
  `data-palette` default/nord(Cool)/**eink(Warm = Flexoki)**, + accent, bridge, no-flash),
  §3 branding, §4 icons, §5 **how CSS is split** (13 named files, three tiers, which layout
  pulls which bundle, the old→new filename map, the 2026-07-19 audit + backlog),
  §6 **layout patterns** — the four page shapes, the **right-only breakout rule**, the shared
  `.pill`, and Back to Top. **Read §5 before touching `_includes/css/`, and §6 before changing
  anything's width.** Absorbed `css-architecture.md` on 2026-07-26.
- [`sidenotes.md`](sidenotes.md) — Tufte margin sidenotes built from kramdown footnotes (Phase 2) + Aresluna wayfinding.
- [`search.md`](search.md) — site-wide header search, lazy-loaded Pagefind.
- [`agents.md`](agents.md) — plain-text Markdown twins (`/x.md`) + `/llms.txt` for AI agents; post-build step like Pagefind.
- [`hosting.md`](hosting.md) — **everything hosting**: GitHub Pages + Actions (and the build
  versions, moved from `README.md`), the Cloudflare Pages backup build, DNS/CDN, and the
  domain decisions.
- [`javascript.md`](javascript.md) — **the JS policy**: no frameworks, one file per function,
  used sparingly, every page works without it. **Minify on publish is BUILT** (esbuild, in
  place, 52% gzipped); concatenation considered and deliberately not done. Inventory of all
  eight scripts.
- [`timeline.md`](timeline.md) — the `/about/` storyline: vertical timeline, CSS-only
  **Life/Work** filter (wearing the shared `.pill`), shareable `#work`/`#life` URLs, hand-typed
  time ranges, experimental scroll line. **Authoring convention lives here** — content is
  Brajeshwar's to write.
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
- CSS = **13 plainly-named files** in `_includes/css/`, concatenated by **`assets/styles/site.css`** into ONE external stylesheet (`{% capture %}` + SCSSify). **9.5 KB gzip / 50 KB raw for the whole site**, fetched once and cached. ⚠️ **Externalised 2026-07-27, reversing the inline-everything rule** — `/assets/*` is served `max-age=31536000`, so inlining re-sent ~6.6 KB gzip on every page view and could never be cached (HTML is `max-age=600`). The ≤13 KB gzip budget still holds but is now a **whole-site** number, not per-page.
- ⚠️ **Two things the one-file model makes load-bearing.** (a) **Cache-busting**: `scripts/hash-assets.mjs` renames CSS/JS to `<name>.<hash>.ext` post-build and rewrites references — a stable filename at `max-age=31536000` strands returning readers for a year. It must run *after* the esbuild minify step. (b) **Every stylesheet applies to every page** — anchor selectors to a class (`.page`, `.post`) or custom element, never a bare `main > article > h2`. `page.css` broke this rule and would have clamped all ~1,456 post titles to 665px.
- ⚠️ **Filenames changed 2026-07-19.** Flattened from 25 numbered ITCSS partials (`0.0-config.css`, `2.1-code.css`, …) to `config` / `themes` / `base` / `chrome` / `post` / `page` / `album` + per-page one-offs. **Older entries below still use the numbered names** — see the old→new map in [`styles.md`](styles.md) §5 → *Old → new filename map*. Cascade order now lives only in `styles.html`; `config.css` must stay first (it defines the `$breakpoint-*` SCSS vars).
- ~~**CSS tiering decided + implemented 2026-07-19** — stay embedded (no external stylesheet); split by **layout**, not by page: base on every page → one bundle per layout (`post`/`page`/`album`) → per-page opt-in for genuine one-offs only.~~ **Superseded 2026-07-27** — delivery is one external file for every page; the three tiers survive only as *organisation* (which file to open), never as what ships where. Still shipped that day and still true: syntax highlighting fixed + tokenised onto `--code-*` (later removed entirely); new `album` layout (film + devices, **not** books — that's prose); `page-full.html` merged into `page.html`. Full rationale: [`styles.md`](styles.md) §5.
- **Layouts are now**: `default` · `post` · `page` (reading width, `full: true` for full-bleed) · `album` (galleries) · `redirect`.
- ~~Layouts pick a CSS bundle through the `styles:` front-matter key (`styles-posts.html`, `styles-pages.html`).~~ **The `styles:` key and all four `styles-*.html` shims were deleted 2026-07-27** — every stylesheet ships to every page, so there is nothing left to switch. `style:` (singular, a class on `<main>`) is unrelated and still live.
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
