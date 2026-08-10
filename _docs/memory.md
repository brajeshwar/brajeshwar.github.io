# MEMORY — brajeshwar.com docs hub

> `_docs/` is the home for brajeshwar.com documentation. This file is the index +
> working memory: what we're building, the rules, and where things stand. Read it
> first each session; keep it current.

## Where we are (updated 2026-08-10, ninth session) — READ FIRST

⚠️ **NOT PUSHED. Seven commits sit on local `main`** — the five below, this catch-up commit, and
his own `6fc481b3 Phone`, a content edit already sitting unpushed when this session started. Every push
auto-deploys, so none of it is live until he says so. **Check `git log origin/main..main` before
believing any status line in this file, including this one** — the eighth session's opening
sentence claimed "pushed and live" while it was false, for most of a day, and nobody noticed.
⚠️ And note what that check just caught: the eighth session's entry says its six commits "went
out together", which is why `Phone` being unpushed is a surprise. Trust the command.

**The ninth session, worked from the vault queue:**

| commit | |
|---|---|
| `1d14555e` | four todo items retired at his word — `/contact/` form embed, year archives as pages, "Home = text only", "NEXT UP: edit /cv/, /devices/, /own/" |
| `308d781a` | **130 lines of dead timeline CSS gone** — the whole list-shape vocabulary orphaned when `/about/` and `/cv/` became Markdown |
| `3cfa1c2a` | **`.md` twins for HTML pages now convert the BUILT page**, not the Liquid source |
| `a5e7f299` | the `/cv/` vs `/about/` audit re-checked — one live disagreement, not four |
| `586a2e60` | the `/odo` queue moved out of this repo and into the vault |

**Where to pick up** — nothing is half-finished and the tree is clean. What is *waiting* rather
than pending:

| | |
|---|---|
| **Ruby 3.4.10** | deferred at his word, fully written up — [`hosting.md`](hosting.md) → *Versions* and [`todo.md`](todo.md). ⚠️ Bump the WORKFLOW pin, never `.ruby-version` |
| Push, or not | **seven** unpushed commits — six from this session, plus `Phone`. His call |
| `/cv/` vs `/about/` | **one** disagreement — when Oinam Software was founded (2003 Mar + Co-Founder CEO on `/cv/`, 2005 + Founder on `/about/`, with a 2003 Freelance entry between them). His prose, his call |
| `/album/` says Nanocast | `_data/album.yaml` names a different acquirer for the 2006 photograph than `/about/` and `/cv/` do, and the filename agrees with the data. Renaming would change a URL |

⚠️ **Three rows left this table on 2026-08-10 because the work is done**: the dead timeline CSS,
the twelve HTML pages, and *"`/cv/`, `/devices/`, `/own/` — don't work on it yet"*, which he
deleted from the todo outright rather than keeping parked.

⚠️ **The queue left this repo the same day.** It is `~/_/Oinam/1-Projects/devCommands/brajeshwar.com.md`
in his vault, worked with a now-**global** `/odo`, and the done-log is
`~/_/Oinam/1-Projects/devLogs/brajeshwar.com.md`. Neither is visible to `git status` or `_site`,
so if work seems to appear from nowhere between sessions, that is where it came from.

### What the ninth session learned

⚠️ **Three documented "facts" in `_docs/` were wrong, and each had been quoted forward.** This is
the pattern worth carrying, not the individual corrections:

- **`.timeline-when` was listed as live with "9 period labels."** The built site has zero, and
  `_sass/timeline.scss` never carried a rule for it. The claim had already propagated into a
  comment in that file saying `anchors.js` targets it; the script has only ever named
  `.timeline h2[id], .timeline h3[id], .page-now h2[id]`.
- **"An LLM reads the HTML fine" understated the twin problem by a mile.** Those pages were not
  shipping HTML. They were shipping **Liquid that had never run** — `/books.md` contained
  `{% include card-grid.html %}` and listed no books at all.
- **Four `/cv/` vs `/about/` disagreements were two.** `/about/` has had no Mobisy and no
  Razorfish entry since it became a story on 2026-08-09, so neither page can disagree about them.

**All three survived because they were re-read instead of re-measured.** Every one took a single
grep of `_site` to disprove. Verify a claim about the built site against the built site.

⚠️ **The queue left this repo on 2026-08-10.** It is `~/_/Oinam/1-Projects/devCommands/brajeshwar.com.md`
in his vault, worked with a now-**global** `/odo`, and the done-log is
`~/_/Oinam/1-Projects/devLogs/brajeshwar.com.md`. Neither is visible to `git status` or `_site`,
so if work seems to appear from nowhere between sessions, that is where it came from.

### The short version of a very long day

`/about/`, `/cv/` and `/about/brajeshwar.com/` are **Markdown on one shared timeline component**;
`/search/` was **dead in production** and is fixed; every post carries an **"Open in" bar**; and
the local queue lost ~2k tokens of always-loaded context.

⚠️ **Five things here are traps that produced green builds and broken output.** They are each
written up below, and they are the reason this file is worth reading before touching anything:

| trap | symptom |
|---|---|
| Cloudflare Rocket Loader re-runs scripts **after** `DOMContentLoaded` | `/search/` shipped an empty div for months; worked perfectly on localhost |
| An **unterminated CSS comment** is valid CSS | it silently ate `margin` and `max-width` off a rule; surfaced days later as a spacing complaint |
| This site is **plain kramdown, not GFM** | numeric headings get `id="section"`; nine shared anchors died in a green build |
| A **sub-pixel border** paints about half its declared alpha | six colour retunes chased what was a width problem |
| `contains` on a **captured Liquid variable** is silently truthy | would ship a per-page script to all ~1,470 pages |

### The books shelf was rebuilt, twice over

`_data/books.yaml` is gone. In its place:

| | |
|---|---|
| `_data/books/01.yaml`, `a.yaml`…`z.yaml` | 163 books, one file per initial letter |
| `_data/books-favorites.yaml` | the 6 favorites — being in the file IS the flag |

**⚠️ A book is filed by the first letter that is NOT an article.** "The Children" is in
`c.yaml`; the rule covers *The*, *A* and *An*, so "A Room of One's Own" is in `r.yaml` and
"The 5 Elements of Effective Thinking" is in `01.yaml`. 58 of 167 moved when this came in.
`/books/` takes its section headings from the FILENAME, never from the titles — there is no
sorting code to consult and no second place to fix.

**`highlight: true` is gone.** The two grids read different files now, so nothing guarantees
they are disjoint the way `where_exp` did: a book in both renders twice.

**Only `_data/books-favorites.yaml` carries comments.** The letter files are data and nothing
else ("I think the YAML files are easy to understand for me to add more data").

Three things about that split break QUIETLY and are worth re-reading before touching a
template. `site.data.books` is a HASH keyed by filename, not an array — `slice`, `where` and
`where_exp` all stop working, and **`slice` fails silently**: the home strip rendered one item
instead of seven with the build still green. Inside an `include` tag, `group[0]`/`group[1]` are
a hard error instead. And the home strip **no longer shows the newest** — an A–Z split scatters
chronology across 27 files and nothing records when a book arrived, so it shows the favorites.
Do NOT buy recency back with a `read:`/`added:` field; that has been rejected twice.

### 146 book covers, and why the pictures had to be eyeballed

137 covers came from the Open Library Covers API, then 9 more were repaired. **The repair pass
matters more than the first pass**: "The Courage to Be Disliked" matched a record genuinely
titled that, at ratio 1.0, and Open Library simply has the wrong artwork on that cover ID — it
served Namita Gokhale's *Never Never Land*. No metadata check catches that.

So all 144 were laid out on a contact sheet and looked at, which found eight more: *Under
Pressure* showing a Jacqueline Wilson novel, *The Universe in a Nutshell* showing a scanned
paper, *The Cold Start Problem* showing a "COVER TO BE REVEALED" placeholder, and four
foreign-language editions. **21 books still have none** — recent or India-published titles Open
Library has nothing for. Those are his manual task.

### /wear/ became /own/

A new page, `layout: album` + `style: page-own`, reading `_data/own.yaml`. An inventory of
LINES: a category label left, its items scrolling right. The rows **reuse
`.strip__viewport` / `.strip` from home.css** — the site's one horizontal scroller, arrows and
all — overriding three declarations under a `.page-own` prefix.

⚠️ `default.html` gates strip-nav.js on the literal string `class="strip__viewport"`, so that
attribute must stay EXACTLY that, with no extra classes, or the arrows silently stop shipping.

Naming: "Own" is the honest superset — it survives the first laptop or bicycle, where "Wear"
named only one of three groups (Wear / Carry / Keep). `/devices/` stayed a separate page and is
cross-linked, because it is the same objects in a different TENSE: a lineage since 1999 with
dead hardware in it, against an inventory of what is in the house today.

Brand logos keep their own colours and sit on `--logo-plate` — **the one token in themes.css
that does not flip with the theme**, because a brand's artwork has a fixed idea of its own
background. Peak Design's mark is pure black and vanished on the dark theme without it.

### One title treatment, and a spine

Pages had no `<h1>` at all: a Markdown page's `# Heading` is eaten by
jekyll-titles-from-headings, and the HTML pages never wrote one. The layouts emit it now — see
the new section in CLAUDE.md, which is the short version of the rules.

`/archives/` reads its title down the left gutter, `position: fixed`, behind the years at 9% of
the foreground. Two things about it were **wrong on the first try and only found by measuring**:
`container-type` on `main` does NOT make it the containing block (the word landed at x = −110,
off-screen), and gating visibility on the 1024 band rather than 1250 ships a horizontal
scrollbar between 1025 and 1243.

`/now/`'s years are `## YYYY` now, not `#`. That was a note in timeline.scss asking to be done
and it has been: one h1 per page, the two timeline pages agree on level, and the ids survive
because kramdown derives them from the heading TEXT rather than its level.

### Pages that changed shape
- `album.md`, `contact.md`, `music.md` → `.html`. Rendered output is byte-identical bar
  whitespace; `/contact/`'s `<title>` changed from "Contact" to the "Contact Brajeshwar" its
  front matter always said, because the plugin had been overriding it.
- `/books/` runs **six thumbnails a row** (158.2px), via `--card-min: 9.5rem` scoped to
  `.page-books`. Anything from 133.5px to 158.1px gives six at the 1024 band.
- `/blogroll/` deleted — it was live at 200 and now 404s. Nothing on the site linked to it.
- `/own/` is **still unlinked from nav**.
- The 10x Is Easier Than 2x post is **scheduled for 2026-08-13** and 404s until then.

### The work queue: the vault + a global `/odo`

A hand-written queue, worked **top-down** by `/odo`. As of **2026-08-10** both files live in his
Obsidian vault, one pair per project, and the command is global at `~/.claude/commands/odo.md`:

| | |
|---|---|
| Queue | `~/_/Oinam/1-Projects/devCommands/brajeshwar.com.md` |
| Log | `~/_/Oinam/1-Projects/devLogs/brajeshwar.com.md` — `# brajeshwar.com`, then `## YYYY-MM-DD` newest-first, then `- [x] [HH:MM] <his text>` |

Everything in the queue file is work — no sections, no headings. When items are finished the file
is cleared **except** lines beginning `WIP`, which survive verbatim; if nothing survives it is left
at zero bytes so his cursor lands on the first character.

⚠️ **`WIP` at the beginning of a line means hands off, and it cascades to every nested item
beneath it.** He is still writing those. Items are prose *or* bullets — do not rewrite one into
the other.

⚠️ **The old `.claude/commands/odo.md` was deleted, not kept as a fallback** — a project command
shadows the global one, so leaving it would have silently kept the old behaviour. Do not recreate
it. `CLAUDE.local.md` / `CLAUDE.local.log.md` are gone from the repo too; their `.gitignore` and
`_config.yml` `exclude:` entries stay as belt and braces.

The two gotchas from when they lived here still hold for any local file: **gitignore does not stop
Jekyll** (`_site/CLAUDE.local/` was being published until `_config.yml`'s `exclude:` caught it —
separate mechanisms), and **git cannot re-include a file under an excluded directory**, so
`.claude/*` plus `!.claude/commands/` is what made a tracked command possible at all.

### `/about/` became a story, and `/cv/` took the career

Two passes, either side of midnight.

**First** (2026-08-08): the timeline reversed to newest-first, an example `<figure
class="timeline-figure">` floating into the 317px of empty margin every entry already has, and a
live footnote/sidenote example. ⚠️ That figure needed `display: flow-root` on `.timeline-entry`
to contain it — **not `overflow: hidden`**, which would have clipped the spine's absolutely
positioned dots. And the sidenote example needed `full: true` in `page.html` as an *opt-out*,
because the layout adds `.container-ideal` on sight of `class="footnotes"` and that clamped the
whole 1024px timeline to 665px.

**Then** (2026-08-09): the professional history split out to **`/cv/`** — 13 roles rebuilt from
`cv.brajeshwar.com`, dates as the separator rule, company as the heading — with **`/resume/`** a
`layout: redirect` stub pointing at it. And `/about/` took the matching inversion: **the event is
the `h2` now and the year is a quiet `<p>` label**, where the year had been the `h2` and the
event an `h3` under it.

⚠️ **`/cv/` deliberately does NOT use the timeline component.** The timeline makes the date loud
and the entry subordinate, which is right for a story and backwards for a CV. Same reason the
periods on `/about/` were *not* flattened: the two pages now agree on emphasis while keeping
different structures, and collapsing either into the other throws that away.

Three things the `/about/` inversion did not break, each worth knowing before the next change:
the periods and their spines stayed; every shared `/about/#2005-2006` still resolves because the
`id` changed tags and not elements; and the `§` anchor still lands on the year because
`anchors.js` matches `.timeline-when[id]` — **a class, not a tag**. Add ids to `.timeline-title`
and that selector needs widening or the `§` goes missing from the loud line.

`.timeline-when` and `.page-now h2` were one rule and are now two. `/now/` has no events to
promote, only years, so it kept the old treatment — verified by diffing the built `.page-now h2`
declaration before and after, not by looking at the page.

⚠️ **`/cv/` and `/about/` now contradict each other on four facts in public.** Mobisy's title,
Oinam Software's start year (which also collides with `/about/`'s own freelancing period),
Oinam's client list, and Razorfish's headcount wording. Neither page was normalized to the other
— they are his claims. Listed in [`todo.md`](todo.md).

### /search/ was dead in production for months — Rocket Loader

⚠️ **READ THIS BEFORE WRITING ANY SCRIPT FOR THIS SITE.** `/search/` rendered an empty `<div>`
on brajeshwar.com while working perfectly under `jekyll serve`. Not Pagefind's fault, not a 404,
nothing in the console:

**Cloudflare Rocket Loader rewrites every `<script type>` on the live site and re-executes the
scripts AFTER `DOMContentLoaded` has already fired.** The old `pagefind-custom.js` put its whole
init inside a naked `window.addEventListener('DOMContentLoaded', …)` — registering a listener
for an event already in the past. It simply never ran.

The pattern that survives it, and the one every script here must use:

```js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();                       // ← the branch Rocket Loader needs
}
```

`appearance.js`, `sidenotes.js` and `search.js` already had it. Audited 2026-08-09: nothing else
in `assets/scripts/` uses a bare listener. **A bare listener passes every local test and ships
broken** — this is not style, it is the only thing that works in production.

### One search component, two mounts

`/search/` now runs the **same Modular UI as the ⌘K palette**, mounted by the same `search.js`
("Bring the same Search Input that we have globally"). This finished a migration that had been
declared and half-done: `_docs/search.md` has said "Modular UI (not the Default UI)" since the
palette was built, while the page quietly stayed on the ~32 KB Default UI.

Deleted with it: `pagefind-custom.js`, `pagefind-autofocus.js`, and **~7 KB of
`_sass/search.scss`** (11,519 → 4,342 bytes) that could no longer match anything. The result
list was never the page's to style — `.pagefind-modular-list-*` in `chrome.scss` is unprefixed,
so it was always global and `/search/` inherits it.

Two details worth keeping: the palette and the page get **one `Instance` each**, because an
Instance owns its query and a shared one would echo the palette's text into the page behind it;
and on `/search/` ⌘K and `/` **focus the page's own field** rather than opening a modal over it.

⚠️ **`search.html` carries no `<script>` or `<link>` tags any more.** Putting one back
reintroduces the Rocket-Loader ordering bug above.

### /now/ joined the spine

`title_style: vertical`, so it wears the same left-margin title as `/film/`, `/books/`,
`/album/`, `/own/`, `/ideas/` and `/legal/`. Nothing else changed — its `## YYYY` headings and
their `/now/#2024` anchors are untouched.

### The Life/Work filter is gone, and that is what unified the three timelines

⚠️ **`/about/` no longer has a filter, and `data-track` is dead** ("The Life/Work goes away
including the code that powers it"). Removed: the `.pill` fieldset, the `#life`/`#work` target
spans, `data-track` on every entry, `assets/scripts/timeline.js`, and **157 lines of
`timeline.scss`**. `/about/#work` and `/about/#life` now match nothing — correct for a feature
removed rather than moved. The link to send instead of a CV is `/cv/`.

**The unification fell out of the deletion, and this is the bit to remember.** Work entries drew
a *filled* dot, life entries an *open* one — a colorless second signal, since the palette rules
out color. With no tracks, there is one marker: the open dot, which is exactly what `/now/` has
always rendered. So `/about/`, `/cv/` and `/now/` became one component by *removing* code, not
by adding any. Verified by looking at all three at 1400px.

⚠️ **`.pill` SURVIVES — do not delete it.** `appearance.js` builds the appearance panel's
segmented controls from it at runtime, so grepping the markup for `class="pill"` finds nothing
and is misleading.

### /cv/ moved onto the timeline, reversing its own design note

`/cv/` was built the previous day *deliberately not* using the timeline, with a long comment
explaining why: the timeline made the date loud and the entry subordinate, right for a story and
backwards for a CV. He resolved it by fixing the premise instead of choosing — `/about/` leads
with events now, so one component serves both.

So a role is a `.timeline-entry`: company as `.timeline-title`, and `.timeline-meta` as the
**sub-title** carrying date first, then role and place ("The Headings are events and not years.
Years will be a sub-title"). `cv.scss` went from ~40 lines to one rule. **One flat `<ol>`, no
periods** — a CV is a single sequence, and periods would break the spine into fragments.

`anchors.js` gained `.timeline-title[id]`, or the 13 `/cv/#company` ids would have resolved
while offering no visible § to copy.

**The general lesson:** a page-specific stylesheet is often a sign that a shared component is
wrong, not that the page is special.

⚠️ **`/about/`'s period labels were KEPT.** "Years will be a sub-title" reads as being about
heading hierarchy, and every entry's `.timeline-meta` already carries its own date, so the
sentence is satisfied without touching markup. Dissolving the periods would have forced two
inventions — authoring dates onto the two entries that have none (Razorfish, Computer Graphic
Designer), and relocating nine `#2005-2006`-style ids onto entry headings. If he wants the
period labels gone too, that is a separate, deliberate change.

### The spine, the dots, and a bug hiding behind reduced-motion

Three tunings on the shared timeline, all measured in the browser rather than eyeballed:

**The spine is a `::before`, not `border-left`.** A border spans its whole box and cannot begin
partway down, so 16.5px of line hung above the first dot. ⚠️ **The list's `padding-left` grew by
the rule's 2px to absorb what the border used to contribute** — miss that and every entry shifts
left and the dots leave the line.

**Dots are solid `--accent`.** They were a page-coloured fill with a 10%-alpha border, which at
11px read as a gap in the line rather than a point on it. `--accent` is monochrome by default
(chroma 0) and inverts cleanly — 0.205 on 0.97 light, 0.97 on 0.205 dark — so the page stays
colourless unless the reader chooses otherwise.

**One token now drives the dot's position, the spine's top and the progress fill's top:**
`--timeline-dot-center`, defined as the middle of the first line of whatever leads an entry —
an h2 on `/about/` and `/cv/`, body text on `/now/`. That is why it is a variable: his ask
carried its own exception, *"(if there are as in the /about/)"*. The hardcoded `0.55em` it
replaced was accidentally right for `/now/` (11px against a true 10.7px) and 2.25px high on
`/about/`.

⚠️ **NEVER PUT AN `em` IN A CUSTOM PROPERTY THAT CROSSES ELEMENTS.** A custom property inherits
as an unresolved token, so `0.55em` set on the list resolves against the font size of whatever
*uses* it — the spine and the dots would silently disagree. Absolute math on the scale tokens
has no such trap.

**And a latent bug found only by measuring.** `.timeline-progress` carried the DOT's `left`
formula, which is relative to an entry, while being a child of the list — so it painted 42px
left of the spine it fills (spine x=244–246, fill x=204). It went unseen because
`prefers-reduced-motion: reduce` sets it to `display: none`, and that was on. **A rule you never
see render is a rule nobody has checked**; it now takes the spine's geometry verbatim instead of
its own arithmetic.

### HTML, not Markdown — settled, and for a new reason

He asked three times across two days, so it is written down in [`timeline.md`](timeline.md) now.
The original justification — entries needing a `life`/`work` tag — **died with the filter**. The
decision survives on something stronger and parser-level:

**kramdown does not parse Markdown inside block-level HTML.** Both pages need a wrapper per item
to carry the classes the CSS targets, and the prose lives inside those wrappers. Verified
against this site's own parser: `[Razorfish](…)` and `*learned*` reach the browser as literal
text. `markdown="1"` on every wrapper fixes it and is *more* markup than the HTML it would save.
A Markdown `/about/` would be a file where Markdown fails in the only places there is prose.

⚠️ It is a fact about the parser, not a preference. If it is revisited, test it first.

### The spine went hairline, and reused his own number

`--timeline-rule` is `var(--border-size-hairline)` (0.75px) rather than 2px, and the spine takes
**`--rule-strong`** — the header and footer's colour, asked for by name.

⚠️ **`--rule-strong` had a "these two only" note in themes.scss, and now has three users.** The
note was amended rather than quietly broken: the spine earns it on the same logic (a structural
line bracketing content, not a border round a box) and NEEDS it, because `--rule` at 0.75px is
very nearly invisible. A fourth user needs an argument, not this precedent.

**0.75px is his own settled number, not a new one.** It was arrived at earlier by rendering
options for him after his first ask — 0.1pt — measured out to 0.133px, which rounds to nothing
on any display. Reusing `--border-size-hairline` keeps the spine tied to the site's one hairline
value instead of forking it. Renders as 1.5 device px at dpr 2, a clean 1px at dpr 1.

**Dots are `--marker`, ONE RUNG above the spine.** `--color-marker` is a **46%** mix of the
foreground where `--color-border-structural` (the spine) is 32% — the same **+14** step the
ladder already takes from `-strong` (18) to `-structural` (32). Measured by compositing both
over the page: **1.44× in light, 1.43× in dark**.

⚠️ **IT WAS 64% — "exactly twice the spine" — FOR ONE BUILD, and this file told you to keep it
there.** That was wrong on the page: *"The dots accent it too high … let's try one more with one
step accent darker than the vertical line."* The lesson is precise and worth keeping: anchoring
the dot to the spine was right, and **doubling was the wrong size of anchor**. A ratio *sounded*
principled and simply looked heavy; the ladder's own step size is the better rule because it
keeps this tier inside the same progression as the three above it.

⚠️ Four passes total, each a real correction: solid `--accent` read heavy against a hairline; a
75/25 mix toward the page was still too dark; twice the spine was defensible arithmetic and
still too strong; one rung is where it landed. **If `-structural` moves, move this by the same
absolute step — not by a ratio.**

⚠️ **The dots no longer track `--accent`.** That is the deliberate trade — a dot defined against
the line cannot also follow a colour the reader picks in the appearance panel. His instruction
names the line, so the line wins. **If he ever asks for accented dots again, that is a genuine
conflict with the ladder anchoring, not an oversight to quietly fix.**

⚠️ `--timeline-rule` is **load-bearing geometry**, not just a width: it also sets the list
padding that stops entries shifting, and half the dot's left offset. All three move together.
After any change, re-measure that dot-centre and spine-centre share an x — all three pages came
back 0.000 off, with 0.00 tip and 0.00 vertical offset.

*(A scare that wasn't: `<footer>` itself has no border — `.footer-inner` carries it. Querying
the wrong element made the footer look like it disagreed with the header. It does not; both are
`--rule-strong`.)*

### The local queue split in two, and why

`CLAUDE.local.md` is now **the queue and nothing else** — no `## DO`, no
`## MAYBE / LATER / ICEBOX`, no `## DONE`. Everything below its H1 is work
(*"anything in this file is now a do"*), and `WIP` at the START of a line marks an item as
hands-off. The finished-item log moved to **`CLAUDE.local.log.md`**.

⚠️ **The reason was context cost, and he found it from the `/doctor` report.** The done-log had
grown to ~1.4k est. tokens of *completed* work being read into context every session. After the
split:

| | before | after |
|---|---:|---:|
| `CLAUDE.local.md` | ~1,410 est. tokens | **~8** |
| `CLAUDE.md`'s queue section | ~1,361 | **~735** |

**~2,033 est. tokens off every session**, for guidance that was either finished or duplicated in
`.claude/commands/odo.md`, which loads only when `/odo` runs.

⚠️ **THE NEW FILE NEEDED BOTH EDITS**, the same trap as the first one: `.gitignore` keeps it out
of the repo and `_config.yml`'s `exclude:` keeps it out of the build. Neither implies the other,
and `CLAUDE.local.md` was gitignored while still rendering to `_site/CLAUDE.local/`. Verified
`_site` has no `CLAUDE*` at all.

### ⚠️ Sub-pixel borders lie about their own alpha — it was a WIDTH problem

The timeline dot took **six colour treatments in one day** and none of them fixed it, because
the problem was never the colour. A border declared at `--timeline-rule` (0.75px) **computes to
0.5px** and antialiases to about half coverage, so it paints roughly half its declared alpha. A
background width does not.

Measured on the dot ring against the spine:

| | alpha | computed width | ink per column | vs spine |
|---|---|---|---|---|
| ring at `--timeline-rule` | 0.32 | **0.5px** | 0.160 | 1.19× |
| ring at `--border-size` | 0.32 | **1px** | 0.320 | **2.37×** |

Same colour, same tier — the margin doubled on width alone. `box-sizing: border-box` keeps the
disc at `--timeline-dot` either way, so widening the border costs no diameter.

**The rule to carry forward: never compare a border tier to a background tier by their
percentages, and when a hairline reads too weak, check the computed width before reaching for a
darker colour.** Five retunes of `--color-marker` were spent on the wrong variable.

### The timeline spine moved to the menu separator's tier

The spine is `--border-color-high` (18%) — the same token as the header's menu separator — not
`--rule-strong` (32%). He offered two ways to make the dot read darker than the line: *"push the
darkness of the dot a tad more or try doing the vertical line to the same as the vertical bar
that separates the menu."*

**Took the second, and it was better than a colour tweak for three reasons:** it matches like for
like (both are vertical hairlines, and both now sit on the tier a vertical hairline needs); it
**retires an exception** — `--rule-strong` is documented as the header and footer's alone, and
the spine had been added as a third user that same morning, so it is back to two; and it widens
the gap to the dot's 60% border without touching the dot, which had been retuned five times
already.

⚠️ **The line got LIGHTER so the dot would read darker.** Anyone later "fixing" the contrast by
pushing the spine back toward `--rule-strong` undoes it and flattens the dot against the line
again.

### Vertical hairlines need a darker tier than horizontal ones

Both pipe separators — the header's, between the nav words and the tool glyphs, and the
`page-actions` bar's — took `--rule` (10%) and were invisible. They take `--border-color-high`
(18%) now.

The generalisable bit: **a vertical hairline shows far less of itself than a horizontal one.**
It is one or two device pixels wide over a line or two of text, where a horizontal rule spans
the page — so the tier that reads correctly as a rule disappears as a pipe. His placement was
exact: *"lighter than the header/footer but darker than the pipe separator"*, which is the
middle rung between `--rule` (10%) and `--rule-strong` (32%).

### The two habits this session kept proving
1. **Count the items; do not trust the exit code.** A green build hid a one-item home strip, a
   lost book ("Absolute and None", from a strip pass that was not idempotent), and a title
   positioned off-screen.
2. **Look at the pictures.** Metadata matching cannot catch a correct record with the wrong
   image attached to it.
3. **The live site is a different runtime from `jekyll serve`.** Cloudflare Rocket Loader
   rewrites script tags in production and nowhere else, which is how `/search/` stayed broken
   for months while every local check passed. Confirmed the fix the same way it should have
   been caught: opened brajeshwar.com and used the ⌘K palette, which proves `search.js` runs to
   completion under Rocket Loader — and `/search/` now mounts from that same guarded `init()`.
4. **Grep for a token's definition the way it is written, not the way you would write it.**
   `config.scss` aligns its colons — `--border-size           : 1px;` — so a search for
   `--border-size:` returns nothing and every alias token looks undefined. The ground truth is
   the built `site.css`, not the source.
5. **A doc is a claim, not a fact.** `_docs/hosting.md` asserted the repo had no
   `.ruby-version`; it has had one since 2025-06-28. Reading the doc and believing it nearly
   produced a confidently wrong recommendation. Check the assertion, then read the doc.

### Ruby 3.3.5 — why we are on it, and why the reason no longer holds (2026-08-09)

Asked why the build is "stuck" on Ruby 3.3.5, and what GitHub Pages supports.

⚠️ **GitHub Pages supports nothing here, because it never builds this site.** No
github-pages gem, and the workflow hands `deploy-pages` a finished static artifact. The
[Pages dependency versions](https://pages.github.com/versions/) list — Jekyll 3.10, and a
Ruby of its own — governs "Deploy from a branch" sites only. **We can run any Ruby we like.**
That answer will be needed again; it is written up in full under *GitHub → Versions* in
[`hosting.md`](hosting.md).

The pin's real origin is in the git log, all on 2025-06-28: `a49019b7` set 3.3.4 *"Github
Pages version of 3.3.4"* (the misreading above), `4eaedc06` tried 3.4.4, and `f96455cc`
reverted it hours later — *"Cloudflare is not happy with the latest Ruby version"*. The
Cloudflare v2 image of the day shipped Ruby 3.2.2 and could not supply 3.4.4, so that was an
image limitation, not a gem incompatibility. **Nothing in the dependency tree pins us:**
sass-embedded is strictest at `>= 3.1`, Jekyll 4.4.1 asks `>= 2.7.0`, and `logger` is already
in the Gemfile. 3.3.5 is seven patches behind its own branch (3.3.12 is current).

⚠️ **Two claims in `hosting.md` were false and are now corrected in place** — the file keeps
the original text with a dated correction beneath it, per the log-history rule:

| the doc said | actually |
|---|---|
| *"we deliberately do not add a .ruby-version"* | it is tracked, `3.3.5`, since 2025-06-28 — and was there when that line was written |
| *"nothing in the repo records why it was really picked"* | `f96455cc` records it verbatim |

The first one matters most, because a **whole argument was built on it**: the doc claimed
Actions and Cloudflare ran different Rubies, making the backup an early warning that an
upgrade was safe. Cloudflare reads `.ruby-version` from the repo it clones, so **both
builders are on 3.3.5 and that early warning does not exist.** The Cloudflare build log
prints the Ruby it installs and would settle it in one line; that has not been checked.

⚠️ **`.ruby-version` and the workflow pin are not interchangeable.** `.ruby-version` moves
local dev *and* the backup; the workflow moves production alone. **A bump goes into the
workflow first** — that is what keeps the standby on the old Ruby and therefore worth having.
(This reverses a suggestion made earlier the same day to point CI at `.ruby-version` for a
single source of truth: it is a single source of truth, and that is exactly the problem.)

**The bump itself is deferred, not rejected** — his call: *"We will revisit this later."*
3.4.10 is the target when it happens, not 4.0.6.

## Session record — 2026-08-04, seventh session (superseded as the index head, kept per the log-history rule)

### ⏸ FOUR commits sit UNPUSHED on `main`, awaiting his word — guardrail 7.

`origin/main` is four behind, every one signed (`G`) and in his name. **Two of them pre-date
this session** and were already waiting:

| commit | |
|---|---|
| `e507e852` | Docs: close the sixth session *(2026-08-02, was already unpushed)* |
| `be262f85` | User Experience of Nomenclature *(his own content commit)* |
| `4a2357ab` | Books: a CSS bookplate for entries with no cover picture |
| *(HEAD)* | Docs: record the bookplate — this file; its own hash changes if it is amended again |

Books can now be listed **without cover pictures**. Brajeshwar, 2026-08-04: *"I want to
start adding more books but I don't want to spend time editing the book cover pictures
now. Can we do a clean, nice book-esque design in CSS or SVG as the placeholder for books
listing without a picture?"*

An entry in `_data/books.yaml` with no `img` renders a **`.bookplate`** instead of a broken
image: a plain bound board drawn in CSS — the spine and its hinge down the left, the title
set in a serif on the paper face, a short rule, the author beneath in letterspaced caps. A
shelf of them reads as a library's unjacketed stock. **Adding a book is now a title, an
author and a url**; the picture is optional and can arrive later with no other change.

**This answers half of the question parked since 2026-07-27** — "SVG covers vs a plain text
block". It is neither: CSS. `_docs/todo.md` records why (an inline SVG repeats its markup in
every card on a page held under 100 KB, and SVG text does not wrap, so every long title
would need a hand-placed line break — exactly the per-item maintenance he is avoiding). The
OTHER half of that todo, "Home = text only", is untouched and still his to call.

**Nothing here touches content.** `_data/books.yaml` is unchanged; the plates were verified
against entries injected into the BUILT `_site`, which is disposable output. His own
in-progress edit to `_posts/2018/2018-01-31-books.md` was left alone and unstaged.

### What this session did

| file | |
|---|---|
| `_sass/bookplate.scss` | new — the whole component, 1.7 KB raw / **+319 bytes gzip** |
| `_includes/card-grid.html` | `img` → plate fallback for /books/ (and /album/) |
| `_includes/home-strip.html` | the same fallback for the home shelf |
| `_sass/home.scss` | the plate wears the shelf's grayscale-at-rest |
| `assets/styles/site.scss` | `@use "bookplate"`, after `cards` |
| `CLAUDE.md`, `_docs/todo.md`, `_docs/memory.md` | 16 partials now; the parked item |

**Verified against the served build, not by looking**: 3:4 at every size; the type scales
with the plate (18.1px title at 193px in the /books/ grid, 16.3px at 173px, 13.8px at 146px,
the 12px clamp floor at the 120px phone shelf); the author line drops below a 150px plate;
the longest title in the data and a deliberately absurd 78-character one both set inside the
board; no sideways scroll at 320/375/480/768/1024; painted colors read off a canvas in all
**six** palette/mode combinations; the shelf hover exercised with a REAL hover (plate
`grayscale(1)` → `(0)` while an un-hovered cover beside it stays at `1`); Pagefind still
indexes 1,486 pages.

The Liquid was verified by building against a **copied** data directory —
`data_dir: _data_liquidtest` in an override config, destination outside the repo — so the two
img-less fixture books went through the real includes with `_data/books.yaml` never touched.
An entry with a title and no author renders correctly: title, rule, no empty author span.

⚠️ **The spine inverts in dark mode.** It is a `color-mix` of `--text-color`, which is
near-white there, so the band paints LIGHTER than the board and the crease reads as a
highlight rather than a shadow. Looked at, not reasoned about: it reads as light catching the
binding edge of a dark book. Left alone deliberately — a mode-specific value would put a raw
color outside `themes.scss`. The warning is on the rule itself.

### Rules learned this session — these will bite again

1. **⚠️ A QUERY CONTAINER CANNOT READ ITS OWN CONTAINER UNITS, AND THE FAILURE IS SILENT AND
   BACKWARDS.** `container-type: inline-size` plus `padding: 10cqi` on the SAME element does
   not error and does not resolve to zero — the `cqi` falls through to the next container up,
   which on /books/ is the 1024px page. Measured: padding computed to 102px and 164px inside
   a 193px card, the plate blew out to 257px, and its content box collapsed to **1px**. A
   container query measures the CONTENT box, so every plate then reported itself as 1px wide
   — the title fell to its clamp floor and a `@container (max-width: 150px)` rule matched at
   full size. It reads exactly like "container units are not supported here". They were.
   The fix is structural: keep the container's own box free of `cqi` and put every container
   unit on descendants. A padding-free container has the second virtue that its content box
   equals its border box, so 1cqi is honestly 1% of the visible element.
2. **A pseudo-element belongs to the container rather than sitting inside it** — same trap,
   one layer down. `.bookplate::before { width: 7cqi }` resolves against the PAGE. Use a
   percentage there; on an absolutely-positioned box it resolves against the containing
   block, which is the element you meant.
3. **base.scss rounds every image on the site** — `main :where(img, video, iframe) {
   border-radius: var(--border-radius) }`. Anything standing in for an image must declare the
   same 7px or it is the one hard-edged card in a grid of soft ones. Found by reading the
   matched rules off a cover, not by looking at it.
4. **`.album figure span` is (0,1,2), and a new component inside a `<figure>` will lose to
   it.** One class beats two elements only when the class COUNT is higher, so
   `.bookplate__title` at (0,1,0) loses and `.bookplate .bookplate__title` at (0,2,0) wins.
   Unfixed, the plate's title would have rendered at `--step--2` in `--text-color-low` — i.e.
   as a second caption — with the CSS reading as applied. Same shape as the
   `.item__cards.card-grid--masonry` trap.
5. **`aria-hidden` means nothing to Pagefind.** Any markup that repeats visible text needs
   `data-pagefind-ignore` as well, or the page carries it twice in the index. header.html and
   footer.html already do this; the pattern was there to copy.
6. **Verify a data-driven component by mutating `_site`, never the data file.** `_site` is
   disposable build output, so a throwaway script can inject as many fixture entries as the
   test needs — real stylesheet, real fonts, real grid — with `_data/*.yaml` untouched
   (guardrail 1) and nothing of his at risk while he edits the same tree.

### Picking this back up — the shortlist

**And then he filled it.** *"Extract all the books from /2026/books/ and update the
books.yaml, I want to see how it looks."* Nine books from that post appended to
`_data/books.yaml`, none with an `img` — so `/books/` now runs six covers and nine plates,
and the home shelf is nine-tenths plates. `_data/*.yaml` is a guardrail-1 file and this was
his explicit instruction, which is the only thing that opens it.

⚠️ **The Design of Everyday Things is in that post and was NOT added again** — it is already
in the file with its cover and `highlight: true`. Check for a duplicate before appending; the
two grids are disjoint views of one list, so a repeat would show up twice on the page.

⚠️ **The home shelf shows no cover photographs any more.** `home_books_count = 8` takes the
eight newest entries, and all eight are coverless 2026 books. Not a bug, but if he wants a
mix, that is the number to raise, or the books to give covers.

### ⚠️ THEN THE WHOLE FILE FLIPPED: `books.yaml` IS NEWEST-**FIRST** NOW (2026-08-04)

*"We need to reverse the books shown in the home page. The last one should be the first in
the books.yaml as I will add at the top and not at the bottom. This applies the same for
/books/ except for the highlights…"*

**This reverses the 2026-08-01 protocol** — *"the latest is always the last entry in the YAML
file"* — which is quoted at length in `index.html` and stays there, because the reasoning
behind it (no `read:` date, a re-read has no single date worth recording) did not change.
Only the direction did. **Do not re-append at the bottom.**

Three things moved, and only one of them was code:

1. **`_data/books.yaml` was reversed end to end.** Not re-sorted — *reversed*, so every
   relative position survives and only the direction flips. Proved rather than eyeballed:
   `after == before.reverse` was asserted field-for-field on the parsed YAML before the old
   file was let go. The year-marker comments were re-emitted in the new order; they are
   comments, and nothing reads them.
2. **`index.html` dropped its `reverse` filter** — `site.data.books | slice: 0, 8`, a plain
   take off the head. ⚠️ **The album line still has its `reverse` and must keep it**:
   `_data/album.yaml` is still newest-LAST. The two shelves now disagree about where "newest"
   lives, which is exactly why one line has the filter and the other does not.
3. **`_pages/books.html` needed no change at all**, and that is now load-bearing rather than
   incidental: it never reordered anything, so the absence of a filter there is the feature.
   Do not add one.

**The home strip renders byte-identically to before the flip** — same eight books, same order
— which is the check that the two changes cancel. `/books/` is the page that visibly changed:
it reads newest-to-oldest now.

**Highlights are untouched and still disjoint**, as he restated: 4 in the favorites grid, 172
in the main grid, zero overlap, 176 accounted for. The split is `where highlight == true` /
`where_exp highlight != true`, so it is disjoint by construction and a book's `highlight`
does not move it in the file.

### ⚠️ AND THEN HE SHUFFLED IT — the current order is RANDOM, and that is not damage

*"Remove the comment separator in books.yaml. And do a random sweep of the list - make the
items random before I do my manual edit."* Both done in one commit: the year separators are
gone and all 176 entries are in a shuffled order, staged for a hand pass he intends to make.

**Do not "restore" chronology.** Two things make that safe to leave alone: each book still
records its own year in `url` (`/2019/books/`), so the separators carried nothing that is not
still in the data; and the shuffle was **seeded** (`20260804`), so the previous newest-first
order is exactly recoverable from the commit before it in `git log -- _data/books.yaml`.

⚠️ **The head of the file is no longer "newest", so the home strip's eight are eight random
books** until he reorders — flagged to him before the change, not after. The add-at-the-top
protocol still governs anything NEW he types; it is the existing 176 that are unsorted.
The favorites grid shuffled too, for the same reason: it inherits the file's order and has
none of its own.

**Proved rather than eyeballed, again**: the parsed list before and after is the same set of
entries order-independently, the order did change, and the highlight and img counts held at
4 and 7. That is the check that a rewrite of every line in the file moved nothing but order.

### The strip's hover background is gone; the plate's own rules darken instead

*"With this new style, the hover on the homepage looks really ugly. Remove the background and
on hover, darken the borders of the books design."*

**Why the wash stopped working, because it is a general lesson.** It was right for a row of
photographs and wrong for a row of bookplates. A plate is a pale board with a hairline edge;
`--bg-color-low` painted a few pixels outside that edge is a second, softer border around the
first — two concentric boxes of nearly the same value. That near-miss is what reads as "ugly"
without being nameable. Against an opaque photograph the same wash only ever showed below the
caption, which is why it worked for three days and then did not.

- **`--bookplate-rule`** is new and is the whole mechanism: the board edge, the spine's hinge
  and the rule under the title all read it, so hover sets ONE property and three lines move
  together and cannot drift. Custom properties inherit, so `::before` and `::after` get it.
- **The hover lives in `bookplate.scss`, not `home.scss`**, keyed
  `:is(a, .strip__link):hover .bookplate`. A plate is hovered on `/books/` too; keying it to
  `.strip__link` would have given one component two hover states on two pages. `:is()` and not
  a bare `a` because a url-less book renders its strip item as a `<span class="strip__link">`.
- **`transition` is declared at REST**, not in the hover block — a transition is read from the
  state *before* the change, so hover-only gives an instant snap in and a fade out.
- ⚠️ **Measuring it gives `transition-duration: 0s`, and nothing is wrong.** base.scss's
  global `prefers-reduced-motion: reduce` block zeroes it with `!important`, and he browses
  with reduced motion ON. The 120ms is in the compiled stylesheet; verified both ends.
- **Do NOT reach for an underline as the replacement.** That is what the wash replaced on
  2026-08-01, and it never painted: it was set on `.strip__caption`, a `<span>`, while
  `text-decoration` is drawn by the nearest block-level ancestor that declares it, and
  `.strip__link` declares `none`. The rule computed exactly as written and did nothing.

**Measured with real hovers on both pages**, not read off the selector: home strip link
background stays `rgba(0,0,0,0)`; board edge, spine hinge and title rule all go 177 → 108 in
light/default; grayscale still lifts and the caption still darkens. On `/books/` the same
border move happens (0.32 → 0.6 alpha) alongside the existing opacity 0.8 → 1.

**`url` points at `/2026/books/` for eight of the nine**, because that is where each is
actually written about and there are no per-book posts. How to Read a Book has its own review
and points there. That is a one-word edit per entry if he wants it different.

The plate is deliberately uniform: no per-book tint, no generated variation. That is the
ethos ("nothing arbitrary"), and it is also the honest reading — a shelf of plain bindings.
If a shelf of twenty ever feels monotonous, that is the first thing to revisit, and it is a
decision rather than a bug. Two alternates were rendered and shown to him alongside the
shipped one, each a one-line change: **B**, no spine with a blind-stamped inset frame
instead, and **C**, title only with no rule and no author. A was recommended and shipped
because the spine is the quiet detail the ethos asks for where the inset frame is chrome,
which [`design.md`](design.md) argues against.

⚠️ **`_pages/styleguide.md` documents the thumbnail and card system and does not mention the
plate.** It is a `_pages/**` prose body — guardrail 1 — so updating it is Brajeshwar's edit
to make, not ours. Same disposition as the `.gallery` prose from the sixth session.

Open items are in [`todo.md`](todo.md). The ones that need HIM, unchanged from 2026-08-02:
Baskerville's fate; the styleguide's gallery prose (guardrail 1); the 86.3 MB of unreferenced
year-folder masters; `/static/films/` re-cuts; `/devices/`' one `<a href="">`.

---

## Session record — 2026-08-02, sixth session (superseded as the index head, kept per the log-history rule)

### ✅ Session CLOSED 2026-08-02. Everything deployed green and verified live; ONE
### docs-only commit (this close) sits unpushed, awaiting his word — guardrail 7.

Ten commits pushed across two deploys, both green, every commit signed (`G`) and in
Brajeshwar's name. Verified against the live site, not `_site`: the hashed stylesheet
carries Source Serif 4, the 0.75px hairline and the gallery bleed;
`SourceSerif4Variable-Roman.822bcfc3.woff2` serves 200 at its exact built size (63,644
bytes — `hash-assets.mjs`'s first run over a brand-new font directory, clean);
`/2024/locavore/` renders the gallery; `/2025/kids-smartwatch-not-so-smart/` serves all
six new footnotes. The eleventh commit is the session-close docs pass (todo, memory,
one styles.md correction) — **push it when he asks, nothing else is pending.**

### What this session did

1. **The in-post image gallery.** `.gallery` bleeds past the band to `min(100vw,
   1600px)`, centered, with /album/'s masonry on its `<ul>`. Fourth user of
   `--body-width-full`. Details below and in [`styles.md`](styles.md) §6.
2. **Serif → Source Serif 4**, variable, subset to 64+65 KB, on-demand as ever; Libre
   Baskerville kept dormant for the flip-back. Details below.
3. **The hover system**: Books/Album strip titles are full-row hit areas; every hover
   underline/border standardized on `--border-size-hairline` (0.5px → 0.75px same day, his
   pick from rendered options); link TEXT darkens on hover site-wide, homepage toc rows
   included, dates and leaders excluded by their own colors.
4. **Six researched sidenotes** for `/2025/kids-smartwatch-not-so-smart/` — content work
   he asked for by name; every fact web-verified before writing.
5. **His content committed alongside**: the phone-post figure decision (gallery → large),
   two copy edits, two new drafts (`ux-nomenclature`, future-dated Aug 8; a 2099 London
   todo).

### Rules learned this session — these will bite again

1. **He specs line thickness in typographic points, and literal conversion goes wrong in
   BOTH directions.** "0.1 point" = 0.13px rounds to NOTHING at dpr 1; his follow-up
   "0.25" was 0.33px — *thinner* than the 0.5px already shipping that he was calling
   invisible. Translate to device pixels, present rendered options, let him pick
   (he chose 0.75px). Do not implement the literal number.
2. **Identical 1px borders paint differently at different sub-pixel positions.** Books'
   strip border sat at device-pixel fraction .55 and smeared 2 device px of ink across 3
   rows; Album's sat at .95 and painted crisp. His eye caught it; the CSS was identical.
   The leader-dots lesson (fifth session) generalized to borders: fractional position, not
   size, is often the perceived difference.
3. **A resting state at the ramp end makes "darker on hover" impossible — and a (0,1,1)
   resting declaration silently blocks a `:where()` hover.** `.toc__link` had both
   problems at once. The fix is always the same shape: lighten REST (the room is there),
   and declare hover at the same specificity as rest.
4. **Never chain two custom fonts in one stack.** During `font-display: swap`'s interim
   the browser renders the next matching family — downloading it too. One custom family
   per option, system stack behind it. Recorded in config.scss and themes.scss.
5. **jekyll-optional-front-matter turns ANY bare `.md` into a published page.** A font
   directory's `LICENSE.md` would have rendered as HTML at its own URL. Exclude such
   files in `_config.yml`; the exclusion comment says why.
6. **`50cqi − bleed/2` centers a body-width box from INSIDE the article.** photo-cover's
   `width: 100%` trick only works as `main`'s sibling; within the 665px article the band's
   midpoint (50cqi) is the usable anchor because band-center == body-center. The anchor
   assumption: article flush on the band's left edge, no intermediate padding.

### Picking this back up — the shortlist

Open items are in [`todo.md`](todo.md) → *Raised 2026-08-02*. The ones that need HIM:
Baskerville's fate (flip back or delete, after living with Source Serif 4); the
styleguide's gallery prose (guardrail 1 — his edit). Standing from earlier sessions:
the 86.3 MB of unreferenced year-folder masters (his call), `/static/films/` re-cuts,
`/devices/`' one `<a href="">`.

### How to verify a change (the loop that works)

`bundle exec jekyll build` → serve `_site` with a ThreadingHTTPServer → **measure in the
browser, don't look** — canvas pixel readback for colors, getBoundingClientRect for
geometry, real hovers via element refs, the iframe sweep (320/480/768/1024/1512) for
layout. Everything real this session was sub-visual: a 0.27-device-pixel line, a .55
fractional border position, a hover color change of 13 RGB points.

### The Serif option is Source Serif 4 now; Libre Baskerville is dormant, not deleted.

Brajeshwar, 2026-08-02: *"Let's switch the Serif option to Source Serif 4 but keep
Baskerville. I want to see how things are. However, our default should always be the system
fonts. The custom fonts are loaded only on demand and served from the same server locally."*

All four conditions were already the architecture or became one change each:

- **The swap is ONE line** — `[data-font="serif"]` in `config.scss` now names
  "Source Serif 4". The stored value `serif` did not change, so no reader migration and no
  `default.html` no-flash edit; of the FOUR places that must agree for a font option
  (styles.md §"data-font axis"), only the `[data-font]` rule and the `@font-face` moved.
- **On-demand was already true and stays true** — `@font-face` + `unicode-range` +
  `font-display: swap` download a face only when text uses the family, and the family is
  only referenced under `[data-font="serif"]`. Measured: a System-default load makes ZERO
  font requests; a Serif load fetches exactly the two Source Serif files (62 + 64 KB
  transfer) and nothing else.
- **Self-hosted** — `assets/fonts/source-serif/`, hashed by `hash-assets.mjs` in CI like
  every other font. Sources: Adobe's official release (adobe-fonts/source-serif, 4.005R).
- **Baskerville kept** — files and `@font-face` blocks intact, nothing references the
  family, so its faces cost zero bytes on the wire. Reverting = pointing the one
  `config.scss` line back. ⚠️ Never chain both serifs in one stack; the `swap` interim
  would download the second family too (recorded in config.scss and themes.scss).

The files: upstream variable TTFs are 1.2 MB (Roman) and 850 KB (Italic); shipped woff2 are
**64 + 65 KB**, Geist-class. The cut, recorded with the recipe in `themes.scss`: pin `opsz`
at its default 20 (body text renders 16–20px, so shipped outlines are byte-identical to what
an unpinned font would draw there), clamp `wght` to 200:700 (site uses 200/400/600, plus
700 for `<strong>`'s UA `bolder`), subset to the Geist unicode set with default layout
features. Verified by reading the BUILT files, not the byte counts: `wght` axis alive at
200–700 both faces, GPOS kern/mark/mkmk and GSUB liga/frac survive, all ten default digits
are 500/1000em so `tabular-nums` (archives, home dates) needs no `tnum`, and ’ “ ” – — • …
are inside both the cmap and the declared `unicode-range` — the Baskerville apostrophe bug
class cannot recur. In-browser: Serif renders Source Serif 4 with real 200/700 and italic,
no Baskerville request, System default untouched.

⚠️ **Two things that will bite later:**
- **A weight token past 700 will silently flatten to 700** — the clamp was cut to what the
  site uses. Re-subset wider if `--font-weight-*` ever exceeds it; recipe in themes.scss.
- **`assets/fonts/source-serif/LICENSE.md` must STAY in `_config.yml`'s exclude** — not for
  weight but because jekyll-optional-front-matter renders any bare `.md` into a published
  page. The TTF sources are excluded beside it, Geist-style.

### Link text darkens on hover, site-wide; the hairline grew to 0.75px

Second round on the hover work, same day. Brajeshwar: *"make the hover text color darker
than the normal state. Of course, just the titles… without highlighting the dates. I
realize, this is for all A HREFs."* And: *"the hover thickness that we added 0.1 recently
isn't working, add 0.25 instead."*

- **Global link hover color**: the base `:where(a:hover…)` block now goes to
  `--text-color`. The room already existed — rest is `--text-color-link` (gray-900, or the
  reader's accent), one step shy of the gray-950 body text — same far-end reasoning as the
  2026-08-01 underline fix. With a color accent set, links rest in the accent and darken to
  full text: "darker or more accented", both.
- **The homepage toc needed its own fix and the reason is a trap**: `.toc__link` rested on
  `--text-color` — the ramp end, so "darker on hover" was arithmetically impossible AND its
  (0,1,1) resting declaration silently blocked the base :where() hover. Rest moved to the
  link token (now agrees with the archives rows), hover declared explicitly in the row's
  own hover block. Dates and leader dots never move: they carry their OWN colors, which is
  the only reason the anchor's color can swing without dragging them (noted in base.scss).
- **Measured with a real hover, canvas pixel readback**: title 23,23,23 → 10,10,10, date
  pinned at 64,64,64, prose links identical; archives anchors hold only the title so the
  base rule suffices there.
- **`--border-size-hairline` 0.5px → 0.75px.** The single retina device pixel read as
  absent to him. His literal ask was 0.25pt = 0.33px — THINNER, the wrong direction — so
  the options went to him with device-pixel math and he picked 0.75px: one solid row plus
  one at half alpha on retina, still 1 device pixel on 1x. Amendment dated on the token.

### Six researched sidenotes for the kids-smartwatch post (requested by name)

Brajeshwar: *"For /2025/kids-smartwatch-not-so-smart/ can you extract some meaningful
sidenotes and add to the article?"* — a content edit he asked for by name, like the
How to Read a Book notes. Six kramdown footnotes added, each fact web-verified before
writing: the WatchOut watches + Germany's destroy-order ban; the DeStefano AI-voice
ransom call and Senate testimony; the ENOX Safe-KID-One as the EU's first data-privacy
recall; Thinkrace's 47M-device sequential-ID white-label platform; DPDP §9's flat ban on
tracking children (that consent cannot cure); Apple's AirTags-are-for-things caveat.
Verified rendering: 6 sidenotes placed in order, no overlaps, coexists with the post's
existing `.aside.right`, foot block hidden with JS on.

### Two homepage refinements, same afternoon

- **The Books and Album strip titles are full-row hit areas** — the heading anchor went
  `display: block`, so the click target is the whole 1024px row, matching the full-width
  border-bottom the hover already painted. Verified by hit-testing the far end of the row.
- **Hover underlines/borders are hairlines now, standardized on one token.** Brajeshwar:
  *"I like the darker color for all hover underlines/border, but they seem to be too thick.
  Can we have just about 0.1 point thick and standardize."* New `--border-size-hairline:
  0.5px` in config.scss — NOT the literal 0.1pt, which is 0.13px and rounds to NOTHING on a
  dpr-1 screen (reasoning recorded on the token). Applied to: link underlines (rest AND
  hover, base.scss), the header nav hover, both search-result styles, and the strip
  headings. ⚠️ This REVERSES 2026-08-01's "1px resting, 2px hover" — safe now because the
  color jump (1.9x-5x in every palette/mode) carries the state; that decision's trap was
  equal thickness AND equal color. The archives table-row hover keeps --border-size: its
  separator exists at rest, structural, not a hover affordance.
- **His "Books looks thicker than Album" was real and was sub-pixel, not CSS** — both were
  1px, but Books' border sat at device-pixel fraction .55 (2 device px of ink smeared over
  3 rows) and Album's at .95 (painted crisp). The leader-dots lesson again. One device
  pixel of ink halves the worst case; the fraction itself follows content flow.

### The in-post image gallery is built and committed.

Brajeshwar, 2026-08-02: *"Let's build an Image Gallery, which I have used and will use in my
posts. For any container with the class 'gallery', extend beyond the body width until our max
guardrail of 1600px. As we are already doing masonry, can we re-use that."*

Built, in one commit. `.gallery` — a class five posts (2010–2024) already carry on a `<div>`
wrapping a plain list of images — now bleeds past the band to `min(100vw, 1600px)`, centered,
with `/album/`'s multi-column masonry (`columns: 14rem`, same gap, `break-inside: avoid`) on
the `<ul>` inside. The full write-up is *The second exception: `.gallery`* in
[`styles.md`](styles.md) §6; the CSS is one block in `base.scss`.

The pieces, and where they live:

- **`base.scss`** — the bleed (`50cqi − bleed/2` centers a body-width box from INSIDE the
  665px article; photo-cover's `width: 100%` trick is unreachable there), the masonry on
  `.gallery > ul`, captions pulled back to the band (mirrors `photo-cover__desc`), and the
  `html:has(.gallery), body:has(.gallery) { overflow-x: clip }` counterweight — without it
  every sub-1600 viewport scrolls sideways by a scrollbar's width.
- **`post.scss`** — `.post figure:not(.gallery)`, a load-bearing exclusion: the
  figures-take-the-band rule loads after base and would quietly pull a `figure.gallery` back
  to `100cqi`. Same idiom as `.post img:not(.full):not(.large)`.
- **`config.scss`** — `--body-width-full`'s user list grew to four, by name, at his request.
- **`_docs/styles.md`** — §6 gained the gallery section; three stale "one exception /
  only user / one caption" claims got dated corrections.

**Verified in Chrome against the served build** (320/480/768/1024/1512): gallery fills
`min(viewport, 1600)`, 1/2/3/4/6 columns, `scrollWidth ≤ viewport`, `scrollX` pinned at 0,
sidenotes duck below galleries (`.gallery` was already in `collectObstacles()`), a
gallery-free post keeps `overflow-x: visible`, home keeps its own clip. Stylesheet cost:
54.0 → 55.2 KB raw, 10.3 → 10.4 KB gzip (~100 bytes on the wire).

### ⚠️ Things the next reader must know

- **Brajeshwar edited content mid-build, and it is his, not staged, not committed.**
  `_posts/2024/2024-05-17-phone.md` — he switched its lone captioned figure from
  `class="gallery"` to `class="large"` while the gallery was being built. Read it as a
  decision: one captioned picture is a wide figure on the band; `.gallery` means a photo
  wall. The `figure.gallery` support (bleed, band-width caption, the `:not` exclusion) was
  verified against a synthetic fixture and stays, for when the distinction goes the other way.
- **Gallery images carry no width/height attributes** — they are plain Markdown/HTML in
  content, so nothing reserves their boxes before load and the columns balance against
  loading heights. Same accepted trade-off as `/album/` (rules-learned #2, fifth session):
  Chrome rebalances when files land, Safari may not. The fix would be content edits, which
  are off the table (guardrail 1).
- **Above 1512px is still unverified** — the iframe harness clamps to the outer window, and
  the gallery's 1600px cap engages only beyond it. The formula is the same `min()`
  photo-cover has shipped with since 2026-07-27.
- **`_pages/styleguide.md` documents `.gallery` in its prose** and now under-describes it
  (no mention of the bleed or masonry). It is a `_pages/**` prose body — guardrail 1 —
  so updating it is Brajeshwar's edit to make, not ours.

---

## Session record — 2026-08-01, fifth session (superseded as the index head, kept per the log-history rule)

### ✅ Session CLOSED 2026-08-01. Everything pushed, deployed green, tree clean.

`main` and `origin/main` are in sync at `cca94c3e`. **37 commits** this session, every one
signed (`G`) and in Brajeshwar's name, none touching `_posts/**` except where he asked for it
by name. Nothing is pending.

Verified against the live URLs rather than `_site`: the article, `/books/`, `/album/` and the
cover image all 200; the 2099 draft correctly 404s and appears in neither `feed.xml` nor
`sitemap.xml`; the new link CSS is in the served stylesheet.

### What this session did

Two halves. The first is recorded verbatim below under *Session record — 2026-08-01 (first
half)*; it built the home page, `/books/` and `/album/`. The second half turned `/album/` from
placeholder into a real, populated section and did a copy-editing pass. In order:

1. **Books shelf made honest.** Duplicate preview entries deleted, favourites and the rest made
   disjoint via `highlight: true`, home strip runs newest-first. British → American spelling
   across the whole UI (`favourites` → `favorites`), content untouched.
2. **Contrast raised one step** across every palette and mode; header and footer rules
   strengthened to `--rule-strong`.
3. **Masters moved to `_src/` on Git LFS.** Three attempts, and the third is the good one:
   `-original` suffix → `static/*/src/` → **`_src/{books,film,album,devices,wear}/`**. The
   leading underscore is the whole point — Jekyll never copies an underscore directory, so
   masters stopped shipping with no `_config.yml` exclude. See *Rules learned* #1.
4. **Leader dots** on the home page: smaller (1.5px), twice as dense (4px pitch), and landed
   on whole device pixels. Most of the old softness was a fractional vertical offset, not size.
5. **Cover photos rise 1px over the header rule** so it no longer draws a line across the top
   of the picture on the 70 posts that have one.
6. **`/album/` is real.** Eight photographs, cut from masters in `_src/album/`, native aspect,
   all inside the 60 KB budget. Home strip re-enabled and widened to 240px.
7. **Copy edit** of `/`, `/books/` and `/film/` — eleven fixes, smallest change each time.
8. **`/books/` became `books.html`.** kramdown never sees it now, so every list and heading is
   HTML. The URL did not move — `_pages` is `permalink: '/:name/'` and `:name` excludes the
   extension. A visible fix fell out of it: `# Books` as Markdown was being eaten by
   jekyll-titles-from-headings, so the page had no heading where `/album/` (raw `<h1>`) had one.
   The free-libraries and references lists moved to its foot as **one** list in
   **`columns: 18rem 3`**, a step smaller.
9. **`How to Read a Book` became a real review** — the four levels, the disagreement rule, an
   honest verdict — with three researched sidenotes and a 16:9 cover.
10. **Link states fixed.** The resting underline was nearly as dark as the text, so hover had
   nowhere to go. See *Rules learned* #8.

### ⚠️ Loose ends to pick up

- **Two of the eight album entries have no `url` and render UNLINKED by design.** Both includes
  test `item.url` and emit a plain `<figure>`, or a `<span class="strip__link">` on the home
  strip, rather than `<a href="">` — which is not an inert link but a link to the current page.
  Adding the `url` later turns the card into a link with no other change.
- **`/static/films/` — 97 of its 119 files are 225×300**, i.e. 1.2× where they render. The
  visibly soft one, and the largest re-cut job left. (112 `<li>` render on `/film/`; the 97 is
  the count that needs re-cutting.)
- **86.3 MB of unreferenced year-folder masters still ship.** 38 files under `static/2019/`…
  `static/2026/` that nothing links to. Moving them to `_src/` would take `/static/` from
  371 MB to ~285 MB — weighed against GitHub LFS's 1 GB storage / 1 GB monthly bandwidth.
  Raised twice, decided neither time. **Brajeshwar's call, not a tidy-up.**
- **`_backup/` is gone.** Retired 2026-08-01: `PeopleAndBlogs.md` moved to `_archives/`
  byte-identical, the rest dropped. ⚠️ `books-BCK.md`, the 634 words of old `/books/` prose,
  is recoverable from `c37d63a4` and nowhere else. `_archives/` is NOT a declared collection,
  so like `_backup/` it publishes nothing — but the repository is **public**.
- ⚠️ **Three things that look like bugs and are decisions.** Raised by me 2026-08-01, closed
  by Brajeshwar 2026-08-02. Written here so the next reader does not "fix" them:
  · The `how-to-read-a-book` cover is missing the top line of its title, and the original is
    deleted. *"Don't worry about the cover picture, let that be."*
  · There is no `og:image` or `twitter:image` on any page, so none of the 35 covers will ever
    appear in a social preview. *"I never cared about them and don't want to for my personal
    website."*
  · `/film/`'s "Last updated" is typed by hand and will drift from the data. *"I also want to
    maintain the last updated manually for film."* It means when he last curated the list,
    which nothing derivable can stand in for.
  ⚠️ The cropping lesson outlives its ticket: **measure where the SUBJECT sits, not where the
  object sits.** The book and its title were 122px apart and only the book was checked.
- **`/devices/` still has one `<a href="">`** — its own hand-written markup, one entry with no
  `url`. Both shared includes guard on the field now; `_pages/devices.html` does not.
- **Above 1512px is still unverified.** The iframe harness clamps to the outer window.
- **Safari's `/album/` first row is uneven, and that is accepted.** See *Rules learned* #2.

### Rules learned this session — these will bite again

1. **`git mv` skips LFS's clean filter — but only one direction matters.** Bringing a file
   INTO `_src/` with `git mv` commits the real binary and nothing looks wrong; use plain `mv`
   + `git add`. RENAMING a file already in `_src/` is safe with `git mv`, because the index
   entry is already a pointer. Verified both ways. The only check that proves it:
   `git cat-file -p $(git ls-files -s <path> | awk '{print $2}') | head -1` must print
   `version https://git-lfs.github.com/spec/v1`. `git lfs status` and `git lfs ls-files` each
   lie differently here.
2. **⚠️ `aspect-ratio: auto` on masonry images reads as a no-op and is not — DO NOT DELETE IT
   ALONE.** The initial value of `aspect-ratio` IS `auto`, so declaring it looks harmless; what
   it actually does is cancel the UA rule that derives a ratio from an `<img>`'s width/height
   attributes. Measured in Chrome, 244.8px container, image never loading:

   | declaration | reserved before load |
   |---|---:|
   | `w/h 600x464`, no `aspect-ratio` declared | 189.3px — correct |
   | `w/h 225x300`, no `aspect-ratio` declared | 326.4px — wrong shape |
   | `w/h 600x464`, `aspect-ratio: auto` | 16px — nothing |
   | no attributes at all | 16px |

   So nothing reserves space, every card is ~16px tall at first layout, and the masonry columns
   balance against those heights. Chrome re-balances when the images land; **Safari does not**,
   which is why `/album/`'s first row is flush in Chrome and staggered in Safari. The fix is
   per-item `w`/`h` in `album.yaml` **and** deleting that declaration — **both or neither.**
   Deleting it alone is worse than leaving it, because every card then reserves the wrong 3:4
   default and jumps on load in every browser. Brajeshwar chose neither, knowing the cost:
   *"I'd rather live with a non-aligned masonry than introduce size in the album.yaml."*
   All three files carry the warning from their own side.
3. **An `<a href="">` is not an inert link.** It points at the current page: it takes tab
   focus, announces as a link, and reloads on click. Guard on the field, don't emit an empty
   anchor.
4. **Liquid 4.0.4's `comment` tag does not nest.** The first `endcomment` closes the outermost
   block, so commenting out a region containing comments dumps the rest of it — includes and
   all — into the page. Flatten the inner ones first.
5. **Cut the long edge, not the quality slider, when a thumbnail busts its budget** — and check
   the *rendered width*, not the long edge, because on a masonry page a portrait photo's long
   edge is its height. A dense frame may need both levers: the San Francisco cut needed 600px
   AND q68 where 600/q75 was 60.0 KB, just over.
6. **Integer pitch, or the dots shimmer.** A fractional `background-size` puts every other dot
   on a half device pixel at dpr 2, so they alternate sharp and soft.
7. **Straight-quote and double-space sweeps over stripped HTML report phantoms.** Replacing
   tags with spaces manufactures both. A first pass reported 38 faults and every one was mine;
   match against the raw HTML inside text nodes instead.

8. **A link state that "does nothing" is usually the RESTING state's fault.** Hover was
   already set to `--text-color` and looked identical to rest, because rest was on
   `--text-color-lower` — rgb(64,64,64) against a rgb(229) page, 8.23:1 where the body text is
   15.72:1. The two states differed by **1.91:1** on a 0.8px line. Lightening rest to a 50%
   foreground mix (3.14:1, still over the 3:1 non-text threshold) roughly doubled the jump in
   all six palette/mode combinations. ⚠️ And hover must be `--text-color`, **not**
   `--color-accent`: nord's accent is a mid-tone blue at 3.31:1, so accent-on-hover would move
   1.2x there. Only `--text-color` is guaranteed to sit at the far end of every palette.
9. **`markdown="0"` vs a `.html` file are not the same thing.** With `markdown="0"` kramdown
   still runs and a nested `markdown="1"` re-enters it. In a `.html` page kramdown never runs
   at all, so there is no escape hatch and every list, link and heading must be HTML.
10. **`git mv` is right for renaming WITHIN `_src/` and wrong for moving INTO it.** Into: the
   clean filter never runs and the real binary is committed. Within: the index entry is
   already a pointer and stays one. Verified both ways.

### How to verify a change (the loop that works)

`bundle exec jekyll build` → the dev server on `:4000` → **measure in the browser, don't look.**
Everything real this session was invisible to the eye: a 1px rule painted across 70 cover
photos, 10px of hover padding that was applied and then clipped, dots smeared across two device
rows, a reservation of 16px where 189px was needed.

**The decisive trick for load-order bugs:** point every image at a URL that never resolves, so
only the reserved box remains. That is what turned "Safari is acting up" into a measurement.

**The responsive sweep** — load each page type in an iframe at 320 / 480 / 768 / 1024 / 1512
and assert both `documentElement.scrollWidth <= viewport` and that `window.scrollX` stays 0.

---

## Session record — 2026-08-01, first half (superseded, kept per the log-history rule)

⚠️ The status below was true when written and is not now: those 14 commits are pushed and live.

### What it said at the time

### ⏸ Session paused 2026-08-01 (fourth session). **14 commits sit UNPUSHED on `main`.**

Brajeshwar: *"Commit. Do not Push. I will continue tomorrow."* Everything is committed, the
tree is clean, every commit is signed (`G`) and in his name. `origin/main` is 14 behind.

**Nothing is deployed.** The live site still shows the pre-redesign home page. The first
action tomorrow, once he says so, is `git push origin main` — then watch the Actions run and
verify against the live URLs, not `_site`.

| commit | |
|---|---|
| `e15fefda` | Homepage rebuilt from the wireframe |
| `7da64916` | Homepage: toc refinements, wider gutter, capped strip bleed, Photos |
| `c458c4e8` | Homepage: trim long titles, center the strips both ways |
| `a88bc57f` | Home strips: scrollable with arrows, wrapping captions, 12 items |
| `5515fdd1` | Fix home page overflowing sideways below 768px; Books hover |
| `6ab845a7` | Strips: uncap the bleed, and make mobile scroll like everywhere else |
| `3d2615aa` | /books/ and /photos/ become card-grid pages; home shows the tail |
| `e0a30e3b` | Darker header nav; /photos/ loses captions and links out |
| `5b2c35b3` | Photos becomes Album; /photos/ redirects; media badges |
| `1cd75065` | /album/ gets CSS-only masonry |
| `ab312c00` | Styleguide: a thumbnail template for /static/* |
| `c37d63a4` | Move the /books/ prose out to _backup/books-BCK.md |
| `02261894` | Header and footer rules go one notch stronger |
| `c6a98854` | Footer links alphabetised; 'View all articles' gets an arrow |

⚠️ **Push only when Brajeshwar asks** (guardrail 7). **All commits signed and in his name** —
verify with `git log --format='%h %G?'`; `G` is the only acceptable result.

⚠️ **Stage explicitly, never `git add -A`.** He edits this repo while I work — twice this
session (`nav.yaml` footer reorder, `home-articles.html` arrow). Both were committed
*separately* so the diff reads as his. Check `git status` before every commit.

### What this session built — the home page, /books/, /album/

A full home-page redesign from a tldraw wireframe, then four rounds of refinement on it.

1. **Home is two columns + two strips.** A reading column of two table-of-contents lists
   (Articles, Popular & Handpicked) with a Connect / Alumni / Support sidebar, then Books and
   Album thumbnail strips that break past the band. `index.html`, five new includes, a
   rewritten `home.scss`.
2. **The toc lists**: title left, date hard right, dotted leader between; titles truncate to
   one line; Articles groups by year with a right-aligned marker so dates drop to `JUL 07`;
   row hover is a background, not an underline. Article count is one `assign` at the top of
   `home-articles.html`.
3. **The strips** scroll horizontally with subtle `‹ ›` arrows (`strip-nav.js`, home page
   only, progressive enhancement), bleed to the full viewport uncapped, and center when short.
4. **`/books/`** is a card-grid page with an *All Time Favorites* section driven by
   `highlight: true` in `books.yaml`. Its prose moved out to `_backup/books-BCK.md`.
5. **`/photos/` became `/album/`**, with a real `_redirect` collection behind it, media badges
   for video/audio items, and CSS-only masonry.
6. **Styleguide** gained a measured thumbnail template — long edge 800px.

### ⚠️ Loose ends to pick up

- **`_data/books.yaml` entries 7–12 are literal duplicates of 1–6**, added to preview a longer
  shelf. Marked at the top of the file. **Delete that block when real titles go in** — an
  unedited duplicate reads as deliberate to anyone who does not know.
- **`_data/album.yaml` is entirely placeholder**, borrowing `/static/books/` thumbnails
  because `/static/album/` does not exist. Four entries carry `media:` tags purely to show the
  badges. Replace wholesale when real photos land; the include already handles bare filenames.
- **Masonry looks like a plain grid today** because every placeholder is the same 3:4 shape. It
  was verified by injecting varied ratios; it will come alive on its own with real photos.
- **`/static/films/` is 97 files at 225×300 — 1.2× where it renders.** Visibly soft on retina.
  The re-cut list is in [`todo.md`](todo.md) → *Thumbnails*.
- **`_backup/books-BCK.md`** holds 634 words of the old /books/ prose, verbatim, for
  Brajeshwar to decide on. `_backup/` is an underscore directory so it cannot publish.
- **Above 1512px is unverified.** The iframe harness clamps to the outer window, so the
  uncapped strip bleed and the masonry column count have not been seen on a wide display.

### Rules learned this session — these will bite again

1. **Never write a bare `1fr` in a grid template.** `1fr` is `minmax(auto, 1fr)`, and that
   automatic minimum will not shrink below the track's max-content. With `white-space: nowrap`
   titles it made the "single column" 679px inside a 346px container and **the whole home page
   scrolled sideways below 768px**. Always `minmax(0, 1fr)`.
2. **`justify-content: center` on an overflowing scroller hides content.** It centers the
   overflow, so half lands left of `scrollLeft: 0` where nothing can reach it — measured at
   x = −451. Use `safe center`.
3. **`behavior: 'smooth'` is a no-op under `prefers-reduced-motion`** (which Brajeshwar has
   ON), and a programmatic scroll does not reliably fire a `scroll` event. Decide `behavior`
   in JS and re-sync state on click rather than trusting the event.
4. **`overflow-x: clip` on `body` does not reliably reach the viewport.** Set it on `html` too.
5. **`text-decoration` is drawn by the ancestor that declares it.** An underline set on a
   child span while the link declares `none` computes correctly and paints nothing.
6. **Measuring an `oklch()` color needs a canvas.** `getComputedStyle().color` returns
   `oklch()` now, so string-parsing gives nonsense — it reported a real contrast change as a
   no-op. Paint bg then color onto a canvas, read the pixel.
7. **`.visually-hidden` does not exist on this site** — deleted after the 2026-07-19 audit.
   Put the word in `alt`, not a hidden span.
8. **`ul.item__cards` is (0,1,1).** A single-class override loses to it, silently: `columns`
   still computes while `display: grid` survives, so the CSS reads as applied and nothing
   moves.

### How to verify a change (the loop that works)

`bundle exec jekyll build` → the dev server on `:4000` → **measure in the browser, don't look.**
The bugs this session were all invisible: a sideways scroll of 2.5px, 451px of unreachable
books, a hover state that painted nothing, a ratio that was requested and never applied.

**The responsive sweep that catches layout breaks** — load each page type in an iframe at
320 / 480 / 768 / 1024 / 1512 and assert both `documentElement.scrollWidth <= viewport` **and**
that `window.scrollX` stays 0 after trying to scroll. Nine page types were clean at the end.
⚠️ The harness cannot exceed the outer window width; iframes wider than the browser silently
render at the browser's width and report meaningless numbers.

---

## Session record — 2026-07-27 (superseded, kept per the log-history rule)

### ✅ Session closed 2026-07-27 (second session). Pushed, deployed green, tree clean.
`main` and `origin/main` are in sync. Nothing is pending.

⚠️ **Push only when Brajeshwar asks** (guardrail 7). **All commits signed and in his name** —
verify with `git log --format='%h %G?'`; `G` is the only acceptable result.

⚠️ **Stage explicitly, never `git add -A`.** He edits content in this repo while I work, and
`-A` swept his in-progress book notes into one of my commits. Caught and backed out with a
snapshot taken first, but the habit is the fix: name the files.

### What this session changed, in order

1. **CSS is ONE EXTERNAL STYLESHEET**, not inlined. `/assets/*` is served `max-age=31536000`,
   so inlining re-sent ~6.6 KB gzip on every page view and could never be cached; external is
   one fetch then free. Reverses the previous day's decision — the old reasoning was sound but
   rested on an unmeasured premise. 49 KB raw / 9.5 KB gzip for the whole site.
2. **Sources moved `_includes/css/*.css` → `_sass/*.scss`**, compiled by
   `assets/styles/site.scss`. `@use`, not `@import` (Dart Sass 3.0 removes it). Breakpoints
   live in `_sass/breakpoints.scss`, a variables-only module that emits nothing.
3. **Everything under `/assets/` is content-hashed** — CSS, JS *and fonts*, in two passes
   (fonts first, then the CSS that points at them). Without this a year-long cache strands
   returning readers; it was already silently true of the JavaScript.
4. **Scripts load only where they have work.** sidenotes.js on 87 of 1,483 pages, anchors.js on
   453 of 1,456 posts. Analytics removed entirely — **the templates make zero cross-origin
   requests** (101 of 1,484 pages still do, from YouTube/Vimeo/`cdn.oinam.com` embeds inside
   the posts; that is content). It was briefly restored on 2026-07-31 and removed again the
   same day; **measurement is Cloudflare edge analytics now**, which costs the reader nothing
   and cannot be blocked. ⚠️ Cloudflare *Web* Analytics is a different product and is not the
   answer — its beacon is a third origin and is blocked by Brajeshwar's own DNS (measured).
5. **Random post.** A circle in the prev/next bar → `/random/` → a random post. Self-contained
   by request. ⚠️ Its index is inlined into that page, NOT under `/assets/`, which would freeze
   it for a year.
6. **Timeline CSS merged** — `/about/` and `/now/` were the same component built twice.
   `.headerlink` went from three copies to one, and the post copy had already been deleted by
   accident, so 453 posts were rendering a bare visible §. Caught before deploy.
7. **`:visited` color leak fixed at the root.** See below — this one is a cascade law now.
8. **Actions bumped to Node 24** versions; the deprecation warning is gone.

### The two rules most likely to be broken next

⚠️ **Every stylesheet applies to every page.** No layout gate exists any more. Anchor selectors
to a class (`.page`, `.post`) or a custom element — never a bare `main > article > h2`.
`page.scss` got this wrong and would have clamped all ~1,456 post titles to 665px.

⚠️ **Element defaults are `:where()`-wrapped in base.scss, link colors especially.** Unwrapped,
`a:visited` is (0,1,1) — higher than a plain class — so six chrome components silently lost
their color once visited. Do not un-wrap, and do not patch a chrome link with its own
`:visited`. [`styles.md`](styles.md) §5 → *Element defaults are `:where()`-wrapped*.

**Decided, so it does not get re-litigated: the browser cache TTL stays at a year.** A shorter
TTL is what you pick when filenames are stable and you are hedging against staleness; content
hashing removes the staleness, so shortening it only re-fetches identical files more often.
`?v=<published-date>` was considered and rejected — the daily cron would bust it every day for
unchanged bytes, and caches are free to ignore query strings (Cloudflare has a setting that
does). See [`hosting.md`](hosting.md) → *Why a hash and not `?v=`*.

**Mostly page-weight work, and `e359263c` is the big one:** the CSS is no longer inlined. See
*Architecture to honor* below and [`styles.md`](styles.md) §5 for the reasoning, which reverses
a decision made the day before — after measuring the live cache headers rather than assuming
them.

⚠️ **`22cb3522` shipped a regression that `c6b12e8c` fixes. Both are in this unpushed run, so
the live site was never affected — but note the shape of it.** The code/cards split removed 225
lines from `post.css` and took `.headerlink` (and its `position: relative`) with it, moving them
nowhere. `anchors.js` kept inserting anchors, so **453 posts rendered a bare, permanently
visible, underlined § against every heading**. It was found only because the timeline merge
went looking at the *other two* copies of the same rules. There are no copies now — one
`.headerlink` in `base.css`, positioned via `:is(h1..h6):has(> .headerlink)`.

⚠️ **The first deploy after this exercises `scripts/hash-assets.mjs` for the first time.**
It has been verified against a full local build (1,486 pages, 7,955 references rewritten, and
it fails the build if anything it hashed ends up referenced by nothing), but it has never run
in CI. Watch that first Actions run.

⚠️ **Push only when Brajeshwar asks** (CLAUDE.md guardrail 7). Committing is fine; every push to
`main` auto-deploys.

⚠️ **All commits are signed and in his name.** `commit.gpgsign` is on and the key is in the
agent, so it is automatic — but **verify** with `git log --format='%h %G?'`. A history rewrite
already cost 882 signatures once; see the entry below before running one.

**Node 22, the esbuild minify step and the Geist woff2 all ran green in CI** and were verified
on the live site: `Geist-Variable.woff2` serves at 47,596 bytes, the `.ttf` 404s as intended, and
`back-to-top.js` arrives minified. That whole risk is now closed.

### The state, in one paragraph
The site is on one width — 64rem/1024px — and everything agrees on it: header, footer,
`main`, post titles, wide images, captions, videos and embeds, the prev/next bar. Wide media
breaks out to the right only, never into the left margin, because the reading column is
left-aligned in the band and that left edge is the page's alignment line. `photo-cover` is the
one deliberate exception — a full-bleed hero to 1600px, flush under the header rule. Color is monotone by default with three
palettes (Warm is now Flexoki); the reader also picks mode, font (System / Sans-Serif /
Serif) and text size, all persisted. JS is eight small vanilla files, minified on publish.

### What changed this session (2026-07-27), reader-visible
1. **Warm palette is Flexoki** — ink-on-paper `#FFFCF0` / `#100F0F`.
2. **Wide images break out rightward** and stop at the band, instead of spilling into both
   margins. Post titles and captions take the band too.
3. **Prev/Next reworked** — flush edges, a notch divider, hover, moving arrow; full width when
   there is only one link.
4. **Back to Top floats then settles** above the footer; arrow only.
5. **Search results are themed** — they had been rendering as default Pagefind, yellow
   highlights and all.
6. **Serif readers get their apostrophes back** — a `unicode-range` bug had been sending
   `’ “ ” – — • …` to the fallback font, 3,197 times in a 400-page sample.
7. **Images are no longer dimmed in dark mode.**
8. **The appearance panel is a two-column grid**; Font's first option is "System", not "Default".

### Rules learned this session — these will bite again
- **`post.css` loads after `base.css` at equal specificity, so it silently wins.** Four separate
  bugs from this: `.post { margin }`, `.post-nav { margin }`, `.post img { width }` beating
  `img.full`, and the `.container-ideal` shorthand cases. In `post.css`, set only the axis or
  property that rule has business setting, and exclude what `base.css` sizes.
- **A `margin: X auto` shorthand cancels `.container-ideal`'s `margin-inline`.** Use
  `margin-block`.
- **Font-scope bugs are invisible by default** — they only show for readers who picked Serif or
  Sans-Serif. New controls inside `main` must be added to the sans list in `base.css`.
- **Audit entries written from reading are unreliable.** Three of the five "highest value" items
  were misfiled; measuring disagreed each time. Measure first.
- **`nowrap` lets a cell overflow without ever wrapping** — so "did it wrap" is the wrong test.
  Compare content box against text width.
- **The browser caches `assets/scripts/*.js` across a normal reload.** `cmd+shift+r` after
  editing JS; a query string on the page URL does not help.
- **`python3 -m http.server` is single-threaded** and starves under a blocking CDP eval, which
  makes images look permanently unloaded. Use `ThreadingHTTPServer` for anything image-dependent.

### How to verify a change (the loop that works)
    make build          # jekyll + agent-md + esbuild minify + pagefind — production parity
Then serve `_site` statically and check in a browser.

⚠️ **A long-running `jekyll serve` will fight you, in two ways.**
1. It does not build the search index, and its `--watch` **wipes `_site/pagefind/`** on every
   rebuild.
2. **It reads `_config.yml` once, at startup.** A server left running from before a config
   change keeps regenerating `_site` with the OLD config. Caught at the end of 2026-07-27: the
   excluded `Geist-Variable.ttf` kept reappearing in `_site` and `llms.txt` kept vanishing,
   which looked like the `exclude` had failed. A fresh `jekyll build` was correct both times.
   **If `_site` disagrees with the config, restart the server before debugging anything else.**
3. **It also overwrites `_site` mid-comparison.** An A/B of two builds gave a "difference" that
   was really their `--future` localhost build landing between the build and the copy. Use
   `jekyll build --destination <dir>` for any before/after comparison, never the shared `_site`.

For anything involving sidenotes, images, search or `_config.yml`, use the full build and serve
it statically. `python3 -m http.server` is single-threaded and starves under a blocking eval —
use `ThreadingHTTPServer` when images matter.

Guardrail check before handing back:

    git diff --name-only origin/main..HEAD | grep -E '^_posts/|^_drafts/|^_data/'

Should return nothing but Brajeshwar's own content commits.

### Picking this back up — the shortlist
Full list in [`todo.md`](todo.md). The ones worth doing next, in order:
1. **`.sidenote` is declared in two blocks** (`base.css` 563 and 609) and repeats 6 declarations
   with `.sidenote-inline`. Deliberately left: it is a refactor of live behavior, best done with
   the sidenote work rather than as a tidy.
2. **Two spacing systems** — ratio `--space`/`--space-smaller` vs fluid `--space-*`, 10 call
   sites across five files (the old entry claimed 3). Each is a visible value, so it needs a
   look, not a sweep.
3. **Images have no `width`/`height` attributes.** This causes layout shift on every image and
   was the root of the sidenote-overlap bug (patched with a `ResizeObserver`, not cured).
   Fixing it properly is content-adjacent — Brajeshwar's call.
4. **Home** is parked pending his decision on the books treatment (SVG covers vs text block).

### What happened 2026-07-26
Docs and README work, with no reader-visible change. **Uncommitted.**

- **Retired the "v2027" framing.** `_docs/v2027/` is gone: `inspirations.md` moved up to
  `_docs/`, and `spec.md` was deleted — it briefed a redesign that shipped, and its
  §3/§7 still described the numbered CSS partials and a four-theme selector that no longer
  exist. Everything durable in it already lived elsewhere; the one exception, why the daily
  cron exists (`future: false` hides post-dated articles), was salvaged into `hosting.md`.
- **`css-architecture.md` folded into [`styles.md`](styles.md) as §5**, in full. One doc now
  covers type, color, branding, icons, and how the CSS is split.
- **`README.md` is human-only again** — the tooling/versions note moved to `hosting.md`,
  which now covers all hosting: GitHub Actions, the Cloudflare Pages backup, DNS/CDN, domain.
- Net: 9 docs where there were 11, and every cross-reference repointed (docs, `CLAUDE.md`,
  and the comments in `styles.html`, `page.html`, `album.html`, `base.css`, `themes.css`).
- **Cloudflare Pages runs on Cloudflare's defaults** (Brajeshwar's call). No `.ruby-version`,
  no `.nvmrc`, no `RUBY_VERSION`/`NODE_VERSION` in the dashboard. The two builders therefore
  run different Ruby/Node versions on purpose — if a default moves and the backup breaks, we
  fix it then. Details in [`hosting.md`](hosting.md).
- **Process, from Brajeshwar: log history, don't erase it.** Reverse decisions in place with a
  date; leave dated log entries as written even when they name things since retired.

### Archives year jump-nav (2026-07-26/27, built + browser-verified)
A jump-nav for all 26 years on `/archives/`, pointing at the `#YYYY` anchors the
`<caption id>` elements already provided. `_pages/archives.html` + `archives.css` only —
no new layout was needed (it's a tier-2 per-page bundle, zero impact on other pages).
CSS-only, so it works with JS off.

**Revised 2026-07-27 — wide page, scrubber inside it.** `/archives/` moved off
`container-ideal` (665px) onto a new `.container-wide` (`--body-width-wide`, 80rem/1280px),
the desktop target from the width research. Opt-in per page, not a site-wide change —
`--body-width-max` also sizes the header, footer and `.gallery` on every page, so bumping it
is the parked standardisation, not this. `.container-wide` is in `base.css` for `/books/` and
`/film/` to reuse.

That width forced the scrubber's architecture: it used to be `position: fixed`, offset from
the centered column into the viewport margin — which only worked *because* a 665px column
leaves a wide margin. At 1280px there is no margin, so it became a grid column
(`grid-template-columns: auto minmax(0,1fr)`) with `position: sticky` inside it. Measured:
38px wide (was 47), 20px gap, no overlap.

Also this pass: thinner rail, subdued rest color (`--text-color-low`), and a hover that
darkens the text *and* adds a background. The hover background is
`color-mix(in oklch, var(--text-color) 12%, transparent)` — mixing the foreground rather than
using any `--bg-*` token, because none differs from the rail's own background in both
modes. Contrast measured by canvas pixel readback, not assumed: rest 12.01:1 in both
modes, hover 12.08:1 light / 10.09:1 dark, all clear of AA at this size.

⚠️ **The pill's effective corner radius is not the declared one.** `--border-radius-larger` is
25px, but top-left + top-right (50px) exceed the rail's ~38px width, so the browser scales
every radius by `width / sum` — **19px** in practice. The rail's vertical padding is
`--space-s` (20px) to clear that, so `26` and `01` start below where the curve finishes rather
than being pinched by it (measured: 21px inset against a 19px curve). If the rail's width or
that radius token changes, the effective radius moves with it — re-measure, don't assume 25.

The rail starts 11px below the first article row (row top 191px, rail 202px) — it drops
past the year caption to sit with the rows it indexes. `margin-top` sets that resting offset
and `top` sets where it parks once stuck; they differ deliberately and it does not jump,
because sticky only displaces when `top` exceeds the resting position.

**Final shape (2026-07-27, after four passes): a HORIZONTAL strip across the content width,
hanging off the header rule.** Brajeshwar's iterations went top bar → left rail → right rail →
horizontal strip; only this last one is live. Its top edge is exactly the header's
`border-bottom` — *"the border becomes the start of the year scrubber"*. Square top with no
top border (the header rule already draws that line; a second reads as a 2px seam), rounded
foot only. It rises to meet the rule via `margin-top: calc(-1 * var(--space-l))`, cancelling
the header's bottom margin — ⚠️ **keep those two in step**, or the strip detaches and floats.

- **An auto-fit grid, not a flex row.** `repeat(auto-fit, minmax(2.5rem, 1fr))` is what lets it
  *"expand to fit all the years"* on a small screen: equal tracks, as many per row as fit, all
  26 always visible, no horizontal scrolling and no ragged last row — which is exactly what
  flex-grow would have produced (two leftover items stretched to half the width each). The two
  spare tracks collapse to 0px, so the years sit flush to both edges.
- **Row counts, measured** (against `main`'s width, with the list hidden so only the strip
  reflowed): `>=1200` → 1 row / 57px · `737–1186` → 2 rows / 98px · `460–600` → 3 rows / 139px ·
  `346–400` → 4 rows / 180px.
- **Sticky from 768px up, static below.** One or two rows are fine to follow the reader (98px
  is ~12% of a laptop viewport); three or four is not — on a phone that is a fifth of the
  screen held permanently, worse than just scrolling past it.
- ⚠️ **`scroll-margin-top` has to track the row count.** A wrapped 2-row strip is 98px, and the
  original 4.5rem/72px dropped the caption *underneath* it — the same bug as the first build,
  in a new place. Now 7rem from 768px and back to 4.5rem from 1250px, both verified clearing by
  ~15px. Re-check whenever the strip's padding, font size or row count changes.
- **DOM order is unchanged** throughout all four passes: the nav is first in the source, so
  keyboard and screen-reader users meet the 26-year jump list before ~1,456 rows of links.
- **Labels are 2-digit, anchors are not.** `href` and `id` keep the full year, so
  `/archives/#2024` still works; `aria-label` restores the full year for screen readers.
  Safe because `site.posts` spans 2001–2026 — the 2100-dated drafts in `_posts/todo/` are
  future-dated, so Jekyll never builds them in.

- **Single page with anchors, not `/archives/YYYY/` pages.** Vanilla Jekyll can't generate a
  page per year without a plugin (guardrail 3) — per-year URLs would mean 26 committed stubs
  plus one every January.
- **Rewrote the list with `group_by_exp`.** One grouping now feeds both the nav and the tables,
  so they can't disagree. Kills the old running-`date` variable that opened and closed
  `<table>` from two branches and shadowed Liquid's own `date` filter.
- **1,459 absolute URLs → 3.** The links were built with `prepend: site.url`; `relative_url`
  saved 27.6 KB raw (356,037 → 328,381) and makes local preview work. Same bug class as
  the `assets/scripts/*.js` one recorded further down.
- **Two bugs caught by measuring in the browser, both of which would have shipped silently:**
  1. `scroll-margin-top: 3.25rem` (52px) put the caption 5px underneath the 57px sticky
     bar. Now 4.5rem. The strip's height is content-derived and can't be read from a token —
     re-verify if its padding or font size changes.
  2. `--bg-color-high` is not a raised background — it bridges to `--color-primary`, the
     *foreground*. Using it for the hover and `:target` styles painted a near-black chip under
     dark text in light mode. Safe background steps are `--bg-color-lowest/-lower/-low` only.
     Replaced with a color shift (matching `site-nav` in chrome.css) and an accent rule.
     Verified in both light and dark; a background highlight can't work here anyway, since the
     only distinguishable step collapses to the caption's own color in dark mode.
- **Weight:** the page is 328 KB raw / 74 KB gzip — 3.5× over the `design.md` non-article
  budget. Pre-existing; logged in [`todo.md`](todo.md) as a decision, not fixed silently.
- Verified in Chrome: build clean, Pagefind indexes the site, nav is `data-pagefind-ignore`d,
  rail and strip both jump correctly, both render in light and dark. The strip stays one
  row and scrolls sideways — it would wrap to 4 rows at 360px.
- ⚠️ **`resize_window` does not work on this machine** (reports success, `innerWidth` never
  changes — the OS window is maximised). To test a breakpoint, neutralise the `@media` rule
  through CSSOM (`rule.media.mediaText = '(min-width: 99999px)'`), measure, then restore it.
  That is how the narrow fallback was verified; don't waste time re-trying the resize.

### Header reworked (2026-07-27, built + browser-verified)
`_includes/css/chrome.css` + two new tokens in `config.css`. Affects every page.

- **Centered again.** `justify-content: space-between` → `center`. Brajeshwar's call: the logo
  and menu were pinned to opposite edges, making the nav a long mouse trip.
- **Narrow screens are one row, and shorter.** It used to stack into a column — logo, then
  nav, then tools, three rows of chrome before a phone reader saw content. Header height at
  narrow is now 51px vs 82px on desktop; padding and bottom margin are reduced *only* at
  the breakpoint, since desktop spacing wasn't the complaint.
- **Icons are quieter than the words now.** They were on `--text-muted` (`--color-fg-muted`),
  *darker* than the nav's `--text-color-lower` (`--color-fg-subtle`) — the loudest thing in
  the header. The ladder bottoms out at fg-subtle, so going quieter meant `color-mix` toward
  the background, not a token swap. Measured: icons 3.83:1 light / 3.95:1 dark against
  the page vs the nav's 7.17 / 6.94 — about half the contrast, still clear of the WCAG 1.4.11
  3:1 bar for non-text UI.
- **Vertical hairline** (`border-left` on `site-tools`) separates words from glyphs. Safe
  unconditionally because `site-nav` no longer wraps at any width, so it can't be orphaned.
- **Icon size decoupled from the logo.** New `--icon-button-size` / `--icon-glyph-size`; both
  used to be `--logo-size: 42px`, so shrinking icons would have shrunk the logo too. 32px
  buttons / 17px glyphs, stepping to 26/15 under 600px and 24/14 under 360px — 24px is the
  WCAG 2.2 target-size floor, so savings below that come from padding, never the hit area.
- **Logo: 42px → 34px**, holding its proportion against the icons' 42 → 32 (ratio now 1.06).
  New `--logo-inset` (2px, 1px at the smallest step) with `box-sizing: border-box` insets the
  glyph so it sits inside the hover circle *without* changing the outer box — the header row
  measurements are unaffected.
- **Logo hover: the glyph's dark fills a circle and the β knocks out of it**, in 0.15s (was
  `transition: all 0.5s`, half a second on every property). No `[data-theme]` branch needed
  for dark mode: the fill is `--bg-color-high` (→ `--color-primary`) and the glyph
  `--bg-color-lower` (→ `--color-bg`), and both flip with mode, so the inversion is automatic.
  Verified in both. The glyph's bbox reaches ~95% of the circle radius, so it clears the edge.
- **Nav links underline on hover/focus** — the affordance `design.md` asks of every link, and
  the header was the exception. Deliberately not on `.active`: the current page should
  read as "you are here", not as something to click.
- **Appearance panel now hangs off its trigger** (2026-07-27). It was
  `position: fixed; top: 4rem; right: var(--space-s)` — pinned to the *viewport's* right
  corner, which was fine while the header was right-aligned but left the panel ~495px away
  from the icon once the header was centered. Now `position: absolute` inside
  `appearance-settings` (`position: relative`), `right: 0` so it opens inward and cannot
  run off a phone screen. Verified: right edges align exactly, 10px below the trigger, above
  the backdrop, and still on-screen at a 360px-wide header.
- Verified: fits in one row at 430/390/375/360/320px, all targets ≥24px, appearance panel
  and search palette still anchor inside the viewport, base CSS ~6.8 KB gzip on the homepage.

⚠️ **The bug worth remembering — @media blocks lose on source order.** The narrow-header block
was written *before* the `site-logo` / `site-nav` / `site-tools` rules it overrides. Those are
element selectors of equal specificity, so the later base rules won and the media block
silently did nothing: the nav kept `--step--1` and 10px padding, and the header needed **445px
at a 360px viewport** — a horizontal-scroll bug. What made it hard to spot is that
**custom-property overrides in the same block *did* work**, because those cascade by
inheritance rather than source order. So the icons shrank while the font and padding didn't,
and it looked half-applied rather than broken. **Media blocks must come after the rules they
override**; the comment in `chrome.css` says so at both ends.

### Chrome rules + ONE site width (2026-07-27, browser-verified)
- **Thin rules are back on the header and footer, at content width — not browser width.**
  The header's `border-bottom` sits on the header box, which is already the content band, so
  it stops at the content edges. The footer's `border-top` moved from `<footer>` to
  `.footer-inner` for the same reason — that reverses the earlier "outer footer spans the
  full viewport so the rule is edge-to-edge" decision, which is why the outer element exists;
  it now carries only spacing and the muted color. Both use `--rule` (a 10% foreground mix),
  so they stay hairlines in light and dark; verified identical in both.
- **`--body-width-max` is 81rem / 1296px, and it is the ONLY content width.** Brajeshwar:
  *"Archives, and everything on the website should now run on the same width"*, then
  *"standardize at the size that encompasses the sidenotes too."* Verified aligned on `/`,
  `/about/`, `/archives/`, `/film/` and an article.
- **The width is derived, not picked:** `--measure` (665) + 2 × (`--sidenote-gap` 56 +
  `--sidenote-width` 256) = 1289, rounded up to a whole 81rem. The article is centered, so
  the gutter is paid for on *both* sides — that doubling is the number. 1280 was 9px short,
  and measurement showed sidenotes rendering 5px past the band, overhanging the header and
  footer rules that had just been added. Adding those rules is what made the gap visible.
- **`.sidenote` width now measures against the band, not `100vw`.** `min(96vw,
  --body-width-max)` replaces `100vw`, so notes clamp to the band instead of drifting into the
  margin outside it. Verified: 0px slack (exactly touching) at bands of 1200/1100/1000px, 3px
  inside at full width. The token and the formula now agree by construction — change one and
  the other still holds.
- **`--body-width-wide` and `.container-wide` are deleted.** They lasted about a day. Adding
  the chrome rules is what exposed the problem: with archives at 1280 and the header at 1216,
  archives content overhung its own header rule by 32px a side. One width removed both the
  misalignment and the duplication.
- The reading column is unchanged (665px, `--body-width-ideal`) and is not a second site
  width — it's a reading constraint inside the band. Centers align; sidenotes still render.
- ⚠️ The wider band does **not** improve the sidenote floor. That gutter is measured from the
  reading column, which didn't move. Going asymmetric is still the only lever there.

### The pill becomes a component; Back to Top comes in from the corner (2026-07-27, browser-verified)

Brajeshwar: *"Create a pill-like component, which we will re-use where needed. For instance,
the one from the Theme Selector. Use that clean, minimal, pill selector in `/about/` for
Life / Work too. Instead of the square selection icon, let's change that to a clean, darker
circle."* And: *"For the Scroll to Top, it needs a hover (darken the background). Bring it
within the body width… positioned just above the footer, separating with our standard
rhythmic spacing."*

**`.pill` extracted into `chrome.css`.** The appearance panel's segmented look is now a shared
component — `.pill` (track) / `.pill__option` (segment) / `.pill__marker` (dot). Both users
emit both class sets: `appearance.js` writes `pill appearance-options …` and
`pill__option appearance-option`, so `.appearance-*` survives purely as the hook for
panel-specific sizing (the text-size row). `.appearance-options` is now one declaration
where it used to carry the whole look.

**`/about/` Life/Work wears it.** The old square `label::before` checkboxes are gone; each
label is a `.pill__option` holding a `.pill__marker` — a ring at rest, filled once chosen —
and the chosen segment darkens. Still zero JavaScript: real `<input type="checkbox">`
elements drive it, so `:checked + .pill__option` re-declares the "on" look that
`[aria-pressed="true"]` gives the panel. Three selectors, one set of declarations.

Verified live: both on (light + dark), one on, and the no-JS `:target` path — with
`.timeline-js` removed and `#work` in the hash, 12 work entries showed, 2 life entries hid,
and the pill reflected it rather than contradicting the page. The *"at least one always
selected"* guard survives the new markup: with Work off, both the Life label and its marker
span compute `pointer-events: none`, and hit-testing at each of their centers falls through
to the fieldset — so a pointer cannot clear the last track.

**Fixed while extracting: the focus ring was invisible on a chosen segment.** It was
`outline: … solid var(--accent)` with `outline-offset: -3px`, so the ring is drawn *inside*
the segment on its own fill — and on a chosen segment that fill is `--color-primary`, which is
essentially the same color `--accent` resolves to. Near-black on near-black in light, near-
white on near-white in dark. Invisible in both, and it had been shipping that way in the
appearance panel. Now `solid currentColor`, which is `--color-primary-fg` when chosen and
`--text-muted` when not, so it contrasts with whatever it sits on by construction. Verified by
tabbing in for real (`.focus()` does not reliably match `:focus-visible`) in both modes and on
both a selected and an unselected segment. The accent swatches keep `--accent` — their offset
is positive, so their ring lands on the page background.

**Back to Top: floats, then settles — and lost its label.** Brajeshwar: *"Remove the text
'Back to Top'. Keep the arrow. It is not fixed at the footer. I wanted it to be visible once a
user starts scrolling and beyond certain scroll height. So, this should start floating and
then settle above the footer (what it is currently)."*

Now a 32px circle with just the arrow (`aria-label` + `title` carry the name), and both the
float and the settle come from one `position: sticky; bottom: var(--space-l)` on the row —
no fixed/static swap, no per-scroll measuring. Mid-page the row's own place in the document
is far below the fold, so sticky pulls it up off the viewport bottom; near the end that place
scrolls into view and the row comes to rest where it actually lives. The settle is not an
effect, it is the row arriving at itself. Measured: floating at exactly 40px off the viewport
bottom, released to 288px at the foot of a long post, settled at 80 above / 30 below.

JS decides only *whether* it shows (`scrollY > 1 viewport`, coalesced into a rAF), never
where.

⚠️ **This needed a change in `base.css`: `body { height: 100% }` → `min-height: 100%`.** The
definite height made the body BOX exactly one viewport tall on every page — content just
overflowed it visibly, so nothing ever looked wrong — but a sticky child is clamped to its
containing block, so the control could not float past the first screen. Verified nothing
depended on it: the four other `height: 100%` rules in the CSS are all deep in the tree with
their own sized parents, `/contact/` still fills the viewport (body 861 = innerHeight), and
the homepage's `height: 100%` cards are unaffected.

Two more non-obvious pieces:
- **Row `pointer-events: none`, button `auto`.** The row is a full-band-width strip lying
  across the content while it floats; without this it would swallow clicks on the text
  underneath. Hit-tested: a point in the strip 60px left of the button returns the article.
- **The disc must be opaque** (`--bg-color-lower`), and the hover mix goes *into* that rather
  than into `transparent` — a see-through disc with prose crossing it is unreadable.

Hover darkens via `color-mix` of the foreground — not a `--bg-*` token, because
`--bg-color-high`/`--bg-color-higher` both bridge to `--color-primary`, which is a
*foreground* color and would paint a near-black chip under dark text. That trap has now been
hit twice; the comment in `chrome.css` names it.

Spacing at rest: the row takes the `--space-2xl` seam the footer used to own and sits
`--space-m` above it, so it reads as the footer's approach rather than as something tacked
onto the article. This needs `.back-to-top-row + footer { margin-top: 0 }` — adjacent
margins collapse to the larger, so the footer's own `2xl` otherwise stranded the control
mid-gap. Caught by measuring, not by looking. The hide is `visibility`/`opacity`, not
`display`, so the row keeps its box and the footer never jumps as it fades in.

⚠️ **Verified with the `computer` scroll action, not `window.scrollTo`** — see the automation
note below; programmatic scrolling fires no scroll events here, so the show/hide threshold
would have looked broken. Full sequence checked on a 38,000px post: hidden at the top, fades
in past one viewport, floats at the band's right edge, settles above the footer, fades out
again on the way back up.

⚠️ **The browser caches `assets/scripts/*.js` across a normal reload.** A `jekyll build` plus
`navigate` showed the NEW inlined CSS with the OLD script still running — the arrow-only
markup was simply absent and it read as a broken script. `cmd+shift+r` is required after
editing a JS file; a `?cachebust` query on the page URL does not help, since it is the script
request that is cached.

Budget after all of this: 6.9–7.3 KB gzip inlined per page (33–35 KB raw), well under 13 KB.

### Back to Top, first cut (2026-07-27) — superseded above
Replaces the per-period *"↑ earlier / ↓ back to the start"* links on `/about/`, which were
hand-maintained — each named a sibling id, so adding or reordering a period silently pointed
them somewhere wrong — and existed on that page only.

`assets/scripts/back-to-top.js` + `.back-to-top` in `chrome.css`. Two conditions, both
deliberate: the control is only built on a page taller than 2.5 viewports, and only
appears once the reader is a viewport down. Verified `/about/` (6.15× tall) builds it and
`/contact/` (1×) does not. *(The "appears once a viewport down" half was dropped when the
control moved into the flow — see above. The 2.5-viewport build condition stands.)*

It is a real `<a href="#top">` — `#top` is defined by HTML as the document top, so the link
works with no click handler, and the global `scroll-behavior: smooth` animates it, which also
means it inherits the `prefers-reduced-motion` kill switch instead of needing its own check.
JS only toggles visibility.

⚠️ **Testing note: programmatic scrolling fires NO scroll events in this automation context.**
`window.scrollTo` moved the page 1,722px and produced **0** events, which made the control look
broken across several checks while the logic was fine — a manually dispatched event toggled it
correctly, and real wheel scrolling worked first time. **Verify scroll behavior with the
`computer` scroll action, not `window.scrollTo`.**

### Copy-paste templates, and a sidenote regression fixed (2026-07-27)
- **Templates in `_pages/about.html`** — a period and a sidenote, in a Liquid comment so
  they cost nothing to ship. As an HTML comment they added 3,725 bytes to `/about/` for
  something only the author reads. Verified inert: absent from the built HTML, present in source.

⚠️ **Making pages full-width silently broke sidenotes on pages** (commit `54ea75e8`).
`sidenotes.js` looks for the reading column to hang notes off; removing `.container-ideal` from
`page.html`'s article removed the column. `/books/` and `/about/brajeshwar.com/` lost their
margin notes — **and nothing looked broken**, because footnotes still rendered at the foot,
which is the designed fallback. Found by measuring: 2 refs, 0 sidenotes.

Fixed two ways:
1. `sidenotes.js` now matches `.container-ideal` rather than `article.container-ideal`, so a
   hand-written page can opt in with a `<div class="container-ideal">` wrapper.
2. `page.html` puts the class back when the rendered content contains a footnotes block.
   Detected from content, not a front-matter flag, so it cannot drift.

⚠️⚠️ **Liquid's `assign` does NOT evaluate `contains`.** The first attempt hoisted the test into
`{%- assign has_footnotes = content contains '…' -%}` — which fails *silently and truthily*, so
**all 22 pages** got the class. `contains` is only evaluated by `if` / `unless` / `case`; the
test has to live inline in the `if`. Caught by checking a page that has no footnotes.

Trade-off recorded in the layout: a footnoted page is measure-width throughout, so a grid on it
will not span the band. Both current users are pure prose. A page needing both should wrap only
the footnoted part.

### Content base moves onto `main` — pages match posts (2026-07-27)
Brajeshwar: *"the font-size of the articles (posts) are good, but I see the ones in the pages
are smaller."* Root cause: `body { font-size: var(--font-size) }` is a flat 16px that
bypasses the type scale, and `.post` was the only rule reading `--step-0`. Posts were never
special — they were the only content on the scale. Everything else inherited 16px.

**`main { font-size: var(--step-0) }`** now, which fixed a second, unreported bug at the same
time:

⚠️ **The Kindle text-size control did nothing on pages.** The A-buttons multiply `--step-*`
inside `main`, but page prose was inheriting body's literal 16px, which no multiplier touches —
**measured identical at xs/s/m/l/xl before the change**. Reading the size from `--step-0` *at
main*, where the scaled values are defined, is what lets the control reach it. After: pages run
17 / 18.5 / **20** / 21.5 / 23px across the five settings, exactly like posts.

- Deliberately on `main`, not `body` — body also parents the header and footer, and raising
  it would have inflated the chrome with the content. Verified unchanged: nav 16px, colophon
  10.67px, body 16px.
- `.post { font-size: var(--step-0) }` removed as a restatement. Posts verified still 20px,
  text-scale still working, sidenotes still rendering.
- `--font-size: 16px` in `config.css` is now referenced by `body` only. It is a hand-picked
  number in a codebase whose golden rule is *"never hand-pick a font-size"* — left alone for now
  because body's value is what the chrome inherits, but it is the next thing to put on the scale.

### Pages fill the band; the card grid goes fluid (2026-07-27)
- **`/about/` gained an intro slot** above the timeline and outside `.timeline-period`, so the
  Life/Work filter can never hide it — verified visible under both filters. Placeholder text
  and the `/about/brajeshwar.com/` link are there for Brajeshwar to replace.
- **Every page fills the standard band.** `page.html`'s `.container-ideal` wrapper is gone —
  that was what held prose pages at 665px inside a 1024px band. `page.css` now caps the TEXT
  elements at `--measure` instead, so a grid or table spans the width while paragraphs keep
  ~66 characters. Verified on `/books/`: article 1024, prose 665, left-aligned, content
  untouched (he asked for his text to be left alone). `full: true` is now inert.
- **`ul.item__cards` is a fluid grid**, was `flex-flow: row wrap` with a fixed 220px card cap —
  which packed left and left a ragged gap that grew with the window.
  `repeat(auto-fill, minmax(var(--card-min), 1fr))` now. Verified on `/film/`: 5 equal 193px
  columns spanning exactly 1024px, images filling their cards.
  ⚠️ **auto-fill, NOT auto-fit** — auto-fit collapses empty tracks, so a two-item section would
  stretch across the whole band. The archives strip wants exactly the opposite and uses
  auto-fit; the difference is whether a short row should fill or stay card-sized.
- Card density is now one knob, `--card-min` (11rem, 8rem on phones), not a max-width per card.
- **Layout patterns are named in [`styles.md`](styles.md) §6** — reading, timeline, album,
  listing — with the rule that timeline is a shared *look* with no shared file, and that a
  third timeline page is the trigger to extract a real layout.
- `/books/`, `/photos/`, `/wear/` were not converted: none has thumbnail data yet, and
  Brajeshwar explicitly asked that `/books/` text not be replaced.

### Headings follow the ONE shared scale (2026-07-27)
Brajeshwar: *"we already have a common style for all titles … all Hx styles should be the
same."* He was right — `base.css` has defined it all along: `h1`–`h6` at
`--font-weight-light` on the Utopia steps (h1 `--step-3` … h6 `--step--2`), `line-height:
var(--scale-small)`, `text-wrap: pretty`. The timeline and /now/ were overriding it.

**Removed every typographic override** from `.timeline-head h1`, `.timeline-when`,
`.timeline-title` and `.page-now h1` — size, weight, color, letter-spacing, tabular figures.
They now take the shared scale purely from their heading LEVEL. Verified computed values match
a bare `h1`/`h2`/`h3` exactly: 39.06 / 31.25 / 25px, weight 200, same color; a clean
descending hierarchy of page title → period → entry title.

What stays in those rules is structural only: the `position: relative` the § anchor needs, the
spacing, `scroll-margin-top`, and the `-0.06em` optical nudge. That nudge is an *alignment*
correction, not typography — larger digits carry more left side bearing, so the painted glyph
drifts right of the spine. Being em-based it now tracks whatever size the shared scale gives.

**To resize a heading, change its LEVEL or the shared scale — never the component rule.** That
is the whole lesson: the previous pass had reached for `--step-2` directly and produced a
timeline whose headings agreed with nothing else on the site.

⚠️ **`/now/`'s years are `h1`, `/about/`'s periods are `h2`**, so /now/ renders one step larger
(step-3 vs step-2). That is the shared scale behaving correctly on different levels, not a
style difference. Matching them means changing `#` to `##` in the `now/` fragments — a content
edit, and Brajeshwar's call.

### Timeline section titles: bigger, nudged left (2026-07-27) — superseded above
Brajeshwar: *"the breaks in the timeline due to the section titles is too jarring."* The cause
was that the year sat at `--step-0`, barely above the entry text — so it read as an
interruption in the flow rather than a marker for the block beneath it. A title that isn't
clearly doing a different job reads as a break rather than a heading.

- **`--step-0` → `--step-2`** (20px → 31px, now ~1.95× the 16px entry text).
- **`margin-left: -0.06em`** — optical, the same idea as the logo's nudge: larger digits carry
  more left side bearing, so the painted glyph drifts right of the spine it should line up
  with. At 31px that is 1.9px back. Em-based, so it stays proportional if the size changes.
- Applied to both `.timeline-when` (about) and `.page-now h1` (now) — they are a deliberate
  copy of each other, and this is exactly the kind of change that has to be mirrored. The
  comment in `now.css` now says so explicitly.
- The § headerlink is positioned in `em` off the heading, so it scaled with it; verified still
  attached and placed.

### Gear icon; archives hairline; /now/ wears the timeline (2026-07-27)
- **Theme icon → gear.** The half-filled contrast circle read as "light/dark" when the panel it
  opens is really all of settings — mode, palette, font, size, accent. Filled gear traced from
  Heroicons (MIT), which `styles.md` §4 already names as an acceptable source for a filled
  glyph. Same 24-viewBox / `currentColor` / 20px shape as the rest of the set, so it inherits
  the icon sizing and the quieter icon color with no extra rules.
- **Archives: a 1px hairline between the "20" and the tray.** The century was centered exactly on
  the tray's edge, so the glyph and the border touched and read as one shape.
  `translate(calc(-50% - 1px), -50%)` gives it daylight without breaking the illusion that the
  rest of the number continues underneath. Measured: 43px visible / 41px hidden.
- **`/now/` now wears the `/about/` timeline's visuals** — spine, dots, quiet year headings,
  prose held at the measure. Done purely in CSS against the markup kramdown already emits, so
  not one word of content moved. `now.md` include_relative's eleven year fragments from
  `now/`, each `# YYYY` + a bullet list, which maps straight onto the timeline's shape:
  `h1` → `.timeline-when`, `<ul>` → `.timeline-entries` (the spine is its `border-left`),
  `<li>` → `.timeline-entry` (the dot). Year headings also gained § anchors, so `/now/#2024`
  works — `anchors.js` picked up a third selector rather than a third script.
  ⚠️ Those visual rules are a **deliberate copy** of timeline.css's, not a shared import: both
  are tier-2 page bundles never loaded together, so sharing means promoting to base.css and
  charging ~1,456 pages for what two use. Same call as `.headerlink`. **Keep them in step.**

### Appearance panel: Sans-Serif back, every group on one line (2026-07-27)
- **"Sans-Serif" (Geist) restored** as a third font option. It was dropped 2026-07-19 for its
  weight; Brajeshwar re-added the file and asked for the option back. FOUR places must agree
  and all four were changed: `AXES.font.opts` in `appearance.js`, the `[data-font="geist"]` rule
  in `config.css`, the `@font-face` in `themes.css`, and the no-flash whitelist in
  `default.html` — miss that last one and picking Sans-Serif flashes the default font on every
  load. The comment there already warned about this; it is now cross-referenced from the JS too.
  Verified end to end: attribute set, value stored, `--font-body` resolves to Geist, and
  `document.fonts` reports the face loaded.
- ⚠️ The file is a **169 KB unsubsetted TTF**, which is exactly why it was dropped before. Costs
  nothing unless chosen, but a subset woff2 would be ~10× smaller — logged in `todo.md`.
- **Every group is now label-left / options-right on one line**, matching what Accent already
  did: `buildEnumGroup` adds `appearance-group--inline`. The panel widened 15.5rem → 21rem
  because "FONT  Default Sans-Serif Serif" and "TEXT SIZE  A A A A A" wrapped at the old width —
  which is the layout the change existed to remove. Verified all five groups inline, options on
  a single row, nothing overflowing.

⚠️ **`jekyll serve --incremental --future --livereload` is what put 2100 posts on the site.**
Brajeshwar runs that locally, and **`--future` builds the never-publish drafts in
`_posts/todo/`** (the 2100-dated ones) into `_site` — 1,464 posts instead of 1,456, `/2100/`
pages, and a 27th "00" year in the archives. His watcher and any `jekyll build` here share the
same `_site`, so they overwrite each other and local measurements flip depending on who built
last. **Production is unaffected** — the Actions workflow runs a plain `jekyll build` on a fresh
checkout. If a local count looks wrong, run `jekyll clean` and rebuild before believing it.

### Post media and the footer seam, finished (2026-07-27, late)
The last run of changes before the session closed, all on how a post ends and how it carries
media.

**The footer seam.** It was 182px between the prev/next bar and the footer, against the
80px a page with no Back to Top gets. Four margins made it, and the surprising one is worth
keeping: `.post-nav`'s bottom margin did not collapse away, because `main` is
`container-type: inline-size` and that establishes an independent formatting context — the last
child's bottom margin is trapped inside instead of merging with what follows, so it *stacked*.
Then the order changed on request: the arrow moved above the bar and the bar went tight to
the footer. It is now article → arrow → PREV|NEXT → footer, 30px between each.

Two traps in that one change:
- **`~`, not `+`.** `main:has(.post-nav) + footer` matched nothing, because `post.html` emits a
  `<script>` between `</main>` and `<footer>`. The footer silently kept its 80px and the change
  read as having failed rather than as having missed. In this repo, never assume `main` and
  `footer` are adjacent.
- **`width: var(--body-width)` applied twice.** Moving the row inside `main` meant the 96% was
  taken of the band rather than the viewport — the arrow landed 20px short of the edge
  everything else lines up on. `main > .back-to-top-row { width: 100% }`.

**The divider is gone.** Two versions were tried — a foreground hairline, then an inverted notch
— and both were a mark asking to be noticed on a control whose job is to be quiet. The halves
touch; the hover tint draws the boundary only while it matters. It also deleted the
first/last-post special case, since no rule is left that needs to know how many links there are.

**Media.** Videos and embeds take the band like the wide images (665 → 1024). Content media gets
`--border-radius`, via `main :where(img, video, iframe)` — `:where()` keeps it at (0,0,1) so
anything with an opinion overrides it, and the `main` scope keeps it off the header logo and
footer icons.

⚠️ **`photo-cover` is full-bleed again, and is now the site's ONE documented exception** to
"nothing goes past the band". It had been brought onto the band earlier the same day; that was
wrong for this element. It is a flourish, not content. Its caption stays on the body width — the
only caption on the site that does not match its own figure. See `styles.md` §6.

### ⚠️ 882 GPG signatures lost to a history rewrite (2026-07-27)
**What happened.** Two `.afphoto` purges were run to get past GitHub's 100 MB file limit — first
`git filter-branch` over the unpushed range, then `git filter-repo` over the whole history to
remove `static/*.afphoto` (191 MB). Both tools **discard GPG signatures**: a signature covers the
commit object, so changing a tree or a parent invalidates it, and neither tool re-signs.

**The cost, measured after the fact:**

    before   882 G   347 N   9 E      (1,238 commits)
    after      0 G  1,237 N            (1,237 commits)

    Brajeshwar Oinam    867 signed commits
    Brajeshwar           15 signed commits
    span                 2022-10-07 → 2026-07-26

The remote was force-pushed to the rewritten history, so the signed copy exists nowhere any
more. Brajeshwar's call: *"What ever done so far be done."* Not restored.

**Why it was not caught.** The rewrites were verified thoroughly for CONTENT — tree hashes
identical, 1,237/1,237 commits matched by date+subject, 31 commits deep-compared with zero
non-`.afphoto` differences — and not at all for METADATA. Signatures are commit metadata. A
verification plan that only checks what it thought to check is how this passes.

**The rule now, in CLAUDE.md guardrail 8:** before any history rewrite, run
`git log --format='%G?' <range> | sort | uniq -c`, tell Brajeshwar what it will cost, and get his
answer first. A rewrite is his decision, not a tidy-up.

**Also worth keeping:** the 166 MB file that started this was blocking the push because **GitHub
rejects on the BLOB, not on the tree** — deleting a large file in a later commit does not help,
because the blob is still in the history being pushed. That is why a rewrite was the only fix,
and why `*.afphoto`, `*.psd`, `*.sketch`, `*.fig` and friends are now in `.gitignore`: the
failure arrives as a push rejection long after the mistake.

### Commits are signed, in Brajeshwar's name, and pushed only on request (2026-07-27)
Brajeshwar: *"going forward, all commits will be signed. You can even push but only after I say
so. But, all commits are in my name, none others."*

- **Signing is not a limitation of the agent environment** — this was checked, not assumed.
  `commit.gpgsign = true` is set, the key is in the agent, and `git commit` from an agent shell
  signs with no prompt. `f19eab95` was made from one and verified `G`. Anything unsigned in this
  repo's recent history was stripped by the rewrites above, not left unsigned at creation.
- **Verify, don't trust:** `git log --format='%h %G?'` after committing. `G` or it is wrong.
- **All commits are Brajeshwar's.** No Claude/Anthropic attribution anywhere — not authorship,
  not co-author trailers, not "Generated with", not in code comments or docs.
- **Committing is fine; pushing waits for him.** Every push to `main` auto-deploys.

### Documentation clean-up + handoff (2026-07-27, end of session)
A full pass over every doc, because several had drifted far enough to mislead rather than help.

**Corrected in `CLAUDE.md`** (all four were current-state claims, not history):
- post count `~1,463` → 1,464 files / 1,456 built (12 in `_posts/todo/` are 2099-dated and
  held back by `future: false`);
- `12 CSS files` → 13 (`timeline.css` arrived with the `/about/` rework);
- guardrail 6's *"concatenate+minify … not yet built"* → built, as minify-only, with the
  in-place design and the concat decision recorded;
- the budget line re-measured: heaviest page is 7.3 KB gzip / 34 KB raw against the 13 KB
  ceiling.

**`styles.md` and `sidenotes.md` were still citing the PRE-FLATTEN filenames** — `0.0-config.css`,
`1.1-base.css`, `0.1-color.css` and friends, eight days after the flatten. Every one repointed.
The remaining hits are inside the old→new map and the audit tables, which are history and stay.

**New reference material** (this session's rules, written where they will be looked for):
- `styles.md` §6 → **Breaking out of the reading column — RIGHT ONLY**: the `100cqi` idiom, what
  it replaced, everything that takes the band, and the two traps (`photo-cover` cannot use `cqi`;
  wide media now sits in the sidenote gutter).
- `styles.md` §1 → the **interface-vs-prose font rule**, stated as a principle with the opt-out
  list and the warning that the failure is invisible at the default font.
- `sidenotes.md` → **Images without dimensions**: the placement race, the measured numbers, the
  `ResizeObserver` patch, and why it is a patch.
- `hosting.md` → Node 22, esbuild unpinned, and an explicit note that the Cloudflare build
  command deliberately omits the minify step.

**Verified mechanically, not by eye:** 0 broken cross-doc links across all 11 docs + `CLAUDE.md`
+ `README.md`; 0 docs missing from the index; `todo.md` reconciled to 17 open / 38 done.

**The `## Where we are` block at the top of this file was 40 commits stale** — it described an
11-commit push that had long since been superseded, and still said Geist was removed. Rewritten
as a real handoff: what to push and what to watch, the state in a paragraph, the reader-visible
changes, the rules learned, the verification loop, and a five-item shortlist.

### Interface stays sans; post titles take the band (2026-07-27)
Brajeshwar: *"UI Elements such as the PREV | NEXT should always be in the sans-serif system
fonts. Making it serif is weird."* and *"Posts titles should extend the full length of the body
width."*

**The font-scope rule is now stated as a principle, not a list of accidents.** Prose follows the
reader (`--font-body`); interface is pinned to system sans. The distinction is what the text
IS, not where it sits: prose is the reader's to set, controls and labels are the site's. A
Prev/Next bar set in Libre Baskerville reads as a sentence, which was the complaint.

`header` and `footer` are chrome by position and were already covered. Everything else inherits
`--font-body` and has to opt out by name — now `.post-nav`, `.pill` (the /about/ Life/Work
filter; the appearance panel's copy was already sans only because the panel is) and
`.back-to-top-row`. That last one had a `font-family` until it became icon-only and lost it
silently — which is precisely the failure this list exists to prevent.

⚠️ **This class of bug is invisible by default.** It only appears for readers who picked Serif
or Sans-Serif, and the default is System — so casual checking will never show it. Add to the
list when adding a control inside `main`.

**Post titles span the band**, using the same `100cqi` idiom as the wide images, so the title,
the images, the header rule and the footer rule all end on one line. The measure is a constraint
on READING, and a title is scanned rather than read — a longer line costs nothing there and buys
fewer wrapped lines. The title still follows the reader's font, correctly: it is content.

### One width, finally — and the nav divider becomes a notch (2026-07-27)
Brajeshwar: *"The full width of the content, such as in the articles, is not the same the
header, footer, etc. They should all be the same width."* and *"The vertical bar in the posts
PREV | NEXT looks weird. Either replace with a transparent bar or invert the color."*

**The mismatch was 64px, and only `.large` had it.** Measured on a post: header, `.footer-inner`,
`main` and `.post-nav` were all 244→1268 already. `figure.large` stopped at 1204 — the
`--image-width-max` middle step (60rem/960px) kept from the breakout change the day before.
Everything else on the page agreed; that one class did not. Removed the step: `.large` and
`.full` are now both `100cqi`, so a wide image ends on the same line as the header rule and the
footer rule. Verified: one distinct right edge across all six elements.

The two classes are now identical in behavior. Both are kept — 24 `.full` and 58 `.large` in the
content, and content is not ours to edit — but there is one behavior to maintain, not two.
`--image-width-max` is gone with the step (and `--body-width-medium` before it, same lineage):
there is no intermediate left to name.

**The divider is now a notch cut through the bar, not a line drawn on it.** It was
`--border-color`, a mix of the foreground — correct as a hairline between paragraphs, wrong
inside a filled bar with a link either side. It takes the PAGE background now, so it reads as a
slit. That inverts by construction in both modes: the bar is `--bg-color-low`, the page is
`--bg-color-lower`, and one is lighter than the other in light and darker in dark, so the notch
contrasts with what surrounds it without a second rule. It also survives the hover tint, which
the foreground-mix hairline had started to disappear into. Verified in both modes, hovered and
at rest.

### Nav spans the band; captions match their figures (2026-07-27)
Brajeshwar: *"The PREV | NEXT should extend the whole width of the content. Now that our article
contents including FIGURES are inside, make the figcaption the same width as the FIGURE
container."*

Both are the same consequence of the breakout change: things that were capped at the reading
measure now sit next to things that span the band.

- **`.post-nav` dropped `.container-ideal`.** It was held at the measure to match the article,
  which was right while nothing in a post was wider. It is a direct child of `main` and carries
  no width of its own, so removing the class is the whole fix — it fills the band, and its two
  halves reach the same edges the images do.
- **`figcaption` lost `max-width: --body-width-ideal; margin: 0 auto`.** Capped at the measure
  and CENTERED inside its figure: invisible while every figure was column-width, wrong the moment
  one was 1024px — the caption's rule sat inset from both edges of the image above it and lined
  up with nothing. Now full width of its parent, so the underline always tracks the figure's own
  edges. `photo-cover__desc` got the same treatment against `photo-cover`.
- Removed with it: `figure.full figcaption, figure.large figcaption { padding-inline: 0 }`, which
  was a no-op — the base rule already sets `padding: X 0`. It existed to compensate for the
  centering that is now gone.

⚠️ **And a real bug the breakout change exposed: sidenotes landing on top of images.**
`sidenotes.js` dodges wide media via `collectObstacles()`, and that logic was fine — the
*timing* was not. Images here carry no width/height attributes, so they contribute almost no
height at first layout. Measured on `/2005/mumbai-marooned/`: the figure was **79px tall when
the note was positioned and 675px once the image decoded**, leaving the note sitting on the
photograph with `readyState: complete` and `img.complete === true`. `window.load` was supposed
to cover this and can fire before a cached image has been laid out, so it was a race the page
only usually won — and it started losing once wide media stopped spilling left and began
extending RIGHT, into the gutter the notes live in.

Fixed with a `ResizeObserver` on the images, not the article: placing a note changes the
article's size, so observing the article would re-trigger the observer on its own output. An
image's size does not depend on where a note sits, so there is no loop.

⚠️ **Testing note:** `python3 -m http.server` is single-threaded and starved under a blocking
CDP eval, so images reported `complete: false` for minutes and the page looked broken in ways
the code was not. Use `ThreadingHTTPServer` when checking anything image-dependent.

### Breakouts extend right only, never left (2026-07-27)
Brajeshwar: *"For images, videos and other contents inside the articles, should no longer be
extended to the left side. No contents cannot go beyond the left container. If we are extending
it, then we will do it to the right, so it is still within the body width."*

Four breakout kinds, all in real use across the archive — `photo-cover` (72), `img/figure.full`
(24), `img/figure.large` (58), `.gallery` (7). All did the same thing: viewport-wide, then
re-centered, so they spilled equally into BOTH margins. On this asymmetric layout the left margin
is the page's alignment edge — the line the prose, the header rule and the footer rule all start
from — so spilling into it was the visible problem.

**The mechanism is `100cqi`, not the old `100vw` + negative-margin + `translateX` dance.** `main`
declares `container: main / inline-size`, so inside an article 1cqi is 1% of THE BAND. The idiom
is two lines — `margin-inline: 0` to keep the left edge, `width: 100cqi` to grow right — with no
viewport arithmetic, so it cannot drift when the site width changes and it does not have to know
about scrollbars (100vw includes them, 100cqi does not).

⚠️ **`photo-cover` cannot use it.** `post.html` emits it before `<main>`, so it is a `<body>`
child with no container ancestor and cqi falls back to the viewport — exactly the full-bleed
being removed. It is given the band's own three lines instead (`--body-width` /
`--body-width-max` / `margin-inline: auto`), which must be kept in step with `main` by hand.

⚠️ **`.post img { width: 100% }` was silently beating `img.full`.** Both are (0,1,1) and post.css
loads after base.css, so an `img.full` measured 665px — the column — while a `figure.full` got
the full band, because `.post img` does not match a `<figure>`. **Two authoring forms, two
different results, no error anywhere.** Now `.post img:not(.full):not(.large)`.

**That is the fourth instance this session of base.css setting geometry and post.css quietly
overriding it** (`.post { margin }`, `.post-nav { margin }`, `.post img { width }`, plus the
`.container-ideal` shorthand cases). The rule is now explicit in post.css: in this file, set only
what this file has business setting, and exclude the classes base.css sizes.

`--body-width-full` (1600px) is gone — its only readers were these breakouts, and nothing is
allowed past the band any more, so a token naming a width beyond it named nothing.

Verified on one post of each kind at 390 / 768 / 1024 / 1512px: left edge exactly on the band in
every case, nothing past the band, no horizontal scroll anywhere. Sidenote collisions are already
handled — `collectObstacles()` in sidenotes.js looks for `.full, .large, .gallery` and pushes
overlapping notes below them; confirmed it self-corrects on `window.load` once images have height.

### Post nav: flush edges, a divider, and an alignment bug that predated it (2026-07-27)
Brajeshwar: *"the navigation of PREV and NEXT needs to be flushed left and right… hover where
the background color changes… a vertical separator bar when it has both… the ones with NEXT or
PREV should have the full width… move the arrow a bit to the left or right in hover."*

All five done, and the markup changed to make three of them fall out rather than be special-cased:

- **Wrapper `<div>`s gone.** The links are direct children of the nav now. The old markup
  emitted an empty `<div>` for the missing side, so on the first and last posts — the only
  two with a single link — half the bar sat visibly blank.
- **flex + `flex: 1`, not `grid-template-columns: repeat(2, 1fr)`.** The grid always reserved two
  equal tracks. With flex, one child takes the whole width and two split it, no special case.
- **The divider is `a + a`.** It cannot match a lone child, so the single-link posts get an
  unbroken bar without a rule of their own.
- **Flush** via `justify-content: flex-start / flex-end`, and the arrow is its own `<span>` so it
  can `translateX(±0.25em)` on hover without reflowing the label. Transform only; the global
  reduced-motion block zeroes the duration.
- **Hover** mixes 8% of the foreground INTO the bar's own background rather than into
  `transparent`, so the hovered half reads as a solid step rather than a translucent patch.
  Verified it differs from the bar in both modes: light 0.922 → 0.860, dark 0.269 → 0.326.

⚠️ **The bar had never been aligned with the article it belongs to.** `.post-nav` carried
`margin: var(--space-l) auto` while also wearing `.container-ideal`, whose whole job is
`margin-inline: 0 auto`. post.css loads after base.css at equal specificity, so `auto` won and
the nav was **centered while the article was left-aligned — measured 179px out of step**. Fixed
with `margin-block`, setting only the axis this rule has business setting.

**This is the third time this session that a `margin` shorthand has silently canceled
`.container-ideal`'s `margin-inline`.** The pattern is now: in any rule that also wears
`.container-ideal`, use `margin-block`, never the shorthand.

### The five highest-value items, plus the tidies (2026-07-27)
Brajeshwar: *"Do all of the Highest Values (1 to 5). Git commit for each of them meaningful
feature completion."* Nine commits landed. Three of the five turned out to be misfiled, which
is the useful part of this session — the audit's descriptions were written from reading, and
measuring disagreed.

**1. search.css.** Filed as "re-implements Pagefind's own stylesheet, ~6 KB of 9.7 KB". A
rule-by-rule comparison against a real `pagefind-ui.css` found zero shared selectors —
Pagefind's carry Svelte scoping hashes, so they are (0,3,0) against our (0,1,0), and its
`<link>` sits in the page body so it also won every tie against our inlined `<head>` styles.
The file was almost entirely inert. Proved by A/B: removing it completely changed nothing —
same padding, same radius, same 21px title, same browser-default *yellow* `<mark>`. Fixed by
scoping under `#search`. Two real bugs fell out: a focus style with inverted nesting that never
matched (no focus ring on any result, ever) and an empty `result-thumb` reserving a blank column.

**2. chrome.css repetition.** Real, and done: `.icon-button` for the three round header
controls, the two backdrops and the shared half of the two cards grouped. 1,010 bytes raw /
74 gzip off every page. `.footer-social a` was listed with the icon buttons in the audit and
deliberately NOT merged — measuring says it is a different treatment.

**3. Node 18 → 22 LTS.** Straightforward.

**4. Minify on publish.** esbuild, 36.7 → 15.2 KB raw, 13.9 → 6.6 KB gzipped. In place,
changing no HTML reference — that is the design: local `jekyll serve` and the Cloudflare backup
never run the step and keep the readable originals. Pointing the layout at CI-only bundles
would have left the standby host with no JavaScript at all. Concatenation considered and
deliberately dropped.

**5. Geist → woff2.** 169,056 → 47,596 bytes, 72%. The variable axis survives — verified by
reading `fvar` back out AND by measuring three different rendered widths at 100/400/900,
because a naive subset flattens a variable font and every weight silently becomes 400. The
`.ttf` was still shipping; now excluded from the build.

⚠️ **And it turned up a real typographic bug.** Libre Baskerville's three faces declared
`unicode-range: U+000-5FF`, but the files contain `’ “ ” – — • …` — all above U+05FF. The range
forbade the browser from using the font for exactly the characters that carry a serif's voice,
so a reader on Serif got Libre Baskerville for the letters and the *system* serif for every
apostrophe: **3,197 times in a 400-page sample**. All four faces now declare ranges read off
their own cmaps.

**Dark mode: removed, not repaired.** Brajeshwar asked for "the best practice that is the
standard on the Internet", and that is to leave photographs alone — `color-scheme: light dark`
for UA surfaces (already declared), nothing on content images. The old rule also keyed off the
OS rather than `[data-theme]`, but fixing the selector would have shipped a worse page.

**Tidies.** Dead selectors removed after re-verifying against the 1,456 *built* pages;
`scroll-behavior` duplicate, `--sidenote-min-gutter` and `--body-width-medium` gone. Two were
NOT done and are re-scoped in todo.md: the `.sidenote` double-declaration is a refactor of live
behavior rather than a tidy, and "two spacing systems, only 3 rules" is 10 call sites, each
a visible spacing value.

**Closed by decision:** Home parked (books treatment is Brajeshwar's call — SVG or text block),
theme-toggle-without-JS closed as *no* (persistence is the point), analytics closed (the width
stands on the sidenote arithmetic).

### Panel in two columns · Font "System" · Warm is now Flexoki (2026-07-27)

**1. The appearance panel is a two-column grid.** Brajeshwar: *"align them into two columns,
the labels on the left and the content (options on the right)."* Each row used to be its own
flex line with `justify-content: space-between` — label left, control right, but every control
STARTING at a different x, because the label's own width decided where its pill began. Five
ragged rows.

The fix is that alignment is the panel's job, not the row's: `display: grid` with
`grid-template-columns: max-content 1fr` on `.appearance-panel`, and `.appearance-group` reduced
to `display: contents` so each label/control pair drops into the panel's own columns.
`max-content` rather than `auto` so the label column never claims space when a control is
narrow. `.appearance-group--inline` is gone from both the CSS and the JS — it existed only to
make a row lay itself out.

`display: contents` is safe here: the group is a plain `<div>` with no role, and the
label↔control association is `aria-labelledby`, which is id-based and indifferent to the box
tree. Measured after: all five labels at x=905, all five controls at x=997.2, right edges at
1247, every label on one line ("TEXT SIZE" no longer wraps).

Panel widened 21rem → 24rem, since a dedicated label column takes width from the controls.
Checked down to a 320px viewport: no control overflows its track and no pill segment clips its
own text (`min-width: 0` on the segments means the track can look fine while the buttons clip,
so both were measured).

**2. Font: "Default" → "System".** Label only. It names what the option is — the OS UI face —
where "Default" only said it was the one you get without choosing, which is true of the first
option on every axis. The stored value is still `sans`, so none of the other three places that
must agree for a font option changed, and no reader's saved choice needs migrating.

**3. Warm is now [Flexoki](https://github.com/kepano/flexoki).** Brajeshwar: *"Our 'Warm' theme
should be based on…"*. Note the history: Flexoki was ONE OF FIVE palettes until the trim to
three (logged further down this file, 2026-07-19), when it was cut and Warm stayed a
hand-rolled sepia ramp. It is now back as the basis for Warm itself.

- **Hex, not `oklch`** — the only palette in the file written that way, deliberately. These are
  upstream's published values copied verbatim from `kepano/flexoki` `css/flexoki.css` so they
  can be diffed against it; converting would round every one and lose that. `color-mix(in
  oklch, …)` takes hex without complaint.
- **11 slots, 15 steps** — base-150/-800/-850/-950 get none. Each line names its source step.
- **Its own dark mixin** (`eink-dark-semantics`), because Flexoki's dark form is not the generic
  dark remap applied to a warm ramp. Left to the shared mixin, Warm-dark would have landed on
  base-900 with paper-white text; Flexoki puts the page on `black` and the text on base-200,
  which is the whole character of it. Mappings taken from kepano's own docs theme
  (`vitepress/index.css`), and wired into BOTH dark branches (explicit and inside the
  `prefers-color-scheme` media query) exactly as nord's accent already is — the specificity note
  further down this file explains why both are required.
- **One deliberate divergence.** Flexoki's `tx-3` is base-300, which measures 2.00:1 on
  paper — right for the hairlines it is meant for, unreadable for what this site spends
  `--color-fg-subtle` on (sidenote body text). Stepped one notch: base-600 (4.97:1) light,
  base-500 (5.19:1) dark. The same bump the default palette already makes, for the same
  reason.
- **Accent stays monotone**, drawn from the same ramp. Color on this site is opt-in through the
  Accent axis (design.md), so a palette does not get to introduce a hue. Flexoki ships eight
  accent hues if that ever changes; kepano's own docs theme uses cyan-600.

Verified live in both modes. Light: page `#FFFCF0`, text `#100F0F`, surface `#F2F0E5`, bg-muted
`#E6E4D9`. Dark: page `#100F0F`, text `#CECDC3` (11.98:1), fg-muted `#9F9D96` (7.05:1),
fg-subtle `#878580` (5.19:1). Checked on a post and on `/archives/`.

⚠️ **The attribute value stays `eink`**, not renamed to `flexoki`. Renaming it would invalidate
every reader's saved `localStorage('palette')` for no visible gain — `read()` validates against
the option list and would silently drop them back to Default.

### Archives: the date column now sizes itself in `ch` (2026-07-27)
Brajeshwar: *"the 'MMM DD' are now too narrow and squashed. It should always be in a single
line… can we make it always fit whatever the font-size."*

His diagnosis was right — the base font-size went up and the column did not. `width: 5rem`
uses the ROOT font size, and the reader's Text Size axis never touches the root; it scales
`--step-*`. Measured against the old 60px content box: XS had 8.8px spare, M was already at
−0.2px, XL was 9.2px over. So it had been failing at the default size too, not just XL.

⚠️ **The obvious fixes are dead ends here, because `base.css` sets `table-layout: fixed`.**
Under fixed layout the specified width is used literally and the cell's content is never
consulted:
- `width: auto` → the table just split 50/50 and gave the date **510px**.
- `width: 1%` + `nowrap` (the standard shrink-to-fit idiom) → **10px**, with the date
  overflowing straight across the titles. I shipped this one to the browser before catching it;
  `nowrap` means a cell can overflow without ever wrapping, so "did it wrap" is the **wrong
  test** — check `content box − text width`, not `getClientRects().length`.

Fixed layout means an explicit number, so the only question was the unit. `ch` resolves
against the element's own font, which is `smaller` of whatever the reader picked, so the
column tracks the text automatically — and the cell is monospaced, so 1ch is exactly one
character. "MMM DD" is 6; `calc(6.5ch + 2 * var(--space-2xs))` (the padding added back because
`box-sizing: border-box` is global), the half-character being slack against sub-pixel rounding.

Verified across all 1,456 rows × 5 text sizes × 3 font choices: zero overflowing, zero
wrapped, 4.3–5.8px of slack throughout, cell width tracking 75.4px (XS) → 95px (XL). Bare 6ch
measured slack 0.00 at every step, which is correct but too tight to ship.

### Archives: the century stops hiding and starts being two digits (2026-07-27)
Brajeshwar: *"move the '20' just a tiny bit to the left to add at-least 1px of space with the
year container."*

**A translate could not do it, and measuring showed why.** The mark rendered the whole "2026"
centered on the tray's left edge, so the visible "20" and the hidden "26" were one string:
sliding it left to open a gap beside the "0" dragged the "2" of "26" out into the margin with
it. At 36px with -0.02em tracking the "0" ink ended at 242.14 and the next digit's ink
began at 242.49 — 0.35px apart — with the tray edge at 244. So 1.51px of that third
digit was already showing, and *that* was what read as the "20" touching the tray; the "0"
was never clipped. 0.35px was the most daylight any cut line could yield.

Fix: emit only the two digits that were ever visible (`{{ years[0].name | slice: 0, 2 }}`)
and position by the right edge — `right: 100%; margin-right: 2px` — instead of centering a
four-digit string. Nothing visible was lost, because nothing of the "26" was ever on screen.
The gap is now just a margin: 2px of box renders as 2.87px of visible daylight (the italic
"0" carries a little right side bearing of its own). Verified at rest, stuck at `top: 0`, and
in dark mode; the mark still fits inside the tray vertically (83.9–119.9 within 81–122.7) and
still needs the same ~44px of margin, so the 1250px cut-off is unchanged.

Lesson worth keeping: a mask is not spacing. Hiding half a string with an opaque box looks
identical to drawing half a string right up until you need to move one of them.

The original construction, for the record:

- **Center on the tray's left edge.** `left: 0; transform: translate(-50%, -50%)` puts exactly
  two digits outside and two under. The halving is exact *because the face is monospaced with
  tabular figures* — measured 47px visible / 47px hidden. *(Superseded above.)*
- **It must be a SIBLING of the nav, not a child or a pseudo-element.** Inside a stacking
  context a negative-`z-index` child still paints above its parent's background, so it could
  never be hidden by the very tray it sits behind. Hence the new `.archive-strip` wrapper:
  century `z-index: 0`, nav `z-index: 1` with its opaque background doing the masking.
- **The wrapper took over the sticky** (was on the nav), so the mark and the tray travel
  together. Verified their centers stay within 2px when stuck.
- ⚠️ **Capped to the tray's height.** At 3.25rem it was 52px against a 42px tray and overhung
  ~5px, invisible at rest but clipped by the viewport edge the moment the strip stuck at
  `top: 0`. Now max 2.5rem/40px inside 42px, verified unclipped when stuck.
- Hidden below 1250px, where the margin can no longer hold the mark. Derived from
  `years[0].name`, not a hardcoded string, so it follows the archive into 2100. `aria-hidden` —
  it is a typographic device, and each link already carries the full year in `aria-label`.

### Logo optical nudge + archives tightened to the new width (2026-07-27)
- **Logo: align the GLYPH, not the box.** It had been pulled out by a whole `--logo-size`
  (40px), which put the beta ~29px into the margin and read as detached. Measured the path's
  bbox in `brajeshwar-logo.svg`: `x = 49.6` of a 200 viewBox, so the glyph's painted left edge
  sits 24.8% in — about 11px at 40px once `--logo-inset` is added. The pull is now
  exactly that emptiness (`--logo-optical-inset: 0.248`, applied in `chrome.css`), so the
  glyph lands on the band edge while the box overhangs by 11px. Verified: glyph left 244 =
  band left 244. Small enough to read as flush, which was the ask. No media query needed —
  11px always fits inside the margin `--body-width: 96%` leaves.
- **Archives strip back to ONE row.** Tracks `2.5rem → 2rem`, font `--step--1 → --step--2`,
  tray padding `--space-2xs → --space-3xs`. At the 64rem band that is 26 × 32 + 25 gaps = 957px
  inside ~1002px of content, so it fits on one line again — at 2.5rem it needed 1165px and had
  wrapped to two. Strip height 98px → 42px. Links render ~34 × 31px, still over the WCAG
  24 × 24 target.
- **Hover background verified inside the tray**: first link's left edge and last link's right
  edge sit exactly on the tray's content box, so the highlight never bleeds onto the border.

⚠️ **`scroll-margin-top` needed retuning for the FOURTH time.** Re-measured row counts at the
new sizing: band 983–1024 → 1 row / 42px · 500–900 → 2 rows / 77px · 346–400 → 3 rows / 113px ·
307 → 4 rows / 149px. Now 4.5rem base (unstuck), **5.5rem from 768px** (clears 77), **3.5rem
from 1024px** (clears 42) — both verified clearing by 14px and 11px. The strip's height is
content-derived and not readable from a token, so **this must be measured in a browser after
any change to its padding, font size, track width, or the site width.** That warning is now in
the CSS itself.

### Narrower: 64rem, and the column goes asymmetric (2026-07-27)
Brajeshwar, on seeing 81rem/1296px live: *"this is too wide, what is the next logical narrower
body width. Think readable length of the articles + the sidenote + the padding and margin
spaces."*

**The answer required un-centering the column.** A centered article reserves the gutter on BOTH
sides and only uses the right one, so 1289px was the hard floor — 1296 could not be narrowed
without starving the notes. Paying for the gutter once gives:

    --measure 665 + --sidenote-gap 56 + --sidenote-width 256 = 977
    + 47px breathing room = 1024px = 64rem

- **`--body-width-max: 64rem`.** `.container-ideal` is now `margin-inline: 0 auto` — the column
  sits at the LEFT of the band, gutter to the right. Prose's left edge is the band edge, which
  is the line the header and footer rules already draw.
- **Sidenote floor 1210px → ~980px viewport**, measured by shrinking the band until notes fold
  (they survive to a 940px band). The long-standing asymmetric todo is done, and it is what
  bought the narrower site.
- **Header: back to `space-between`.** Centered read adrift on small screens and, with the new
  border-bottom, a centered cluster floating over a full-width rule looks unanchored.
- **Logo 34px → 40px, and optically pulled out.** Above 1150px it gets
  `margin-left: calc(-1 * var(--logo-size))` so its RIGHT edge lands on the band edge — the
  slanted beta reads as pushed inwards otherwise. Below that it sits in flow; no clipping.
  Verified one row and fitting at 1512/1200/1150/1100/768/430/390/360/320.

⚠️ **Three things this broke, all found by measuring:**
1. **The `/ 2` in `.sidenote`'s width** assumed a centered column splitting the leftover between
   two margins. Left in, it would have halved every note.
2. **`gutterFits()` measured `window.innerWidth`.** Correct only while the gutter was viewport
   margin; now measures the band.
3. **Archives' `scroll-margin-top` override at `min-width: 1250px`** put captions 26px UNDER
   the strip. One row needs ~1200px of content and the band now caps at 1024 — the strip can
   **never** be one row again, so the override was dead and wrong. Removed. *Third time this
   exact bug class has appeared; the strip's height is variable and the clearance must track it.*

⚠️ **Local `_site` goes stale.** `jekyll build` does not delete output whose source stopped
qualifying, so `/2100/` pages and a 1,464 post count persisted from earlier builds and were
briefly measured as real. `jekyll clean` restored 1,456 and 26 archive years. **CI is safe** —
Actions builds from a fresh checkout. Run `make clean` before trusting local counts.

### ONE width, finished — posts and pages too (2026-07-27)
The earlier pass standardised the *chrome* band; posts and 22 pages still put `.container-ideal`
on `main` itself, so their content band was 665px while listing pages were 1296px — two visibly
different site widths depending on where you landed. Brajeshwar: *"One Standard Website width."*

- **`main` is now the standard width on every page type** — post, page, archives, album, home.
  Verified `main`, the header rule and the footer rule share edges on all of them.
- **The measure moved onto the `<article>`**, centered. Prose still wraps at ~66 characters; only
  its container changed. Deliberately not left-aligned — text on 1,456 posts stays exactly
  where it was.
- **`full: true`** (a `page.html` capability that had no users) now means *"fill the standard
  width"*, and `/about/`'s timeline uses it. It no longer means full-bleed, because `main` is
  capped at `--body-width-max`.
- Timeline entry prose is capped at `--measure` too — the structure wants the width, the
  sentences don't.

⚠️ **Two things this broke, both caught by measuring, both of the same class:**
1. **`sidenotes.js` queried `.container-ideal article`.** Moving the class onto the article made
   that match nothing — sidenotes would have silently vanished from every footnoted post. Now
   `article.container-ideal`. Verified 3 notes still render, inside the band, footnotes hidden.
2. **`.post { margin: var(--space-s) 0 }` silently canceled `margin-inline: auto`.** The
   shorthand's `0` beat `.container-ideal` because `post.css` loads after `base.css` at equal
   specificity — **source order again**, the same trap as the header `@media` block. The article
   rendered flush left. Now `margin: var(--space-s) auto`. *Shorthand margin is a cascade
   hazard whenever a layout class supplies `margin-inline: auto`.*

### Earlier that day — standardize the site width (now resolved above)
Brajeshwar wants one width instead of the current two (`container-ideal` vs the full-width
`main`); the split exists because it was easier to maintain by hand, not because it was
designed. Nothing is decided or built yet.

The task, the research, and the open decisions are written up in
[`todo.md`](todo.md) → *Standardize the site width*. Two measured facts came out of it and now
live in the reference docs:

- **`1rch` = 10.08px**, so `--measure: 66rch` is a 665px column — the ~8px/ch rule of thumb
  under-estimates it by ~130px. ([`styles.md`](styles.md) §1)
- **Sidenotes need a 1210px viewport**, because the centered column spends as much on the dead
  left margin as on the working right gutter. Going asymmetric would drop that to ~970–1010px.
  ([`sidenotes.md`](sidenotes.md) → *The viewport floor*)

Both were measured in Chrome against the built site (`/2022/plain-text/`), not calculated —
the first attempt at deriving them from the CSS was wrong.

### What happened this session (2026-07-19)
A CSS consolidation pass, start to finish. Full detail in [`styles.md`](styles.md) §5 —
`styles.md` is now the primary CSS doc.

- **CSS budget reconciled** — docs carried both "~10KB" and "≤42KB". Now one figure:
  ≤ 13 KB gzipped per page, measured over the wire. Pages sit at 5.8–6.8 KB.
- **Flattened 25 numbered ITCSS partials → 12 named files.** `config` · `themes` · `base` ·
  `chrome` · `post` · `page` · `album` + per-page one-offs + `bookmarks`. **Don't reintroduce
  numeric prefixes.** Cascade order lives only in `styles.html`; `config.css` must stay first
  (it defines the `$breakpoint-*` SCSS vars, and media queries can't read custom properties).
- **New `album` layout** for galleries (film + devices). `books` is prose, not a gallery.
- **`page-full.html` merged into `page.html`** with a `full:` flag (currently no users).
- **Audited all 12 files** — fixed 2 real bugs, removed 35 dead custom properties.
  −2,012 B raw / −0.35 KB gzip on every page.
- **Dropped Geist** — near-duplicate of the system stack, 165 KB unsubsetted ttf.

### Rules learned this session — worth not re-learning
- **CSS comments are free; HTML/Liquid comments are not.** `sass: style: compressed` strips
  block comments from CSS, so prose in `_sass/*.scss` costs zero shipped bytes.
  An `<!-- HTML comment -->` in a layout does ship to all ~1,456 pages — use
  `{%- comment -%}` there. Verified both ways.
- **Custom property DECLARATIONS ship even when nothing reads them.** Comments are stripped;
  declarations are not. An earlier note in `config.css` claimed otherwise and had licensed
  ~1.6 KB of dead tokens. Don't add speculative tokens.
- **Never use a bang comment** (`slash-star-bang`) — it survives compression.
- **Never write a literal `*/` inside comment prose** — it closes the block early and the build
  fails with a misleading "expected selector" pointing at `styles.html`. Cost one build.
- **Browser caches JS hard on a plain `python3 -m http.server` / `jekyll serve`.** A JS change
  can look like it didn't take when the built file is correct. Hard-reload (cmd+shift+r) before
  concluding anything. Same trap `search.md` documents for `search.js`.
- **Verify, don't infer.** Two claims in the old docs were wrong on inspection (`/books/`
  "unstyled"; footnotes "posts-only"). Both were caught by checking the actual files.

### Verification state
Build clean. Rule-set diffs confirm only intended changes. Browser-verified at 1440px across
light/dark and default/nord/eink: homepage, `/about/`, `/film/`, `/devices/`, `/search/`, and a
post with code. Contrast measured on code blocks: light ≥ 5.68:1, dark ≥ 7.66:1, nord-dark
≥ 5.92:1, eink-light 4.49:1 (comments, a hair under AA — a property of the shared
`--color-fg-subtle` token, documented, not introduced here).

### Picking this back up
1. **Push** (or review first): `git log -p origin/main..HEAD`.
2. **Highest-value next task**, with evidence already gathered: `search.css` hand-copies ~6 KB
   of Pagefind's own stylesheet, which `_pages/search.html` already links separately. Needs
   `make serve` (Pagefind built) to byte-compare before cutting. See
   [`todo.md`](todo.md) → *From the 2026-07-19 CSS audit*, which has 7 verified-but-not-done items.
3. **Two open design calls for Brajeshwar**, not bugs to fix silently:
   - Dark-mode image dimming is dormant *and* inverted (keys off OS, not `[data-theme]`).
     Turning it on correctly changes every image on the site.
   - The design hook flags Geist as an overused font in `themes.css` — now moot, the font
     is gone, but if the warning reappears for another face the suppression command is
     `/impeccable hooks ignore-value overused-font <Face> --shared`. Only Brajeshwar runs it.

### Older state (still true)
- **The v2027 redesign is DONE, MERGED to `main`, and DEPLOYED (live at brajeshwar.com).**
  `brajeshwar.com-v2027` was fast-forward-merged into `main` (`cd3227e0 → 2826a518`, 18 commits)
  and pushed; the GitHub Actions deploy ran green (build incl. the new agent-markdown step,
  + Pagefind, + deploy-pages).
- **Working branch is now `main`.** Each **push to `main` auto-deploys** (workflow trigger).
  So: commit small, reviewable changes; pushing publishes. (Optionally branch + merge for bigger
  work.) Same guardrails apply — no content edits, no AI attribution, Brajeshwar makes/pushes
  the commits unless he asks otherwise.
- **Mode: incremental improvement.** Brajeshwar is reviewing pages/articles live and will point
  out things to refine. Open work is in [`todo.md`](todo.md).
- **Hosting decided** — keep the `brajeshwar.github.io` repo name (don't rename), use
  Cloudflare for DNS + CDN proxy. **Reversed 2026-07-26: Cloudflare Pages is no longer
  dormant** — it now builds the same repo as a backup, while brajeshwar.com stays on GitHub
  Pages. The build versions moved out of `README.md` into `hosting.md` at the same time. See
  [`hosting.md`](hosting.md).
- **Fixed 2026-07-05:** dev files (`CLAUDE.md`→`/CLAUDE/`, `Makefile`, `scripts/`) were being
  published — now in `_config.yml` `exclude`. Re-check `_site/` after editing `exclude`.

## Docs index
- [`design.md`](design.md) — design philosophy (the *why*): text-first, ornament-free, decoupled/portable styles, progressive enhancement, reader's choice.
- [`styles.md`](styles.md) — the style specifics and the CSS architecture, six sections:
  §1 typography (scales, font axis System/Sans-Serif/Serif, Kindle text-size, and the
  interface-vs-prose font rule), §2 color & theming (mode `data-theme` × palette
  `data-palette` default/nord(Cool)/eink(Warm = Flexoki), + accent, bridge, no-flash),
  §3 branding, §4 icons, §5 how CSS is split (13 named files, three tiers, which layout
  pulls which bundle, the old→new filename map, the 2026-07-19 audit + backlog),
  §6 layout patterns — the four page shapes, the right-only breakout rule, the shared
  `.pill`, and Back to Top. **Read §5 before touching `_sass/`, and §6 before changing
  anything's width.** Absorbed `css-architecture.md` on 2026-07-26.
- [`sidenotes.md`](sidenotes.md) — Tufte margin sidenotes built from kramdown footnotes (Phase 2) + Aresluna wayfinding.
- [`search.md`](search.md) — site-wide header search, lazy-loaded Pagefind.
- [`agents.md`](agents.md) — plain-text Markdown twins (`/x.md`) + `/llms.txt` for AI agents; post-build step like Pagefind.
- [`hosting.md`](hosting.md) — everything hosting: GitHub Pages + Actions (and the build
  versions, moved from `README.md`), the Cloudflare Pages backup build, DNS/CDN, and the
  domain decisions.
- [`javascript.md`](javascript.md) — the JS policy: no frameworks, one file per function,
  used sparingly, every page works without it. Minify on publish is BUILT (esbuild, in
  place, 52% gzipped); concatenation considered and deliberately not done. Inventory of all
  eight scripts.
- [`timeline.md`](timeline.md) — the `/about/` storyline: vertical timeline, CSS-only
  Life/Work filter (wearing the shared `.pill`), shareable `#work`/`#life` URLs, hand-typed
  time ranges, experimental scroll line. Authoring convention lives here — content is
  Brajeshwar's to write.
- [`todo.md`](todo.md) — running site task list.
- [`inspirations.md`](inspirations.md) — article-craft studies (Aresluna deep-dive; Yale e360, BBC, The Walrus, iDiallo).
- [`/CLAUDE.md`](../CLAUDE.md) — short guardrails for AI agents working in the repo.

---

## What this site is

A serif, reading-first site in the spirit of Tufte CSS — long-form articles with
right-margin sidenotes derived from the footnotes kramdown already emits, plus reader-set
appearance (theme mode × palette, font, accent) that persists across visits. Tight code,
content and presentation cleanly separated, zero content files touched.

There is no versioned redesign to work toward. The 2026 re-skin shipped; from here the site
just keeps evolving in small, reviewable steps. (It was called "v2027" while in flight — the
name was retired 2026-07-26 along with `_docs/v2027/`.)

- **Stack:** Jekyll + kramdown + Pagefind, deployed to GitHub Pages via GitHub Actions.
- **Branch:** `main`. Every push auto-deploys.
- Presentation lives only in layouts, includes, CSS, JS, and build config.

## Non-negotiable guardrails (full list in CLAUDE.md)
1. **Never modify content** — no edits/no added front matter under `_posts/**`, `_drafts/**`, `_pages/**` bodies. `_data/*.yaml` off-limits except `nav.yaml` (with approval). ~1,393 of ~1,463 posts have no front matter; titles come from the `# H1` via `jekyll-titles-from-headings` + `jekyll-optional-front-matter`.
2. **Preserve every URL** — permalink `/:title/`; 25 years of links (2001–2026) must not break.
3. **Stay on Jekyll + Pagefind + kramdown** — no new SSG, no Markdown-engine swap, no new plugins unless a phase calls for it, no `_plugins/` hooks.
4. **Progressive enhancement** — fully readable with JS disabled (real footnotes at article foot, sensible default theme). JS only *enhances* (sidenotes, theme persistence).
5. **Sidenotes from existing footnotes only** — CSS/JS, no new authoring syntax, no per-post markup.
6. **Vanilla JS only** — no frameworks, no JS/CSS build step beyond Jekyll's SCSSify includes.
7. **Commit authorship** — never attribute commits to Claude/Anthropic; no "Generated with Claude", co-author trailers, or AI references in messages/comments. **Brajeshwar makes the commits** — prepare and show diffs for review; commit only if he explicitly asks (still no AI attribution).
8. **Reviewable diffs** — one concern per change; don't mix a refactor with a redesign.

## Architecture to honor
- CSS = **13 plainly-named Sass partials** in **`_sass/`**, compiled by **`assets/styles/site.scss`** into ONE external stylesheet. ⚠️ **Moved out of `_includes/css/` 2026-07-27** — they were Liquid includes and nothing includes them into HTML any more. `@use`, not `@import` (Dart Sass 3.0 removes it); a module emits at FIRST load, so the order in `site.scss` is the whole cascade. **9.5 KB gzip / 50 KB raw for the whole site**, fetched once and cached. ⚠️ **Externalised 2026-07-27, reversing the inline-everything rule** — `/assets/*` is served `max-age=31536000`, so inlining re-sent ~6.6 KB gzip on every page view and could never be cached (HTML is `max-age=600`). The ≤13 KB gzip budget still holds but is now a **whole-site** number, not per-page.
- ⚠️ **Two things the one-file model makes load-bearing.** (a) **Cache-busting**: `scripts/hash-assets.mjs` renames CSS/JS to `<name>.<hash>.ext` post-build and rewrites references — a stable filename at `max-age=31536000` strands returning readers for a year. It must run *after* the esbuild minify step. (b) **Every stylesheet applies to every page** — anchor selectors to a class (`.page`, `.post`) or custom element, never a bare `main > article > h2`. `page.css` broke this rule and would have clamped all ~1,456 post titles to 665px.
- ⚠️ **Filenames changed 2026-07-19.** Flattened from 25 numbered ITCSS partials (`0.0-config.css`, `2.1-code.css`, …) to `config` / `themes` / `base` / `chrome` / `post` / `page` / `album` + per-page one-offs. **Older entries below still use the numbered names** — see the old→new map in [`styles.md`](styles.md) §5 → *Old → new filename map*. Cascade order now lives only in `styles.html`; `config.css` must stay first (it defines the `$breakpoint-*` SCSS vars).
- ~~**CSS tiering decided + implemented 2026-07-19** — stay embedded (no external stylesheet); split by **layout**, not by page: base on every page → one bundle per layout (`post`/`page`/`album`) → per-page opt-in for genuine one-offs only.~~ **Superseded 2026-07-27** — delivery is one external file for every page; the three tiers survive only as *organization* (which file to open), never as what ships where. Still shipped that day and still true: syntax highlighting fixed + tokenised onto `--code-*` (later removed entirely); new `album` layout (film + devices, **not** books — that's prose); `page-full.html` merged into `page.html`. Full rationale: [`styles.md`](styles.md) §5.
- **Layouts are now**: `default` · `post` · `page` (reading width, `full: true` for full-bleed) · `album` (galleries) · `redirect`.
- ~~Layouts pick a CSS bundle through the `styles:` front-matter key (`styles-posts.html`, `styles-pages.html`).~~ **The `styles:` key and all four `styles-*.html` shims were deleted 2026-07-27** — every stylesheet ships to every page, so there is nothing left to switch. `style:` (singular, a class on `<main>`) is unrelated and still live.
- **All themeable values are CSS custom properties; no hardcoded colors outside `0.1-color.css`.** Use semantic tokens: `--bg`, `--bg-subtle`, `--text`, `--text-muted`, `--rule`, `--accent`, `--accent-hover`, `--mark`, `--sidenote-text`, `--code-bg`.
- `container-ideal` = reading width (~60–70ch serif + right gutter for sidenotes); `page.style` = full-width page hook.
- Theme overrides via `<html data-theme="light|dark|sepia|gray">`; no attribute = Light, and `prefers-color-scheme: dark` → Dark only when reader made no explicit choice.

## Key features (as built)
- **Sidenotes** — `assets/scripts/sidenotes.js` (defer) walks `.footnotes`, builds `<aside class="sidenote">` in the right gutter aligned to each `sup#fnref:N`; strips the `↩`, keeps the number, hides the bottom block when active. Narrow → fold back to footnotes. JS off → plain footnotes. CSS in `2.1-footnotes.css`. Live-verified. See [`sidenotes.md`](sidenotes.md).
- **Reader settings** — `<reader-settings>` in the header, built by `assets/scripts/reader.js` (defer): two native `<select>`s — font (Sans default / Serif / Mono → `[data-font]` → `--font-reading`) and theme (Auto / Light / Dark / Sepia / Gray → `[data-theme]`). Persists `localStorage.font` + `localStorage.theme`. No-flash inline `<head>` snippet applies both before first paint. CSS in `0.1-color.css` + `0.0-config.css` (font tokens) + `8.1-tools-theme-toggle.css`.

## Phasing (SPEC §10)
0. **Scaffold** — branch + spec + CLAUDE.md (done); add token layer in `0.1-color.css`, no visual change yet.
1. **Design system** — typography, semantic tokens + 4 theme palettes, theme selector UI + `theme.js` + no-flash snippet.
2. **Reading layout + sidenotes** — ideal-width article, `sidenotes.js`, responsive fold-back, JS-off fallback.
3. **Templates & chrome** — centered header logo+nav w/ full-width rule, column footer, full-width vs ideal-width templates, figure/caption + gallery + caption-align utility, blockquote.
4. **Cleanup** — dead-CSS pass, AnchorJS decision, "no hardcoded color" grep, base bundle under budget.
5. **Verification** — checklist in SPEC §11.

## Open questions (defaults chosen, flag in the partial when resolved)
- Serif: self-hosted Libre Baskerville vs pure system serif stack → lean system.
- Post CSS: embed-with-base vs load separately → decide on byte budget.
- AnchorJS: drop `anchor.min.js` + `9.9-utils-anchorjs.css` for CSS-only heading anchors → lean drop.
- Year archives / home microblog / `/about` timeline → deferred / future unless prioritized.

## Status
- **Phase 0 done.** Semantic token layer introduced in `0.1-color.css` (additive, zero visual change).
- **Phase 1 done + live-verified.** See [`styles.md`](styles.md).
  - `0.1-color.css` restructured: `.theme-*` classes → `[data-theme]` attributes; four palettes (light/dark/sepia/gray); auto-dark via `:root:not([data-theme])`; semantic aliases declared once.
  - **Reading surface defaults to SANS** with a reader font selector (Sans/Serif/Mono via `--font-reading` + `[data-font]`). Brajeshwar's call: sans default, font is a reader choice (Kindle/Reader-style). Supersedes the earlier serif-default draft (and the `cd3227e0` sans commit) — both reconciled.
  - **Reader settings control** — `reader.js` builds `<reader-settings>` (font + theme selects); old inline `ThemeToggle` removed from `header.html`; `theme.js` renamed → `reader.js`. No-flash `<head>` snippet applies theme+font before paint. Theme selector = Auto + 4 themes (Auto approved).
  - `8.1-tools-theme-toggle.css` restyled (`.reader-select`, semantic tokens).
- **Phase 2 done + live-verified.** Tufte sidenotes. See [`sidenotes.md`](sidenotes.md). `sidenotes.js` + `2.1-footnotes.css` + sidenote tokens in `0.0-config.css`.
  - **Browser-verified at 1440px**: footnotes → clean margin sidenotes aligned to refs (after resetting the inherited generic `aside{}` box); at 760px → fold back to foot footnotes with `↩`; sepia+serif persisted across reload with no flash; selects reflect stored state.
- **Phase 3 done + live-verified.** Templates & chrome.
  - **Header** — already centered logo+nav with full-width rule; removed the dead `mode-toggle` CSS (now `reader-settings`).
  - **Footer** — restructured `_data/nav.yaml` `footer` from a flat list into **4 categorised groups** (Browse / Reading / About / Connect — all 13 original links preserved); `footer.html` renders columns; `3.1-footer.css` is a responsive `auto-fit` grid + centered colophon. ⚠️ The grouping is my IA guess — easy to re-bucket; iterate freely.
  - **Blockquote** — Yale e360 style: quiet left rule, italic, muted; font-family follows the global `--font-body` (the reader's font choice), not a fixed serif (`1.2-typography.css`).
  - **Figures** — captions muted/restrained + caption-alignment utilities (`figcaption.center/.right`, default left) in `2.1-images.css`. Gallery already existed.
  - Browser-verified: footer columns on home + posts, header, sidenotes still work post-refactor.
- **Phase 4 done.** Cleanup.
  - **AnchorJS dropped** — removed vendored `assets/scripts/anchor.min.js`; new vanilla `assets/scripts/anchors.js` (defer, in `post.html`) injects `§` heading links; `9.9-utils-anchorjs.css` repurposed to `.headerlink` styles (reveal on hover, hidden on small screens). Browser-verified (§ appears on h2 hover).
  - **Dead CSS** — removed `_includes/css/4.1-search.css` (Google CSE `.gsc-*`, unreferenced since the Pagefind move).
  - **Hardcoded colors** — clean outside the known exceptions: `2.1-code.css` (pygments) and `4.1-search-pagefind.css` (Pagefind UI vars — left as-is per SPEC §9). No stray colors elsewhere. **Update 2026-07-19: `2.1-code.css` is now tokenised onto `--code-*`, so `4.1-search-pagefind.css` is the only remaining exception.**
  - **CSS budget** — history: original note ~10KB → raised to ≤42KB → tightened to ≤13KB gzipped per page (2026-07-19, current rule). The budget is measured gzipped over the wire, not raw. Measured 2026-07-19 from `_site`: books 6.1KB, archives 6.3KB, article 6.6KB, home 6.8KB, search 7.2KB gzip (27.3–34.4KB raw). All pass with ~5.8KB headroom.
- **Phase 5 (verification) — passing.** Builds clean; only layouts/includes/css/js/`nav.yaml` touched (no post/draft/page-body content); permalinks unchanged; 4 themes + font selector persist with no flash; sidenotes work + fold back; JS-off → real footnotes + default theme; CSS under budget; no AI-attributed commits (nothing committed — staged for review).
  - Files touched (Phases 0–4): `_data/nav.yaml`; `_includes/css/{0.0-config,0.1-color,1.2-typography,2.1-footnotes,2.1-images,3.1-header,3.1-footer,8.1-tools-theme-toggle,9.9-utils-anchorjs}.css`; deleted `4.1-search.css`; `_includes/{header,footer}.html`; `_layouts/{default,post}.html`; `assets/scripts/{reader,sidenotes,anchors}.js` (new); deleted `assets/scripts/anchor.min.js` + old `theme.js`.
- **Header search added + live-verified.** Site-wide search via lazy-loaded Pagefind (Option 1 — zero page-load cost). See [`search.md`](search.md). `<site-search>` trigger in `header.html` (links to `/search/` as JS-off fallback) + `assets/scripts/search.js` (defer, opens an inline themed panel, lazy-loads `pagefind-ui.*` on first click) + `_includes/css/8.2-tools-search.css` (in base bundle). Browser-verified: page load injects no Pagefind; click → panel + lazy-load; "cherrapunji" → 1 highlighted result.
  - ⚠️ **Cache gotcha (testing only):** `jekyll serve` wipes `_site/pagefind/` on regeneration and caches `search.js` hard — test with `--skip-initial-build --no-watch` after `npx pagefind --site _site`, and hard-reload. The `DOMContentLoaded` ready-guard in search.js is required (don't remove).
  - **Reworked into a ⌘K command palette (live-verified on a plain serve).** Now opens a centered in-place popup via the trigger or ⌘K / Ctrl+K; Esc/backdrop close; never navigates while JS is on (removed the auto-redirect — shows an in-panel "open the search page" message if Pagefind can't load). ⌘K hint badge in the header (platform-aware). Root cause of "search just goes to /search/": all `assets/scripts/*.js` were loaded via `prepend: site.url` → `https://brajeshwar.com/...`, which 404s under local `jekyll serve` so no JS attached. Fixed to `relative_url` (root-relative) in `default.html` + `post.html`. `/search/` page unchanged (auto-focused input, JS-off fallback).
  - **Switched to Pagefind's Modular UI (live-verified).** We're on Pagefind 1.5.2 (current — not a version bump). Default UI → Modular UI (`pagefind-modular-ui.js`): our ⌘K shell builds `PagefindModularUI.Instance` + `Input`+`Summary`+`ResultList` (`showImages:false`) into 3 mounts in the panel; same `--pagefind-ui-*` theming on `.site-search__panel`. Eager search payload ~32KB → ~5KB gz. Considered the Component UI (`<pagefind-modal>`, ~40KB, heavier/harder to theme) and rejected it. Verified: "monaco" → 2 themed text-only results.
  - **`data-pagefind-ignore` on `<header>` + `<footer>`** so repeating chrome (nav, the ⌘K hint badge, footer columns) isn't indexed — without it the header's ⌘K led every result excerpt. Verified: "bombay flood" → clean content excerpts.
- **Theming reworked → Ovellum parity (live-verified).** Replaced the single-axis `[data-theme]` light/dark/sepia/gray with Ovellum's (ovellum.oss.oinam.com) two independent axes: mode (`data-theme`: auto/light/dark) × palette (`data-palette`: default/eink/flexoki/nord/solarized). Plus font axis (`data-font`: sans/serif/inter/geist) with self-hosted Inter + Geist variable fonts (`assets/fonts/`, `0.0-fonts.css`, `font-display:swap` so they load only when chosen). See [`styles.md`](styles.md).
  - `0.1-color.css` fully rewritten: raw `--color-gray-*` scale (palettes re-tint) → semantic `--color-*` (mode flips light↔dark) → bridge aliasing all legacy `--bg-color-*`/`--text-color-*`/`--border-color-*` + v2027 `--bg/--text/--rule/--accent` onto the semantic layer, so every component themes with zero edits. `color-mix()` for borders.
  - `--font-body` (default `--font-sans`) drives `body`; legacy `--font-family-*` aliased.
  - Controls: `<appearance-settings>` panel (`appearance.js`, replaces `reader.js`) — Mode/Palette/Font button groups; no-flash snippet applies all 3 axes before paint; `localStorage` keys `theme`/`palette`/`font`. CSS in `8.1-tools-theme-toggle.css`.
  - **Browser-verified**: default light/neutral/sans; Nord+Dark+Geist → Nord-dark slate bg, Geist font; persisted across reload with no flash. Builds clean; inlined CSS ~29KB raw (budget is now ≤13KB gzip — see the CSS budget note above).
  - **Accent axis wired (live-verified).** Appearance panel has an Accent group: 6 swatches (Blue/Purple/Green/Amber/Red/Cyan, Ovellum's oklch values) + Default + custom `<input type=color>`. Sets inline `--ov-accent` + `data-accent=custom`, persisted to `localStorage('accent')`, applied by the no-flash snippet. The ported `[data-accent]³` rule maps it onto `--color-accent` + `--color-primary` (links, nav pill, logo recolour). Verified: Blue accent → blue links/nav/logo, persists across reload.
  - **Still deferred:** `data-text-size` (conflicts with the site's Utopia `--step-*` scale — would need a base-size multiplier).
- **Carry-over / iterate-later:**
  - Footer grouping is a guess — re-bucket as you like.
  - Sidenote hover/focus highlight; tune `--sidenote-width`/breakpoint on long or clustered notes.
  - Migrate components off legacy color tokens (`--bg-color-*` etc.) onto the semantic ones (`--bg`, `--text`, …) — a tidy-up, not required for function.
  - Optional further CSS trimming by moving content-only partials out of the always-inlined base — not needed given the current headroom under the 13KB gzip budget.
- **Local dev loop (`Makefile`).** `jekyll serve` does NOT build the Pagefind index (only CI does) → ⌘K shows "Search isn't available right now" locally. Use `make serve` (build + `npx pagefind --site _site` + `jekyll serve --skip-initial-build --no-watch`) for working local search; `make dev` for fast live-reload without search; `make build` / `make pagefind` / `make clean`. See [`search.md`](search.md).
- **Appearance panel reworked (Brajeshwar; browser-verified).** `appearance.js` axes:
  - **Font** → 3 choices: Default = `sans` (system, no webfont, fast), Sans-Serif = `geist`, Serif = `serif` (Libre Baskerville). Inter removed (option, `@font-face`, and `assets/fonts/inter/` deleted). **Superseded 2026-07-19: Geist removed too — the axis is now TWO choices, Default (system) + Serif (Libre Baskerville).** Geist was a neo-grotesque sitting very close to the system stack it was an alternative to, and shipped as a 165 KB unsubsetted `.ttf` (the site's heaviest asset). Libre Baskerville is now the only webfont. Stale `localStorage` values need no migration — `appearance.js` validates against its option list and the no-flash snippet whitelists `'serif'`. See [`styles.md`](styles.md).
  - **Palette** → 3: Default, Cool = `nord`, Warm = `eink` (sepia). Flexoki + Solarized removed (light re-tints + dark accent blocks in `0.1-color.css`).
  - **Text Size** → NEW axis `[data-text-size]` (`xs`/`s`/m default/`l`/`xl`), five growing "A" buttons (Kindle-style). Scales the reading column only via `--text-scale` (`0.0-config.css` → `.container-ideal article` body/headings/blockquote in `1.1-base.css`); interface unaffected. Persisted `localStorage('textsize')`; no-flash snippet applies it (`data-text-size`, camelCase `dataset.textSize`).
  - Panel compacted (`8.1-tools-theme-toggle.css`: tighter padding/gaps, ~15.5rem wide, smaller swatches).
  - **Accent trimmed** (follow-up) to Default + Blue + Amber (a cool + a warm swatch complementing Cool/Warm palettes); custom color picker removed (+ its dead CSS). `appearance.js` `ACCENTS`.
  - Verified: 5 groups render; text size 20px→23.8px(xl)/17.6px(xs), headings scale, nav unaffected; Cool=blue-slate, Warm=warm paper; all persist. Files: `appearance.js`, `0.0-config.css`, `0.0-fonts.css`, `0.1-color.css`, `1.1-base.css`, `8.1-tools-theme-toggle.css`, `default.html` (no-flash). See [`styles.md`](styles.md) §1–2.
- **Font/text-size scope widened + panel redesigned (Brajeshwar; browser-verified).**
  - **Font choice now applies to ALL content** (home body, pages, articles), not just articles: `body { font-family: var(--font-body) }`; only `header, footer` pinned to `var(--font-sans)` (`1.1-base.css`). Sidenotes/post-meta still re-assert sans. Verified: home intro + h1 → Libre Baskerville on Serif; nav/footer stay sans.
  - **Text size now scales ALL content**, not just the reading column. Mechanism: raw clamps renamed `--step-N-base`; `:root` aliases `--step-N: var(--step-N-base)`; `main` redefines `--step-N: calc(base * --text-scale)` (`0.0-config.css`). Content (inside `<main>`) scales; header/footer (outside `main`) don't. Removed the old per-element `.container-ideal article` calc rules. Verified: home intro 31→37px at xl, nav stays 16px.
  - **Accent → 5 swatches** (Default + Blue/Green/Amber/Red), rendered inline with the "Accent" label (`.appearance-group--inline`).
  - **Buttons redesigned → segmented pills**: `.appearance-options` is one rounded (999px) pill with `overflow:hidden`; options are flat cells with hairline `border-inline-end` dividers; single line (`flex-wrap:nowrap`), compact (reduced padding, `--step--2` font). Font (Default/Sans-Serif/Serif) + Text Size (5 A's) both fit one line. `8.1-tools-theme-toggle.css`.
- **[superseded] Interface = sans, content = reader's font (Brajeshwar; browser-verified).** The reader's font choice now applies to article prose + its headings only (`.container-ideal article { font-family: var(--font-body) }`); `body` is pinned to `var(--font-sans)`, so header / footer / home / nav / post-meta / sidenotes stay system sans even in Serif/Inter/Geist mode. Blockquotes inherit context. Verified at data-font=serif: nav/footer/copyright/sidenote/meta = ui-sans-serif, article p/headings = Libre Baskerville. `1.1-base.css` + `1.2-typography.css` (blockquote). See [`styles.md`](styles.md) §1.
- **Higher contrast (Brajeshwar; browser-verified).** Text tiers pushed one step toward the extreme in both modes (backgrounds unchanged): light `--color-fg` gray-900→950, `-muted` 700→800, `-subtle` 500→600; dark `--color-fg` 100→50, `-muted` 300→200, `-subtle` 500→400 (edited both the `[data-theme=dark]` block and the `prefers-color-scheme` auto block). All palettes inherit it via the token layer. `0.1-color.css`. See [`styles.md`](styles.md) §2.
- **Agent Markdown twins + `/llms.txt` (this session; build-verified, served locally).** Every post/page gets a plain-text `.md` twin (`/about.md`, `/2026/childhood-computing.md`) for AI agents, plus a `/llms.txt` index. Post-build like Pagefind, no plugin, zero content touched. Pieces: `agents-manifest.json` (Jekyll template → url↔source-path manifest, `sitemap:false`, deleted after use) → `scripts/build-agent-markdown.mjs` (reads source md, strips front matter, prepends `# title` + `> Markdown version of <url>` (date on posts only — pages default to build-time), writes `_site/<slug>.md` + `_site/llms.txt`). Head `<link rel="alternate" type="text/markdown">` in `default.html` (gated on `page.collection`). Wired into `.github/workflows/jekyll-build-deploy.yml` (after jekyll build, before pagefind) and `make build`. Extension is `.md` (Brajeshwar's call). Local run wrote 1478 twins (23 pages, 1455 posts); `.md`→`text/markdown`, `llms.txt`→`text/plain`. See [`agents.md`](agents.md). **Uncommitted.**
- **Docs reorg (this session).** `_docs` filenames lowercased; `COLOR.md`+`TYPOGRAPHY.md` folded into [`styles.md`](styles.md) (type → color → branding); new [`design.md`](design.md) (philosophy) and [`todo.md`](todo.md) (site task list, from the `tmp/` braindump); article-craft studies (Yale e360, BBC, The Walrus, iDiallo) added to [`inspirations.md`](inspirations.md). Empty root `TODO.md` stub removed (consolidated into `todo.md`).
- **Design decisions locked + built (this session; build-verified, measure browser-checked):**
  - **Reading measure = character-based** — `--measure: 66ch` (~60–70 chars/line) → `--body-width-ideal`; was `46rem`≈80ch. Video embeds → `aspect-ratio: 16/9` (width-derived height no longer valid). Browser-checked at 1512px: column ~665px ≈ 66ch. See [`styles.md`](styles.md) §1.
  - **Default theme = monotone grayscale** (already true; now explicitly locked with a header comment in `0.1-color.css`). Zero-chroma scale + gray accent → links carry no hue; affordance is the underline. Color is opt-in (tinted palette or accent axis). See [`styles.md`](styles.md) §2.
  - **Page-load budget < 100 KB** for non-article pages (hard target, documented). Homepage today ~48 KB raw / ~13 KB gzip (31 KB inlined CSS + ~20 KB first-party JS, zero images), comfortably under. See [`design.md`](design.md) → *Performance budget*.
  - **Icons → Lucide** (MIT) recommended, inline SVG / currentColor / zero-fetch, home `_includes/icons/`. Not yet adopted in markup — a [`todo.md`](todo.md) follow-up. Header search icon is already this style. See [`styles.md`](styles.md) §4.
  - **`.gitignore`** properly filled: `tmp/`, `node_modules/`, `vendor/`, `.vscode/`, `.idea/`, `.pagefind-cache/` (keep committing `package.json`/lockfile). Supersedes the old stale "pre-existing tmp/ line" note.
  - Follow-ups queued in [`todo.md`](todo.md): adopt Lucide, Geist `.ttf`→`.woff2`, scope `sidenotes.js` to article pages.
- **Typography refinements (committed `0b0b5d09`):** reader Serif = self-hosted Libre Baskerville (`[data-font="serif"]`, loads only when chosen); sidenotes bumped one step to `--step--1`; blockquotes use `--font-body` (follow the reader's font, not a fixed serif). See [`styles.md`](styles.md) §1 + [`sidenotes.md`](sidenotes.md).
- **Footer simplified (this session; browser-verified desktop + mobile):** three centered rows — (1) page links, (2) social icons, (3) copyright line last (`© 2001–<year> Brajeshwar Oinam · N posts`, year via JS). Icons live in `_includes/icons/*.svg` — brand glyphs from Simple Icons (CC0), `memos` hand-authored filled; footer template pulls them via a data-driven `{% include {{ var }} %}` (works). Files: `footer.html`, `3.1-footer.css`, `_data/nav.yaml`, `_includes/icons/`.
  - **Refinements (Brajeshwar):** page links are now grouped with a subtle bullet between groups (`.footer-links__sep`), order `Home • About Archives Books Now Photos Film Ideas • Hire Legal Newsletter Search Contact` — `_data/nav.yaml` `footer` is a list of `{links:[…]}` groups. Outer `footer` spans the full viewport (border-top edge-to-edge); a `.footer-inner` wrapper holds the content at `--body-width` / `--body-width-max`. Social: Oinam removed (`oinam.svg` deleted), Memos → `https://bits.oinam.com/`. Instagram = `instagram.com/oinam`.
  - **`/photos/` created** as a coming-soon page: `_pages/photos.md` (`layout: page`, `title: Photos`, an HTML `<h1>` — a markdown `#` heading gets stripped by `titles_from_headings: strip_title` in `_config.yml`, so pages use HTML headings; cf. `hire.html`). Body is just "Coming Soon."
- **Header redesigned (this session; browser-verified desktop + narrow):** logo left (→ `/`); on the right, nav (About · Archives · Now · Contact) then tool icons — Search (⌘K palette; visible `⌘K` badge removed, shortcut still fires via `search.js` global keydown), RSS (`/feed.xml`), theme changer far right. Removed the `border-bottom` rule; separated from body by `margin-bottom: var(--space-l)`. Nav is now flat text (dropped the pill). Header constrained to `--body-width-max`, `justify-content: space-between`. Stacks + centers ≤600px (no hamburger). Added `Now` to `_data/nav.yaml` `main`. Removed dead `.site-search__hint` CSS. Files: `header.html`, `3.1-header.css`, `8.2-tools-search.css`, `_data/nav.yaml`.
  - **Header icons now match the footer** (Brajeshwar's follow-up): all filled, 20px, `currentColor`, pulled from `_includes/icons/` — RSS is the exact same file as the footer (`icons/rss.svg`, Simple Icons); search is a hand-authored filled magnifier (the old stroke one read too thin); theme is a hand-authored filled contrast circle (the old circle-with-dots looked bad). New files: `icons/search.svg`, `icons/theme.svg`.
  - Supersedes the Phase-3 "centered logo+nav + full-width rule" note above and spec §4.3. **Uncommitted — staged for review.**
- **Sidenote/layout iteration (this session; headless-Chrome-verified at 1512/1280px).**
  Sidenotes were colliding with the negative-margin breakout designs (`.large`/`.full`
  images, `.gallery`, `aside.right` all poke into the same right viewport margin the notes
  hang in). Tried a left-aligned article layout (column flush left in a homepage-width
  container, notes in the structural right gutter) — Brajeshwar rejected it ("too lefty");
  the article column stays viewport-centered, all left-alignment CSS reverted (no
  `.container-article`; breakouts keep their original viewport-centered rules). What the
  exercise produced and kept:
  - **Measure fixed: `--measure: 66ch → 66rch`** (surfaced when the article briefly carried
    its own cap and `66ch` inflated ~665→822px — Brajeshwar: "too wide"). `ch` resolves
    against each element's own font-size; `rch` resolves at the root (16px), so every use of
    the token (`.container-ideal`, `figcaption`, `photo-cover__desc`) is the same ~665px
    column, stable across reader font choices. Needs ~2023+ browsers (Safari 16.4 / Chrome
    111 / Firefox 128). See [`styles.md`](styles.md) §Reading measure.
  - **`sidenotes.js` dodges wide media**: `collectObstacles()` records the vertical ranges of
    `.full`/`.large`/`.gallery`/`aside.right` elements that cross past the column's right
    edge; a note whose slot intersects one is pushed below it (verified: notes clear the
    full-bleed floppy + `.large` flower on `/2025/fixing-a-dos-computer-for-the-army-1993/`).
    This was the actual fix for "sidenotes break article designs".
  - **Sidenote fit**: `--sidenote-gap` 2.5→3.5rem; `.sidenote` width now fluid —
    `min(16rem, (100vw − column)/2 − gap − 1rem)` (`2.1-footnotes.css`) so notes shrink to
    the available margin instead of overflowing the viewport (they previously overflowed at
    ~1120–1300px widths); `--sidenote-min-gutter` 14→17rem + `MIN_GUTTER_REM` synced, so
    notes only appear (from ~1210px viewports) when a ≥12rem note genuinely fits.
  - Net files: `0.0-config.css`, `2.1-footnotes.css`, `sidenotes.js` (+ docs `styles.md`,
    `sidenotes.md`). **Uncommitted — staged for review.**
