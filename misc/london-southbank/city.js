/* The city, from numbers into triangles.
 *
 * city.json holds the whole model as whole numbers: positions across the
 * ground in decimeters, heights in centimeters, every coordinate the
 * difference from the one before it so the file compresses well. It was made
 * from OpenStreetMap, with heights from the Environment Agency's LIDAR
 * survey, and the script that made it is not kept (see _docs/misc.md); what
 * it wrote is the source now.
 *
 * This file turns those numbers into one mesh. A corner is twenty-four bytes:
 *
 *    0  x, y        decimeters from the south-west corner of the board
 *    4  z           centimeters, counted from 12 m below the ground
 *    6  u           decimeters along the wall it belongs to
 *    8  normal      three signed bytes
 *   11  tone        0-15, plus 16 for glass and 32 for a wall with no windows
 *   12  length      of that wall, decimeters
 *   14  base        where the wall starts, as z
 *   16  material    one of MATERIAL below
 *   17  seed        so no two buildings light the same windows
 *   18  top         where the wall ends at this corner, as z
 *   20  color       three bytes, the building's own; unused by the ground
 *
 * The wall fields let the fragment shader draw windows without a texture:
 * it knows how far along and how far up it is, and how big the wall is.
 */

export const STRIDE = 24;
export const DEPTH = 1200; // z is stored from 12 m down, the foot of the board

export const MATERIAL = {
  wall: 0,
  roof: 1,
  land: 2,
  water: 3,
  road: 4, // 4-9: main road, street, square, service road, footpath, railway
  green: 10,
  tree: 11,
  bank: 12,
  bridge: 13,
};

const WHITE = [255, 255, 255];

// A color as the data holds it, five bits a channel in one whole number.
function unpack(packed) {
  return [(packed >> 10) & 31, (packed >> 5) & 31, packed & 31].map((v) =>
    Math.round((v * 255) / 31)
  );
}

// For data from before the buildings had colors: the gray of a tone, 0-15.
function gray(tone) {
  const v = Math.round((tone * 255) / 15);
  return [v, v, v];
}

// Road widths in decimeters, by class.
const WIDTH = [130, 80, 60, 40, 24, 36];

function Mesh() {
  this.room = 1 << 18;
  this.bytes = new ArrayBuffer(this.room * STRIDE);
  this.view();
  this.index = new Uint32Array(this.room * 2);
  this.corners = 0;
  this.indices = 0;
  // The look of whatever is drawn next.
  this.material = 0;
  this.tone = 0;
  this.seed = 0;
  this.length = 0;
  this.base = 0;
  this.color = WHITE;
}

Mesh.prototype.view = function () {
  this.u16 = new Uint16Array(this.bytes);
  this.i8 = new Int8Array(this.bytes);
  this.u8 = new Uint8Array(this.bytes);
};

Mesh.prototype.reserve = function (corners, indices) {
  if (this.corners + corners > this.room) {
    while (this.corners + corners > this.room) this.room *= 2;
    const bytes = new ArrayBuffer(this.room * STRIDE);
    new Uint8Array(bytes).set(this.u8.subarray(0, this.corners * STRIDE));
    this.bytes = bytes;
    this.view();
  }
  if (this.indices + indices > this.index.length) {
    const index = new Uint32Array(Math.max(this.index.length * 2, this.indices + indices));
    index.set(this.index.subarray(0, this.indices));
    this.index = index;
  }
};

Mesh.prototype.corner = function (x, y, z, nx, ny, nz, u, top) {
  const w = (this.corners * STRIDE) / 2;
  const b = this.corners * STRIDE;
  this.u16[w] = x;
  this.u16[w + 1] = y;
  this.u16[w + 2] = z + DEPTH;
  this.u16[w + 3] = u;
  this.i8[b + 8] = nx * 127;
  this.i8[b + 9] = ny * 127;
  this.i8[b + 10] = nz * 127;
  this.u8[b + 11] = this.tone;
  this.u16[w + 6] = this.length;
  this.u16[w + 7] = this.base + DEPTH;
  this.u8[b + 16] = this.material;
  this.u8[b + 17] = this.seed;
  this.u16[w + 9] = top + DEPTH;
  this.u8[b + 20] = this.color[0];
  this.u8[b + 21] = this.color[1];
  this.u8[b + 22] = this.color[2];
  return this.corners++;
};

// A wall from a to b, standing on the base and rising to a height at each end.
Mesh.prototype.wall = function (ax, ay, atop, bx, by, btop) {
  const length = Math.hypot(bx - ax, by - ay);
  if (length < 0.5) return;
  const nx = (by - ay) / length;
  const ny = (ax - bx) / length;
  this.reserve(4, 6);
  this.length = Math.min(65535, Math.round(length));
  const i = this.corner(ax, ay, this.base, nx, ny, 0, 0, atop);
  this.corner(bx, by, this.base, nx, ny, 0, this.length, btop);
  this.corner(bx, by, btop, nx, ny, 0, this.length, btop);
  this.corner(ax, ay, atop, nx, ny, 0, 0, atop);
  this.index.set([i, i + 1, i + 2, i, i + 2, i + 3], this.indices);
  this.indices += 6;
};

// A flat face over corners given as x, y pairs: a roof, or the ground.
Mesh.prototype.cap = function (xy, z, triangles, down) {
  this.reserve(xy.length / 2, triangles.length);
  const first = this.corners;
  for (let i = 0; i < xy.length; i += 2)
    this.corner(xy[i], xy[i + 1], z, 0, 0, down ? -1 : 1, 0, z);
  for (let i = 0; i < triangles.length; i += 3) {
    this.index[this.indices++] = first + triangles[i];
    this.index[this.indices++] = first + triangles[i + (down ? 2 : 1)];
    this.index[this.indices++] = first + triangles[i + (down ? 1 : 2)];
  }
};

// One triangle with a normal of its own, facing up whichever way it was wound.
Mesh.prototype.facet = function (a, b, c) {
  let nx = (b[1] - a[1]) * (c[2] - a[2]) * 0.1 - (b[2] - a[2]) * 0.1 * (c[1] - a[1]);
  let ny = (b[2] - a[2]) * 0.1 * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]) * 0.1;
  let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const length = Math.hypot(nx, ny, nz);
  if (length < 1e-6) return;
  const flip = nz < 0 ? -1 : 1;
  nx *= flip / length;
  ny *= flip / length;
  nz *= flip / length;
  this.reserve(3, 3);
  const i = this.corner(a[0], a[1], a[2], nx, ny, nz, 0, a[2]);
  this.corner(b[0], b[1], b[2], nx, ny, nz, 0, b[2]);
  this.corner(c[0], c[1], c[2], nx, ny, nz, 0, c[2]);
  this.index.set([i, i + 1, i + 2], this.indices);
  this.indices += 3;
};

function clamp(v, low, high) {
  return Math.min(high, Math.max(low, v));
}

// A stable scatter of 0-255 from a whole number.
function scatter(n) {
  let h = (n + 1) * 2654435761;
  h ^= h >>> 15;
  return ((h * 2246822519) >>> 24) & 255;
}

// Walk a layer of polygons: fn(rings, triangles, i), each ring a flat list
// of x, y and the triangles numbered across all of the polygon's rings.
function polygons(layer, fn) {
  let ring = 0;
  let at = 0;
  let tri = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < layer.parts.length; i++) {
    const rings = [];
    for (let k = 0; k < layer.parts[i]; k++) {
      const xy = new Array(layer.rings[ring++] * 2);
      for (let j = 0; j < xy.length; j += 2) {
        xy[j] = x += layer.xy[at++];
        xy[j + 1] = y += layer.xy[at++];
      }
      rings.push(xy);
    }
    const triangles = layer.tris.slice(tri, (tri += layer.nt[i] * 3));
    fn(rings, triangles, i);
  }
}

// A polygon pulled up into a solid: walls round every ring, a roof on top,
// and a floor underneath when it hangs in the air.
function prism(mesh, rings, triangles, base, top, sides, lid) {
  mesh.base = base;
  if (sides != null) {
    mesh.material = sides;
    for (const xy of rings)
      for (let j = 0; j < xy.length; j += 2) {
        const k = (j + 2) % xy.length;
        mesh.wall(xy[j], xy[j + 1], top, xy[k], xy[k + 1], top);
      }
  }
  mesh.material = lid;
  const all = rings.length === 1 ? rings[0] : [].concat(...rings);
  mesh.cap(all, top, triangles, false);
  if (sides != null && base > 100) mesh.cap(all, base, triangles, true);
}

function layer(mesh, data, base, top, sides, lid, tone, color) {
  mesh.tone = tone;
  polygons(data, function (rings, triangles, i) {
    mesh.seed = scatter(i);
    mesh.color = data.wallColor ? unpack(data.wallColor[i]) : color || WHITE;
    prism(
      mesh,
      rings,
      triangles,
      data.base ? data.base[i] : base,
      data.top ? data.top[i] : top,
      sides,
      lid
    );
  });
}

function buildings(mesh, blocks) {
  polygons(blocks, function (rings, triangles, i) {
    const glass = blocks.roof[i] & 16;
    mesh.seed = scatter(i);
    mesh.base = blocks.base[i];
    mesh.material = MATERIAL.wall;
    mesh.tone = blocks.wall[i] + glass;
    mesh.color = blocks.wallColor ? unpack(blocks.wallColor[i]) : gray(blocks.wall[i]);
    for (const xy of rings)
      for (let j = 0; j < xy.length; j += 2) {
        const k = (j + 2) % xy.length;
        mesh.wall(xy[j], xy[j + 1], blocks.top[i], xy[k], xy[k + 1], blocks.top[i]);
      }
    const all = rings.length === 1 ? rings[0] : [].concat(...rings);
    mesh.material = MATERIAL.roof;
    mesh.tone = blocks.roof[i] & 15;
    mesh.color = blocks.roofColor ? unpack(blocks.roofColor[i]) : gray(blocks.roof[i] & 15);
    mesh.cap(all, blocks.top[i], triangles, false);
    if (blocks.base[i] > 100) mesh.cap(all, blocks.base[i], triangles, true);
  });
}

// Buildings under a roof with a shape: walls that climb to meet it, in runs
// (a negative length is a run that does not close), then the roof itself.
function roofs(mesh, data) {
  let run = 0;
  let wall = 0;
  let corner = 0;
  let tri = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.base.length; i++) {
    mesh.seed = scatter(i + 7919);
    mesh.base = data.base[i];
    mesh.material = MATERIAL.wall;
    mesh.tone = data.wall[i] + (data.roof[i] & 16);
    mesh.color = data.wallColor ? unpack(data.wallColor[i]) : gray(data.wall[i]);
    for (let r = 0; r < data.runs[i]; r++) {
      const length = data.len[run++];
      const points = [];
      for (let j = 0; j < Math.abs(length); j++) {
        x += data.walls[wall++];
        y += data.walls[wall++];
        points.push([x, y, data.walls[wall++]]);
      }
      for (let j = 0; j < points.length - (length < 0 ? 1 : 0); j++) {
        const a = points[j];
        const b = points[(j + 1) % points.length];
        mesh.wall(a[0], a[1], a[2], b[0], b[1], b[2]);
      }
    }
    const points = [];
    for (let j = 0; j < data.nv[i]; j++) {
      x += data.verts[corner++];
      y += data.verts[corner++];
      points.push([x, y, data.verts[corner++]]);
    }
    mesh.material = MATERIAL.roof;
    mesh.tone = data.roof[i] & 15;
    mesh.color = data.roofColor ? unpack(data.roofColor[i]) : gray(data.roof[i] & 15);
    for (let j = 0; j < data.nt[i]; j++, tri += 3)
      mesh.facet(points[data.tris[tri]], points[data.tris[tri + 1]], points[data.tris[tri + 2]]);
  }
}

// Roads, paths and railways as flat ribbons, a hand's width above the ground.
function roads(mesh, data) {
  let at = 0;
  let x = 0;
  let y = 0;
  mesh.tone = 0;
  for (let i = 0; i < data.len.length; i++) {
    const half = WIDTH[data.cls[i]] / 2;
    const z = data.z[i] + 6 + data.cls[i];
    mesh.material = MATERIAL.road + data.cls[i];
    let px = 0;
    let py = 0;
    for (let j = 0; j < data.len[i]; j++) {
      x += data.xy[at++];
      y += data.xy[at++];
      if (j > 0) ribbon(mesh, px, py, x, y, half, z);
      px = x;
      py = y;
    }
  }
}

function ribbon(mesh, ax, ay, bx, by, half, z) {
  const length = Math.hypot(bx - ax, by - ay);
  if (length < 0.5) return;
  const dx = ((bx - ax) / length) * half;
  const dy = ((by - ay) / length) * half;
  // A little past each end, so a bend does not open a gap.
  const ex = dx * 0.4;
  const ey = dy * 0.4;
  mesh.reserve(4, 6);
  const i = mesh.corner(ax - ex - dy, ay - ey + dx, z, 0, 0, 1, 0, z);
  mesh.corner(ax - ex + dy, ay - ey - dx, z, 0, 0, 1, 0, z);
  mesh.corner(bx + ex + dy, by + ey - dx, z, 0, 0, 1, 0, z);
  mesh.corner(bx + ex - dy, by + ey + dx, z, 0, 0, 1, 0, z);
  mesh.index.set([i, i + 1, i + 2, i, i + 2, i + 3], mesh.indices);
  mesh.indices += 6;
}

// A tree is a cut gem on a short stem: six sides, two points.
function trees(mesh, xy, tops) {
  let x = 0;
  let y = 0;
  mesh.material = MATERIAL.tree;
  for (let i = 0; i < xy.length; i += 2) {
    x += xy[i];
    y += xy[i + 1];
    const size = scatter(i);
    // A tree stands as tall as the survey found it (treeTops, decimeters).
    // Where the survey found none, it is a young tree, five to eight meters.
    const head = ((tops && tops[i / 2]) || 50 + size / 8) * 10; // centimeters
    const foot = clamp(head * 0.2, 120, 500);
    const r = clamp((head - foot) * 0.042, 12, 65); // decimeters
    const waist = foot + (head - foot) * 0.41;
    const turn = size / 40;
    mesh.tone = size & 15;
    mesh.seed = size;
    for (let k = 0; k < 6; k++) {
      const a = turn + (k * Math.PI) / 3;
      const b = turn + ((k + 1) * Math.PI) / 3;
      const p = [x + Math.cos(a) * r, y + Math.sin(a) * r, waist];
      const q = [x + Math.cos(b) * r, y + Math.sin(b) * r, waist];
      mesh.facet(p, q, [x, y, head]);
      lower(mesh, q, p, [x, y, foot]);
    }
  }
}

// The underside of a tree faces down, which facet() would turn over.
function lower(mesh, a, b, c) {
  const before = mesh.corners;
  mesh.facet(a, b, c);
  for (let i = before; i < mesh.corners; i++) {
    const at = i * STRIDE;
    mesh.i8[at + 8] = -mesh.i8[at + 8];
    mesh.i8[at + 9] = -mesh.i8[at + 9];
    mesh.i8[at + 10] = -mesh.i8[at + 10];
  }
}

// The walk as points in meters, with the distance walked to reach each.
function route(data) {
  const points = [];
  let x = 0;
  let y = 0;
  let walked = 0;
  for (let i = 0; i < data.length; i += 3) {
    x += data[i];
    y += data[i + 1];
    const p = [x / 10, y / 10, data[i + 2] / 100, 0];
    const last = points[points.length - 1];
    if (last) walked += Math.hypot(p[0] - last[0], p[1] - last[1]);
    p[3] = walked;
    points.push(p);
  }
  return points;
}

export function build(city) {
  const mesh = new Mesh();
  const M = MATERIAL;
  const water = city.water;

  // What casts a shadow comes first, then what only lies on the ground.
  layer(mesh, city.land, -DEPTH, 0, M.bank, M.land, 0);
  layer(mesh, city.river, -DEPTH, water, M.bank, M.water, 0);
  layer(mesh, city.piers, water, water + 130, M.bridge, M.bridge, 0);
  layer(mesh, city.legs, water, 0, M.bridge, M.bridge, 0);
  // A bridge's sides are painted, each its own color; its deck is road.
  layer(mesh, city.decks, 0, 0, M.wall, M.bridge, 32, [207, 201, 189]);
  layer(mesh, city.viaducts, 0, 650, M.wall, M.roof, 7 + 32, [146, 128, 114]);
  buildings(mesh, city.blocks);
  roofs(mesh, city.roofs);
  trees(mesh, city.trees, city.treeTops);
  const solid = mesh.indices;
  layer(mesh, city.green, 0, 3, null, M.green, 0);
  layer(mesh, city.squares, 0, 5, null, M.road + 2, 0);
  roads(mesh, city.roads);

  const line = route(city.route);
  return {
    corners: new Uint8Array(mesh.bytes, 0, mesh.corners * STRIDE),
    index: mesh.index.subarray(0, mesh.indices),
    solid: solid,
    size: [city.size[0] / 10, city.size[1] / 10],
    route: line,
    stops: city.stops.map(function (s) {
      return { id: s[0], at: line[s[1]] };
    }),
    // Landmarks to name: where each stands, and the height of its roof there.
    places: (city.places || []).map(function (p) {
      return { name: p[0], at: [p[1] / 10, p[2] / 10, p[3] / 100] };
    }),
  };
}
