---
layout: page
title: Styleguide
---

# Styleguide

What the site actually does, so I stop guessing. Last checked against the CSS on Jul 27, 2026.

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

| | source size | notes |
|---|---|---|
| Books | `360 × 480` | `/books/` is a **prose page**, not a grid |
| Film | `225 × 300` | `<img width="225" height="300">`, album layout |
| Devices | `225 × 300` | same |

The card grid is **fluid** — `repeat(auto-fill, minmax(11rem, 1fr))` — so cards flex with the
band. There is no fixed "styled as" size any more; the old `240 × 320` note described a layout
that no longer exists.

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
