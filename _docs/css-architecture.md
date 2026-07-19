# CSS architecture — bundles, layouts, tiers

How CSS is split, which layout pulls which bundle, and the rules for adding more.
Theming (mode × palette × font × accent) lives in [`styles.md`](styles.md); the byte
budget lives in [`design.md`](design.md) → *Performance budget*.

**Decided 2026-07-19.** Supersedes the ad-hoc mix of `styles:` keys that grew during v2027.

## The principle
Embed everything — no external stylesheet, no extra request. At 6–7 KB gzip the inlined
CSS rides along in the same round trip as the HTML, which beats a cacheable external file
for a site whose traffic is mostly first-time arrivals on a single post.

Split by **layout**, not by page. A page-specific bundle is the exception, not the pattern.
The failure mode we're avoiding is CSS scattered across twenty opt-in keys where nobody can
tell what ships where.

## The files
**Flattened 2026-07-19** from 25 numbered ITCSS partials to 12 plainly-named files. The numbering
(`0.0-`, `2.1-`, `9.9-`) encoded cascade order for humans; the order now lives in one place —
`_includes/styles.html` — which is the only thing that actually determines it.

    _includes/css/
      config.css      ratios, scales, spacing, breakpoints   ← must stay first
      themes.css      palettes, light/dark, webfonts         ← only file with raw colour
      base.css        reset, type, tables, images, cards,
                      footnotes, block utilities
      chrome.css      header, footer, appearance, search
      post.css        article bundle
      page.css        page bundle (empty hook today)
      album.css       gallery bundle
      home.css        \
      archives.css     |  per-page one-offs
      search.css       |
      now.css         /
      bookmarks.css   not yet wired up — see below

## The three tiers

### Tier 0 — Base (every page, always)
`config` → `themes` → `base` → `chrome`, in that order, assembled by `_includes/styles.html`.
Order is load-bearing: `config` defines the `$breakpoint-*` SCSS vars and every custom property
downstream reads, so it stays first.

Base is the thing to protect. Adding here costs every one of ~1,456 pages.

### Tier 1 — Layout bundles (one per layout, via the `styles:` **layout** key)
Each layout names one include, which pulls one file. This is where new CSS should go.

| Layout | Bundle | File |
|---|---|---|
| `post.html` | `styles-posts.html` | `post.css` — article layout, syntax highlighting, gallery, heading anchors |
| `page.html` | `styles-pages.html` | `page.css` — empty hook; pages get what they need from base + chrome |
| `album.html` | `styles-album.html` | `album.css` — album cards, thumbnails, captions |

Two things deliberately live in **base** rather than a layout bundle:
- **`ul.item__cards`** (the flex grid) — the homepage books list and the album layout both use it.
- **Footnotes + sidenotes** — two *pages* use footnotes (`about-brajeshwar.com`, `books`), not
  just posts, so demoting them to `post.css` would break them.

### Tier 2 — Per-page opt-in (via the `styles:` **page** front-matter key)
Reserved for genuinely singular pages. Four today; the bar for a fifth is high.

    index.html          css/home.css
    _pages/archives     css/archives.css
    _pages/search       css/search.css      (Pagefind UI — biggest file, 9.7 KB)
    now.md              css/now.css

### Old → new filename map
Historical entries in [`memory.md`](memory.md), [`styles.md`](styles.md) and
[`v2027/spec.md`](v2027/spec.md) still use the numbered names. They are kept as written —
this table resolves them.

| Old | New |
|---|---|
| `0.0-config.css` | `config.css` |
| `0.0-fonts.css`, `0.1-color.css` | `themes.css` |
| `1.1-base.css`, `1.2-typography.css`, `1.3-table.css`, `2.1-images.css`, `2.1-cards.css`, `2.1-footnotes.css`, `9.1-utils-ui.css` | `base.css` |
| `3.1-header.css`, `3.1-footer.css`, `8.1-tools-theme-toggle.css`, `8.2-tools-search.css` | `chrome.css` |
| `4.1-posts.css`, `2.1-code.css`, `2.1-images-gallery.css`, `9.9-utils-anchorjs.css` | `post.css` |
| `4.1-pages.css` (0 bytes) | `page.css` |
| `4.1-album.css` | `album.css` |
| `4.1-home.css` / `4.1-archives.css` / `4.1-search-pagefind.css` / `4.1-pages-now.css` | `home.css` / `archives.css` / `search.css` / `now.css` |
| `4.1-pages-bookmarks.css` | `bookmarks.css` |
| `4.1-pages-film.css`, `4.1-pages-books.css` | deleted (duplicates, superseded by `album.css`) |
| `4.1-search.css` | deleted earlier (Google CSE, dead since the Pagefind move) |

**`bookmarks.css` is included by nothing.** It styles a `<bookmarks-header>` element for a
bookmarks page that doesn't exist yet. Kept on purpose — in-progress work, not dead code.

### Verifying a restructure
The flatten was checked by diffing the emitted `<style>` block on seven page types before and
after: identical byte counts and identical rule sets, with one intentional reorder (the three
`.block-*` utilities moved ahead of chrome; no selector overlap, so no cascade effect). Worth
repeating that check on any future reshuffle:

    ruby -e 's=File.read(ARGV[0]).scan(/<style[^>]*>(.*?)<\/style>/m).flatten.join; \
      puts s.scan(/(?:^|\})([^{}@]{1,80})\{/).flatten.map(&:strip).sort.join("\n")' \
      _site/index.html > /tmp/rules-before.txt

### Two keys, easily confused
- `styles:` (plural) — names a CSS include. Works on a **layout** (tier 1) or a **page** (tier 2).
- `style:` (singular) — a CSS **class** written onto `<main>`. A layout/styling hook, not a bundle.

## The `album` layout (built 2026-07-19)
A thumbnail grid for photos, videos, or both — a simple album hosted here, likely linking out
to Oinam's photo site later.

`film` and `devices` were already the same thing wearing two hats: a `ul.item__cards` grid of
`figure`s with a cover image, a title, and a bit of meta. They now share `_layouts/album.html`
+ `styles-album.html` + `4.1-album.css`, with per-collection differences left on the `style:`
hook (`.page-film`, `.page-devices` — e.g. devices stacks its "Used: …" line, film keeps the
year inline).

**`books` is *not* part of this.** It looked gallery-shaped from the filename `4.1-pages-books.css`,
but that file was a copy of the film CSS and `_pages/books.md` is prose — headings, lists,
footnotes, no card grid. It stays on `layout: page`. `photos.md` is a "Coming Soon" prose stub
today; it's the natural third album once there's something to show.

What the consolidation fixed: `/devices/` had `style: page-devices` but **no `styles:` key**, and
its selectors lived inside `4.1-pages-film.css` which only `film.html` loaded — so the devices
grid shipped with no gallery CSS at all. It does now.

Two small improvements folded in: `:focus-visible` on the card links (the originals styled only
`:hover`/`:active`, leaving keyboard users no affordance), and `font-size: x-small` swapped for
the site's `--step--2` (same computed 12.8px, now on the type scale).

⚠️ **Pre-existing, not fixed here:** `/devices/` renders broken images. Every entry in
`_data/devices.yaml` has the placeholder `img: img.jpg`, and `static/devices/` contains zero
files. That page has always shipped that way; fixing it needs real images plus a data edit
(guardrail #1 territory).

## Merging `page-full.html` into `page.html`
Today the two layouts have identical front matter and differ only in the wrapper:

    page.html       <main class="container-ideal {{ page.style }}"><article>…  ← reading width
    page-full.html  <main class="{{ page.style }}">…                          ← full bleed

**They are not interchangeable.** 22 pages use `page` (about, books, contact, blogroll,
styleguide, 404, …); only 2 use `page-full` (`_pages/film.html`, `_pages/devices.html`).
Defaulting the merged layout to the full-bleed body would drop `container-ideal` from all 22
and push prose edge-to-edge.

**Done 2026-07-19.** The merge kept one file with a conditional wrapper, defaulting to reading
width:

    ---
    layout: default
    styles: styles-pages.html
    ---
    {% if page.full %}
      <main role="main" class="{{ page.style }}">{{ content }}</main>
    {% else %}
      <main role="main" class="container-ideal {{ page.style }}"><article>{{ content }}</article></main>
    {% endif %}

One layout, both behaviours, 22 pages unchanged (verified: every page that was on
`container-ideal` still is). `page-full.html` is deleted.

`full: true` has **no users** — film and devices went to `album` instead. It stays as a
documented capability for a future full-bleed page that isn't a gallery; if that never
arrives, drop the conditional and the layout gets simpler again.

## Bugs found while mapping this (2026-07-19)
Three partials are **never included by anything** — dead weight in the repo and, for two of
them, visibly missing styles in production:

| Partial | Size | Impact |
|---|---|---|
| `2.1-code.css` | 4.8 KB | ~~**Syntax highlighting is monochrome site-wide.**~~ **FIXED 2026-07-19** — see *Syntax highlighting* below. Affected 55 posts. |
| `4.1-pages-books.css` | 850 B | **Correction (2026-07-19):** not a rendering bug. The file is a **byte-for-byte copy of `4.1-pages-film.css`** and contains no `page-books` selectors at all — `/books/` is a prose page on `layout: page` that needs no gallery CSS and renders fine. Pure dead weight. Deleted. |
| `4.1-pages-bookmarks.css` | 781 B | No page references it; likely dead since a past restructure. |

Also: `4.1-pages.css` is **0 bytes**, so the `layout: page` tier currently adds nothing —
harmless, but it means tier 1 for pages is a placeholder rather than a working bundle.

And `_pages/devices.html` sets `style: page-devices`, but its selectors live inside
`4.1-pages-film.css`, which only `film.html` loads — so `/devices/` is unstyled too.

The `album` consolidation fixes books, devices, and film together.
`4.1-pages-bookmarks.css` needs a confirm-then-delete.

## Syntax highlighting (fixed 2026-07-19)
`2.1-code.css` was the upstream pygments **"native"** theme: ~100 hardcoded hex values and its
own fixed dark slab, theme-blind. Wiring it in unchanged would have put a dark block on every
page regardless of the reader's mode or palette — wrong for a site built around reader-chosen
theming. So it was tokenised instead:

- **New `--code-*` tokens in `0.1-color.css`.** Light and dark share one hue per token role and
  differ only in `--code-l` (lightness), so dark mode is a single-line flip rather than a
  duplicated palette. Chroma is one knob too: **`--code-c: 0` makes code fully monotone**,
  differentiating by weight/italic/underline alone — the setting most true to the monotone
  default, kept as an easy switch.
- **`2.1-code.css` references only those tokens.** Selectors grouped by role, so the file went
  4.8 KB → 3.6 KB while covering more classes.
- **Added `c1`, `cd`, `s1`, `s2`** — Rouge emits these, the upstream pygments file didn't have
  them, so single-line comments (43×) and single/double-quoted strings (108×) were rendering as
  plain code. All 33 classes the site actually emits are now covered.
- **Dropped the `.err` background box.** Rouge flags `err` on valid 2002-era ActionScript
  (33 spans across 5 posts, all false positives); a highlighted box drew the eye to a lexer
  artifact. A colour tint remains.

Verified in-browser, light and dark, at 1440px. Contrast on the code background: light ≥ 5.68:1,
dark ≥ 7.66:1, nord-dark ≥ 5.92:1, eink-light ≥ 4.49:1. The eink-light figure is comments
(`--color-fg-subtle`) sitting a hair under AA's 4.5 — a property of that shared site token, not
of the code CSS; raising it would mean diverging code comments from the site's subtle-text token.

Cost: the `--code-*` tokens live in `0.1-color.css`, which is base, so every page carries them
(+0.18 KB gzip on the homepage) even though only 55 posts have code. Kept there anyway — the
guardrail puts colour in `0.1-color.css`, and it's where you'd look for them.

## Rules for adding CSS
1. **Default to a tier-1 layout bundle.** New page type → new layout → one bundle.
2. **Adding to base needs a reason.** It costs every page. Re-measure gzip after.
3. **Tier 2 is for one-offs only** — a page nothing else resembles.
4. **Every partial must be reachable.** If nothing includes it, delete it or wire it up;
   the orphans above are what happens otherwise.
5. **Re-measure after any bundle change** — budget is ≤ 13 KB gzip per page.

Measure with:

    ruby -rzlib -e 'c=File.read(ARGV[0]); s=c.scan(/<style[^>]*>(.*?)<\/style>/m).flatten.join; \
      puts "raw #{s.bytesize} gzip #{Zlib::Deflate.deflate(s,9).bytesize}"' _site/index.html
