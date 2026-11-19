/* The drawing: one mesh, one sun, and WebGL with no library between.
 *
 * Three programs draw. `depth` draws the city from the sun's side into a
 * shadow map, fitted round whatever the camera can see so a close view gets
 * sharp shadows and a far one gets all of them. `solid` draws it from the
 * camera: a color for every surface, the sun and the sky on it, the shadow
 * map for what the sun cannot reach, and windows worked out from how far
 * along a wall a point is. `path` draws the walk as a line a few pixels wide
 * however far away it is.
 *
 * Two more run once, when the model loads. They look straight down on the
 * city and work out, for every square meter, how much of the sky it sees:
 * the sky map. That is what puts shade in a narrow street and at the foot of
 * a wall, where no shadow falls but little light arrives.
 *
 * The camera is always a lens. An isometric view is a long one, so far back
 * that parallel lines stay parallel; flying along the walk shortens it. One
 * camera does both, and moving between them is only arithmetic.
 */

import { STRIDE } from './city.js';

const RAD = Math.PI / 180;
// Where the sun stands until walk.js says otherwise: south-west and 43
// degrees up, an afternoon. It is also where the moon stands, all night.
export const SUN = [-0.52, -0.5, 0.69];
const TALLEST = 440;

const DEPTH_VERTEX = `#version 300 es
layout(location = 0) in vec4 aPlace;
uniform mat4 uView;    // whoever is looking: the sun, or the sky straight overhead
void main() {
  gl_Position = uView * vec4(aPlace.xy * 0.1, aPlace.z * 0.01 - 12.0, 1.0);
}`;

const DEPTH_FRAGMENT = `#version 300 es
void main() {}`;

// One triangle that covers the whole target, for work done on a picture.
const WHOLE_VERTEX = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

// The sky map, a cell to a meter, from the city's heights seen from above.
//
//   r  how much sky the ground here sees, 1 for all of it
//   g  how high the top surface here stands, in half meters
//   b  how much sky that top surface sees: a roof under a taller neighbor
//   a  how far that surface runs before it drops away, up to six meters
//
// From each cell it looks out twelve ways and finds how high the skyline
// stands in each. A skyline at an angle hides the square of that angle's
// sine of the light from that side, which is how much less of an even sky
// falls on flat ground. Each cell turns its twelve ways by an amount of its
// own, so what the looking misses shows as grain and not as rings.
const SKY_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uHeight;
uniform float uCell;   // cells to a meter
out vec4 sky;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float heightAt(vec2 cell) {
  ivec2 last = textureSize(uHeight, 0) - 1;
  return 330.0 - texelFetch(uHeight, clamp(ivec2(cell), ivec2(0), last), 0).r * 343.0;
}

void main() {
  vec2 here = gl_FragCoord.xy;
  float top = heightAt(here);
  float low = min(top, 0.0);
  float turn = hash(here) * 0.5236;
  float ground = 0.0;
  float roof = 0.0;
  for (int i = 0; i < 12; i++) {
    float a = float(i) * 0.5235988 + turn;
    vec2 way = vec2(cos(a), sin(a));
    float overGround = 0.0;
    float overRoof = 0.0;
    float off = 1.0 + hash(here + float(i));
    for (int k = 0; k < 9; k++) {
      float h = heightAt(here + way * off * uCell);
      // What stands far off counts for less, and past 44 m for nothing.
      float weight = (1.0 - smoothstep(24.0, 44.0, off)) / off;
      overGround = max(overGround, (h - low - 0.5) * weight);
      overRoof = max(overRoof, (h - top - 0.5) * weight);
      off *= 1.5;
    }
    ground += overGround * overGround / (1.0 + overGround * overGround);
    roof += overRoof * overRoof / (1.0 + overRoof * overRoof);
  }
  float room = 6.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7853982;
    vec2 way = vec2(cos(a), sin(a));
    for (int k = 1; k <= 6; k++)
      if (heightAt(here + way * float(k) * uCell) < top - 1.2) {
        room = min(room, float(k) - 0.5);
        break;
      }
  }
  sky = vec4(1.0 - ground / 12.0, clamp(top, 0.0, 127.5) / 127.5, 1.0 - roof / 12.0, room / 6.0);
}`;

// The grain smoothed away, each cell with its neighbors on the same
// surface only, so a roof does not take on the street's shade.
const SMOOTH_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uRough;
out vec4 sky;
void main() {
  ivec2 here = ivec2(gl_FragCoord.xy);
  ivec2 last = textureSize(uRough, 0) - 1;
  vec4 mine = texelFetch(uRough, here, 0);
  vec3 sum = vec3(0.0);
  float total = 0.0;
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
      vec4 other = texelFetch(uRough, clamp(here + ivec2(x, y), ivec2(0), last), 0);
      float weight = float((2 - abs(x)) * (2 - abs(y))) * step(abs(other.g - mine.g), 0.02);
      sum += other.rba * weight;
      total += weight;
    }
  sum /= total;
  sky = vec4(sum.x, mine.g, sum.y, sum.z);
}`;

const SOLID_VERTEX = `#version 300 es
layout(location = 0) in vec4 aPlace;   // x, y, z, and u along the wall
layout(location = 1) in vec3 aNormal;
layout(location = 2) in float aTone;
layout(location = 3) in vec2 aWall;    // its length, its base
layout(location = 4) in vec2 aKind;    // material, seed
layout(location = 5) in float aTop;
layout(location = 6) in vec3 aColor;   // a building's own color
uniform mat4 uCamera;
uniform mat4 uSun;
uniform vec2 uBias;    // how far to step off the surface, and how much depth to forgive
out vec3 vAt;
out vec3 vNormal;
out vec3 vShadow;
out vec3 vWall;        // meters along, meters up, meters to the top here; on a flat roof, x is which way the building lies, in degrees
flat out vec4 vLook;   // material, tone, seed, wall length in meters
flat out vec2 vFlags;  // glass, no windows
flat out vec3 vColor;
void main() {
  vColor = aColor;
  vAt = vec3(aPlace.xy * 0.1, aPlace.z * 0.01 - 12.0);
  float base = aWall.y * 0.01 - 12.0;
  vNormal = aNormal;
  vWall = vec3(aPlace.w * 0.1, vAt.z - base, aTop * 0.01 - 12.0 - base);
  vLook = vec4(aKind.x, mod(aTone, 16.0), aKind.y, aWall.x * 0.1);
  vFlags = vec2(step(16.0, mod(aTone, 32.0)), step(32.0, aTone));
  // Read the shadow map from a step outside the surface, or every face
  // would shade itself in stripes.
  vec4 s = uSun * vec4(vAt + aNormal * uBias.x, 1.0);
  vShadow = s.xyz * 0.5 + 0.5;
  vShadow.z -= uBias.y;
  gl_Position = uCamera * vec4(vAt, 1.0);
}`;

const SOLID_FRAGMENT = `#version 300 es
precision highp float;
precision highp sampler2DShadow;
in vec3 vAt;
in vec3 vNormal;
in vec3 vShadow;
in vec3 vWall;
flat in vec4 vLook;
flat in vec2 vFlags;
flat in vec3 vColor;
uniform sampler2DShadow uShadow;  // the sun's view, asked: is this lit?
uniform sampler2D uDepth;         // the same view, asked: how far off is what shades this?
uniform sampler2D uSky;           // how much sky each place sees (SKY_FRAGMENT)
uniform vec2 uBoard;              // the board, in meters
uniform vec3 uMap;                // the shadow map: a texel as a share of it, meters to a texel, meters to its whole depth
uniform vec3 uSunDir;
uniform vec3 uEye;
uniform vec3 uTint[16];    // a color for each material; 0 and 1 tint the buildings
uniform vec3 uLamp;        // the color of a lit window
uniform vec3 uSunLight;    // the color of the sun's light
uniform vec3 uSkyLight;    // the color of the sky's, which is the color of shade
uniform vec3 uAbove[3];    // what a mirror shows: overhead, at the horizon, and the town under it
uniform vec3 uTone;    // darkest wall, lightest wall, and how deep the shade where the sky is hidden
uniform float uPaint;  // how much of its own color a building keeps
uniform vec3 uGlass;   // how dark a window is by day, how many are lit, how bright
uniform vec4 uFog;     // the paper's color, and how much of it
uniform vec2 uFar;     // where the haze starts, and how deep it is
out vec4 color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Soft blotches, one to a unit.
float cloud(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// 1 between a and b and 0 outside, with an edge w wide.
float band(float v, float a, float b, float w) {
  return smoothstep(a - w, a + w, v) * (1.0 - smoothstep(b - w, b + w, v));
}

float box(vec2 p, vec2 from, vec2 to, float w) {
  return band(p.x, from.x, to.x, w) * band(p.y, from.y, to.y, w);
}

// Points spread evenly over a disc, the whole disc turned by an angle.
vec2 spread(int i, float count, float turn) {
  float a = float(i) * 2.3999632 + turn;
  return sqrt((float(i) + 0.5) / count) * vec2(cos(a), sin(a));
}

// How much of the sun reaches this point. A shadow is sharp at the foot of
// what casts it and soft far from it, so first find how far off the caster
// is, then look over a disc that wide. The finding asks the same nine
// places of every pixel, so neighbors agree how soft the shadow is; the
// looking turns its disc by an amount of each pixel's own, which trades the
// banding of few samples for a grain too fine to see. slope is how steeply
// the surface lies to the sun.
float sunlit(float slope) {
  if (vShadow.x < 0.0 || vShadow.x > 1.0 || vShadow.y < 0.0 || vShadow.y > 1.0) return 1.0;
  float reach = max(4.0 / uMap.y, 2.0) * uMap.x;
  float gap = 0.0;
  float found = 0.0;
  for (int i = 0; i < 9; i++) {
    vec2 off = i == 0 ? vec2(0.0) : spread(i - 1, 8.0, 0.0);
    float d = texture(uDepth, vShadow.xy + off * reach).r;
    if (d < vShadow.z) {
      gap += vShadow.z - d;
      found += 1.0;
    }
  }
  float soft = 1.3;
  if (found > 0.5) soft = max(clamp(gap / found * uMap.z * 0.06, 0.3, 4.0) / uMap.y, 1.3);
  // A wide disc on a sloping surface dips under the surface itself.
  float forgive = soft * uMap.y * slope / uMap.z;
  float turn = 6.2831853 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float lit = 0.0;
  for (int i = 0; i < 12; i++)
    lit += texture(uShadow, vec3(vShadow.xy + spread(i, 12.0, turn) * soft * uMap.x, vShadow.z - forgive));
  return lit / 12.0;
}

// The sky map at a point on a surface at height z. Of the four cells round
// the point, only those of that surface count: the roof next door and the
// street below have skies of their own.
vec4 skyAt(vec2 at, float z) {
  ivec2 last = textureSize(uSky, 0) - 1;
  vec2 cell = at / uBoard * vec2(last + 1) - 0.5;
  ivec2 corner = ivec2(floor(cell));
  vec2 f = fract(cell);
  vec4 sum = vec4(0.0);
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    ivec2 over = ivec2(i & 1, i >> 1);
    vec4 here = texelFetch(uSky, clamp(corner + over, ivec2(0), last), 0);
    float weight = (over.x == 1 ? f.x : 1.0 - f.x) * (over.y == 1 ? f.y : 1.0 - f.y);
    weight *= step(abs(here.g * 127.5 - clamp(z, 0.0, 127.5)), 2.5) + 0.001;
    sum += here * weight;
    total += weight;
  }
  return sum / total;
}

// What a mirror shows in a direction: the sky, paler toward the horizon,
// and the town under it.
vec3 above(vec3 way) {
  vec3 sky = mix(uAbove[1], uAbove[0], smoothstep(0.0, 0.75, way.z));
  return mix(uAbove[2], sky, smoothstep(-0.12, 0.06, way.z));
}

void main() {
  vec3 n = normalize(vNormal);
  int material = int(vLook.x + 0.5);
  // A parapet is seen from behind, over the roof it stands round: the same
  // wall, facing the other way, with no windows and nothing in its light.
  bool inner = material == 0 && !gl_FrontFacing;
  if (inner) n = -n;
  vec3 toEye = normalize(uEye - vAt);
  float facing = max(dot(n, uSunDir), 0.0);
  float direct = 0.0;
  if (facing > 0.0) direct = facing * sunlit(min(sqrt(1.0 - facing * facing) / max(facing, 0.05), 4.0));

  // How much of the sky this place sees. A roof and the ground read it off
  // the sky map. A wall reads the open air a step out from its face, which
  // is the street at its foot or a lower roof it rises from, and opens to
  // the whole sky as it climbs from there; the less sky down there, the
  // taller what stands round it, and the higher the shade reaches.
  vec4 seen;
  float open;
  if (material == 0) {
    seen = texture(uSky, (vAt.xy + n.xy * 1.5) / uBoard);
    float floor_ = seen.g * 127.5;
    float foot = smoothstep(0.08, 0.55, mix(seen.r, seen.b, smoothstep(0.5, 2.0, floor_)));
    open = inner ? 1.0 : mix(foot, 1.0, smoothstep(0.0, mix(30.0, 8.0, foot), vAt.z - floor_));
  } else if (material == 11) {
    seen = skyAt(vAt.xy, 0.0);
    open = mix(smoothstep(0.0, 0.8, seen.r), 1.0, 0.6);
  } else if (vAt.z > 1.5) {
    // Whatever lies up in the air and flat: a roof, a bridge's deck, the
    // road painted on it. Only what lies flat; the map knows heights, not
    // slopes, and would take the upper half of a dome for something
    // overhanging the lower.
    // And only where the map has a surface at this height: a road that
    // runs out past the end of its bridge has none.
    seen = skyAt(vAt.xy, vAt.z);
    float known = step(abs(seen.g * 127.5 - clamp(vAt.z, 0.0, 127.5)), 2.5);
    open = mix(1.0, seen.b, known * smoothstep(0.75, 0.98, n.z));
  } else {
    seen = skyAt(vAt.xy, 0.0);
    // Beside any building half the sky is gone, and a town is all beside
    // buildings. Only what is more shut in than that is drawn as shade.
    open = smoothstep(0.0, 0.8, seen.r);
  }

  // The sky lights a roof fully and a wall less, and less again where it is
  // hidden. The sun adds its own, and a little comes back off the ground on
  // the side away from it.
  float back = max(dot(n.xy, -normalize(uSunDir.xy)), 0.0);
  vec3 light = uSkyLight * mix(0.74, 1.0, n.z * 0.5 + 0.5) * mix(1.0, open, uTone.z);
  light += uSunLight * (direct + 0.06 * back * open);

  vec3 tone = uTint[material];
  if (material < 2) {
    // A building is painted its own color, calmed: some of the color is
    // given up for gray, and black and white are pulled in toward the
    // middle, so the model reads as a model and no one roof shouts.
    vec3 own = mix(vec3(dot(vColor, vec3(0.299, 0.587, 0.114))), vColor, uPaint);
    tone *= mix(vec3(uTone.x), vec3(uTone.y), own);
    // No two buildings are quite one tone.
    tone *= 0.955 + 0.09 * hash(vec2(vLook.z, float(material)));
  }
  // What is added over the lit color: lamps, and what glass and water mirror.
  vec3 extra = vec3(0.0);
  float night = step(0.001, uGlass.y);

  if (material == 0) {
    // Walls stand a little darker where they meet the ground, and carry a
    // drawn line a pixel wide down each corner and along the top.
    light *= 0.9 + 0.1 * smoothstep(0.0, 9.0, vWall.y);
    float du = fwidth(vWall.x);
    float dv = fwidth(vWall.y);
    float corner = min(vWall.x, vLook.w - vWall.x) / max(du, 1e-4);
    float eave = (vWall.z - vWall.y) / max(dv, 1e-4);
    tone *= 1.0 - 0.2 * (1.0 - smoothstep(0.6, 1.6, min(corner, eave)));
    // A coping along the top, when close enough to see one.
    tone *= 1.0 + 0.05 * (1.0 - smoothstep(0.4, 0.6, vWall.z - vWall.y)) * (1.0 - smoothstep(0.15, 0.5, dv));

    // The kinds of window. Each is a bay's width, a story's height, and the
    // part of that bay-by-story cell that is glass. A building draws its
    // kind once, from its seed; a tall one is always in strips.
    float glassy = vFlags.x;
    float pick = hash(vec2(vLook.z, 9.0));
    float bay = 3.1;
    float story = 3.4;
    vec2 lo = vec2(0.24, 0.30);   // a plain window in a wall
    vec2 hi = vec2(0.76, 0.80);
    float post = 0.0;             // a post down the middle of the glass
    float rail = 0.0;             // a bar across it
    if (glassy > 0.5) {
      // a wall of glass: thin bars, and a band at every floor
      bay = 2.4 + 0.6 * floor(pick * 3.0);
      story = 3.8;
      lo = vec2(0.03, 0.0);
      hi = vec2(0.97, 0.78);
    } else if (vWall.z > 40.0 || pick > 0.84) {
      // strips of window right along each floor
      bay = 1.8;
      lo = vec2(0.02, 0.36);
      hi = vec2(0.98, 0.80);
    } else if (pick < 0.30) {
      // tall sashes, close set
      bay = 2.4;
      story = 3.2;
      lo = vec2(0.31, 0.20);
      hi = vec2(0.69, 0.84);
      rail = 1.0;
    } else if (pick < 0.44) {
      // two lights to a bay
      bay = 3.8;
      lo = vec2(0.14, 0.30);
      hi = vec2(0.86, 0.78);
      post = 1.0;
    } else if (pick < 0.54) {
      // glass running up between piers
      bay = 2.8;
      lo = vec2(0.27, 0.05);
      hi = vec2(0.73, 0.95);
    }
    float rows = floor((vWall.z - 0.6) / story);
    float columns = max(1.0, floor(vLook.w / bay + 0.5));
    if (vFlags.y < 0.5 && rows >= 1.0 && vLook.w > 2.4 && !inner) {
      vec2 cell = vec2(vWall.x / vLook.w * columns, vWall.y / story);
      vec2 id = floor(cell);
      vec2 f = fract(cell);
      vec2 w = fwidth(cell);
      // At street level, half the taller buildings have a shop's wide glass.
      float shop = step(id.y, 0.5) * step(3.0, rows) * (1.0 - glassy) * step(0.5, hash(vec2(vLook.z, 5.0)));
      if (shop > 0.5) {
        lo = vec2(0.07, 0.08);
        hi = vec2(0.93, 0.74);
        post = 0.0;
        rail = 0.0;
      }
      vec2 within = vec2(band(f.x, lo.x, hi.x, w.x), band(f.y, lo.y, hi.y, w.y));
      float size = max(w.x, w.y);
      // The small things in a window wait until it is close. And windows
      // too small to draw are not left to shimmer: far off, the wall takes
      // the even tone of all its glass together.
      float shown = 1.0 - smoothstep(0.16, 0.42, size);
      float close = 1.0 - smoothstep(0.03, 0.09, size);
      float pane = within.x * within.y;
      float middle = (lo.x + hi.x) / 2.0;
      pane *= 1.0 - post * band(f.x, middle - 0.06, middle + 0.06, w.x);
      pane *= 1.0 - 0.7 * rail * close * band(f.y, (lo.y + hi.y) / 2.0 - 0.015, (lo.y + hi.y) / 2.0 + 0.015, w.y);
      float share = (hi.x - lo.x - 0.12 * post) * (hi.y - lo.y);
      float window = mix(share, pane, shown) * step(cell.y, rows);

      // No two windows alike: each pane a little lighter or darker, a blind
      // drawn some way down in one of three, and shade under the lintel.
      float each = mix(0.5, hash(id + vLook.z), shown * (1.0 - 0.5 * glassy));
      float blind = hash(id * 1.7 + vLook.z + 3.0);
      float down = blind > 0.66 + 0.24 * glassy ? (blind - 0.66) * 2.6 : 0.0;
      float covered = close * (1.0 - shop) * step(0.001, down) * smoothstep(-w.y, w.y, f.y - mix(hi.y, lo.y, down));
      // A lit window stays a point of light long after its frame is too
      // small to draw; only from very far are they one even glow.
      float apart = 1.0 - smoothstep(0.35, 0.9, size);
      float lamp = night * mix(uGlass.y, step(1.0 - uGlass.y, hash(id + vLook.z + 0.5)), apart);
      float lit = lamp * mix(share, pane, apart) * step(cell.y, rows);
      float dark = uGlass.x * (0.8 + 0.4 * each) * (1.0 - 0.6 * covered);
      dark *= 1.0 + 0.35 * close * smoothstep(hi.y - 0.1, hi.y, f.y);
      tone *= 1.0 - min(dark, 0.9) * window * (1.0 - lamp);
      // A sill under it catches the light.
      tone *= 1.0 + 0.07 * band(f.y, lo.y - 0.07, lo.y - 0.015, w.y) * within.x * close * step(cell.y, rows) * (1.0 - glassy);

      // Glass shows the sky. Looked down on, an upright pane mirrors only
      // the street, so each is leaned back by an amount of its own, as it
      // would look from the pavement.
      vec3 leaned = normalize(n + vec3(0.0, 0.0, 0.35 + 0.3 * each));
      float shine = (glassy > 0.5 ? 0.36 : 0.16) * (1.0 - 0.7 * covered);
      extra += above(reflect(-toEye, leaned)) * shine * window * (1.0 - lamp);
      // By night a third are lit, and no two rooms alike: most warm, a few
      // cool, some dim behind a blind.
      vec3 room = mix(uLamp, vec3(0.8, 0.9, 1.0), 0.7 * step(0.82, each));
      extra += room * uGlass.z * (0.55 + 0.45 * hash(id + 7.0)) * (1.0 - 0.45 * covered) * lit;
      // And by day a wall of glass throws the sun back at whoever stands
      // in the right place.
      float glint = pow(max(dot(reflect(-toEye, n), uSunDir), 0.0), 18.0);
      extra += uSunLight * 0.5 * glint * window * glassy * (1.0 - night);
    }
  } else if (material == 1) {
    float meter = fwidth(vAt.x) + fwidth(vAt.y);
    float close = 1.0 - smoothstep(0.5, 1.6, meter);
    if (n.z > 0.98 && vFlags.y < 0.5 && vWall.x < 179.95) {
      // A flat roof is never bare. What stands on it stands in lots six and
      // a half meters square, laid square to the building, and only where
      // the middle of the lot is well back from the roof's edge.
      tone *= 0.988 + 0.024 * cloud(vAt.xy * 0.4 + vLook.z) * close;
      float a = radians(vWall.x);
      vec2 along = vec2(cos(a), sin(a));
      vec2 across = vec2(-along.y, along.x);
      vec2 q = vec2(dot(vAt.xy, along), dot(vAt.xy, across)) + vLook.z * 3.7;
      vec2 lot = floor(q / 6.5);
      vec2 within = q - lot * 6.5;
      vec2 middle = (lot + 0.5) * 6.5 - vLook.z * 3.7;
      vec4 there = skyAt(along * middle.x + across * middle.y, vAt.z);
      float room = there.a * 6.0 * step(abs(there.g * 127.5 - clamp(vAt.z, 0.0, 127.5)), 2.5);
      float kind = hash(lot + vLook.z);
      // Plant, in boxes of all sizes; on a tall roof now and then a lift
      // room; and one lot in ten a skylight.
      vec2 size = 1.4 + 2.2 * vec2(hash(lot + 1.3), hash(lot + 2.7));
      float tall = 0.7 + 1.3 * hash(lot + 8.3);
      float stands = step(kind, 0.32) * step(3.4, room);
      if (kind > 0.9 && vAt.z > 18.0) {
        size = vec2(4.8, 3.8);
        tall = 2.8;
        stands = step(4.2, room);
      }
      vec2 from = 3.25 + (vec2(hash(lot + 4.1), hash(lot + 5.9)) - 0.5) * (4.9 - size) - size / 2.0;
      float edge = meter * 0.25;
      float body = box(within, from, from + size, edge) * stands * close;
      if (kind < 0.1) {
        tone *= 1.0 - 0.4 * body;
        extra += above(reflect(-toEye, vec3(0.0, 0.0, 1.0))) * 0.25 * body;
      } else {
        // It stands in the sun, and its shadow lies on the roof beside it.
        vec2 fall = -vec2(dot(uSunDir.xy, along), dot(uSunDir.xy, across)) * tall / max(uSunDir.z, 0.08);
        float shadow = box(within - fall, from, from + size, edge) * stands * close * (1.0 - body);
        light -= uSunLight * direct * 0.85 * shadow;
        tone *= 1.0 + (0.2 * hash(lot + 9.9) - 0.13) * body;
      }
    } else if (n.z > 0.2 && n.z < 0.94) {
      // A pitched roof is laid in courses, one to every 60 cm of its slope.
      float course = vAt.z / (0.6 * sqrt(1.0 - n.z * n.z));
      float fine = 1.0 - smoothstep(0.1, 0.35, fwidth(course));
      tone *= 1.0 - 0.035 * fine * band(fract(course), 0.4, 0.9, fwidth(course));
    }
  } else if (material == 3) {
    // The water. Wind lays a few crossing trains of waves on it, kept here
    // as the lean they give the surface; far off they are too small to see
    // and it lies flat.
    vec2 p = vAt.xy;
    float fine = 1.0 - smoothstep(0.3, 1.6, fwidth(p.x) + fwidth(p.y));
    // Each train is pushed about by slow blotches, or they would cross in
    // a weave.
    vec2 push = 9.0 * vec2(cloud(p * 0.021), cloud(p * 0.017 + 40.0));
    vec2 lean = 0.05 * vec2(0.9, 0.44) * cos(p.x * 0.29 + p.y * 0.14 + push.x);
    lean += 0.04 * vec2(-0.35, 0.94) * cos(p.y * 0.47 - p.x * 0.17 + push.y * 1.3);
    lean += 0.03 * vec2(0.71, -0.71) * cos((p.x - p.y) * 0.83 + push.x * 1.7 - push.y);
    lean += 0.02 * vec2(0.26, 0.97) * cos(p.x * 0.52 + p.y * 1.93 + push.y * 2.1);
    lean *= fine;
    vec3 surface = normalize(vec3(-lean, 1.0));
    // A wave's sunward face is lighter than its lee.
    tone *= 1.0 + 1.1 * dot(lean, -normalize(uSunDir.xy));
    // Water mirrors the sky, hardly at all looked straight down on and
    // more and more toward the horizon; and it throws back the sun.
    vec3 thrown = reflect(-toEye, surface);
    float glance = 0.04 + 0.55 * pow(1.0 - max(dot(toEye, surface), 0.0), 3.0);
    tone *= 1.0 - glance;
    extra += above(thrown) * glance;
    extra += uSunLight * 0.9 * pow(max(dot(thrown, uSunDir), 0.0), 120.0) * step(0.001, direct);
    // By night the lamps along the banks lie on it as broken streaks, each
    // drawn out toward whoever is looking. Under a bridge there are none.
    vec2 toward = normalize(vAt.xy - uEye.xy);
    vec2 drawn = vec2(dot(p, vec2(-toward.y, toward.x)) * 0.45, dot(p, toward) * 0.09);
    float lights = smoothstep(0.55, 0.85, cloud(drawn)) * (0.55 + 0.45 * cos(dot(p, toward) * 2.1 + drawn.x * 5.0));
    lights *= smoothstep(0.1, 0.5, 1.0 - seen.r) * (1.0 - smoothstep(0.5, 2.0, seen.g * 127.5));
    extra += uLamp * 0.4 * lights * fine * night;
  } else if (material == 10) {
    // Grass is patchy.
    tone *= 0.95 + 0.1 * cloud(vAt.xy * 0.07);
  } else if (material == 11) {
    // No two trees one green: lighter and darker, and some turning yellow.
    tone *= 0.88 + 0.24 * (vLook.y / 15.0);
    tone *= mix(vec3(1.0), vec3(1.12, 1.04, 0.74), 0.5 * hash(vec2(vLook.z, 2.0)));
  }

  vec3 value = tone * light + extra;
  float haze = uFog.a * smoothstep(uFar.x, uFar.x + uFar.y, distance(vAt, uEye));
  color = vec4(mix(value, uFog.rgb, haze), 1.0);
}`;

const PATH_VERTEX = `#version 300 es
layout(location = 0) in vec3 aFrom;
layout(location = 1) in vec3 aTo;
layout(location = 2) in vec3 aCorner;  // which side, which end, meters walked
uniform mat4 uCamera;
uniform vec2 uPixel;
uniform float uWidth;
out float vWalked;
void main() {
  vec4 a = uCamera * vec4(aFrom, 1.0);
  vec4 b = uCamera * vec4(aTo, 1.0);
  vWalked = aCorner.z;
  if (a.w < 0.5 || b.w < 0.5) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 along = (b.xy / b.w - a.xy / a.w) / uPixel;
  along = length(along) > 0.001 ? normalize(along) : vec2(1.0, 0.0);
  vec2 push = (vec2(-along.y, along.x) * aCorner.x + along * (aCorner.y * 2.0 - 1.0)) * uWidth * 0.5;
  vec4 p = mix(a, b, aCorner.y);
  p.xy += push * uPixel * p.w;
  gl_Position = p;
}`;

const PATH_FRAGMENT = `#version 300 es
precision highp float;
in float vWalked;
uniform vec4 uColor;
uniform vec2 uDash;   // meters walked so far, meters to a dash
out vec4 color;
void main() {
  // Behind you the line is whole; ahead of you it is dashed.
  if (vWalked > uDash.x && uDash.y > 0.0 && fract(vWalked / uDash.y) > 0.55) discard;
  color = uColor;
}`;

// ---- a little linear algebra, column-major like the GPU wants it --------

function normalize(v) {
  const length = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const range = 1 / (near - far);
  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * range,
    -1,
    0,
    0,
    2 * far * near * range,
    0,
  ];
}

function orthographic(left, right, bottom, top, near, far) {
  const w = right - left;
  const h = top - bottom;
  const d = far - near;
  return [
    2 / w,
    0,
    0,
    0,
    0,
    2 / h,
    0,
    0,
    0,
    0,
    -2 / d,
    0,
    -(right + left) / w,
    -(top + bottom) / h,
    -(far + near) / d,
    1,
  ];
}

function lookAt(eye, target, up) {
  const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return [
    x[0],
    y[0],
    z[0],
    0,
    x[1],
    y[1],
    z[1],
    0,
    x[2],
    y[2],
    z[2],
    0,
    -dot(x, eye),
    -dot(y, eye),
    -dot(z, eye),
    1,
  ];
}

function multiply(a, b) {
  const out = new Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      out[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
  return out;
}

function transform(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
    m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15],
  ];
}

// ---- the renderer ------------------------------------------------------

function program(gl, vertex, fragment) {
  const made = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(made, shader);
  }
  gl.linkProgram(made);
  if (!gl.getProgramParameter(made, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(made));
  const uniforms = {};
  const count = gl.getProgramParameter(made, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(made, i).name.replace('[0]', '');
    uniforms[name] = gl.getUniformLocation(made, name);
  }
  return { id: made, at: uniforms };
}

// The walk as a strip of quads, each corner knowing both ends of its piece.
function pathCorners(route) {
  const out = new Float32Array((route.length - 1) * 6 * 9);
  let o = 0;
  for (let i = 0; i + 1 < route.length; i++) {
    const a = route[i];
    const b = route[i + 1];
    for (const [side, end] of [
      [-1, 0],
      [1, 0],
      [1, 1],
      [-1, 0],
      [1, 1],
      [-1, 1],
    ]) {
      out.set([a[0], a[1], a[2] + 1.6, b[0], b[1], b[2] + 1.6, side, end, end ? b[3] : a[3]], o);
      o += 9;
    }
  }
  return out;
}

export function renderer(canvas, model) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
  if (!gl) return null;

  let depth, solid, path, city, walk, sky;
  const camera = { matrix: null, eye: [0, 0, 0], width: 1, height: 1 };
  // The window the sun looks through moves with the camera; which way it
  // looks moves only when the hour does (aim).
  const sun = {
    to: normalize(SUN),
    view: null,
    matrix: null,
    near: 0,
    far: 0,
    pane: '',
    side: 0,
    size: 0,
    texel: 1,
  };

  // Everything the GPU holds, made here so a lost context can be made again.
  function setup() {
    depth = program(gl, DEPTH_VERTEX, DEPTH_FRAGMENT);
    solid = program(gl, SOLID_VERTEX, SOLID_FRAGMENT);
    path = program(gl, PATH_VERTEX, PATH_FRAGMENT);

    city = gl.createVertexArray();
    gl.bindVertexArray(city);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, model.corners, gl.STATIC_DRAW);
    const attribute = function (at, size, type, normalized, offset) {
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, size, type, normalized, STRIDE, offset);
    };
    attribute(0, 4, gl.UNSIGNED_SHORT, false, 0);
    attribute(1, 3, gl.BYTE, true, 8);
    attribute(2, 1, gl.UNSIGNED_BYTE, false, 11);
    attribute(3, 2, gl.UNSIGNED_SHORT, false, 12);
    attribute(4, 2, gl.UNSIGNED_BYTE, false, 16);
    attribute(5, 1, gl.UNSIGNED_SHORT, false, 18);
    attribute(6, 3, gl.UNSIGNED_BYTE, true, 20);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.index, gl.STATIC_DRAW);

    walk = gl.createVertexArray();
    gl.bindVertexArray(walk);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, pathCorners(model.route), gl.STATIC_DRAW);
    for (let i = 0; i < 3; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, 3, gl.FLOAT, false, 36, i * 12);
    }
    gl.bindVertexArray(null);
    shadowMap();
    skyMap();
  }

  function shadowMap() {
    face();
    // A phone gets a quarter of the texels: the picture is smaller, and so is its memory.
    const wanted = Math.max(canvas.width, canvas.height) > 1400 ? 4096 : 2048;
    sun.size = Math.min(wanted, gl.getParameter(gl.MAX_TEXTURE_SIZE));

    sun.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sun.texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, sun.size, sun.size);
    // One map, read two ways: asked whether a point is lit, with the answer
    // smoothed; and asked how far off the nearest thing is, as it stands.
    sun.asked = sampler(gl.LINEAR, gl.COMPARE_REF_TO_TEXTURE);
    sun.read = sampler(gl.NEAREST, gl.NONE);
    sun.target = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, sun.target);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, sun.texture, 0);
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // Turn the sun to a new direction. Emptying the pane makes the next frame
  // draw the shadows again, from there.
  function aim(direction) {
    sun.to = normalize(direction);
    face();
  }

  // Where the sun stands, and how deep the board is as it sees it.
  function face() {
    const [w, h] = model.size;
    const to = sun.to;
    const middle = [w / 2, h / 2, 0];
    sun.view = lookAt(
      [middle[0] + to[0] * 4000, middle[1] + to[1] * 4000, to[2] * 4000],
      middle,
      [0, 0, 1]
    );
    // Near and far take in the whole board: what shades a place can stand
    // anywhere between it and the sun.
    let near = Infinity;
    let far = -Infinity;
    for (const x of [0, w])
      for (const y of [0, h])
        for (const z of [-12, TALLEST]) {
          const p = transform(sun.view, [x, y, z]);
          near = Math.min(near, -p[2]);
          far = Math.max(far, -p[2]);
        }
    sun.near = near;
    sun.far = far;
    sun.pane = '';
    sun.board = reach([
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ]);
  }

  function sampler(filter, compare) {
    const made = gl.createSampler();
    gl.samplerParameteri(made, gl.TEXTURE_MIN_FILTER, filter);
    gl.samplerParameteri(made, gl.TEXTURE_MAG_FILTER, filter);
    gl.samplerParameteri(made, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(made, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.samplerParameteri(made, gl.TEXTURE_COMPARE_MODE, compare);
    gl.samplerParameteri(made, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    return made;
  }

  // A picture to draw into: a texture, and the framebuffer that leads to it.
  function target(width, height, format, attachment) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, format, width, height);
    const filter = attachment === gl.DEPTH_ATTACHMENT ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);
    return { texture: texture, buffer: buffer };
  }

  // The sky map (SKY_FRAGMENT), made once: the city's heights as the sky
  // sees them, then how much sky each cell sees, then that smoothed. Only
  // the last is kept. A cell is a meter, or two where the shadow map is
  // small too, on a phone.
  function skyMap() {
    const [w, h] = model.size;
    const cells = sun.size >= 4096 ? [4096, 2048] : [2048, 1024];
    const whole = gl.createVertexArray();
    const look = program(gl, WHOLE_VERTEX, SKY_FRAGMENT);
    const smooth = program(gl, WHOLE_VERTEX, SMOOTH_FRAGMENT);
    const heights = target(cells[0], cells[1], gl.DEPTH_COMPONENT24, gl.DEPTH_ATTACHMENT);
    const rough = target(cells[0], cells[1], gl.RGBA8, gl.COLOR_ATTACHMENT0);
    sky = target(cells[0], cells[1], gl.RGBA8, gl.COLOR_ATTACHMENT0);
    gl.viewport(0, 0, cells[0], cells[1]);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindSampler(3, null);

    // Straight down from a kilometer up, the board filling the picture.
    gl.bindFramebuffer(gl.FRAMEBUFFER, heights.buffer);
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.useProgram(depth.id);
    gl.uniformMatrix4fv(
      depth.at.uView,
      false,
      multiply(
        orthographic(-w / 2, w / 2, -h / 2, h / 2, 1000 - TALLEST - 10, 1013),
        lookAt([w / 2, h / 2, 1000], [w / 2, h / 2, 0], [0, 1, 0])
      )
    );
    gl.bindVertexArray(city);
    gl.drawElements(gl.TRIANGLES, model.solid, gl.UNSIGNED_INT, 0);

    gl.disable(gl.DEPTH_TEST);
    gl.bindVertexArray(whole);
    const pass = function (made, from, name, to) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, to.buffer);
      gl.useProgram(made.id);
      gl.bindTexture(gl.TEXTURE_2D, from.texture);
      gl.uniform1i(made.at[name], 3);
      if (made.at.uCell) gl.uniform1f(made.at.uCell, cells[0] / w);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    pass(look, heights, 'uHeight', rough);
    pass(smooth, rough, 'uRough', sky);

    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    for (const spent of [heights, rough]) {
      gl.deleteTexture(spent.texture);
      gl.deleteFramebuffer(spent.buffer);
    }
    gl.deleteFramebuffer(sky.buffer);
    gl.deleteVertexArray(whole);
    gl.deleteProgram(look.id);
    gl.deleteProgram(smooth.id);
  }

  // The box, in the sun's own view, round some points of the ground and
  // what stands on them: up to the height of all but the towers, whose tops
  // nothing shades.
  function reach(points) {
    const box = [Infinity, -Infinity, Infinity, -Infinity];
    for (const point of points)
      for (const z of [-12, 110]) {
        const p = transform(sun.view, [point[0], point[1], z]);
        box[0] = Math.min(box[0], p[0]);
        box[1] = Math.max(box[1], p[0]);
        box[2] = Math.min(box[2], p[1]);
        box[3] = Math.max(box[3], p[1]);
      }
    return box;
  }

  // Fit the sun's window round the ground the camera can see, and redraw the
  // shadows if that has changed. The window moves in whole texels and grows
  // in steps, so shadow edges hold still while the camera drifts.
  function castShadows(view) {
    const seen = [
      ground(0, 0, view),
      ground(camera.width, 0, view),
      ground(camera.width, camera.height, view),
      ground(0, camera.height, view),
    ];
    // Never more than the board; and all of it when a corner of the picture
    // looks over the horizon and could be seeing anywhere.
    let box = sun.board;
    if (seen.every(Boolean)) {
      const near = reach(seen);
      box = [
        Math.max(box[0], near[0]),
        Math.min(box[1], near[1]),
        Math.max(box[2], near[2]),
        Math.min(box[3], near[3]),
      ];
    }
    const widest = Math.max(box[1] - box[0], box[3] - box[2], 120) * 1.04;
    // Grow the moment it must, but shrink only when there is plenty to
    // spare. A window sized to fit exactly would flick between two sizes as
    // the camera turned, and every flick is a twitch in every shadow.
    if (widest > sun.side || widest < sun.side / 1.7)
      sun.side = Math.pow(1.25, Math.ceil(Math.log(widest) / Math.log(1.25)));
    const side = sun.side;
    const texel = side / sun.size;
    const left = Math.floor(((box[0] + box[1]) / 2 - side / 2) / texel) * texel;
    const bottom = Math.floor(((box[2] + box[3]) / 2 - side / 2) / texel) * texel;
    const pane = [left, bottom, side].join();
    if (pane === sun.pane) return;
    sun.pane = pane;
    sun.texel = texel;
    sun.matrix = multiply(
      orthographic(left, left + side, bottom, bottom + side, sun.near, sun.far),
      sun.view
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, sun.target);
    gl.viewport(0, 0, sun.size, sun.size);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.useProgram(depth.id);
    gl.uniformMatrix4fv(depth.at.uView, false, sun.matrix);
    gl.bindVertexArray(city);
    gl.drawElements(gl.TRIANGLES, model.solid, gl.UNSIGNED_INT, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // Match the canvas to its box on the page, at up to two device pixels each.
  function fit() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * scale));
    const height = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    camera.width = canvas.clientWidth || 1;
    camera.height = canvas.clientHeight || 1;
  }

  // A view is a place on the ground, a heading, a pitch, how many meters of
  // ground fill the height of the picture, and the lens in degrees.
  function place(view) {
    fit();
    const lens = view.lens * RAD;
    const back = view.span / 2 / Math.tan(lens / 2);
    const h = view.heading * RAD;
    const p = view.pitch * RAD;
    const toward = [Math.sin(h) * Math.cos(p), Math.cos(h) * Math.cos(p), -Math.sin(p)];
    const target = [view.x, view.y, view.z || 0];
    const eye = [
      target[0] - toward[0] * back,
      target[1] - toward[1] * back,
      target[2] - toward[2] * back,
    ];
    // Far enough either side of the target to take in the whole board.
    const range = 7000;
    const near = Math.max(back - range, back * 0.03, 2);
    camera.eye = eye;
    camera.back = back;
    camera.matrix = multiply(
      perspective(lens, camera.width / camera.height, near, back + range),
      lookAt(eye, target, [0, 0, 1])
    );
  }

  function frame(view, look) {
    place(view);
    castShadows(view);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(look.paper[0], look.paper[1], look.paper[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.disable(gl.BLEND);

    gl.useProgram(solid.id);
    gl.uniformMatrix4fv(solid.at.uCamera, false, camera.matrix);
    gl.uniformMatrix4fv(solid.at.uSun, false, sun.matrix);
    gl.uniform2f(solid.at.uBias, sun.texel * 1.6, (sun.texel * 1.2) / (sun.far - sun.near));
    const toSun = sun.to;
    gl.uniform3fv(solid.at.uSunDir, toSun);
    gl.uniform3fv(solid.at.uEye, camera.eye);
    gl.uniform3fv(solid.at.uTint, look.tints);
    gl.uniform3fv(solid.at.uLamp, look.lamp);
    // The sky's light is the look's to choose. The sun's is whatever makes
    // the two add up to white on open ground, so a color means what it says.
    gl.uniform3fv(solid.at.uSkyLight, look.sky);
    // [WARNING] Divided by the sun's height, a low sun would make every wall
    // facing it glare; past twenty degrees down it adds no more, so a
    // morning is dimmer than noon, as it is.
    gl.uniform3fv(
      solid.at.uSunLight,
      look.sky.map((part) => (1 - part) / Math.max(toSun[2], 0.34))
    );
    gl.uniform3fv(solid.at.uAbove, look.above);
    gl.uniform3fv(solid.at.uTone, look.tone);
    gl.uniform1f(solid.at.uPaint, look.paint);
    gl.uniform3fv(solid.at.uGlass, look.glass);
    // Haze belongs to the short lens; the long one sees the far side as clearly as the near.
    const haze = Math.max(0, Math.min(1, (view.lens - 12) / 24)) * 0.9;
    gl.uniform4f(solid.at.uFog, look.paper[0], look.paper[1], look.paper[2], haze);
    gl.uniform2f(solid.at.uFar, camera.back * 2.2, 2600);
    gl.uniform2fv(solid.at.uBoard, model.size);
    gl.uniform3f(solid.at.uMap, 1 / sun.size, sun.texel, sun.far - sun.near);
    for (const [unit, texture, how, name] of [
      [0, sun.texture, sun.asked, 'uShadow'],
      [1, sun.texture, sun.read, 'uDepth'],
      [2, sky.texture, null, 'uSky'],
    ]) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.bindSampler(unit, how);
      gl.uniform1i(solid.at[name], unit);
    }
    gl.bindVertexArray(city);
    gl.drawElements(gl.TRIANGLES, model.solid, gl.UNSIGNED_INT, 0);

    // What lies on the ground is painted over it in order, writing no depth,
    // so two flat things at nearly one height cannot flicker.
    gl.depthMask(false);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(-2, -4);
    gl.drawElements(
      gl.TRIANGLES,
      model.index.length - model.solid,
      gl.UNSIGNED_INT,
      model.solid * 4
    );
    gl.disable(gl.POLYGON_OFFSET_FILL);

    // The walk: a pale casing, then the line; and once more, faintly, where
    // a building stands in front of it.
    gl.useProgram(path.id);
    gl.uniformMatrix4fv(path.at.uCamera, false, camera.matrix);
    gl.uniform2f(path.at.uPixel, 2 / camera.width, 2 / camera.height);
    gl.bindVertexArray(walk);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const count = (model.route.length - 1) * 6;
    const stroke = function (width, color, alpha, dash) {
      gl.uniform1f(path.at.uWidth, width);
      gl.uniform4f(path.at.uColor, color[0], color[1], color[2], alpha);
      gl.uniform2f(path.at.uDash, look.walked, dash);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    };
    const dash = (view.span / camera.height) * 14;
    gl.depthFunc(gl.GREATER);
    stroke(3, look.ink, 0.22, 0);
    gl.depthFunc(gl.LEQUAL);
    stroke(7, look.paper, 0.9, 0);
    stroke(3.5, look.ink, 1, dash);
    gl.depthMask(true);
    gl.bindVertexArray(null);
  }

  // Where a point of the model falls on the canvas, in CSS pixels.
  function screen(point) {
    const p = transform(camera.matrix, point);
    return {
      x: ((p[0] / p[3]) * 0.5 + 0.5) * camera.width,
      y: (0.5 - (p[1] / p[3]) * 0.5) * camera.height,
      ahead: p[3] > 0,
    };
  }

  // The point of the ground under a pixel: where the ray through it lands.
  function ground(x, y, view) {
    const lens = view.lens * RAD;
    const h = view.heading * RAD;
    const p = view.pitch * RAD;
    const toward = [Math.sin(h) * Math.cos(p), Math.cos(h) * Math.cos(p), -Math.sin(p)];
    const right = normalize(cross(toward, [0, 0, 1]));
    const up = cross(right, toward);
    const tall = Math.tan(lens / 2);
    const sx = ((x / camera.width) * 2 - 1) * tall * (camera.width / camera.height);
    const sy = (1 - (y / camera.height) * 2) * tall;
    const ray = [
      toward[0] + right[0] * sx + up[0] * sy,
      toward[1] + right[1] * sx + up[1] * sy,
      toward[2] + right[2] * sx + up[2] * sy,
    ];
    if (ray[2] > -1e-4) return null;
    const t = -camera.eye[2] / ray[2];
    return [camera.eye[0] + ray[0] * t, camera.eye[1] + ray[1] * t];
  }

  fit();
  setup();
  return { frame: frame, place: place, screen: screen, ground: ground, setup: setup, aim: aim };
}
