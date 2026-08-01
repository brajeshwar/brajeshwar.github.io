---
layout: page
title: Album
---

<h1>Album</h1>

<div class="album" markdown="0">
{%- comment -%}
  Built 2026-08-01, mirroring /books/. Renamed from /photos/ on 2026-08-01 — "Follow the same ideas as the /books/
  with photos.yml".

  ⚠️ EVERY THUMBNAIL HERE IS A PLACEHOLDER borrowed from /static/books/, because
  /static/album/ does not exist yet. _data/album.yaml says so at the top and
  is the only thing that needs replacing: drop real files into /static/album/,
  rewrite that file with bare filenames, and this page and the home strip both
  fill in with no code change.

  `<div class="album">` rather than `layout: album`, for the same reason as
  /books/: the class is what album.scss's grid rules target, so the cards get
  their sizing while any prose on the page keeps the reading measure.

  The "All Time Favorites" split that /books/ has is deliberately absent —
  `highlight` is supported by the data shape, but marking favorites among six
  placeholders would be theater. Add the section when there are real photos to
  choose between.
{%- endcomment -%}
{% include card-grid.html
   items  = site.data.album
   dir    = "album"
   layout = "masonry" %}
</div>

Coming Soon.
