---
layout: page
title: Books
---

# Books

<div class="album" markdown="0">
{%- comment -%}
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

  `highlight: true` splits `_data/books.yaml` in two. `where_exp` rather than a
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
   sub     = "Here are some of my all-time favorite books — ones I have read and re-read, and would highly recommend." %}

{%- comment -%}
  ⚠️ THE PROSE BLOCK BELOW NEEDS `markdown="1"`, AND THAT IS THE WHOLE TRICK.
  Added 2026-08-01, moved here from the How to Read a Book post — "I wasn't sure
  of your formatting to add a prose block."

  The wrapper is `<div class="album" markdown="0">`, which switches kramdown OFF
  for everything inside it. Paste Markdown in there and it renders as literal
  characters: `## Free and Open Source Books` prints its own hashes and every
  link prints its own brackets. `markdown="1"` on a nested element turns it back
  on for that subtree only, which is the documented way out and the reason this
  is a `<div>` at all rather than plain text.

  `container-ideal` puts the list on the reading measure. Without it the prose
  would run the full band the grids use — fine for thumbnails, far too wide for
  a line of text. It is the same class the article body uses.

  ⚠️ Blank lines around the `<div>` are load-bearing. kramdown only treats a
  block-level HTML element as a boundary when it is separated by blank lines; a
  `markdown="1"` div jammed against the Liquid above it does not re-enter
  Markdown mode reliably.

  ⚠️ NO FOOTNOTES IN HERE. The two sections moved over carry none, which is
  lucky: page.html keys `container-ideal` off `content contains
  'class="footnotes"'`, so adding one would silently change the whole page's
  width. If a footnote is ever wanted here, check what that does to the layout
  first.
{%- endcomment -%}

<div class="container-ideal" markdown="1">

## Free and Open Source Books

- [Downpour](https://www.downpour.com) DRM-Free AudioBooks (paid)
- [Global Grey’s Books](https://www.globalgreyebooks.com/) is a growing library of high-quality, public domain, free ebooks.
- [Standard Ebooks](https://standardebooks.org) has free and liberated ebooks.
- Project [Gutenberg](https://www.gutenberg.org) is a library of over 60,000 free eBooks carefully produced for the true book lover.
- [Open Library](https://openlibrary.org)
- [Open Textbook Initiative](https://aimath.org/textbooks/) from The American Institute of Mathematics.
- [LibriVox](https://librivox.org) free public domain Audiobooks.
- [Wikisource](https://en.wikisource.org/wiki/Main_Page) is the free library that anyone can improve.
- [The Society of Minds](http://aurellem.org/society-of-mind/) by [Marvin Minsky](https://web.media.mit.edu/~minsky/).
- [Library of Short Stories](https://www.libraryofshortstories.com) is a Free Online Library for Classic Short Stories.

### References

- [HackerNews Book Recommendations](https://hacker-recommended-books.vercel.app)
- [A Helpful Guide to Reading Better](https://fs.blog/reading/)
- [Books by the Foot](https://booksbythefoot.com)
- [Good Books](https://www.goodbooks.io) Recommended by Successful People.
- [How to Gain More From Your Reading](https://psyche.co/guides/how-to-gain-more-from-reading-by-taking-it-all-in-more-slowly)
- [Odd Lots Recommended Books](https://odd-lots-books.netlify.app)

</div>

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
Since 2018, I have listed the interesting ones I read each year:
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
