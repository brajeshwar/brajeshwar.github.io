# Design — brajeshwar.com

My design philosophy for the site: the *why* behind the choices. The concrete
implementation of these ideas — the tokens, scales, palettes, and fonts — lives in
[`styles.md`](styles.md). The article-craft studies that inform the look live in
[`inspirations.md`](inspirations.md). The hard guardrails live in
[`../CLAUDE.md`](../CLAUDE.md).

## The ethos (stated 2026-07-28)
Clean, minimal, with subtle details that say luxury at its finest. Every element, every
piece is thought through: nothing arbitrary, nothing default. Luxury here is not ornament —
it lives in the quiet things: spacing, typography, rhythm, and the small details a reader
feels but never notices. Prefer removing over adding. When in doubt, wait; restraint ages
better than trend.

This marks the start of a redesign with no year in mind and no finish line. The site evolves
in small, considered steps, each change defensible on its own. Everything below is this
ethos applied.

## Text first
Default to text as the main content. Media — images, video, audio — is used only when
needed, and it should be ornamental: if it fails to load or isn't there, the page must
still read and work almost every time. Twenty-five years of posts (2001–2026) prove the
durable part is the writing; the design serves the reading.

## Reading-first, ornament-free
Let spacing and typography do the work, not rules, boxes, or decoration. A clean blockquote
with clear separation beats a boxed one; restrained figures and quiet captions beat heavy
treatments. Identity comes from typographic rhythm and restraint, not chrome. This is the
ethos borrowed from the sites studied in [`inspirations.md`](inspirations.md) (Yale e360,
BBC, The Walrus, Tufte, Aresluna).

## Monotone by default, colour is opt-in
The default theme is monotone grayscale — a zero-chroma gray scale, where even the accent
(links, nav pill, logo) is gray, not a hue. Colour is never the default; it is something a
reader *chooses*: a tinted palette (Cool = Nord, Warm = Flexoki) or a custom accent via the
appearance panel. Even the tinted palettes keep a monotone accent — Flexoki ships eight
accent hues and Warm uses none of them, because hue on this site belongs to the Accent
axis. This keeps the resting site calm and print-like, and forces the design to work in
pure value contrast before any colour is added. Implementation, and how to keep it
monotone, is in [`styles.md`](styles.md) §2.

## Contrast & legibility
Aim for strong, comfortable contrast: body text should clear WCAG AA (4.5:1) and ideally
approach AAA (7:1) for long-form reading. Because the default is monotone, colour cannot
carry meaning, so affordance rides on other signals. Links are underlined, always, not
merely a different shade — the underline is quiet at rest (a muted decoration colour) and
strengthens on hover and focus, so a reader never has to guess what is a link. Emphasis
comes from weight and space, not colour. And muted, subtle grays must stay honestly
readable: muted is for hierarchy, not for hiding text below a legible contrast ratio.

## Comfortable measure (reading width by character count)
Reading comfort is a function of characters per line, not pixels. The reading column is
sized in `ch` (the `--measure` token, ~66ch, targeting the classic 60–70 characters per
line), so the measure stays comfortable as the body font or the reader's font choice
changes, instead of being a fixed pixel width that drifts too wide on large type. Media
inside the column fits the measure; the text is never wider than it should be to read.
The token and specifics are in [`styles.md`](styles.md) §1.

## Decoupled, portable styles
Think of the styles as simple, common, and decoupled, so they can be embedded anywhere with
specific overrides. The goal: a single article should be able to stand on its own outside
the full site build. Today Jekyll practically builds everything; a portable style layer
keeps a future move (say, Pandoc + Make building individual articles while leaving other
files alone) cheap. Concretely, media — audio, pictures, video — share a common style for
easy treatment, and alignment (captions and other mostly-text objects: left default,
center, right) comes from utility classes rather than bespoke per-object rules.

## Progressive enhancement, always
The site must be fully usable with JavaScript disabled: real footnotes at the article foot,
a sensible default theme, every link working. JS only *enhances* — sidenotes in the margin,
theme and font persistence, in-place search. This is also what keeps the ~1,456 historical
posts (most with no front matter) from ever breaking. The hard rules that follow from this
are the guardrails in [`../CLAUDE.md`](../CLAUDE.md).

## Performance budget — default page load under 100 KB
The homepage should load in under 100 KB total (all resources, uncompressed). This is a
hard target, and the site meets it comfortably; the discipline is about *staying* there.

Scope, revised 2026-07-27 (Brajeshwar): the budget covers the homepage and articles. It
does not cover listing pages — `/archives/` today, and `/books/`, `/film/` and others in
future. A listing's weight *is* its content, the same argument that already exempted
articles: an index of 1,456 posts cannot be small, and making it small would mean showing
less of what the page exists to show. `/archives/` sits at ~329 KB raw / ~74 KB gzip and
that is accepted, not tolerated. (The previous wording said "any non-article page", which
would have made every listing page a permanent budget failure.) Articles are exempt from
the byte target for the same reason, but not from the discipline — the CSS sub-budget below
applies to every page, listings included.

What keeps things light. The site is text-first with no hero images: the homepage carries
zero images by default, and media is added only where it earns its place. Prefer inlining
over fetching — icons are inline SVG, not an icon font or a sprite fetch (see
[`styles.md`](styles.md) §3); embedding a few KB beats adding a round-trip. CSS is the
documented exception since 2026-07-27: `/assets/*` is served `max-age=31536000`, so one
external stylesheet is fetched once and is then free on every page for a year, where
inlining re-sent it with every view and could never be cached — break-even is under two
page views ([`styles.md`](styles.md) §5). The default body font is the system stack, zero
bytes of webfont; self-hosted fonts (Libre Baskerville only, since 2026-07-19) download
only if a reader picks them, never on a default load. JavaScript is vanilla, deferred, and
small, scoped where practical so a script that only matters on articles (sidenotes, say)
does not tax the homepage. And third-party scripts are watched: every external script is a
request and a dependency, and there is exactly one today — the self-hosted Umami beacon at
`analytics.oinam.net`, removed 2026-07-27 and restored 2026-07-31. A third origin costs a
DNS lookup and a TLS handshake before its script can even start, commonly 100–300 ms on a
cold mobile connection, on every page. It is deferred, so it delays no paint; what it costs
is a connection the page would otherwise never open. One is the ceiling, not a starting
point.

The CSS sub-budget is ≤ 13 KB gzipped, measured over the wire, not raw. It used to be
per-page, because the CSS was inlined and every page paid it again. Since 2026-07-27 there
is one stylesheet for the whole site — 9.5 KB gzip / 50 KB raw — so the budget is now a
whole-site figure, and it is the one number to re-measure when adding CSS anywhere. That
the number barely moved while its meaning changed is the point: a page used to carry
6.1–7.2 KB gzip of CSS every single view, and now carries 9.5 KB once.

## Reader's choice
Appearance is the reader's to set, Kindle/Reader-style: theme (mode × palette), font, and
accent all persist across visits. Defaults are calm and neutral; the controls are there for
those who want warmer, darker, or higher-contrast reading. See [`styles.md`](styles.md)
for the axes.

## Future directions (philosophy, not committed scope)
Two directions, not deliverables, tracked where actionable in [`todo.md`](todo.md): a
microblog or "jottings" stream — short posts surfaced on the homepage with their own
dedicated stream elsewhere, in the spirit of Mastodon and [Jottings](https://jottings.me) —
and home as text, reducing the homepage to writing and turning Books into a short "top
rereads" list rather than a gallery.
