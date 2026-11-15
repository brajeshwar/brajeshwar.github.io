/* Heading anchors.
 *
 * Every content heading with an id gets a small `#` link to itself (a `#`,
 * not the `§` it was before 2026-08-09), so a reader can copy the address of
 * a section. kramdown writes the ids; nothing
 * here invents one. The link stays out of sight until the heading is hovered
 * or focused, and out of the way of screen readers and the tab order, since
 * the heading already says everything the mark would.
 *
 * Three places carry anchors:
 *   article.post > h2..h6       the body of a post
 *   .timeline h2, .timeline h3  /about/, /cv/ and /about/brajeshwar.com/,
 *                               where a period and its entries are both linked
 *   .page-now h2                the years on /now/, as in /now/#2024
 *
 * All of the styling is in base.scss, under .headerlink, including the
 * positioning the heading picks up through :has() once this has run. Keep it
 * there. It was once copied into three stylesheets, and when one copy was lost
 * every post showed a bare, permanent mark.
 *
 * [WARNING] This is plain kramdown, not GFM. A heading that does not begin
 * with a letter gets an id of `section`, `section-1` and so on. The dates on
 * /about/ anchor to those, and that was a deliberate choice; see
 * _docs/timeline.md.
 */
(function () {
  'use strict';
  var sel =
    'article.post > h2[id], article.post > h3[id], article.post > h4[id], ' +
    'article.post > h5[id], article.post > h6[id], ' +
    '.timeline h2[id], .timeline h3[id], .page-now h2[id]';
  Array.prototype.forEach.call(document.querySelectorAll(sel), function (h) {
    var a = document.createElement('a');
    a.className = 'headerlink';
    a.href = '#' + h.id;
    a.textContent = '#';
    a.setAttribute('aria-hidden', 'true');
    a.tabIndex = -1;
    h.insertBefore(a, h.firstChild);
  });
})();
