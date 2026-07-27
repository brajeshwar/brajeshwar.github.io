# Styles — brajeshwar.com

The **specifics** of the visual system: typography, color & theming, branding, icons, and
how the CSS itself is split. For the *why* behind these choices — the reading-first
philosophy they serve — see [`design.md`](design.md).

> **Golden rule (type):** never hand-pick a font-size, margin, or line-height. Everything
> comes from the scales below (`--step-*`, `--space-*`, `--scale`). Reuse a token, don't
> invent a number.
>
> **Golden rule (color):** no hardcoded colors outside `_includes/css/themes.css`.
> Components reference tokens only. **One** known exception remains: the Pagefind UI vars in
> `search.css`. (syntax highlighting was the other — tokenised 2026-07-19 onto
> `--code-*`; see §5 → *Syntax highlighting*.)

---

# 1. Typography

How type works on the site. Lives in `_includes/css/config.css` (scales, families),
`themes.css` (variable fonts), and `base.css` (headings, rhythm).

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

**Self-hosted fonts** (`themes.css`, bundled `@font-face`, all `font-display: swap` so they
**download only when chosen** — no default-load cost):
- **"Libre Baskerville"** (`assets/fonts/libre-baskerville/*.woff2`, latin subset,
  regular/italic/bold, `size-adjust: 98.5%`) — **the reader "Serif" font** (`[data-font="serif"]`),
  with the system serif stack as its fallback while loading / on failure.
- **"Geist"** (`assets/fonts/geist/Geist-Variable.woff2`, latin subset, **47 KB**) — **the
  reader "Sans-Serif" font** (`[data-font="geist"]`), variable, so one file covers every weight,
  falling back to the system sans stack. Subset from a 169 KB `.ttf` on 2026-07-27, a 72% cut;
  the `.ttf` stays in the repo as the re-subset source and is `exclude`d from the build. The
  regeneration command is in the `themes.css` comment. ⚠️ Any re-subset must keep the variable
  tables — a naive subset flattens the axis and every weight silently becomes 400.

Two webfonts, both optional. Inter was removed earlier.

### The `[data-font]` axis — three panel choices
The panel labels map to values: **System** = `sans` (system stack, **no webfont**, fast),
**Sans-Serif** = `geist`, **Serif** = `serif` (Libre Baskerville).

*"System" was called "Default" until 2026-07-27* (Brajeshwar: *"For the FONT, replace Default
with System"*). It names what the option actually is — the OS UI face — where "Default" said
only that it was the one you get without choosing, which is true of the first option on every
axis and describes none of them. **Label only: the stored value is still `sans`,** so nothing
in `config.css`, the `@font-face` blocks, or the no-flash whitelist changed and no reader's
saved choice needed migrating.
```css
/* config.css */
:root { --font-body: var(--font-sans); }   /* System — no attribute, system sans */
[data-font="sans"]  { --font-body: var(--font-sans); }
[data-font="geist"] { --font-body: "Geist", var(--font-sans); }              /* "Sans-Serif" */
[data-font="serif"] { --font-body: "Libre Baskerville", var(--font-serif); } /* "Serif" */
```

**Geist: dropped 2026-07-19, restored 2026-07-27.** It was removed as a near-duplicate of the
system stack shipping as a **169 KB unsubsetted `.ttf`** — the heaviest asset on the site,
against 84 KB of woff2 for all three Libre Baskerville styles. Brajeshwar re-added the file and
asked for the option back, so the reasoning is recorded rather than deleted: **the size
objection still stands**, and subsetting it to woff2 is an open task in
[`todo.md`](todo.md). It costs nothing unless a reader picks it.

⚠️ **FOUR places must agree for any font option**, and missing the last one is the quiet failure:
1. `AXES.font.opts` — `assets/scripts/appearance.js`
2. the `[data-font="…"]` rule — `config.css`
3. the `@font-face` — `themes.css`
4. **the no-flash whitelist** — `_layouts/default.html`. Without it the choice is not applied
   before first paint, so the page flashes the default font on every load.

**Stale preferences need no migration either way.** `read()` in `appearance.js` validates against
its own option list and falls back to `sans`, so a value no longer offered is simply ignored —
which is why removing and restoring Geist required no migration step in either direction.

### Text size (Kindle-style) — `[data-text-size]`
Five "A" buttons in the appearance panel, growing left → right, default in the middle. Sets
`--text-scale`, which **multiplies the whole type scale for content inside `<main>`** (home
body, pages, articles) — header/footer keep the base scale. Mechanism (`config.css`): the
raw clamps are `--step-N-base`; `:root` aliases `--step-N: var(--step-N-base)` (used by
header/footer), and `main` redefines `--step-N: calc(var(--step-N-base) * var(--text-scale))`.
So every element that uses `--step-*` in content scales automatically — no per-element rules.
Values are **symmetric around the middle**: `xs` 0.85 · `s` 0.925 · **m 1 (default, middle, no attribute)** · `l` 1.075 · `xl` 1.15 (±0.075 / ±0.15). Persisted
as `localStorage('textsize')`; applied before paint by the no-flash snippet.

**Interface vs content (Brajeshwar's model).** The reader's font choice applies to **prose**.
**Interface is pinned to system sans** — and the distinction is what the text IS, not where it
sits: prose is the reader's to set, controls and labels are the site's. Brajeshwar, 2026-07-27:
*"UI Elements such as the PREV | NEXT should always be in the sans-serif system fonts. Making it
serif is weird."*

- `body { font-family: var(--font-body); }` (`base.css`) — the reader's choice flows to home
  body, pages, and articles.
- One rule in `base.css` pins the interface. `header` and `footer` are chrome by position;
  everything else sits inside `main`, inherits `--font-body`, and must **opt out by name**:

      header, footer, .post-nav, .pill, .back-to-top-row { font-family: var(--font-sans); }

- **Sidenotes** (`.sidenote`/`.sidenote-inline`), **captions** (`figcaption`) and **post meta**
  (`.post time`) re-assert sans on top of content — they are labels *about* content, not content.
  Blockquotes **inherit** context.
- Set on `<html>` by `appearance.js`, persisted in `localStorage('font')`, applied before first
  paint by the no-flash snippet (`sans` = no attribute = default).

⚠️ **Add new controls inside `main` to that list.** The failure is silent: it only shows for
readers who picked Serif or Sans-Serif, and the default is System, so casual checking never
surfaces it. `.back-to-top-row` had a `font-family` until it became icon-only and lost it
without anyone noticing — which is why the list exists rather than a rule per component.

> History: `cd3227e0` made posts sans; a Phase-1 draft flipped to serif; then a Reader-style
> Sans/Serif/Mono selector; then the Ovellum font axis (Sans/Serif/Inter/Geist) applied
> site-wide; **now** scoped to article content so the interface is always sans (this section).

## Type scale (fluid, Utopia)
`config.css`, generated at <https://utopia.fyi> (320px @18px/1.2 → 1240px @20px/1.25).
Use these for **every** font-size:

`--step--2` · `--step--1` · `--step-0` (body) · `--step-1` · `--step-2` · `--step-3` · `--step-4` · `--step-5`

Headings (`base.css`): h1 `--step-3` · h2 `--step-2` · h3 `--step-1` · h4 `--step-0` · h5 `--step--1` · h6 `--step--2`, all `font-weight: var(--font-weight-light)`, `line-height: var(--scale-small)`, `text-wrap: pretty`.

## Spacing scale (fluid, Utopia)
`config.css`. Use for **every** margin/padding:

`--space-3xs` … `--space-3xl`, plus one-up pairs (`--space-s-m`, `--space-m-l`, …) for fluid gaps.

## Vertical rhythm & line-height
- Body `line-height: var(--scale)` = `--golden` (1.618) — generous, suits serif reading.
- Headings `line-height: var(--scale-small)` = `--minor-third` (1.2) — tight.
- Modular-scale ratios live in `config.css` (`--golden`, `--minor-third`, `--minor-seventh`, …); the active ones are aliased to `--scale`, `--scale-small`, `--scale-large`.

## Reading measure (character-based)
The reading column is sized by **character count, not pixels** — comfort is a function of
characters per line (see [`design.md`](design.md) → *Comfortable measure*).

```css
/* config.css */
--measure          : 66rch;             /* ~60–70 chars/line target, resolved at the root font */
--body-width-ideal : var(--measure);    /* .container-ideal reading column = the measure */
```
- `.container-ideal { max-width: var(--body-width-ideal); }` (`base.css`) → the reading
  column (~665px). **`rch`, not `ch`**: plain `ch` resolves against each *element's own*
  font-size, so the one token produced different widths at different usage sites (on an
  element carrying `--step-0` ≈ 20px, `66ch` inflates to ~822px; on `figcaption` at
  `--step--1` it shrinks). `rch` resolves against the root (16px system sans), pinning every
  use to the same ~665px column. Trade-offs: the column no longer subtly re-widens when the
  reader picks Serif/Geist (stable is better), and `rch` needs ~2023+ browsers
  (Safari 16.4 / Chrome 111 / Firefox 128).
- Media in the column (`figure`, `img`, video embeds) fits the measure. **Video embeds use
  `aspect-ratio: 16/9`** (`base.css`), not a width-derived pixel height — required now
  that the column width is font-relative.
- `--measure` is the knob: raise toward `70ch` for a looser line, lower toward `62ch` for
  tighter. The sidenote gutter (see [`sidenotes.md`](sidenotes.md)) lives in the space to the
  right of this column.
- **Measured 2026-07-26 (Chrome, built site): `1rch` = 10.08px, so the column is 665px.**
  Don't assume the common ~8px-per-character rule of thumb when doing width arithmetic here —
  it under-estimates this column by about 130px. The 665px figure above is confirmed, not
  approximate. This measurement is what sets the sidenote viewport floor of 1210px
  ([`sidenotes.md`](sidenotes.md)).

## Weights
`--font-weight-lighter` 100 · `--font-weight-light` 200 · `--font-weight` 400 · `--font-weight-bold` 600 · `--font-weight-bolder` 700.

---

# 2. Color & theming

Ported from **Ovellum** (ovellum.oss.oinam.com). All of this lives in `themes.css`.

## Two orthogonal axes (the whole point)
Theming is split into **two independent axes**, both set on `<html>`:

| Axis | Attribute | Values | What it controls |
|---|---|---|---|
| **Mode** | `data-theme` | `auto` (default) · `light` · `dark` | light ↔ dark (appearance) |
| **Palette** | `data-palette` | `default` · `nord` (Cool) · `eink` (Warm = Flexoki) | the colour scheme / hue |

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
   `--text-color-link`) and the short-form semantic tokens (`--bg`, `--text`, `--rule`, `--accent`,
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
    `:root[data-accent][data-accent][data-accent]` rule (in `themes.css`) maps `--ov-accent`
    onto `--color-accent` *and* `--color-primary` (so links, nav pill, logo, primary buttons
    all recolour); hover is a `color-mix` toward `--color-fg`.
- **UI** — `<appearance-settings>` in the header: a trigger button opens a dropdown panel
  (`chrome.css`) with four groups — **Mode**, **Palette**, **Font** (button
  groups, `aria-pressed`) and **Accent** (swatches + custom `<input type=color>`). JS off →
  no panel, defaults render.

## Default = monotone grayscale (locked decision)
The base `:root` palette is **pure zero-chroma gray** (`oklch(L 0 0)`) and the default accent
is gray (`--color-accent: var(--color-gray-900)`) — so the resting site, links included,
carries **no hue**. This is deliberate (see [`design.md`](design.md) → *Monotone by default*);
keep it monotone. Colour is opt-in only, via a tinted palette or the accent axis.

## Links & contrast
Because the default is monotone, **link affordance is the underline, not colour**
(`base.css`): `a { text-decoration: underline; text-decoration-color: var(--text-color-lower); }`
quiet at rest, thickening to `--text-color` on hover/focus. Target body contrast **WCAG AA+**
(4.5:1, toward 7:1). Don't push muted grays below legible contrast — `--text-color-low` /
`-lower` are for hierarchy, not for hiding text.

The text tiers were **darkened one step for higher overall contrast** (Brajeshwar): in light,
`--color-fg` gray-900 → **gray-950**, `--color-fg-muted` gray-700 → **gray-800**,
`--color-fg-subtle` gray-500 → **gray-600**; in dark (both `[data-theme=dark]` and the
`auto` media query), the same tiers move brighter (`--color-fg` gray-100 → **gray-50**,
`-muted` gray-300 → **gray-200**, `-subtle` gray-500 → **gray-400**). Backgrounds unchanged.
Because these are semantic tokens over the re-tinted scale, **every palette inherits the bump**.

## Palettes (source values in `themes.css`)
Three panel choices (Brajeshwar trimmed from five; Flexoki + Solarized removed):
- **Default** (`default`) — **monotone grayscale** (the base `:root`); the resting theme.
- **Cool** (`nord`) — cool blue-slate (Nord).
- **Warm** (`eink`) — **[Flexoki](https://github.com/kepano/flexoki)** since 2026-07-27, at
  Brajeshwar's request. Ink on paper: `#FFFCF0` light, `#100F0F` dark. It replaced a
  hand-rolled sepia ramp. The attribute value stays `eink` deliberately — changing it would
  invalidate every reader's saved `localStorage('palette')` for no visible gain.

Each tinted palette redefines `--color-gray-*` + `--color-surface` + accent; nord tunes its dark
accent. All inherit the contrast bump above via the semantic layer.

**Warm is the one palette written in hex, not `oklch`** — those are upstream's published values
copied verbatim from `kepano/flexoki`, so they can be diffed against it; converting would round
every one and lose that. The site's scale has 11 steps to Flexoki's 15, so base-150/-800/-850/
-950 get no slot; each line in `themes.css` names the step it came from.

**Warm needs its own dark mixin** (`eink-dark-semantics`), because Flexoki's dark form is not
the generic dark remap applied to a warm ramp — it puts the page on `black` and the text on
base-200, where the shared mixin would have given base-900 with paper-white text. Mappings are
kepano's own (`vitepress/index.css`): bg→black, bg-elv→base-900, tx→base-200, tx-2→base-500.

One deliberate divergence, in both modes: **Flexoki's `tx-3` is too faint for what this site
spends it on.** base-300 measures 2.00:1 on paper — right for the hairlines it is meant for,
unreadable for sidenote body text. `--color-fg-subtle` is stepped one notch to base-600
(4.97:1 light) / base-500 (5.19:1 dark), the same bump the default palette already makes.

## Verified (live, 1440px)
- [x] Default = light, neutral, sans — bg `gray-100`, fg `gray-900`.
- [x] Nord + Dark + Geist → Nord-dark slate bg, light fg, Geist body font; panel shows all three pressed.
- [x] Persisted across reload via no-flash (no flash; `data-theme/palette/font` reapplied before paint).
- [x] Builds clean; inlined CSS ~29 KB raw (budget is now **≤ 13 KB gzipped** per page — see [`memory.md`](memory.md)).

## Iterate-later
- Migrate components off the legacy bridge onto `--color-*` directly (cleanup, optional).

> **Accent** = five swatches (**Default + Blue/Green/Amber/Red**), on the "Accent" row of the
> panel grid like every other control; no custom colour picker. Set via `applyAccent`
> → inline `--ov-accent` + `data-accent="custom"`, persisted as `localStorage('accent')`.
> **Panel controls are segmented pills** — see *Pill* in §6, which is now a shared component
> rather than something the panel owns.
>
> **Panel layout is a two-column grid** (2026-07-27): labels in column 1, controls in column 2,
> set on `.appearance-panel` itself with `.appearance-group { display: contents }`. Rows used to
> lay themselves out, which let every control start at a different x. There is no
> `.appearance-group--inline` any more.

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

---

# 5. CSS architecture — bundles, layouts, tiers

How CSS is split, which layout pulls which bundle, and the rules for adding more.
Theming — mode × palette × font × accent — is §2 above; the byte budget lives in
[`design.md`](design.md) → *Performance budget*.

**Decided 2026-07-19.** Supersedes the ad-hoc mix of `styles:` keys that had grown up to
that point. Folded into this doc on 2026-07-26, from what used to be `css-architecture.md`.

## The principle
Embed everything — no external stylesheet, no extra request. At 6–7 KB gzip the inlined
CSS rides along in the same round trip as the HTML, which beats a cacheable external file
for a site whose traffic is mostly first-time arrivals on a single post.

Split by **layout**, not by page. A page-specific bundle is the exception, not the pattern.
The failure mode we're avoiding is CSS scattered across twenty opt-in keys where nobody can
tell what ships where.

## The files
**Flattened 2026-07-19** from 25 numbered ITCSS partials to 12 plainly-named files (**13 today**
— `timeline.css` was added with the `/about/` rework). The numbering
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
+ `styles-album.html` + `album.css`, with per-collection differences left on the `style:`
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
| `post.css` | 4.8 KB | ~~**Syntax highlighting is monochrome site-wide.**~~ **FIXED 2026-07-19** — see *Syntax highlighting* below. Affected 55 posts. |
| `4.1-pages-books.css` | 850 B | **Correction (2026-07-19):** not a rendering bug. The file is a **byte-for-byte copy of `4.1-pages-film.css`** and contains no `page-books` selectors at all — `/books/` is a prose page on `layout: page` that needs no gallery CSS and renders fine. Pure dead weight. Deleted. |
| `4.1-pages-bookmarks.css` | 781 B | No page references it; likely dead since a past restructure. |

Also: `4.1-pages.css` is **0 bytes**, so the `layout: page` tier currently adds nothing —
harmless, but it means tier 1 for pages is a placeholder rather than a working bundle.

And `_pages/devices.html` sets `style: page-devices`, but its selectors live inside
`4.1-pages-film.css`, which only `film.html` loads — so `/devices/` is unstyled too.

The `album` consolidation fixes books, devices, and film together.
`4.1-pages-bookmarks.css` needs a confirm-then-delete.

## Syntax highlighting (fixed 2026-07-19)
`post.css` was the upstream pygments **"native"** theme: ~100 hardcoded hex values and its
own fixed dark slab, theme-blind. Wiring it in unchanged would have put a dark block on every
page regardless of the reader's mode or palette — wrong for a site built around reader-chosen
theming. So it was tokenised instead:

- **New `--code-*` tokens in `themes.css`.** Light and dark share one hue per token role and
  differ only in `--code-l` (lightness), so dark mode is a single-line flip rather than a
  duplicated palette. Chroma is one knob too: **`--code-c: 0` makes code fully monotone**,
  differentiating by weight/italic/underline alone — the setting most true to the monotone
  default, kept as an easy switch.
- **`post.css` references only those tokens.** Selectors grouped by role, so the file went
  4.8 KB → 3.6 KB while covering more classes.
- **Added `c1`, `cd`, `s1`, `s2`** — Rouge emits these, the upstream pygments file didn't have
  them, so single-line comments (43×) and single/double-quoted strings (108×) were rendering as
  plain code. All 33 classes the site actually emits are now covered.
- **Dropped the `.err` background box.** Rouge flags `err` on valid 2002-era ActionScript
  (33 spans across 5 posts, all false positives); a highlighted box drew the eye to a lexer
  artifact. A colour tint remains.

Verified in-browser, light and dark, at 1440px. Contrast on the code background: light ≥ 5.68:1,
dark ≥ 7.66:1, nord-dark ≥ 5.92:1, eink-light ≥ 4.49:1. *The eink-light figure is from the old
sepia ramp; the Flexoki palette that replaced it on 2026-07-27 raised `--color-fg-subtle` to
4.97:1, so code comments in Warm-light now clear AA. Re-measure the rest of this line if it
ever matters.*

Cost: the `--code-*` tokens live in `themes.css`, which is base, so every page carries them
(+0.18 KB gzip on the homepage) even though only 55 posts have code. Kept there anyway — the
guardrail puts colour in `themes.css`, and it's where you'd look for them.

## Audit + cleanup, 2026-07-19
A pass over all 12 files, checking every selector against real markup and every custom
property against real `var()` reads. **−2,012 B raw / −0.35 KB gzip on every page**
(−2,571 B on `/search/`). Roughly 2.9 MB across the site.

### Bugs fixed
- **Palette + auto-dark hung on source order.** `:root[data-theme="auto"]` is specificity
  (0,2,0) — exactly tied with `:root[data-palette="eink"]`, which sets a *light*
  `--color-surface`. It won only because it appeared later in the file. Reordering the
  palettes, splitting `themes.css`, or shuffling `styles.html` would have silently given
  eink/nord readers a light surface in dark mode. The explicit-dark branch always carried a
  `[data-palette]` guard; auto did not. Both do now, so it is settled on specificity.
- **The two dark branches are now SCSS mixins.** Dark has to be written twice (a media query
  can't merge with a bare selector), and the copies were identical only by luck. The values
  now exist once; drift is structurally impossible. Merging the two `@media` wrappers paid
  for the added selector — net **+1 byte**.
- **`search.css` referenced seven tokens that don't exist.** `--link-color`, `--accent-color`,
  `--text-color-muted`, `--text-color-secondary`, `--highlight-bg`, `--highlight-text`,
  `--bg-color-medium` are declared nowhere, so every one fell through to a hardcoded hex and
  the search UI ignored the reader's theme entirely. Repointed at real tokens; verified in-browser
  that light/dark now invert and eink yields warm cream instead of `#fff`.
- **`search.css` leaked into global `mark`.** An unscoped `mark` rule repainted *every* `<mark>`
  on `/search/`, not just search hits. Scoped to `.pagefind-ui`. A second, earlier `mark` rule
  was fully overridden by it — dead, removed.

### Dead weight removed (all verified, not guessed)
- **28 custom properties in `config.css`** — Utopia one-up pairs and `--space-3xl` (never
  referenced), `--display-*` (dead *and* a hand-synced duplicate of `$breakpoint-*`), unused
  border/radius/weight variants, `--icon-size`, `--image-width-full`, `--scale-large` +
  `--minor-seventh`, `--space-small`/`--space-smallest`, `--phi` (a duplicate of `--golden`).
- **7 semantic tokens in `themes.css`** (16 declaration sites) — `--color-accent-fg` alone was
  assigned in six places and read in none.
- **Empty rulesets** in `base.css`, `home.css`, `post.css`. Zero byte impact (compression drops
  them) but pure source noise.
- **All hardcoded colour** outside `themes.css`. `search.css` was the last documented exception;
  **there are now zero exceptions.**

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
0. **Put an `@media` override AFTER the rules it overrides.** These files are full of bare
   element selectors (`header`, `site-nav`, `page-archives table`), so a media block competing
   with one has *equal specificity* and loses on source order. The failure is quiet and
   partial: custom-property overrides inside the block still apply, because those cascade by
   inheritance — so sizes driven by tokens change while `font-size`, `padding` and `gap` do
   not, and it reads as "mostly working". Cost the header rework a horizontal-scroll bug on
   phones (2026-07-27); see [`memory.md`](memory.md).
1. **Default to a tier-1 layout bundle.** New page type → new layout → one bundle.
2. **Adding to base needs a reason.** It costs every page. Re-measure gzip after.
3. **Tier 2 is for one-offs only** — a page nothing else resembles.
4. **Every partial must be reachable.** If nothing includes it, delete it or wire it up;
   the orphans above are what happens otherwise.
5. **Re-measure after any bundle change** — budget is ≤ 13 KB gzip per page.

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

**Timeline is a shared look with no shared file.** `/about/` uses `timeline.css` on hand-written
markup; `/now/` uses `now.css` on what kramdown emits from `now/*.md`. The rules are deliberate
copies — both are tier-2 bundles never loaded together, so sharing means promoting to
`base.css` and charging ~1,456 pages for two. **Keep them in step.** If a third page ever wants
the timeline, that is the point to extract a real layout instead.

**Album is available to any page.** The grid (`ul.item__cards`) lives in `base.css`; the card
treatment is `album.css`, loaded by `_layouts/album.html`. To give a page thumbnails: switch it
to `layout: album` and emit `<ul class="item__cards">`. `/books/`, `/photos/` and `/wear/` are
candidates when they have images — none has thumbnail data yet, so none was converted.

## Breaking out of the reading column — RIGHT ONLY

Brajeshwar, 2026-07-27: *"No contents cannot go beyond the left container. If we are extending
it, then we will do it to the right, so it is still within the body width."*

Wide media keeps the article's **left edge** — the same line the prose, the header rule and the
footer rule all start from — and grows **right**, stopping at the content band. It never enters
the left margin and never exceeds the site width.

    margin-inline: 0;      /* keep the left edge */
    width: 100cqi;         /* grow right, to the band and no further */

`100cqi`, not `100vw`. `main` declares `container: main / inline-size`, so inside an article
`1cqi` is 1% of **the band** — exactly the box these should fill. No viewport arithmetic, so it
cannot drift when the site width changes, and it does not have to know about scrollbars (100vw
includes them, 100cqi does not).

What it replaced: `margin-inline: calc(50% - 50vw); width: 100vw; transform: translateX(calc(50vw
- 50%))` — viewport-wide and re-centred, so it spilled equally into **both** margins.

**Everything that takes the band:** `figure.full` / `img.full`, `figure.large` / `img.large`
(identical since 2026-07-27 — the 960px middle step is gone), `.gallery`, the **post title**
(`.post h1`), `figcaption`, and `.post-nav`. Verified: one distinct right edge across header,
footer, `main`, title, image, caption and nav.

⚠️ **`photo-cover` cannot use `cqi`.** `post.html` emits it before `<main>`, so it is a `<body>`
child with no container ancestor and `cqi` falls back to the viewport — the full-bleed this rule
exists to prevent. It carries the band's own three lines instead (`--body-width` /
`--body-width-max` / `margin-inline: auto`), **which must be kept in step with `main` by hand.**

⚠️ **Wide media now sits in the sidenote gutter.** `sidenotes.js` `collectObstacles()` looks for
`.full, .large, .gallery` and pushes overlapping notes below them — see
[`sidenotes.md`](sidenotes.md) for the timing trap that came with it.

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

**Three ways to say "on", one set of declarations.** The two users drive selection differently,
so `.pill__option[aria-pressed="true"]` (the panel's `<button>`s, set by JS),
`.pill__option--on`, and `:checked + .pill__option` (the filter's real checkboxes, in
`timeline.css`) all land on the same colours. Adding a third user means adding a selector, not a
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
resolve to the same colour.

## Back to Top

Built by `back-to-top.js`, only on a page taller than 2.5 viewports. An arrow in a circle, no
label — the accessible name is on `aria-label`.

**Where it is inserted (2026-07-27):** before `.post-nav` when there is one, otherwise before
`<footer>`. On a post that gives **article → arrow → PREV|NEXT → footer**, with the arrow above
the bar and the bar tight to the footer. On every other page it is the last thing before the
footer, as before.

That puts it inside `<main>` on posts, which has two consequences worth knowing:
- **`position: sticky` is clamped to `main` instead of `body`.** Fine — main spans the whole
  article, far more travel than the control uses, and it settles just above the bar.
- **`width: var(--body-width)` (96%) would apply a second time**, because main already IS the
  band. Measured 1248 against the band's 1268. `main > .back-to-top-row` takes `width: 100%`
  instead.

**The bar has no divider.** Two were tried and both were wrong the same way: a `--border-color`
hairline read as a rule drawn *on* the bar, and inverting it to the page background read as a
slit cut *through* it — better, but still a mark asking to be noticed on a control whose job is
to be quiet. Nothing is the right answer. The halves are the same colour, so there is no seam
until the pointer is over one, and then the hover tint draws the boundary exactly where it
matters and only while it matters. It also deletes the first/last-post special case: no rule is
left that needs to know how many links there are.

**The spacing is one `--space-m` everywhere in that seam** — article→arrow, arrow→bar,
bar→footer, all 30px. `.post-nav` carries no margin at all; the row's margin does the first two
and `main:has(.post-nav) ~ footer` does the third.

⚠️ **`~`, not `+`, for that footer rule.** `post.html` emits a `<script>` between `</main>` and
`<footer>`, so they are not adjacent and `+` matched nothing — the footer silently kept its 80px
and the change looked like it had failed.

**It floats, then settles.** Brajeshwar, 2026-07-27: *"I wanted it to be visible once a user
starts scrolling and beyond certain scroll height. So, this should start floating and then
settle above the footer."* Both halves come from one `position: sticky; bottom: var(--space-l)`
on the row — no fixed/static swap, no measuring on scroll:

- Mid-page the row's own place in the document is far below the fold, so sticky pulls it up to
  `--space-l` off the viewport bottom. It floats, at the band's right edge.
- Near the end that place scrolls into view, no pull is needed, and the row comes to rest where
  it actually lives. **The settle is not an effect; it is the row arriving at itself.**

Measured: floating at exactly 40px off the viewport bottom mid-page, released to 288px at the
foot of a long post.

JavaScript decides only *whether* it shows — `scrollY > 1 viewport` toggles `.is-visible`,
coalesced into an animation frame. Never where it sits.

Three things this depends on, each non-obvious:

1. **`<body>` must not have a definite height.** It was `height: 100%`, so the body *box* was
   one viewport tall on every page and content simply overflowed it visibly — nothing looked
   wrong, but a sticky child is clamped to its containing block, so the control could not float
   past the first screen. Now `min-height: 100%` (see `base.css`), which keeps the original
   intent and lets the box grow.
2. **The row is `pointer-events: none`, the button `auto`.** The row is a full-band-width strip
   lying across the content while it floats; without this it would swallow clicks on the text
   underneath. Verified by hit-testing: a point in the strip 60px left of the button returns the
   article.
3. **The button's background is opaque** (`--bg-color-lower`, and the hover mixes *into* it
   rather than into `transparent`). A see-through disc with a line of prose crossing it is
   unreadable.

**One standard space either side of the settled control** — `margin: var(--space-m) auto`.
Retuned 2026-07-27: it was `--space-2xl` above and `--space-m` below, which on a post produced a
**182px void** between the prev/next bar and the footer. The breakdown is worth keeping, because
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

Result: **92px**, against the **80px** a page with no Back to Top already gets from `footer`'s
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
