/* Heading anchors — vanilla replacement for the AnchorJS dependency.
 * For each content heading that has an id (kramdown auto_ids), prepend a
 * clickable § link to that id. Loaded defer; scoped to the post body.
 * Hidden until hover/focus via 9.9-utils-anchorjs.css.
 */
(function () {
  'use strict';
  var sel = 'article.post > h2[id], article.post > h3[id], article.post > h4[id], ' +
            'article.post > h5[id], article.post > h6[id]';
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
