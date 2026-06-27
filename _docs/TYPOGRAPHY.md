# TYPOGRAPHY — brajeshwar.com

How type works on the site. Partner doc: [`COLOR.md`](COLOR.md). Spec: [`v2027/SPEC.md`](v2027/SPEC.md).

> **Golden rule:** never hand-pick a font-size, margin, or line-height. Everything
> comes from the scales below (`--step-*`, `--space-*`, `--scale`). Respect the
> rhythm — reuse a token, don't invent a number.

## Families & the font axis (Ovellum parity)
Defined in `_includes/css/0.0-config.css`. The reader picks the body font via the
**appearance panel** → `[data-font]` swaps the `--font-body` token (one of the four theming
axes; see [`COLOR.md`](COLOR.md)).

| Token | Stack | |
|---|---|---|
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, …` | system sans (default) |
| `--font-serif` | `ui-serif, Georgia, Cambria, Times, serif` | system serif |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | `code`, `pre` |
| `--font-body` | `var(--font-sans)` by default | **the body font** — what `[data-font]` swaps |

Legacy aliases kept: `--font-family-sans-serif → --font-sans`, `…-serif → --font-serif`,
`…-monospace → --font-mono`.

**Variable fonts** (`_includes/css/0.0-fonts.css`, bundled): `@font-face` for **"Inter var"**
(`assets/fonts/inter/InterVariable.woff2`) and **"Geist var"** (`assets/fonts/geist/Geist-Variable.ttf`),
`font-weight: 100 900`, `font-display: swap` → they **download only when chosen** (no page-load
cost otherwise). Libre Baskerville stays defined behind `--font-serif` as an optional upgrade.

### The `[data-font]` axis
```css
/* 0.0-config.css */
:root { --font-body: var(--font-sans); }   /* default */
[data-font="sans"]  { --font-body: var(--font-sans); }
[data-font="serif"] { --font-body: var(--font-serif); }
[data-font="inter"] { --font-body: "Inter var", var(--font-sans); }
[data-font="geist"] { --font-body: "Geist var", var(--font-sans); }
```
- `body { font-family: var(--font-body); }` (`1.1-base.css`) — applies the choice **site-wide**,
  like Ovellum (headings, nav, footer all follow). Post meta (`.post time`) stays sans via
  `4.1-posts.css`.
- Set on `<html>` by `appearance.js`, persisted in `localStorage('font')`, applied before first
  paint by the no-flash snippet (`sans` = no attribute = default).

> History: `cd3227e0` made posts sans; a Phase-1 draft flipped to serif; then a Reader-style
> Sans/Serif/Mono selector; **now** the Ovellum font axis (Sans/Serif/Inter/Geist), site-wide.
> If you want UI pinned to sans regardless of choice, move `font-family: var(--font-body)` off
> `body` and onto `.container-ideal article` instead.

## Type scale (fluid, Utopia)
`0.0-config.css`, generated at <https://utopia.fyi> (320px @18px/1.2 → 1240px @20px/1.25).
Use these for **every** font-size:

`--step--2` · `--step--1` · `--step-0` (body) · `--step-1` · `--step-2` · `--step-3` · `--step-4` · `--step-5`

Headings (`1.2-typography.css`): h1 `--step-3` · h2 `--step-2` · h3 `--step-1` · h4 `--step-0` · h5 `--step--1` · h6 `--step--2`, all `font-weight: var(--font-weight-light)`, `line-height: var(--scale-small)`, `text-wrap: pretty`.

## Spacing scale (fluid, Utopia)
`0.0-config.css`. Use for **every** margin/padding:

`--space-3xs` … `--space-3xl`, plus one-up pairs (`--space-s-m`, `--space-m-l`, …) for fluid gaps.

## Vertical rhythm & line-height
- Body `line-height: var(--scale)` = `--golden` (1.618) — generous, suits serif reading.
- Headings `line-height: var(--scale-small)` = `--minor-third` (1.2) — tight.
- Modular-scale ratios live in `0.0-config.css` (`--golden`, `--minor-third`, `--minor-seventh`, …); the active ones are aliased to `--scale`, `--scale-small`, `--scale-large`.

## Reading measure
`--body-width-ideal: 46rem` (`.container-ideal`). At the fluid body size this lands near
the 60–70ch target (SPEC §4.3). Layout widths are owned by `1.1-base.css` / config — not
changed in Phase 1; the sidenote gutter arrives in Phase 2.

## Weights
`--font-weight-lighter` 100 · `--font-weight-light` 200 · `--font-weight` 400 · `--font-weight-bold` 600 · `--font-weight-bolder` 700.
