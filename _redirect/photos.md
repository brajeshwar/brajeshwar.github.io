---
layout: redirect
permalink: /photos/
redirect_to: https://albums.oinam.com
sitemap: false
---

<!--
  /photos/ → /album/, 2026-08-01. Renamed because the section will carry video
  and audio as well as photographs, so "photos" had become the narrower word.

  This file exists so the old URL keeps working. /photos/ was live and
  returning 200 in production, and guardrail 2 is that every URL is preserved —
  a rename without this is a broken link for anyone who ever saved or shared it.

  ⚠️ Do not delete this when the rename feels old. The cost of keeping it is one
  1 KB file; the cost of removing it is a dead URL with no way to know who still
  holds it.

  ⚠️ RE-POINTED 2026-09-01, from /album/ to https://albums.oinam.com. /album/ is
  itself a redirect stub now, so leaving this one aimed at it would have made
  /photos/ a two-hop meta-refresh — slower, and a chain some crawlers decline to
  follow. The target moved; the promise this file makes did not.
-->
