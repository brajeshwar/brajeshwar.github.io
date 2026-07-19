# Todo — brajeshwar.com

Running list of site tasks, beyond the v2027 redesign phases (those are tracked in
[`memory.md`](memory.md) and [`v2027/spec.md`](v2027/spec.md)). Absorbed from the
`brajeshwar.com-2027` planning braindump.

## Content & pages
- [ ] **Year archives** — `/2001/`, `/2002/`, … in the [Simon Willison](https://simonwillison.net/) style.
- [ ] **Home = text only.** Reduce the homepage to writing; convert Books into a list of top rereads.
- [ ] **Page template (Full Width)** — Pages, Photos, Wear, Devices, Books, Films.
- [ ] **Page template (Ideal Width)** — posts, articles, optimised for reading.
- [ ] **Timeline template** — `cv.brajeshwar.com` as part of `/about`; eventually replaces the LinkedIn profile.
- [ ] **Photos component** — a style that highlights key photos. Likely after <https://pictures.oinam.com> is up.

## Infrastructure & migrations
- [ ] **Redirect** `docs.brajeshwar.com` → <https://archive.oinam.com> via Cloudflare Workers.
- [ ] **Move Jekyll redirects** to Cloudflare / plain HTML — or drop them and give a good explanation + next-step in the **404 page**.
- [ ] **Migrate `cdn.oinam.com`** remnants to `brajeshwar.com`.
- [ ] **YouTube videos** — move to `brajeshwar.com`, or embed and ignore, or self-host (PeerTube for Oinam or similar).

## CSS architecture (decided 2026-07-19 — see [`css-architecture.md`](css-architecture.md))
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
      selector overlap). Old→new map in [`css-architecture.md`](css-architecture.md).
- [x] **`4.1-pages.css` (0 bytes)** → now `page.css`, kept as the page-tier hook with a comment
      explaining why it's empty.
- [x] **`4.1-pages-bookmarks.css`** → now `bookmarks.css`. **Not deleted** — it styles a
      `<bookmarks-header>` for a bookmarks page that doesn't exist yet, i.e. in-progress work.
      Still included by nothing.
### From the 2026-07-19 CSS audit — not yet done
Full findings and evidence in [`css-architecture.md`](css-architecture.md) → *Audit backlog*.
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

## Design system & performance
- [x] **Icon system in `_includes/icons/`.** Footer social icons (Simple Icons CC0 brands +
      hand-authored `oinam`/`memos`) and the header icons (`search`, `rss`, `theme`) all live
      there now — one **filled** family, `currentColor`, shared `rss.svg`. See [`styles.md`](styles.md) §4.
- [x] **`/photos/` page created** as a coming-soon placeholder (`_pages/photos.md`). Replace with
      the real photos component when ready (see *Content & pages* below).
- [ ] **Geist `.ttf` → `.woff2`.** `assets/fonts/geist/Geist-Variable.ttf` is a raw TrueType;
      convert to woff2 (much smaller) so readers who pick Geist pay less. Inter and Libre
      Baskerville are already woff2. (Default load is unaffected — fonts load only when chosen.)
- [ ] **Scope `sidenotes.js` to article pages.** It's loaded site-wide via `default.html` but
      only does anything where footnotes exist; skip it on the homepage/pages to shave a
      request from non-article loads (performance-budget tidy, not urgent).
- [x] **Reading width = character-based** — `--measure: 66ch` (~60–70 chars/line); video embeds
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
