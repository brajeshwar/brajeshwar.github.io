---
layout: redirect
permalink: /resume/
redirect_to: /cv/
sitemap: false
---

<!--
  /resume/ → /cv/, 2026-08-09, at his ask: "Because we now have '/cv/', create a
  page '/resume/' with the redirect template from layout and re-direct to
  '/cv/'."

  ⚠️ THIS ONE IS NOT A RENAME. /photos/ → /album/ exists because a live URL
  moved and guardrail 2 says every URL is preserved. /resume/ was never live —
  it is here because "resume" is the word half the world types for this page and
  "CV" is the word the other half types. Same document, two names, one canonical.

  Which is why the arrow points this way. /cv/ is the real page and /resume/ is
  the alias, so the alias is the stub: `rel="canonical"` on /cv/ and `noindex`
  here keeps one page in the index rather than two competing copies of the same
  history.

  There is a third name — cv.brajeshwar.com, the standalone site this page was
  rebuilt from. That one is not ours to redirect from a Jekyll stub; it needs a
  DNS or host-level rule, and it is still serving its own copy.
-->
