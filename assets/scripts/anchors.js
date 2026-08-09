/* Heading anchors — vanilla replacement for the AnchorJS dependency.
 * For each content heading that has an id (kramdown auto_ids), prepend a
 * clickable link to that id. Loaded defer, hidden until hover or focus.
 *
 * ⚠️ THE GLYPH IS `#`, NOT `§` (2026-08-09). Styling lives in ONE place,
 * base.scss — including the `position: relative` the absolutely-positioned
 * link needs, which a heading picks up via `:has(> .headerlink)` once this has
 * run, and the full-height flex box that makes the whole heading clickable.
 * Do not restyle it here.
 *
 * They used to be copied into post.css, timeline.css and now.css, on the
 * grounds that those bundles were never loaded together. They all load
 * together now. The post.css copy had also been deleted by accident, so every
 * post with an h2 or lower was rendering a bare, permanently visible mark.
 *
 * Three scopes, all relying on kramdown auto_ids — no id is hand-written any
 * more:
 *   article.post > h2..h6      post bodies
 *   .timeline h2, .timeline h3 /about/, /cv/, /about/brajeshwar.com/ — on
 *                              /about/ the h2 is a period and the h3 an entry,
 *                              and both are anchored
 *   .page-now h2               the year headings on /now/ ("/now/#2024")
 *
 * ⚠️ This site is PLAIN kramdown, so a heading that does not start with a
 * letter gets `section`, `section-1` … — /about/'s date labels anchor to those
 * and that is accepted. See _docs/timeline.md.
 */
(function () {
  'use strict';
  var sel = 'article.post > h2[id], article.post > h3[id], article.post > h4[id], ' +
            'article.post > h5[id], article.post > h6[id], ' +
            '.timeline h2[id], .timeline h3[id], .page-now h2[id]';
  Array.prototype.forEach.call(document.querySelectorAll(sel), function (h) {
    var a = document.createElement('a');
    a.className = 'headerlink';
    a.href = '#' + h.id;
    a.textContent = '#';            // see .headerlink in base.scss
    a.setAttribute('aria-hidden', 'true');
    a.tabIndex = -1;
    h.insertBefore(a, h.firstChild);
  });
})();
