---
layout: page
title: Photos
---

<h1>Photos</h1>

<div class="album" markdown="0">
{%- comment -%}
  Built 2026-08-01, mirroring /books/ — "Follow the same ideas as the /books/
  with photos.yml".

  ⚠️ EVERY THUMBNAIL HERE IS A PLACEHOLDER borrowed from /static/books/, because
  /static/photos/ does not exist yet. _data/photos.yaml says so at the top and
  is the only thing that needs replacing: drop real files into /static/photos/,
  rewrite that file with bare filenames, and this page and the home strip both
  fill in with no code change.

  `<div class="album">` rather than `layout: album`, for the same reason as
  /books/: the class is what album.scss's grid rules target, so the cards get
  their sizing while any prose on the page keeps the reading measure.

  The "All Time Favorites" split that /books/ has is deliberately absent —
  `highlight` is supported by the data shape, but marking favourites among six
  placeholders would be theatre. Add the section when there are real photos to
  choose between.
{%- endcomment -%}
{% include card-grid.html
   items = site.data.photos
   dir   = "photos"
   ratio = "4x3" %}
</div>

Coming Soon.
