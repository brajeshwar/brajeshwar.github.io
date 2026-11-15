/* A stroll along the South Bank, as a model you can turn in your hands.
 *
 * Without this script the page is whole: a picture of the model, numbered
 * pins on it, and the list of stops they link to. This puts the model itself
 * where the picture was. Drag to move it; right-drag, Shift-drag, or twist
 * two fingers to turn it; slide two fingers up or down to tip it; scroll or
 * pinch to come closer. Choose a stop, or Next, and the camera flies the walk to it, low
 * along the path the way you would go.
 *
 * The page is drawn only when something has changed, never on a timer of its
 * own, so a model left alone costs nothing.
 *
 * city.js reads the data into a mesh and draw.js draws it; this file is the
 * camera, the flights between stops, and the page round them.
 */

import { build } from './city.js';
import { renderer } from './draw.js';

const root = document.documentElement;
const stage = document.querySelector('.stage');
const canvas = stage.querySelector('canvas');
const caption = stage.querySelector('.caption');
const needle = stage.querySelector('[data-north] svg');
const list = document.querySelector('.walk__list');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

const LONG = 7; // the isometric lens, in degrees
const SHORT = 38; // the lens for flying
const SPEED = 150; // meters a second along the walk

let model, draw, view, flight, look;
let stops = [];
let current = -1;
let walked = 0;
let playing = false;
let pause = 0;
let queued = false;

// ---- small helpers -----------------------------------------------------

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const mix = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const ramp = (lo, hi, t) => ease(clamp((t - lo) / (hi - lo), 0, 1));

// The view part of the way from a to b, turning the short way round.
function between(a, b, t) {
  const turn = ((b.heading - a.heading + 540) % 360) - 180;
  return {
    x: mix(a.x, b.x, t),
    y: mix(a.y, b.y, t),
    z: mix(a.z, b.z, t),
    heading: a.heading + turn * t,
    pitch: mix(a.pitch, b.pitch, t),
    span: a.span * Math.pow(b.span / a.span, t),
    lens: mix(a.lens, b.lens, t),
  };
}

// The point a given distance along the walk.
function along(distance) {
  const route = model.route;
  const d = clamp(distance, 0, route[route.length - 1][3]);
  let lo = 0;
  let hi = route.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (route[mid][3] <= d) lo = mid;
    else hi = mid;
  }
  const a = route[lo];
  const b = route[hi];
  const t = b[3] > a[3] ? (d - a[3]) / (b[3] - a[3]) : 0;
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}

// The compass bearing of the walk at a distance along it, looking ahead
// (or behind) far enough that a kink in the path does not swing the camera.
function bearing(distance, forward) {
  const here = along(distance);
  let x = 0;
  let y = 0;
  for (const reach of [50, 100, 160]) {
    const there = along(distance + (forward ? reach : -reach));
    x += there[0] - here[0];
    y += there[1] - here[1];
  }
  return (Math.atan2(x, y) * 180) / Math.PI;
}

// ---- the look, from the page's own colors ----------------------------

function shade(name) {
  const hex = getComputedStyle(root).getPropertyValue(name).trim().replace('#', '');
  const full = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}

// Tones for the materials in city.js, in its order: wall and roof (unused
// here, they carry their own), land, water, six kinds of road, green, tree,
// river wall, bridge.
const DAY = [0, 0, 0.9, 0.73, 0.985, 0.965, 0.95, 0.94, 0.945, 0.62, 0.82, 0.6, 0.8, 0.86, 0, 0];
const NIGHT = [0, 0, 0.13, 0.05, 0.2, 0.18, 0.165, 0.155, 0.16, 0.28, 0.105, 0.19, 0.09, 0.2, 0, 0];

function readLook() {
  const paper = shade('--paper');
  const night = paper[0] < 0.5;
  look = {
    paper: paper,
    ink: shade('--ink'),
    shade: new Float32Array(night ? NIGHT : DAY),
    // Sky and sun add up to one on open ground, so a tone means what it says.
    light: night ? [0.5, 0.72, 0.2, 0.46] : [0.56, 0.64, 0.6, 1],
    // By day a window is a darker pane; by night one in three is lit.
    glass: night ? [0.4, 0.34, 0.62] : [0.32, 0, 0],
    walked: walked,
  };
}

// ---- views -------------------------------------------------------------

// The whole board, turned to suit the shape of the screen: north at the top
// on a wide one, the walk running up the page on a tall one.
function overview() {
  const tall = canvas.clientHeight > canvas.clientWidth * 1.1;
  const whole = {
    x: model.size[0] / 2,
    y: model.size[1] / 2,
    z: 0,
    heading: tall ? 78 : -14,
    pitch: 48,
    span: 2000,
    lens: LONG,
  };
  // Measure where the corners land, then stand back until they all fit.
  draw.place(whole);
  let most = 0;
  for (const x of [0, model.size[0]])
    for (const y of [0, model.size[1]]) {
      const p = draw.screen([x, y, 0]);
      most = Math.max(
        most,
        Math.abs(p.x / canvas.clientWidth - 0.5) * 2,
        Math.abs(p.y / canvas.clientHeight - 0.5) * 2
      );
    }
  whole.span *= most / 0.94;
  return whole;
}

// Which way the camera faces at each stop, as a compass bearing. Outward it
// looks north-east, over your left shoulder and across the river; coming
// back it looks north-west, with the river behind it. Either way the faces
// in view are the ones the afternoon sun is on.
const FACING = {
  waterloo: 30,
  'southbank-centre': 35,
  bfi: 40,
  'national-theatre': 45,
  'gabriels-wharf': 35,
  'oxo-tower': 30,
  'tate-modern': 20,
  'millennium-bridge': 0,
  globe: 25,
  'golden-hinde': 35,
  'southwark-cathedral': 40,
  'borough-market': 45,
  'hms-belfast': 50,
  'tower-bridge': 60,
  'shad-thames': 30,
  'tower-of-london': -20,
  monument: -30,
  'st-pauls': -25,
  'somerset-house': -30,
  'cleopatras-needle': -40,
  'big-ben': -40,
  'london-eye': 60,
};

// A stop the table does not know is seen from behind your left shoulder.
function stopView(i) {
  const stop = stops[i];
  const facing = FACING[stop.item.id];
  return {
    x: stop.at[0],
    y: stop.at[1],
    z: stop.at[2],
    heading: facing == null ? bearing(stop.at[3], true) - 32 : facing,
    pitch: 44,
    span: 430,
    lens: LONG,
  };
}

// ---- flights -----------------------------------------------------------

function fly(to, ms) {
  const from = view;
  const far = Math.hypot(to.x - from.x, to.y - from.y);
  // A long hop rises on the way, so both ends are in the picture mid-flight.
  const rise = clamp(far / Math.max(from.span, to.span) - 1, 0, 3) * 0.45;
  flight = {
    ms: calm.matches ? 0 : ms,
    at: function (t) {
      const v = between(from, to, ease(t));
      v.span *= 1 + rise * Math.sin(Math.PI * t);
      return v;
    },
  };
  flight.start = performance.now();
  redraw();
}

// From one stop to the next along the path itself: ease out of the still
// view, cruise low with the path ahead, ease into the still view at the end.
function travel(from, to, forward) {
  const end = model.route[model.route.length - 1][3];
  let d0 = stops[from].at[3];
  let d1 = stops[to].at[3];
  // The first stop is also the last: it closes the loop.
  if (forward && d1 <= d0) d1 = end;
  if (!forward && d0 <= d1) d0 = end;
  const a = stopView(from);
  const b = stopView(to);
  flight = {
    ms: calm.matches ? 0 : clamp((Math.abs(d1 - d0) / SPEED) * 1000, 2800, 12000),
    at: function (t) {
      const e = ease(t);
      walked = mix(d0, d1, e);
      const p = along(walked);
      const still = between(a, b, e);
      still.x = p[0];
      still.y = p[1];
      still.z = p[2];
      const cruise = {
        x: p[0],
        y: p[1],
        z: p[2],
        heading: bearing(walked, forward),
        pitch: 24,
        span: 190,
        lens: SHORT,
      };
      return between(still, cruise, ramp(0, 0.24, t) * (1 - ramp(0.72, 1, t)));
    },
  };
  flight.start = performance.now();
  redraw();
}

function land() {
  flight = null;
}

// ---- stops -------------------------------------------------------------

function show(n, how) {
  const next = ((n % stops.length) + stops.length) % stops.length;
  const forward = how !== 'back';
  const adjacent = current >= 0 && (how === 'next' || how === 'back');
  const from = current;
  current = next;
  for (const el of document.querySelectorAll('.is-active')) el.classList.remove('is-active');
  const stop = stops[current];
  stop.item.classList.add('is-active');
  stop.pin.classList.add('is-active');
  // Scroll the list only, never the page: on a phone the map is above it.
  list.scrollTo({
    top: stop.item.offsetTop - list.clientHeight / 2 + stop.item.clientHeight / 2,
    behavior: calm.matches ? 'auto' : 'smooth',
  });
  caption.querySelector('b').textContent = stop.item.dataset.stop;
  caption.querySelector('strong').textContent = stop.item.querySelector('strong').textContent;
  caption.querySelector('span').textContent = stop.item.querySelector('p').textContent;
  caption.hidden = false;
  history.replaceState(null, '', '#' + stop.item.id);

  if (how === 'jump') {
    walked = stop.at[3];
    view = stopView(current);
    land();
    redraw();
  } else if (adjacent) {
    travel(from, current, forward);
  } else {
    walked = stop.at[3];
    fly(stopView(current), 2200);
  }
}

// Fly the whole walk: every stop in turn, a breath at each, once round.
function play(on) {
  playing = on;
  const button = document.querySelector('[data-play]');
  button.setAttribute('aria-pressed', String(on));
  button.textContent = on ? 'Pause' : 'Fly the walk';
  if (!on) return;
  if (current < 0) show(0);
  else show(current + 1, 'next');
}

function arrived() {
  if (!playing) return;
  // Back at Waterloo with the loop walked: the flight is over.
  if (current === 0 && walked > 0) return play(false);
  pause = window.setTimeout(function () {
    if (playing) show(current + 1, 'next');
  }, 2400);
}

// Anything the reader does by hand ends whatever the camera was doing.
function takeOver() {
  window.clearTimeout(pause);
  if (playing) play(false);
  land();
}

// ---- drawing -----------------------------------------------------------

function redraw() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(paint);
}

function paint(now) {
  queued = false;
  if (flight) {
    const t = flight.ms ? clamp((now - flight.start) / flight.ms, 0, 1) : 1;
    view = flight.at(t);
    if (t < 1) redraw();
    else {
      land();
      arrived();
    }
  }
  view.x = clamp(view.x, 0, model.size[0]);
  view.y = clamp(view.y, 0, model.size[1]);
  look.walked = walked;
  draw.frame(view, look);
  for (const stop of stops) {
    const p = draw.screen([stop.at[0], stop.at[1], stop.at[2] + 2]);
    const seen =
      p.ahead &&
      p.x > -20 &&
      p.y > -20 &&
      p.x < canvas.clientWidth + 20 &&
      p.y < canvas.clientHeight + 20;
    stop.pin.style.visibility = seen ? 'visible' : 'hidden';
    if (seen) stop.pin.style.translate = p.x.toFixed(1) + 'px ' + p.y.toFixed(1) + 'px';
  }
  needle.style.rotate = -view.heading + 'deg';
  stage.classList.toggle('is-far', view.span / canvas.clientHeight > 7);
  if (!stage.classList.contains('is-live')) stage.classList.add('is-live');
}

// ---- hands -------------------------------------------------------------

const fingers = new Map();
let pair = null;

function zoom(factor, x, y) {
  const before = draw.ground(x, y, view);
  view.span = clamp(view.span * factor, 90, 7000);
  draw.place(view);
  const after = draw.ground(x, y, view);
  if (before && after) {
    view.x += before[0] - after[0];
    view.y += before[1] - after[1];
  }
}

function turn(degrees, lift) {
  view.heading += degrees;
  view.pitch = clamp(view.pitch + lift, 20, 82);
}

function spot(e) {
  const box = canvas.getBoundingClientRect();
  return { x: e.clientX - box.left, y: e.clientY - box.top };
}

canvas.addEventListener('pointerdown', function (e) {
  takeOver();
  canvas.setPointerCapture(e.pointerId);
  const p = spot(e);
  p.turning = e.button === 2 || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
  fingers.set(e.pointerId, p);
  pair = null;
});

// Where two fingers are: the gap between them, the angle of the line through
// them, and the point halfway.
function grip() {
  const [a, b] = Array.from(fingers.values());
  return {
    gap: Math.hypot(a.x - b.x, a.y - b.y),
    angle: Math.atan2(a.y - b.y, a.x - b.x),
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

canvas.addEventListener('pointermove', function (e) {
  const was = fingers.get(e.pointerId);
  if (!was || !view) return;
  const now = spot(e);
  now.turning = was.turning;
  fingers.set(e.pointerId, now);
  if (fingers.size === 1) {
    if (was.turning) turn((now.x - was.x) * 0.3, (now.y - was.y) * 0.25);
    else {
      // Keep the ground you took hold of under the finger.
      draw.place(view);
      const a = draw.ground(was.x, was.y, view);
      const b = draw.ground(now.x, now.y, view);
      if (a && b) {
        view.x += a[0] - b[0];
        view.y += a[1] - b[1];
      }
    }
  } else if (fingers.size === 2) {
    // Two fingers either pinch and twist, or slide up and down together to
    // tip the model. Which it is shows in the first few pixels, and holds
    // until a finger lifts.
    const g = grip();
    if (!pair) pair = { first: g, last: g, mode: '' };
    if (!pair.mode) {
      const spread = Math.abs(g.gap - pair.first.gap);
      const twist = Math.abs(g.angle - pair.first.angle) * pair.first.gap;
      if (spread > 12 || twist > 12) pair.mode = 'pinch';
      else if (Math.abs(g.y - pair.first.y) > 14) pair.mode = 'tip';
    }
    if (pair.mode === 'tip') turn(0, (g.y - pair.last.y) * -0.3);
    if (pair.mode === 'pinch') {
      draw.place(view);
      const a = draw.ground(pair.last.x, pair.last.y, view);
      view.heading += ((g.angle - pair.last.angle) * 180) / Math.PI;
      view.span = clamp((view.span * pair.last.gap) / Math.max(g.gap, 1), 90, 7000);
      draw.place(view);
      const b = draw.ground(g.x, g.y, view);
      if (a && b) {
        view.x += a[0] - b[0];
        view.y += a[1] - b[1];
      }
    }
    pair.last = g;
  }
  redraw();
});

for (const type of ['pointerup', 'pointercancel'])
  canvas.addEventListener(type, function (e) {
    fingers.delete(e.pointerId);
    pair = null;
  });

canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

canvas.addEventListener(
  'wheel',
  function (e) {
    if (!view) return;
    e.preventDefault();
    takeOver();
    const p = spot(e);
    // A pinch on a trackpad arrives as a wheel with the control key down.
    zoom(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)), p.x, p.y);
    redraw();
  },
  { passive: false }
);

canvas.addEventListener('dblclick', function (e) {
  if (!view) return;
  takeOver();
  const p = spot(e);
  const closer = Object.assign({}, view);
  const under = draw.ground(p.x, p.y, view);
  if (under) {
    closer.x = mix(view.x, under[0], 0.5);
    closer.y = mix(view.y, under[1], 0.5);
  }
  closer.span = clamp(view.span / 2, 90, 7000);
  fly(closer, 500);
});

document.addEventListener('click', function (e) {
  if (!view) return;
  const button = e.target.closest('button');
  if (button && stage.parentNode.contains(button)) {
    if ('play' in button.dataset) {
      window.clearTimeout(pause);
      return play(!playing);
    }
    takeOver();
    const step = Number(button.dataset.step);
    if (step) return show(current < 0 ? 0 : current + step, step > 0 ? 'next' : 'back');
    const to = Object.assign({}, view);
    if (button.dataset.turn) to.heading += Number(button.dataset.turn);
    if ('north' in button.dataset) to.heading = 0;
    if (button.dataset.zoom) to.span = clamp(view.span * Number(button.dataset.zoom), 90, 7000);
    if ('whole' in button.dataset) return fly(overview(), 1400);
    return fly(to, 450);
  }
  const owner = e.target.closest('[data-stop]');
  if (owner) {
    e.preventDefault();
    takeOver();
    // The stop before or after this one is reached by walking; any other, by air.
    const n = Number(owner.dataset.stop) - 1;
    show(n, n === current + 1 ? 'next' : n === current - 1 ? 'back' : '');
  }
});

document.addEventListener('keydown', function (e) {
  if (!view || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  takeOver();
  const step = e.key === 'ArrowRight' ? 1 : -1;
  show(current < 0 ? 0 : current + step, step > 0 ? 'next' : 'back');
});

// ---- start -------------------------------------------------------------

function start(city) {
  model = build(city);
  draw = renderer(canvas, model);
  if (!draw) throw new Error('no WebGL2');
  const places = new Map(model.stops.map((s) => [s.id, s.at]));
  for (const item of list.querySelectorAll('li[data-stop]')) {
    const pin = stage.querySelector('.pin[data-stop="' + item.dataset.stop + '"]');
    if (!places.has(item.id) || !pin) continue;
    pin.title = item.querySelector('strong').textContent;
    stops.push({ item: item, pin: pin, at: places.get(item.id) });
  }
  readLook();
  view = overview();
  for (const el of stage.parentNode.querySelectorAll('.steps, .tools')) el.hidden = false;

  // A link to a stop opens on that stop. The browser has already scrolled to
  // its place in the list, which on a phone is below the model; come back up.
  const named = document.getElementById(location.hash.slice(1));
  if (named && named.dataset.stop) {
    show(Number(named.dataset.stop) - 1, 'jump');
    stage.scrollIntoView({ block: 'nearest' });
  }
  redraw();

  new ResizeObserver(redraw).observe(canvas);
  // The page's Light or Dark can change under us: the system's, or the
  // site's own toggle in another tab.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', relight);
  window.addEventListener('storage', function () {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
      else delete root.dataset.theme;
    } catch (e) {
      /* no storage, no saved theme */
    }
    relight();
  });
  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
  });
  canvas.addEventListener('webglcontextrestored', function () {
    draw.setup();
    redraw();
  });
}

function relight() {
  readLook();
  redraw();
}

fetch(new URL('city.json', import.meta.url))
  .then(function (response) {
    if (!response.ok) throw new Error('city.json: ' + response.status);
    return response.json();
  })
  .then(start)
  .catch(function (error) {
    // No model, for whatever reason: the picture and the list are the page.
    stage.classList.add('is-still');
    console.warn('The model could not be drawn; showing the picture instead.', error);
  });
