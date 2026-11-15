/* The drawing: one mesh, one sun, and WebGL with no library between.
 *
 * Three small programs. `depth` draws the city from the sun's side into a
 * shadow map, fitted round whatever the camera can see so a close view gets
 * sharp shadows and a far one gets all of them. `solid` draws it from the camera:
 * a tone for every surface, the sun and the sky on it, the shadow map for
 * what the sun cannot reach, and windows worked out from how far along a
 * wall a point is. `path` draws the walk as a line a few pixels wide however
 * far away it is.
 *
 * The camera is always a lens. An isometric view is a long one, so far back
 * that parallel lines stay parallel; flying along the walk shortens it. One
 * camera does both, and moving between them is only arithmetic.
 */

import { STRIDE } from './city.js';

const RAD = Math.PI / 180;
// Where the sun stands: south-west and 43 degrees up, a London afternoon.
// Looking north, the faces you see are the lit ones.
const SUN = [-0.52, -0.5, 0.69];
const TALLEST = 320;

const DEPTH_VERTEX = `#version 300 es
layout(location = 0) in vec4 aPlace;
uniform mat4 uSun;
void main() {
  gl_Position = uSun * vec4(aPlace.xy * 0.1, aPlace.z * 0.01 - 12.0, 1.0);
}`;

const DEPTH_FRAGMENT = `#version 300 es
void main() {}`;

const SOLID_VERTEX = `#version 300 es
layout(location = 0) in vec4 aPlace;   // x, y, z, and u along the wall
layout(location = 1) in vec3 aNormal;
layout(location = 2) in float aTone;
layout(location = 3) in vec2 aWall;    // its length, its base
layout(location = 4) in vec2 aKind;    // material, seed
layout(location = 5) in float aTop;
uniform mat4 uCamera;
uniform mat4 uSun;
uniform vec2 uBias;    // how far to step off the surface, and how much depth to forgive
out vec3 vAt;
out vec3 vNormal;
out vec3 vShadow;
out vec3 vWall;        // meters along, meters up, meters to the top here
flat out vec4 vLook;   // material, tone, seed, wall length in meters
flat out vec2 vFlags;  // glass, no windows
void main() {
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
uniform sampler2DShadow uShadow;
uniform float uTexel;
uniform vec3 uSunDir;
uniform vec3 uEye;
uniform float uShade[16];
uniform vec4 uLight;   // sky, sun, darkest wall, lightest wall
uniform vec3 uGlass;   // how dark a window is by day, how many are lit, how bright
uniform vec4 uFog;     // the paper's color, and how much of it
uniform vec2 uFar;     // where the haze starts, and how deep it is
out vec4 color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Nine taps round the point, each already smoothed by the sampler.
float sunlit() {
  if (vShadow.x < 0.0 || vShadow.x > 1.0 || vShadow.y < 0.0 || vShadow.y > 1.0) return 1.0;
  float lit = 0.0;
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
      lit += texture(uShadow, vec3(vShadow.xy + vec2(x, y) * uTexel, vShadow.z));
  return lit / 9.0;
}

void main() {
  vec3 n = normalize(vNormal);
  int material = int(vLook.x + 0.5);
  float facing = max(dot(n, uSunDir), 0.0);
  float direct = facing > 0.0 ? facing * sunlit() : 0.0;
  // The sky lights a roof fully and a wall less; a little comes back off
  // the ground on the side away from the sun.
  float sky = mix(0.74, 1.0, n.z * 0.5 + 0.5) + 0.07 * max(dot(n.xy, -normalize(uSunDir.xy)), 0.0);
  float light = uLight.x * sky + uLight.y * direct;

  float tone = material < 2 ? mix(uLight.z, uLight.w, vLook.y / 15.0) : uShade[material];
  float glow = 0.0;

  // No two buildings are quite one tone.
  if (material < 2) tone *= 0.955 + 0.09 * hash(vec2(vLook.z, float(material)));

  if (material == 0) {
    // Walls stand darker where they meet the ground, and carry a drawn line
    // a pixel wide down each corner and along the top.
    light *= 0.8 + 0.2 * smoothstep(0.0, 9.0, vWall.y);
    float du = fwidth(vWall.x);
    float dv = fwidth(vWall.y);
    float corner = min(vWall.x, vLook.w - vWall.x) / max(du, 1e-4);
    float eave = (vWall.z - vWall.y) / max(dv, 1e-4);
    tone *= 1.0 - 0.2 * (1.0 - smoothstep(0.6, 1.6, min(corner, eave)));
    float story = 3.4;
    float rows = floor((vWall.z - 0.6) / story);
    float columns = max(1.0, floor(vLook.w / 3.1 + 0.5));
    if (vFlags.y < 0.5 && rows >= 1.0 && vLook.w > 2.4) {
      vec2 cell = vec2(vWall.x / vLook.w * columns, vWall.y / story);
      vec2 f = fract(cell);
      vec2 w = fwidth(cell);
      vec2 lo = vFlags.x > 0.5 ? vec2(0.06, 0.1) : vec2(0.24, 0.3);
      vec2 hi = vFlags.x > 0.5 ? vec2(0.94, 0.9) : vec2(0.76, 0.8);
      vec2 pane = smoothstep(lo - w, lo + w, f) * (1.0 - smoothstep(hi - w, hi + w, f));
      // Too small to draw is not drawn, rather than left to shimmer.
      float seen = 1.0 - smoothstep(0.16, 0.42, max(w.x, w.y));
      float window = pane.x * pane.y * seen * step(cell.y, rows);
      float lamp = step(1.0 - uGlass.y, hash(floor(cell) + vLook.z));
      tone *= 1.0 - uGlass.x * window * (1.0 - lamp * step(0.001, uGlass.y));
      glow = uGlass.z * window * lamp;
      // Glass throws the sun back at whoever stands in the right place.
      vec3 back = reflect(normalize(vAt - uEye), n);
      glow += 0.35 * window * vFlags.x * pow(max(dot(back, uSunDir), 0.0), 18.0) * step(uGlass.y, 0.001);
    }
  } else if (material == 3) {
    // The river: slow crossing swells, and nothing when it is far away.
    vec2 p = vAt.xy;
    float swell = sin(p.x * 0.31 + sin(p.y * 0.17) * 1.7) * sin(p.y * 0.43 + sin(p.x * 0.11) * 1.9);
    float fine = 1.0 - smoothstep(0.2, 1.2, fwidth(p.x) + fwidth(p.y));
    tone *= 1.0 + 0.05 * swell * fine;
  } else if (material == 11) {
    tone *= 0.88 + 0.24 * (vLook.y / 15.0);
  }

  float value = tone * light + glow;
  float haze = uFog.a * smoothstep(uFar.x, uFar.x + uFar.y, distance(vAt, uEye));
  color = vec4(mix(vec3(value), uFog.rgb, haze), 1.0);
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

  let depth, solid, path, city, walk;
  const camera = { matrix: null, eye: [0, 0, 0], width: 1, height: 1 };
  // The sun looks the same way all day; only the window it looks through moves.
  const sun = { view: null, matrix: null, near: 0, far: 0, pane: '', size: 0, texel: 1 };

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
  }

  function shadowMap() {
    const [w, h] = model.size;
    const to = normalize(SUN);
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
    // A phone gets a quarter of the texels: the picture is smaller, and so is its memory.
    const wanted = Math.max(canvas.width, canvas.height) > 1400 ? 4096 : 2048;
    sun.size = Math.min(wanted, gl.getParameter(gl.MAX_TEXTURE_SIZE));

    sun.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sun.texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, sun.size, sun.size);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    sun.target = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, sun.target);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, sun.texture, 0);
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
    const side = Math.pow(1.25, Math.ceil(Math.log(widest) / Math.log(1.25)));
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
    gl.uniformMatrix4fv(depth.at.uSun, false, sun.matrix);
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
    gl.uniform3fv(solid.at.uSunDir, normalize(SUN));
    gl.uniform3fv(solid.at.uEye, camera.eye);
    gl.uniform1fv(solid.at.uShade, look.shade);
    gl.uniform4fv(solid.at.uLight, look.light);
    gl.uniform3fv(solid.at.uGlass, look.glass);
    // Haze belongs to the short lens; the long one sees the far side as clearly as the near.
    const haze = Math.max(0, Math.min(1, (view.lens - 12) / 24)) * 0.9;
    gl.uniform4f(solid.at.uFog, look.paper[0], look.paper[1], look.paper[2], haze);
    gl.uniform2f(solid.at.uFar, camera.back * 2.2, 2600);
    gl.uniform1f(solid.at.uTexel, 1 / sun.size);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sun.texture);
    gl.uniform1i(solid.at.uShadow, 0);
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
  return { frame: frame, place: place, screen: screen, ground: ground, setup: setup };
}
