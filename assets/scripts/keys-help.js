/* The list of keyboard shortcuts, shown by ?.
 *
 * Fetched by keys.js the first time ? is pressed, never before. It builds
 * a native <dialog>, which brings the focus trap, Escape to close and the
 * backdrop with it. The look is in keys.scss: translucent, and the
 * opposite of the page's mode.
 *
 * The switch at the foot turns the single keys off and on. keys.js reads
 * the same localStorage entry on every key.
 */
(function () {
  'use strict';

  var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');

  var ROWS = [
    [['/', isMac ? '⌘ K' : 'Ctrl K'], 'Search'],
    [['h'], 'Home'],
    [['r'], 'A random article'],
    [['a'], 'Previous article'],
    [['d'], 'Next article'],
    [['w'], 'Scroll up'],
    [['s'], 'Scroll down'],
    [['g g'], 'Top of the page'],
    [['Shift G'], 'End of the page'],
    [['t'], 'Light or dark'],
    [['?'], 'This list'],
    [['Esc'], 'Close'],
  ];

  var dialog, status, button;

  function isOff() {
    try {
      return localStorage.getItem('keys') === 'off';
    } catch (e) {
      return false;
    }
  }

  function show() {
    var off = isOff();
    status.textContent = off ? 'Single keys are off.' : 'Single keys are on.';
    button.textContent = off ? 'Turn on' : 'Turn off';
  }

  function flip() {
    try {
      if (isOff()) localStorage.removeItem('keys');
      else localStorage.setItem('keys', 'off');
    } catch (e) {}
    show();
  }

  function el(name, className, text) {
    var node = document.createElement(name);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function build() {
    dialog = el('dialog', 'keys-help');
    dialog.setAttribute('aria-labelledby', 'keys-help-title');
    // Focusable, so toggle() can put the focus on the panel itself.
    dialog.tabIndex = -1;

    var body = el('div', 'keys-help__body');
    var title = el('h2', 'keys-help__title', 'Keyboard shortcuts');
    title.id = 'keys-help-title';
    body.appendChild(title);

    var list = el('dl', 'keys-help__list');
    ROWS.forEach(function (row) {
      var dt = el('dt');
      row[0].forEach(function (key, i) {
        if (i) dt.appendChild(document.createTextNode(' or '));
        dt.appendChild(el('kbd', '', key));
      });
      list.appendChild(dt);
      list.appendChild(el('dd', '', row[1]));
    });
    body.appendChild(list);

    var foot = el('p', 'keys-help__switch');
    status = el('span');
    button = el('button');
    button.type = 'button';
    button.addEventListener('click', flip);
    foot.appendChild(status);
    foot.appendChild(button);
    body.appendChild(foot);

    dialog.appendChild(body);
    // The body fills the dialog, so a click that lands on the dialog itself
    // came through the backdrop.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    document.body.appendChild(dialog);
  }

  window.keysHelp = {
    toggle: function () {
      if (!dialog) build();
      if (dialog.open) return dialog.close();
      show();
      dialog.showModal();
      // The panel, not its one button: opening the list should not light
      // up "Turn off" as though that were the point.
      dialog.focus();
    },
  };
})();
