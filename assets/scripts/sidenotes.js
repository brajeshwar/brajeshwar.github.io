/* Tufte sidenotes — see _docs/SIDENOTES.md
 *
 * Builds margin sidenotes from the footnotes kramdown already emits. No content
 * or markup changes. Progressive enhancement:
 *   - wide screens with enough right-margin space → footnotes become <aside>
 *     sidenotes aligned to their references; the bottom .footnotes block hides.
 *   - narrow screens / not enough space → sidenotes fold back to footnotes.
 *   - JS disabled → nothing runs; plain kramdown footnotes render at the foot.
 * Scoped to the reading layout (.container-ideal article).
 */
(function () {
  'use strict';

  var MIN_GUTTER_REM = 14;   // keep in sync with --sidenote-min-gutter
  var items = [];

  function rootFontPx() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }
  function rem(n) { return n * rootFontPx(); }

  function escapeId(id) {
    if (window.CSS && CSS.escape) return CSS.escape(id);
    return id.replace(/([:.\[\]])/g, '\\$1');
  }

  function collect() {
    items = [];
    var articles = document.querySelectorAll('.container-ideal article');
    Array.prototype.forEach.call(articles, function (article) {
      var fnBlock = article.querySelector('.footnotes');
      if (!fnBlock) return;
      var refs = article.querySelectorAll('sup[id^="fnref"]');
      if (!refs.length) return;
      items.push({ el: article, fnBlock: fnBlock, refs: refs, notes: [] });
    });
  }

  function clear(item) {
    item.notes.forEach(function (n) { n.remove(); });
    item.notes = [];
    item.el.classList.remove('has-sidenotes');
  }

  function gutterFits(article) {
    var rect = article.getBoundingClientRect();
    var rightSpace = window.innerWidth - rect.right;
    return rightSpace >= rem(MIN_GUTTER_REM);
  }

  function noteIdForRef(ref) {
    var a = ref.querySelector('a[href^="#fn"]') || ref.querySelector('a');
    var href = a && a.getAttribute('href');
    return href && href.charAt(0) === '#' ? href.slice(1) : null;
  }

  function buildSidenote(li, number) {
    var aside = document.createElement('aside');
    aside.className = 'sidenote';

    var ref = document.createElement('span');
    ref.className = 'sidenote-ref';
    ref.textContent = number;
    aside.appendChild(ref);

    var clone = li.cloneNode(true);
    var back = clone.querySelector('.reversefootnote');
    if (back) back.remove();
    while (clone.firstChild) aside.appendChild(clone.firstChild);
    return aside;
  }

  function place(item) {
    clear(item);
    if (!gutterFits(item.el)) return;          // fold back to footnotes
    item.el.classList.add('has-sidenotes');

    var articleTop = item.el.getBoundingClientRect().top;
    var gap = rem(1);
    var lastBottom = 0;
    var seen = {};

    Array.prototype.forEach.call(item.refs, function (ref) {
      var id = noteIdForRef(ref);
      if (!id || seen[id]) return;             // skip repeated references
      seen[id] = true;

      var li = item.fnBlock.querySelector('#' + escapeId(id));
      if (!li) return;

      var number = (ref.textContent || '').trim();
      var aside = buildSidenote(li, number);
      item.el.appendChild(aside);

      var refTop = ref.getBoundingClientRect().top - articleTop;
      var top = Math.max(refTop, lastBottom + gap);
      aside.style.top = top + 'px';
      lastBottom = top + aside.offsetHeight;
      item.notes.push(aside);
    });
  }

  function render() { items.forEach(place); }

  var timer;
  function onResize() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  }

  function init() {
    collect();
    if (!items.length) return;
    render();
    window.addEventListener('resize', onResize);
    window.addEventListener('load', render);                 // images settled
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(render);                     // fonts settled
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
