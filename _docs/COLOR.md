# COLOR & THEMING — brajeshwar.com

Ported from **Ovellum** (ovellum.oss.oinam.com). Partner doc: [`TYPOGRAPHY.md`](TYPOGRAPHY.md).
All of this lives in `_includes/css/0.1-color.css`.

> **Golden rule:** no hardcoded colors outside `0.1-color.css`. Components reference
> tokens only. Known exceptions: `2.1-code.css` (pygments) and Pagefind UI vars.

## Two orthogonal axes (the whole point)
Theming is split into **two independent axes**, both set on `<html>`:

| Axis | Attribute | Values | What it controls |
|---|---|---|---|
| **Mode** | `data-theme` | `auto` (default) · `light` · `dark` | light ↔ dark (appearance) |
| **Palette** | `data-palette` | `default` · `eink` · `flexoki` · `nord` · `solarized` | the colour scheme / hue |

They compose freely: **every palette has a light and a dark form**. "Nord + Dark",
"Solarized + Light", "E-ink + Auto" all work. `auto` follows `prefers-color-scheme`;
`light`/`dark` are explicit and win over the system.

Plus two more axes: `data-font` (see [`TYPOGRAPHY.md`](TYPOGRAPHY.md)) and **accent**
(`data-accent="custom"` + an inline `--ov-accent`), which recolours links / nav / primary
surfaces — 6 swatches (Blue/Purple/Green/Amber/Red/Cyan) + Default + a custom colour picker.

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
  `DOMContentLoaded` (required — see the search.js cache note in [`SEARCH.md`](SEARCH.md)).
  - **Accent** is also persisted: `localStorage('accent')` holds the colour string (oklch or
    `#hex`); the no-flash snippet sets `--ov-accent` + `data-accent` from it. The
    `:root[data-accent][data-accent][data-accent]` rule (in `0.1-color.css`) maps `--ov-accent`
    onto `--color-accent` *and* `--color-primary` (so links, nav pill, logo, primary buttons
    all recolour); hover is a `color-mix` toward `--color-fg`.
- **UI** — `<appearance-settings>` in the header: a trigger button opens a dropdown panel
  (`8.1-tools-theme-toggle.css`) with four groups — **Mode**, **Palette**, **Font** (button
  groups, `aria-pressed`) and **Accent** (swatches + custom `<input type=color>`). JS off →
  no panel, defaults render.

## Palettes (source values in `0.1-color.css`)
- **default** — neutral gray (the base `:root`).
- **eink** — warm paper (replaces the old "sepia").
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
