/* Home page — arrow controls for the Books and Photos thumbnail strips.
 *
 * PROGRESSIVE ENHANCEMENT, and the strip works without this file. The row is a
 * native `overflow-x: auto` scroller: a trackpad, a touchscreen, a keyboard and
 * a scrollbar-dragging mouse can all move it already. What this adds is a
 * pointer affordance for the one input that has none — a mouse with no
 * horizontal wheel. The buttons ship with `hidden` in the markup and are only
 * revealed here, so with JS off they never appear at all rather than appearing
 * and doing nothing.
 *
 * Vanilla, no dependencies, one job (guardrail 6).
 */
(function () {
  'use strict';

  var strips = document.querySelectorAll('.strip__viewport');
  if (!strips.length) return;

  Array.prototype.forEach.call(strips, function (viewport) {
    var strip = viewport.querySelector('.strip');
    var prev = viewport.querySelector('.strip__nav--prev');
    var next = viewport.querySelector('.strip__nav--next');
    if (!strip || !prev || !next) return;

    /* A scroll step is most of a viewport, not all of it: leaving a sliver of
       the previous item on screen is what tells the eye the row is continuous
       rather than paging between unrelated screens. */
    function step() {
      return Math.max(160, strip.clientWidth * 0.8);
    }

    /* ⚠️ Decide `behavior` here rather than leaving it to the CSS
       `scroll-behavior` override, because `behavior: 'smooth'` is not merely
       degraded under a reduced-motion preference — it does NOTHING. Measured
       on Brajeshwar's own machine 2026-07-31, which has the OS setting on: the
       click reached the button, the strip genuinely overflowed by 902px, and
       scrollLeft stayed at 0. An identical scrollBy with `behavior: 'auto'`
       moved it immediately.

       So this is both the accessible choice and the only one that works: ask
       the preference, and scroll instantly when motion is unwelcome. */
    var noMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    function behavior() {
      return noMotion && noMotion.matches ? 'auto' : 'smooth';
    }

    function overflows() {
      /* 2px of slack. Sub-pixel layout means scrollWidth and clientWidth
         differ by a fraction on plenty of otherwise-exact rows, and without
         this the arrows flicker into view on a shelf that actually fits. */
      return strip.scrollWidth - strip.clientWidth > 2;
    }

    function sync() {
      var can = overflows();
      prev.hidden = !can;
      next.hidden = !can;
      if (!can) return;

      var max = strip.scrollWidth - strip.clientWidth;
      prev.disabled = strip.scrollLeft <= 1;
      next.disabled = strip.scrollLeft >= max - 1;
    }

    /* ⚠️ Re-sync HERE as well as on the scroll event, and do not simplify this
       back to one path. A programmatic scroll is specified to fire `scroll`,
       but measured 2026-07-31 it does not always arrive: scrollLeft moved from
       0 to 300 with a listener attached and a 400ms wait, and the listener
       never ran — so the arrows kept the enabled/disabled state of wherever
       the row used to be, and the prev arrow stayed disabled (and therefore
       `pointer-events: none`) at the far end of a scrolled shelf.

       Two calls because there are two timings: immediately for the instant
       case (reduced motion), and once after the animation for the smooth one.
       Both are idempotent — sync only reads geometry and sets two booleans. */
    function nudge(direction) {
      strip.scrollBy({ left: direction * step(), behavior: behavior() });
      sync();
      setTimeout(sync, 420);
    }

    prev.addEventListener('click', function () { nudge(-1); });
    next.addEventListener('click', function () { nudge(1); });

    /* Still listen, for the inputs that move the row without going through a
       button — trackpad, touch, keyboard, scrollbar. `passive` because this
       never calls preventDefault and the browser should not have to wait to
       find that out on every scroll frame. */
    strip.addEventListener('scroll', sync, { passive: true });

    /* ResizeObserver is here for VIEWPORT changes — a window resize or an
       orientation flip alters the strip's width and therefore whether it
       overflows at all.

       It is deliberately NOT here to wait for lazy images, which was the
       original reason and was wrong: every item has a fixed width and the
       image carries an `aspect-ratio`, so the row's geometry is settled at
       first layout and does not move when the files land. Verified — the
       arrows are correct before a single thumbnail has decoded. If items ever
       become intrinsically sized, that stops being true and this needs a load
       listener again. */
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(sync).observe(strip);
    } else {
      window.addEventListener('resize', sync);
      window.addEventListener('load', sync);
    }

    sync();
  });
})();
