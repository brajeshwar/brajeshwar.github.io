# SIDENOTES — brajeshwar.com

Tufte-style margin notes, built from the footnotes kramdown already emits. No content or
markup changes: old posts get sidenotes for free. This doc is the spec.

## Source markup (unchanged, kramdown)
```html
… text<sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote">1</a></sup> …
<div class="footnotes" role="doc-endnotes">
  <ol><li id="fn:1"><p>Note body. <a href="#fnref:1" class="reversefootnote">↩</a></p></li></ol>
</div>
```

## How it works
`assets/scripts/sidenotes.js` (loaded `defer` from `_layouts/default.html`) is scoped to
`article.container-ideal`. It finds each `article` that has a `.footnotes` block and
`sup[id^="fnref"]` references, then checks whether the gutter has room:
`band.right − article.right ≥ MIN_GUTTER_REM`, where the band is the article's container,
not the viewport, since 2026-07-27. If it does, the script adds `.has-sidenotes` to the
article (which hides the bottom `.footnotes` block) and, for each reference, clones its
`li#fn:N` into an `<aside class="sidenote">` placed at `left: 100%` in the right gutter,
`top` aligned to the reference. The `↩` back-link is stripped; the reference number is kept
as `.sidenote-ref`. If the gutter lacks room, as on narrow screens, no asides are made and
the `.footnotes` block renders normally at the foot. With JS disabled nothing runs at all:
plain kramdown footnotes sit at the foot, and all anchors work.

Wayfinding (Aresluna-inspired, see [`inspirations.md`](inspirations.md)) comes in two parts.
Cross-focus, when sidenotes are active: hovering or keyboard-focusing a reference adds
`.sidenote-focus` to the article and `.is-active` to the matching reference and sidenote
pair, so the pair lights up while other sidenotes dim. It works in both directions; hovering
a sidenote highlights its reference. Clicking a reference spotlights the pair for ~1.5s
instead of jumping, since the foot block is hidden and the anchor would go nowhere.

Reveal-in-place, on narrow screens: tapping a reference opens the note as an inline
`<aside class="sidenote-inline">` right after the current block, never inside a list or
table — it is inserted after the nearest
`p`/`ul`/`ol`/`blockquote`/`figure`/`table`/heading. One note is open at a time; tapping the
reference again, or the panel itself, dismisses it, and `aria-expanded` is kept on the
reference link. The foot `.footnotes` block stays, so jump-less reading is an enhancement,
not a replacement.

For robustness, the note id is resolved from the reference's `href` (`#fn:1`), not by
string-munging the `fnref` id, so repeated references (`fnref:1:1`) still map to the right
note. Repeated references are de-duped: one sidenote per note, aligned to the first
reference. Overlap is avoided by stacking, with each note's `top` at
`max(refTop, lastBottom + gap)`. Wide media is dodged: `.full`/`.large` images, `.gallery`,
and `aside.right` poke past the column's right edge into the margin where sidenotes live, so
`collectObstacles()` records the vertical range of any such element that actually crosses
into the gutter, and a note whose slot intersects one is pushed below it instead of
rendering on top. The script recomputes after `window.load` (images) and
`document.fonts.ready` (fonts), and on resize (debounced 150ms), which is also what folds
notes back to footnotes when the window narrows and restores them when it widens.

## CSS & tokens
`_sass/base.scss` (the *Footnotes + sidenotes* section) holds `.footnotes` (the foot
fallback, unchanged) plus the `.has-sidenotes` / `.sidenote` / `.sidenote-ref` rules, the
cross-focus rules (`.sidenote-focus`, `.is-active`, `.is-open`), and the `.sidenote-inline`
reveal panel. Because `.sidenote` and `.sidenote-inline` are `<aside>`s, they explicitly
reset the generic `aside {}` box treatment (background/padding/border/serif). Both render at
`--step--1` (sans, muted), a deliberately larger note voice than a typical Tufte footnote,
bumped one step up the scale for easier margin reading.

Cross-focus uses only existing tokens: dimming via `--opacity-lower`, the active note via
`--text-color`, the active reference via `--accent-hover` on `--mark`. Transitions respect
the global `prefers-reduced-motion` kill switch in `base.css`.

`_sass/config.scss` declares `--sidenote-width` (16rem, the *maximum*) and `--sidenote-gap`
(3.5rem). ⚠️ `--sidenote-min-gutter` was removed 2026-07-27: CSS declared a number that
only the JS read. The threshold is `MIN_GUTTER_REM` (17) in `assets/scripts/sidenotes.js`
and nowhere else.

The note width is fluid: `.sidenote { width: min(var(--sidenote-width),
calc(min(96vw, var(--body-width-max)) − 100% − var(--sidenote-gap))) }`. The whole leftover
after the column and the gap IS the gutter, because the column is left-aligned in the band.
There is deliberately no `/ 2`: that halving belonged to the centered layout, which split
the leftover between two margins, and leaving it in would starve every note to half its
room. Color comes from `--sidenote-text`, a semantic token; see [`styles.md`](styles.md).

## The viewport floor: ~980px (measured 2026-07-27)

Sidenotes need roughly a 980px viewport before they appear. Below that a footnoted post
falls back to footnotes at the article foot, which is the designed behavior.

Measured in Chrome against the built site, not calculated:

| | |
|---|---|
| `1rch` | **10.08px** (not ~8px — the zero-glyph is wider here) |
| `--measure: 66rch` | **665px** column |
| `--sidenote-gap` | **56px** |
| `--sidenote-width` | **256px** (the maximum; notes shrink below it) |
| `MIN_GUTTER_REM` | **272px** (17rem) — the threshold, in `sidenotes.js`; no CSS token since 2026-07-27 |
| Floor | notes survive to a **940px band**, i.e. about a **980px viewport** |

### It used to be 1210px — what changed and why it mattered

The column was centered in the band, so the left and right margins were always equal, but
only the right one ever held a note. Every pixel of the left margin was dead space sized
identically to the gutter doing the work, and the floor was `665 + 2 × 272 = 1209`.

That doubling had a second cost, which is what finally forced the issue: a centered column
means the *site width* also has to pay for the gutter twice, so `--body-width-max` could not
drop below 1289px without starving the notes. The band was 1296px and read as too wide.

The fix, on 2026-07-27, was left-aligning the column
(`.container-ideal { margin-inline: 0 auto }`), so the gutter is paid for once. That
dropped the floor to ~980px, meaning a 1024-class laptop now gets sidenotes where before it
got none; it let the site width come down to 64rem / 1024px — `665 + 56 + 256 = 977` plus
breathing room, instead of `665 + 2 × 312 = 1289` — and it put the prose's left edge on the
band edge, the same line the header and footer rules draw.

### ⚠️ Images without dimensions — the placement race

Notes are positioned from measured geometry, so anything that has no height *yet* is
invisible to the math. Images here carry no `width`/`height` attributes, so at first layout
they contribute almost nothing.

Measured on `/2005/mumbai-marooned-july-26-27-2005/`: the figure was 79px tall when the note
was positioned and 675px once the image decoded, leaving the note sitting on top of the
photograph, with `document.readyState === 'complete'` and `img.complete === true`. The
`window.load` re-render was meant to cover this, but it can fire before a cached image is
laid out, so it was a race the page only *usually* won. It started losing on 2026-07-27,
when wide media stopped spilling into both margins and began extending right, into the
gutter the notes live in.

The fix is a `ResizeObserver` on the images, not on the article: placing a note changes the
article's size, so observing the article would re-trigger the observer on its own output,
while an image's size does not depend on where a note sits. No loop to debounce away.

This is a patch, not a cure. The real fix is `width`/`height` attributes on images, which
would also stop the layout shift every image currently causes. That is content-adjacent, so
it is Brajeshwar's call — tracked in [`todo.md`](todo.md).

### Things that must stay in step

1. ~~`--sidenote-min-gutter` hand-synced with `MIN_GUTTER_REM`.~~ Resolved 2026-07-27 by
   deleting the CSS token. One source of truth: `MIN_GUTTER_REM` in `sidenotes.js`.
2. `gutterFits()` measures the band, not `window.innerWidth`. The viewport version was
   correct only while the gutter was viewport margin; on a wide screen it now reports room
   the band does not offer.
3. `.container-ideal`'s `margin-inline: 0 auto` is re-declared in `post.css` as
   `margin: var(--space-s) auto var(--space-s) 0`, because `.post` carries the class and
   `post.css` loads later at equal specificity. Write `auto` on both sides there and the
   article re-centers, silently collapsing the gutter.

## Verified (live, 1440px)
- [x] Desktop: footnotes render as margin sidenotes aligned to references, clean (no box),
      sans-serif, muted. Bottom `.footnotes` block hidden.
- [x] Narrow (760px): sidenotes removed, `.footnotes` block restored at the foot with `↩`.
- [x] Resize between the two re-flows correctly (debounced).
- [x] No Markdown/content edits; works on a 2005 post.

## Possible follow-ups (not done)
- Tune `--sidenote-width` / breakpoint against very long notes and clustered references on
  real content.
