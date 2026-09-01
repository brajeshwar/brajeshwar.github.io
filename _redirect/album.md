---
layout: redirect
permalink: /album/
redirect_to: https://albums.oinam.com
sitemap: false
---

<!--
  /album/ → https://albums.oinam.com, 2026-09-01, at his ask: "delete everything
  from brajeshwar.com album. This is now handled at albums.oinam.com".

  The page is gone — _pages/album.html is deleted. This stub is here because
  guardrail 2 is that every URL is preserved, and /album/ was live, in the
  sitemap, linked from the footer and from /search/, and shared. Deleting the
  page without it would have been a dead URL with no way to know who still
  holds one.

  ⚠️ THE FIRST OFF-SITE REDIRECT ON THIS SITE. The other two (/photos/, /resume/)
  point at pages here. That works because Jekyll's `relative_url` returns an
  absolute URL untouched rather than prefixing the baseurl — verified in the
  built output, not assumed — so redirect.html needs no change. If it ever
  grows a baseurl-aware rewrite, check this file still emits the bare URL.

  ⚠️ /photos/ WAS RE-POINTED HERE'S TARGET, NOT AT /album/. It used to redirect
  to /album/, which would now be a redirect to a redirect: two meta-refresh hops,
  slower for a reader and a chain some crawlers stop following. It goes straight
  to albums.oinam.com now. Both old URLs still resolve, in one hop each.

  What did NOT go with the page: the home page still carries the Albums strip,
  still built from the same feed by scripts/fetch-albums.rb, and its heading is
  the off-site link. So the fetch, _data/albums.yaml and the two card includes
  all stay live — "delete everything" was about the page, not the shelf.
-->
