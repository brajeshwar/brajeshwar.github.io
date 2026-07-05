/* Appearance panel — ported from Ovellum. See _docs/styles.md.
 *
 * Five independent axes, each persisted and applied to <html>:
 *   mode    → data-theme     : auto | light | dark              (localStorage 'theme')
 *   palette → data-palette   : default | nord | eink            ('palette')
 *   font    → data-font      : sans (Default/system) | geist (Sans-Serif) | serif (Serif) ('font')
 *   size    → data-text-size : xs | s | m (default) | l | xl    ('textsize')
 *   accent  → --ov-accent inline + data-accent="custom"         ('accent' = oklch/hex string)
 * The no-flash <head> snippet (in default.html) applies mode/palette/font/accent
 * before first paint; this builds the control panel, keeps it in sync, and
 * persists changes. With JS disabled nothing renders and the defaults show.
 */
(function () {
  'use strict';

  var AXES = {
    theme:    { key: 'theme',    def: 'auto',    attr: 'theme',
                opts: [['auto','Auto'], ['light','Light'], ['dark','Dark']] },
    palette:  { key: 'palette',  def: 'default', attr: 'palette',
                opts: [['default','Default'], ['nord','Cool'], ['eink','Warm']] },
    font:     { key: 'font',     def: 'sans',    attr: 'font',
                opts: [['sans','Default'], ['geist','Sans-Serif'], ['serif','Serif']] },
    textsize: { key: 'textsize', def: 'm',       attr: 'textSize',
                opts: [['xs','A'], ['s','A'], ['m','A'], ['l','A'], ['xl','A']] }
  };
  var GROUPS = [['theme','Mode'], ['palette','Palette'], ['font','Font'], ['textsize','Text Size']];

  // Accent swatches (Ovellum parity). '' = default (use the palette/mode accent).
  var ACCENTS = [
    ['', 'Default'],
    ['oklch(57% 0.16 255)', 'Blue'],
    ['oklch(56% 0.18 295)', 'Purple'],
    ['oklch(56% 0.14 150)', 'Green'],
    ['oklch(66% 0.13 65)',  'Amber'],
    ['oklch(60% 0.17 15)',  'Red'],
    ['oklch(60% 0.11 200)', 'Cyan']
  ];

  var trigger, panel, backdrop;

  function read(axis) {
    var a = AXES[axis], allowed = a.opts.map(function (o) { return o[0]; });
    try { var v = localStorage.getItem(a.key); return allowed.indexOf(v) > -1 ? v : a.def; }
    catch (e) { return a.def; }
  }
  function readAccent() {
    try { return localStorage.getItem('accent') || ''; } catch (e) { return ''; }
  }

  function apply(axis, val) {
    var a = AXES[axis], root = document.documentElement;
    if (axis === 'theme') root.dataset[a.attr] = val;        // auto media query needs it
    else if (val === a.def) delete root.dataset[a.attr];
    else root.dataset[a.attr] = val;
    try { localStorage.setItem(a.key, val); } catch (e) {}
    updateThemeColor();
  }

  function applyAccent(val) {
    var root = document.documentElement;
    if (val) { root.style.setProperty('--ov-accent', val); root.dataset.accent = 'custom'; }
    else { root.style.removeProperty('--ov-accent'); delete root.dataset.accent; }
    try {
      if (val) localStorage.setItem('accent', val);
      else localStorage.removeItem('accent');
    } catch (e) {}
    updateThemeColor();
  }

  function updateThemeColor() {
    var bg = getComputedStyle(document.body).backgroundColor;
    if (!bg) return;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', bg);
  }

  function makeGroup(label, labelId) {
    var group = document.createElement('div');
    group.className = 'appearance-group';
    var lab = document.createElement('span');
    lab.className = 'appearance-group__label';
    lab.id = labelId;
    lab.textContent = label;
    group.appendChild(lab);
    return { group: group, labelId: labelId };
  }

  function buildEnumGroup(axis, label) {
    var a = AXES[axis], current = read(axis);
    var g = makeGroup(label, 'appearance-' + axis + '-label');

    var opts = document.createElement('div');
    opts.className = 'appearance-options appearance-options--' + axis;
    opts.setAttribute('role', 'group');
    opts.setAttribute('aria-labelledby', g.labelId);

    a.opts.forEach(function (o) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'appearance-option';
      btn.dataset.opt = o[0];
      btn.textContent = o[1];
      if (axis === 'textsize') btn.setAttribute('aria-label', 'Text size ' + o[0]);
      btn.setAttribute('aria-pressed', o[0] === current ? 'true' : 'false');
      btn.addEventListener('click', function () {
        apply(axis, o[0]);
        Array.prototype.forEach.call(opts.children, function (c) {
          c.setAttribute('aria-pressed', c === btn ? 'true' : 'false');
        });
      });
      opts.appendChild(btn);
    });
    g.group.appendChild(opts);
    return g.group;
  }

  function buildAccentGroup() {
    var current = readAccent();
    var g = makeGroup('Accent', 'appearance-accent-label');

    var row = document.createElement('div');
    row.className = 'appearance-swatches';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-labelledby', g.labelId);

    function press(activeBtn) {
      Array.prototype.forEach.call(row.querySelectorAll('.appearance-swatch'), function (c) {
        c.setAttribute('aria-pressed', c === activeBtn ? 'true' : 'false');
      });
    }

    ACCENTS.forEach(function (a) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'appearance-swatch' + (a[0] === '' ? ' appearance-swatch--default' : '');
      btn.setAttribute('aria-label', a[1]);
      btn.title = a[1];
      if (a[0]) btn.style.setProperty('--swatch', a[0]);
      btn.setAttribute('aria-pressed', a[0] === current ? 'true' : 'false');
      btn.addEventListener('click', function () { applyAccent(a[0]); press(btn); });
      row.appendChild(btn);
    });

    // Custom colour picker (Ovellum parity).
    var custom = document.createElement('label');
    custom.className = 'appearance-swatch appearance-swatch--custom';
    custom.title = 'Custom colour';
    var input = document.createElement('input');
    input.type = 'color';
    input.setAttribute('aria-label', 'Custom accent colour');
    if (/^#[0-9a-f]{6}$/i.test(current)) input.value = current;
    input.addEventListener('input', function () { applyAccent(input.value); press(null); });
    custom.appendChild(input);
    row.appendChild(custom);

    g.group.appendChild(row);
    return g.group;
  }

  function isOpen() { return !panel.hidden; }
  function open() {
    panel.hidden = false; backdrop.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    panel.hidden = true; backdrop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  function init() {
    var root = document.querySelector('appearance-settings');
    if (!root) return;
    trigger  = root.querySelector('.appearance-trigger');
    panel    = root.querySelector('.appearance-panel');
    backdrop = root.querySelector('.appearance-backdrop');
    if (!trigger || !panel || !backdrop) return;

    GROUPS.forEach(function (gr) { panel.appendChild(buildEnumGroup(gr[0], gr[1])); });
    panel.appendChild(buildAccentGroup());

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      isOpen() ? close() : open();
    });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // Re-apply from storage (covers anything the no-flash snippet skipped).
    apply('theme', read('theme'));
    apply('palette', read('palette'));
    apply('font', read('font'));
    apply('textsize', read('textsize'));
    applyAccent(readAccent());

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
