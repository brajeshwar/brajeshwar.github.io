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
| `--font-serif` | `ui-serif, Georgia, Cambria, Times, serif` | system serif (fallback for the Serif choice) |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | `code`, `pre` |
| `--font-body` | `var(--font-sans)` by default | **the body font** — what `[data-font]` swaps |

Legacy aliases kept: `--font-family-sans-serif → --font-sans`, `…-serif → --font-serif`,
`…-monospace → --font-mono`.

**Self-hosted fonts** (`0.0-fonts.css`, bundled `@font-face`, all `font-display: swap` so they
**download only when chosen** — no default-load cost):
- **"Libre Baskerville"** (`assets/fonts/libre-baskerville/*.woff2`, latin subset,
  regular/italic/bold, `size-adjust: 98.5%`) — **the reader "Serif" font** (`[data-font="serif"]`),
  with the system serif stack as its fallback while loading / on failure.
- **"Geist var"** (`geist/Geist-Variable.ttf`, `font-weight: 100 900`) — **the reader
  "Sans-Serif" font**. (Inter was removed.)

### The `[data-font]` axis — three panel choices
The panel labels map to values: **Default** = `sans` (system stack, **no webfont**, fast),
**Sans-Serif** = `geist`, **Serif** = `serif` (Libre Baskerville).
```css
/* 0.0-config.css */
:root { --font-body: var(--font-sans); }   /* Default — no attribute, system sans */
[data-font="sans"]  { --font-body: var(--font-sans); }
[data-font="geist"] { --font-body: "Geist var", var(--font-sans); }        /* "Sans-Serif" */
[data-font="serif"] { --font-body: "Libre Baskerville", var(--font-serif); } /* "Serif" */
```

### Text size (Kindle-style) — `[data-text-size]`
Five "A" buttons in the appearance panel, growing left → right, default in the middle. Sets
`--text-scale`, which **multiplies the whole type scale for content inside `<main>`** (home
body, pages, articles) — header/footer keep the base scale. Mechanism (`0.0-config.css`): the
raw clamps are `--step-N-base`; `:root` aliases `--step-N: var(--step-N-base)` (used by
header/footer), and `main` redefines `--step-N: calc(var(--step-N-base) * var(--text-scale))`.
So every element that uses `--step-*` in content scales automatically — no per-element rules.
Values are **symmetric around the middle**: `xs` 0.85 · `s` 0.925 · **m 1 (default, middle, no attribute)** · `l` 1.075 · `xl` 1.15 (±0.075 / ±0.15). Persisted
as `localStorage('textsize')`; applied before paint by the no-flash snippet.

**Interface vs content (Brajeshwar's model).** The reader's font choice applies to **all
content**; only the **header and footer** (the UI chrome) are pinned to system sans:
- `body { font-family: var(--font-body); }` (`1.1-base.css`) — the reader's choice flows to
  home body, pages, and articles.
- `header, footer { font-family: var(--font-sans); }` (`1.1-base.css`) — the chrome stays sans
  regardless of the choice (search + appearance panels live inside the header, so they follow).
- **Sidenotes** (`.sidenote`/`.sidenote-inline`) and **post meta** (`.post time`) re-assert sans
  on top of content, so they stay sans even in a serif article. Blockquotes **inherit** context.
- Set on `<html>` by `appearance.js`, persisted in `localStorage('font')`, applied before first
  paint by the no-flash snippet (`sans` = no attribute = default).

> History: `cd3227e0` made posts sans; a Phase-1 draft flipped to serif; then a Reader-style
> Sans/Serif/Mono selector; then the Ovellum font axis (Sans/Serif/Inter/Geist) applied
> site-wide; **now** scoped to article content so the interface is always sans (this section).

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
--measure          : 66rch;             /* ~60–70 chars/line target, resolved at the root font */
--body-width-ideal : var(--measure);    /* .container-ideal reading column = the measure */
```
- `.container-ideal { max-width: var(--body-width-ideal); }` (`1.1-base.css`) → the reading
  column (~665px). **`rch`, not `ch`**: plain `ch` resolves against each *element's own*
  font-size, so the one token produced different widths at different usage sites (on an
  element carrying `--step-0` ≈ 20px, `66ch` inflates to ~822px; on `figcaption` at
  `--step--1` it shrinks). `rch` resolves against the root (16px system sans), pinning every
  use to the same ~665px column. Trade-offs: the column no longer subtly re-widens when the
  reader picks Serif/Geist (stable is better), and `rch` needs ~2023+ browsers
  (Safari 16.4 / Chrome 111 / Firefox 128).
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
| **Palette** | `data-palette` | `default` · `nord` (Cool) · `eink` (Warm) | the colour scheme / hue |

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

The text tiers were **darkened one step for higher overall contrast** (Brajeshwar): in light,
`--color-fg` gray-900 → **gray-950**, `--color-fg-muted` gray-700 → **gray-800**,
`--color-fg-subtle` gray-500 → **gray-600**; in dark (both `[data-theme=dark]` and the
`auto` media query), the same tiers move brighter (`--color-fg` gray-100 → **gray-50**,
`-muted` gray-300 → **gray-200**, `-subtle` gray-500 → **gray-400**). Backgrounds unchanged.
Because these are semantic tokens over the re-tinted scale, **every palette inherits the bump**.

## Palettes (source values in `0.1-color.css`)
Three panel choices (Brajeshwar trimmed from five; Flexoki + Solarized removed):
- **Default** (`default`) — **monotone grayscale** (the base `:root`); the resting theme.
- **Cool** (`nord`) — cool blue-slate (Nord).
- **Warm** (`eink`) — warm paper / sepia (the Kindle-style warm read).
Each tinted palette redefines `--color-gray-*` + `--color-surface` + accent; nord tunes its dark
accent. All inherit the contrast bump above via the semantic layer.

## Verified (live, 1440px)
- [x] Default = light, neutral, sans — bg `gray-100`, fg `gray-900`.
- [x] Nord + Dark + Geist → Nord-dark slate bg, light fg, Geist body font; panel shows all three pressed.
- [x] Persisted across reload via no-flash (no flash; `data-theme/palette/font` reapplied before paint).
- [x] Builds clean; inlined CSS ~29 KB (under the 42 KB budget).

## Iterate-later
- Migrate components off the legacy bridge onto `--color-*` directly (cleanup, optional).

> **Accent** = five swatches (**Default + Blue/Green/Amber/Red**), rendered **inline with the
> "Accent" label** (`.appearance-group--inline`); no custom colour picker. Set via `applyAccent`
> → inline `--ov-accent` + `data-accent="custom"`, persisted as `localStorage('accent')`.
> **Panel controls are segmented pills** (`.appearance-options` = one rounded pill, options are
> flat divided cells; single line, compact) — see `8.1-tools-theme-toggle.css`.

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
- **Pattern in use (Jekyll).** One file per icon in **`_includes/icons/`** (e.g.
  `_includes/icons/rss.svg`). Pull in a fixed one with `{% include icons/rss.svg %}`, or a
  data-driven one with a variable: `{% assign f = "icons/" | append: item.icon | append: ".svg" %}{% include {{ f }} %}`
  (the footer does this over `_data/nav.yaml` `social`). Add `aria-hidden="true"` for decorative
  icons, or `title`/`aria-label` on the link when the icon is the only label.
- **Do not** switch to an icon webfont or a remote sprite — both add a request and break the
  "inline, currentColor, zero-fetch" rule above (see [`design.md`](design.md) → *Performance budget*).

### Brand / social icons — Simple Icons
Lucide has **no brand icons** (they were removed). For social/brand glyphs use
**[Simple Icons](https://simpleicons.org)** (CC0 — public domain). Fetch the path, set
`fill="currentColor"`, 24×24 viewBox, and save into `_includes/icons/`. The **footer social row**
uses Simple Icons for **rss, twitter (the "x" glyph), github, mastodon, instagram**; **oinam**
and **memos** have no brand icon, so they're small hand-authored filled glyphs (an "O" ring and a
notes bubble) kept in the same filled style for a consistent row.

### One filled family (header + footer)
All chrome icons are **filled, `currentColor`, 20px**, and live in `_includes/icons/`, so the
header and footer read as one set:
- **Brand/social** (footer): Simple Icons — `rss`, `twitter` (the "x" glyph), `github`,
  `mastodon`, `instagram`.
- **Hand-authored filled** (no brand equivalent): `oinam` (an "O" ring), `memos` (a notes
  bubble), `search` (a filled magnifier — the earlier stroke one read too thin), `theme` (a
  filled contrast circle — replaced a busy circle-with-dots).
- **Shared**: the header and footer RSS are the **same file** (`icons/rss.svg`).

The header search/theme were previously thin stroke (Lucide-style) outlines; they're now filled
to match the footer at Brajeshwar's request. If a *new* UI glyph is ever needed and no brand
version exists, prefer a filled treatment consistent with this set (Lucide/Tabler/Heroicons/
Phosphor are fine sources to trace a filled shape from — all MIT).
