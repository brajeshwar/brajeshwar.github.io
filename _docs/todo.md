# Todo — brajeshwar.com

Running list of site tasks. Session-by-session history is in [`memory.md`](memory.md).
Originally absorbed from the 2027 planning braindump.

## Content & pages
- [x] **Year jump-nav on `/archives/`** *(2026-07-26/27)* — all 26 years, always reachable.
      **Wide screens get a vertical rail in the left margin, iOS-Contacts style** (`26, 25 … 01`
      in a rounded pill); narrow screens fall back to a sticky horizontal strip, because the
      rail lives in the margin beside the centred column and a phone has no margin. Single page
      with `#YYYY` anchors, chosen over `/archives/YYYY/` pages: vanilla Jekyll cannot generate
      a page per year without a plugin (guardrail 3), so per-year URLs would mean 26 committed
      stub files plus a new one every January — exactly the hand-maintenance we're shedding.
      The `<caption id="YYYY">` anchors already existed, so `/archives/#2024` had always
      worked; labels are 2-digit but hrefs and ids stay 4-digit, so no URL changed. CSS-only,
      no JS. See [`memory.md`](memory.md).
- [ ] **Year archives as separate pages** — `/2001/`, `/2002/`, … in the
      [Simon Willison](https://simonwillison.net/) style. Superseded in practice by the jump-nav
      above; only worth revisiting if the single page's weight becomes a problem (see below).
- [x] ~~**`/archives/` is over the page-weight budget**~~ *(raised 2026-07-26, **closed
      2026-07-27 — not a problem**)*. Brajeshwar's call: the budget is for **the homepage and
      articles**, not listing pages, and the same will apply to `/books/`, `/film/` and others.
      A listing's weight is its content. [`design.md`](design.md) → *Performance budget* now
      says so. For the record the page is ~329 KB raw / ~74 KB gzip, and switching its links to
      `relative_url` took **27.6 KB** off (1,459 absolute URLs → 3).
- [ ] **Home = text only.** Reduce the homepage to writing; convert Books into a list of top rereads.
- [ ] **Page template (Full Width)** — Pages, Photos, Wear, Devices, Books, Films.
- [ ] **Page template (Ideal Width)** — posts, articles, optimised for reading.
      ⚠️ These two items predate, and are superseded by, *Standardise the site width* below —
      that whole split is what's being collapsed into one maintained number. Don't act on
      these two independently.
- [ ] **Timeline template** — `cv.brajeshwar.com` as part of `/about`; eventually replaces the LinkedIn profile.
- [ ] **Photos component** — a style that highlights key photos. Likely after <https://pictures.oinam.com> is up.

## Infrastructure & migrations
- [ ] **Redirect** `docs.brajeshwar.com` → <https://archive.oinam.com> via Cloudflare Workers.
- [ ] **Move Jekyll redirects** to Cloudflare / plain HTML — or drop them and give a good explanation + next-step in the **404 page**.
- [ ] **Migrate `cdn.oinam.com`** remnants to `brajeshwar.com`.
- [ ] **YouTube videos** — move to `brajeshwar.com`, or embed and ignore, or self-host (PeerTube for Oinam or similar).

## CSS architecture (decided 2026-07-19 — see [`styles.md`](styles.md) §5)
Three tiers: base embedded on every page → one bundle per layout → per-page opt-in for
one-offs only. Keep embedding; no external stylesheet. Ordered roughly by value/effort.

- [x] **Fix `2.1-code.css` orphan + tokenise it** *(2026-07-19)* — the partial was included by
      nothing, so syntax highlighting never shipped (55 posts have code blocks). Wired into
      `styles-posts.html`, then **tokenised**: it was the upstream pygments "native" theme with
      ~100 hardcoded hex values and its own fixed dark slab that ignored mode + palette. Now it
      references only the new `--code-*` tokens in `0.1-color.css`. Also added `c1`/`cd`/`s1`/`s2`
      (Rouge classes the upstream file lacked — comments and strings were rendering as plain code)
      and dropped the `.err` background box (lexer false positives). File 4.8 KB → 3.6 KB.
      Browser-verified light + dark; all tokens ≥ 4.49:1 contrast across default/nord/eink.
- [x] **New `album.html` layout** *(2026-07-19)* — `_layouts/album.html` + `styles-album.html` +
      `4.1-album.css`. `film` and `devices` now share it. **`books` is not a gallery** (prose page,
      stays on `layout: page`); `4.1-pages-books.css` turned out to be a byte-identical copy of
      the film CSS — both deleted. Fixed `/devices/`, which had shipped with no gallery CSS at all.
      Added `:focus-visible` on card links; `x-small` → `--step--2`. Browser-verified light + dark.
- [x] **Merge `page-full.html` into `page.html`** *(2026-07-19)* — one layout, conditional wrapper,
      defaults to `container-ideal`. All 22 reading pages verified unchanged. `full: true` exists
      but has no users (film/devices went to `album`).
- [x] **Flatten the CSS file structure** *(2026-07-19)* — 25 numbered ITCSS partials → **12 plainly
      named files**: `config` · `themes` · `base` · `chrome` · `post` · `page` · `album` + per-page
      one-offs (`home`, `archives`, `search`, `now`) + `bookmarks`. Numbering dropped; cascade order
      now lives only in `styles.html`. Verified equivalent: identical byte counts and identical rule
      sets on 7 page types, one intentional reorder (`.block-*` utilities ahead of chrome, no
      selector overlap). Old→new map in [`styles.md`](styles.md) §5 → *Old → new filename map*.
- [x] **`4.1-pages.css` (0 bytes)** → now `page.css`, kept as the page-tier hook with a comment
      explaining why it's empty.
- [x] **`4.1-pages-bookmarks.css`** → now `bookmarks.css`. **Not deleted** — it styles a
      `<bookmarks-header>` for a bookmarks page that doesn't exist yet, i.e. in-progress work.
      Still included by nothing.
### From the 2026-07-19 CSS audit — not yet done
Full findings and evidence in [`styles.md`](styles.md) §5 → *Audit backlog*.
- [ ] **search.css re-implements Pagefind's own stylesheet** (~6 KB of its 9.7 KB). `_pages/search.html`
      already links the CLI-generated `pagefind-ui.css`, and the top half of `search.css` hand-copies
      the same base UI on top of it. Needs a `make serve` (Pagefind built) to byte-compare before cutting.
      Biggest single remaining win.
- [ ] **chrome.css repeats itself** — 4 near-identical circular icon-button recipes (`.site-rss`,
      `.appearance-trigger`, `.site-search__trigger`, `.footer-social a`); two byte-identical backdrops;
      two popups sharing 9 declarations; `.site-search__panel` opened twice, 30 lines apart.
      Ships on every page, so worth collapsing into shared primitives.
- [ ] **base.css dead selectors** — `.visually-hidden` (no markup uses it), `img.round`,
      `figcaption.center/right`, `audio.small/medium/left/right`, `object, embed`, `aside.left/right`,
      `tfoot`. All verified against 1,456 built pages. Removing needs care: kramdown and
      `sidenotes.js` generate markup that has no literal source match.
- [ ] **base.css duplication** — `.sidenote` declared twice; `.sidenote`/`.sidenote-inline` repeat
      6 declarations; `html`+`body` both set `scroll-behavior` (the `body` copy is inert).
- [ ] **Two spacing systems** — ratio-derived `--space`/`--space-smaller` vs fluid Utopia `--space-*`.
      Only 3 rules in base.css still use the ratio one; cheap to finish migrating.
- [ ] **`--sidenote-min-gutter` is hand-synced with JS** (`assets/scripts/sidenotes.js` `MIN_GUTTER_REM`).
      CSS declares a number it never reads. Either have JS read it via `getComputedStyle`, or drop the
      token and keep the JS constant.
- [ ] **base.css section order** — media rules and `hr`/`kbd` are stranded in the reset zone, ~240 lines
      from where they belong; `.highlight` sits 50 lines from `pre`/`code`. A proposed order is in the docs.

- [ ] **Dark-mode image dimming is dormant and inverted** *(found 2026-07-19)* — the
      `@media (prefers-color-scheme: dark) { img, video { opacity } }` rule in `config.css` keys off
      the **OS** setting, not `[data-theme]`. Verified in-browser: OS-light + reader-chosen dark
      never dims; OS-dark + reader-chosen light dims images on a light page. Fix is to mirror the
      `[data-theme="dark"]` + `auto`-scoped pattern from `themes.css` — but switching it on is a
      visible change to every image, so it's a design call, not a silent fix. Diagnosis is in the
      CSS comment.
- [ ] **`/devices/` images are missing** — every entry in `_data/devices.yaml` has the placeholder
      `img: img.jpg` and `static/devices/` is empty, so the page has always rendered broken images.
      Pre-existing, unrelated to the CSS work; needs real images + a data edit.
- [ ] **`photos.md` → `layout: album`** when there's something to show (currently a prose stub).
- [x] ~~**Demote footnotes out of base**~~ *(investigated 2026-07-19 — **rejected**)*. Not
      posts-only: `_pages/about-brajeshwar.com.md` and `_pages/books.md` both use footnotes, so
      moving them into `post.css` would break sidenotes and the foot fallback on those pages.
      They stay in `base.css`.

## Standardise the site width — ✅ DONE 2026-07-27
**`--body-width-max` is 81rem / 1296px, and it is the only content width on the site.**
Brajeshwar's call: *"Archives, and everything on the website should now run on the same
width"*, then *"standardize at the size that encompasses the sidenotes too."* Header, footer,
`main`, galleries and archives all measure 1296px; verified aligned on `/`, `/about/`,
`/archives/`, `/film/` and an article.

**The number is derived, not chosen.** It is the width that holds an article *and* its
sidenotes:

    --measure                                    665px
    + 2 x (--sidenote-gap 56 + --sidenote-width 256)   624px
    = 1289px  → rounded up to a whole 81rem (1296px)

The article is centred, so the gutter has to be paid for on both sides — that doubling is the
whole number. 1280px was 9px short of this, and measuring showed sidenotes rendering **5px
past** the band, overhanging the new header and footer rules. `.sidenote`'s width is now
computed against the band (`min(96vw, --body-width-max)`) rather than `100vw`, so notes clamp
to the band exactly instead of drifting into the margin outside it — verified touching the
edge with 0px slack at bands of 1200/1100/1000px, and 3px inside at full width.

The reading column is untouched and is **not** an exception to this — articles cap at
`--body-width-ideal` (the 66rch measure) *inside* that band, which is a reading constraint,
not a second site width. Centres align, so nothing looks off-axis.

**`--body-width-wide` and `.container-wide` are gone.** They existed for about a day, while
this was undecided, so `/archives/` could be wide without dragging the header and footer with
it. Once the header and footer gained rules (same day), that gap became visible: archives
content overhung its own header rule by 32px a side. One width fixed it and deleted the
duplication.

Original research and the reasoning that produced 1280px is below, kept for the record.

**The goal.** One maintained width instead of the current split. The split exists because it
was easier to maintain by hand, not because it was designed.

**What's actually there today — four width tokens, not two** (`config.css`):

    --body-width-ideal   66rch (665px)   .container-ideal, the reading column
    --body-width-max     76rem (1216px)  main, the full-width container
    --body-width-medium  60rem (960px)   "large but not max" objects
    --body-width-full    1600px          figure.full / img.full breakout

Literal unification is not available: prose at 1216px is unreadable and a gallery at 665px is
pointless. **"One width" should mean one maintained number** — a single container with one
max-width, and the reading measure expressed as a grid track inside it. Prose keeps its
measure, galleries get the container, `figure.full` still breaks out via the existing
`calc(50% - 50vw)`. One value to change when the site should get wider or narrower.

**The blocking constraint, measured (see [`sidenotes.md`](sidenotes.md) → *The viewport
floor*).** Sidenotes need a **1210px** viewport, because `.container-ideal` is centred and so
spends as much on the dead left margin as on the working right gutter. An **asymmetric** grid
drops that floor to roughly **970–1010px** — the difference between sidenotes working on a
1024-class laptop and not. Fix this as part of the same change or the width choice inherits a
limitation it doesn't need.

**Target, from the research.** Design for **1280px**, hold a **1024px** floor, don't design
past **1536px**. Reasoning: screen-resolution stats report CSS pixels, so the common
1536×864 and 1280×720 rows are 1080p panels at 125% and 150% OS scaling. The CSS width most
desktop readers have is **1280–1536, not 1920** — and the window is narrower still after
browser chrome, the scrollbar, and readers who don't maximise. (`$breakpoint-large: 1024px`
is a *breakpoint*, a separate question from the design target; it looks fine as is.)

**Superseded, kept as the trail:** for about a day on 2026-07-27, `/archives/` used an opt-in
`.container-wide` (`--body-width-wide`) at 1280px while `--body-width-max` stayed at 76rem —
a deliberate stopgap while the site-wide call was still open. It is gone; see the resolution
at the top of this section.

- [x] **Single container max-width — 1280px, applied everywhere** *(2026-07-27)*.
- [x] **`--body-width-wide` / `.container-wide` removed** — duplication once the default moved.

**Still open, and unaffected by the width decision:**
- [ ] **Go asymmetric for the sidenote gutter?** Recommended, and now *more* valuable: the
      centred column makes sidenotes need a 1210px viewport, and asymmetric would drop that to
      ~970–1010px. Note the wider band does **not** help here — the sidenote gutter is measured
      from the reading column, which is unchanged. See [`sidenotes.md`](sidenotes.md).
- [ ] **Analytics.** Any viewport/resolution data for brajeshwar.com? A 25-year tech blog's
      readers skew nothing like worldwide desktop share, and our own numbers would confirm (or
      challenge) the 1280px choice with evidence rather than public averages.
- [ ] **`--body-width-medium` (60rem)** — only read by `--image-width-max`. Either rename it to
      say what it does or fold it in.
- [ ] **`--body-width-full` (1600px)** — deliberately kept: it sizes `figure.full` / `.gallery`
      breakouts, which are *supposed* to exceed the content band. Not a second site width.

## Design system & performance
- [x] **Icon system in `_includes/icons/`.** Footer social icons (Simple Icons CC0 brands +
      hand-authored `oinam`/`memos`) and the header icons (`search`, `rss`, `theme`) all live
      there now — one **filled** family, `currentColor`, shared `rss.svg`. See [`styles.md`](styles.md) §4.
- [x] **`/photos/` page created** as a coming-soon placeholder (`_pages/photos.md`). Replace with
      the real photos component when ready (see *Content & pages* below).
- [x] ~~**Geist `.ttf` → `.woff2`**~~ — moot: the Geist option was removed entirely on
      2026-07-19 (near-duplicate of the system stack, 165 KB unsubsetted ttf). Libre
      Baskerville is now the only webfont and is already woff2. See [`styles.md`](styles.md).
- [ ] **Scope `sidenotes.js` to article pages.** It's loaded site-wide via `default.html` but
      only does anything where footnotes exist; skip it on the homepage/pages to shave a
      request from non-article loads (performance-budget tidy, not urgent).
- [x] **Reading width = character-based** — `--measure: 66rch` (~60–70 chars/line); video embeds
      switched to `aspect-ratio: 16/9`. See [`styles.md`](styles.md) §1.
- [x] **Default theme = monotone grayscale** — locked; zero-chroma scale + gray accent, colour
      opt-in. Link affordance via underline. See [`styles.md`](styles.md) §2 / [`design.md`](design.md).
- [x] **Page-load budget < 100 KB** (non-article pages) — documented as a hard target; homepage
      already ~48 KB raw / ~13 KB gzip. See [`design.md`](design.md) → *Performance budget*.

## Open questions
- [ ] **Theme toggle without JS?** Do we really need to remember the Light/Dark preference (and thus JavaScript)? A CSS-only approach: <https://codepen.io/ditheringidiot/pen/JjbzNMz>. (Note: the current build deliberately persists reader choice via JS + a no-flash snippet; revisit only if the CSS-only tradeoff is worth losing persistence.)

## Done
- [x] **Modern Font Stacks** adopted — <https://modernfontstacks.com> *(2025-12-30)*
- [x] **Search → dedicated `/search/` page** to reduce load on other pages.
- [x] **Search moved off Algolia → Pagefind.** Algolia (adopted 2025-06) hit monthly limits too easily; <https://pagefind.app> replaces it. See [`search.md`](search.md).
