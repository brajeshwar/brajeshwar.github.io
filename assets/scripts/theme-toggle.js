/* Theme toggle: Light or Dark, starting from the system's choice.
 *
 * The page arrives already in the right mode. The no-flash snippet in
 * default.html reads the saved choice and sets data-theme before first
 * paint; this file only wires the button and keeps it honest.
 *
 * A choice is remembered only while it differs from the system. Pick Dark
 * on a light system and Dark is saved; pick Light again and the saved value
 * is dropped, so the page goes back to following the system, wherever the
 * system goes next.
 *
 * With JavaScript off the button is hidden (chrome.scss) and the page simply
 * follows the system.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var button;

  function systemMode() {
    return system.matches ? 'dark' : 'light';
  }

  function currentMode() {
    var t = root.dataset.theme;
    return t === 'light' || t === 'dark' ? t : systemMode();
  }

  function show() {
    var dark = currentMode() === 'dark';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.title = dark ? 'Switch to light' : 'Switch to dark';
  }

  function choose(mode) {
    var follow = mode === systemMode();
    root.dataset.theme = follow ? 'auto' : mode;
    document.querySelector('meta[name=color-scheme]').content = follow ? 'light dark' : mode;
    try {
      if (follow) localStorage.removeItem('theme');
      else localStorage.setItem('theme', mode);
    } catch (e) {}
    show();
  }

  function init() {
    button = document.querySelector('theme-toggle .theme-toggle');
    if (!button) return;

    button.addEventListener('click', function () {
      choose(currentMode() === 'dark' ? 'light' : 'dark');
    });
    system.addEventListener('change', show);
    show();

    // The old appearance panel kept four more settings. Nothing reads them now.
    try {
      ['palette', 'font', 'textsize', 'accent'].forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
