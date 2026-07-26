/* Timeline filter ↔ URL hash — see _docs/timeline.md
 *
 * The filter itself is pure CSS (checkboxes + :has()); this only keeps the
 * URL and the checkboxes in agreement, so a filtered view can be copied out
 * of the address bar and sent to someone.
 *
 *   /about/        both tracks   (no hash — the default)
 *   /about/#work   Work only     (the "instead of my CV" link)
 *   /about/#life   Life only
 *
 * A URL has exactly one fragment, so "#life#work" is not a thing — but it is
 * not needed either: both-tracks IS the bare URL.
 *
 * Progressive enhancement, in both directions:
 *   - JS off, arriving at #work → CSS :target rules filter the page, so a
 *     shared link still works for the recipient. That is the case that has to
 *     survive, and it does.
 *   - JS off, toggling boxes → filtering works, the URL just doesn't follow.
 *   - JS on → this script adds .timeline-js to <html>, which switches the
 *     :target rules OFF so the two mechanisms can never disagree, and the
 *     checkboxes become the single source of truth.
 */
(function () {
  'use strict';

  var timeline = document.querySelector('.timeline');
  if (!timeline) return;

  var life = document.getElementById('track-life');
  var work = document.getElementById('track-work');
  if (!life || !work) return;

  /* Hand over from the CSS :target fallback before touching anything, so there
     is no frame where both mechanisms are live. */
  document.documentElement.classList.add('timeline-js');

  function readHash() {
    var h = (location.hash || '').replace('#', '').toLowerCase();
    if (h !== 'life' && h !== 'work') { life.checked = true; work.checked = true; return; }
    life.checked = (h === 'life');
    work.checked = (h === 'work');
  }

  function writeHash() {
    var h = '';
    if (life.checked && !work.checked) h = '#life';
    else if (work.checked && !life.checked) h = '#work';

    /* replaceState, not location.hash: assigning the hash scrolls the page to
       the target and stacks a history entry per click. Toggling a filter is
       not navigation. */
    history.replaceState(null, '', location.pathname + location.search + h);
  }

  readHash();
  life.addEventListener('change', writeHash);
  work.addEventListener('change', writeHash);

  /* Back/forward, or someone editing the hash by hand. */
  window.addEventListener('hashchange', readHash);
})();
