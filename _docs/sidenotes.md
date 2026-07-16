# SIDENOTES — brajeshwar.com

Tufte-style margin notes, built from the footnotes kramdown already emits. **No
content or markup changes** — old posts get sidenotes for free. Spec: [`v2027/spec.md`](v2027/spec.md) §5.

## Source markup (unchanged, kramdown)
```html
… text<sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote">1</a></sup> …
<div class="footnotes" role="doc-endnotes">
  <ol><li id="fn:1"><p>Note body. <a href="#fnref:1" class="reversefootnote">↩</a></p></li></ol>
</div>
```

## How it works
`assets/scripts/sidenotes.js` (loaded `defer` from `_layouts/default.html`), scoped to
`.container-ideal article`:

1. Finds each `article` that has a `.footnotes` block and `sup[id^="fnref"]` references.
2. **If the right margin has room** (`window.innerWidth − article.right ≥ --sidenote-min-gutter`):
   adds `.has-sidenotes` to the article (→ hides the bottom `.footnotes` block), and for each
   reference clones its `li#fn:N` into an `<aside class="sidenote">` placed at `left: 100%`
   in the right gutter, `top` aligned to the reference. The `↩` back-link is stripped; the
   reference number is kept as `.sidenote-ref`.
3. **If not** (narrow screens): no asides; the `.footnotes` block renders normally at the foot.
4. **JS disabled:** nothing runs; plain kramdown footnotes at the foot, all anchors work.

Wayfinding (Aresluna-inspired, see [`v2027/inspirations.md`](v2027/inspirations.md)):

5. **Cross-focus (sidenotes active):** hovering or keyboard-focusing a reference adds
   `.sidenote-focus` to the article and `.is-active` to the matching reference + sidenote
   pair — the pair lights up, other sidenotes dim. Works in both directions (hovering a
   sidenote highlights its reference). Clicking a reference spotlights the pair for ~1.5s
   instead of jumping (the foot block is hidden, so the anchor would go nowhere).
6. **Reveal-in-place (narrow screens):** tapping a reference opens the note as an inline
   `<aside class="sidenote-inline">` right after the current block (never inside a
   list/table — inserted after the nearest `p`/`ul`/`ol`/`blockquote`/`figure`/`table`/
   heading). One note open at a time; tapping the reference again or the panel dismisses
   it; `aria-expanded` is kept on the reference link. The foot `.footnotes` block stays,
   so jump-less reading is an enhancement, not a replacement.

Robustness:
- Note id is resolved from the reference's `href` (`#fn:1`), not by string-munging the
  `fnref` id — so repeated references (`fnref:1:1`) still map to the right note.
- Repeated references are de-duped (one sidenote per note, aligned to the first reference).
- Overlap is avoided by stacking: each note's `top` is `max(refTop, lastBottom + gap)`.
- **Wide media is dodged:** `.full`/`.large` images, `.gallery`, and `aside.right` poke past
  the column's right edge into the margin where sidenotes live; `collectObstacles()` records
  the vertical range of any such element that actually crosses into the gutter, and a note
  whose slot intersects one is pushed below it instead of rendering on top.
- Recomputes after `window.load` (images) and `document.fonts.ready` (fonts), and on
  resize (debounced 150ms) — which is also what folds notes back to footnotes when the
  window narrows, and restores them when it widens.

## CSS & tokens
- `_includes/css/2.1-footnotes.css` — `.footnotes` (foot fallback, unchanged) + the
  `.has-sidenotes` / `.sidenote` / `.sidenote-ref` rules, plus the cross-focus rules
  (`.sidenote-focus`, `.is-active`, `.is-open`) and the `.sidenote-inline` reveal panel.
  Note: `.sidenote` and `.sidenote-inline` are `<aside>`s, so they **explicitly reset**
  the generic `aside {}` box treatment (background/padding/border/serif).
  Both render at **`--step--1`** (sans, muted) — a deliberately larger note voice than a
  typical Tufte footnote; bumped one step up the scale for easier margin reading.
- Cross-focus uses only existing tokens: dimming via `--opacity-lower`, active note via
  `--text-color`, active reference via `--accent-hover` on `--mark`. Transitions respect
  the global `prefers-reduced-motion` kill switch in `1.1-base.css`.
- `_includes/css/0.0-config.css` — `--sidenote-width` (16rem, the *maximum*),
  `--sidenote-gap` (3.5rem), `--sidenote-min-gutter` (17rem, kept in sync with
  `MIN_GUTTER_REM` in the JS).
- **Fluid note width:** `.sidenote { width: min(var(--sidenote-width), calc((100vw − 100%) / 2
  − var(--sidenote-gap) − 1rem)) }` — the centered column leaves `(100vw − column)/2` of right
  margin; notes shrink to it (with 1rem breathing room to the viewport edge) rather than
  overflow. With the 17rem gutter threshold a note is always ≥ ~12rem wide.
- Color: `--sidenote-text` (semantic token, see [`styles.md`](styles.md)).

## Verified (live, 1440px)
- [x] Desktop: footnotes render as margin sidenotes aligned to references, clean (no box),
      sans-serif, muted. Bottom `.footnotes` block hidden.
- [x] Narrow (760px): sidenotes removed, `.footnotes` block restored at the foot with `↩`.
- [x] Resize between the two re-flows correctly (debounced).
- [x] No Markdown/content edits; works on a 2005 post.

## Possible follow-ups (not done)
- Tune `--sidenote-width` / breakpoint against very long notes and clustered references on real content.
