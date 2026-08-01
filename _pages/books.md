---
layout: page
title: Books
---

# Books

<div class="album" markdown="0">
{%- comment -%}
  Grids added 2026-08-01. The page's prose was removed the same day and lives
  verbatim in `_backup/books-BCK.md` — "The prose from books will go. Remove
  from there and keep a backup books-BCK.md for me to decide what to do with it
  later." Nothing was reworded; it is the whole block including its two
  footnote definitions.

  `<div class="album">` rather than `layout: album`. This mattered more when the
  prose was here — the album LAYOUT drops the reading measure for the whole page
  — and is kept because the CLASS is all the grids need: album.scss targets
  `.album .item__cards`, a descendant selector, so the cards get their sizing
  and figure resets without the layout deciding anything about the page.
  `markdown="0"` stops kramdown looking for Markdown inside, which it would
  otherwise do to the Liquid.

  ⚠️ Removing the prose removed the FOOTNOTES, and page.html keys
  `container-ideal` off `content contains 'class="footnotes"'` — so this page no
  longer gets that class and `.page` is now the full band rather than the
  665px measure. The grids are unaffected either way because
  `.page > .album` takes 100cqi, which is the band in both cases. If the prose
  comes back, so does the measure, and so do the sidenotes it was there for.
{%- endcomment -%}
{%- comment -%}
  Two grids, ONE source, no overlap (2026-08-01: "I do not want to repeat the
  Favorites in the All books section").

  `highlight: true` splits _data/books.yaml in two. `where_exp` rather than a
  second data file, because two files would mean two places a book can live and
  a way for it to end up in both or neither — the flag is the single fact and
  the grids are two views of it. Promoting a book to a favorite is one word in
  one place.

  ⚠️ `b.highlight != true`, not `b.highlight == false`. The key is OPTIONAL, so
  most entries have no `highlight` at all — comparing to false would match only
  the ones explicitly written `highlight: false` and drop every book that simply
  omits it, which is nearly all of them.
{%- endcomment -%}

{% assign favorites = site.data.books | where: "highlight", true %}
{% assign rest = site.data.books | where_exp: "b", "b.highlight != true" %}

{% include card-grid.html
   items   = favorites
   dir     = "books"
   ratio   = "3x4"
   captions = true
   heading = "Personal Favorites &amp; Recommendations"
   id      = "favorites"
   sub     = "Here are some of my all-time favorite books I have read and re-read and would highly recommend." %}

{%- comment -%}
  ⚠️ CAPTURED, not written inline as an include parameter. The inline version
  took the build down with "Invalid syntax for include tag": a Liquid string
  literal is delimited by the quote it opens with, so the first `href="` inside
  a double-quoted `sub = "…"` ENDS the string and everything after it is parsed
  as more parameters. Wrapping the outside in single quotes would also work, but
  a capture beats remembering which quote is safe — the block below can hold any
  markup, over as many lines as it likes, with nothing to escape.

  ⚠️ AND THE LINKS MUST BE HTML, NOT MARKDOWN. Two reasons stack. The include
  emits this into `<p class="…">{{ include.sub }}</p>`, a block-level HTML
  element, and kramdown does not process Markdown inside one; and the whole
  block sits in `<div class="album" markdown="0">`, which switches Markdown off
  explicitly. Tested 2026-08-01 by swapping in `[2018](/2018/books/)` and
  building: it rendered as those literal characters, not a link.

  The years are generated from the posts that actually exist rather than typed
  out, so January needs no edit and a link can never point at a year that was
  never written. Matching `/books/` with both slashes is deliberate: a post at
  /2024/best-books/ contains "books/" but not "/books/", so it cannot sneak in.
{%- endcomment -%}

{%- assign yearly = site.posts | where_exp: "p", "p.url contains '/books/'" | sort: "date" -%}

{%- capture books_sub -%}
Since 2018, I have started listing the interesting ones I read each year:
{% for p in yearly %}<a href="{{ p.url | relative_url }}">{{ p.date | date: '%Y' }}</a>{% unless forloop.last %}, {% endunless %}{% endfor %}.
{%- endcapture -%}

{% include card-grid.html
   items   = rest
   dir     = "books"
   ratio   = "3x4"
   captions = true
   heading = "Books"
   id      = "more"
   sub     = books_sub %}
</div>
