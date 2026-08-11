# Timeline — the shared component

A vertical spine with a dot per entry. Events as headings, the date on the line beneath, and
**no authoring syntax of its own** — you write ordinary Markdown and the CSS finds it.

⚠️ **FOUR PAGES WEAR IT**: `/about/`, `/cv/`, `/about/brajeshwar.com/` and `/now/`. Any change to
the spine, the marker or the entry rhythm changes all four, which is the point — *"I want the
same visual timeline treatment of /about/ same for /cv/ and /now/."* (2026-08-09).

⚠️ **THIS FILE WAS SUBSTANTIALLY WRONG UNTIL 2026-08-11.** It documented a class vocabulary
(`.timeline-period`, `.timeline-when`, `.timeline-entries`, `.timeline-entry`, `.timeline-title`,
`.timeline-meta`, `.timeline-intro`, `.timeline-title-a11y`, `.timeline-progress`) that the
Markdown conversion orphaned on 2026-08-09 and that was deleted from `_sass/timeline.scss` on
2026-08-10. Following its markup template would have produced HTML that nothing styles. The
lesson is kept at the foot; the corrections are inline.

⚠️ **`/styleguide/` was right the whole time**, and is the other place this component is
documented — it has shown the current `<div class="timeline" markdown="1">` + `## Entry` + date
line shape since the conversion. It is a `_pages/**` prose body, so it is Brajeshwar's to edit
(guardrail 1); **if the two ever disagree, trust the styleguide and fix this file.**

## The markup — a heading, a line, and prose

There are exactly two shapes.

### Heading flow — `/about/`, `/cv/`, `/about/brajeshwar.com/`

One wrapper, then Markdown:

```markdown
<div class="timeline" markdown="1">

## Valinor Earth

2021 Jan — Present · Co-Founder, CEO

Prose, with [links](https://example.com) and *emphasis* that actually work.

</div>
```

| what you write | what styles it |
|---|---|
| `<div class="timeline" markdown="1">` | `.timeline` — the spine (a `::before`), the left padding, the dot arithmetic |
| `## Entry` | `.timeline h2` — the dot hangs off it as a `::before`. **No local `font-size`**: base.scss owns the type, *"the styling should be the default '##' styling"* |
| the **first** paragraph after it | `.timeline h2 + p` — the sub-title. No class, and none is possible: *"the line right under the title"* is exactly what `h2 + p` means |
| every later paragraph | `.timeline p` — capped at `--measure` while the spine spans the band |
| `<figure class="timeline-figure">` | floats right into the margin the measure leaves |

The `<h1>` comes from the **layout**, not from the page. There is no clipped a11y heading any
more and none is needed.

### List flow — `/now/` only

No wrapper and no classes at all. `style: page-now` in the front matter puts `.page-now` on
`<main>`, and the selectors hang off kramdown's ordinary output:

| what you write | what styles it |
|---|---|
| `## 2024` | `.page-now h2` — the year |
| a bullet list under it | `.page-now ul` — carries the spine |
| each `- item` | `.page-now ul li` — a dot on the spine |

⚠️ **`/now/` deliberately keeps this shape.** Its entries are bullets with no titles, so there is
nothing for the heading flow to promote. `_sass/timeline.scss` carries both vocabularies on
purpose; the older one is not dead.

### What the two share

Both read the same four tokens, which is what makes four pages one component:

    --timeline-rule         the spine's width (--border-size-hairline, 0.75px)
    --timeline-dot          marker diameter (11px, 9px below 600px)
    --timeline-gutter       the space the spine lives in
    --timeline-dot-center   THE middle of an entry's first line — see below

⚠️ **`--timeline-dot-center` is the load-bearing one.** It drives the dot's vertical position
*and* the top of the spine, and each flow sets its own because their first lines differ — the
heading flow measures against `--step-2` (an `h2`), `/now/` against `--step-0` (body text).
Brajeshwar's parenthesis is why it is a variable and not a constant: *"Vertically position the
dots in the middle of the title that follows it (if there are as in the /about/)."*

## ⚠️ Markdown after all — the HTML decision was REVERSED (2026-08-09)

**This section argued for HTML three times in two days and was wrong.** The reversal is left loud
rather than tidied away, because the *premise* was correct and the *conclusion* was not.

The premise, still true: **kramdown does not parse Markdown inside block-level HTML.** Verified
twice against this site's own parser — a `[link](…)` inside a `<li>` reaches the browser as
literal text.

The wrong conclusion: that every entry therefore needed `markdown="1"`, which is more markup than
it saves. **One `markdown="1"` on the outer `<div>` makes the entire body Markdown.** The
per-entry wrappers were never a Markdown problem — they were a CSS demand for
`<li class="timeline-entry">`. Remove the demand and an entry is a heading followed by
paragraphs, which is what Markdown is for.

What made it worth doing was never authoring comfort. It was **`/cv.md` and `/about.md`**, the
plain-text twins the "Open in" bar hands to an AI, which were shipping raw HTML because the
source was HTML. His ask: *"'film' will never need a view as Markdown, hence HTML but about, cv,
and now can definitely be just Markdown."*

So the split is by **purpose**: pages an agent might be asked to read are Markdown; index pages
built from data (`/film/`, `/books/`, `/album/`, `/own/`) stay HTML, where the markup *is* the
page. ⚠️ **Those data pages no longer pay for that choice** — since 2026-08-10 their twins are
converted from the built page rather than the Liquid source, so `/books.md` lists actual books.
See [`agents.md`](agents.md).

Three things that fell out, each worth keeping:

- **The anchors come free.** kramdown derives a heading id from its text, so `## Razorfish` is
  `id="razorfish"`. All thirteen `/cv/#<company>` links resolved with nothing written by hand —
  checked against the old file before converting. ⚠️ Rename a heading and you rename its anchor.
- **Footnotes become real.** `[^1]` emits exactly the markup `sidenotes.js` expects, so guardrail
  5 is satisfied by the parser instead of by hand-written `<sup id="fnref:1">`.
- **Raw HTML still passes through** inside `markdown="1"`, which is how the flush-right figure
  survives.

⚠️ **`/about/` uses ordinary kramdown footnotes and its hand-written HTML block is GONE.** Getting
there took inverting the problem. `sidenotes.js` needs the reference *and* the `.footnotes` list
inside one `.container-ideal`, and kramdown appends `.footnotes` at the very end of the document
— so with `page_full: true` (which drops `.container-ideal` so the timeline gets the band) a
`[^1]` could never become a sidenote.

**So the article keeps the reading column and the TIMELINE breaks out instead** —
`.page-about .timeline { width: var(--body-width-max); max-width: none; }`. `.container-ideal` is
left-aligned, so a child extending right needs no negative margin; measured, the timeline's right
edge lands exactly on `<main>`'s. Prose and notes keep the measure, the timeline gets 1024px, the
sidenote works. `page_full` still exists as a layout capability but no page uses it.

## ⚠️ No period grouping anywhere (2026-08-09)

Entries are a flat sequence of `##` headings, each carrying its own date beneath. The year labels
are gone — *"we should get rid of the '##' with the years"* — and with them
`.page-about .timeline h2` label styling, its `content: none` dot suppression, and the
`--timeline-spine-top` offset that pushed the spine past the first label.

**`##` is an entry, full stop.** ⚠️ This is also why the old *"the year is not the heading"*
section had to go: it described `.timeline-when` as an `<h2>` and `.timeline-title` as an `<h3>`
beneath it, and asserted *"the periods stayed"*. They did not.

⚠️ If grouping ever returns, **the heading LEVEL is the mechanism** — `##` for the group, `###`
for the entry — and the entry selectors in `timeline.scss` would need to take `h3` as well. Do
not reintroduce a label class.

## ⚠️ THIS SITE RUNS PLAIN KRAMDOWN, NOT GFM — and heading ids prove it

`_config.yml` sets `markdown: kramdown` and **no `input:`**, so the GFM parser is not in play.
That matters for exactly one thing, and it is a trap:

**kramdown prefixes `section` to any auto-generated id that does not start with a letter.**

| heading | plain kramdown (this site) | GFM |
|---|---|---|
| `## Razorfish` | `razorfish` | `razorfish` |
| `## 2005-2006` | **`section`** | `2005-2006` |
| `## 2021-present` | **`present`** | `2021-present` |

So a letter-leading heading is safe and a date-leading one is not. Nine `/about/` period anchors
were silently replaced by `section`, `section-1`, `section-2`… in a green build on 2026-08-09.

⚠️ **AND THE BARE `{: #id}` IAL DOES NOT WORK HERE EITHER** — it is accepted and ignored, and the
heading keeps its `section` id. Only the quoted form works: `{: id="2005-2006"}`.

**But no page uses it, deliberately.** *"do away with the ID. I don't care in this case. No Anchor
needed … if I need to link it I will peak under the hood and what the HTML is generated."*
(2026-08-09). ⚠️ **Do not "fix" these into hand-written ids** — the content is meant to carry
none. Entry headings are unaffected: they start with a letter, so `## Razorfish` is `razorfish`
and is a usable anchor already.

⚠️ Anything claiming this site parses GFM is wrong; that claim lived in this file and cost two
debugging passes. Test against `Kramdown::Document.new(src).to_html` with **no** `input:` option,
which is what Jekyll actually runs.

## ⚠️ Order is DOCUMENT ORDER — the component never sorts

There is no date parsing, no sort, and no `order:` setting anywhere in this component. **Entries
render in the order they are written**, and that is the whole mechanism.

> *"the timeline view is not forced in order but it just follows how I edit/write them in the
> actual Markdown. If I make a mistake with the date, that is one me."* — 2026-08-09

Which is why the pages differ on purpose, and why nothing needs a flag to make them. Re-measured
2026-08-11:

| page | order | |
|---|---|---|
| `/cv/` | **newest first** | Valinor Earth 2021 → Peerless Software 2001 |
| `/now/` | **newest first** | 2024 → 2001 |
| `/about/` | **oldest first** | Bombay 1999 → Amara 2016 |
| `/about/brajeshwar.com/` | **oldest first** | *"I want to start from the past to the present"* |

⚠️ **This table said `/about/` was newest-first and it never was.** Two pages run each way.

**To reverse a timeline, move the blocks.** Do not add sorting, and do not "correct" a page whose
dates run the other way — half of them run oldest-first deliberately. A date that looks wrong is
his to fix, not the component's to reorder.

## Heading anchors

`anchors.js` prepends a `§` link. Its selector, verified 2026-08-10:

```js
'.timeline h2[id], .timeline h3[id], .page-now h2[id]'
```

⚠️ **This file used to say it matched `.timeline-when[id]`.** It never has, and that class has not
existed on the built site since the period labels went. The claim had propagated into a comment
in `_sass/timeline.scss` as well; both are corrected. Read the script, not a doc, if the two ever
disagree again.

The `.headerlink` styling lives in `base.scss` — one class, one script, four page types. There
were three copies of it (post/timeline/now) until 2026-07-27, each justified by bundles that
"are never loaded together". They all load together now.

## Copy-paste templates

`_pages/about.md` ends with a Liquid comment holding two ready templates — an entry, and a
sidenote. Copy one, paste it in place, delete the comment markers, edit. Verified current
2026-08-11: they show the `##` + date-line + kramdown-footnote shape, not the old classes.

The comment is Liquid (`{%- comment -%}`), not HTML, deliberately: an HTML comment would ship the
whole block to every visitor for something only the author reads. Measured: 3,725 bytes on that
one page.

## Sidenotes

On the Markdown pages, write kramdown's `[^label]` and put the note anywhere below. Nothing to
configure and no HTML — `sidenotes.js` moves it into the right margin on a wide screen and leaves
it at the foot when there is no room or no JavaScript (guardrail 4).

For a page whose source is still HTML, emit what kramdown would have. Three things must line up
or nothing appears:

1. the wrapper carries `class="container-ideal"` — `sidenotes.js` looks for the reading column
   and places notes just past its right edge;
2. the reference is `<sup id="fnref:N">` containing `<a href="#fn:N">`;
3. the note is `<li id="fn:N">` inside `<div class="footnotes">`.

`N` is any unique string; the href and the ids must match exactly. That pairing is how a note
finds its reference, not document order.

## ⚠️ The Life/Work filter was REMOVED (2026-08-09)

Three sections stood here — *Renaming the tracks*, *The filter is CSS only*, and *Shareable URLs
— `#work` / `#life`*. They are gone because the feature is, at his word: **"The Life/Work goes
away including the code that powers it."**

What went, so nothing is half-removed:

| | |
|---|---|
| `<fieldset class="timeline-filter pill">` | the two-checkbox control |
| `<span class="timeline-target" id="life\|work">` | the zero-size `:target` anchors |
| `data-track="life\|work"` | on every entry — **do not reintroduce it, nothing reads it** |
| `assets/scripts/timeline.js` | deleted; it only synced the hash with the checkboxes |
| ~157 lines of `timeline.scss` | the `:has()` rules, the `:target` fallback, `.timeline-js` |
| the second marker | work entries drew a filled dot, life an open one |

**`/about/#work` and `/about/#life` now match nothing.** Correct for a removed feature rather than
a moved one: they degrade to ordinary fragments and the page renders in full. The link to send
instead of a CV is **`/cv/`**, which is a real page.

**The marker unification is the part worth understanding.** With no tracks there is nothing to
distinguish, so there is one marker — and unifying on it is what made `/about/`, `/cv/` and
`/now/` finally render as one component, the other half of the same day's request.

**Worth keeping even though the feature is not:** the filter was genuinely CSS-only. Two real
checkboxes plus `:has()` did the filtering, and a `:target` fallback made shared `#work` links
work with JavaScript disabled, with `timeline.js` adding `.timeline-js` to `<html>` to switch the
`:target` rules off so the two mechanisms could never disagree. That pattern is a good one and
may be worth reaching for elsewhere. Recorded for that reason, not as a plan to restore it. The
implementation is in the git history.

`.pill` survives — `appearance.js` builds the appearance panel's segmented controls from it.

## ⚠️ The position line was CUT (2026-08-10)

`.timeline-progress` — a scroll-driven accent fill on the spine, `animation-timeline: scroll()`
inside `@supports`, suppressed under `prefers-reduced-motion` — is deleted, along with the open
question of whether it should track the page or each period.

It was flagged experimental from the start (*"I'm not sure of this one but I want to experiment"*)
and built to be separable, so removing it took nothing with it. It went as **dead code rather
than as a decision**: it hung off `.timeline-entries`, which stopped existing when `/about/` and
`/cv/` became Markdown, so it had already been rendering nowhere.

⚠️ **And it was broken the whole time it did render.** Its `left` used the dot's formula, which is
relative to an *entry*, while the element was a child of the list — so it painted 42px left of
the spine it was meant to fill (measured 2026-08-09: spine at x=244–246, fill at x=204). Nobody
saw it because `prefers-reduced-motion: reduce` hid it, and the machine it was written on had
that switched on. **A feature behind a `@supports` *and* a motion query has two ways to be
invisible while broken.**

~~`.timeline-step` gave plain `↑ earlier` / `↓ later` anchors between periods.~~ Removed
2026-07-27, replaced by the site-wide Back to Top (see [`styles.md`](styles.md) §6). Each named a
sibling `id`, so adding or reordering a period pointed them somewhere wrong with no error.

## Content

The prose is Brajeshwar's, and rewriting it is his. `/about/` is a story of twelve events from
Bombay in 1999 to Amara in 2016; `/cv/` is thirteen roles.

⚠️ **The old "the Life track is thin" analysis is gone with the tracks.** It counted twelve work
entries against three life ones and observed that three of ten periods vanished under a Work
filter. There are no tracks, no periods and no filter, so there is nothing to be lopsided.

## Still to do

- [ ] The trailing `> Work-in-Progress` blockquote and the intro line sit outside the timeline;
      decide whether they stay there.
- [ ] **"Download Resume" PDF** — was scoped to "the Work view", which no longer exists. **`/cv/`
      is the better source**: one page, already in role order, no filter state to reason about.
      Tracked in [`todo.md`](todo.md) too; this is the same item.
- [ ] **Retire `cv.brajeshwar.com`** — `/cv/` replaces it as of 2026-08-09, so this waits on him.
      ⚠️ `_redirect/resume.md` does **not** cover it: a Jekyll stub can only redirect a path on
      this domain. It needs the Cloudflare Worker redirect queued in [`todo.md`](todo.md).
      Same item as todo.md's; recorded in both because either is a plausible place to look.
- [x] ~~Decide oldest-first vs newest-first~~ — settled per page, see the order table. Not one
      answer: `/cv/` and `/now/` run newest-first, `/about/` and `/about/brajeshwar.com/` oldest.
- [x] ~~Fill out the Life track~~ — **void 2026-08-11.** There is no Life track.
- [x] ~~Decide the position-line question, or cut it~~ — **cut 2026-08-10**, as dead code.
- [x] ~~Move the markup into `/about/`~~ *(2026-07-27)*. ⚠️ This said `/about/#work` is "the link
      worth sending" — dead twice over: the filter is gone and `/cv/` is the link.

## ⚠️ What this file got wrong, and why it matters

Six documented facts here were false when the 2026-08-11 rewrite checked them: the markup
template, the hook table, the `anchors.js` selector, `/about/`'s ordering, the periods, and the
position line's status. **Not one of them took more than a single grep of `_site` to disprove.**

They survived because the file was *re-read* rather than *re-measured*, and because prose about a
deleted feature reads exactly like prose about a live one. Two habits follow:

- **Check a claim about the built site against the built site**, not against the doc that made it.
  `grep -rl --include='*.html' 'timeline-entry' _site` answers in one second.
- **When a feature is removed, grep the docs for its class names in the same pass.** This file
  described `.timeline-entry` for two days after the CSS stopped having it, and
  `_sass/cv.scss` had copied the same wrong description into its own header.
