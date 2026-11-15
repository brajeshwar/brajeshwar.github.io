/* A stroll along the South Bank, as a model you can turn in your hands.
 *
 * Without this script the page is whole: a picture of the model, numbered
 * pins on it, and the list of stops they link to. This puts the model itself
 * where the picture was. Drag to turn and tip it; right-drag or Shift-drag
 * to move it; scroll or pinch to come closer. Choose a stop, or Next, and the
 * camera flies the walk to it, low along the path the way you would go.
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
const CRUISE = 150; // meters a second along the walk, on the straight
const TURN = 40; // degrees a second the camera may turn, flying a bend
const PUSH = 70; // meters a second it may gain or lose in a second

let model, draw, view, flight, look;
let stops = [];
let current = -1;
let walked = 0;
let playing = false;
let queued = false;
let pinSize = 0; // how wide a pin is, in pixels
let names = []; // the landmarks' labels
let fixtures = []; // where the toolbar and the caption sit, for the names to keep clear of

// ---- small helpers -----------------------------------------------------

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const mix = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const ramp = (lo, hi, t) => ease(clamp((t - lo) / (hi - lo), 0, 1));
// The short way round from one bearing to another, in degrees either side.
const swing = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;

// Half a lens angle as a tangent, which is what the camera's distance from
// its subject goes by, and back again.
const reach = (lens) => Math.tan((lens * Math.PI) / 360);
const lensOf = (tangent) => (Math.atan(tangent) * 360) / Math.PI;

// The view part of the way from a to b, turning the short way round. Span
// and lens change by ratio, not by amount: going from the long lens to the
// short one the camera comes in three kilometers, and by amount it would do
// most of that in the first moment.
function between(a, b, t) {
  const turn = swing(a.heading, b.heading);
  return {
    x: mix(a.x, b.x, t),
    y: mix(a.y, b.y, t),
    z: mix(a.z, b.z, t),
    heading: a.heading + turn * t,
    pitch: mix(a.pitch, b.pitch, t),
    span: a.span * Math.pow(b.span / a.span, t),
    lens: lensOf(reach(a.lens) * Math.pow(reach(b.lens) / reach(a.lens), t)),
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

// ---- the camera's line -------------------------------------------------
//
// The walk as drawn follows the footpath corner for corner: a hundred and
// fifty of them sharper than sixty degrees, round kiosks, up steps, across
// roads. A camera made to follow that lurches from side to side and swings
// its head at every one. So the camera flies a line of its own: the walk
// sampled every few meters and blurred, its place over thirty meters and its
// direction over sixty. It cuts the corners a walker has to take, by a few
// meters and at the worst dogleg by thirty. The path drawn on the ground is
// still the true one.

const STRIDE = 4; // meters between one point of the line and the next
let line = null;

// A list of numbers, each replaced by the weighted average of its neighbors
// for a few `meters` either side. The ends stay where they are.
function blur(values, meters) {
  const sigma = meters / STRIDE;
  const far = Math.ceil(sigma * 3);
  const out = new Float32Array(values.length);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let weight = 0;
    for (let k = -far; k <= far; k++) {
      const w = Math.exp((-k * k) / (2 * sigma * sigma));
      sum += w * values[clamp(i + k, 0, values.length - 1)];
      weight += w;
    }
    out[i] = sum / weight;
  }
  return out;
}

function drawLine() {
  const count = Math.ceil(loop() / STRIDE) + 1;
  const raw = [[], [], []];
  for (let i = 0; i < count; i++) along(i * STRIDE).forEach((v, axis) => raw[axis].push(v));
  const x = blur(raw[0], 30);
  const y = blur(raw[1], 30);
  // Which way the line runs at each point: toward the point forty meters
  // on, unwound so that the bearing never jumps a whole turn.
  const course = [];
  for (let i = 0; i < count; i++) {
    const j = Math.min(i + 10, count - 1);
    const toward = (Math.atan2(x[j] - x[i], y[j] - y[i]) * 180) / Math.PI;
    const stalled = Math.hypot(x[j] - x[i], y[j] - y[i]) < 2;
    const last = i ? course[i - 1] : toward;
    course.push(stalled ? last : last + swing(last, toward));
  }
  line = { x: x, y: y, z: blur(raw[2], 30), course: blur(course, 60) };
}

// The camera's line at a distance along the walk: a place, and a bearing.
function ride(distance) {
  const at = clamp(distance / STRIDE, 0, line.x.length - 1);
  const i = Math.min(Math.floor(at), line.x.length - 2);
  const t = at - i;
  return {
    x: mix(line.x[i], line.x[i + 1], t),
    y: mix(line.y[i], line.y[i + 1], t),
    z: mix(line.z[i], line.z[i + 1], t),
    heading: mix(line.course[i], line.course[i + 1], t),
  };
}

// ---- the look ----------------------------------------------------------
//
// The paper and the ink are the page's own, read from its CSS. The model's
// colors are here: a tint for each kind of ground, and one for the buildings,
// which keep the tone each was given and take only a little warmth or cool.

const color = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);

function shade(name) {
  const hex = getComputedStyle(root).getPropertyValue(name).trim().replace('#', '');
  return color('#' + (hex.length === 3 ? hex.replace(/./g, '$&$&') : hex));
}

// By material, in city.js's order. Walls and roofs are not here; they carry
// a tone of their own and take the `walls` tint.
const DAY = {
  land: '#e8e4da',
  water: '#a8c5d8',
  roads: ['#fbf9f4', '#f6f3ec', '#f0ebe0', '#eeeae1', '#efebe2', '#9c9790'],
  green: '#c3d6ae',
  tree: '#7da06b',
  bank: '#cdc7ba',
  bridge: '#dcd7cc',
  walls: '#fffaf2',
  lamp: '#000000',
};
const NIGHT = {
  land: '#22252b',
  water: '#0c1a28',
  roads: ['#353941', '#30343b', '#2c3036', '#2a2d33', '#2b2e34', '#4b4a48'],
  green: '#1e2b22',
  tree: '#2e4735',
  bank: '#171a20',
  bridge: '#33363d',
  walls: '#eaf0ff',
  lamp: '#ffd58a',
};

// The sixteen tints the shader looks up by material number.
function tints(set) {
  const list = [set.walls, set.walls, set.land, set.water].concat(set.roads, [
    set.green,
    set.tree,
    set.bank,
    set.bridge,
    '#000000',
    '#000000',
  ]);
  return new Float32Array(list.flatMap(color));
}

function readLook() {
  const paper = shade('--paper');
  const night = paper[0] < 0.5;
  const set = night ? NIGHT : DAY;
  look = {
    paper: paper,
    ink: shade('--ink'),
    tints: tints(set),
    lamp: color(set.lamp),
    // Sky and sun add up to one on open ground, so a color means what it says.
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
    heading: facing == null ? ride(stop.at[3]).heading - 32 : facing,
    pitch: 44,
    span: 430,
    lens: LONG,
  };
}

// ---- flights -----------------------------------------------------------
//
// Every flight is one the reader asked for, with a button, a key or a pin,
// so every flight plays. A system set to reduce motion still gets them: the
// flight is what the button is for. That setting stops only what nobody
// asked for, the model carrying on after a drag and the list scrolling
// itself smoothly.

function fly(to, ms) {
  const from = view;
  const far = Math.hypot(to.x - from.x, to.y - from.y);
  // A long hop rises on the way, so both ends are in the picture mid-flight.
  const rise = clamp(far / Math.max(from.span, to.span) - 1, 0, 3) * 0.45;
  flight = {
    ms: ms,
    at: function (t) {
      const v = between(from, to, ease(t));
      v.span *= 1 + rise * Math.sin(Math.PI * t);
      return v;
    },
  };
  flight.start = performance.now();
  redraw();
}

// The camera low over its line at a distance along the walk, facing the
// way it is going.
function cruise(distance, forward) {
  const at = ride(distance);
  if (!forward) at.heading += 180;
  return Object.assign(at, { pitch: 24, span: 190, lens: SHORT });
}

// How long the walk is, round the whole loop, in meters.
function loop() {
  return model.route[model.route.length - 1][3];
}

// Where the walk has got to, counting the end of the loop as its start.
function here() {
  return walked >= loop() - 1 ? 0 : walked;
}

// How sharply the camera's line bends at a distance along the walk, in
// degrees a meter.
function bend(distance) {
  const i = clamp(Math.floor(distance / STRIDE), 0, line.course.length - 2);
  return Math.abs(line.course[i + 1] - line.course[i]) / STRIDE;
}

// How fast a flight goes at a distance along the walk, in meters a second,
// on its way from one distance to another. It eases away and eases in; it
// slows through a bend, so the camera never turns faster than TURN; and
// the fly-by, which lingers, eases off past every stop so its name can be read.
function pace(distance, from, to, lingering) {
  // A long leg may go faster on the straight, or Next would be a long wait.
  let speed = CRUISE * (lingering ? 1 : clamp(Math.abs(to - from) / 800, 1, 1.4));
  speed *= mix(0.3, 1, ramp(0, 90, Math.abs(distance - from)));
  speed *= mix(0.3, 1, ramp(0, 110, Math.abs(to - distance)));
  if (lingering) {
    let near = 0;
    for (const stop of stops)
      near = Math.max(near, 1 - ramp(0, 80, Math.abs(distance - stop.at[3])));
    speed *= 1 - 0.5 * near;
  }
  return speed / Math.hypot(1, (speed * bend(distance)) / TURN);
}

// A timetable for a flight along the walk: the second at which it has gone
// each few meters further. The pace comes first, then the camera's weight:
// it cannot gain or lose speed faster than PUSH, so it starts to brake well
// before a bend and pulls away gently after one, in place of stamping on the
// brakes at the corner.
function timetable(from, to, lingering) {
  const steps = Math.max(1, Math.ceil(Math.abs(to - from) / STRIDE));
  const step = (to - from) / steps;
  const speed = [];
  for (let i = 0; i < steps; i++) speed.push(pace(from + (i + 0.5) * step, from, to, lingering));
  const most = (v) => Math.sqrt(v * v + 2 * PUSH * Math.abs(step));
  for (let i = 1; i < steps; i++) speed[i] = Math.min(speed[i], most(speed[i - 1]));
  for (let i = steps - 2; i >= 0; i--) speed[i] = Math.min(speed[i], most(speed[i + 1]));
  const due = [0];
  for (let i = 0; i < steps; i++) due.push(due[i] + Math.abs(step) / speed[i]);
  return { from: from, step: step, due: due, seconds: due[steps] };
}

// How far along the walk a flight is at a time on its timetable.
function reached(table, clock) {
  const due = table.due;
  let i = 0;
  let j = due.length - 1;
  while (j - i > 1) {
    const mid = (i + j) >> 1;
    if (due[mid] <= clock) i = mid;
    else j = mid;
  }
  const part = due[j] > due[i] ? clamp((clock - due[i]) / (due[j] - due[i]), 0, 1) : 0;
  return table.from + (i + part) * table.step;
}

// To a stop along the walk: ease down out of the view as it stands, cruise
// low along the line, ease up into the stop's own view. A short hop does not
// come all the way down; there is no time to, and diving for a hundred
// meters only to climb again is all lurch.
function travel(to, forward) {
  let d0 = here();
  let d1 = stops[to].at[3];
  // The first stop is also the last: it closes the loop.
  if (forward && d1 <= d0) d1 = loop();
  if (!forward && d0 <= d1) d0 = loop();
  const from = Object.assign({}, view);
  const still = stopView(to);
  const table = timetable(d0, d1, false);
  const dive = clamp(Math.abs(d1 - d0) / 450, 0.15, 1);
  flight = {
    ms: Math.max(table.seconds, 2.8) * 1000,
    at: function (t) {
      walked = reached(table, t * table.seconds);
      const low = cruise(walked, forward);
      const joined = ramp(0, 0.3, t);
      const leaving = ramp(0.7, 1, t);
      const level = between(from, still, ease(t));
      const v = between(level, low, dive * joined * (1 - leaving));
      // On the line in between; at each end, where that end's view looks.
      for (const axis of ['x', 'y', 'z'])
        v[axis] = mix(mix(from[axis], low[axis], joined), still[axis], leaving);
      // The head turns toward the way ahead, and back, more slowly than the
      // rest, and never by more than a glance over the shoulder: it is the
      // turning that is felt.
      const ahead = dive * ramp(0, 0.45, t) * (1 - ramp(0.55, 1, t));
      v.heading = level.heading + clamp(swing(level.heading, low.heading), -75, 75) * ahead;
      return v;
    },
  };
  flight.start = performance.now();
  redraw();
}

// The whole walk in one flight: down onto the line from wherever the view
// is, round the loop without a halt, and up into the first stop's view at
// the end. Each stop is marked as it comes up.
function tour() {
  const from = Object.assign({}, view);
  const end = stopView(0);
  const table = timetable(here(), loop(), true);
  flight = {
    ms: table.seconds * 1000,
    at: function (t) {
      const clock = t * table.seconds;
      walked = reached(table, clock);
      approach();
      const low = between(from, cruise(walked, true), ramp(0, 2.4, clock));
      return between(low, end, ramp(table.seconds - 2.8, table.seconds, clock));
    },
  };
  flight.start = performance.now();
  redraw();
}

// The stop the fly-by is coming up to or has just passed.
function approach() {
  let n = 0;
  for (let i = 0; i < stops.length; i++) if (walked >= stops[i].at[3] - 70) n = i;
  if (walked >= loop() - 70) n = 0;
  if (n !== current) mark(n);
}

function land() {
  flight = null;
}

// ---- stops -------------------------------------------------------------

// Make a stop the current one on the page: its pin, its place in the list,
// the caption, and the address.
function mark(n) {
  current = n;
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
  measure();
}

// Go to a stop: at once, along the path from its neighbor, or through the air.
function show(n, how) {
  const walking = current >= 0 && (how === 'next' || how === 'back');
  mark(((n % stops.length) + stops.length) % stops.length);
  if (how === 'jump') {
    walked = stops[current].at[3];
    view = stopView(current);
    land();
    redraw();
  } else if (walking) {
    travel(current, how === 'next');
  } else {
    walked = stops[current].at[3];
    fly(stopView(current), 2200);
  }
}

// Fly the whole walk, or stop where it has got to.
function play(on) {
  playing = on;
  const button = stage.querySelector('[data-play]');
  button.setAttribute('aria-pressed', String(on));
  // Its picture changes with aria-pressed, in the page's CSS; its name, here.
  button.setAttribute('aria-label', on ? 'Pause' : 'Fly the walk');
  if (on) tour();
  else land();
}

// Anything the reader does by hand ends whatever the camera was doing.
function takeOver() {
  if (playing) play(false);
  land();
  coast = null;
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
      if (playing) play(false);
    }
  }
  if (coast) carryOn(now);
  view.x = clamp(view.x, 0, model.size[0]);
  view.y = clamp(view.y, 0, model.size[1]);
  look.walked = walked;
  draw.frame(view, look);
  const far = view.span / canvas.clientHeight > 7;
  stage.classList.toggle('is-far', far);
  placeNames(placePins(far).concat(fixtures));
  needle.style.rotate = -view.heading + 'deg';
  if (!stage.classList.contains('is-live')) stage.classList.add('is-live');
}

// Put each pin over its stop. Where stops are so close that their pins would
// cover one another (the Tate, the Millennium Bridge and the Globe are a
// minute apart), the pins are eased apart until every number can be read.
function placePins(far) {
  const seen = [];
  for (const stop of stops) {
    const p = draw.screen([stop.at[0], stop.at[1], stop.at[2] + 2]);
    const inside =
      p.ahead &&
      p.x > -20 &&
      p.y > -20 &&
      p.x < canvas.clientWidth + 20 &&
      p.y < canvas.clientHeight + 20;
    stop.pin.style.visibility = inside ? 'visible' : 'hidden';
    if (inside) seen.push({ pin: stop.pin, x: p.x, y: p.y });
  }
  const room = pinSize * (far ? 0.72 : 1) + 3;
  for (let pass = 0; pass < 4; pass++)
    for (let i = 0; i < seen.length; i++)
      for (let j = i + 1; j < seen.length; j++) {
        const a = seen[i];
        const b = seen[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const gap = Math.hypot(dx, dy) || 0.01;
        if (gap >= room) continue;
        // Each gives up half of what they are short of.
        const push = (room - gap) / 2 / gap;
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
      }
  for (const p of seen) p.pin.style.translate = p.x.toFixed(1) + 'px ' + p.y.toFixed(1) + 'px';
  // The room the pins take, for the names to keep out of.
  return seen.map((p) => [p.x - room / 2, p.y - room / 2, p.x + room / 2, p.y + room / 2]);
}

// ---- names -------------------------------------------------------------
//
// The landmarks near where the camera is looking are named, over their
// roofs, a few at a time: they come up as a flight approaches and go as it
// passes. A tall one counts as near from further off, as it does on foot.
// From far away nothing is named; sixty names will not fit on the whole board.

// What only changes when the page does: how big a pin is, and where the
// toolbar and the caption are. Read here, not in every frame.
function measure() {
  pinSize = stops[0].pin.offsetWidth;
  fixtures = [];
  for (const el of stage.querySelectorAll('.tools, .caption')) {
    if (el.hidden) continue;
    fixtures.push([
      el.offsetLeft - 6,
      el.offsetTop - 6,
      el.offsetLeft + el.offsetWidth + 6,
      el.offsetTop + el.offsetHeight + 6,
    ]);
  }
}

function nameLandmarks() {
  const before = stage.querySelector('.pin');
  for (const place of model.places) {
    const el = document.createElement('span');
    el.className = 'place';
    el.textContent = place.name;
    // The stops and their captions say this in words that stay put.
    el.setAttribute('aria-hidden', 'true');
    stage.insertBefore(el, before);
    names.push({ el: el, at: place.at, shown: false });
  }
  for (const name of names) {
    name.wide = name.el.offsetWidth;
    name.tall = name.el.offsetHeight;
  }
}

function placeNames(taken) {
  // Near is a matter of how much is in view: more when standing back, and
  // more again through the short lens, which sees a long way down the path.
  const flying = clamp((view.lens - LONG) / (SHORT - LONG), 0, 1);
  const within = clamp(view.span * 0.85, 210, 380) + 300 * flying;
  const near = [];
  if (view.span < 1100)
    for (const name of names) {
      const far = Math.hypot(name.at[0] - view.x, name.at[1] - view.y);
      if (far > within + name.at[2] * 2.2) continue;
      let p = draw.screen([name.at[0], name.at[1], name.at[2] + 4]);
      // A tower's top is often out of the picture from close by. Its name
      // then goes lower down it, at the height where it comes into view.
      const least = name.tall + 8;
      if (p.ahead && p.y < least) {
        const foot = draw.screen([name.at[0], name.at[1], 0]);
        if (foot.ahead && foot.y > least) {
          const down = (least - p.y) / (foot.y - p.y);
          p = { ahead: true, x: mix(p.x, foot.x, down), y: least };
        }
      }
      // All of the name has to be in the picture; half a name is worse than none.
      const inside =
        p.ahead &&
        p.x > name.wide / 2 + 6 &&
        p.x < canvas.clientWidth - name.wide / 2 - 6 &&
        p.y > name.tall + 6 &&
        p.y < canvas.clientHeight;
      // One already showing keeps its place against a newcomer a little
      // nearer, or two names would trade places all the way down a street.
      if (inside) near.push({ name: name, x: p.x, y: p.y, rank: far - (name.shown ? 80 : 0) });
    }
  near.sort((a, b) => a.rank - b.rank);
  const showing = new Map();
  for (const n of near) {
    if (showing.size === 8) break;
    const box = [
      n.x - n.name.wide / 2 - 4,
      n.y - n.name.tall - 2,
      n.x + n.name.wide / 2 + 4,
      n.y + 2,
    ];
    const clear = taken.every(
      (t) => box[2] < t[0] || box[0] > t[2] || box[3] < t[1] || box[1] > t[3]
    );
    if (!clear) continue;
    taken.push(box);
    showing.set(n.name, n);
  }
  for (const name of names) {
    const at = showing.get(name);
    if (name.shown !== !!at) name.el.classList.toggle('is-near', !!at);
    name.shown = !!at;
    if (at)
      name.el.style.translate =
        (at.x - name.wide / 2).toFixed(1) + 'px ' + (at.y - name.tall).toFixed(1) + 'px';
  }
}

// ---- hands -------------------------------------------------------------
//
// The same hands as the Greenage map. A drag turns and tips the model; the
// right button, or a drag with Shift, Command, Control or Option held, moves
// it across the ground; the wheel zooms to the pointer. On a touchscreen one
// finger turns and two move and zoom. Let go mid-move and the model carries
// on a little and eases to rest.

const fingers = new Map();
let drift = null; // how fast the hand was moving the model when it let go
let coast = null; // the model still moving after it

function spot(e) {
  const box = canvas.getBoundingClientRect();
  return { x: e.clientX - box.left, y: e.clientY - box.top, at: e.timeStamp };
}

// A full turn for a drag as long as the picture is tall.
function turn(dx, dy) {
  const degrees = 360 / canvas.clientHeight;
  view.heading += dx * degrees;
  view.pitch = clamp(view.pitch + dy * degrees, 20, 82);
}

// Move the model so the ground that was under one point is under another.
function slide(from, to) {
  draw.place(view);
  const a = draw.ground(from.x, from.y, view);
  const b = draw.ground(to.x, to.y, view);
  if (!a || !b) return;
  view.x += a[0] - b[0];
  view.y += a[1] - b[1];
}

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

// What a moment of dragging did to the view, as a rate: the model keeps
// that up for a little while once the hand is gone. One mouse event is a
// jumpy measure of speed, so each is averaged with the one before, and a
// wild flick is held to a third of a turn and half a screen of travel.
function rate(before, ms, last) {
  const now = {
    heading: swing(before.heading, view.heading) / ms,
    pitch: (view.pitch - before.pitch) / ms,
    x: (view.x - before.x) / ms,
    y: (view.y - before.y) / ms,
    at: performance.now(),
  };
  const most = { heading: 0.6, pitch: 0.2, x: view.span / 400, y: view.span / 400 };
  for (const key of ['heading', 'pitch', 'x', 'y']) {
    if (last) now[key] = mix(last[key], now[key], 0.6);
    now[key] = clamp(now[key], -most[key], most[key]);
  }
  return now;
}

canvas.addEventListener('pointerdown', function (e) {
  takeOver();
  canvas.setPointerCapture(e.pointerId);
  const p = spot(e);
  p.moving = e.button === 2 || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey;
  fingers.set(e.pointerId, p);
  drift = null;
});

canvas.addEventListener('pointermove', function (e) {
  const was = fingers.get(e.pointerId);
  if (!was || !view) return;
  const now = spot(e);
  now.moving = was.moving;
  const before = Object.assign({}, view);
  if (fingers.size === 1) {
    if (was.moving) slide(was, now);
    else turn(now.x - was.x, now.y - was.y);
    drift = rate(before, Math.max(now.at - was.at, 8), drift);
  } else {
    // Two fingers hold the ground between them: it follows the point halfway,
    // and the gap between the fingers is the zoom.
    let other;
    for (const [id, p] of fingers) if (id !== e.pointerId) other = p;
    const gapWas = Math.hypot(was.x - other.x, was.y - other.y);
    const gapNow = Math.hypot(now.x - other.x, now.y - other.y);
    const midWas = { x: (was.x + other.x) / 2, y: (was.y + other.y) / 2 };
    const midNow = { x: (now.x + other.x) / 2, y: (now.y + other.y) / 2 };
    if (gapWas > 10 && gapNow > 10) zoom(gapWas / gapNow, midWas.x, midWas.y);
    slide(midWas, midNow);
    drift = null;
  }
  fingers.set(e.pointerId, now);
  redraw();
});

for (const type of ['pointerup', 'pointercancel'])
  canvas.addEventListener(type, function (e) {
    fingers.delete(e.pointerId);
    // Carry on only from a hand that was still moving when it let go, and
    // not for a reader who has asked for less motion.
    if (fingers.size || !drift || calm.matches || performance.now() - drift.at > 80) return;
    coast = drift;
    redraw();
  });

// One frame of carrying on: the rate applied, then eased toward nothing, a
// fifth of a second to lose most of it.
function carryOn(now) {
  const ms = Math.min(now - coast.at, 50);
  coast.at = now;
  view.heading += coast.heading * ms;
  view.pitch = clamp(view.pitch + coast.pitch * ms, 20, 82);
  view.x += coast.x * ms;
  view.y += coast.y * ms;
  const fade = Math.exp(-ms / 200);
  for (const key of ['heading', 'pitch', 'x', 'y']) coast[key] *= fade;
  const moving =
    Math.hypot(coast.heading, coast.pitch) * 1000 +
    (Math.hypot(coast.x, coast.y) / view.span) * 1e5;
  if (moving < 1) coast = null;
  else redraw();
}

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

// ---- buttons and keys --------------------------------------------------

// Next and Previous. Part way along a leg, Previous is the stop just passed.
function step(by) {
  if (current < 0) return show(0);
  const passed = by < 0 && here() - stops[current].at[3] > 30;
  show(passed ? current : current + by, by > 0 ? 'next' : 'back');
}

// A small change to the view where it stands: closer, further, or facing north.
function nudge(change) {
  fly(Object.assign({}, view, change), 450);
}

const closer = () => nudge({ span: clamp(view.span / 2, 90, 7000) });
const further = () => nudge({ span: clamp(view.span * 2, 90, 7000) });

document.addEventListener('click', function (e) {
  if (!view) return;
  const button = e.target.closest('button');
  if (button && stage.contains(button)) {
    if ('play' in button.dataset) return play(!playing);
    takeOver();
    if (button.dataset.step) return step(Number(button.dataset.step));
    if ('north' in button.dataset) return nudge({ heading: 0 });
    if ('whole' in button.dataset) return fly(overview(), 1400);
    if ('closer' in button.dataset) return closer();
    if ('further' in button.dataset) return further();
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

const KEYS = {
  ArrowRight: () => step(1),
  ArrowLeft: () => step(-1),
  '+': closer,
  '=': closer,
  '-': further,
  0: () => fly(overview(), 1400),
};

document.addEventListener('keydown', function (e) {
  if (!view || e.metaKey || e.ctrlKey || e.altKey || !KEYS[e.key]) return;
  e.preventDefault();
  takeOver();
  KEYS[e.key]();
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
  drawLine();
  nameLandmarks();
  readLook();
  view = overview();
  stage.querySelector('.tools').hidden = false;

  // A link to a stop opens on that stop. The browser has already scrolled to
  // its place in the list, which on a phone is below the model; come back up.
  const named = document.getElementById(location.hash.slice(1));
  if (named && named.dataset.stop) {
    show(Number(named.dataset.stop) - 1, 'jump');
    stage.scrollIntoView({ block: 'nearest' });
  }
  redraw();

  new ResizeObserver(function () {
    measure();
    redraw();
  }).observe(canvas);
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

// This is the kept copy of the tinted model; it shares the live page's data.
fetch(new URL('../city.json', import.meta.url))
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
