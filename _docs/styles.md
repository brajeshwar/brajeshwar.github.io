# Styles — brajeshwar.com

The **specifics** of the visual system: typography, color & theming, and branding.
For the *why* behind these choices — the reading-first philosophy they serve — see
[`design.md`](design.md). Redesign brief: [`v2027/spec.md`](v2027/spec.md).

> **Golden rule (type):** never hand-pick a font-size, margin, or line-height. Everything
> comes from the scales below (`--step-*`, `--space-*`, `--scale`). Reuse a token, don't
> invent a number.
>
> **Golden rule (color):** no hardcoded colors outside `_includes/css/0.1-color.css`.
> Components reference tokens only. Known exceptions: `2.1-code.css` (pygments) and the
> Pagefind UI vars in `4.1-search-pagefind.css`.

---

# 1. Typography

How type works on the site. Lives in `_includes/css/0.0-config.css` (scales, families),
`0.0-fonts.css` (variable fonts), and `1.2-typography.css` (headings, rhythm).

## Families & the font axis (Ovellum parity)
The reader picks the body font via the **appearance panel** → `[data-font]` swaps the
`--font-body` token (one of the theming axes; see §2).

| Token | Stack | |
|---|---|---|
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, …` | system sans (default) |
| `--font-serif` | `ui-serif, Georgia, Cambria, Times, serif` | system serif |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | `code`, `pre` |
| `--font-body` | `var(--font-sans)` by default | **the body font** — what `[data-font]` swaps |

Legacy aliases kept: `--font-family-sans-serif → --font-sans`, `…-serif → --font-serif`,
`…-monospace → --font-mono`.

**Variable fonts** (`0.0-fonts.css`, bundled): `@font-face` for **"Inter var"**
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

## Reading measure (character-based)
The reading column is sized by **character count, not pixels** — comfort is a function of
characters per line (see [`design.md`](design.md) → *Comfortable measure*).

```css
/* 0.0-config.css */
--measure          : 66ch;              /* ~60–70 chars/line target */
--body-width-ideal : var(--measure);    /* .container-ideal reading column = the measure */
```
- `.container-ideal { max-width: var(--body-width-ideal); }` (`1.1-base.css`) → the reading
  column. `ch` resolves against the column's (body) font, so the measure holds at ~66
  characters whether the reader is on sans, serif, Inter, or Geist — it doesn't drift wide on
  large type the way a fixed `rem` width did (was `46rem` ≈ 80ch, now `66ch` ≈ 665px @20px sans,
  verified ~65–70 real chars/line).
- Media in the column (`figure`, `img`, video embeds) fits the measure. **Video embeds use
  `aspect-ratio: 16/9`** (`1.1-base.css`), not a width-derived pixel height — required now
  that the column width is font-relative.
- `--measure` is the knob: raise toward `70ch` for a looser line, lower toward `62ch` for
  tighter. The sidenote gutter (see [`sidenotes.md`](sidenotes.md)) lives in the space to the
  right of this column.

## Weights
`--font-weight-lighter` 100 · `--font-weight-light` 200 · `--font-weight` 400 · `--font-weight-bold` 600 · `--font-weight-bolder` 700.

---

# 2. Color & theming

Ported from **Ovellum** (ovellum.oss.oinam.com). All of this lives in `0.1-color.css`.

## Two orthogonal axes (the whole point)
Theming is split into **two independent axes**, both set on `<html>`:

| Axis | Attribute | Values | What it controls |
|---|---|---|---|
| **Mode** | `data-theme` | `auto` (default) · `light` · `dark` | light ↔ dark (appearance) |
| **Palette** | `data-palette` | `default` · `eink` · `flexoki` · `nord` · `solarized` | the colour scheme / hue |

They compose freely: **every palette has a light and a dark form**. "Nord + Dark",
"Solarized + Light", "E-ink + Auto" all work. `auto` follows `prefers-color-scheme`;
`light`/`dark` are explicit and win over the system.

Plus two more axes: `data-font` (see §1) and **accent** (`data-accent="custom"` + an inline
`--ov-accent`), which recolours links / nav / primary surfaces — 6 swatches
(Blue/Purple/Green/Amber/Red/Cyan) + Default + a custom colour picker.

## How the two axes stay independent — token layers
1. **Raw scale** — `--color-gray-50 … --color-gray-950` (+ white/black). **Palettes
   re-tint this scale** (`[data-palette=nord]` etc. redefine the grays with a hue).
2. **Semantic tokens** — `--color-bg`, `--color-surface`, `--color-fg`, `--color-fg-muted`,
   `--color-accent`, `--color-border` (a `color-mix`), `--color-code-bg`, `--color-primary`
   (inverted surface), … These **map onto the scale**, and **mode flips them**:
   `[data-theme=dark]` (and `[data-theme=auto]` inside `@media (prefers-color-scheme: dark)`)
   remaps `--color-bg` to `gray-900`, `--color-fg` to `gray-100`, etc.
   - Because the dark remap references the *scale*, and the palette already re-tinted the
     scale, **each palette gets its dark form for free**. Per-palette dark **accent** tuning
     is the only thing defined explicitly per palette.
3. **Bridge** — the site's legacy tokens (`--bg-color-*`, `--text-color-*`, `--border-color-*`,
   `--text-color-link`) and the v2027 semantic tokens (`--bg`, `--text`, `--rule`, `--accent`,
   `--mark`, `--code-bg`, …) are **aliased onto the semantic layer** in one `:root` block at
   the end of the file. So every existing component inherits palette + mode without edits.

New components should use the **`--color-*` semantic tokens** directly.

## Persistence & no-flash
- **No-flash snippet** (the one inline `<head>` script, in `default.html`) applies all axes
  before first paint:
  ```js
  (function(){try{var d=document.documentElement,g=localStorage,t=g.getItem('theme'),p=g.getItem('palette'),f=g.getItem('font');d.dataset.theme=(t==='light'||t==='dark')?t:'auto';if(p&&p!=='default')d.dataset.palette=p;if(f&&f!=='sans')d.dataset.font=f;}catch(e){}})();
  ```
  `data-theme` is **always** set (the auto media query targets `[data-theme=auto]`);
  palette/font drop the attribute on their default.
- **`assets/scripts/appearance.js`** (`defer`) builds the **appearance panel** and persists
  each axis to `localStorage` (`theme` / `palette` / `font`). It also updates
  `<meta name="theme-color">` from the computed `body` background. Ready-guard on
  `DOMContentLoaded` (required — see the search.js cache note in [`search.md`](search.md)).
  - **Accent** is also persisted: `localStorage('accent')` holds the colour string (oklch or
    `#hex`); the no-flash snippet sets `--ov-accent` + `data-accent` from it. The
    `:root[data-accent][data-accent][data-accent]` rule (in `0.1-color.css`) maps `--ov-accent`
    onto `--color-accent` *and* `--color-primary` (so links, nav pill, logo, primary buttons
    all recolour); hover is a `color-mix` toward `--color-fg`.
- **UI** — `<appearance-settings>` in the header: a trigger button opens a dropdown panel
  (`8.1-tools-theme-toggle.css`) with four groups — **Mode**, **Palette**, **Font** (button
  groups, `aria-pressed`) and **Accent** (swatches + custom `<input type=color>`). JS off →
  no panel, defaults render.

## Default = monotone grayscale (locked decision)
The base `:root` palette is **pure zero-chroma gray** (`oklch(L 0 0)`) and the default accent
is gray (`--color-accent: var(--color-gray-900)`) — so the resting site, links included,
carries **no hue**. This is deliberate (see [`design.md`](design.md) → *Monotone by default*);
keep it monotone. Colour is opt-in only, via a tinted palette or the accent axis.

## Links & contrast
Because the default is monotone, **link affordance is the underline, not colour**
(`1.2-typography.css`): `a { text-decoration: underline; text-decoration-color: var(--text-color-lower); }`
quiet at rest, thickening to `--text-color` on hover/focus. Target body contrast **WCAG AA+**
(4.5:1, toward 7:1). Don't push muted grays below legible contrast — `--text-color-low` /
`-lower` are for hierarchy, not for hiding text.

## Palettes (source values in `0.1-color.css`)
- **default** — **monotone grayscale** (the base `:root`); the resting theme.
- **eink** — warm paper (replaces the old "sepia"); the *warmer vintage tone* for easier reading.
- **flexoki** — warm paper, blue accent (Flexoki).
- **nord** — cool blue-slate.
- **solarized** — Solarized base tones.
Each defines `--color-gray-*` + `--color-surface` + accent; dark accents tuned per palette.

## Verified (live, 1440px)
- [x] Default = light, neutral, sans — bg `gray-100`, fg `gray-900`.
- [x] Nord + Dark + Geist → Nord-dark slate bg, light fg, Geist body font; panel shows all three pressed.
- [x] Persisted across reload via no-flash (no flash; `data-theme/palette/font` reapplied before paint).
- [x] Builds clean; inlined CSS ~29 KB (under the 42 KB budget).

## Iterate-later
- **Text-size axis** — Ovellum's `data-text-size` scales `--ov-text-scale`; not wired because the site uses its own Utopia `--step-*` scale. Would need a base-size multiplier.
- Migrate components off the legacy bridge onto `--color-*` directly (cleanup, optional).

---

# 3. Branding

Light for now — the place for brand/identity specifics to grow.

- **Wordmark / logo.** The header renders the inline SVG at `_includes/brajeshwar-logo.svg`
  (included in `header.html`, wrapped in `<site-logo>`, linking home). Raster and alternate
  forms live at the repo root (`brajeshwar-logo.svg`, `brajeshwar-logotype.svg`,
  `brajeshwar-logo*.png`, `-circle`, `-bg`, `-nobg`, `-light`). The inline SVG picks up
  `currentColor`, so the mark follows the active theme and accent.
- **Accent = brand hook.** The accent axis (§2) is where brand colour is expressed. `Default`
  is the restrained neutral identity; the swatches + custom picker let a reader (or a future
  brand refresh) recolour links, nav pill, and the logo in one move via `--ov-accent`.
- **Voice in type, not ornament.** Identity comes from typographic spacing and restraint
  (see [`design.md`](design.md)), not logos or chrome — the mark is small, the nav quiet.

---

# 4. Icons

**Recommendation: [Lucide](https://lucide.dev)** — adopt it, don't hand-draw icons.

- **Why Lucide.** MIT-licensed (free, no attribution required), ~1,600 icons, actively
  maintained. It's the community continuation of **Feather** — and the site's existing header
  **search icon is already a Feather/Lucide-style stroke SVG** (24×24, `fill="none"`,
  `stroke="currentColor"`, `stroke-width="2"`, round caps/joins), so adopting Lucide
  *standardises what's already here* rather than introducing a new look. The thin, monochrome
  stroke style fits the monotone, text-first design exactly.
- **Inline as plain text — no HTTP request.** Paste the raw `<svg>` markup directly into the
  template (as with `brajeshwar-logo.svg`). Because it uses `stroke="currentColor"`, each icon
  **inherits the surrounding text colour** — so it follows theme, palette, and accent for
  free, and costs **zero extra requests** and a few hundred bytes each. No icon font, no
  sprite sheet, no `<img>`.
- **Suggested pattern (Jekyll).** Keep one file per icon in `_includes/icons/` (e.g.
  `_includes/icons/search.svg`) and pull it in with `{% include icons/search.svg %}`, mirroring
  how the logo is included. Add `aria-hidden="true"` for decorative icons, or a
  `<title>`/`aria-label` when the icon is the only label. Keep `width`/`height` at `1em` (or a
  step token) so icons scale with text.
- **Do not** switch to an icon webfont or a remote sprite — both add a request and break the
  "inline, currentColor, zero-fetch" rule above (see [`design.md`](design.md) → *Performance budget*).

Alternatives considered (all MIT, all fine if a specific glyph is missing from Lucide):
**Tabler Icons** (~4,000+, same stroke style, slightly heavier line), **Heroicons** (Tailwind's
set, outline + solid), **Phosphor** (multiple weights). Lucide is the default; borrow a single
glyph from another set only when Lucide lacks it, keeping the stroke weight consistent.
