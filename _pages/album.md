---
layout: page
title: Album
---

<h1>Album</h1>

<div class="album" markdown="0">
{%- comment -%}
  Built 2026-08-01, mirroring /books/. Renamed from /photos/ on 2026-08-01 — "Follow the same ideas as the /books/
  with photos.yml".

  Real photos since 2026-08-01. The twelve borrowed book covers that stood in
  here are gone; _data/album.yaml is the only file to touch when adding more,
  and this page and the home strip both fill in with no code change.

  `<div class="album">` rather than `layout: album`, for the same reason as
  /books/: the class is what album.scss's grid rules target, so the cards get
  their sizing while any prose on the page keeps the reading measure.

  The "All Time Favorites" split that /books/ has is deliberately absent —
  `highlight` is supported by the data shape, but there is nothing yet to
  choose between. Add the section when the shelf is big enough to rank.
{%- endcomment -%}
{% include card-grid.html
   items  = site.data.album
   dir    = "album"
   layout = "masonry" %}
</div>
