# v2027 — Inspirations

A running list of sites and pages whose article-layout craft informs the v2027 redesign.
These are north stars for *reference, not copying* (see SPEC §4). Each entry records what the
page actually does (verified against its shipped HTML/CSS, not from memory), what we want to
borrow, and what we admire but must not adopt because it conflicts with our guardrails.

The SPEC's original north stars — Tufte CSS, Yale e360, BBC, The Walrus, iDiallo,
Simon Willison's archives — still stand; this file collects the deeper studies.

---

## Aresluna — "Show Your Hands, Honor" (Marcin Wichary)

<https://aresluna.org/show-your-hands-honor/>

The benchmark for our individual article pages. Notes below are from reading the page's
served markup and stylesheets (`site/main.css`, July 2026).

### How it is built

**One generous reading column.** The text column (he calls it the "chute") is
`max-width: 850px` on large screens, 700px on mid, with 36px margins (24px small). Wider
than a classic 65ch measure — it works because the type is large.

**Large, confident type.** Base body is 24px/34px on large viewports, 20px/27px on medium.
Headings are oversized: an "epic" h1 at 88px, h1 at 60px, h2 at 48px. Captions/notes drop to
18px. Spacing, not rules or boxes, separates sections.

**Serif body, contrasting note face.** Body is set in *Selectric Century* (his own serif
digitization of the IBM Selectric typewriter face); sidenotes and captions switch to a
different face (*Selectric UN*) at caption size with slight letter-spacing. The note voice is
distinct from the body voice — not just smaller body text.

**Footnotes live in the right margin.** Inline references are `.footnote-hook` elements whose
number is painted by CSS (`content: attr(data-footnote-count)`); the notes themselves sit in
an absolutely positioned `.footnote-container` in the right gutter, aligned near their
references. Structurally the same idea as our SPEC §sidenotes: real notes in markup, margin
placement as presentation.

**Hover cross-focus.** Hovering a reference sets `body.footnote-hovering` and dims every
other note and hook except the matching pair — the eye is guided to exactly one note.

**Narrow screens degrade deliberately.** Below 768px the margin container is hidden and the
note instead appears as a full-bleed inline panel (thin top/bottom borders, background fill)
right at the reference — reveal-in-place rather than jump-to-foot.

**A width vocabulary for figures.** Figures pick from a scale — `width-chute-narrow`,
`width-chute`, `width-aside`, `width-super-aside` — so images can sit narrower than the text,
match it, or bleed into the gutters. Aspect-ratio placeholder classes reserve space and
prevent layout shift; images zoom into a "theatre" overlay.

**A left-gutter table of contents** (~250–300px) accompanies long essays.

**Personality in the margins of the system**: custom cursors, pixel fonts for small UI
accents, a glossary delivered through the same footnote mechanism.

### Borrow for v2027

- **Note-voice contrast.** Sidenotes in a distinct size (ours: slightly *larger* relative
  presence than typical Tufte-style notes — already implemented and working) so they read as
  a second voice, not shrunken body text.
- **Hover cross-highlight** between a footnote reference and its sidenote, and the
  dim-the-rest focus effect. Pure JS/CSS enhancement; no markup changes.
- **Reveal-in-place on narrow screens** — tapping a reference opens the note inline near it,
  instead of only linking down to the footnote block. (SPEC §sidenotes already allows this
  "optionally"; this page is the proof it's worth doing.)
- **Type-scale confidence.** Larger base body size and genuinely big headings; let white
  space do the structural work.
- **Layout-shift discipline** around figures (reserve aspect ratio before images load).

### Admire, don't adopt

- **Custom self-hosted fonts** (Selectric Century/UN, Pantograph, pixel faces). We stay on
  Modern Font Stacks / system fonts per SPEC §4.1.
- **Per-figure width classes** require authoring markup per post. Our content is frozen —
  any figure treatment must come from CSS applied to existing markup only.
- **CSS-painted footnote numbers** (`content: attr(...)`) — ours must remain real text in
  real `sup`/`li` elements so the no-JS page keeps working footnotes (guardrail 4/5).
- **Left-gutter TOC** — out of scope for v2027; most posts are short.

---

## Yale Environment 360 — article craft

<https://e360.yale.edu>

The reference for a **simple, well-done single-article page**. What to borrow:

- **Clean blockquotes** — no background box; enough separation from the body to register its
  presence without ornament.
- **Restrained figures** — the `<figure>` and its image sit well together; the caption is part
  of the picture content without special treatment.
- **Multi-image split views** — tidy side-by-side image rows.

Example articles studied:
- [Why U.S. Geothermal May Advance, Despite Political Headwinds](https://e360.yale.edu/features/united-states-geothermal-republican-spending-bill)
- [In War Zones, a Race to Save Key Seeds Needed to Feed the World](https://e360.yale.edu/features/seed-banks-war-palestine-ukraine-sudan-syria)
- [Cambodian Forest Defenders at Risk for Exposing Illegal Logging](https://e360.yale.edu/features/preah-roka-prey-lang-logging)
- [How Restored Wetlands Can Protect Europe from Russian Invasion](https://e360.yale.edu/features/europe-wetland-defense)
- [The 'Green' Aviation Fuel That Would Increase Carbon Emissions](https://e360.yale.edu/features/corn-soy-biofuel-aviation-congress)

## BBC — single articles

<https://www.bbc.com>

Also admired for their single-article pages. Example articles:
- [The Salvadoran beach town that became a Bitcoin testbed](https://www.bbc.com/travel/article/20250625-the-beach-town-that-became-a-bitcoin-testbed)
- [How hygienic are public swimming pools really?](https://www.bbc.com/future/article/20250630-how-hygienic-are-public-swimming-pools-really)
- [Ten things to know about veganism in childhood](https://www.bbc.com/future/article/20250627-10-things-to-know-about-veganism-in-childhood)
- ['Notable' rise in dads over 60 in England and Wales](https://www.bbc.com/news/articles/cd0vvr9j1dxo)
- [Head bans smartphones in favour of 'brick' phones](https://www.bbc.com/news/articles/cn7ddy8mpl1o)

## The Walrus — typographic spacing

<https://thewalrus.ca>

Look at how the **typographic spacing plays brilliantly without needing anything
supplemental** — no rules, no boxes, just rhythm. Example articles:
- [How I Solved the Century-Old Mystery of a Miraculous Shipwreck Survivor](https://thewalrus.ca/empress-of-ireland-survivor-mystery/)
- [Greenland Has Been Fighting Off Americans for Over a Century](https://thewalrus.ca/greenland-has-been-fighting-off-americans-for-over-a-century/)