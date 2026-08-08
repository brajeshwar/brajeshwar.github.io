# Timeline — the /about/ storyline

A vertical timeline: events as headings, dates as sub-titles, time-range labels typed by hand,
and an optional scroll position line.

⚠️ **THREE PAGES SHARE IT** since 2026-08-09 — `/about/`, `/cv/` and `/now/`. Any change to the
spine, the marker or the entry rhythm changes all three, which is the point: *"I want the same
visual timeline treatment of /about/ same for /cv/ and /now/."* `/cv/` uses one flat
`<ol class="timeline-entries">` with no periods, because a CV is one sequence of roles rather
than a story with eras.

It had a Life/Work filter until 2026-08-09. That is gone — see the section below before
looking for it.

Live at `/about/` since 2026-07-27, in `_pages/about.html`. It replaced the prose
`_pages/about.md`, which Brajeshwar archived; that deletion is in the repo's history. The
`_pages` collection sets `permalink: '/:name/'`, so `about.html` lands on `/about/` on its own;
the explicit `permalink: /about/` in its front matter is belt-and-braces on a URL that must not
move (guardrail 2). `/about/brajeshwar.com/` is a separate page with its own explicit permalink
and is unaffected.

## Why HTML, not Markdown

Brajeshwar's call: *"Markdown should be for prose in posts, others are exempt."* Each entry
needs a machine-readable `life` / `work` tag, and Markdown can only carry that through kramdown
IAL. That was verified to work (`{: .class}` on its own line; the inline form
`## 1993-1995 {: .class}` does not parse) but it is awkward: it puts a class on a heading rather
than an attribute on an entry, and periods contain mixed tracks. HTML says what it means.

Two parser facts are worth keeping, since they cost a test to establish. The site runs kramdown
with `input: GFM` (Jekyll's default; `kramdown-parser-gfm` is in the Gemfile because of it).
That matters for numeric headings: under GFM `## 1993-1995` gets `id="1993-1995"`, but under
plain kramdown it collapses to `id="section"`. Any anchor scheme built on date headings in
Markdown would have been parser-dependent. In HTML we write the `id` ourselves.

## The markup

```html
<div class="timeline">

  <!-- The h1 comes from the LAYOUT now, not from here. The clipped
       .timeline-title-a11y this block used to show is gone from about.html;
       the class survives in timeline.scss and is documented below because
       nothing else reintroduced it, not because the page still uses it. -->

  <div class="timeline-intro">
    <p>The intro opens the page, and spans the full band.</p>
  </div>

  <section class="timeline-period" aria-labelledby="1999-2003">
    <p class="timeline-when" id="1999-2003">1999&ndash;2003</p>
    <ol class="timeline-entries">
      <div class="timeline-progress" aria-hidden="true"></div>

      <li class="timeline-entry">
        <h2 class="timeline-title">Computer Graphic Designer</h2>
        <p class="timeline-meta">Comic magazine startup &middot; Bombay</p>
        <p>Prose.</p>
      </li>
    </ol>
  </section>

</div>
```

| Hook | Does what |
|---|---|
| `.timeline` | Wrapper. The filter's `:has()` selectors are scoped to it. |
| `.timeline-period` | One time range. Hides itself when the filter empties it. |
| `.timeline-when` | The range — **typed by hand**: "early 1980s", "1993-1995", anything. A `<p>`, not a heading. Give it an `id` to make it linkable, and point the period's `aria-labelledby` at that same id. |
| `.timeline-entries` | `<ol>` of entries. Carries the spine (its `border-left`). |
| `.timeline-entry` | One event. ⚠️ It took a `data-track` attribute until 2026-08-09; that is gone and nothing reads it. |
| `.timeline-title` / `.timeline-meta` | The event's `<h2>` — the loud line on the page — and the role/place/date line under it. |

### ⚠️ The year is not the heading (changed 2026-08-09)

It was until then: `.timeline-when` was an `<h2>` and `.timeline-title` an `<h3>` beneath it,
so the page read as a list of years with events indented under each. Brajeshwar reversed the
emphasis — *"instead of years as the focus, let's focus on events as the titles. Of course, we
will have dates."* The event took the `<h2>`; the year became a quiet uppercase label.

Three things this did **not** break, and each is the reason a tempting simplification is wrong:

- **The periods stayed.** Flattening them into a flat list of events is a different change: it
  costs one spine per group and converges `/about/` onto `/cv/`'s shape, which is deliberately
  a different shape.
- **Every shared `/about/#2005-2006` still resolves.** The `id` did not move elements, only
  tags — a fragment target does not care what tag it lands on.
- **The `§` anchor still appears on the year.** `anchors.js` matches `.timeline-when[id]`, a
  class and not a tag. Had it matched `h2[id]` the anchor would have followed the heading to
  the event instead; if you ever add ids to `.timeline-title`, that selector needs the entry
  too or the `§` will be missing from the loud line.

`.timeline-when` also stopped sharing its rule with `.page-now h2` at the same time. `/now/`
has no events to promote — only years — so it kept the old treatment, and the two pages now
differ on purpose. Change one and you are no longer changing the other.

Entry style follows the CV at <https://cv.brajeshwar.com>: each role a discrete block with a
date range, an organization, a location and a description, newest first. That CV is rebuilt on
this site at [`/cv/`](../_pages/cv.html), which does **not** use this component — see the note
at the top of that file for why a story and a CV want opposite emphasis.

## Copy-paste templates

`_pages/about.html` ends with a Liquid comment holding two ready templates: a period with one
entry of each track, and a sidenote. Copy one, paste it in place, delete the comment markers,
edit.

The comment is Liquid (`{%- comment -%}`), not HTML (`<!-- -->`), deliberately: an HTML comment
would ship the whole block to every visitor of `/about/` for something only the author reads.
Measured: 3,725 bytes saved on that one page.

## Sidenotes in hand-written HTML

Sidenotes come from ordinary footnote markup. In a post you write kramdown's `[^1]`; in HTML
you emit what kramdown would have. Three things must line up or nothing appears:

1. the wrapper carries `class="container-ideal"` — `sidenotes.js` looks for the reading column
   and places notes just past its right edge;
2. the reference is `<sup id="fnref:N">` containing `<a href="#fn:N">`;
3. the note is `<li id="fn:N">` inside `<div class="footnotes">`.

`N` is any unique string; the href and the ids must match exactly. That pairing is how a note
finds its reference, not document order.

⚠️ On `/about/` the wrapper matters: the timeline spans the full band, and a note hung off a
full-width box has no margin to sit in. Wrap the footnoted prose in its own `.container-ideal`.

## ⚠️ The Life/Work filter was REMOVED (2026-08-09)

Three sections stood here — *Renaming the tracks*, *The filter is CSS only*, and *Shareable
URLs — `#work` / `#life`*. They are gone because the feature is, at his word: **"The Life/Work
goes away including the code that powers it."**

What went, so nothing is half-removed:

| | |
|---|---|
| `<fieldset class="timeline-filter pill">` | the two-checkbox control |
| `<span class="timeline-target" id="life\|work">` | the zero-size `:target` anchors |
| `data-track="life\|work"` | on every entry — **do not reintroduce it, nothing reads it** |
| `assets/scripts/timeline.js` | deleted; it only synced the hash with the checkboxes |
| ~157 lines of `timeline.scss` | the `:has()` rules, the `:target` fallback, `.timeline-js` |
| `.timeline-entry[data-track="work"]::before` | the second marker — see below |

**`/about/#work` and `/about/#life` now match nothing.** That is correct for a removed feature
rather than a moved one: they degrade to ordinary fragments and the page renders in full. The
link to send instead of a CV is **`/cv/`**, which is a real page.

**The marker unification is the part worth understanding.** Work entries drew a *filled* dot and
life entries an *open* one — a colorless second signal, since the monotone palette rules out
using color (design.md). With no tracks there is nothing to distinguish, so there is one marker:
the open dot. That open dot is what `/now/` always rendered, which is why removing the filter is
also what made **`/about/`, `/cv/` and `/now/` finally render as one component** — the other
half of the same day's request, *"I want the same visual timeline treatment of /about/ same for
/cv/ and /now/."*

**Worth keeping even though the feature is not:** the filter was genuinely CSS-only. Two real
checkboxes plus `:has()` did the filtering, and a `:target` fallback made shared `#work` links
work with JavaScript disabled, with `timeline.js` adding `.timeline-js` to `<html>` to switch
the `:target` rules off so the two mechanisms could never disagree. That pattern is a good one
and may be worth reaching for elsewhere. It is recorded here for that reason, not as a plan to
restore this page to it. The full implementation is in the git history.

`.pill` survives — `appearance.js` builds the appearance panel's segmented controls from it at
runtime, so the shared component still has a user.


## Download Resume (not built)

Brajeshwar's stated direction: a downloadable PDF labeled "Download Resume", which *is* the
Work track. Nothing has been built for this. When it is, the obvious home is the head row
beside the toggles, shown when Work is the active view — and worth deciding then whether the
PDF is generated from this markup or maintained separately.

## Page opening

There is no title row (removed 2026-07-27). The order is intro → filter → timeline.

There is no visible `<h1>`; the intro opens the page. The heading is kept clipped in
`.timeline-title-a11y` rather than deleted, because a document with no heading at all leaves
screen-reader and search users nothing to anchor on, and the clipped copy costs no pixels.
Delete the element if that is not wanted.

The intro spans the full band, no measure cap. Trade-off worth knowing: ~140 characters a line
at 1024px, against the ~66 `design.md` targets. Fine for a short opening; re-cap it if it
grows.

The filter sits directly above the timeline it controls, left-aligned, no border — a control
belongs next to the thing it acts on. `.timeline-head` and its bottom rule are gone. The
`<legend>` is still there for screen readers but clipped, defined locally rather than reusing
`base.css`'s `.visually-hidden`, which the 2026-07-19 audit flagged as unreferenced.

## The position line (experimental — may be cut)

Brajeshwar: *"I'm not sure of this one but I want to experiment."* It is deliberately the most
separable thing in `timeline.css`: delete the `.timeline-progress` block and the timeline
still works completely.

The fill uses `animation-timeline: scroll()`, wrapped in `@supports`. Chrome/Edge 115+ get a
filling accent line; every other browser gets the plain spine. No polyfill, no JS. It is
suppressed under `prefers-reduced-motion`, since a line racing the scroll is exactly the sort
of motion someone may have switched off.

~~`.timeline-step` gives plain `↑ earlier` / `↓ later` anchors between periods.~~ Removed
2026-07-27, replaced by the site-wide Back to Top (see [`styles.md`](styles.md) §6). They were
hand-maintained: each named a sibling `id`, so adding or reordering a period pointed them
somewhere wrong without any error. The markup and the CSS are both gone; a tombstone comment
remains in `timeline.css`.

Open question for Brajeshwar: whether the fill should track the whole page (what it does now,
`scroll(root block)`) or each period independently. The second reads better on a long timeline
but needs one element per period.

## Content

The prose came from the old `_pages/about.md`, placed into periods — Brajeshwar's wording and
links verbatim, only reflowed into entries. He has archived that page and it is now deleted;
the content here is his to rewrite, and he has said he will.

Order is oldest-first, following the note at the foot of `about.md`: *"Do this more like a
timeline story, from top to bottom, with years and details."* The CV at
<https://cv.brajeshwar.com> runs newest-first; flipping is a matter of reordering the
sections.

What the merge exposed: the existing prose is almost entirely Work. Twelve work entries
against three life ones (Imphal, landing in Bombay, registering the domain), and three of the
ten periods vanish under a Work-only filter. The Life track is mostly empty — which is exactly
what "I want to see where they fit" was going to reveal.

## Still to do

- [ ] Fill out the Life track — it is thin, and the merged view is lopsided because of it.
- [x] ~~Decide oldest-first vs newest-first (CV order)~~ — **newest-first** since 2026-08-08.
- [ ] The trailing `> Work-in-Progress` blockquote and the intro line sit outside the timeline;
      decide whether they stay there.
- [ ] Decide the position-line question above, or cut it.
- [x] ~~Move the markup into `/about/`~~ *(done 2026-07-27)*. ⚠️ This said "`/about/#work` is
      now the link worth sending" — **dead twice over** as of 2026-08-09: the filter is gone, so
      that fragment matches nothing, and `/cv/` exists and is the link.
- [ ] "Download Resume" PDF — was scoped to "the Work view", which no longer exists. **`/cv/`
      is the better source now**: one page, already in role order, no filter state to reason
      about.
- [ ] Retiring `cv.brajeshwar.com`: `/cv/` replaces it as of 2026-08-09, so this is only waiting
      on him. ⚠️ `_redirect/resume.md` does **not** cover it — a Jekyll stub can only redirect a
      path on this domain. It needs the Cloudflare Worker redirect queued in
      [`todo.md`](todo.md).
