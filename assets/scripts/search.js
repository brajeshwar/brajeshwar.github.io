/* Site search — the ⌘K command palette AND the /search/ page, one script.
 * See _docs/search.md.
 *
 * TWO MOUNTS, ONE COMPONENT (since 2026-08-09). The palette opens a centered
 * popup in place and never navigates while JS is on; /search/ renders the same
 * Input + Summary + ResultList inline on the page. Brajeshwar: "even on the
 * live website, [/search/ does] not have the Search Field to do the search.
 * Bring the same Search Input that we have globally."
 *
 * ⚠️ /search/ USED TO RUN PAGEFIND'S *DEFAULT* UI, and it was dead in
 * production while working perfectly on localhost. The cause was not Pagefind:
 * Cloudflare Rocket Loader rewrites every <script type> and re-executes them
 * AFTER DOMContentLoaded has already fired, and the old pagefind-custom.js put
 * its entire init inside a naked `window.addEventListener('DOMContentLoaded')`.
 * That listener was registered on an event that had already passed, so it never
 * ran and the page rendered an empty div. Nothing logged; nothing 404'd.
 *
 * ⚠️ WHICH IS WHY THE READY-GUARD AT THE FOOT OF THIS FILE IS LOAD-BEARING.
 * `readyState === 'loading' ? addEventListener : init()` survives Rocket
 * Loader because the else-branch runs immediately when the event is gone.
 * appearance.js and sidenotes.js use the same guard. Do not "simplify" any of
 * them to a bare listener — it will pass every local test and ship broken.
 *
 * The Modular UI (~4KB gz) lazy-loads on first open for the palette; the index
 * loads on first keystroke (Pagefind's design). On /search/ it loads at once
 * instead — the reader went there on purpose, so there is nothing to defer.
 * The trigger stays a real link to /search/ as the JS-off fallback; if Pagefind
 * can't load we show a message rather than navigating away.
 */
(function () {
  'use strict';

  var BUNDLE = '/pagefind/';        // baseurl is '' — Pagefind lives at the site root
  var loading = null, instance = null, pageInstance = null;
  var trigger, panel, backdrop, pageRoot;

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

  /* Build one Instance over a set of three mounts. The palette and /search/ get
     an Instance each rather than sharing one: an Instance owns its query, so a
     shared one would echo whatever was typed in the palette into the page
     behind it. They do share the loaded bundle, which is the part with a cost. */
  function mount(sel) {
    var M = window.PagefindModularUI;
    if (!M) return null;
    var inst = new M.Instance({ bundlePath: BUNDLE, showImages: false });
    inst.add(new M.Input({ containerElement: sel.input }));
    inst.add(new M.Summary({ containerElement: sel.summary }));
    inst.add(new M.ResultList({ containerElement: sel.results, showImages: false }));
    return inst;
  }

  function ensureUI() {
    return loadModular().then(function () {
      if (!instance) {
        instance = mount({
          input:   '#header-search-input',
          summary: '#header-search-summary',
          results: '#header-search-results'
        });
      }
    });
  }

  function focusIn(root) {
    var input = root && root.querySelector('.pagefind-modular-input');
    if (input) input.focus();
    return !!input;
  }

  function focusInput() { focusIn(panel); }

  function showError() {
    var results = panel.querySelector('#header-search-results');
    if (results) {
      results.innerHTML = '<p class="site-search__error">Search isn’t available right now. ' +
        '<a href="' + trigger.getAttribute('href') + '">Open the search page →</a></p>';
    }
  }

  /* The page has nowhere to fall back TO — it is the fallback — so this points
     at the archive instead of at itself. */
  function showPageError() {
    var results = document.getElementById('page-search-results');
    if (results) {
      results.innerHTML = '<p class="site-search__error">Search isn’t available right now. ' +
        '<a href="/archives/">Browse the archives →</a></p>';
    }
  }

  /* /search/ mounts eagerly: the reader asked for this page, so there is no
     first-interaction to wait for and deferring only adds a blank frame. */
  function initPage() {
    pageRoot = document.getElementById('page-search');
    if (!pageRoot) return false;
    loadModular().then(function () {
      pageInstance = mount({
        input:   '#page-search-input',
        summary: '#page-search-summary',
        results: '#page-search-results'
      });
      focusIn(pageRoot);
    }, showPageError);
    return true;
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
      /* On /search/ there is already a search field in the page. Opening a
         modal on top of it would be a second box searching the same index —
         so the shortcut just puts the cursor where the reader expects it. */
      if (pageRoot && !isOpen() && focusIn(pageRoot)) return;
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
      if (pageRoot && focusIn(pageRoot)) return;   // same reason as ⌘K above
      open();
      return;
    }

    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  }

  function init() {
    /* Before the header guard, not after: /search/ must come up even if the
       chrome is missing or changes shape. */
    initPage();

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
