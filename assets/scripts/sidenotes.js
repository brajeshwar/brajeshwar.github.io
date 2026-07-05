/* Tufte sidenotes — see _docs/sidenotes.md
 *
 * Builds margin sidenotes from the footnotes kramdown already emits. No content
 * or markup changes. Progressive enhancement:
 *   - wide screens with enough right-margin space → footnotes become <aside>
 *     sidenotes aligned to their references; the bottom .footnotes block hides.
 *     Hovering/focusing a reference spotlights its sidenote and dims the rest
 *     (and the reverse, from the sidenote back to the reference).
 *   - narrow screens / not enough space → sidenotes fold back to footnotes;
 *     tapping a reference reveals the note in place, right below the current
 *     block. Tapping again (or tapping the panel) dismisses it.
 *   - JS disabled → nothing runs; plain kramdown footnotes render at the foot.
 * Scoped to the reading layout (.container-ideal article).
 */
(function () {
  'use strict';

  var MIN_GUTTER_REM = 14;   // keep in sync with --sidenote-min-gutter
  var FLASH_MS = 1500;       // spotlight duration when a reference is clicked
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
      items.push({
        el: article, fnBlock: fnBlock, refs: refs,
        notes: [], byId: {}, inlines: {}, activeId: null, flashTimer: null
      });
    });
  }

  function clear(item) {
    deactivate(item);
    item.notes.forEach(function (n) { n.remove(); });
    item.notes = [];
    item.byId = {};
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

  function refsForId(item, id) {
    return Array.prototype.filter.call(item.refs, function (ref) {
      return noteIdForRef(ref) === id;
    });
  }

  function buildNote(li, number, className) {
    var aside = document.createElement('aside');
    aside.className = className;

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
    closeAllInlines(item);                     // the margin takes over from inline reveals
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
      var aside = buildNote(li, number, 'sidenote');
      aside.setAttribute('data-note', id);
      item.el.appendChild(aside);

      var refTop = ref.getBoundingClientRect().top - articleTop;
      var top = Math.max(refTop, lastBottom + gap);
      aside.style.top = top + 'px';
      lastBottom = top + aside.offsetHeight;
      item.notes.push(aside);
      item.byId[id] = aside;
    });
  }

  /* --- Cross-focus: reference ↔ sidenote. Hover/focus either side and the
         pair lights up while the other sidenotes dim (CSS: .sidenote-focus,
         .is-active in 2.1-footnotes.css). --- */

  function activate(item, id) {
    if (item.activeId === id) return;
    deactivate(item);
    var aside = item.byId[id];
    if (!aside) return;
    item.activeId = id;
    item.el.classList.add('sidenote-focus');
    aside.classList.add('is-active');
    refsForId(item, id).forEach(function (ref) { ref.classList.add('is-active'); });
  }

  function deactivate(item) {
    if (!item.activeId) return;
    var aside = item.byId[item.activeId];
    if (aside) aside.classList.remove('is-active');
    refsForId(item, item.activeId).forEach(function (ref) { ref.classList.remove('is-active'); });
    item.el.classList.remove('sidenote-focus');
    item.activeId = null;
  }

  function flash(item, id) {
    activate(item, id);
    clearTimeout(item.flashTimer);
    item.flashTimer = setTimeout(function () { deactivate(item); }, FLASH_MS);
  }

  function hoverTarget(e) {
    var el = e.target;
    if (!el || !el.closest) return null;
    return el.closest('sup[id^="fnref"], .sidenote');
  }

  function onHoverIn(item, e) {
    if (!item.el.classList.contains('has-sidenotes')) return;
    var t = hoverTarget(e);
    if (!t) return;
    var id = t.classList.contains('sidenote')
      ? t.getAttribute('data-note')
      : noteIdForRef(t);
    if (id) activate(item, id);
  }

  function onHoverOut(item, e) {
    var t = hoverTarget(e);
    if (!t) return;
    if (e.relatedTarget && t.contains(e.relatedTarget)) return;
    deactivate(item);
  }

  /* --- Reveal-in-place: on narrow screens (no margin) a tapped reference
         opens its note as an inline panel after the current block instead of
         jumping to the foot of the page. The foot block stays as-is. --- */

  function toggleInline(item, sup, id) {
    if (item.inlines[id]) { closeInline(item, id); return; }
    closeAllInlines(item);                     // one open note at a time

    var li = item.fnBlock.querySelector('#' + escapeId(id));
    if (!li) return;

    var panel = buildNote(li, (sup.textContent || '').trim(), 'sidenote-inline');
    panel.setAttribute('data-note', id);

    // After the nearest block — never inside a list/table where <aside> is invalid.
    var block = sup.closest('p, ul, ol, blockquote, figure, table, h1, h2, h3, h4, h5, h6')
      || sup.parentNode;
    block.insertAdjacentElement('afterend', panel);

    item.inlines[id] = panel;
    setOpen(item, id, true);
  }

  function closeInline(item, id) {
    var panel = item.inlines[id];
    if (!panel) return;
    panel.remove();
    delete item.inlines[id];
    setOpen(item, id, false);
  }

  function closeAllInlines(item) {
    Object.keys(item.inlines).forEach(function (id) { closeInline(item, id); });
  }

  function setOpen(item, id, open) {
    refsForId(item, id).forEach(function (ref) {
      ref.classList.toggle('is-open', open);
      var a = ref.querySelector('a');
      if (a) a.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function onClick(item, e) {
    if (!e.target || !e.target.closest) return;

    var panel = e.target.closest('.sidenote-inline');
    if (panel && !e.target.closest('a')) {     // tap the panel (not a link in it) to dismiss
      closeInline(item, panel.getAttribute('data-note'));
      return;
    }

    var sup = e.target.closest('sup[id^="fnref"]');
    if (!sup || !item.el.contains(sup)) return;
    var id = noteIdForRef(sup);
    if (!id) return;

    e.preventDefault();
    if (item.el.classList.contains('has-sidenotes')) {
      flash(item, id);                         // note is already in the margin — spotlight it
    } else {
      toggleInline(item, sup, id);
    }
  }

  function wire(item) {
    item.el.addEventListener('mouseover', function (e) { onHoverIn(item, e); });
    item.el.addEventListener('mouseout', function (e) { onHoverOut(item, e); });
    item.el.addEventListener('focusin', function (e) { onHoverIn(item, e); });
    item.el.addEventListener('focusout', function (e) { onHoverOut(item, e); });
    item.el.addEventListener('click', function (e) { onClick(item, e); });
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
    items.forEach(wire);
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
