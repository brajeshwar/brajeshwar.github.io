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
centered. The left edge of the prose is the site's alignment line: the header rule, the footer
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
- **≤ 60 KB per thumbnail**, and most should land near 25–40 KB.
- Filename is the slug: `the-lord-of-the-rings.webp`, lowercase, hyphenated.

⚠️ **When a thumbnail busts the budget, cut the long edge — not the quality.** This section
used to say that over 100 KB "means the quality slider is too high, not that the image is
complicated." That is wrong, and the first real album photo disproved it: a bookshop interior,
which is several hundred legible book spines, i.e. detail everywhere and nothing for the
encoder to flatten. Measured 2026-08-01, same source:

| long edge | q82 | q75 | q70 | q65 |
|---|---:|---:|---:|---:|
| 800 | 122.9 KB | 97.1 KB | 91.7 KB | 86.5 KB |
| 700 | 90.1 KB | 70.6 KB | 66.8 KB | 62.6 KB |
| **600** | 69.9 KB | **54.6 KB** | 52.0 KB | 49.2 KB |

Dropping from q82 to q65 at 800px saves 36 KB and visibly softens the faces. Dropping to
600px at q75 saves 68 KB and costs nothing you can see, because 600 still clears the 490px
retina floor by 22% — the headroom this page already documents. **So 800 is the template, not
a minimum.** For a detail-dense frame, take the long edge to 600 and leave quality at 75.

### Keep the master

Keep the untouched source **before** cropping — it is what makes a re-cut possible when this
template changes. There are two conventions, and they are not interchangeable.

**Collection thumbnails** — masters go in **`_src/`** at the repo root, one folder per
collection, under the same slug as the published file with no suffix:

```
_src/books/  _src/film/  _src/album/  _src/devices/  _src/wear/

static/books/the-lord-of-the-rings.webp   ← published, 800px long edge, 3:4
_src/books/the-lord-of-the-rings.jpg      ← master, whatever the source gave
```

Same stem, different tree, so the pair is obvious at a glance and a re-cut is a loop over
`_src/` rather than a filename dance. Two properties come free with that leading underscore
and are the whole reason for it:

- **Masters never ship.** Jekyll does not copy an underscore directory into `_site`, the same
  way `_docs/` and `_backup/` stay out. No `_config.yml` exclude, nothing to remember, and no
  public URL for a 5 MB camera original.
- **Masters are on Git LFS.** `.gitattributes` tracks `_src/**` by *path*, so the repo carries
  a 131-byte pointer per file while the same `.jpg` under `static/` stays an ordinary blob.
  ⚠️ Track by path, never by extension — an extension rule would swallow the published files
  too. `.gitkeep` is explicitly opted back out; a pointer file is not a placeholder.

⚠️ **Add masters with plain `mv` + `git add`, never `git mv`.** `git mv` writes the rename
straight into the index without running LFS's clean filter, so the real binary goes in and
`git status` looks perfectly normal. The only check that actually proves it:

```
git ls-files -s _src/books/1984.jpg          # → blob sha
git cat-file -p <sha> | head -1              # → version https://git-lfs.github.com/spec/v1
```

`_src/film` is singular while the published folder is `static/films/` — deliberate, matching
the `/film/` page; don't "fix" either one. Adopted 2026-08-01, replacing a `<name>-original.<ext>`
suffix that sat inline next to the published file (and, for a few hours, a `static/*/src/`
layout that shipped with the deploy).

**Per-post images** — `static/<year>/` — keep the old `<name>-original.<ext>` suffix, in place.
⚠️ **Do not migrate these.** 41 of them are live and three are linked *directly* from posts, so
their URLs are pinned by guardrail 2. The suffix stays the convention for anything under a year
folder; `_src/` is only for the five collections above. Meanwhile, do not add a 700 KB master casually.

### Adding a book or an album item

Append to the end of `_data/books.yaml` or `_data/album.yaml`. **The last entry is the
newest** — that is the whole ordering protocol, and it is why the home-page strips read
newest-first while `/books/` keeps the file's own order. There is deliberately no date field:
a re-read has no single date worth recording, and a second field is a second thing to keep
true.

`highlight: true` on a book puts it in *All Time Favorites* and takes it out of *More Books* —
one flag, two grids, no entry in both. `media: video` or `media: audio` on an album item
overlays the matching icon.

⚠️ **Album entries should also carry `w:` and `h:`** — the cut file's real pixel size. `/album/`
is masonry, so every photo keeps its own shape, and without them the card reserves the 3:4
default and then jumps to the true ratio the moment the file lands. Jekyll cannot measure an
image without a plugin, so the numbers are written beside the file by whoever cut it, which is
the one moment the size is already on screen. Books and film do not need them: those grids crop
every cell to the same shape by construction, so one hint is right for all of them.

Album thumbnails are cut at their **native** aspect ratio, never pre-cropped to 4:3. `/album/`
shows the real shape and the home strip crops to 4:3 itself with `object-fit: cover`; pre-cropping
would throw away the picture the masonry page is there to show.

**When one file gets unwieldy**, split it into a directory — `_data/books/2024.yaml`,
`2025.yaml`, and so on. Jekyll turns `_data/books/` into a hash keyed by filename and iterates
it in **filename order, not filesystem order** (verified 2026-08-01 by creating the files out
of sequence: 2026 → 2024 → 2025 still read back 2024 → 2025 → 2026). So "the last entry is the
newest" still holds globally, as long as filenames sort ascending — which is why the split is
**by year, never by letter**. An alphabetical split would scatter chronology across files and
break the one rule the whole thing rests on.

The cost is a flatten step wherever the list is used, since a directory is a hash of arrays
rather than one array:

```liquid
{% raw %}{% assign books = "" | split: "" %}
{% for group in site.data.books %}{% assign books = books | concat: group[1] %}{% endfor %}{% endraw %}
```

⚠️ That snippet is wrapped in a Liquid **raw** block in this page's source, and has to be.
Liquid runs **before** Markdown, so a fenced code block is no protection: the example executed
on first write and took the build down with *"concat filter requires an array argument"*,
because `site.data.books` is still a flat array here, not a directory. Naming the tag in prose
does it too — a bare mention of it outside a raw block reads as an unclosed opening tag and
fails with *"'raw' tag was never closed"*. Both mistakes were made writing this paragraph.

Not worth paying until editing one file is genuinely annoying — a few hundred entries is fine.

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
both are in the archive, but there is one behavior to maintain, not two.

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
neighbor and their single link takes the whole bar rather than leaving half of it empty.

The circle in the middle goes to `/random/`, which sends you to a random post. It is 38px
inside a 46px bar, centered *absolutely* rather than laid out in flow, so it sits in the same
place whether the bar has two links or one. Its fill is `--color-primary` eased toward the bar
— the same "on" color the selected pill wears — so it inverts correctly in every theme
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

Color is **opt-in**. The resting theme is monotone gray and links are underlined rather than
colored. Prose follows the reader's font choice; the interface never does.

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
