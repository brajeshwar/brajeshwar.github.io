/* Back to Top — site-wide, and only where it earns its place.
 *
 * Built ONLY on a page taller than LONG_ENOUGH viewports, and inserted in
 * normal flow just before the <footer>. A short page gets no element at all.
 *
 * This script decides WHETHER the control shows, never where it sits. The
 * float-then-settle is pure CSS: `.back-to-top-row` is `position: sticky`, so
 * mid-page it is pulled up off the viewport bottom and near the end it comes
 * to rest in the place it actually occupies, above the footer. See the Back to
 * Top block in _includes/css/chrome.css.
 *
 * The link is a real <a href="#top">. "#top" is defined by HTML as the top of
 * the document, so it works with no click handler, and the global
 * `scroll-behavior: smooth` in base.css animates it — which also means it
 * inherits the prefers-reduced-motion kill switch rather than needing its own.
 *
 * With JavaScript off nothing is inserted. Correct degradation for a
 * convenience: scrolling up is always possible, so nothing is lost.
 */
(function () {
  'use strict';

  var LONG_ENOUGH = 2.5;   // page must be this many viewports tall to bother
  var SHOW_AFTER  = 1;     // ...and the reader this many viewports down

  if (document.documentElement.scrollHeight <= window.innerHeight * LONG_ENOUGH) return;

  /* Where the control goes, in order of preference:
       1. immediately BEFORE .post-nav — so on a post the arrow sits above the
          prev/next bar and the bar can sit tight to the footer
          (Brajeshwar, 2026-07-27);
       2. otherwise before <footer>, which is every other page.

     `body > footer`, not `footer`. The site footer is the only one in the
     built HTML today (checked across all ~1,456 pages), but a bare `footer`
     selector would take the FIRST one in the document — so a post that ever
     emits its own <footer> inside <main> would silently drop this row
     mid-article, and the `.back-to-top-row + footer` margin rule would
     retarget with it. */
  var anchor = document.querySelector('.post-nav') || document.querySelector('body > footer');
  if (!anchor) return;

  var row = document.createElement('div');
  row.className = 'back-to-top-row';

  var link = document.createElement('a');
  link.className = 'back-to-top';
  link.href = '#top';
  /* No visible label (2026-07-27) — the arrow is the whole control. The name
     still has to exist for anyone not looking at it, hence aria-label; `title`
     is the same words again, for the hover tooltip a sighted reader gets. */
  link.setAttribute('aria-label', 'Back to top');
  link.title = 'Back to top';
  /* Inline SVG rather than an arrow glyph: a character renders at wildly
     different weights across the font stacks the reader can choose here. */
  link.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' +
    'viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<path d="M12 4.5a1 1 0 0 1 .7.3l6 6a1 1 0 1 1-1.4 1.4L13 7.9V19a1 1 0 1 1-2 0V7.9' +
    'l-4.3 4.3a1 1 0 0 1-1.4-1.4l6-6a1 1 0 0 1 .7-.3Z"/></svg>';

  row.appendChild(link);
  /* Inside <main> on a post, since .post-nav lives there. `position: sticky`
     is clamped to its containing block, which becomes main rather than body —
     main spans the whole article, so there is more travel than the control
     could ever use, and it settles at its flow position just above the bar. */
  anchor.parentNode.insertBefore(row, anchor);

  /* Show once the reader is SHOW_AFTER viewports down, hide again on the way
     back up. Coalesced into an animation frame: `scroll` fires far more often
     than the page paints, and there is no reason to touch the class list more
     than once per frame. */
  var shown = false;
  var queued = false;

  function apply() {
    queued = false;
    var want = window.scrollY > window.innerHeight * SHOW_AFTER;
    if (want === shown) return;
    shown = want;
    row.classList.toggle('is-visible', want);
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(apply);
  }

  apply();                                                   // deep-linked partway down
  window.addEventListener('scroll', onScroll, { passive: true });
})();
