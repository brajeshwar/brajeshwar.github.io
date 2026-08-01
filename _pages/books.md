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
  the grids are two views of it. Promoting a book to a favourite is one word in
  one place.

  ⚠️ `b.highlight != true`, not `b.highlight == false`. The key is OPTIONAL, so
  most entries have no `highlight` at all — comparing to false would match only
  the ones explicitly written `highlight: false` and drop every book that simply
  omits it, which is nearly all of them.
{%- endcomment -%}
{% assign favourites = site.data.books | where: "highlight", true %}
{% assign rest = site.data.books | where_exp: "b", "b.highlight != true" %}

{% include card-grid.html
   items   = favourites
   dir     = "books"
   ratio   = "3x4"
   captions = true
   heading = "All Time Favorites"
   id      = "favorites"
   sub     = "Here are some of my all-time favorite books I have read and re-read and would highly recommend." %}

{% include card-grid.html
   items   = rest
   dir     = "books"
   ratio   = "3x4"
   captions = true
   heading = "More Books"
   id      = "more" %}
</div>
