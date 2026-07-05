# Design — brajeshwar.com

My design philosophy for the site: the *why* behind the choices. The concrete
implementation of these ideas — the tokens, scales, palettes, and fonts — lives in
[`styles.md`](styles.md). The article-craft studies that inform the look live in
[`v2027/inspirations.md`](v2027/inspirations.md). The redesign brief and guardrails are
in [`v2027/spec.md`](v2027/spec.md).

## Text first
Default to **text as the main content**. Media — images, video, audio — is used only when
needed, and it should be **ornamental**: if it fails to load or isn't there, the page must
still read and work almost every time. Twenty-five years of posts (2001–2026) prove the
durable part is the writing; the design serves the reading.

## Reading-first, ornament-free
Let **spacing and typography do the work**, not rules, boxes, or decoration. A clean
blockquote with clear separation beats a boxed one. Restrained figures and quiet captions
beat heavy treatments. Identity comes from typographic rhythm and restraint, not chrome.
This is the ethos borrowed from the sites studied in
[`v2027/inspirations.md`](v2027/inspirations.md) (Yale e360, BBC, The Walrus, Tufte, Aresluna).

## Monotone by default, colour is opt-in
The **default theme is monotone grayscale** — a zero-chroma gray scale, and even the accent
(links, nav pill, logo) is gray, not a hue. Colour is never the default; it's something a
reader *chooses*: a tinted palette (eink / flexoki / nord / solarized) or a custom accent via
the appearance panel. This keeps the resting site calm and print-like, and forces the design
to work in pure value contrast before any colour is added. Implementation + how to keep it
monotone: [`styles.md`](styles.md) §2.

## Contrast & legibility
Aim for **strong, comfortable contrast** — body text should clear WCAG **AA** (4.5:1) and
ideally approach **AAA** (7:1) for long-form reading. Because the default is monotone,
**colour can't carry meaning** — so affordance rides on other signals:
- **Links are underlined**, always, not merely a different shade. The underline is quiet at
  rest (a muted decoration colour) and strengthens on hover/focus. A reader must never have
  to guess what's a link.
- Emphasis comes from **weight and space**, not colour.
- Keep muted/subtle grays honestly readable — "muted" is for hierarchy, not for hiding text
  below a legible contrast ratio.

## Comfortable measure (reading width by character count)
Reading comfort is a function of **characters per line, not pixels**. The reading column is
sized in `ch` (the `--measure` token, ~**66ch**, targeting the classic **60–70 characters**
per line), so the measure stays comfortable as the body font or reader's font choice changes,
instead of being a fixed pixel width that drifts too wide on large type. Media inside the
column fits the measure; the text is never wider than it should be to read. Token + specifics:
[`styles.md`](styles.md) §1.

## Decoupled, portable styles
Think of the styles as **simple, common, and decoupled** so they can be embedded anywhere
with specific overrides. The goal: a single article should be able to stand on its own
outside the full site build. Today Jekyll practically builds everything; a portable style
layer keeps a future move (e.g. **Pandoc + Make** building individual articles while leaving
other files alone) cheap. Concretely: media (audio, pictures, video) share a **common style**
for easy treatment, and alignment (captions and other mostly-text objects: left default,
center, right) comes from **utility classes** rather than bespoke per-object rules.

## Progressive enhancement, always
The site must be **fully usable with JavaScript disabled** — real footnotes at the article
foot, a sensible default theme, every link working. JS only *enhances*: sidenotes in the
margin, theme/font persistence, in-place search. This is also what keeps the ~1,463
historical posts (most with no front matter) from ever breaking. The hard rules that follow
from this are the guardrails in [`v2027/spec.md`](v2027/spec.md) §2.

## Performance budget — default page load under 100 KB
The homepage and any non-article page should load in **under 100 KB total** (all resources,
uncompressed). Article pages are exempt — their weight is their content's, and that's fine.
This is a hard target, and the site already meets it comfortably; the discipline is about
*staying* there. What keeps it light:

- **Text-first, no hero images.** The homepage carries zero images by default (see *Text
  first*). Media is added only where it earns its place.
- **Inline over fetch.** Critical CSS is inlined into `<head>` (one payload, no blocking
  request). Icons are **inline SVG**, not an icon font or sprite fetch (see [`styles.md`](styles.md)
  §3). Prefer embedding a few KB over adding a round-trip.
- **System fonts by default.** The default body font is the system stack — **0 bytes** of
  webfont. Self-hosted fonts (Inter / Geist / Libre Baskerville) download **only if a reader
  picks them**, never on a default load.
- **Only the JS a page needs.** Vanilla, `defer`, and small. Scripts that only matter on
  articles (e.g. sidenotes) shouldn't tax a homepage — scope where practical.
- **Watch third-party.** Every external script is a request and a dependency; keep them
  minimal (currently one small analytics beacon).

Current measured homepage (built): **~48 KB** HTML uncompressed (**~13 KB** gzip) with **~31 KB**
of that being the inlined critical CSS, plus **~20 KB** of first-party JS — well inside budget.
The inlined-CSS sub-budget is **≤ 42 KB** (see [`memory.md`](memory.md)). Re-measure when adding
anything to the base bundle.

## Reader's choice
Appearance is the reader's to set, Kindle/Reader-style: **theme** (mode × palette), **font**,
and **accent** all persist across visits. Defaults are calm and neutral; the controls are
there for those who want warmer, darker, or higher-contrast reading. See [`styles.md`](styles.md)
for the axes.

## Future directions (philosophy, not committed scope)
- A **microblog / "jottings"** stream: short posts surfaced on the homepage with their own
  dedicated stream elsewhere — in the spirit of Mastodon and [Jottings](https://jottings.me).
- **Home as text**: reduce the homepage to writing; turn Books into a short "top rereads"
  list rather than a gallery.

These are directions, not deliverables — tracked, where actionable, in [`todo.md`](todo.md).
