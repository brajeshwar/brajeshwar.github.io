/* Back to Top — site-wide, and only where it earns its place.
 *
 * Two conditions, both deliberate:
 *   1. The control is only BUILT on a page tall enough to need it (more than
 *      LONG_ENOUGH viewports). A short page never gets the element at all —
 *      no DOM, no listener, nothing to paint.
 *   2. It only APPEARS once the reader is far enough down to want it, and
 *      hides again near the top, where it would only cover content.
 *
 * The button is a real <a href="#top">. "#top" is defined by HTML as the top
 * of the document, so the link works on its own — no click handler, and the
 * global `scroll-behavior: smooth` in base.css animates it, which also means
 * it respects prefers-reduced-motion through the existing kill switch rather
 * than needing its own check.
 *
 * With JavaScript off the control simply never appears. That is the correct
 * degradation for a convenience: scrolling up is always possible, so nothing
 * is lost (guardrail 4 asks pages to WORK without JS, not to look identical).
 */
(function () {
  'use strict';

  var LONG_ENOUGH = 2.5;   // page must be this many viewports tall to bother
  var SHOW_AFTER = 1;      // …and scrolled this many viewports down to appear

  function tallEnough() {
    return document.documentElement.scrollHeight >
           window.innerHeight * LONG_ENOUGH;
  }

  if (!tallEnough()) return;

  var link = document.createElement('a');
  link.className = 'back-to-top';
  link.href = '#top';
  link.setAttribute('aria-label', 'Back to top');
  link.title = 'Back to top';
  /* Inline SVG rather than a glyph: an arrow character renders at wildly
     different weights across the font stacks the reader can choose. */
  link.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ' +
    'viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 4.5a1 1 0 0 1 .7.3l6 6a1 1 0 1 1-1.4 1.4L13 7.9V19a1 1 0 1 1-2 0V7.9' +
    'l-4.3 4.3a1 1 0 0 1-1.4-1.4l6-6a1 1 0 0 1 .7-.3Z"/></svg>';
  document.body.appendChild(link);

  var shown = false;
  function update() {
    var past = window.scrollY > window.innerHeight * SHOW_AFTER;
    if (past === shown) return;              // only touch the DOM on a change
    shown = past;
    link.classList.toggle('is-visible', past);
  }

  /* passive: this listener never calls preventDefault, and saying so keeps it
     off the scrolling critical path. */
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', function () {
    /* A page can stop being long enough — a filtered timeline, say, or a
       rotated phone. Drop the control rather than leave it floating over a
       screen that no longer scrolls. */
    if (!tallEnough()) { link.remove(); window.removeEventListener('scroll', update); return; }
    update();
  }, { passive: true });

  update();
})();
