# Timeline — the /about/ storyline

A vertical timeline with a Life/Work filter, time-range headings typed by hand, and an
optional scroll position line.

**Live at `/about/` since 2026-07-27**, in `_pages/about.html`. It replaced the prose
`_pages/about.md`, which Brajeshwar archived; that deletion is in the repo's history. The
`_pages` collection sets `permalink: '/:name/'`, so `about.html` lands on `/about/` on its
own — the explicit `permalink: /about/` in its front matter is belt-and-braces on a URL that
must not move (guardrail 2). `/about/brajeshwar.com/` is a separate page with its own explicit
permalink and is unaffected.

## Why HTML, not Markdown

Brajeshwar's call: *"Markdown should be for prose in posts, others are exempt."* Each entry
needs a machine-readable `life` / `work` tag, and Markdown can only carry that through
kramdown IAL — verified to work (`{: .class}` on its **own line**; the inline form
`## 1993-1995 {: .class}` does **not** parse) but awkward, since it puts a class on a heading
rather than an attribute on an entry, and periods contain mixed tracks. HTML says what it
means.

Two parser facts worth keeping, since they cost a test to establish:
- The site runs kramdown with **`input: GFM`** (Jekyll's default; `kramdown-parser-gfm` is in
  the Gemfile because of it).
- That matters for numeric headings: under GFM `## 1993-1995` gets `id="1993-1995"`, but under
  plain kramdown it collapses to `id="section"`. Any anchor scheme built on date headings in
  Markdown would have been parser-dependent. In HTML we write the `id` ourselves.

## The markup

```html
<div class="timeline">

  <h1 class="timeline-title-a11y">Brajeshwar Oinam</h1>   <!-- clipped, see below -->

  <div class="timeline-intro">
    <p>The intro opens the page, and spans the full band.</p>
  </div>

  <fieldset class="timeline-filter">                      <!-- directly above what it filters -->
    <legend>Show</legend>            <!-- clipped: named for screen readers, not drawn -->
    <input type="checkbox" id="track-life" checked>
    <label for="track-life">Life</label>
    <input type="checkbox" id="track-work" checked>
    <label for="track-work">Work</label>
  </fieldset>

  <section class="timeline-period">
    <h2 class="timeline-when" id="1999-2003">1999&ndash;2003</h2>
    <ol class="timeline-entries">
      <div class="timeline-progress" aria-hidden="true"></div>

      <li class="timeline-entry" data-track="work">
        <h3 class="timeline-title">Computer Graphic Designer</h3>
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
| `.timeline-when` | The range — **typed by hand**: "early 1980s", "1993-1995", anything. Give it an `id` to make it linkable. |
| `.timeline-entries` | `<ol>` of entries. Carries the spine (its `border-left`). |
| `.timeline-entry` | One event. **`data-track="life"` or `"work"` is the only thing the filter reads.** |
| `.timeline-title` / `.timeline-meta` | Heading and the role/place/date line. |

Entry style follows the CV at <https://cv.brajeshwar.com>: each role a discrete block with a
date range, an organisation, a location and a description, newest first.

## Copy-paste templates

`_pages/about.html` ends with a **Liquid** comment holding two ready templates: a period with
one entry of each track, and a sidenote. Copy one, paste it in place, delete the comment
markers, edit.

Liquid (`{%- comment -%}`), not HTML (`<!-- -->`), deliberately — an HTML comment would ship the
whole block to every visitor of `/about/` for something only the author reads. Measured: 3,725
bytes saved on that one page.

## Sidenotes in hand-written HTML

Sidenotes come from ordinary footnote markup. In a post you write kramdown's `[^1]`; in HTML you
emit what kramdown would have. **Three things must line up or nothing appears:**

1. the wrapper carries `class="container-ideal"` — `sidenotes.js` looks for the reading column
   and places notes just past its right edge;
2. the reference is `<sup id="fnref:N">` containing `<a href="#fn:N">`;
3. the note is `<li id="fn:N">` inside `<div class="footnotes">`.

`N` is any unique string; the href and the ids must match exactly — that pairing is how a note
finds its reference, not document order.

⚠️ On `/about/` the wrapper matters: the timeline spans the full band, and a note hung off a
full-width box has no margin to sit in. Wrap the footnoted prose in its own `.container-ideal`.

## Renaming the tracks

Brajeshwar: *"I might change the terms."* Two places, no data migration:
1. The `<label>` text — free text, change at will.
2. If the *values* change (not just labels), the `id`/`for` pairs, the `data-track` values, and
   the four selectors in `timeline.css` that name `#track-life` / `#track-work` must agree.

Keeping labels and values separate is exactly why this is markup and not a YAML schema.

## The filter is CSS only

Two checkboxes drive it through `:has()` + `:checked`. **The filtering itself uses no
JavaScript at all** — both boxes start checked, so scripting-off shows everything and no-JS
never means no content (guardrail 4). (There *is* one script on the page, `timeline.js`, but it
only syncs the URL hash; see *Shareable URLs*. Remove it and the filter still works.) The
inputs are clipped, not `display: none`, so they stay focusable; the focus ring rides on the
label.

**"Merged" was dropped 2026-07-27** (Brajeshwar: *"we are going to see one or the other or both
anyways"*). Both-checked **is** merged, so two independent toggles say it directly rather than
encoding it as a third state. That also makes the earlier radio-group reasoning moot — these
are genuinely independent, so checkboxes are now both the right look *and* the right semantics.

**"At least one always selected", without JavaScript.** When only one box is left checked, its
label gets `pointer-events: none`, so it cannot be clicked off. A keyboard user can still
uncheck it — space on the focused input, which `pointer-events` can't intercept — so each hide
rule additionally requires the *other* track to be checked. Neither-checked therefore hides
nothing and shows the whole timeline. Worst case is a momentarily odd checkbox state, never an
empty page.

A period whose entries are all filtered away hides its own heading, so no orphaned date is left
behind. Verified against the real content: both → 3 life + 12 work over 10 periods; Life only →
3 life, 0 work, **3** periods; Work only → 12 work, 0 life, **8** periods; neither → everything.

`:has()` needs a 2023+ browser, the same bar `--measure`'s `rch` unit already set, so this
excludes nothing that worked before.

## Shareable URLs — `#work` / `#life`

The point: send `/about/#work` instead of a CV link. Brajeshwar wants to retire
`cv.brajeshwar.com` eventually, so this URL has to be as dependable as that site was.

    /about/        both tracks   (the default — no hash)
    /about/#work   Work only     ← the "instead of my CV" link
    /about/#life   Life only

**`#life#work` is not possible** — a URL carries exactly one fragment. It is also unnecessary:
both-tracks *is* the bare URL.

**Two mechanisms, and only ever one live at a time.**

1. **CSS `:target`** (`html:not(.timeline-js)`) — filters on arrival with **JavaScript off**.
   Two zero-height `<span class="timeline-target" id="life|work">` at the top of `.timeline`
   give `:target` something to match. This is the case that has to survive, because the
   recipient's setup is not ours to control. Verified: at `#work` with JS off, life entries are
   hidden and 8 of 10 periods show — *even with both checkboxes ticked*, so the link cannot be
   defeated by stale control state. The suppressed track's box is restyled to read as off, so
   the control never contradicts the page.
2. **`assets/scripts/timeline.js`** — when JS runs it adds `.timeline-js` to `<html>`, which
   switches the `:target` rules **off**, then owns the checkboxes: hash → boxes on load and on
   `hashchange`, boxes → hash on change. Without that handover the two could disagree (arrive
   at `#work`, tick Life, and `:target` would still be hiding it).

The script uses `history.replaceState`, not `location.hash =`: assigning the hash scrolls to
the target and pushes a history entry per click, and toggling a filter is not navigation.
Verified the history length does not grow.

This is the one piece of JavaScript on the page, and it is an enhancement only — with it
disabled, filtering still works and shared links still work; the address bar just doesn't
follow along as you click.

## Download Resume (not built)

Brajeshwar's stated direction: a downloadable PDF labelled "Download Resume", which *is* the
Work track. Nothing has been built for this. When it is, the obvious home is the head row
beside the toggles, shown when Work is the active view — and worth deciding then whether the
PDF is generated from this markup or maintained separately.

## Page opening

There is no title row (removed 2026-07-27). The order is **intro → filter → timeline**:

- **No visible `<h1>`.** The intro opens the page. The heading is kept **clipped** in
  `.timeline-title-a11y` rather than deleted — a document with no heading at all leaves
  screen-reader and search users nothing to anchor on, and the clipped copy costs no pixels.
  Delete the element if that is not wanted.
- **The intro spans the full band**, no measure cap. Trade-off worth knowing: ~140 characters a
  line at 1024px, against the ~66 `design.md` targets. Fine for a short opening; re-cap it if it
  grows.
- **The filter sits directly above the timeline it controls**, left-aligned, no border — a
  control belongs next to the thing it acts on. `.timeline-head` and its bottom rule are gone.
- The `<legend>` is still there for screen readers but clipped — defined locally rather than
  reusing `base.css`'s `.visually-hidden`, which the 2026-07-19 audit flagged as unreferenced.

## The position line (experimental — may be cut)

Brajeshwar: *"I'm not sure of this one but I want to experiment."* It is deliberately the most
separable thing in `timeline.css` — **delete the `.timeline-progress` block and the timeline
still works completely.**

- The fill uses `animation-timeline: scroll()`, wrapped in `@supports`. Chrome/Edge 115+ get a
  filling accent line; every other browser gets the plain spine. No polyfill, no JS.
- It is suppressed under `prefers-reduced-motion`, since a line racing the scroll is exactly
  the sort of motion someone may have switched off.
- `.timeline-step` gives plain `↑ earlier` / `↓ later` anchors between periods — ordinary
  links, so they work with JS off and are keyboard-reachable for free.

Open question for Brajeshwar: whether the fill should track the **whole page** (what it does
now, `scroll(root block)`) or each period independently. The second reads better on a long
timeline but needs one element per period.

## Content

The prose came from the old `_pages/about.md`, placed into periods — Brajeshwar's wording and
links verbatim, only reflowed into entries. He has archived that page and it is now deleted;
the content here is his to rewrite, and he has said he will.

Order is **oldest-first**, following the note at the foot of `about.md`: *"Do this more like a
timeline story, from top to bottom, with years and details."* The CV at
<https://cv.brajeshwar.com> runs newest-first; flipping is a matter of reordering the sections.

What the merge exposed: the existing prose is **almost entirely Work**. Twelve work entries
against three life ones (Imphal, landing in Bombay, registering the domain), and three of the
ten periods vanish under a Work-only filter. The Life track is mostly empty — which is exactly
what "I want to see where they fit" was going to reveal.

## Still to do

- [ ] Fill out the Life track — it is thin, and the merged view is lopsided because of it.
- [ ] Decide oldest-first (current) vs newest-first (CV order).
- [ ] The trailing `> Work-in-Progress` blockquote and the intro line sit outside the timeline;
      decide whether they stay there.
- [ ] Decide the position-line question above, or cut it.
- [x] ~~Move the markup into `/about/`~~ *(done 2026-07-27)*. `/about/#work` is now the link
      worth sending.
- [ ] "Download Resume" PDF for the Work view (see above) — not started.
- [ ] Retiring `cv.brajeshwar.com`: once `/about/#work` is live, that redirect belongs with the
      other Cloudflare Worker redirects already queued in [`todo.md`](todo.md).
