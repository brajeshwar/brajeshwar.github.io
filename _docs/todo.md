# Todo — brajeshwar.com

Running list of site tasks. Session-by-session history is in [`memory.md`](memory.md).
Originally absorbed from the 2027 planning braindump.

## Tooling
- [ ] **Where the portable Claude setup lives** *(raised 2026-08-08)* — `/odo` and the
      `CLAUDE.local.md` queue convention work anywhere; the brajeshwar.com specifics do not.
      He is weighing a Claude Code template repo, dotfiles, or a git-versioned private
      `_root`. Until then `/odo` stays project-scoped in `.claude/commands/` — see CLAUDE.md,
      which says explicitly not to promote it.

## Content & pages
- [x] **Books shelf split by letter** *(2026-08-08)* — `_data/books/01.yaml` + `a`–`z`, and
      `_data/books-favorites.yaml` beside it. Filed by the first NON-ARTICLE letter, so "The
      Children" is in `c.yaml`. Cost: the home strip can no longer show the newest and shows
      the favorites instead. See [`memory.md`](memory.md).
- [x] **146 book covers** *(2026-08-07/08)* — from Open Library, then nine repaired after
      looking at all of them on a contact sheet. **21 books still have none** and are
      Brajeshwar's manual task: Open Library has nothing for them.
- [x] **`/own/`** *(2026-08-07/08)* — the inventory page, renamed from `/wear/`. Wear / Carry /
      Keep, rows that scroll sideways, brand logos on a fixed-light plate. **Still unlinked
      from nav** — his call when to add it.
- [x] **Titles on every page** *(2026-08-08)* — emitted by the layouts; a left-gutter spine on
      the index pages. See [`styles.md`](styles.md).
- [ ] **`/contact/` as a form embed** — the page is HTML and waiting; the embed shape is
      Oinam's Form service's to dictate, so nothing is scaffolded for it.
- [ ] **`/music/` to follow `/film/`** — artists into `_data/music.yaml`, `layout: album`, a
      card-grid include. The file is HTML now so the restyle is markup only.
- [x] ~~**`_src/wear/` still says wear**~~ *(closed 2026-08-08)* — he renamed it to `_src/own/`
      himself. LFS tracks `_src/**` by PATH, so the rule follows the folder and no `.gitattributes`
      change was needed; the folder holds only a `.gitkeep` so far.
- [x] ~~**`/blogroll/` returns 404**~~ *(closed 2026-08-08 — won't do)*. Deleted 2026-08-07;
      nothing on the site linked to it, so only an external bookmark would dead-end. Brajeshwar:
      "I'm not doing blogroll, is there is anything, delete it." No redirect, no page. The only
      surviving mention of the word is in a 2025 POST about the indie web, where it means the
      general thing and not this page — that is content and stays.
- [x] **Year jump-nav on `/archives/`** *(2026-07-26/27)* — all 26 years, always reachable.
      A horizontal strip hanging off the header rule, at every width — an auto-fit grid, so
      26 years are one row on a desktop and wrap into even rows on a phone. *(Corrected
      2026-07-27: this entry described a vertical left rail, iOS-Contacts style, which was one
      of three layouts tried and discarded — top bar → left rail → right rail → strip. A big
      "20" century mark sits in the left margin as the shared prefix.)* Single page
      with `#YYYY` anchors, chosen over `/archives/YYYY/` pages: vanilla Jekyll cannot generate
      a page per year without a plugin (guardrail 3), so per-year URLs would mean 26 committed
      stub files plus a new one every January — exactly the hand-maintenance we're shedding.
      The `<caption id="YYYY">` anchors already existed, so `/archives/#2024` had always
      worked; labels are 2-digit but hrefs and ids stay 4-digit, so no URL changed. CSS-only,
      no JS. See [`memory.md`](memory.md).
- [ ] **Year archives as separate pages** — `/2001/`, `/2002/`, … in the
      [Simon Willison](https://simonwillison.net/) style. Superseded in practice by the jump-nav
      above; only worth revisiting if the single page's weight becomes a problem (see below).
- [x] ~~**`/archives/` is over the page-weight budget**~~ *(raised 2026-07-26, closed
      2026-07-27 — not a problem)*. Brajeshwar's call: the budget is for the homepage and
      articles, not listing pages, and the same will apply to `/books/`, `/film/` and others.
      A listing's weight is its content. [`design.md`](design.md) → *Performance budget* now
      says so. For the record the page is ~329 KB raw / ~74 KB gzip, and switching its links to
      `relative_url` took 27.6 KB off (1,459 absolute URLs → 3).
- [ ] **Home = text only.** ⏸ **STILL PARKED 2026-07-27 at Brajeshwar's request** — *"I'm going
      to re-work on it. Park it for now. We need to think of how to show the books, it might
      become just SVGs or a Text Block without images."* ✅ **Half of it is answered**: the books
      treatment landed 2026-08-04 as the `.bookplate` below — CSS, not SVG and not a bare text
      block. The *page* question ("Home = text only") is untouched and remains his to call.
- [x] **Books with no cover picture** *(2026-08-04)* — *"I want to start adding more books but I
      don't want to spend time editing the book cover pictures now. Can we do a clean, nice
      book-esque design in CSS or SVG as the placeholder for books listing without a picture?"*
      An entry in `_data/books.yaml` with no `img` now renders a `.bookplate`: a plain bound
      board drawn in CSS — spine and hinge down the left, title in a serif on the paper face, a
      short rule, the author in letterspaced caps. Both `card-grid.html` (/books/) and
      `home-strip.html` (the home shelf) emit it, so a coverless book cannot show up broken on
      one page and fine on the other. **So a book is now a title, an author and a url**; the
      picture is optional and can arrive later with no other change. +319 bytes gzip on the one
      cached stylesheet. See [`memory.md`](memory.md) and `_sass/bookplate.scss`.
- [x] ~~**Page template (Full Width)** / **(Ideal Width)**~~ — closed 2026-07-27. The split
      these described is gone: there is ONE site width (64rem/1024px) and the reading measure is
      a constraint on prose *inside* it, not a second template. See *Standardize the site width*
      below and [`styles.md`](styles.md) §6.
- [x] **Timeline template** *(2026-07-27)* — `/about/` is now a vertical timeline with a
      CSS-only Life/Work filter and shareable `#work` / `#life` URLs, so `/about/#work` is the
      link to send instead of a CV. `_pages/about.html` + `timeline.css`; `/now/` wears the same
      visuals. See [`timeline.md`](timeline.md). Two follow-ups are open, below: the
      "Download Resume" PDF and retiring `cv.brajeshwar.com`.
- [ ] **"Download Resume" PDF** — the Work track as a downloadable file. Obvious home is beside
      the Life/Work pill when Work is the active view. Worth deciding then whether the PDF is
      generated from the timeline markup or maintained separately.
- [ ] **Retire `cv.brajeshwar.com`** once `/about/#work` has been live a while — belongs with the
      other Cloudflare Worker redirects above.
- [x] **`/album/` is real** *(2026-08-01)* — eight photographs replacing the twelve borrowed
      book covers, entries sorted by `img` filename. ⚠️ Two of the eight have no `url` and
      render **unlinked by design**; both includes guard on the field rather than emitting
      `<a href="">`, which is a link to the current page, not an inert one.
- [x] **`/books/` is now `books.html`** *(2026-08-01)* — HTML markup, Markdown reserved for
      prose-heavy pages. URL unchanged (`_pages` is `permalink: '/:name/'`). Its free-libraries
      and references lists sit at the foot as one list in `columns: 18rem 3`, a step smaller.
- [ ] **Photos component** — a style that highlights key photos. Likely after <https://pictures.oinam.com> is up.

## Infrastructure & migrations
- [x] **`_redirect` collection is real now** *(2026-08-01)*. It was declared in `_config.yml`
      and completely empty — no folder, no `_layouts/redirect.html` — so the machinery existed
      on paper only. `/photos/` → `/album/` needed it: that URL was live and returning 200 in
      production, and guardrail 2 preserves every URL. The layout is a `<meta http-equiv>`
      refresh plus a canonical to the target, `noindex, follow`, and a real visible link for
      when the refresh is blocked. No JavaScript, so it works with scripting off.
      ⚠️ `sitemap: false` goes on the redirecting PAGE, not the layout — layout front matter
      does not propagate, and the stub appeared in `sitemap.xml` until it was moved.
- [ ] **Redirect** `docs.brajeshwar.com` → <https://archive.oinam.com> via Cloudflare Workers.
- [ ] **Move Jekyll redirects** to Cloudflare / plain HTML — or drop them and give a good explanation and next step in the 404 page.
- [ ] **Migrate `cdn.oinam.com`** remnants to `brajeshwar.com`.
- [ ] **YouTube videos** — move to `brajeshwar.com`, or embed and ignore, or self-host (PeerTube for Oinam or similar).

## CSS architecture (decided 2026-07-19 — see [`styles.md`](styles.md) §5)

> ⚠️ **The delivery half of this was superseded 2026-07-27.** CSS is no longer inlined and no
> longer split per layout: one external `assets/styles/site.css`, content-hashed, cached a
> year. The `styles:` key is gone. Items below that talk about *what ships to which page* are
> historical; items about *how the files are organized* still stand. [`styles.md`](styles.md)
> §5 → *The principle, restated*.
Three tiers: base embedded on every page → one bundle per layout → per-page opt-in for
one-offs only. Keep embedding; no external stylesheet. Ordered roughly by value/effort.

- [x] **Fix `2.1-code.css` orphan + tokenise it** *(2026-07-19)* — the partial was included by
      nothing, so syntax highlighting never shipped (55 posts have code blocks). Wired into
      `styles-posts.html`, then tokenised: it was the upstream pygments "native" theme with
      ~100 hardcoded hex values and its own fixed dark slab that ignored mode + palette. Now it
      references only the new `--code-*` tokens in `0.1-color.css`. Also added `c1`/`cd`/`s1`/`s2`
      (Rouge classes the upstream file lacked — comments and strings were rendering as plain code)
      and dropped the `.err` background box (lexer false positives). File 4.8 KB → 3.6 KB.
      Browser-verified light + dark; all tokens ≥ 4.49:1 contrast across default/nord/eink.
- [x] **New `album.html` layout** *(2026-07-19)* — `_layouts/album.html` + `styles-album.html` +
      `4.1-album.css`. `film` and `devices` now share it. `books` is not a gallery (prose page,
      stays on `layout: page`); `4.1-pages-books.css` turned out to be a byte-identical copy of
      the film CSS — both deleted. Fixed `/devices/`, which had shipped with no gallery CSS at all.
      Added `:focus-visible` on card links; `x-small` → `--step--2`. Browser-verified light + dark.
- [x] **Merge `page-full.html` into `page.html`** *(2026-07-19)* — one layout, conditional wrapper,
      defaults to `container-ideal`. All 22 reading pages verified unchanged. `full: true` exists
      but has no users (film/devices went to `album`).
- [x] **Flatten the CSS file structure** *(2026-07-19)* — 25 numbered ITCSS partials → 12 plainly
      named files: `config` · `themes` · `base` · `chrome` · `post` · `page` · `album` + per-page
      one-offs (`home`, `archives`, `search`, `now`) + `bookmarks`. Numbering dropped; cascade order
      now lives only in `styles.html`. Verified equivalent: identical byte counts and identical rule
      sets on 7 page types, one intentional reorder (`.block-*` utilities ahead of chrome, no
      selector overlap). Old→new map in [`styles.md`](styles.md) §5 → *Old → new filename map*.
- [x] **`4.1-pages.css` (0 bytes)** → now `page.css`, kept as the page-tier hook with a comment
      explaining why it's empty.
- [x] **`4.1-pages-bookmarks.css`** → now `bookmarks.css`. Not deleted — it styles a
      `<bookmarks-header>` for a bookmarks page that doesn't exist yet, i.e. in-progress work.
      Still included by nothing.
### From the 2026-07-19 CSS audit — not yet done
Full findings and evidence in [`styles.md`](styles.md) §5 → *Audit backlog*.
- [x] **search.css** *(done 2026-07-27, against a real Pagefind build)* — the audit's premise was
      wrong, and the truth was worse. A rule-by-rule comparison against `pagefind-ui.css` found
      zero shared selectors: Pagefind's carry Svelte scoping hashes (`.svelte-4xnkmf`), so they
      are (0,3,0) against our (0,1,0), and its `<link>` sits in the page body so it also won every
      tie against our inlined `<head>` styles. The file was almost entirely inert. Proved by
      A/B: with `search.css` removed entirely, `/search/` rendered identically — same padding,
      same radius, same 21px title, same browser-default *yellow* `<mark>` on a site whose whole
      point is that color is opt-in. ~10 KB was shipping to that page and styling nothing.
      - Fixed by scoping every rule under `#search` — the container `_pages/search.html`
        already provides. One ID beats any number of classes, so the theme now actually applies.
      - The real duplication was internal: a hand-copy of Pagefind's defaults followed by a
        second half re-declaring the same eight selectors at equal specificity, the first half
        losing on source order. One block per selector now.
      - Six rules removed, each verified dead against a live populated page (not by reading):
        `result-content` ×2 (this version emits `result-inner`), `result-tags`/`-tag` (no filters
        configured), `result-date` (not indexed), and a `display: block !important` block left
        from a debugging session.
      - Two real bugs fixed on the way. The focus style was
        `.pagefind-ui__result-link:focus .pagefind-ui__result-title` — inverted nesting, so it
        never matched and keyboard readers got *no* focus indication on a result. And Pagefind
        emits an empty `result-thumb` on every result, which its own flex rule turned into a
        blank column, so text started a third of the way across.
      - Hardcoded px are gone; the page now follows the reader's text-size and palette.
      - Verified light and dark on a populated page.
- [x] **chrome.css repeats itself** *(done 2026-07-27)* — 1,010 bytes raw / 74 gzip off every
      page, and one fewer place for the next icon button to be copied into.
      - **`.icon-button`** is now the primitive for the three round header controls
        (`.site-rss`, `.appearance-trigger`, `.site-search__trigger`), which each carried their
        own copy. Element-agnostic — the `<a>` resets and the `<button>` resets are both in it —
        so the next one is one class, not a fourth copy. Specific classes stay beside it as the
        JS hooks, same split as `.pill` / `.appearance-options`.
      - **`.footer-social a` was NOT merged**, despite the audit listing it with those three.
        Measuring says it is a different treatment: padded rather than fixed-size, no circle, and
        on `--text-muted` rather than `--icon-color`, because it sits in muted footer text and
        not the header's tool cluster.
      - **The two backdrops and the shared half of the two cards are grouped**, not given a class
        — there are exactly two and neither is a family likely to grow. Promote to a class if a
        third overlay appears.
      - **`.site-search__panel` opened twice, 30 lines apart** — the Pagefind theming block is
        folded into the main one. The two blocks that remain are the *shared* card and the
        search-specific one, which is the intended split, not duplication.
      - Verified: all three buttons render identically (32px circle, same color, 17px glyph),
        the footer row kept its own look, and both popups open and paint unchanged in dark+Warm.
- [x] **base.css dead selectors** *(done 2026-07-27)* — all re-verified against the 1,456 BUILT
      pages, not the source, then removed: `.visually-hidden`, `img.round`,
      `figcaption.center/right`, the `audio.*` names in the size/float lists, `object, embed`
      (from the `iframe` group — `iframe` itself stays and is used), `aside.left/right` plus the
      `@media` reset that existed only for them, and `tfoot`. Every one measured 0.
      ⚠️ `sidenotes.js` still lists `aside.right, .aside.right` among the wide media it dodges.
      Left in on purpose: a `querySelectorAll` matching nothing costs nothing, and it is the
      right behavior if one is ever authored.
- [x] **`html`+`body` both set `scroll-behavior`** *(done 2026-07-27)* — the `body` copy was
      inert; `<html>` is the scrolling element. Removed.
- [ ] **base.css duplication, the rest** — `.sidenote` is still declared in two blocks (563 and
      609) and `.sidenote`/`.sidenote-inline` still repeat 6 declarations. Left alone
      deliberately on 2026-07-27: the second block is the focus/transition layer added later and
      merging them is a real refactor of live sidenote behavior, not a tidy. Worth doing with
      the sidenote work, not alongside unrelated cleanup.
- [ ] **Two spacing systems** — ratio-derived `--space`/`--space-smaller` vs fluid Utopia
      `--space-*`. ⚠️ **Not the 3 rules this entry claimed** — re-counted 2026-07-27: **10 call
      sites** across `base`, `home`, `post`, `archives` and `search`. Each is a visible spacing
      value, so this is a migration with a look to re-check, not a cheap tidy. Left for its own
      pass.
- [x] **`--sidenote-min-gutter` is hand-synced with JS** *(done 2026-07-27)* — dropped the CSS
      token, kept the JS constant. That direction rather than the reverse: having JS read the
      token would change the fold threshold and need a re-measure, and the measurement is the
      part that has gone wrong before. `MIN_GUTTER_REM` in `sidenotes.js` is now the only source.
- [ ] **base.css section order** — media rules and `hr`/`kbd` are stranded in the reset zone, ~240 lines
      from where they belong; `.highlight` sits 50 lines from `pre`/`code`. A proposed order is in the docs.

- [x] **Dark-mode image dimming** *(resolved 2026-07-27 — removed, not repaired)*.
      Brajeshwar: *"do the best practice that is the standard on the Internet."* That standard is
      to leave photographs alone: declare `color-scheme: light dark` so UA-rendered surfaces
      follow the mode (already done, on `:root` and as a `<meta>`), and do nothing to content
      images. Blanket-dimming was early dark-mode advice; knocking 40% off a photo just makes it
      muddy, and it is the reader's picture of a place that pays, not a UI surface. The rule was
      also broken in both directions (`prefers-color-scheme` reads the OS, not `[data-theme]`) —
      but fixing the selector would have shipped a worse page. Verified: images render at
      opacity 1 in dark mode on `/film/`. The narrow real case — transparent-background line art
      authored for white — wants per-image handling, not a site-wide filter; nothing needs it
      today (the logo is inline SVG on `currentColor`, the galleries are photographs).
- [ ] **`/devices/` images are missing** — every entry in `_data/devices.yaml` has the placeholder
      `img: img.jpg` and `static/devices/` is empty, so the page has always rendered broken images.
      Pre-existing and unrelated to the CSS work; it needs real images and a data edit.
- [ ] **`photos.md` → `layout: album`** when there's something to show (currently a prose stub).
- [x] ~~**Demote footnotes out of base**~~ *(investigated 2026-07-19 — rejected)*. Not
      posts-only: `_pages/about-brajeshwar.com.md` and `_pages/books.md` both use footnotes, so
      moving them into `post.css` would break sidenotes and the foot fallback on those pages.
      They stay in `base.css`.

## Standardize the site width — ✅ DONE 2026-07-27
**`--body-width-max` is 64rem / 1024px, and it is the only content width on the site.**
Brajeshwar's call: *"Archives, and everything on the website should now run on the same
width"*, then *"standardize at the size that encompasses the sidenotes too."* Header, footer,
`main`, galleries and archives all measure the same 1024px band; verified aligned on `/`,
`/about/`, `/archives/`, `/film/` and an article.

**The number is derived, not chosen.** It is the width that holds an article *and* one
sidenote gutter:

    --measure                            665px
    + --sidenote-gap 56 + --sidenote-width 256   312px
    = 977px  → 64rem (1024px), with 47px of breathing room

⚠️ **It was 81rem/1296px for part of 2026-07-27**, from the same sum with the gutter counted
**twice** — correct while the reading column was centered, because then the margin is mirrored
and you pay for the gutter on both sides. Going asymmetric (below) deleted that doubling and
took 272px off the site. Both numbers are kept here because the arithmetic is the point: the
width is a consequence of the sidenote decision, not an independent choice. `.sidenote`'s width is now
computed against the band (`min(96vw, --body-width-max)`) rather than `100vw`, so notes clamp
to the band exactly instead of drifting into the margin outside it — verified touching the
edge with 0px slack at bands of 1200/1100/1000px, and 3px inside at full width.

The reading column is untouched and is **not** an exception to this — articles cap at
`--body-width-ideal` (the 66rch measure) *inside* that band, which is a reading constraint,
not a second site width. Centers align, so nothing looks off-axis.

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
pointless. "One width" should mean one maintained number — a single container with one
max-width, and the reading measure expressed as a grid track inside it. Prose keeps its
measure, galleries get the container, `figure.full` still breaks out via the existing
`calc(50% - 50vw)`. One value to change when the site should get wider or narrower.

**The blocking constraint, measured (see [`sidenotes.md`](sidenotes.md) → *The viewport
floor*).** Sidenotes need a 1210px viewport, because `.container-ideal` is centered and so
spends as much on the dead left margin as on the working right gutter. An asymmetric grid
drops that floor to roughly 970–1010px — the difference between sidenotes working on a
1024-class laptop and not. Fix this as part of the same change or the width choice inherits a
limitation it doesn't need.

**Target, from the research.** Design for 1280px, hold a 1024px floor, don't design
past 1536px. Reasoning: screen-resolution stats report CSS pixels, so the common
1536×864 and 1280×720 rows are 1080p panels at 125% and 150% OS scaling. The CSS width most
desktop readers have is 1280–1536, not 1920 — and the window is narrower still after
browser chrome, the scrollbar, and readers who don't maximize. (`$breakpoint-large: 1024px`
is a *breakpoint*, a separate question from the design target; it looks fine as is.)

**Superseded, kept as the trail:** for about a day on 2026-07-27, `/archives/` used an opt-in
`.container-wide` (`--body-width-wide`) at 1280px while `--body-width-max` stayed at 76rem —
a deliberate stopgap while the site-wide call was still open. It is gone; see the resolution
at the top of this section.

- [x] **Single container max-width — 1280px, applied everywhere** *(2026-07-27)*.
- [x] **`--body-width-wide` / `.container-wide` removed** — duplication once the default moved.

**Still open, and unaffected by the width decision:**
- [x] **Asymmetric sidenote gutter** *(done 2026-07-27)*. The column is left-aligned in the
      band and the gutter is paid for once instead of mirrored into dead space. Sidenote floor
      1210px → ~980px viewport, measured. It is also what made the narrower site width
      possible — a centered column could not go below 1289px without starving the notes.
- [x] ~~**Analytics** (viewport data to validate the width)~~ — closed 2026-07-27,
      Brajeshwar: *"Ignore this for now. The width is good for now."* The 64rem/1024px band
      stands on the sidenote arithmetic, which is a constraint rather than a guess. Reopen only
      if the width is ever in question again.
- [x] ~~**Analytics: pick a replacement approach.**~~ — **restored as-is 2026-07-31**,
      Brajeshwar: *"can we add it back."* The `analytics.oinam.net` Umami beacon had been
      removed entirely 2026-07-27 (*"until I figure out a better way to do this"*), which left
      the site making zero cross-origin requests for four days. It is back in
      `_layouts/default.html`, deferred, unchanged.
- [x] ~~**Analytics: drop the extra origin, keep the numbers.**~~ — **settled 2026-07-31.**
      Brajeshwar: *"Remove oinam.net analytics. We will stick to Cloudflare."* The Umami beacon
      is gone again and nothing replaces it in the markup: the site is proxied by Cloudflare
      (`server: cloudflare`, `cf-ray` present, Fastly behind it for Pages), so request counts
      are already collected at the edge. Zero bytes to the reader, no origin, unblockable.
      Coarser than Umami — request-level, bot noise, no session depth — and that was accepted
      as the right trade.

      ⚠️ **Correction, recorded because this file argued the opposite for an hour.** The
      earlier entry said to prefer *Cloudflare Web Analytics* since "the CDN is already in the
      path." That was wrong, and it conflated two different products. Cloudflare Web Analytics
      is a client-side beacon served from `static.cloudflareinsights.com` — a separate
      hostname, so it costs the same DNS lookup and TLS handshake the Umami beacon did. Worse,
      it is on standard tracker blocklists: measured 2026-07-31, that host resolves fine via
      1.1.1.1 and 8.8.8.8 but returns **nothing on Brajeshwar's own resolver**, while
      `cloudflare.com` resolves normally from the same machine. It would under-count exactly
      the audience this site attracts. Edge analytics has no client request to block.
- [ ] **If per-visit depth is ever wanted, proxy — do not add an origin.** The one approach
      that keeps a real analytics product without the handshake: put the beacon behind this
      domain, e.g. a Cloudflare Worker or origin rule mapping `/js/script.js` through to a
      self-hosted host. It then rides the connection the browser already opened and reads as
      first-party, so blocklists do not apply. Only worth building if the edge numbers turn
      out to be too coarse to answer a real question.
- [x] **`--body-width-medium` (60rem)** *(done 2026-07-27)* — folded into `--image-width-max`,
      its only reader. One token named for what it does instead of two, one of which claimed to
      be a site width and was not.
- [ ] **Full-bleed is back, for two components only** *(2026-07-31)*. The homepage Books and
      Photos strips run to the viewport edge — Brajeshwar: *"thumbnails that spans the width of
      the browser viewport. The title is within our body width."* This **reverses** the entry
      below for those two, and nothing else: every other breakout still stops at the band. The
      mechanism is not a resurrected `--body-width-full` but `width: 100vw` +
      `margin-inline: calc(50% - 50vw)`, with `padding-inline-start: calc(50vw - 50%)` putting
      the first thumbnail back on the band's left edge so it lines up with the heading, the
      header rule and the logo.
      ⚠️ `100vw` includes the scrollbar and the band does not, so the strip is a scrollbar
      wider than the page can show. `body:has(home-container) { overflow-x: clip }` absorbs it
      — `clip`, not `hidden`, because `hidden` would make the body a scroll container and
      unstick the sticky header. Scoped with `:has()` so no other page is touched. The test is
      `document.documentElement.scrollWidth > window.innerWidth`, which is invisible by eye.
- [x] ~~**`--body-width-full` (1600px)**~~ — removed 2026-07-27. The premise no longer holds:
      Brajeshwar's call is that nothing may exceed the band (*"so it is still within the body
      width"*), so breakouts now stop at it and this token's only readers are gone.

## Breakpoints — consolidate (raised 2026-08-01)

Brajeshwar asked what the base mobile breakpoint is. The honest answer is that there isn't
one number: `_sass/breakpoints.scss` declares four tokens and calls them *"the four widths
the layout actually turns on"*, and that sentence is false. Audited 2026-08-01:

| | |
|---|---|
| declared tokens | `$small: 480`, `$medium: 800`, `$large: 1024`, `$extralarge: 1600` |
| actually in the CSS | **360, 480, 600, 768, 800, 1024, 1250** |
| rules using a token | **5** — album, base, home ×2, post |
| rules hardcoding px | **9** — archives ×4, base, chrome ×2, search, timeline |

Two of the nine hardcode a value that already *is* a token (`base.scss:294` = 480 = `$small`,
`archives.scss:250` = 1024 = `$large`), so those are free to convert. The genuinely
unaccounted-for values are **360, 600, 768, 1250**.

- [ ] **Convert the two accidental hardcodes to tokens** — zero visual change, pure tidy.
- [ ] **Decide whether 600 and 768 should both exist.** `chrome.scss` and `timeline.scss` turn
      at 600; `search.scss` and `archives.scss` turn at 768. Nothing needs them to differ.
- [ ] **`$large` (1024) is never used as a max-width breakpoint** — it is the band width. Worth
      asking whether it belongs in a file of *breakpoints* at all.
- [ ] **`$extralarge` (1600) has no media query at all** — it duplicates `--body-width-full`.
      One of the two should go.

⚠️ **Do not "simplify" this by collapsing tablet and desktop into one breakpoint** without
reading the note in [`styles.md`](styles.md) → *The home page*: the site has no
tablet-specific layout to begin with. What it has is per-component collapse points, which is
the better pattern and is why there is no single tablet number to delete.

## Thumbnails — re-cut to the template (raised 2026-08-01)

`/styleguide/` now carries a thumbnail template: **long edge 800px**, cropped to 3:4, 4:3 or
1:1. It came from measuring the built site rather than picking a round number — the widest a
thumbnail ever renders is **245px** (`/album/` masonry, whose columns grow to fill the band),
against 193px for the `/books/` `/film/` `/devices/` grids and 192px for the home strips. A
retina screen wants 2×, so 490px is the floor and 600px-wide gives ~20% headroom.

- [ ] **Re-cut `/static/films/`** — **97 of its 119 files** are `225 × 300`, i.e. **1.2×**
      where they render at 193px. The visibly soft one, and the largest job left. (`/film/`
      renders 112 `<li>`; 97 is the count that actually needs re-cutting.)
- [ ] **Re-cut `/static/books/`** — 9 files at `360 × 480`, 1.5× on `/album/`. Less urgent; they
      are fine in the home strip, which renders at 192.
- [ ] 129 of 136 existing files are already 3:4, so this is a resolution pass, not a re-crop.
- [x] **`/static/album/` cut to the template** *(2026-08-01)* — 8 photographs, native aspect,
      every one inside the 60 KB budget. ⚠️ The home album strip is now **240px**, so the retina
      floor for these is 480px. The narrowest cut is 554px wide: fine today, and the ceiling is
      about **280px** before they need re-cutting.

⚠️ **Keep the masters.** They are what a re-cut re-cuts from. **Two conventions since
2026-08-01** (full rules in [`/styleguide/`](../_pages/styleguide.md) § *Keep the master*):

- **Collections** — masters live in **`_src/{books,film,album,devices,wear}/`** at the repo
  root, on **Git LFS**, under the same slug as the published file. 12 files: 7 books, 1 film,
  4 album; `devices` and `wear` are still empty placeholders. Because `_src` starts with an underscore
  Jekyll never copies it, so masters stopped shipping with no `_config.yml` change — which
  retired the `exclude: static/*/src` question raised earlier the same day.
- **Year folders** — `static/2019/`…`static/2026/` — still `<name>-original.<ext>`, in place,
  **not migrated**. 41 files, 96 MB, of which **3 are linked directly from posts**, so their
  URLs are pinned. Migrating those three would break links for no gain.

- [ ] **The 86.3 MB decision — raised twice on 2026-08-01, decided neither time.** 38 of the 41 year-folder masters are referenced by nothing and
      ship on every deploy. Moving them to `_src/` would take `/static/` from 371 MB to about
      285 MB. ⚠️ Weigh it against the **GitHub LFS free tier: 1 GB storage and 1 GB bandwidth
      per month** — 86 MB is 8.6% of storage, and every CI checkout that pulls LFS spends
      bandwidth against the same quota. (`actions/checkout` does not pull LFS unless asked, and
      must not be asked: the build never reads `_src/`.) Raised, not done — Brajeshwar's call.

## Raised 2026-08-01, second half

⚠️ **Three of these four were raised by me and CLOSED by Brajeshwar on 2026-08-02.** They are
kept, per the log-history rule, because each one still looks like a bug to anyone who finds it
cold. They are not. Do not re-raise them.

- [x] ~~**Re-cut the `how-to-read-a-book` cover.**~~ **Closed 2026-08-02: "don't worry about
      the cover picture, let that be."** The top line of the title is missing from the file —
      the first crop used a 122px offset picked to keep the BOOK centred and it lands inside
      the words "How to" — and the 1280x927 original was deleted the same day on "do not worry
      about preserving the original". He has it in Apple Photos and has decided it is not worth
      redoing. ⚠️ The lesson survives the decision and is the reason this entry stays: when
      cropping a cover, **measure where the SUBJECT OF THE TITLE sits, not where the object
      sits.** The two were 122px apart here and only one of them was checked.
- [x] ~~**No `og:image` / `twitter:image` anywhere on the site.**~~ **Closed 2026-08-02: "I
      never cared about them and don't want to for my personal website."** A deliberate absence,
      not a gap. 35 posts carry a cover that no social preview will show, and that is the
      intended behaviour. Anyone auditing the head tags will find this missing and should leave
      it missing.
- [x] ~~**`/film/` says "Last updated: Dec 31, 2025."**~~ **Closed 2026-08-02: "I also want to
      maintain the last updated manually for film."** Hand-maintained on purpose. It is not
      derived from the data and must not be automated — the date means "when Brajeshwar last
      curated this list", which no file mtime or data length can stand in for.
- [ ] **`/devices/` has one `<a href="">`** — its own hand-written markup in `_pages/devices.html`
      with an entry that has no `url`. `card-grid.html` and `home-strip.html` both guard on the
      field now; devices does not. Six more `href=""` sit in old post bodies and are content.
      **The only one of the four still open.**

## Raised 2026-08-02 (sixth session)

What shipped is in [`memory.md`](memory.md) → *Where we are*: the in-post `.gallery`
(1600px bleed + /album/'s masonry), Serif → Source Serif 4 (Baskerville dormant), the
hover system (hairline token, full-row strip titles, link text darkens), six researched
sidenotes for the kids-smartwatch post. These are what it left open:

- [ ] **Decide Libre Baskerville's fate.** The swap to Source Serif 4 is an experiment —
      *"keep Baskerville. I want to see how things are."* Its three woff2 faces (86 KB) and
      `@font-face` blocks are dormant: nothing references the family, so they cost zero on
      the wire, and the revert is one line in `config.scss`. Once he has lived with Source
      Serif 4: either flip back, or delete the `libre-baskerville/` directory and its three
      `@font-face` blocks. **His call, after reading in it for a while.**
- [ ] ⚠️ **Source Serif's `wght` axis is clamped to 200:700.** The subset covers the weights
      the site uses (200/400/600, and 700 for `<strong>`). A future `--font-weight-*` token
      past 700 will silently flatten to 700 — the browser gives no warning. The re-subset
      recipe (instancer + pyftsubset) is in the `themes.scss` comment. Same class of trap as
      the Geist "naive subset flattens the axis" warning, from the other direction.
- [ ] **The two masonries share values by copy, not by rule.** `.gallery > ul` (base.scss)
      and `.item__cards.card-grid--masonry` (page.scss) both say `columns: 14rem`,
      `column-gap: --space-xs`, `break-inside: avoid` — deliberately not shared selectors
      (the album block is welded to card-grid.html's fallback-hint machinery). Raised with
      Brajeshwar 2026-08-02; agreed to leave until one of them actually changes. If they
      should ever be locked together, a three-line Sass mixin costs zero shipped bytes.
- [ ] **`_pages/styleguide.md` under-describes `.gallery`** — it shows the markup but says
      nothing of the 1600px bleed or the masonry. It is a `_pages/**` prose body (guardrail
      1), so **Brajeshwar's edit to make**, not an agent's.
- [ ] **The gallery's 1600px cap has never been seen.** The iframe harness clamps to the
      outer window (1512 on this machine), and the cap engages only beyond it. The formula
      is the same `min(100vw, --body-width-full)` photo-cover has shipped with since
      2026-07-27, so the risk is low — but "verified above 1600" remains unclaimable, for
      this and for photo-cover alike.
- [x] **Sidenotes as requested content work** *(2026-08-02)* — six researched, web-verified
      footnotes added to `/2025/kids-smartwatch-not-so-smart/` at his request by name. The
      pattern (from How to Read a Book, fifth session): sidenotes = kramdown footnotes; verify
      every fact before writing it; match the post's voice; single-paragraph notes, usually
      opening with a link, closing dry.

## Design system & performance
- [x] **Icon system in `_includes/icons/`.** Footer social icons (Simple Icons CC0 brands +
      hand-authored `oinam`/`memos`) and the header icons (`search`, `rss`, `theme`) all live
      there now — one filled family, `currentColor`, shared `rss.svg`. See [`styles.md`](styles.md) §4.
- [x] **`/photos/` page created** as a coming-soon placeholder (`_pages/photos.md`). Replace with
      the real photos component when ready (see *Content & pages* below).
- [x] ~~**Geist `.ttf` → `.woff2`**~~ — moot: the Geist option was removed entirely on
      2026-07-19 (near-duplicate of the system stack, 165 KB unsubsetted ttf). Libre
      Baskerville is now the only webfont and is already woff2. See [`styles.md`](styles.md).
- [x] **Scope `sidenotes.js` to article pages** *(done 2026-07-27, and tighter than asked)* — it
      is gated on `content contains 'class="footnotes"'`, so it loads where footnotes actually
      exist rather than merely on articles: 87 of 1,483 pages, down from all of them. It is
      the largest script on the site (4.9 KB minified) and only 85 of 1,456 posts have
      footnotes, so on 94% of posts it was loading, running, finding nothing and returning.
      `anchors.js` got the same treatment (453 posts, gated on an `h2`+). ⚠️ The `contains` test
      must be inline in the `if` — Liquid's `assign` does not evaluate it and fails silently
      *and truthily*. See [`javascript.md`](javascript.md).
- [x] **Reading width = character-based** — `--measure: 66rch` (~60–70 chars/line); video embeds
      switched to `aspect-ratio: 16/9`. See [`styles.md`](styles.md) §1.
- [x] **Default theme = monotone grayscale** — locked; zero-chroma scale + gray accent, color
      opt-in. Link affordance via underline. See [`styles.md`](styles.md) §2 / [`design.md`](design.md).
- [x] **Page-load budget < 100 KB** (non-article pages) — documented as a hard target; homepage
      already ~48 KB raw / ~13 KB gzip. See [`design.md`](design.md) → *Performance budget*.

## Found 2026-07-27 (second session)

- [x] **`:visited` was stealing chrome link colors, site-wide** *(fixed 2026-07-27)* — base.css
      styled links as `a, a:visited` / `a:hover, a:active`, both (0,1,1), which is higher
      than a plain class. Six components lost their color once visited: `site-nav a`,
      `.post-nav__link`, `.headerlink`, `.icon-button`, `home-books li a`,
      `.pagefind-modular-list-link`. Read as "slightly too dark" by default and as a wrong hue
      for anyone with an accent picked. Fixed at the cause — both base rules are `:where()`-
      wrapped now. See [`styles.md`](styles.md) §5.
- [x] **`.headerlink` had been deleted from post.css by accident** *(fixed 2026-07-27)* — the
      code/cards split removed 225 lines and took it along, so 453 posts rendered a bare,
      permanently visible, underlined § against every heading. Never deployed; found while
      merging the other two copies of the same rules. It exists once now, in base.scss.
- [x] **cards.css was being emitted twice** *(fixed 2026-07-27)* — home.css still pulled it in
      with an include, which became a duplicate the moment the manifest included it for
      everyone. 334 bytes.
- [x] **The gear had no tooltip** *(fixed 2026-07-27)* — every other icon-only control carries
      `title` + `aria-label`; the appearance trigger had only the label.
- [ ] **Fonts inside the CSS are hashed, but nothing verifies the pair stays in step.** The
      two-pass order in `hash-assets.mjs` (fonts → rewrite CSS → hash CSS) is correct and
      commented, but a future edit that reorders it would silently produce a CSS hash that does
      not cover its own font URLs. Worth an assertion in the script rather than a comment.
- [ ] **`/now/` has no agent-markdown twin.** `now.md` lives at the repo root rather than in
      `_pages/`, so `page.collection` is empty and `_layouts/default.html` skips the
      `<link rel="alternate" type="text/markdown">`. Moving it into `_pages/` would fix it and
      change nothing else, but it is a file Brajeshwar edits often — his call.

## Found 2026-07-27
- [x] **Base tier was carrying two things almost nothing used** *(split 2026-07-27)* — audited by
      testing every shipped rule against a real post, then against 8 posts to separate "unused
      here" from "unused anywhere". `code.css` (syntax highlighting) was 59% of `post.css`
      and went to all 1,456 posts, but only 55 (3.8%) contain a code block; it is now
      included conditionally. `cards.css` (`ul.item__cards`) was in `base.css` — 0 posts, 3
      pages — and now belongs to the album and home bundles. 687 bytes gzip (9.4%) off 1,401
      posts. Verified across all 1,456: zero posts with code missing the CSS, zero with CSS
      and no code, and all three card grids intact.
- [x] **Syntax highlighting removed entirely** *(2026-07-27, Brajeshwar's call)* — Rouge disabled
      in `_config.yml` and `code.css` deleted. 257 of the 310 code blocks were `plaintext`
      anyway, and it was the only default color on a monotone site. Disabling the highlighter
      beats deleting just the CSS: the `<span>` soup is kramdown's, so the stylesheet alone would
      have left ~1.5 KB/post of markup doing nothing. −262,286 bytes raw / −41,276 gzip across
      the 55 posts (−8.9% / −5.0%). ⚠️ Needed `:not(pre) > code` in base.css — kramdown drops
      `class="language-plaintext"` when the highlighter is off, so inline code silently lost its
      chip. Revert is three steps, documented in `_config.yml`.
- [x] **Jekyll's "Excerpt modified" warning on `_pages/archives.html`** *(fixed 2026-07-27)* —
      Jekyll builds an excerpt for every document by cutting at the first `\n\n`; that cut fell
      inside archives.html's opening `{%- comment -%}` block, so Jekyll rewrote the block to
      close it and warned. Fixed with `excerpt_separator: ''` on the `_pages` collection
      default, not on the one file: it is a property of the collection, and any page whose
      first blank line falls inside a Liquid block would warn the same way — which, in a repo
      that comments its templates this heavily, is most of them. Safe because nothing reads
      `.excerpt`, and jekyll-feed (the only plugin that would) feeds posts only. Proved by
      building both versions to separate destinations: feed byte-identical, all 1,486 built
      HTML files byte-identical.
- [ ] **Images carry no `width`/`height` attributes.** Two consequences, one already patched:
      (a) layout shift on every image as it loads; (b) sidenotes were being positioned
      against a figure that had almost no height yet — measured 79px at placement, 675px once
      decoded, so the note landed on the photograph. (b) is patched with a `ResizeObserver` in
      `sidenotes.js`, which is a patch and not a cure. Adding the attributes fixes both properly,
      but it means touching markup around content — Brajeshwar's call. See
      [`sidenotes.md`](sidenotes.md) → *Images without dimensions*.
- [x] **Node 18 in the deploy workflow is past EOL** *(fixed 2026-07-27)* — bumped to 22 LTS,
      which is also what the site is developed against locally. Node only runs the agent-markdown
      script and Pagefind, so nothing was broken; it was an unsupported runtime sitting in the
      deploy path. `build-agent-markdown.mjs` verified on 22 (1,479 files + llms.txt).
      *(Ruby is on 3.3.5, which is current.)* ⚠️ Watch the first Actions run after this ships.
- [ ] **Back to Top's height gate reads `scrollHeight` once, before images load.** The control is
      only built on a page taller than 2.5 viewports, measured at `DOMContentLoaded` — so a long
      gallery whose images have no intrinsic height yet can fail the test and never get one.
      `sidenotes.js` already solves this in the same repo by re-running on `window.load` and
      `document.fonts.ready`. Pre-existing; not worth fixing until a real page is affected.

## Open questions
- [x] ~~**Theme toggle without JS?**~~ DECIDED 2026-07-27 — no. Brajeshwar: *"Theme toggle
      cannot live without JavaScript and we need persistence for users visiting again."* A
      CSS-only toggle cannot remember a choice across visits, and remembering it is the point.
      The current build stays: JS + `localStorage` + the no-flash snippet in `default.html`.
      Closed, not deferred — don't reopen without a mechanism that persists.

## Done
- [x] **Modern Font Stacks** adopted — <https://modernfontstacks.com> *(2025-12-30)*
- [x] **Search → dedicated `/search/` page** to reduce load on other pages.
- [x] **Search moved off Algolia → Pagefind.** Algolia (adopted 2025-06) hit monthly limits too easily; <https://pagefind.app> replaces it. See [`search.md`](search.md).

## JavaScript
- [x] **Minify on publish** *(BUILT 2026-07-27)* — esbuild in the Actions workflow and in
      `make build`. 36.7 → 15.2 KB raw, 13.9 → 6.6 KB gzipped (59% / 52%).
      In place, changing no HTML reference — that is the design, not an implementation
      detail. Local `jekyll serve` and the Cloudflare Pages backup (build command is
      dashboard-side, deliberately left alone) never run this step and keep serving the readable
      originals. Pointing the layout at CI-only bundle files would have left both with no
      JavaScript at all. Verified on a real minified build: sidenotes placed, anchors built,
      Back to Top inserted, panel built, zero console errors.
- [x] ~~**Concatenate**~~ — *considered 2026-07-27, deliberately not done.* It needs the layout
      to reference bundle names, which is exactly the coupling the in-place design avoids; the
      gain was always minification rather than merging; and under HTTP/2 request count is not
      what costs. Shape if ever wanted: bundle-per-layout mirroring the CSS, plus a plan for the
      two non-CI environments. See [`javascript.md`](javascript.md).
- [x] **Subset Geist to woff2** *(done 2026-07-27)* — 169,056 → 47,596 bytes, a 72% cut.
      The variable machinery survives (`fvar`/`gvar`/`STAT`/`HVAR`, wght 100–900), verified by
      reading the axis back out of the built file *and* by measuring three different rendered
      widths at 100/400/900 in the browser — a naive subset flattens a variable font to one
      instance and every weight silently becomes 400. The `.ttf` stays in the repo as the
      re-subset source and is now `exclude`d from the build; it had still been shipping.
      Regeneration command is in the `themes.css` comment.
- [x] **`unicode-range` was wrong on all four faces** *(found and fixed 2026-07-27, while
      choosing Geist's range)*. Libre Baskerville declared `U+000-5FF` — but the files contain
      `’ “ ” – — • …`, every one of them above U+05FF. The range forbade the browser from using
      the font for exactly the characters that carry a serif's voice, so a reader on Serif got
      Libre Baskerville for the letters and the *system* serif for every apostrophe: the
      commonest non-ASCII character on the site, 3,197 times in a 400-page sample. All four
      faces now declare ranges read off their own cmaps. Verified in-browser: `’ — •` render in
      Libre Baskerville, not the fallback.
