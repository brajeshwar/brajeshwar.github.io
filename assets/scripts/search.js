/* Header search — in-place ⌘K command palette on Pagefind's Modular UI.
 * See _docs/search.md.
 *
 * Opens a centered popup in place (never navigates while JS is on). Triggered by
 * the header button OR ⌘K / Ctrl+K; closed by Esc or backdrop. The Modular UI
 * (~4KB gz — Input + Summary + ResultList) lazy-loads on first open; the index
 * loads on first keystroke (Pagefind's design). The trigger stays a real link to
 * /search/ as the JS-off fallback; if Pagefind can't load we show a message
 * linking there rather than navigating away.
 */
(function () {
  'use strict';

  var BUNDLE = '/pagefind/';        // baseurl is '' — Pagefind lives at the site root
  var loading = null, instance = null;
  var trigger, panel, backdrop;

  function loadModular() {
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = BUNDLE + 'pagefind-modular-ui.css';
      document.head.appendChild(link);

      var s = document.createElement('script');
      s.src = BUNDLE + 'pagefind-modular-ui.js';
      s.onload = resolve;
      s.onerror = function () { loading = null; reject(); };   // allow a retry
      document.head.appendChild(s);
    });
    return loading;
  }

  function ensureUI() {
    return loadModular().then(function () {
      var M = window.PagefindModularUI;
      if (!instance && M) {
        instance = new M.Instance({ bundlePath: BUNDLE, showImages: false });
        instance.add(new M.Input({ containerElement: '#header-search-input' }));
        instance.add(new M.Summary({ containerElement: '#header-search-summary' }));
        instance.add(new M.ResultList({ containerElement: '#header-search-results', showImages: false }));
      }
    });
  }

  function focusInput() {
    var input = panel.querySelector('.pagefind-modular-input');
    if (input) input.focus();
  }

  function showError() {
    var results = panel.querySelector('#header-search-results');
    if (results) {
      results.innerHTML = '<p class="site-search__error">Search isn’t available right now. ' +
        '<a href="' + trigger.getAttribute('href') + '">Open the search page →</a></p>';
    }
  }

  function isOpen() { return !panel.hidden; }

  function open() {
    if (isOpen()) { focusInput(); return; }
    panel.hidden = false;
    backdrop.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    ensureUI().then(focusInput, showError);
  }

  function close() {
    panel.hidden = true;
    backdrop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  /* Is the reader typing into something? Then a bare key is a character, not
     a shortcut. Covers the Pagefind input inside the palette itself and the
     one on /search/ — without this, "/" could never be typed into a search
     box, which is the classic way this shortcut goes wrong.

     Only text-accepting inputs count. A focused checkbox — the /about/
     Life/Work filter — is not typing, so the shortcut still works there. */
  var TEXT_INPUTS = /^(text|search|email|url|tel|password|number|date|month|week|time|datetime-local)$/;

  function isTyping(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    var tag = el.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return tag === 'INPUT' && TEXT_INPUTS.test((el.type || 'text').toLowerCase());
  }

  function onKeydown(e) {
    // ⌘K / Ctrl+K toggles search from anywhere.
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      isOpen() ? close() : open();
      return;
    }

    /* "/" opens search — the other convention readers arrive with, alongside
       ⌘K. Opens only; ⌘K keeps the toggle, because pressing "/" again while
       the palette is open should type a slash into the box, not close it.

       Bare key only: no meta, ctrl or alt. ⌘/ and Ctrl+/ belong to the
       browser and the OS, and taking them would be rude. Shift is NOT
       excluded — on plenty of layouts "/" IS a shifted key, and e.key already
       reports the character produced rather than the physical key. */
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey
        && !isOpen() && !isTyping(e.target)) {
      e.preventDefault();
      open();
      return;
    }

    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  }

  function init() {
    var root = document.querySelector('site-search');
    if (!root) return;
    trigger  = root.querySelector('.site-search__trigger');
    panel    = root.querySelector('.site-search__panel');
    backdrop = root.querySelector('.site-search__backdrop');
    if (!trigger || !panel) return;

    /* Name both shortcuts, with the right modifier for the platform. The
       markup ships "Search (⌘K)" so the tooltip is still right with JS off —
       this only corrects it once we know the keys actually work and which
       modifier this machine uses. */
    var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');
    trigger.title = 'Search (' + (isMac ? '\u2318K' : 'Ctrl K') + ' or /)';

    var hint = root.querySelector('.site-search__hint');
    if (hint && !isMac) hint.textContent = 'Ctrl K';

    trigger.addEventListener('click', function (e) { e.preventDefault(); open(); });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
