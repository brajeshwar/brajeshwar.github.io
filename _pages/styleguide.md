---
layout: page
title: Styleguide
---

# Styleguide

What the site actually does, so I stop guessing. Last checked against the CSS on Aug 1, 2026.

## Widths — there is only one

`64rem` / `1024px`. The header, the footer, `main`, post titles, wide images, captions, videos
and the prev/next bar all end on the same line. The number is not a taste call: it is the
reading measure plus one sidenote gutter — `665 + 56 + 256 = 977`, rounded up.

Prose sits at the **measure** (`66rch`, ~665px) *inside* that band, left-aligned rather than
centred. The left edge of the prose is the site's alignment line: the header rule, the footer
rule and the logo all start from it.

**Anything wide grows to the RIGHT.** Never into the left margin. There is exactly one
exception, below.

## Articles

- Avoid front matter where possible. Titles come from the `# H1`.
- `image:` in the front matter adds an optional cover — see below.
- Footnotes become margin sidenotes on a wide screen and fold back to footnotes on a narrow
  one. Write ordinary kramdown `[^name]`; there is no special syntax and nothing to opt into.

### The cover picture

`<photo-cover>` — it was never called `cover-picture`.

```yaml
image: /static/2004/hero.jpg
image-desc: The desert sands of Dan Gin Shan.   # optional caption
```

The **one element allowed past the band**: full-bleed to the viewport, capped at `1600px`, and
flush under the header's rule with no seam. Its caption is the exception to the exception —
that stays on the body width, because the image is a flourish and the caption is text that
belongs with the prose.

No rounded corners on it. It runs to the window edge, and a curve there looks like a bug.

## Images

### The thumbnail template — long edge **800px**

Crop and resize everything that goes into `/static/*` to one of three boxes. One number, three
shapes:

| shape | box | used by |
|---|---|---|
| **Portrait 3:4** | `600 × 800` | books, film, devices — covers, posters |
| **Landscape 4:3** | `800 × 600` | album photos |
| **Square 1:1** | `800 × 800` | anything that is neither |

**Where 800 comes from.** Measured against the built site on Aug 1, 2026, the widest a
thumbnail ever renders is **245px** — that is `/album/`, whose masonry columns grow to fill the
band. Everything else is smaller: the grids on `/books/`, `/film/` and `/devices/` top out at
**193px**, and the home-page strips are fixed at **192px**.

| surface | widest render |
|---|---:|
| `/album/` masonry | 245px |
| `/books/` · `/film/` · `/devices/` grid | 193px |
| home strips (books, album) | 192px |

A retina screen wants twice that, so **490px is the floor today**. A 600px-wide source clears
it with about 20% to spare, which is the headroom: the rendered size can grow from 245 to
**300px** before anything needs re-cutting. Landscape gets more room again, because there the
long edge *is* the width.

**Do not go bigger "just in case."** 800 on the long edge is already 3× the largest thing on
the page. Past that you are paying bytes on every page view for pixels no screen will resolve,
and the album strip alone loads eight of them.

### Format and budget

- **WebP**, quality **75–82**. AVIF is smaller again but the encode is slower and the win at
  this size is small.
- **≤ 60 KB per thumbnail**, and most should land near 25–40 KB. Anything over 100 KB at these
  dimensions means the quality slider is too high, not that the image is complicated.
- Filename is the slug: `the-lord-of-the-rings.webp`, lowercase, hyphenated.

### Keep the master

Copy the untouched source to `<name>-original.<ext>` **before** cropping. That convention is
already in the archive and it is what makes a re-cut possible when this template changes.
⚠️ Masters live in `/static/` too, so they ship with the deploy — a few are referenced directly
by posts, so they are not dead weight, but do not add a 700 KB master casually.

### Where they go

`/static/books/`, `/static/album/`, `/static/films/`, `/static/devices/` — bare filenames in
the matching `_data/*.yaml`. A `img:` value beginning with `/` is used verbatim instead, which
is the escape hatch for borrowing a file from another folder.

### What is inconsistent today

Worth a pass when convenient, not urgent:

| | today | against the template |
|---|---|---|
| books | `360 × 480` (9 files) | 1.5× on `/album/` — soft on a retina screen |
| film | `225 × 300` (97 files) | **1.2×** — visibly soft wherever it renders at 193px |

129 of 136 files are already 3:4, so the shape is right and only the resolution is short.

### The grid itself

Fluid — `repeat(auto-fill, minmax(11rem, 1fr))`, `8rem` inside `.album` — so cards flex with the
band and there is no fixed "styled as" size. `/album/` is different again: multi-column masonry,
so each image keeps its own height and nothing is cropped.

Gallery: a container, then a plain markdown list of images, optionally linked.

```html
<div class="gallery" markdown="1">
- ![Alt](/static/one.webp)
- ![Alt](/static/two.webp)
</div>
```

Size and float classes: `.small` (40%) · `.medium` (60%) · `.left` · `.right`.

`.large` and `.full` both take the whole band and are now **identical**. Both are kept because
both are in the archive, but there is one behaviour to maintain, not two.

## Videos and embeds

Ornamental. The writing has to work without them.

They take the full band, keep a 16:9 box, and get the same rounded corners as images.

```html
<video width="100%" height="auto" poster="" controls muted loop preload="metadata">
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  [Video Format - Non-Supported Browser]
</video>
```

⚠️ Images in posts carry no `width`/`height` attributes. That causes layout shift as they load,
and it is why sidenotes need a `ResizeObserver` to re-place themselves once an image finally has
a height. Worth fixing one day.

## Rounded corners

Images, videos and embeds inside `main` get `--border-radius` (7px) — the same curve as the
appearance panel, the search palette and the prev/next bar, so media matches the chrome instead
of inventing a second one. It is a default at the lowest possible specificity, so anything with
its own opinion simply overrides it.

## Styles

**Avoid gradients.** Still true, and still zero of them in the CSS.

~~Avoid box-shadows.~~ **No longer true, and deliberately so.** The appearance panel, the search
palette and the archives year strip each use one. They are floating surfaces, and a shadow is
how a floating surface says so. Everything flat stays flat.

Custom, strange, and *why I did that* ones — a shorter list than it used to be:

- `aside` / `{:.aside}` — a bordered aside block.
- ~~`{:.aside .right}`~~ — **removed.** Zero uses across all 1,456 posts.
- `{:.mark}` shares the style of <mark>MARK</mark>, a highlighted phrase.

## Post navigation

Under every article: **PREV · (shuffle) · NEXT**. One bar, prev hard left, next hard right,
and whichever exists fills the width it is given — the first and last post have only one
neighbour and their single link takes the whole bar rather than leaving half of it empty.

The circle in the middle goes to `/random/`, which sends you to a random post. It is 38px
inside a 46px bar, centred *absolutely* rather than laid out in flow, so it sits in the same
place whether the bar has two links or one. Its fill is `--color-primary` eased toward the bar
— the same "on" colour the selected pill wears — so it inverts correctly in every theme
without a per-theme rule.

`/random/` carries the list of every post URL inline and picks one in JavaScript. With
JavaScript off it shows a real link to a post chosen at build time, which the daily rebuild
rotates on its own. It never sends you back to the post you came from.

## The reader's controls

The gear in the header. Five axes, all remembered between visits and all applied before first
paint, so nothing flashes:

- **Mode** — Auto · Light · Dark
- **Palette** — Default (monotone) · Cool (Nord) · Warm ([Flexoki](https://stephango.com/flexoki))
- **Font** — System · Sans-Serif (Geist) · Serif (Libre Baskerville)
- **Text Size** — five steps, scaling everything inside `main`
- **Accent** — five swatches

Colour is **opt-in**. The resting theme is monotone grey and links are underlined rather than
coloured. Prose follows the reader's font choice; the interface never does.

---

## Typography

# Headings H1
## Headings H2
### Headings H3
#### Headings H4
##### Headings H5
###### Headings H6

Plotting ear goes let far she not star bit rat bad men. Low pox lemon rap gob whale pal bee apple vet boy air lot hog? Hum box said nag fish cop laugh dot yet zap hoe bad zoo bug image run fix hit hum cow. What have I done?

> This is a blockquote text.

Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
