/* Keyboard shortcuts: single keys for getting around.
 *
 *   h        home
 *   r        a random article
 *   a  d     previous and next article, on an article
 *   w  s     scroll up and down a screen
 *   g g      the top of the page, and Shift+G the end, as in Gmail
 *   t        light or dark, by pressing the theme button
 *   ?        the list of shortcuts, in keys-help.js
 *
 * Search keeps its own keys, / and Cmd K, in search.js.
 *
 * Small on purpose. It listens and does nothing else until a key lands.
 * The list behind ? is a second file, fetched the first time someone
 * asks for it, so a reader who never presses ? never downloads it. Its
 * URL comes from this script tag's data-help, where hash-assets.mjs can
 * rewrite it with the rest of the HTML.
 *
 * Every key steps aside when it should: while the reader types into a
 * field, when a modifier is held (Cmd, Ctrl and Alt belong to the
 * browser and the system), and when another script has already taken
 * the key. A reader can switch the single keys off from the list, for
 * speech input and anyone else a stray letter would trip up. ? stays on
 * so they can find their way back.
 *
 * With JavaScript off there are no shortcuts, and nothing on the page
 * says there are.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var urls = script ? script.dataset : {};
  var help;

  /* The same test as search.js: a bare key typed into a field is a
     character, not a shortcut. */
  var TEXT_INPUTS =
    /^(text|search|email|url|tel|password|number|date|month|week|time|datetime-local)$/;

  function isTyping(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    var tag = el.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return tag === 'INPUT' && TEXT_INPUTS.test((el.type || 'text').toLowerCase());
  }

  function isOff() {
    try {
      return localStorage.getItem('keys') === 'off';
    } catch (e) {
      return false;
    }
  }

  function go(href) {
    if (href) window.location.href = href;
  }

  function linkTo(selector) {
    var a = document.querySelector(selector);
    return a && a.href;
  }

  function motion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function scroll(direction) {
    window.scrollBy({ top: direction * window.innerHeight * 0.8, behavior: motion() });
  }

  function scrollToEnd(end) {
    var top = end ? document.documentElement.scrollHeight : 0;
    window.scrollTo({ top: top, behavior: motion() });
  }

  /* g on its own does nothing. A second g within this long goes to the
     top; any other key in between starts the count again. */
  var G_WINDOW = 800;
  var lastG = 0;

  function pressG() {
    var now = Date.now();
    if (now - lastG < G_WINDOW) {
      lastG = 0;
      scrollToEnd(false);
    } else {
      lastG = now;
    }
  }

  function pressButton(selector) {
    var button = document.querySelector(selector);
    if (button) button.click();
  }

  var KEYS = {
    h: function () {
      go(urls.home);
    },
    r: function () {
      go(urls.random);
    },
    a: function () {
      go(linkTo('.post-nav__prev'));
    },
    d: function () {
      go(linkTo('.post-nav__next'));
    },
    w: function () {
      scroll(-1);
    },
    s: function () {
      scroll(1);
    },
    g: pressG,
    t: function () {
      pressButton('theme-toggle .theme-toggle');
    },
  };

  function toggleHelp() {
    if (!help) {
      help = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = urls.help;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      help.catch(function () {
        help = null; // try again on the next ?
      });
    }
    help.then(function () {
      window.keysHelp.toggle();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
    if (isTyping(e.target)) return;

    if (e.key === '?') {
      e.preventDefault();
      toggleHelp();
      return;
    }

    if (isOff()) return;
    var key = e.key.toLowerCase();
    if (key !== 'g') lastG = 0;

    if (e.shiftKey && e.key === 'G') {
      e.preventDefault();
      scrollToEnd(true);
      return;
    }

    /* Otherwise Shift is a different key, so Shift+H is left alone. Caps
       Lock is not, and its capital H still means home. */
    if (e.shiftKey || !Object.prototype.hasOwnProperty.call(KEYS, key)) return;
    // Holding a key down scrolls on, but never navigates twice.
    if (e.repeat && key !== 'w' && key !== 's') return;
    e.preventDefault();
    KEYS[key]();
  });
})();
