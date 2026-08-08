/* Heading anchors — vanilla replacement for the AnchorJS dependency.
 * For each content heading that has an id (kramdown auto_ids), prepend a
 * clickable § link to that id. Loaded defer.
 * Hidden until hover/focus. Styles live in ONE place, base.css, as of
 * 2026-07-27 — including the `position: relative` the absolute § needs, which
 * a heading picks up via `:has(> .headerlink)` once this script has run.
 *
 * They used to be copied into post.css, timeline.css and now.css, on the
 * grounds that those bundles were never loaded together. They all load
 * together now. The post.css copy had also been deleted by accident, so every
 * post with an h2 or lower was rendering a bare, permanently visible §.
 *
 * Two scopes:
 *   article.post > h2..h6   post bodies
 *   .timeline-when          timeline period headings, whose ids are written
 *                           by hand rather than derived by kramdown — so the
 *                           anchor is what makes a period linkable and
 *                           shareable ("/about/#2005-2006").
 *   .page-now h2            the year headings on /now/, which wear the same
 *                           timeline visuals; ids come from kramdown here
 *                           ("/now/#2024").
 */
(function () {
  'use strict';
  var sel = 'article.post > h2[id], article.post > h3[id], article.post > h4[id], ' +
            'article.post > h5[id], article.post > h6[id], ' +
            '.timeline-when[id], .timeline-title[id], .page-now h2[id]';
  Array.prototype.forEach.call(document.querySelectorAll(sel), function (h) {
    var a = document.createElement('a');
    a.className = 'headerlink';
    a.href = '#' + h.id;
    a.textContent = '§';            // §
    a.setAttribute('aria-hidden', 'true');
    a.tabIndex = -1;
    h.insertBefore(a, h.firstChild);
  });
})();
