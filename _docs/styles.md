# Styles — brajeshwar.com

The specifics of the visual system: typography, color & theming, branding, icons, and
how the CSS itself is split. For the *why* behind these choices — the reading-first
philosophy they serve — see [`design.md`](design.md).

> **Golden rule (type):** never hand-pick a font-size, margin, or line-height. Everything
> comes from the scales below (`--step-*`, `--space-*`, `--scale`). Reuse a token, don't
> invent a number.
>
> **Golden rule (color):** no hardcoded colors outside `_sass/themes.scss`.
> Components reference tokens only. One known exception remains: the Pagefind UI vars in
> `search.css`. (syntax highlighting was the other — tokenised 2026-07-19 onto
> `--code-*`; see §5 → *Syntax highlighting*.)

---

# 1. Typography

How type works on the site. Lives in `_sass/config.scss` (scales, families),
`themes.css` (variable fonts), and `base.css` (headings, rhythm).

## Families & the font axis (Ovellum parity)
The reader picks the body font via the appearance panel → `[data-font]` swaps the
`--font-body` token (one of the theming axes; see §2).

| Token | Stack | |
|---|---|---|
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, …` | system sans (default) |
| `--font-serif` | `ui-serif, Georgia, Cambria, Times, serif` | system serif (fallback for the Serif choice) |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | `code`, `pre` |
| `--font-body` | `var(--font-sans)` by default | **the body font** — what `[data-font]` swaps |

Legacy aliases kept: `--font-family-sans-serif → --font-sans`, `…-serif → --font-serif`,
`…-monospace → --font-mono`.

Self-hosted fonts (`themes.css`, bundled `@font-face`, all `font-display: swap` so they
download only when chosen — no default-load cost):
- "Source Serif 4" (`assets/fonts/source-serif/SourceSerif4Variable-{Roman,Italic}.woff2`,
  64 + 65 KB) — the reader "Serif" font (`[data-font="serif"]`) since 2026-08-02, with the
  system serif stack as its fallback while loading / on failure. Variable: Roman carries
  weights 200–700, Italic likewise. Cut from Adobe's 1.2 MB/850 KB upstream VF TTFs by
  pinning `opsz` at its default 20, clamping `wght` to 200:700 and subsetting to the Geist
  unicode set — the full recipe and the verification checklist are in the `themes.css`
  comment. The upstream TTFs stay in the repo (full axes, for re-subsetting) and are
  `exclude`d from the build, as is the OFL `LICENSE.md` beside them — that one because
  jekyll-optional-front-matter would otherwise render a bare `.md` into a published page.
- "Libre Baskerville" (`assets/fonts/libre-baskerville/*.woff2`, latin subset,
  regular/italic/bold, `size-adjust: 98.5%`) — **dormant since 2026-08-02**; it was the
  Serif font from the start until Source Serif 4 replaced it (*"switch the Serif option to
  Source Serif 4 but keep Baskerville. I want to see how things are"*). Nothing references
  the family, so its faces never download; the files and `@font-face` blocks stay so the
  revert is one line in `config.css`.
- "Geist" (`assets/fonts/geist/Geist-Variable.woff2`, latin subset, 47 KB) — the reader
  "Sans-Serif" font (`[data-font="geist"]`), variable, so one file covers every weight,
  falling back to the system sans stack. Subset from a 169 KB `.ttf` on 2026-07-27, a 72% cut;
  the `.ttf` stays in the repo as the re-subset source and is `exclude`d from the build. The
  regeneration command is in the `themes.css` comment. ⚠️ Any re-subset must keep the variable
  tables — a naive subset flattens the axis and every weight silently becomes 400.

Two active webfonts, both optional, plus the dormant Baskerville. Inter was removed earlier.
⚠️ One custom family per option, system stack behind it — two custom fonts in one stack means
the interim render during `swap` triggers the second family's download too.

### The `[data-font]` axis — three panel choices
The panel labels map to values: System = `sans` (system stack, no webfont, fast),
Sans-Serif = `geist`, Serif = `serif` (Source Serif 4; the stored value predates the
2026-08-02 font swap and did not change, so no reader's saved choice needed migrating).

*"System" was called "Default" until 2026-07-27* (Brajeshwar: *"For the FONT, replace Default
with System"*). It names what the option actually is — the OS UI face — where "Default" said
only that it was the one you get without choosing, which is true of the first option on every
axis and describes none of them. Label only: the stored value is still `sans`, so nothing
in `config.css`, the `@font-face` blocks, or the no-flash whitelist changed and no reader's
saved choice needed migrating.
```css
/* config.css */
:root { --font-body: var(--font-sans); }   /* System — no attribute, system sans */
[data-font="sans"]  { --font-body: var(--font-sans); }
[data-font="geist"] { --font-body: "Geist", var(--font-sans); }              /* "Sans-Serif" */
[data-font="serif"] { --font-body: "Source Serif 4", var(--font-serif); }    /* "Serif" */
```

Geist: dropped 2026-07-19, restored 2026-07-27. It was removed as a near-duplicate of the
system stack shipping as a 169 KB unsubsetted `.ttf` — the heaviest asset on the site,
against 84 KB of woff2 for all three Libre Baskerville styles. Brajeshwar re-added the file and
asked for the option back, so the reasoning is recorded rather than deleted. *(Corrected
2026-08-02: this paragraph still called the subsetting "an open task" — it was done the same
day it was restored, 2026-07-27, 169 → 47 KB, as the bullet above says. The size objection is
closed; the two claims had been contradicting each other in one section.)* It costs nothing
unless a reader picks it.

⚠️ **FOUR places must agree for any font option**, and missing the last one is the quiet failure:
1. `AXES.font.opts` — `assets/scripts/appearance.js`
2. the `[data-font="…"]` rule — `config.css`
3. the `@font-face` — `themes.css`
4. the no-flash whitelist — `_layouts/default.html`. Without it the choice is not applied
   before first paint, so the page flashes the default font on every load.

Stale preferences need no migration either way. `read()` in `appearance.js` validates against
its own option list and falls back to `sans`, so a value no longer offered is simply ignored —
which is why removing and restoring Geist required no migration step in either direction.

### Text size (Kindle-style) — `[data-text-size]`
Five "A" buttons in the appearance panel, growing left → right, default in the middle. Sets
`--text-scale`, which multiplies the whole type scale for content inside `<main>` (home
body, pages, articles) — header/footer keep the base scale. Mechanism (`config.css`): the
raw clamps are `--step-N-base`; `:root` aliases `--step-N: var(--step-N-base)` (used by
header/footer), and `main` redefines `--step-N: calc(var(--step-N-base) * var(--text-scale))`.
So every element that uses `--step-*` in content scales automatically — no per-element rules.
Values are symmetric around the middle: `xs` 0.85 · `s` 0.925 · m 1 (default, middle,
no attribute) · `l` 1.075 · `xl` 1.15 (±0.075 / ±0.15). Persisted as
`localStorage('textsize')`; applied before paint by the no-flash snippet.

Interface vs content (Brajeshwar's model). The reader's font choice applies to prose.
Interface is pinned to system sans — and the distinction is what the text IS, not where it
sits: prose is the reader's to set, controls and labels are the site's. Brajeshwar, 2026-07-27:
*"UI Elements such as the PREV | NEXT should always be in the sans-serif system fonts. Making it
serif is weird."*

- `body { font-family: var(--font-body); }` (`base.css`) — the reader's choice flows to home
  body, pages, and articles.
- One rule in `base.css` pins the interface. `header` and `footer` are chrome by position;
  everything else sits inside `main`, inherits `--font-body`, and must opt out by name:

      header, footer, .post-nav, .pill, .back-to-top-row { font-family: var(--font-sans); }

- Sidenotes (`.sidenote`/`.sidenote-inline`), captions (`figcaption`), and post meta
  (`.post time`) re-assert sans on top of content — they are labels *about* content, not content.
  Blockquotes inherit context.
- Set on `<html>` by `appearance.js`, persisted in `localStorage('font')`, applied before first
  paint by the no-flash snippet (`sans` = no attribute = default).

⚠️ **Add new controls inside `main` to that list.** The failure is silent: it only shows for
readers who picked Serif or Sans-Serif, and the default is System, so casual checking never
surfaces it. `.back-to-top-row` had a `font-family` until it became icon-only and lost it
without anyone noticing — which is why the list exists rather than a rule per component.

> History: `cd3227e0` made posts sans; a Phase-1 draft flipped to serif; then a Reader-style
> Sans/Serif/Mono selector; then the Ovellum font axis (Sans/Serif/Inter/Geist) applied
> site-wide; now scoped to article content so the interface is always sans (this section).

## Type scale (fluid, Utopia)
`config.css`, generated at <https://utopia.fyi> (320px @18px/1.2 → 1240px @20px/1.25).
Use these for every font-size:

`--step--2` · `--step--1` · `--step-0` (body) · `--step-1` · `--step-2` · `--step-3` · `--step-4` · `--step-5`

Headings (`base.css`): h1 `--step-3` · h2 `--step-2` · h3 `--step-1` · h4 `--step-0` · h5 `--step--1` · h6 `--step--2`, all `font-weight: var(--font-weight-light)`, `line-height: var(--scale-small)`, `text-wrap: pretty`.

## Spacing scale (fluid, Utopia)
`config.css`. Use for every margin/padding:

`--space-3xs` … `--space-3xl`, plus one-up pairs (`--space-s-m`, `--space-m-l`, …) for fluid gaps.

## Vertical rhythm & line-height
Body `line-height: var(--scale)` = `--golden` (1.618) — generous, suits serif reading.
Headings take `line-height: var(--scale-small)` = `--minor-third` (1.2) — tight.
Modular-scale ratios live in `config.css` (`--golden`, `--minor-third`, `--minor-seventh`, …);
the active ones are aliased to `--scale`, `--scale-small`, `--scale-large`.

## Reading measure (character-based)
The reading column is sized by character count, not pixels — comfort is a function of
characters per line (see [`design.md`](design.md) → *Comfortable measure*).

```css
/* config.css */
--measure          : 66rch;             /* ~60–70 chars/line target, resolved at the root font */
--body-width-ideal : var(--measure);    /* .container-ideal reading column = the measure */
```
- `.container-ideal { max-width: var(--body-width-ideal); }` (`base.css`) → the reading
  column (~665px). `rch`, not `ch`: plain `ch` resolves against each *element's own*
  font-size, so the one token produced different widths at different usage sites (on an
  element carrying `--step-0` ≈ 20px, `66ch` inflates to ~822px; on `figcaption` at
  `--step--1` it shrinks). `rch` resolves against the root (16px system sans), pinning every
  use to the same ~665px column. Trade-offs: the column no longer subtly re-widens when the
  reader picks Serif/Geist (stable is better), and `rch` needs ~2023+ browsers
  (Safari 16.4 / Chrome 111 / Firefox 128).
- Media in the column (`figure`, `img`, video embeds) fits the measure. Video embeds use
  `aspect-ratio: 16/9` (`base.css`), not a width-derived pixel height — required now
  that the column width is font-relative.
- **Blockquotes break the measure** (2026-07-28, after Yale e360 — see
  [`inspirations.md`](inspirations.md)). `.post:not(.has-sidenotes) blockquote` widens to the
  band, `min(96vw, --body-width-max)`: left edge stays on the band edge, right edge grows
  665px → 1024px. The accent rides `var(--color-accent)` on the left rule, so it is coral for
  a reader who opted into an accent and gray for everyone else.
  ⚠️ Gated on `:not(.has-sidenotes)` because it grows into the sidenote gutter — sidenotes are
  `position: absolute; left: 100%`, so a widened quote lands *under* them rather than pushing
  them. Measured in-browser: 13 posts / 16 pairs would overlap ungated; 0 with the gate.
  Degrades right in both directions — JS off means no `.has-sidenotes`, so the quote breaks out
  and the footnotes stay at the article foot; on narrow screens `gutterFits()` fails, but there
  the band *is* the column so the expression evaluates to no change at all.
- `--measure` is the knob: raise toward `70ch` for a looser line, lower toward `62ch` for
  tighter. The sidenote gutter (see [`sidenotes.md`](sidenotes.md)) lives in the space to the
  right of this column.
- Measured 2026-07-26 (Chrome, built site): `1rch` = 10.08px, so the column is 665px.
  Don't assume the common ~8px-per-character rule of thumb when doing width arithmetic here —
  it under-estimates this column by about 130px. The 665px figure above is confirmed, not
  approximate. This measurement is what sets the sidenote viewport floor of 1210px
  ([`sidenotes.md`](sidenotes.md)).

## Weights
`--font-weight-lighter` 100 · `--font-weight-light` 200 · `--font-weight` 400 · `--font-weight-bold` 600 · `--font-weight-bolder` 700.

---

# 2. Color & theming

Ported from Ovellum (ovellum.oss.oinam.com). All of this lives in `themes.css`.

## Two orthogonal axes (the whole point)
Theming is split into two independent axes, both set on `<html>`:

| Axis | Attribute | Values | What it controls |
|---|---|---|---|
| **Mode** | `data-theme` | `auto` (default) · `light` · `dark` | light ↔ dark (appearance) |
| **Palette** | `data-palette` | `default` · `nord` (Cool) · `eink` (Warm = Flexoki) | the color scheme / hue |

They compose freely: every palette has a light and a dark form. "Nord + Dark",
"Solarized + Light", "E-ink + Auto" all work. `auto` follows `prefers-color-scheme`;
`light`/`dark` are explicit and win over the system.

Plus two more axes: `data-font` (see §1) and accent (`data-accent="custom"` + an inline
`--ov-accent`), which recolours links / nav / primary surfaces — 6 swatches
(Blue/Purple/Green/Amber/Red/Cyan) + Default + a custom color picker.

## How the two axes stay independent — token layers
1. Raw scale — `--color-gray-50 … --color-gray-950` (+ white/black). Palettes
   re-tint this scale (`[data-palette=nord]` etc. redefine the grays with a hue).
2. Semantic tokens — `--color-bg`, `--color-surface`, `--color-fg`, `--color-fg-muted`,
   `--color-accent`, `--color-border` (a `color-mix`), `--color-code-bg`, `--color-primary`
   (inverted surface), … These map onto the scale, and mode flips them:
   `[data-theme=dark]` (and `[data-theme=auto]` inside `@media (prefers-color-scheme: dark)`)
   remaps `--color-bg` to `gray-900`, `--color-fg` to `gray-100`, etc.
   - Because the dark remap references the *scale*, and the palette already re-tinted the
     scale, each palette gets its dark form for free. Per-palette dark accent tuning
     is the only thing defined explicitly per palette.
3. Bridge — the site's legacy tokens (`--bg-color-*`, `--text-color-*`, `--border-color-*`,
   `--text-color-link`) and the short-form semantic tokens (`--bg`, `--text`, `--rule`, `--accent`,
   `--mark`, `--code-bg`, …) are aliased onto the semantic layer in one `:root` block at
   the end of the file. So every existing component inherits palette + mode without edits.

New components should use the `--color-*` semantic tokens directly.

## Persistence & no-flash
- No-flash snippet (the one inline `<head>` script, in `default.html`) applies all axes
  before first paint:
  ```js
  (function(){try{var d=document.documentElement,g=localStorage,t=g.getItem('theme'),p=g.getItem('palette'),f=g.getItem('font');d.dataset.theme=(t==='light'||t==='dark')?t:'auto';if(p&&p!=='default')d.dataset.palette=p;if(f&&f!=='sans')d.dataset.font=f;}catch(e){}})();
  ```
  `data-theme` is always set (the auto media query targets `[data-theme=auto]`);
  palette/font drop the attribute on their default.
- `assets/scripts/appearance.js` (`defer`) builds the appearance panel and persists
  each axis to `localStorage` (`theme` / `palette` / `font`). It also updates
  `<meta name="theme-color">` from the computed `body` background. Ready-guard on
  `DOMContentLoaded` (required — see the search.js cache note in [`search.md`](search.md)).
  - Accent is also persisted: `localStorage('accent')` holds the color string (oklch or
    `#hex`); the no-flash snippet sets `--ov-accent` + `data-accent` from it. The
    `:root[data-accent][data-accent][data-accent]` rule (in `themes.css`) maps `--ov-accent`
    onto `--color-accent` *and* `--color-primary` (so links, nav pill, logo, primary buttons
    all recolour); hover is a `color-mix` toward `--color-fg`.
- UI — `<appearance-settings>` in the header: a trigger button opens a dropdown panel
  (`chrome.css`) with four groups — Mode, Palette, Font (button groups, `aria-pressed`)
  and Accent (swatches + custom `<input type=color>`). JS off → no panel, defaults render.

## Default = monotone grayscale (locked decision)
The base `:root` palette is pure zero-chroma gray (`oklch(L 0 0)`) and the default accent
is gray (`--color-accent: var(--color-gray-900)`) — so the resting site, links included,
carries no hue. This is deliberate (see [`design.md`](design.md) → *Monotone by default*);
keep it monotone. Color is opt-in only, via a tinted palette or the accent axis.

### The two structural rules (2026-08-01)

The header's `border-bottom` and the footer's `border-top` are the only borders on
`--rule-strong` (an 18% mix of the foreground) rather than `--rule` (10%). Brajeshwar:
*"Increase the border color one notch for the header and footer, so they are more prominent
than the other borders."*

**Strengthened again 2026-08-01** — *"make it even darker. They should be clear separators."*
`--rule-strong` now points at a new `--color-border-structural` (32% of the foreground) rather
than `--color-border-strong` (18%). Measured on the dark/eink default, compositing each border
over the page background:

| | painted rgb | contrast vs page |
|---|---|--:|
| header + footer rule | `78,75,76` | **2.22** |
| hover wash (`--bg-color-hover`) | `71,67,68` | 1.96 |
| every other border | `36,33,34` | 1.20 |

**85% more contrast than an ordinary border**, and header and footer paint identically — they
are a pair that brackets the page. Note the deliberate hierarchy: a separator out-reads a
hover state, which out-reads an ordinary border.

⚠️ **Only those two may use `--rule-strong`.** The point is that they outrank every other
border by exactly one tier; a third user starts eroding that. Note `chrome.scss` still uses
plain `--rule` for the search-result separator and the tool-icon divider, which is correct.

⚠️ **Measuring an `oklch()` color with alpha needs a canvas.** `getComputedStyle().color` now
returns `oklch(…)` rather than `rgb(…)` in Chrome, so the usual trick of parsing the computed
string yields nonsense — it did here, reporting all three borders as identical at 1.10 and the
change as having done nothing. Paint the background then the border onto a canvas and read the
pixel; that composites the alpha for you and is the only reading that reflects what is on
screen.

## Links & contrast
Because the default is monotone, link affordance is the underline, not color
(`base.css`): `a { text-decoration: underline; text-decoration-color: var(--text-color-lower); }`
quiet at rest, thickening to `--text-color` on hover/focus. Target body contrast WCAG AA+
(4.5:1, toward 7:1). Don't push muted grays below legible contrast — `--text-color-low` /
`-lower` are for hierarchy, not for hiding text.

The text tiers were darkened one step for higher overall contrast (Brajeshwar): in light,
`--color-fg` gray-900 → gray-950, `--color-fg-muted` gray-700 → gray-800,
`--color-fg-subtle` gray-500 → gray-600; in dark (both `[data-theme=dark]` and the
`auto` media query), the same tiers move brighter (`--color-fg` gray-100 → gray-50,
`-muted` gray-300 → gray-200, `-subtle` gray-500 → gray-400). Backgrounds unchanged.
Because these are semantic tokens over the re-tinted scale, every palette inherits the bump.

### Text contrast raised one step, 2026-08-01

*"Increase contrast of the text throughout. Let's make them darker (more accented)."*

Every `--color-fg*` tier moved one step toward the extreme, in all four blocks that define
them (shared light, eink light, generic dark, eink dark). Measured across all six
palette × mode combinations, contrast against the page:

| palette · mode | title / body | intro · caption | date |
|---|--:|--:|--:|
| eink · dark *(his default)* | 11.98 → **15.00** | 7.05 → **9.31** | 5.19 → **7.05** |
| eink · light | → 18.62 | → 14.51 | → 7.14 |
| default · dark | → 17.18 | → 16.44 | → 12.09 |
| default · light | → 18.16 | → 16.44 | → 9.51 |
| nord · dark | → 11.54 | → 10.84 | → 9.25 |
| nord · light | → 11.95 | → 10.84 | → 6.40 |

**Every combination is now AAA (≥7.0)** except nord-light's 13px date at 6.40, which still
clears AA comfortably.

⚠️ **`--color-fg` could not move in two of the four blocks** — it is already at the end of
the ramp (`gray-950` in light, `gray-50` in generic dark). The primary text was measured at
11.98:1 *before* this change, well past AAA, so the real gain is in the two tiers under it:
muted (intros, captions, alumni rows) and subtle (dates, year markers). Only eink dark had
headroom on the primary tier, and it used it: base-200 → base-100.

⚠️ **The eink change departs from kepano's Flexoki docs mapping** (text-1 → base-200,
text-2 → base-500), which the rest of that block still follows. Deliberate override for
legibility, not a mistake to revert.

**The other half of "more accented" is weight, not colour.** The h1, the intro paragraph and
every section heading are `--font-weight-light` (**200**) — very thin at 39px. That reads as
washed out no matter what the contrast ratio says. Raising `--font-weight-light` to 300 is a
one-token change if the type still feels light after this.

## Palettes (source values in `themes.css`)
Three panel choices (Brajeshwar trimmed from five; Flexoki + Solarized removed):
- Default (`default`) — monotone grayscale (the base `:root`); the resting theme.
- Cool (`nord`) — cool blue-slate (Nord).
- Warm (`eink`) — [Flexoki](https://github.com/kepano/flexoki) since 2026-07-27, at
  Brajeshwar's request. Ink on paper: `#FFFCF0` light, `#100F0F` dark. It replaced a
  hand-rolled sepia ramp. The attribute value stays `eink` deliberately — changing it would
  invalidate every reader's saved `localStorage('palette')` for no visible gain.

Each tinted palette redefines `--color-gray-*` + `--color-surface` + accent; nord tunes its dark
accent. All inherit the contrast bump above via the semantic layer.

Warm is the one palette written in hex, not `oklch` — those are upstream's published values
copied verbatim from `kepano/flexoki`, so they can be diffed against it; converting would round
every one and lose that. The site's scale has 11 steps to Flexoki's 15, so base-150/-800/-850/
-950 get no slot; each line in `themes.css` names the step it came from.

Warm needs its own dark mixin (`eink-dark-semantics`), because Flexoki's dark form is not
the generic dark remap applied to a warm ramp — it puts the page on `black` and the text on
base-200, where the shared mixin would have given base-900 with paper-white text. Mappings are
kepano's own (`vitepress/index.css`): bg→black, bg-elv→base-900, tx→base-200, tx-2→base-500.

One deliberate divergence, in both modes: Flexoki's `tx-3` is too faint for what this site
spends it on. base-300 measures 2.00:1 on paper — right for the hairlines it is meant for,
unreadable for sidenote body text. `--color-fg-subtle` is stepped one notch to base-600
(4.97:1 light) / base-500 (5.19:1 dark), the same bump the default palette already makes.

## Verified (live, 1440px)
- [x] Default = light, neutral, sans — bg `gray-100`, fg `gray-900`.
- [x] Nord + Dark + Geist → Nord-dark slate bg, light fg, Geist body font; panel shows all three pressed.
- [x] Persisted across reload via no-flash (no flash; `data-theme/palette/font` reapplied before paint).
- [x] Builds clean; inlined CSS ~29 KB raw (budget is now ≤ 13 KB gzipped per page — see [`memory.md`](memory.md)).

## Iterate-later
- Migrate components off the legacy bridge onto `--color-*` directly (cleanup, optional).

> Accent = five swatches (Default + Blue/Green/Amber/Red), on the "Accent" row of the
> panel grid like every other control; no custom color picker. Set via `applyAccent`
> → inline `--ov-accent` + `data-accent="custom"`, persisted as `localStorage('accent')`.
> Panel controls are segmented pills — see *Pill* in §6, which is now a shared component
> rather than something the panel owns.
>
> Panel layout is a two-column grid (2026-07-27): labels in column 1, controls in column 2,
> set on `.appearance-panel` itself with `.appearance-group { display: contents }`. Rows used to
> lay themselves out, which let every control start at a different x. There is no
> `.appearance-group--inline` any more.

---

# 3. Branding

Light for now — the place for brand/identity specifics to grow.

The wordmark is the header's inline SVG at `_includes/brajeshwar-logo.svg` (included in
`header.html`, wrapped in `<site-logo>`, linking home). Raster and alternate forms live at
the repo root (`brajeshwar-logo.svg`, `brajeshwar-logotype.svg`, `brajeshwar-logo*.png`,
`-circle`, `-bg`, `-nobg`, `-light`). The inline SVG picks up `currentColor`, so the mark
follows the active theme and accent.

The accent axis (§2) is the brand hook — where brand color is expressed. `Default` is the
restrained neutral identity; the swatches + custom picker let a reader (or a future brand
refresh) recolour links, nav pill, and the logo in one move via `--ov-accent`.

Voice lives in type, not ornament. Identity comes from typographic spacing and restraint
(see [`design.md`](design.md)), not logos or chrome — the mark is small, the nav quiet.

---

# 4. Icons

Recommendation: [Lucide](https://lucide.dev) — adopt it, don't hand-draw icons.

Why Lucide: MIT-licensed (free, no attribution required), ~1,600 icons, actively maintained.
It's the community continuation of Feather — and the site's existing header search icon is
already a Feather/Lucide-style stroke SVG (24×24, `fill="none"`, `stroke="currentColor"`,
`stroke-width="2"`, round caps/joins), so adopting Lucide *standardises what's already here*
rather than introducing a new look. The thin, monochrome stroke style fits the monotone,
text-first design exactly.

Icons are inlined as plain text — no HTTP request. Paste the raw `<svg>` markup directly into
the template (as with `brajeshwar-logo.svg`). Because it uses `stroke="currentColor"`, each
icon inherits the surrounding text color — so it follows theme, palette, and accent for
free, and costs zero extra requests and a few hundred bytes each. No icon font, no sprite
sheet, no `<img>`.

The pattern in use (Jekyll) is one file per icon in `_includes/icons/` (e.g.
`_includes/icons/rss.svg`). Pull in a fixed one with `{% include icons/rss.svg %}`, or a
data-driven one with a variable: `{% assign f = "icons/" | append: item.icon | append: ".svg" %}{% include {{ f }} %}`
(the footer does this over `_data/nav.yaml` `social`). Add `aria-hidden="true"` for decorative
icons, or `title`/`aria-label` on the link when the icon is the only label.

Do not switch to an icon webfont or a remote sprite — both add a request and break the
"inline, currentColor, zero-fetch" rule above (see [`design.md`](design.md) → *Performance budget*).

### Brand / social icons — Simple Icons
Lucide has no brand icons (they were removed). For social/brand glyphs use
[Simple Icons](https://simpleicons.org) (CC0 — public domain). Fetch the path, set
`fill="currentColor"`, 24×24 viewBox, and save into `_includes/icons/`. The footer social row
uses Simple Icons for rss, twitter (the "x" glyph), github, mastodon, instagram; oinam
and memos have no brand icon, so they're small hand-authored filled glyphs (an "O" ring and a
notes bubble) kept in the same filled style for a consistent row.

### One filled family (header + footer)
All chrome icons are filled, `currentColor`, 20px, and live in `_includes/icons/`, so the
header and footer read as one set:
- Brand/social (footer): Simple Icons — `rss`, `twitter` (the "x" glyph), `github`,
  `mastodon`, `instagram`.
- Hand-authored filled (no brand equivalent): `oinam` (an "O" ring), `memos` (a notes
  bubble), `search` (a filled magnifier — the earlier stroke one read too thin), `theme` (a
  filled contrast circle — replaced a busy circle-with-dots).
- Shared: the header and footer RSS are the same file (`icons/rss.svg`).

The header search/theme were previously thin stroke (Lucide-style) outlines; they're now filled
to match the footer at Brajeshwar's request. If a *new* UI glyph is ever needed and no brand
version exists, prefer a filled treatment consistent with this set (Lucide/Tabler/Heroicons/
Phosphor are fine sources to trace a filled shape from — all MIT).

---

# 5. CSS architecture — bundles, layouts, tiers

How CSS is split, which layout pulls which bundle, and the rules for adding more.
Theming — mode × palette × font × accent — is §2 above; the byte budget lives in
[`design.md`](design.md) → *Performance budget*.

Decided 2026-07-19. Supersedes the ad-hoc mix of `styles:` keys that had grown up to
that point. Folded into this doc on 2026-07-26, from what used to be `css-architecture.md`.

> 📍 Where the files live, as of 2026-07-27: `_sass/*.scss`. They were
> `_includes/css/*.css` until then — Liquid includes, because the CSS was inlined into the
> HTML. Nothing includes them into HTML any more, so they are ordinary Sass partials compiled
> by `assets/styles/site.scss`.
>
> This doc still says `config.css`, `base.css`, `themes.css` in many places — those are
> dated entries kept as written, and they mean `_sass/config.scss` and so on. Same content,
> same names, different extension and directory. (There is an older rename too: the numbered
> ITCSS partials, `0.0-config.css` and friends — see *Old → new filename map* below.)

## The principle

> ⚠️ **Superseded 2026-07-27. The CSS is now ONE EXTERNAL FILE.** The two paragraphs
> immediately below are the 2026-07-19 decision, kept as written. Read *The principle,
> restated* under them for what is true today.

~~Embed everything — no external stylesheet, no extra request. At 6–7 KB gzip the inlined
CSS rides along in the same round trip as the HTML, which beats a cacheable external file
for a site whose traffic is mostly first-time arrivals on a single post.~~

~~Split by **layout**, not by page. A page-specific bundle is the exception, not the pattern.
The failure mode we're avoiding is CSS scattered across twenty opt-in keys where nobody can
tell what ships where.~~

## The principle, restated (2026-07-27)

Ship one external stylesheet and let it cache. `assets/styles/site.scss` compiles
every partial in `_sass/` and is the only stylesheet on the site.

The embed-everything argument was not sloppy, it was built on an unchecked premise — that
the round trip recurs. Measuring instead of assuming:

    $ curl -sSI https://brajeshwar.com/assets/print.css
    cache-control: max-age=31536000
    content-encoding: gzip

A year, gzipped, on every `/assets/*` file. There is no `_headers` file; that is simply what
the host serves. So the fetch happens once and the file is then free on every page, for every
visit, for a year — while inlining re-sent ~6.6 KB gzip on *every* page view and could never
be cached at all, because the HTML is only `max-age=600`. Break-even is under two page
views.

And one file, not per-layout bundles. Splitting existed to keep the *inline* payload
small — each page carried only what it used, because it carried it every single time. Once
the bytes are cached that logic inverts: one URL shared by all ~1,483 pages is one cache
entry filled on the first view, where per-layout files would each miss separately and a
reader moving from a post to `/film/` would pay again. The cost is that a post carries the
timeline, album and home rules it will never use — about 3.3 KB gzip, once a year, against
6.6 KB saved on every view after the first.

Whole site: 50,210 bytes raw, 9,480 gzipped.

### Two things this makes load-bearing

**1. Cache-busting is not optional.** At `max-age=31536000` the browser does not re-request
and does not even revalidate — a stable filename strands a returning reader on old CSS for up
to a year. `scripts/hash-assets.mjs` renames to `<name>.<hash>.ext` after the build and
rewrites every reference, failing the build if anything it hashed ends up referenced by
nothing. It must run *after* the esbuild minify step, or the hash describes bytes that are
not the bytes we ship. It runs in Actions only; local `jekyll serve` and the Cloudflare Pages
backup stay on the unhashed paths and are internally consistent.

This was *already* true of the JavaScript — every fix shipped to `assets/scripts/` since the
move to this host could take a year to reach a returning reader. Inlined CSS was accidentally
immune, riding along with `max-age=600` HTML. Externalising made it matter, and the fix
covers the scripts too.

**2. Every stylesheet applies to every page.** There is no layout gate any more. A selector
must anchor to something page-specific — a class (`.page`, `.post`) or a custom element
(`<photo-cover>`, `<home-container>`) — and never a bare `main > article > h2`.

`page.css` was the one file that had assumed the gate, and the damage was not cosmetic: its
prose-measure rule was `main > article > p` and friends, a post is *also* `main > article`,
and `max-width: var(--measure)` had no competitor in `post.css` — which sets `width` on the
title, not `max-width`. So `main > article > h1` would have won and silently clamped all
~1,456 post titles back to 665px, undoing the full-width titles. It is now scoped to `.page`,
written onto the article by `page.html`, mirroring `.post` on a post.

## The files
Flattened 2026-07-19 from 25 numbered ITCSS partials to 12 plainly-named files (14 today
— `timeline.css` came with the `/about/` rework; `cards.css` was split out of the base tier on
2026-07-27, and `code.css` was deleted the same day when Rouge was disabled). The numbering
(`0.0-`, `2.1-`, `9.9-`) encoded cascade order for humans; the order now lives in one place —
`assets/styles/site.scss` — which is the only thing that actually determines it.

    _sass/
      config.css      ratios, scales, spacing, breakpoints   ← must stay first
      themes.css      palettes, light/dark, webfonts         ← only file with raw color
      base.css        reset, type, tables, images, cards,
                      footnotes, block utilities
      chrome.css      header, footer, appearance, search
      bookplate.css   the CSS stand-in for a book with no cover picture
                      (2026-08-04) — sits inside the cards grid
      post.css        article bundle
      page.css        page bundle (empty hook today)
      album.css       gallery bundle
      home.css        \
      archives.css     |  per-page one-offs
      search.css       |
      now.css         /
      bookmarks.css   not yet wired up — see below

## How the one file is assembled

> The three tiers — base, per-layout bundle, per-page opt-in — described how CSS was
> *delivered* until 2026-07-27, gated by the `styles:` front-matter key. Delivery is now one
> file for everyone and that key is gone. The grouping survives as *organization*: it is
> still how you decide which file to open. It is no longer what ships where.

`assets/styles/site.css` is the manifest. It is a `.css` file with front matter (load-bearing
— without the fence Jekyll copies it verbatim and the browser gets Liquid as text), and it
`{% include %}`s every stylesheet in cascade order inside one `capture`, then `scssify`s it.

    Foundation      config → themes → base → chrome
    Layout          cards → album → page → post
    Page one-offs   archives → home → now → search → timeline

Order is the cascade; there is no other mechanism now. Two consequences:

- `config.css` **must stay first** — it defines the `$breakpoint-*` SCSS vars and every custom
  property downstream reads, and Sass resolves those at compile time, in source order.
- `cards.css` precedes `album.css` (album styles the page around the grid cards defines), and
  the page one-offs follow `page.css`, which is what they used to layer on top of.

`bookmarks.css` is deliberately not in the manifest — it styles a `<bookmarks-header>`
that no page emits yet, and including it would ship 1.2 KB to every page for markup that does
not exist. Add the line when the bookmarks page lands.

### What one file retired: the copies (2026-07-27)

Three separate blocks in this repo carried a comment justifying a hand-made duplicate on the
grounds that *"these bundles are never loaded together, so sharing would mean promoting the
rules into `base.css` and paying for them on all ~1,456 pages."* That reasoning was correct
under inlining and is void under one shared file. All of them are gone:

| Was duplicated | Copies | Now |
|---|---|---|
| Timeline spine, marker, period heading | `timeline.css`, `now.css` | `timeline.css`, grouped selectors carrying both vocabularies |
| `.headerlink` (the § anchor) | `post.css`, `timeline.css`, `now.css` | `base.css`, once |

⚠️ **One of those copies had already gone silently wrong.** `.headerlink` was deleted from
`post.css` by accident during the code/cards split, so 453 posts rendered a bare, permanently
visible § against every heading — found only because the timeline merge went looking at the
other two copies. Duplicated CSS does not drift apart loudly.

`.headerlink` gets its positioning context from `:is(h1..h6):has(> .headerlink)` — the heading
becomes a containing block only once the script has put an anchor in it, which covers all three
page types at once. The old form was a hand-listed `.post > h2, .post > h3, …`, which needed a
new entry for every page type that wanted anchors, and that is exactly the upkeep that failed.

The one value `/about/` and `/now/` genuinely disagree on is the gap between entries, so it is
the `--timeline-entry-gap` token rather than a second rule: 30px against 20px, because an
`/about/` entry is a title, meta and prose while a `/now/` entry is one paragraph.

### Where new CSS goes
Still by layout, not by page — the failure mode being avoided is CSS scattered across twenty
files where nobody can tell what styles what. "Base is the thing to protect" no longer means
*bytes* (everything ships regardless); it means blast radius. A selector in `base.css` is
one you are pointing at all ~1,483 pages on purpose.

The corollary is the rule in *The principle, restated* above: since nothing is gated any more,
anything page-specific has to say so in the selector. Anchor to a class or a custom
element. A bare `main > article > h2` is a bug waiting for the next page type.

### Element defaults are `:where()`-wrapped — link colors especially (2026-07-27)

`base.scss` sets link color as `:where(a, a:visited)` and `:where(a:hover, a:active)`, which
is zero specificity. Any component rule beats it. That is deliberate and it is the fix for
a bug that had spread across the whole site.

Unwrapped, those selectors are (0,1,1) — an element plus a pseudo-class — which is *higher
than a plain class*. So every piece of chrome that happens to be a link lost its own color the
moment it was visited and took `--text-color-link` instead. `--text-color-link` is
`--color-accent`, gray-900 by default, so the symptom read as *"this went slightly too dark"*
rather than as anything broken — and became a wrong hue outright for a reader who had picked
an accent. It was permanent once triggered, because visiting is what these links are for.

Six places, found by audit rather than by eye:

| selector | | was |
|---|---|---|
| `site-nav a` | (0,0,2) | header nav |
| `.post-nav__link` | (0,1,0) | PREV / NEXT |
| `.headerlink` | (0,1,0) | the § anchors |
| `.icon-button` | (0,1,0) | search, RSS |
| `home-books li a` | (0,0,3) | homepage book list — *retired 2026-07-31, now `.strip__link`* |
| `.pagefind-modular-list-link` | (0,1,0) | search results |

⚠️ **Do not un-wrap these, and do not "fix" a chrome link by adding `:visited` to its own
rule.** The instance-level patch works and was what the random button carried for one commit,
but it leaves the next chrome link to arrive with the same bug. A default should be the easiest
thing in the cascade to override.

Blast radius, checked rather than assumed: color only, on those six. Browsers restrict
`:visited` styling to a short list of color properties, so the `text-decoration` in those
rules never leaked into visited state; hover was already covered by `.post-nav__link:hover`
re-stating it at (0,2,0). Everything at (0,1,1) or higher already won and is untouched —
`.footer-links a`, `.footer-social a`, `.archive-years a`, the Pagefind result titles.

### Old → new filename map
Historical entries in [`memory.md`](memory.md) and in the sections above still use the
numbered names. They are kept as written — this table resolves them.

| Old | New |
|---|---|
| `config.css` | `config.css` |
| `themes.css`, `themes.css` | `themes.css` |
| `base.css`, `base.css`, `1.3-table.css`, `2.1-images.css`, `2.1-cards.css`, `base.css`, `9.1-utils-ui.css` | `base.css` |
| `3.1-header.css`, `3.1-footer.css`, `chrome.css`, `8.2-tools-search.css` | `chrome.css` |
| `4.1-posts.css`, `post.css`, `2.1-images-gallery.css`, `9.9-utils-anchorjs.css` | `post.css` |
| `4.1-pages.css` (0 bytes) | `page.css` |
| `album.css` | `album.css` |
| `4.1-home.css` / `4.1-archives.css` / `4.1-search-pagefind.css` / `4.1-pages-now.css` | `home.css` / `archives.css` / `search.css` / `now.css` |
| `4.1-pages-bookmarks.css` | `bookmarks.css` |
| `4.1-pages-film.css`, `4.1-pages-books.css` | deleted (duplicates, superseded by `album.css`) |
| `4.1-search.css` | deleted earlier (Google CSE, dead since the Pagefind move) |

`bookmarks.css` is included by nothing. It styles a `<bookmarks-header>` element for a
bookmarks page that doesn't exist yet. Kept on purpose — in-progress work, not dead code.

### Verifying a restructure
The flatten was checked by diffing the emitted `<style>` block on seven page types before and
after: identical byte counts and identical rule sets, with one intentional reorder (the three
`.block-*` utilities moved ahead of chrome; no selector overlap, so no cascade effect). Worth
repeating that check on any future reshuffle:

    ruby -e 's=File.read(ARGV[0]).scan(/<style[^>]*>(.*?)<\/style>/m).flatten.join; \
      puts s.scan(/(?:^|\})([^{}@]{1,80})\{/).flatten.map(&:strip).sort.join("\n")' \
      _site/index.html > /tmp/rules-before.txt

### Two keys, easily confused — now one
- ~~`styles:` (plural) — names a CSS include. Works on a **layout** (tier 1) or a **page**
  (tier 2).~~ Removed 2026-07-27. Every stylesheet ships to every page, so there was
  nothing left for it to switch. It was deleted from three layouts and five pages; a stray
  `styles:` in front matter today does nothing at all.
- `style:` (singular) — a CSS class written onto `<main>`. Still live. A layout/styling
  hook, not a bundle. This is the one that survives, and it was always the more confusable
  of the two.

## The home page (rebuilt 2026-07-31)
Built from Brajeshwar's tldraw wireframe. Three pieces, all in `_sass/home.scss`.

**A two-column band.** `home-container` is a grid: a reading column and an 18rem sidebar,
with the sidebar spanning both content rows rather than being cut in two. Both tracks are
`minmax(0, …)` — a grid track's default `min-width: auto` refuses to shrink below its
content, so one long post title would otherwise push the column past its share and squeeze
the sidebar. It collapses to one column at `$medium`, not `$small`: with an 18rem sidebar the
reading column is the narrower of the two below ~800px.

**Table-of-contents lists.** Articles and Popular & Handpicked, both title left / date hard
right with a dotted leader between. Includes: `home-articles.html`, `home-popular.html`.
- **How many articles show is a single `{% raw %}{% assign article_count = 21 %}{% endraw %}`
  at the top of `home-articles.html`** — deliberately the first thing in the file, because
  it is the knob Brajeshwar changes. The year separators regroup themselves from whatever
  the loop returns.
- `align-items: flex-end` on the row, **not `baseline`**. Baseline looks identical on
  one-line rows and wrong on every wrapped one — it pins to the first line, stranding the
  date at the top of a two-line row. `flex-end` drops the leader and date onto the title's
  last line.
- The leader is a **repeating radial gradient, not `border-bottom: 1px dotted`.** The border
  version was written first and failed on contact: `--border-color` is a 10% alpha, and a 1px
  dotted border on a 2× display antialiases into a continuous hairline. The computed style
  said `dotted` while the screen showed a solid rule. 2px dots on a 7px pitch instead.
- The leader is an empty `<span>`, never typed dots — dots would be read aloud, would not
  stretch, and would break at arbitrary points.
- **Titles are truncated, not wrapped** (2026-07-31) — one line, `text-overflow: ellipsis`,
  so the leader always has room. Needs `white-space: nowrap` + `overflow: hidden` +
  `text-overflow` on the title *and* `flex: 0 1 auto` + `min-width: 0` on the flex item: a
  flex child's default `min-width: auto` refuses to shrink below its content, which cancels
  the ellipsis entirely. The leader's minimum went 1.5rem → 3rem (≈7 dots) at the same time,
  since trimming only helps if the space it frees reads as a leader. Rows are now a uniform
  42px.
- **Hover is a row background, not an underline** (2026-07-31). The `margin-inline` is the
  negative of the horizontal padding, so the highlight gets breathing room while the *text*
  stays flush with the column edge every other element on the site aligns to. Change one of
  the two numbers and the column silently stops lining up.
- **Year separators, Articles only.** A right-aligned marker whenever the year changes, so it
  labels the date column it sits above; dates then drop the year (`JUL 07`). Popular is
  ranked, not chronological, so it has no separators and keeps full dates (`JUL 07, 2026`).
  Uppercasing is `upcase` in Liquid, not `text-transform` — Popular's dates are free strings
  from a yaml, and doing it in one place keeps both lists identical whatever the source.

**Two breakout strips** (Books, Photos) — one shared include, `home-strip.html`, at two
ratios: books 3:4, photos 4:3, set with `aspect-ratio` on the `<img>` so a slow file still
reserves its box and the row never reflows.

**Width is `100vw`, uncapped** (2026-08-01). It was `min(100vw, --body-width-full)` while the
row was *clipped*, when a bound was the only thing stopping content being unreachable. Once
it scrolled, that bound only hid thumbnails from people with the screens to see them. No
sentinel value is needed — `100vw` already means "the viewport", so an ultrawide shows more
and a laptop scrolls for the rest. `--body-width-full` still means 1600px for `<photo-cover>`,
its remaining user (joined 2026-08-02 by the in-post `.gallery` — see *The second exception*
under §6).

⚠️ **One behavior at every width: one row, scrolls, arrows on overflow.** The `$small` block
sets only the item size. It previously also wrapped into two clipped rows, from an earlier
instruction, and that survived the rewrite — so narrow screens were the one place the strips
did *not* scroll, and the arrows correctly stayed hidden because a wrapped row never
overflows horizontally. Found by comparing visible-thumbnail counts across widths: 320/390/480
reported no overflow while every wider viewport did, which is backwards. See the *Full-bleed is back* entry in [`todo.md`](todo.md) for
the mechanism and the `overflow-x: clip` counterweight.

**The bleed is symmetric** (2026-07-31): the strip box is centered on the page and
`justify-content: center` centers the thumbnails inside it, so a short shelf sits in the
middle of the bleed and a long one clips evenly at both edges. This replaced a
`padding-inline-start` that pinned the first thumbnail to the band's left edge — so these
strips are the one place on the site that does *not* start on that line. Deliberate, and
asked for; the heading above still sits in the band, so the alignment is still stated.

⚠️ **Items are fixed width (`flex: 0 0`) and must stay that way.** Making them elastic so a
short shelf fills the viewport was tried on 2026-07-31 and is visibly broken: with
`max-width` capping some and not others, flex distributes free space unevenly, and because
the ratio lives on the image, a grown item is also *taller* — three sizes on two baselines.
The honest cost of fixed width is that six books stop ~66px short of a 1512px viewport; that
resolves itself once the shelf overflows. Raise `--strip-item` if it needs forcing sooner.

**The strips scroll, with arrow buttons** (2026-07-31). `overflow-x: auto`, not `hidden` —
the clipped version quietly made half a twelve-item shelf unreachable. Two `<button>`s per
strip, a 15px chevron in a 56px hit area, shipped with `hidden` and revealed by
`strip-nav.js` only once it measures a real overflow. With JS off they never appear and
nothing is lost: the row is a native scroller for trackpad, touch and keyboard.

⚠️ **`justify-content: safe center`, and the `safe` is load-bearing.** Plain `center` centers
the *overflow* too, so half a long shelf lands left of the scroll origin where `scrollLeft`
cannot reach it — measured with twelve books at 1512, the first thumbnail sat at x = −451
with the row already fully scrolled left. `safe` falls back to `start` when content
overflows: short shelves center, long ones start at the bleed edge and scroll.

⚠️ **Two reduced-motion traps, both measured on Brajeshwar's machine** (which has the OS
setting on). `scrollBy({behavior:'smooth'})` does not merely degrade under reduced motion —
it does *nothing*; the script picks `'auto'` explicitly instead. And a programmatic scroll
does not reliably fire a `scroll` event, so the click handler re-syncs the button state
directly rather than waiting for one.

### Masonry on /album/ — no JavaScript (2026-08-01)

Brajeshwar asked whether masonry could be CSS-only. It can, and it is.

**Native masonry is still not shippable.** Measured in Chrome 150 on 2026-08-01, all three
competing syntaxes report `false`: `grid-template-rows: masonry`, `display: masonry`, and the
newer `item-flow`. So this is **multi-column**, universally supported for a decade, doing the
one thing masonry is actually for — every image keeps its own height and nothing is cropped.

`columns: 14rem` is a column *width*, not a count, so the browser fits as many as the
container allows and rebalances on resize. No breakpoints. Measured: 1 column at 320–480,
3 at 768, 4 at 1024–1512, 0 items split at any width, columns within 82px of each other.

⚠️ **The selector needs two classes: `.item__cards.card-grid--masonry`.** `cards.scss` writes
`ul.item__cards`, which is (0,1,1); a lone `.card-grid--masonry` at (0,1,0) loses and
`display: grid` survives. The failure is quiet — `columns` still *computes* (measured
column-width 224px, exactly the 14rem asked for) but has no effect on a grid container, so
the CSS reads as applied while the layout does not move.

⚠️ **The trade-off is reading order, and it is the only reason to reach for JavaScript.**
Columns flow top-to-bottom then across: with three columns, items 1-2-3 run *down* the left,
not across the top. For an album, browsed rather than read in sequence, that is fine. For a
chronological feed where "next" must mean "to the right", no amount of CSS fixes it — that is
where a JS masonry earns its keep, and nothing else here does.

**Media badges** (2026-08-01). An album item carrying `media: video` or `media: audio` gets a
small icon over the bottom-left of its frame — a play glyph or a waveform, `_includes/icons/`,
monochrome and `currentColor` like the rest. Stills get nothing: absence is the default, so
the badge means "not just a picture" rather than being one of three markers to learn.
Bottom-left rather than centered, because a centered play button is the convention for a
*player* and these are links to a page that holds the media. The dark scrim is not decoration
— the icon sits on a photograph of unknown brightness, and a single color cannot be legible
on all of them.
⚠️ The badge is `aria-hidden`; the word goes into the image's **alt** ("… (video)"). The first
attempt used a `.visually-hidden` span, which **this site does not have** — base.css's copy
was deleted after the 2026-07-19 audit flagged it unreferenced, so it would have printed the
word "video" under the thumbnail as visible text.

⚠️ **`/books/` lost its prose on 2026-08-01** and with it its footnotes, so it no longer gets
`container-ideal` from `page.html` — the article is plain `.page` at the full band. The
`.page > .album` rule is a no-op there now and is kept for the next footnoted page with a
gallery. The prose is verbatim in `_backup/books-BCK.md`, an underscore directory Jekyll never
copies, so it cannot publish itself at `/books-BCK/`.

⚠️ **Album is placeholder data.** `_data/album.yaml` exists but every `img` points into
`/static/books/` — there is no `/static/album/` yet. An `img` beginning with `/` is used
verbatim by the include; bare filenames resolve under `/static/<kind>/`. Replace the yaml
wholesale when real photos land.

⚠️ **These strips do not use `ul.item__cards`.** That class is shared with the album pages
through `album.scss` (`/devices/`, `/film/`, `/books/`, `/album/`), which want a wrapping grid
where these want a clipped single row. New classes, no shared surface.

⚠️ **They DO share `.strip__viewport` / `.strip` with `/own/`** (2026-08-08), which is a second
caller of the same scroller. `/own/` overrides three declarations under a `.page-own` prefix —
the bleed, the centring and the item width — and inherits the overflow, the scroll behaviour
and the arrow buttons unchanged. `default.html` gates strip-nav.js on the literal string
`class="strip__viewport"`, so that attribute must stay exactly that on both pages.
*(`/wear/` used to be in the list above; it is `/own/` now and uses neither grid.)*

### The bookplate — a book with no cover picture (2026-08-04)

Brajeshwar: *"I want to start adding more books but I don't want to spend time editing the
book cover pictures now. Can we do a clean, nice book-esque design in CSS or SVG as the
placeholder for books listing without a picture?"* This closes the books half of the item
parked in [`todo.md`](todo.md) since 2026-07-27 — *SVG covers vs a plain text block*.

**It is CSS, and neither of the two options as posed.** An inline SVG repeats its whole
markup in every card, on a home page held under 100 KB; `_sass/bookplate.scss` is one rule
set shared by every plate, inside a stylesheet already fetched and cached for a year — **1.7
KB raw, +319 bytes gzip**. And SVG text does not wrap, so every long title would need a
hand-placed line break: exactly the per-item maintenance the request is trying to shed.

An entry in the books data with **no `img`** renders a plain bound front board — the
spine and its hinge down the left, the title in a serif on the paper face, a short rule, the
author in letterspaced caps. Both `card-grid.html` and `home-strip.html` emit it, so a
coverless book cannot render fine on `/books/` and broken on the home shelf. *(The data moved
on 2026-08-07: `_data/books/01.yaml` + `a`–`z`, with favorites in `_data/books-favorites.yaml`.
The plate is unchanged — it keys off a missing `img`, wherever the entry lives.)* Adding a book is
now a title, an author and a url.

⚠️ **A QUERY CONTAINER CANNOT READ ITS OWN CONTAINER UNITS, AND THE FAILURE IS SILENT AND
BACKWARDS.** The plate is `container-type: inline-size` so its type scales in `cqi` with the
card rather than with the viewport — 18.1px at 193px in the `/books/` grid, 13.8px at 146px
on a phone. But a `cqi` in the container's **own** properties does not error and does not
resolve to zero: it falls through to the next container up, which here is the 1024px page.
Measured with `padding: 10cqi 9cqi …` on the plate itself:

| | |
|---|---|
| padding computed | 102px and 164px, inside a 193px card |
| plate width | blew out to 257px |
| plate **content box** | collapsed to ~1px |
| what a container query then measured | ~1px — so `(max-width: 150px)` matched at full size |
| what the title did | fell to its `clamp()` floor everywhere |

All of which reads exactly like "container units are unsupported here". They were not. **The
fix is structural: keep the container's own box free of `cqi` and put every container unit on
descendants.** A padding-free container has a second virtue — its content box equals its
border box, so `1cqi` is honestly 1% of the visible element and every number in the file
reads as a percentage of the cover.

⚠️ **A pseudo-element belongs to the container rather than sitting inside it** — the same
trap one layer down. `.bookplate::before { width: 7cqi }` resolves against the page. Use a
percentage: on an absolutely-positioned box it resolves against the containing block, which
is the element you meant.

⚠️ **`.album figure span` is (0,1,2).** On `/books/` the plate sits inside a `<figure>`, so a
lone `.bookplate__title` at (0,1,0) loses to it and the title renders at `--step--2` in
`--text-color-low` — a second caption — with the CSS reading as applied. `.bookplate
.bookplate__title` at (0,2,0) wins, because the class count is compared before the element
count. Same shape as the `.item__cards.card-grid--masonry` trap above.

⚠️ **Anything standing in for an image must declare `border-radius`.** base.scss carries
`main :where(img, video, iframe) { border-radius: var(--border-radius) }`, so every real
cover is 7px rounded and a square-cornered plate is the one hard-edged card in the grid.

⚠️ **`aria-hidden` means nothing to Pagefind.** The plate repeats the caption's text, so it
also carries `data-pagefind-ignore` — the same attribute, for the same reason, as
`header.html` and `footer.html`.

**The title appears twice on an img-less card, deliberately** — once on the plate, once in
the caption below. Checked at the sizes it actually renders at: they read as different
objects, one the cover and one the label, which is what every real book grid does. The plate
is `aria-hidden`, so it is announced once.

**The board is a step off the page in all six palette/mode combinations**, and the step is
*not* always upward: in Warm light, Flexoki's page is paper (255,252,240) and the surface is
base-50 (242,240,229), so the board is slightly darker. That is what an unjacketed cloth
binding looks like on cream stock — the odd one out is the one that reads best. Do not
hardcode a lighter value; it would break the monotone contract and the other five.

**The spine inverts in dark mode, and that was checked rather than assumed.** It is a
`color-mix` of `--text-color`, which is near-white in dark, so the band paints *lighter* than
the board and the crease is a highlight instead of a shadow. In the browser it reads as light
catching the binding edge of a dark book. Left as is: a mode-specific value would put a raw
color outside `themes.scss` to fix something that is not broken.

**The home shelf's grayscale applies to plates too**, via
`.strip__link:hover :is(.strip__img, .bookplate)`. Verified with a real hover, not by reading
the selector — this repo has three separate entries about hover rules that computed exactly
as written and painted nothing. On hover the plate goes `grayscale(1)` → `grayscale(0)` while
an un-hovered cover beside it stays at `1`.

### Responsive audit, 2026-08-01

Measured, not assumed: every page type loaded in an iframe at 320 / 480 / 768 / 1024 / 1512
and checked for `documentElement.scrollWidth > viewport` **and** for an actual sideways
scroll. All nine page types clean at all five widths.

That audit existed because it found a real break. The home page overflowed at **every width
below 768px** — 692px of content in a 320px viewport, on 28 rows — and every other page was
fine, which is exactly why nobody saw it. Two causes, both mine, both invisible by eye:

1. **`grid-template-columns: 1fr` in the mobile collapse.** `1fr` is `minmax(auto, 1fr)`, and
   that automatic minimum will not shrink below the track's max-content. Once toc titles
   became `white-space: nowrap` for the ellipsis, max-content was the full untruncated
   headline, so the "single column" computed to **679px inside a 346px container**. The
   two-column rule above it was already written `minmax(0, 1fr)` for this exact reason; the
   collapse rule was not. **Never write a bare `1fr` in this codebase.**
2. **A flat negative margin on the row highlight.** `-10px` each side is nothing against a
   1512px viewport with 244px of gutter; at 320px the gutter is 6.4px and it overflowed by
   3.6px. Now `calc(-1 * min(var(--space-2xs), (100vw - 100%) / 2))` — bleed the full amount
   when there is room, exactly the gutter when there is not, no breakpoint needed.

⚠️ **`overflow-x: clip` on `body` does not reliably reach the viewport.** Unlike `hidden`, it
did not propagate: computed style on body read `clip` while the page still scrolled sideways
2.5px. It is set on `html` **and** `body` now. Still never `hidden` — that would make the
element a scroll container and unstick the sticky header.

## The `album` layout (built 2026-07-19)
A thumbnail grid for photos, videos, or both — a simple album hosted here, likely linking out
to Oinam's photo site later.

`film` and `devices` were already the same thing wearing two hats: a `ul.item__cards` grid of
`figure`s with a cover image, a title, and a bit of meta. They now share `_layouts/album.html`
+ `styles-album.html` + `album.css`, with per-collection differences left on the `style:`
hook (`.page-film`, `.page-devices` — e.g. devices stacks its "Used: …" line, film keeps the
year inline).

`books` is *not* part of this. It looked gallery-shaped from the filename `4.1-pages-books.css`,
but that file was a copy of the film CSS and `_pages/books.md` is prose — headings, lists,
footnotes, no card grid. It stays on `layout: page`. `photos.md` is a "Coming Soon" prose stub
today; it's the natural third album once there's something to show.

What the consolidation fixed: `/devices/` had `style: page-devices` but no `styles:` key, and
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

They are not interchangeable. 22 pages use `page` (about, books, contact, blogroll,
styleguide, 404, …); only 2 use `page-full` (`_pages/film.html`, `_pages/devices.html`).
Defaulting the merged layout to the full-bleed body would drop `container-ideal` from all 22
and push prose edge-to-edge.

*(Counts as of 2026-08-08: **20** on `page`, **3** on `album` — `/film/`, `/devices/`, `/own/` —
and **2** on `default`. `page-full.html` is `album.html` now, and `/blogroll/` is gone: deleted
2026-08-07 and not coming back, "I'm not doing blogroll". The paragraph above is kept as the
record of why the two layouts were merged, not as a current inventory.)*

Done 2026-07-19. The merge kept one file with a conditional wrapper, defaulting to reading
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

One layout, both behaviors, 22 pages unchanged (verified: every page that was on
`container-ideal` still is). `page-full.html` is deleted.

`full: true` has no users — film and devices went to `album` instead. It stays as a
documented capability for a future full-bleed page that isn't a gallery; if that never
arrives, drop the conditional and the layout gets simpler again.

## Bugs found while mapping this (2026-07-19)
Three partials are never included by anything — dead weight in the repo and, for two of
them, visibly missing styles in production:

| Partial | Size | Impact |
|---|---|---|
| `post.css` | 4.8 KB | ~~**Syntax highlighting is monochrome site-wide.**~~ **FIXED 2026-07-19** — see *Syntax highlighting* below. Affected 55 posts. |
| `4.1-pages-books.css` | 850 B | **Correction (2026-07-19):** not a rendering bug. The file is a **byte-for-byte copy of `4.1-pages-film.css`** and contains no `page-books` selectors at all — `/books/` is a prose page on `layout: page` that needs no gallery CSS and renders fine. Pure dead weight. Deleted. |
| `4.1-pages-bookmarks.css` | 781 B | No page references it; likely dead since a past restructure. |

Also: `4.1-pages.css` is 0 bytes, so the `layout: page` tier currently adds nothing —
harmless, but it means tier 1 for pages is a placeholder rather than a working bundle.

And `_pages/devices.html` sets `style: page-devices`, but its selectors live inside
`4.1-pages-film.css`, which only `film.html` loads — so `/devices/` is unstyled too.

The `album` consolidation fixes books, devices, and film together.
`4.1-pages-bookmarks.css` needs a confirm-then-delete.

## Syntax highlighting (fixed 2026-07-19)
`post.css` was the upstream pygments "native" theme: ~100 hardcoded hex values and its
own fixed dark slab, theme-blind. Wiring it in unchanged would have put a dark block on every
page regardless of the reader's mode or palette — wrong for a site built around reader-chosen
theming. So it was tokenised instead:

- New `--code-*` tokens in `themes.css`. Light and dark share one hue per token role and
  differ only in `--code-l` (lightness), so dark mode is a single-line flip rather than a
  duplicated palette. Chroma is one knob too: `--code-c: 0` makes code fully monotone,
  differentiating by weight/italic/underline alone — the setting most true to the monotone
  default, kept as an easy switch.
- `post.css` references only those tokens. Selectors grouped by role, so the file went
  4.8 KB → 3.6 KB while covering more classes.
- Added `c1`, `cd`, `s1`, `s2` — Rouge emits these, the upstream pygments file didn't have
  them, so single-line comments (43×) and single/double-quoted strings (108×) were rendering as
  plain code. All 33 classes the site actually emits are now covered.
- Dropped the `.err` background box. Rouge flags `err` on valid 2002-era ActionScript
  (33 spans across 5 posts, all false positives); a highlighted box drew the eye to a lexer
  artifact. A color tint remains.

Verified in-browser, light and dark, at 1440px. Contrast on the code background: light ≥ 5.68:1,
dark ≥ 7.66:1, nord-dark ≥ 5.92:1, eink-light ≥ 4.49:1. *The eink-light figure is from the old
sepia ramp; the Flexoki palette that replaced it on 2026-07-27 raised `--color-fg-subtle` to
4.97:1, so code comments in Warm-light now clear AA. Re-measure the rest of this line if it
ever matters.*

Cost: the `--code-*` tokens live in `themes.css`, which is base, so every page carries them
(+0.18 KB gzip on the homepage) even though only 55 posts have code. Kept there anyway — the
guardrail puts color in `themes.css`, and it's where you'd look for them.

## Audit + cleanup, 2026-07-19
A pass over all 12 files, checking every selector against real markup and every custom
property against real `var()` reads. −2,012 B raw / −0.35 KB gzip on every page
(−2,571 B on `/search/`). Roughly 2.9 MB across the site.

### Bugs fixed
- Palette + auto-dark hung on source order. `:root[data-theme="auto"]` is specificity
  (0,2,0) — exactly tied with `:root[data-palette="eink"]`, which sets a *light*
  `--color-surface`. It won only because it appeared later in the file. Reordering the
  palettes, splitting `themes.css`, or shuffling `styles.html` would have silently given
  eink/nord readers a light surface in dark mode. The explicit-dark branch always carried a
  `[data-palette]` guard; auto did not. Both do now, so it is settled on specificity.
- The two dark branches are now SCSS mixins. Dark has to be written twice (a media query
  can't merge with a bare selector), and the copies were identical only by luck. The values
  now exist once; drift is structurally impossible. Merging the two `@media` wrappers paid
  for the added selector — net +1 byte.
- `search.css` referenced seven tokens that don't exist. `--link-color`, `--accent-color`,
  `--text-color-muted`, `--text-color-secondary`, `--highlight-bg`, `--highlight-text`,
  `--bg-color-medium` are declared nowhere, so every one fell through to a hardcoded hex and
  the search UI ignored the reader's theme entirely. Repointed at real tokens; verified in-browser
  that light/dark now invert and eink yields warm cream instead of `#fff`.
- `search.css` leaked into global `mark`. An unscoped `mark` rule repainted *every* `<mark>`
  on `/search/`, not just search hits. Scoped to `.pagefind-ui`. A second, earlier `mark` rule
  was fully overridden by it — dead, removed.

### Dead weight removed (all verified, not guessed)
- 28 custom properties in `config.css` — Utopia one-up pairs and `--space-3xl` (never
  referenced), `--display-*` (dead *and* a hand-synced duplicate of `$breakpoint-*`), unused
  border/radius/weight variants, `--icon-size`, `--image-width-full`, `--scale-large` +
  `--minor-seventh`, `--space-small`/`--space-smallest`, `--phi` (a duplicate of `--golden`).
- 7 semantic tokens in `themes.css` (16 declaration sites) — `--color-accent-fg` alone was
  assigned in six places and read in none.
- Empty rulesets in `base.css`, `home.css`, `post.css`. Zero byte impact (compression drops
  them) but pure source noise.
- All hardcoded color outside `themes.css`. `search.css` was the last documented exception;
  there are now zero exceptions.

### The correction that made this necessary
An earlier comment in `config.css` claimed unused custom properties cost nothing in the shipped
CSS. **That is wrong.** Comments are stripped by `style: compressed`; *declarations are not*. The
note was licensing dead weight, and roughly 1.6 KB of unread tokens had accumulated behind it.
Corrected in place.

## Audit backlog
Verified findings, deliberately not acted on yet — see [`todo.md`](todo.md) for the list.
The big one: `search.css` hand-copies ~6 KB of Pagefind's own stylesheet, which
`_pages/search.html` already links separately. Confirming that needs a Pagefind build
(`make serve`), so it was left rather than cut on inference.

## Rules for adding CSS
0. Put an `@media` override AFTER the rules it overrides. These files are full of bare
   element selectors (`header`, `site-nav`, `page-archives table`), so a media block competing
   with one has *equal specificity* and loses on source order. The failure is quiet and
   partial: custom-property overrides inside the block still apply, because those cascade by
   inheritance — so sizes driven by tokens change while `font-size`, `padding` and `gap` do
   not, and it reads as "mostly working". Cost the header rework a horizontal-scroll bug on
   phones (2026-07-27); see [`memory.md`](memory.md).
1. Default to a tier-1 layout bundle. New page type → new layout → one bundle.
2. Adding to base needs a reason. It costs every page. Re-measure gzip after.
3. Tier 2 is for one-offs only — a page nothing else resembles.
4. Every partial must be reachable. If nothing includes it, delete it or wire it up;
   the orphans above are what happens otherwise.
5. Re-measure after any bundle change — budget is ≤ 13 KB gzip per page.

Measure with:

    ruby -rzlib -e 'c=File.read(ARGV[0]); s=c.scan(/<style[^>]*>(.*?)<\/style>/m).flatten.join; \
      puts "raw #{s.bytesize} gzip #{Zlib::Deflate.deflate(s,9).bytesize}"' _site/index.html

---

# 6. Layout patterns

Brajeshwar, 2026-07-27: *"There is a pattern of layout templates forming."* He is right, and
naming them is what stops the next page inventing a sixth:

| Pattern | Pages | How |
|---|---|---|
| **Reading** | posts, prose pages | `main` at the site width; prose capped at `--measure` |
| **Timeline** | `/about/`, `/now/` | year/period heading, spine, dots, entries |
| **Album** | `/film/`, `/devices/` | fluid `ul.item__cards` thumbnail grid |
| **Listing** | `/archives/` | dense rows + the year scrubber |

Timeline is a shared look with no shared file. `/about/` uses `timeline.css` on hand-written
markup; `/now/` uses `now.css` on what kramdown emits from `now/*.md`. The rules are deliberate
copies — both are tier-2 bundles never loaded together, so sharing means promoting to
`base.css` and charging ~1,456 pages for two. Keep them in step. If a third page ever wants
the timeline, that is the point to extract a real layout instead.

Album is available to any page. The grid (`ul.item__cards`) lives in `base.css`; the card
treatment is `album.css`, loaded by `_layouts/album.html`. To give a page thumbnails: switch it
to `layout: album` and emit `<ul class="item__cards">`. **Overtaken by events**: `/books/` and
`/album/` both have thumbnails now and use the grid via `<div class="album">` rather than the
layout, `/own/` (which is what `/wear/` became) uses the `.strip` scroller instead, and
`/music/` is the one page still waiting for data.

## Keeping the base tier honest

The point of splitting the CSS is that a page carries only what it uses. That only holds if the
base tier stays genuinely universal — anything in `config`/`themes`/`base`/`chrome` ships to
all ~1,456 posts and every page.

Audited 2026-07-27 by loading a post and testing every shipped rule against the DOM, then
against a sample of 8 posts to separate "unused here" from "unused anywhere". Two things were
paying rent on 1,456 pages to serve a handful:

| Split out | Was | Used by | Outcome |
|---|---|---|---|
| `code.css` | 3,495 B, 59% of `post.css` | **55 of 1,456 posts (3.8%)** | **deleted** — see below |
| `cards.css` | 737 B, in `base.css` | **0 posts, 3 pages** | `styles-album.html` + `home.css` |

Result: 7,334 → 6,647 gzip on a post without code — 687 bytes, 9.4%, off 1,401 posts. A post
*with* code is 7,248, still below where it started, because `cards.css` left too. Home, `/film/`
and `/devices/` are unchanged: they pull `cards.css` back in.

### Syntax highlighting is off entirely

`code.css` was first made conditional, then removed outright (2026-07-27), and Rouge is disabled
in `_config.yml`. Brajeshwar: *"I don't think I will be writing anything that shows off code any
more."* The numbers agreed:

- 55 of 1,456 posts have a code block at all;
- 257 of their 310 blocks are `plaintext` — nothing to color;
- of the rest, the languages are mostly 2002-era ActionScript, plus some CSS and shell;
- and it was the only place color appeared by default on a site whose stated rule is that
  color is opt-in.

Turning off the highlighter beats deleting only the stylesheet. Rouge's `<span>` soup is emitted
by kramdown, so dropping the CSS alone would have kept ~1.5 KB of markup per post doing nothing.
With `syntax_highlighter_opts: disable: true`, a block renders as plain
`<pre><code class="language-js">` and `base.css` already gives `<pre>` its background, padding,
radius, monospace and horizontal scroll — no styling is lost.

Measured on those 55 posts: 262,286 bytes raw / 41,276 gzip, −8.9% / −5.0%, about 4.7 KB raw
per post. Every one of the 1,456 posts now ships an identical 31,022-byte CSS bundle.

⚠️ **`:not(pre) > code`, not `code.language-plaintext`.** Kramdown only adds that class while a
highlighter is active. With Rouge off it emits a bare `<code>`, so the old selector silently
stopped matching and inline code lost its chip on every post that had any. Caught in the
browser, not in the build — nothing errors.

Reverting is three steps, listed in the `_config.yml` comment: drop the `kramdown:` block,
restore the stylesheet from git, re-add the conditional include.

⚠️ **Never write a literal Liquid tag in a CSS comment.** These files are Liquid includes, so
Jekyll parses inside `/* */` too. Documenting the conditional by spelling it out in `code.css`
broke the whole build, with the syntax error reported against `styles.html` — nowhere near the
cause. Use a raw tag or describe it in prose.

> ✅ **This trap is GONE as of 2026-07-27.** The stylesheets moved from `_includes/css/*.css`
> to `_sass/*.scss` and are no longer Liquid includes, so Jekyll does not parse inside them at
> all. A literal Liquid tag in a comment is now just text. Kept above because the failure it
> describes cost a build and the shape of it — an error reported against the file that *called*
> the compiler, never the file with the bad comment — is worth recognising if it ever recurs.
>
> ⚠️ **Two rules DO survive the move**, because they are Sass, not Liquid: never write a bang
> comment (slash-star-bang survives compression and ships), and never write a literal `*` `/`
> inside comment prose. That second one still misreports, now against
> `assets/styles/site.scss` rather than the partial at fault.

**What is NOT worth splitting**, having measured it: the theme-state rules
(`[data-theme]`/`[data-palette]`/`[data-font]`/`[data-text-size]`) look dead on any given page —
16 rules matching nothing — but they *are* the reader's options and must ship. Likewise
`.sidenote*`, `.back-to-top-row.is-visible`, `.pill__*` and `.pagefind-modular-*` match nothing
until JS creates the elements. A naive "unused CSS" tool will flag all of these. Don't.

## Breaking out of the reading column — RIGHT ONLY

Brajeshwar, 2026-07-27: *"No contents cannot go beyond the left container. If we are extending
it, then we will do it to the right, so it is still within the body width."*

Wide media keeps the article's left edge — the same line the prose, the header rule and the
footer rule all start from — and grows right, stopping at the content band. It never enters
the left margin and never exceeds the site width.

    margin-inline: 0;      /* keep the left edge */
    width: 100cqi;         /* grow right, to the band and no further */

`100cqi`, not `100vw`. `main` declares `container: main / inline-size`, so inside an article
`1cqi` is 1% of the band — exactly the box these should fill. No viewport arithmetic, so it
cannot drift when the site width changes, and it does not have to know about scrollbars (100vw
includes them, 100cqi does not).

What it replaced: `margin-inline: calc(50% - 50vw); width: 100vw; transform: translateX(calc(50vw
- 50%))` — viewport-wide and re-centered, so it spilled equally into *both* margins.

Everything that takes the band: `figure.full` / `img.full`, `figure.large` / `img.large`
(identical since 2026-07-27 — the 960px middle step is gone), videos and embeds
(`main :where(iframe, video)`), the post title (`.post h1`), `figcaption`, and `.post-nav`.
Verified: one distinct right edge across header, footer, `main`, title, image, caption
and nav. (`.gallery` was in this list until 2026-08-02; it goes *past* the band now — see
its own section below.)

### The first exception: `photo-cover`

The optional `image:` in a post's front matter is deliberately full-bleed — the single
element allowed past the band. Brajeshwar, 2026-07-27: *"an optional addition of beauty… sticks
to the header border-bottom and spans with width of the browser viewport or a max of 1600px."*
It is a flourish, not content; the article below still starts on the band's left edge.

    width: 100%;                          /* of <body>, NOT 100vw — see below */
    max-width: var(--body-width-full);    /* 1600px; .gallery shares the token since 2026-08-02 */
    margin-top: calc(-1 * var(--space-l));/* cancels the header's margin-bottom */

- `100%`, not `100vw` — `100vw` includes the scrollbar and overflows horizontally by its
  width.
- The negative top margin is what makes it "stick to the header border-bottom". ⚠️ Keep it in
  step with `header`'s `margin: 0 auto var(--space-l)` in chrome.css. `.archive-strip` does the
  same trick and carries the same warning.
- No `border-radius` — it runs to the window edge, and a curve against the edge of the
  viewport reads as a rendering fault.
- Its caption stays on the body width, not the image's. The image is a bleed and the caption
  is text, so it lines up with the prose rather than with the flourish. It was the one caption
  on the site that does *not* match its own figure until `.gallery figcaption` joined it on
  2026-08-02, for the same reason.

It also cannot use `cqi`: `post.html` emits it before `<main>`, so there is no container ancestor
and `cqi` would fall back to the viewport.

### The second exception: `.gallery` (2026-08-02)

Brajeshwar: *"For any container with the class 'gallery', extend beyond the body width until
our max guardrail of 1600px. As we are already doing masonry, can we re-use that."* Five posts
(2010–2024) wrap a plain list of images in `<div class="gallery">`; the class is authored in
content, so the CSS meets the markup where it is. Rules live in `base.scss`, one block.

    --gallery-bleed: min(100vw, var(--body-width-full));
    width: var(--gallery-bleed);
    margin-inline: calc(50cqi - var(--gallery-bleed) / 2);

- **Centered like the strips, not right-only** — that is what "extend beyond the body width"
  asked for. Unlike `photo-cover` it sits *inside* the article (a 665px box), so `width: 100%`
  cannot reach the body; instead `50cqi` names the band's midpoint, the band is centered on the
  body, so `50cqi − bleed/2` places a body-centered box from inside any descendant of `main`.
- **The masonry is /album/'s**, verbatim in technique and numbers — `columns: 14rem`,
  `column-gap: var(--space-xs)`, `break-inside: avoid` — applied to the gallery's own `<ul>`.
  Deliberately *not* shared selectors with `.card-grid--masonry`: that block's machinery
  (aspect-ratio warning, 225×300 fallback) is welded to the card-grid include's markup.
- **`100vw` includes the scrollbar**, so below 1600px the box pokes half a scrollbar past each
  body edge. `html:has(.gallery), body:has(.gallery) { overflow-x: clip }` absorbs it — the
  same counterweight, for the same reason, as `body:has(home-container)` on the home page.
- **Captions come back to the band** (`.gallery figcaption`), mirroring `photo-cover__desc`.
  Measured before the rule: a caption ran the full 1512px viewport flush against x=0.
- **`.post figure:not(.gallery)`** — the figures-take-the-band rule loads after base at higher
  specificity and would quietly pull a `figure.gallery` back to `100cqi`. Same load-bearing
  exclusion idiom as `.post img:not(.full):not(.large)`.
- `sidenotes.js` already listed `.gallery` among its obstacles, so notes duck below galleries
  with no JS change.

Verified 2026-08-02 in Chrome at 320/480/768/1024/1512: gallery fills `min(viewport, 1600)`,
1/2/3/4/6 columns respectively, `scrollWidth ≤ viewport` and `scrollX` pinned at 0 everywhere;
a gallery-free post keeps `overflow-x: visible`. Above 1512px is unverified — the standing
iframe-harness limit — but the formula is the same `min()` photo-cover ships with.

⚠️ **Wide media now sits in the sidenote gutter.** `sidenotes.js` `collectObstacles()` looks for
`.full, .large, .gallery` and pushes overlapping notes below them — see
[`sidenotes.md`](sidenotes.md) for the timing trap that came with it.

## Rounded corners on content media

    main :where(img, video, iframe) { border-radius: var(--border-radius); }

`--border-radius` (7px) — the starting step, the same curve the appearance panel, the search
palette and the prev/next bar use, so media matches the chrome instead of inventing a second one.

`:where()` is doing real work here. It contributes nothing to specificity, so the whole rule
weighs (0,0,1) and anything with an opinion overrides it without `!important` or a longer
selector. A default, not a decree. Scoped to `main`, so it cannot reach the header logo or the
footer icons — both verified at `0px`.

`photo-cover` is excluded on purpose; see the exception above.

## Pill — the one shared control

Brajeshwar, 2026-07-27: *"Create a pill-like component, which we will re-use where needed. For
instance, the one from the Theme Selector."*

A segmented selector: one rounded track, hairline divisions, the chosen segment filled. It was
the appearance panel's private styling until 2026-07-27, when the `/about/` Life/Work filter
needed the same control and the rules were extracted into `.pill` in `chrome.css`.

| Class | Role |
|---|---|
| `.pill` | the track — `inline-flex`, rounded, `overflow: hidden` so segments clip to the ends |
| `.pill__option` | one segment |
| `.pill__marker` | optional dot inside a segment: a ring at rest, solid once chosen |

It lives in `chrome.css` (the base bundle) *because* it is shared. A tier-2 copy would have to
be kept in step by hand, which is the trap `/about/` and `/now/` already sit in for the timeline
— worth it there, where the two are large and never co-loaded; not worth it for ~40 lines.

Three ways to say "on", one set of declarations. The two users drive selection differently,
so `.pill__option[aria-pressed="true"]` (the panel's `<button>`s, set by JS),
`.pill__option--on`, and `:checked + .pill__option` (the filter's real checkboxes, in
`timeline.css`) all land on the same colors. Adding a third user means adding a selector, not a
second look.

The filter uses checkboxes rather than buttons because it has to work with JavaScript off
(guardrail 4) — `:has()` and `:checked` do the filtering, so the pill had to accept a
label-driven mechanism as well as an ARIA-driven one.

⚠️ **The focus ring must be `currentColor`, not `--accent`.** `outline-offset` is negative, so
the ring is drawn inside the segment on its own fill — and a chosen segment's fill is
`--color-primary`, which is near enough to `--accent` that the ring disappears in *both* modes.
This shipped broken in the appearance panel until 2026-07-27. `currentColor` resolves to
`--color-primary-fg` when chosen and `--text-muted` when not, so it always contrasts with what
it sits on. Same trap as the `--bg-color-high` one: two tokens that look unrelated by name and
resolve to the same color.

## Back to Top

Built by `back-to-top.js`, only on a page taller than 2.5 viewports. An arrow in a circle, no
label — the accessible name is on `aria-label`.

Where it is inserted (2026-07-27): before `.post-nav` when there is one, otherwise before
`<footer>`. On a post that gives article → arrow → PREV|NEXT → footer, with the arrow above
the bar and the bar tight to the footer. On every other page it is the last thing before the
footer, as before.

That puts it inside `<main>` on posts, which has two consequences worth knowing:
- `position: sticky` is clamped to `main` instead of `body`. Fine — main spans the whole
  article, far more travel than the control uses, and it settles just above the bar.
- `width: var(--body-width)` (96%) would apply a second time, because main already IS the
  band. Measured 1248 against the band's 1268. `main > .back-to-top-row` takes `width: 100%`
  instead.

The bar has no divider. Two were tried and both were wrong the same way: a `--border-color`
hairline read as a rule drawn *on* the bar, and inverting it to the page background read as a
slit cut *through* it — better, but still a mark asking to be noticed on a control whose job is
to be quiet. Nothing is the right answer. The halves are the same color, so there is no seam
until the pointer is over one, and then the hover tint draws the boundary exactly where it
matters and only while it matters. It also deletes the first/last-post special case: no rule is
left that needs to know how many links there are.

The spacing is one `--space-m` everywhere in that seam — article→arrow, arrow→bar,
bar→footer, all 30px. `.post-nav` carries no margin at all; the row's margin does the first two
and `main:has(.post-nav) ~ footer` does the third.

⚠️ **`~`, not `+`, for that footer rule.** `post.html` emits a `<script>` between `</main>` and
`<footer>`, so they are not adjacent and `+` matched nothing — the footer silently kept its 80px
and the change looked like it had failed.

It floats, then settles. Brajeshwar, 2026-07-27: *"I wanted it to be visible once a user
starts scrolling and beyond certain scroll height. So, this should start floating and then
settle above the footer."* Both halves come from one `position: sticky; bottom: var(--space-l)`
on the row — no fixed/static swap, no measuring on scroll:

- Mid-page the row's own place in the document is far below the fold, so sticky pulls it up to
  `--space-l` off the viewport bottom. It floats, at the band's right edge.
- Near the end that place scrolls into view, no pull is needed, and the row comes to rest where
  it actually lives. The settle is not an effect; it is the row arriving at itself.

Measured: floating at exactly 40px off the viewport bottom mid-page, released to 288px at the
foot of a long post.

JavaScript decides only *whether* it shows — `scrollY > 1 viewport` toggles `.is-visible`,
coalesced into an animation frame. Never where it sits.

Three things this depends on, each non-obvious:

1. `<body>` must not have a definite height. It was `height: 100%`, so the body *box* was
   one viewport tall on every page and content simply overflowed it visibly — nothing looked
   wrong, but a sticky child is clamped to its containing block, so the control could not float
   past the first screen. Now `min-height: 100%` (see `base.css`), which keeps the original
   intent and lets the box grow.
2. The row is `pointer-events: none`, the button `auto`. The row is a full-band-width strip
   lying across the content while it floats; without this it would swallow clicks on the text
   underneath. Verified by hit-testing: a point in the strip 60px left of the button returns the
   article.
3. The button's background is opaque (`--bg-color-lower`, and the hover mixes *into* it
   rather than into `transparent`). A see-through disc with a line of prose crossing it is
   unreadable.

One standard space either side of the settled control — `margin: var(--space-m) auto`.
Retuned 2026-07-27: it was `--space-2xl` above and `--space-m` below, which on a post produced a
182px void between the prev/next bar and the footer. The breakdown is worth keeping, because
three of the four contributors were invisible in the CSS:

    40px  .post-nav's bottom margin — TRAPPED, see below
    80px  this row's --space-2xl top margin
    32px  the control itself
    30px  this row's bottom margin

⚠️ **`.post-nav`'s bottom margin did not collapse away.** `main` is
`container-type: inline-size`, which establishes an independent formatting context, so the last
child's bottom margin is trapped inside it instead of merging with what follows — it *stacked*
with this row's top margin instead of collapsing into it. `.post-nav` now sets
`margin-block: var(--space-l) 0` and leaves the seam to this rule.

Result: 92px, against the 80px a page with no Back to Top already gets from `footer`'s
own `--space-2xl`. Verified the same on a post, `/about/` and `/archives/`.

`.back-to-top-row + footer { margin-top: 0 }` is still required — adjacent margins collapse to
the larger, so the footer's `2xl` would otherwise reopen the gap. `visibility`/`opacity` rather
than `display` for the hide, so the row keeps its box and the footer never jumps as it fades in.

## Every page fills the band

`page.html` no longer wraps content in `.container-ideal` (2026-07-27). Prose is held at the
measure by `page.css` capping the TEXT elements instead, so a grid, table or gallery spans the
full width while paragraphs keep ~66 characters. Structural elements are deliberately absent
from that selector list — that is how a page opts into full width: use something that isn't a
paragraph.

`full: true` in a page's front matter is now inert; the branch it selected is gone.

## Page titles (2026-08-08)

Every page and post title is one element with one class, emitted by the layout rather than
written per page. `page.html` and `album.html` carry the guard; `/archives/` writes its own
because it is the only page on `layout: default`.

| | |
|---|---|
| `.page-title` | uppercase, weight 200, `-0.02em`, `--step-2`. base.css |
| `.vertical-title` | adds the left-gutter spine. base.css, inside `min-width: 1250px` |
| `.spine-only` | spine or nothing — no fallback title. `/archives/` |
| `.post h1.page-title` | `text-transform: none`. post.css |

⚠️ **Condensed is tracking, not a condensed cut.** Neither self-hosted family carries a width
axis — Geist ships `font-weight: 100 900`, Source Serif 4 `200 700`, and there is no `wdth` in
either — so `font-stretch: condensed` computes and does nothing. On uppercase, negative
tracking is the right lever anyway: caps sit on wider sidebearings than lowercase.

⚠️ **The serif reader gets a heavier title** (`[data-font="serif"] .page-title`, weight 300,
tracking 0). Source Serif 4 cannot reach the sans's 200, and what it does reach is a
hairline-contrast serif whose thin strokes drop out at title size.

⚠️ **The spine's rules live entirely inside the media query**, so a narrow screen falls back to
`.page-title` with nothing to undo. It was written the other way first — `display: none` below
the breakpoint — which left six pages with no title at all on a laptop. The breakpoint is the
band plus the spine on both sides: 1024 + 2 × (74 + 5) = 1182, rounded up to the 1250 that
`/archives/`'s year strip already uses.

⚠️ **`container-type` does NOT make `main` a containing block** for absolutely or fixed
positioned children — measured, twice. The spine is `position: fixed` and takes its horizontal
position from the band arithmetic, `calc(50% - var(--body-width-max) / 2)`.

## `--logo-plate` (2026-08-08)

The one token in themes.css that does **not** flip with the theme. It is the ground a brand
logo sits on, on `/own/`. Logos keep their own colours ("just like how we have colorful
photos") — but a photo is opaque and a logo is transparent, so without a plate Peak Design's
black mark was invisible on the dark theme. Near-white rather than `#fff`, and opaque rather
than translucent: at `z-index: -1` a translucent colour composites against whatever is behind.
