// dubai-marina-city.mjs — make misc/dubai-marina/city.json from OpenStreetMap.
//
//   node scripts/dubai-marina-city.mjs <cache-dir>
//
// The map comes from the Overpass API, fetched once into <cache-dir> and read
// from there on every later run, so remaking the model never asks the server
// twice. Delete the cache to take a fresh copy of the map. The request names
// no person: a generic user agent only.
//
// The layout written is the one misc/dubai-marina/city.js reads, and the
// comment at the top of that file is its key. In short: positions across the
// ground in decimeters from the south-west corner, heights in centimeters,
// and every coordinate the difference from the one before it in its layer.
// How the model was made, and what is guessed, is in _docs/misc.md.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import earcut from 'earcut';

const cache = process.argv[2];
if (!cache) {
  console.error('usage: node scripts/dubai-marina-city.mjs <cache-dir>');
  process.exit(1);
}
const OUT = new URL('../misc/dubai-marina/city.json', import.meta.url);

// ---- the board -----------------------------------------------------------
//
// From Bluewaters in the west to Jumeirah Lakes Towers in the east, and from
// the Marina's mouth on the beach to Dubai Harbour in the north: the whole
// canal, both its banks, and JBR between it and the sea.

const BOX = { south: 25.06, west: 55.112, north: 25.097, east: 55.156 };
const MID = (BOX.south + BOX.north) / 2;
const METER_LAT = 111320;
const METER_LON = 111320 * Math.cos((MID * Math.PI) / 180);
const WIDTH = (BOX.east - BOX.west) * METER_LON;
const HEIGHT = (BOX.north - BOX.south) * METER_LAT;

// The canal lies a meter and a half below the promenade.
const WATER = -150;

function project(lat, lon) {
  return [(lon - BOX.west) * METER_LON, (lat - BOX.south) * METER_LAT];
}

// ---- the map, fetched once -------------------------------------------------

const AREA = `${BOX.south},${BOX.west},${BOX.north},${BOX.east}`;
const QUERIES = {
  'osm.json': `[out:json][timeout:180];(
    way["building"](${AREA});relation["building"](${AREA});
    way["building:part"](${AREA});relation["building:part"](${AREA});
    way["natural"="water"](${AREA});relation["natural"="water"](${AREA});
    way["leisure"~"park|garden|pitch|playground|golf_course|dog_park"](${AREA});
    relation["leisure"~"park|garden"](${AREA});
    way["landuse"~"grass|recreation_ground|village_green"](${AREA});
    way["natural"~"grassland|scrub"](${AREA});
    way["highway"](${AREA});way["area:highway"](${AREA});way["place"="square"](${AREA});
    way["railway"](${AREA});way["man_made"~"pier|breakwater"](${AREA});
    node["natural"="tree"](${AREA});way["natural"="tree_row"](${AREA});
  );out geom;`,
  // The coastline from further out, so that every line that crosses the
  // board is whole, and the Marina's own outline whole too.
  'coast.json': `[out:json][timeout:120];(
    way["natural"="coastline"](25.03,55.08,25.13,55.19);
  );out geom;`,
};

async function load(name) {
  const file = join(cache, name);
  if (!existsSync(file)) {
    console.log('fetching', name);
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'user-agent': 'brajeshwar.com-misc/1.0' },
      body: new URLSearchParams({ data: QUERIES[name] }),
    });
    const text = await response.text();
    if (!text.startsWith('{')) throw new Error(`Overpass said: ${text.slice(0, 200)}`);
    writeFileSync(file, text);
  }
  return JSON.parse(readFileSync(file, 'utf8')).elements;
}

const map = await load('osm.json');
const coast = await load('coast.json');

// ---- geometry ----------------------------------------------------------------

function points(geometry) {
  return geometry.map((p) => project(p.lat, p.lon));
}

function area(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [ax, ay] = ring[i];
    const [bx, by] = ring[(i + 1) % ring.length];
    sum += ax * by - bx * ay;
  }
  return sum / 2;
}

// A ring as the reader wants it: no closing repeat, and turning the way asked
// (counterclockwise for an outline, clockwise for a hole).
function tidy(ring, clockwise) {
  const out = [];
  for (const p of ring) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.05) out.push(p);
  }
  if (out.length > 1 && Math.hypot(out[0][0] - out.at(-1)[0], out[0][1] - out.at(-1)[1]) < 0.05)
    out.pop();
  if (out.length < 3) return null;
  if (area(out) < 0 !== clockwise) out.reverse();
  return out;
}

// Cut a polygon to the board (Sutherland-Hodgman: one edge of the board at a time).
function clip(ring) {
  const edges = [(p) => p[0] >= 0, (p) => p[0] <= WIDTH, (p) => p[1] >= 0, (p) => p[1] <= HEIGHT];
  const cross = [
    (a, b) => lerp(a, b, (0 - a[0]) / (b[0] - a[0])),
    (a, b) => lerp(a, b, (WIDTH - a[0]) / (b[0] - a[0])),
    (a, b) => lerp(a, b, (0 - a[1]) / (b[1] - a[1])),
    (a, b) => lerp(a, b, (HEIGHT - a[1]) / (b[1] - a[1])),
  ];
  let out = ring;
  for (let e = 0; e < 4 && out.length; e++) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const a = input[(i + input.length - 1) % input.length];
      const b = input[i];
      if (edges[e](b)) {
        if (!edges[e](a)) out.push(cross[e](a, b));
        out.push(b);
      } else if (edges[e](a)) out.push(cross[e](a, b));
    }
  }
  return out;
}

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function inside(p, ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[i];
    const [bx, by] = ring[j];
    if (ay > p[1] !== by > p[1] && p[0] < ((bx - ax) * (p[1] - ay)) / (by - ay) + ax) hit = !hit;
  }
  return hit;
}

function centroid(ring) {
  let x = 0;
  let y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

// Join the pieces of an outline into whole rings, end to end.
function stitch(lines) {
  const key = (p) => p.lat.toFixed(7) + ',' + p.lon.toFixed(7);
  const left = lines.map((l) => l.slice());
  const rings = [];
  while (left.length) {
    let ring = left.shift();
    for (let joined = true; joined;) {
      joined = false;
      for (let i = 0; i < left.length; i++) {
        const l = left[i];
        if (key(l[0]) === key(ring.at(-1))) ring = ring.concat(l.slice(1));
        else if (key(l.at(-1)) === key(ring[0])) ring = l.concat(ring.slice(1));
        else if (key(l.at(-1)) === key(ring.at(-1)))
          ring = ring.concat(l.slice().reverse().slice(1));
        else if (key(l[0]) === key(ring[0])) ring = l.slice().reverse().concat(ring.slice(1));
        else continue;
        left.splice(i, 1);
        joined = true;
        break;
      }
    }
    rings.push(ring);
  }
  return rings;
}

// The outlines of a way or a multipolygon: [[outer, ...holes], ...], projected.
function shapes(element) {
  if (element.type === 'way') {
    if (!element.geometry) return [];
    const outer = tidy(points(element.geometry), false);
    return outer ? [[outer]] : [];
  }
  const members = (element.members || []).filter((m) => m.type === 'way' && m.geometry);
  const outers = stitch(members.filter((m) => m.role !== 'inner').map((m) => m.geometry))
    .map((g) => tidy(points(g), false))
    .filter(Boolean);
  const inners = stitch(members.filter((m) => m.role === 'inner').map((m) => m.geometry))
    .map((g) => tidy(points(g), true))
    .filter(Boolean);
  return outers.map((outer) => [outer, ...inners.filter((h) => inside(h[0], outer))]);
}

// A polygon cut to the board, or null if none of it is on it.
function onBoard(shape) {
  const outer = tidy(clip(shape[0]), false);
  if (!outer || Math.abs(area(outer)) < 1) return null;
  const holes = shape
    .slice(1)
    .map((h) => tidy(clip(h), true))
    .filter((h) => h && inside(h[0], outer));
  return [outer, ...holes];
}

// A line as a row of thin quads, for what the map draws as a line: a pier, a
// bridge's deck.
function band(line, half) {
  const quads = [];
  for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1];
    const [bx, by] = line[i];
    const length = Math.hypot(bx - ax, by - ay);
    if (length < 0.3) continue;
    const nx = (-(by - ay) / length) * half;
    const ny = ((bx - ax) / length) * half;
    const ex = ((bx - ax) / length) * half * 0.5;
    const ey = ((by - ay) / length) * half * 0.5;
    // Cut to the board: a corner past its edge would wrap round in the
    // reader's unsigned numbers and draw a sliver across the whole model.
    const quad = onBoard([
      [
        [ax - ex - nx, ay - ey - ny],
        [bx + ex - nx, by + ey - ny],
        [bx + ex + nx, by + ey + ny],
        [ax - ex + nx, ay - ey + ny],
      ],
    ]);
    if (quad) quads.push(quad);
  }
  return quads;
}

// ---- writing layers ------------------------------------------------------------

const dm = (m) => Math.round(m * 10);

function Layer(extra) {
  const layer = { parts: [], rings: [], xy: [], nt: [], tris: [] };
  for (const name of extra || []) layer[name] = [];
  layer.at = [0, 0];
  return layer;
}

// Add one polygon (an outline and its holes); returns false if it would not triangulate.
function add(layer, shape) {
  const rings = shape.map((ring) => ring.map((p) => [dm(p[0]), dm(p[1])]));
  const flat = [];
  const holes = [];
  for (const ring of rings) {
    if (flat.length) holes.push(flat.length / 2);
    for (const p of ring) flat.push(p[0], p[1]);
  }
  const triangles = earcut(flat, holes);
  if (!triangles.length) return false;
  layer.parts.push(rings.length);
  for (const ring of rings) {
    layer.rings.push(ring.length);
    for (const p of ring) {
      layer.xy.push(p[0] - layer.at[0], p[1] - layer.at[1]);
      layer.at = p;
    }
  }
  layer.nt.push(triangles.length / 3);
  for (const t of triangles) layer.tris.push(t);
  return true;
}

function done(layer) {
  delete layer.at;
  return layer;
}

// Five bits a channel, in one whole number.
function pack(rgb) {
  return ((rgb[0] >> 3) << 10) | ((rgb[1] >> 3) << 5) | (rgb[2] >> 3);
}

const NAMED = {
  black: [30, 30, 30],
  white: [240, 240, 236],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  beige: [222, 205, 170],
  tan: [210, 180, 140],
  brown: [150, 110, 80],
  blue: [90, 120, 170],
  lightblue: [160, 190, 215],
  green: [110, 150, 110],
  yellow: [220, 200, 110],
  red: [170, 70, 60],
  orange: [215, 140, 70],
  cream: [238, 228, 200],
  sand: [214, 196, 160],
};

function colour(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16));
  if (/^#[0-9a-f]{3}$/.test(v)) return [1, 2, 3].map((i) => parseInt(v[i] + v[i], 16));
  return NAMED[v.replace(/[\s_-]/g, '')] || null;
}

function meters(value) {
  if (value == null) return null;
  const m = String(value).match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return /ft|'/.test(value) ? n * 0.3048 : n;
}

// ---- the ground: land over one sheet of water ---------------------------------
//
// The water is a single sheet under the whole board, at the canal's level,
// and the land stands up over it. So nothing has to be cut out of anything:
// where there is no land, the sea and the Marina show. The land is the
// mainland, closed off far to the south-east of the coastline that bounds it,
// and the islands the coastline draws whole, JBR among them; each is cut to
// the board. Lakes inland are holes in it.

const lands = [];
for (const line of stitch(
  coast.filter((w) => w.tags && w.tags.natural === 'coastline' && w.geometry).map((w) => w.geometry)
)) {
  const ring = points(line);
  const closed = Math.hypot(ring[0][0] - ring.at(-1)[0], ring[0][1] - ring.at(-1)[1]) < 1;
  if (closed) {
    // A coastline keeps the land on its left: a ring that turns
    // counterclockwise is an island; one that turns the other way is a
    // lagoon in the land, which the lakes below take care of.
    const island = tidy(ring, false);
    if (island && area(ring) > 0) lands.push([island]);
    continue;
  }
  // An open line crosses the board: close it round the land side, far off.
  // Walking it, land is on the left, so the far point is to the left of its
  // middle, a hundred kilometers out.
  const a = ring[0];
  const b = ring.at(-1);
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const far = [
    (a[0] + b[0]) / 2 - ((b[1] - a[1]) / length) * 1e5,
    (a[1] + b[1]) / 2 + ((b[0] - a[0]) / length) * 1e5,
  ];
  const main = tidy(ring.concat([far]), false);
  if (main) lands.push([main]);
}

const lakes = map
  .filter((e) => e.tags && e.tags.natural === 'water' && e.tags.water !== 'fountain')
  .flatMap(shapes)
  .map((s) => s[0]);

const land = Layer();
let landCount = 0;
for (const shape of lands) {
  const cut = onBoard(shape);
  if (!cut) continue;
  // Only a lake wholly on this piece of land is a hole in it; the Marina
  // itself is sea, between the coastlines.
  const holes = lakes
    .map((l) => tidy(clip(l), true))
    .filter((h) => h && Math.abs(area(h)) > 20 && h.every((p) => inside(p, cut[0])));
  if (add(land, [cut[0], ...holes])) landCount++;
}

const sea = Layer();
add(sea, [
  [
    [0, 0],
    [WIDTH, 0],
    [WIDTH, HEIGHT],
    [0, HEIGHT],
  ],
]);

// ---- parks and squares ------------------------------------------------------------

function flatLayer(test) {
  const layer = Layer();
  for (const e of map) {
    if (!e.tags || !test(e.tags)) continue;
    for (const shape of shapes(e)) {
      const cut = onBoard(shape);
      if (cut && Math.abs(area(cut[0])) > 4) add(layer, cut);
    }
  }
  return done(layer);
}

const green = flatLayer(
  (t) =>
    /^(park|garden|pitch|playground|golf_course|dog_park)$/.test(t.leisure) ||
    /^(grass|recreation_ground|village_green)$/.test(t.landuse) ||
    /^(grassland|scrub)$/.test(t.natural)
);
const squares = flatLayer(
  (t) =>
    (t.highway === 'pedestrian' && t.area === 'yes') ||
    t['area:highway'] === 'pedestrian' ||
    t['area:highway'] === 'footway' ||
    t.place === 'square'
);

// ---- buildings ---------------------------------------------------------------
//
// A height is the map's `height` where it has one; else its floors at 3.4 m
// each, with a little more for the roof; else a guess by kind and size. A
// `min_height` lifts a part off the ground, as for a canopy or a skybridge.
// A building drawn in parts is drawn as its parts, its outline only where
// they leave most of it uncovered, and then no higher than its lowest part.

const all = map.filter((e) => e.tags && (e.tags.building || e.tags['building:part']));
const parts = all.filter((e) => e.tags['building:part'] && !e.tags.building);
const partShapes = parts.flatMap((e) => shapes(e).map((s) => ({ e, s })));

let measured = 0;
let counted = 0;
let guessed = 0;

function heightOf(tags, footprint) {
  const h = meters(tags.height) || meters(tags['building:height']);
  if (h) {
    measured++;
    return h;
  }
  const levels = parseFloat(tags['building:levels']);
  if (levels > 0) {
    counted++;
    return levels * 3.4 + (levels > 3 ? 2 : 0.5);
  }
  guessed++;
  const kind = tags.building || '';
  if (/roof|carport|canopy/.test(kind)) return 4;
  if (/house|villa|detached|semidetached|terrace|garage|shed|hut|kiosk/.test(kind)) return 7;
  if (/hotel|apartments|residential|office|commercial/.test(kind) && footprint > 900) return 40;
  return footprint > 4000 ? 14 : 10;
}

// Dubai's colors where the map has none: glass for the towers, the sand and
// cream of the older blocks for the rest, a little different each.
function wallColorOf(tags, height, seed) {
  const named = colour(tags['building:colour']);
  if (named) return named;
  const material = tags['building:material'] || '';
  if (/glass/.test(material) || height > 90) {
    const t = seed % 3;
    return [
      [118, 140, 158],
      [132, 150, 160],
      [104, 124, 142],
    ][t];
  }
  if (/concrete/.test(material)) return [190, 186, 178];
  const t = seed % 4;
  return [
    [222, 204, 170],
    [214, 196, 160],
    [230, 218, 192],
    [205, 186, 150],
  ][t];
}

function roofColorOf(tags) {
  return colour(tags['roof:colour']) || [196, 192, 184];
}

const blocks = Layer(['base', 'top', 'wall', 'roof', 'wallColor', 'roofColor']);
const tall = [];
let seed = 0;

function addBlock(tags, shape, low) {
  const cut = onBoard(shape);
  if (!cut) return;
  const footprint = Math.abs(area(cut[0]));
  if (footprint < 2) return;
  let top = heightOf(tags, footprint);
  if (low != null) top = Math.min(top, low);
  const base = Math.max(0, meters(tags.min_height) || 0);
  if (top - base < 0.5) return;
  seed++;
  const glass = top > 90 || /glass/.test(tags['building:material'] || '');
  if (!add(blocks, cut)) return;
  blocks.base.push(Math.round(base * 100));
  blocks.top.push(Math.round(top * 100));
  blocks.wall.push(8);
  blocks.roof.push(9 + (glass ? 16 : 0));
  blocks.wallColor.push(pack(wallColorOf(tags, top, seed)));
  blocks.roofColor.push(pack(roofColorOf(tags)));
  const name = tags['name:en'] || tags.name;
  if (name && top > 120 && /^[\x20-\x7e’]+$/.test(name)) {
    const [x, y] = centroid(cut[0]);
    tall.push({ name, x, y, top });
  }
}

for (const e of all) {
  if (!e.tags.building || e.tags.attraction === 'big_wheel') continue;
  for (const shape of shapes(e)) {
    // Its parts: those standing within its outline.
    const mine = partShapes.filter(({ s }) => inside(centroid(s[0]), shape[0]));
    if (mine.length) {
      const covered = mine.reduce((sum, { s }) => sum + Math.abs(area(s[0])), 0);
      if (covered > Math.abs(area(shape[0])) * 0.6) continue;
      const lowest = Math.min(...mine.map(({ e: p, s }) => heightOf(p.tags, Math.abs(area(s[0])))));
      addBlock(e.tags, shape, lowest);
    } else addBlock(e.tags, shape);
  }
}
for (const { e, s } of partShapes) addBlock(e.tags, s);

// ---- roads, paths, and the tram --------------------------------------------------
//
// Classes as city.js draws them: 0 main road, 1 street, 2 square, 3 service
// road, 4 footpath, 5 railway. A bridge is lifted, by its layer, and gets a
// deck and legs under it so that it stands and casts a shadow.

function roadClass(t) {
  if (t.railway === 'tram' || t.railway === 'light_rail' || t.railway === 'subway') return 5;
  const h = t.highway;
  if (!h || t.area === 'yes') return null;
  if (/^(motorway|trunk|primary)(_link)?$/.test(h)) return 0;
  if (/^(secondary|tertiary|residential|unclassified|living_street)(_link)?$/.test(h)) return 1;
  if (h === 'service') return 3;
  if (/^(footway|pedestrian|path|steps|cycleway|track)$/.test(h)) return 4;
  return null;
}

const DECK_HALF = [6.5, 4, 3, 2, 1.6, 4.5];

function lift(t) {
  if (!t.bridge || t.bridge === 'no') return 0;
  const layer = parseInt(t.layer, 10) || 1;
  if (t.railway === 'subway') return 1200;
  return Math.max(1, layer) * 550;
}

// Cut a line to the board: the runs of it that are on it, kept fifteen
// meters in from the edge, since city.js draws a road a little wider and
// longer than its line and nothing may reach past the board.
function runs(line) {
  const out = [];
  let run = [];
  const on = (p) => p[0] >= 15 && p[0] <= WIDTH - 15 && p[1] >= 15 && p[1] <= HEIGHT - 15;
  for (const p of line) {
    if (on(p)) run.push(p);
    else {
      if (run.length > 1) out.push(run);
      run = [];
    }
  }
  if (run.length > 1) out.push(run);
  return out;
}

const roads = { cls: [], z: [], len: [], xy: [] };
let at = [0, 0];
const decks = Layer(['base', 'top', 'wallColor']);
const legs = Layer(['base', 'top']);
const lines = [];

for (const e of map) {
  if (e.type !== 'way' || !e.tags || !e.geometry) continue;
  const cls = roadClass(e.tags);
  if (cls == null || e.tags.tunnel === 'yes' || e.tags.covered === 'yes') continue;
  if (e.tags.railway && e.tags.railway !== 'tram' && !e.tags.bridge) continue;
  const z = lift(e.tags);
  for (const run of runs(points(e.geometry))) {
    const xy = run.map((p) => [dm(p[0]), dm(p[1])]);
    roads.cls.push(cls);
    roads.z.push(z);
    roads.len.push(xy.length);
    for (const p of xy) {
      roads.xy.push(p[0] - at[0], p[1] - at[1]);
      at = p;
    }
    lines.push({ cls, z, run, tags: e.tags, id: e.id });
    if (z) {
      for (const quad of band(run, DECK_HALF[cls])) {
        if (add(decks, quad)) {
          decks.base.push(z - 90);
          decks.top.push(z - 4);
          decks.wallColor.push(pack([206, 200, 188]));
        }
      }
      // Legs every forty meters along it.
      let walked = 0;
      for (let i = 1; i < run.length; i++) {
        const step = Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]);
        walked += step;
        if (walked < 40) continue;
        walked = 0;
        const [x, y] = run[i];
        const r = cls === 5 ? 1.2 : 0.8;
        if (
          add(legs, [
            [
              [x - r, y - r],
              [x + r, y - r],
              [x + r, y + r],
              [x - r, y + r],
            ],
          ])
        ) {
          legs.base.push(WATER);
          legs.top.push(z - 90);
        }
      }
    }
  }
}

// ---- Ain Dubai ---------------------------------------------------------------
//
// The map draws the wheel as a building, a thin outline 210 m tall, which
// would stand on Bluewaters as a wall. It is drawn instead as what it is: a
// rim of small blocks in the wheel's plane, and two legs from the ground to
// the hub. The plane is the outline's long side. The size is the wheel's
// own, 250 m to the top, not the map's.

const WHEEL = { top: 250, rim: 115, blocks: 72, splay: 42 };
for (const e of map) {
  if (!e.tags || e.tags.attraction !== 'big_wheel' || !e.geometry) continue;
  const outline = points(e.geometry);
  const [cx, cy] = centroid(outline);
  let along = [1, 0];
  let longest = 0;
  for (let i = 1; i < outline.length; i++) {
    const dx = outline[i][0] - outline[i - 1][0];
    const dy = outline[i][1] - outline[i - 1][1];
    const length = Math.hypot(dx, dy);
    if (length > longest) {
      longest = length;
      along = [dx / length, dy / length];
    }
  }
  const hub = WHEEL.top - WHEEL.rim;
  const block = (x, y, z, half, rise) => {
    const square = [
      [
        [x - half, y - half],
        [x + half, y - half],
        [x + half, y + half],
        [x - half, y + half],
      ],
    ];
    if (add(decks, square)) {
      decks.base.push(Math.round((z - rise) * 100));
      decks.top.push(Math.round((z + rise) * 100));
      decks.wallColor.push(pack([232, 232, 228]));
    }
  };
  for (let k = 0; k < WHEEL.blocks; k++) {
    const a = (k / WHEEL.blocks) * 2 * Math.PI;
    const off = Math.cos(a) * WHEEL.rim;
    block(cx + along[0] * off, cy + along[1] * off, hub + Math.sin(a) * WHEEL.rim, 2.2, 5.2);
  }
  // The legs, splayed in the wheel's plane, from the ground up to the hub.
  for (const side of [-1, 1])
    for (let z = 3; z < hub; z += 6) {
      const off = side * WHEEL.splay * (1 - z / hub);
      block(cx + along[0] * off, cy + along[1] * off, z, 2.6, 3.4);
    }
}

// ---- the jetties ---------------------------------------------------------------
//
// The Marina is lined with pontoons for the yachts, and the map has most of
// them, as outlines or as lines. They float just above the water.

const piers = Layer();
for (const e of map) {
  if (!e.tags || !/^(pier|breakwater)$/.test(e.tags.man_made)) continue;
  const closed =
    e.type === 'way' &&
    e.geometry &&
    e.geometry.length > 3 &&
    e.geometry[0].lat === e.geometry.at(-1).lat &&
    e.geometry[0].lon === e.geometry.at(-1).lon;
  if (closed || e.type === 'relation') {
    for (const shape of shapes(e)) {
      const cut = onBoard(shape);
      if (cut) add(piers, cut);
    }
  } else if (e.geometry) {
    const half = (meters(e.tags.width) || 2) / 2;
    for (const run of runs(points(e.geometry)))
      for (const quad of band(run, half)) add(piers, quad);
  }
}

// ---- trees ---------------------------------------------------------------------

const trees = [];
const spots = [];
for (const e of map) {
  if (!e.tags || e.tags.natural !== 'tree') continue;
  if (e.type === 'node') spots.push(project(e.lat, e.lon));
}
for (const e of map) {
  if (!e.tags || e.tags.natural !== 'tree_row' || !e.geometry) continue;
  const line = points(e.geometry);
  for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1];
    const [bx, by] = line[i];
    const n = Math.floor(Math.hypot(bx - ax, by - ay) / 9);
    for (let k = 0; k <= n; k++) spots.push(lerp(line[i - 1], line[i], n ? k / n : 0));
  }
}
at = [0, 0];
for (const p of spots) {
  if (p[0] < 0 || p[0] > WIDTH || p[1] < 0 || p[1] > HEIGHT) continue;
  const q = [dm(p[0]), dm(p[1])];
  trees.push(q[0] - at[0], q[1] - at[1]);
  at = q;
}

// ---- the walks -------------------------------------------------------------------
//
// Five loops, each the shortest way over the mapped footways through its
// stops in order, a footway costing a third of a street. The first is his
// own, in June 2026, its stops where his photographs were taken; the other
// four go where he did not, to the far end of the Marina, along its whole
// length, out to Bluewaters, and along the beach. Paths the map marks
// private, or closed to people on foot, are left out of the reckoning: a
// hotel's gardens are no way to walk. They stay on the map as they are, as
// does every other branch and loop.

const WALKS = [
  [
    'mine',
    ['the-beach', 25.07805, 55.13325],
    ['beach', 25.0744, 55.1282],
    ['marina-mouth', 25.0729, 55.1256],
    ['the-jewels', 25.07055, 55.1304],
    ['yacht-club', 25.0723, 55.1356],
    ['moorings', 25.0748, 55.1369],
    ['marina-mall', 25.0772, 55.1394],
    ['marina-walk', 25.0785, 55.14],
    ['the-bend', 25.08, 55.1406],
    ['bay-central', 25.0784, 55.1385],
    ['the-bridge', 25.0762, 55.1362],
    ['the-walk', 25.0779, 55.1354],
  ],
  [
    'far-end',
    ['far-mall', 25.0778, 55.14],
    ['far-diamonds', 25.0808, 55.144],
    ['far-loop', 25.0853, 55.1476],
    ['far-gate', 25.0864, 55.1467],
    ['far-cayan', 25.0881, 55.1456],
    ['far-mouth', 25.0873, 55.1429],
    ['far-terrace', 25.085, 55.1453],
    ['far-island', 25.08166, 55.1423],
  ],
  [
    'whole',
    ['whole-beach', 25.07805, 55.13325],
    ['whole-mouth', 25.0729, 55.1256],
    ['whole-jewels', 25.07055, 55.1304],
    ['whole-yacht', 25.0723, 55.1356],
    ['whole-mall', 25.0778, 55.14],
    ['whole-diamonds', 25.0808, 55.144],
    ['whole-loop', 25.0853, 55.1476],
    ['whole-cayan', 25.0881, 55.1456],
    ['whole-terrace', 25.085, 55.1453],
    ['whole-island', 25.08166, 55.1423],
    ['whole-bay', 25.0784, 55.1385],
    ['whole-bridge', 25.0762, 55.1362],
  ],
  [
    'bluewaters',
    ['blue-beach', 25.07805, 55.13325],
    ['blue-bridge', 25.0752, 55.1252],
    ['blue-wharf', 25.079, 55.124],
    ['blue-wheel', 25.0812, 55.1228],
    ['blue-caesars', 25.0815, 55.12],
  ],
  [
    'short',
    ['short-mall', 25.0778, 55.14],
    ['short-diamonds', 25.0808, 55.144],
    ['short-island', 25.08166, 55.1423],
    ['short-bay', 25.0784, 55.1385],
  ],
];

const COST = [4, 3, 1.2, 3, 1, 50];
const SHUT = /^(private|no)$/;
const nodes = new Map();
function node(p, z) {
  const k = dm(p[0]) + ',' + dm(p[1]) + ',' + z;
  if (!nodes.has(k)) nodes.set(k, { p, z, edges: [] });
  return nodes.get(k);
}
for (const l of lines) {
  if (l.cls === 5 || l.cls === 0) continue;
  if (SHUT.test(l.tags.access || '') || SHUT.test(l.tags.foot || '')) continue;
  const z = l.z;
  for (let i = 1; i < l.run.length; i++) {
    const a = node(l.run[i - 1], z);
    const b = node(l.run[i], z);
    const d = Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1]) * COST[l.cls];
    a.edges.push([b, d]);
    b.edges.push([a, d]);
  }
}
// A bridge's ends meet the ground at different heights in the map's keys;
// tie every node to any other within a meter and a half.
const grid = new Map();
for (const n of nodes.values()) {
  const k = Math.floor(n.p[0] / 2) + ',' + Math.floor(n.p[1] / 2);
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(n);
}
for (const n of nodes.values()) {
  const gx = Math.floor(n.p[0] / 2);
  const gy = Math.floor(n.p[1] / 2);
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (const m of grid.get(gx + dx + ',' + (gy + dy)) || []) {
        if (m === n) continue;
        const d = Math.hypot(m.p[0] - n.p[0], m.p[1] - n.p[1]);
        if (d < 1.5) n.edges.push([m, d + 0.5]);
      }
}

// The paths that join up with the rest: the largest piece of the network.
// A courtyard's paths that reach the street only through a gate are an
// island of their own, and a stop put there could never be walked to.
let joined = new Set();
const reached = new Set();
for (const n of nodes.values()) {
  if (reached.has(n)) continue;
  const piece = new Set([n]);
  const todo = [n];
  while (todo.length)
    for (const [m] of todo.pop().edges) if (!piece.has(m)) (piece.add(m), todo.push(m));
  for (const m of piece) reached.add(m);
  if (piece.size > joined.size) joined = piece;
}

// Only nodes on open footways that join up, so a stop is never put on a
// road or behind a gate.
const foot = new Set();
for (const l of lines)
  if (l.cls === 4 && !SHUT.test(l.tags.access || '') && !SHUT.test(l.tags.foot || ''))
    for (const p of l.run) if (joined.has(node(p, l.z))) foot.add(node(p, l.z));

function nearest(lat, lon) {
  const [x, y] = project(lat, lon);
  let best = null;
  let bestD = Infinity;
  for (const n of foot) {
    const d = Math.hypot(n.p[0] - x, n.p[1] - y);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return { node: best, off: bestD };
}

function shortest(from, to) {
  const dist = new Map([[from, 0]]);
  const prev = new Map();
  const queue = [[0, from]];
  const seen = new Set();
  while (queue.length) {
    let i = 0;
    for (let j = 1; j < queue.length; j++) if (queue[j][0] < queue[i][0]) i = j;
    const [d, n] = queue.splice(i, 1)[0];
    if (seen.has(n)) continue;
    seen.add(n);
    if (n === to) break;
    for (const [m, w] of n.edges) {
      const nd = d + w;
      if (nd < (dist.get(m) ?? Infinity)) {
        dist.set(m, nd);
        prev.set(m, n);
        queue.push([nd, m]);
      }
    }
  }
  if (!prev.has(to) && from !== to) throw new Error('no way between two stops');
  const path = [to];
  while (path[0] !== from) path.unshift(prev.get(path[0]));
  return path;
}

// One walk: round its stops and back to the first, as the route's points
// delta-coded in decimeters with their heights, and where each stop falls.
function walkOf([id, ...stops]) {
  const ends = stops.map(([name, lat, lon]) => {
    const found = nearest(lat, lon);
    if (found.off > 60) console.warn(`stop ${name} is ${Math.round(found.off)} m from a footway`);
    return found.node;
  });
  const walk = [ends[0]];
  const stopAt = [[stops[0][0], 0]];
  for (let i = 1; i <= stops.length; i++) {
    const leg = shortest(ends[i - 1], ends[i % stops.length]);
    for (const n of leg.slice(1)) walk.push(n);
    if (i < stops.length) stopAt.push([stops[i][0], walk.length - 1]);
  }
  const route = [];
  let last = [0, 0];
  let length = 0;
  for (let i = 0; i < walk.length; i++) {
    const q = [dm(walk[i].p[0]), dm(walk[i].p[1])];
    if (i) length += Math.hypot(walk[i].p[0] - walk[i - 1].p[0], walk[i].p[1] - walk[i - 1].p[1]);
    route.push(q[0] - last[0], q[1] - last[1], walk[i].z);
    last = q;
  }
  return { id, route, stops: stopAt, length };
}

const walks = WALKS.map(walkOf);

// ---- landmarks to name --------------------------------------------------------------

const LANDMARKS = [
  ['Ain Dubai', 25.07975, 55.1222, 25000],
  ['Bluewaters', 25.0805, 55.1192, 1200],
  ['The Beach', 25.07795, 55.1331, 1500],
  ['Marina Mall', 25.0765, 55.1406, 3500],
  ['Pier 7', 25.0779, 55.1389, 3000],
  ['Dubai Marina Yacht Club', 25.0734, 55.1376, 1500],
];
const places = [];
for (const [name, lat, lon, top] of LANDMARKS) {
  const [x, y] = project(lat, lon);
  places.push([name, dm(x), dm(y), top]);
}
tall.sort((a, b) => b.top - a.top);
const named = new Set(places.map((p) => p[0]));
for (const t of tall) {
  if (named.has(t.name) || places.length >= 40) continue;
  if (places.some((p) => Math.hypot(p[1] / 10 - t.x, p[2] / 10 - t.y) < 60)) continue;
  named.add(t.name);
  places.push([t.name, dm(t.x), dm(t.y), Math.round(t.top * 100)]);
}

// ---- out --------------------------------------------------------------------------

const empty = () => done(Layer());
const city = {
  about:
    'A model of Dubai Marina. Map data (c) OpenStreetMap contributors, ODbL: openstreetmap.org/copyright.',
  size: [dm(WIDTH), dm(HEIGHT)],
  water: WATER,
  land: done(land),
  river: done(sea),
  green,
  squares,
  piers: done(piers),
  viaducts: empty(),
  decks: done(decks),
  legs: done(legs),
  blocks: done(blocks),
  roofs: {
    base: [],
    wall: [],
    roof: [],
    runs: [],
    len: [],
    walls: [],
    nv: [],
    verts: [],
    nt: [],
    tris: [],
    wallColor: [],
    roofColor: [],
  },
  roads,
  trees,
  treeTops: [],
  walks: walks.map(({ id, route, stops }) => ({ id, route, stops })),
  places,
};

writeFileSync(OUT, JSON.stringify(city));
const kb = Math.round(JSON.stringify(city).length / 1024);
console.log(
  `${kb} KB: ${landCount} pieces of land, ${blocks.parts.length} buildings ` +
    `(${measured} measured, ${counted} by floors, ${guessed} guessed), ` +
    `${roads.len.length} roads and paths, ${trees.length / 2} trees, ` +
    `${piers.parts.length} jetties, ${places.length} names; the walks: ` +
    walks.map((w) => `${w.id} ${(w.length / 1000).toFixed(1)} km`).join(', ')
);
