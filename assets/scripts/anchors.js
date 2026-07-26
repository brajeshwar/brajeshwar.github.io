/* Heading anchors — vanilla replacement for the AnchorJS dependency.
 * For each content heading that has an id (kramdown auto_ids), prepend a
 * clickable § link to that id. Loaded defer.
 * Hidden until hover/focus — styles live in post.css for articles and in
 * timeline.css for the timeline (separate bundles, never loaded together).
 *
 * Two scopes:
 *   article.post > h2..h6   post bodies
 *   .timeline-when          timeline period headings, whose ids are written
 *                           by hand rather than derived by kramdown — so the
 *                           anchor is what makes a period linkable and
 *                           shareable ("/about/#2005-2006").
 *   .page-now h1            the year headings on /now/, which wear the same
 *                           timeline visuals; ids come from kramdown here
 *                           ("/now/#2024").
 */
(function () {
  'use strict';
  var sel = 'article.post > h2[id], article.post > h3[id], article.post > h4[id], ' +
            'article.post > h5[id], article.post > h6[id], ' +
            '.timeline-when[id], .page-now h1[id]';
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
