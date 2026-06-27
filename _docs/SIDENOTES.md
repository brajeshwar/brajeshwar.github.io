# SIDENOTES — brajeshwar.com

Tufte-style margin notes, built from the footnotes kramdown already emits. **No
content or markup changes** — old posts get sidenotes for free. Spec: [`v2027/SPEC.md`](v2027/SPEC.md) §5.

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

Robustness:
- Note id is resolved from the reference's `href` (`#fn:1`), not by string-munging the
  `fnref` id — so repeated references (`fnref:1:1`) still map to the right note.
- Repeated references are de-duped (one sidenote per note, aligned to the first reference).
- Overlap is avoided by stacking: each note's `top` is `max(refTop, lastBottom + gap)`.
- Recomputes after `window.load` (images) and `document.fonts.ready` (fonts), and on
  resize (debounced 150ms) — which is also what folds notes back to footnotes when the
  window narrows, and restores them when it widens.

## CSS & tokens
- `_includes/css/2.1-footnotes.css` — `.footnotes` (foot fallback, unchanged) + the
  `.has-sidenotes` / `.sidenote` / `.sidenote-ref` rules. Note: `.sidenote` is an
  `<aside>`, so it **explicitly resets** the generic `aside {}` box treatment
  (background/padding/border/serif) to render as plain margin text.
- `_includes/css/0.0-config.css` — `--sidenote-width` (16rem), `--sidenote-gap` (2.5rem),
  `--sidenote-min-gutter` (14rem, kept in sync with `MIN_GUTTER_REM` in the JS).
- Color: `--sidenote-text` (semantic token, see [`COLOR.md`](COLOR.md)).

## Verified (live, 1440px)
- [x] Desktop: footnotes render as margin sidenotes aligned to references, clean (no box),
      sans-serif, muted. Bottom `.footnotes` block hidden.
- [x] Narrow (760px): sidenotes removed, `.footnotes` block restored at the foot with `↩`.
- [x] Resize between the two re-flows correctly (debounced).
- [x] No Markdown/content edits; works on a 2005 post.

## Possible follow-ups (not done)
- Tap-to-reveal a note inline on narrow screens (SPEC calls it optional).
- Reference ↔ sidenote hover/focus highlight for wayfinding (`.sidenote-active` hook exists in spirit; not wired).
- Tune `--sidenote-width` / breakpoint against very long notes and clustered references on real content.
