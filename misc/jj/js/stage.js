// Draws the repository in three dimensions on a plain 2D canvas.
//
// The three axes each mean something:
//   up      history: a commit sits one row above its parent
//   across  lines of work: each one gets a lane, the trunk on the right
//   back    time: every operation pushes the older versions one sheet further away
//
// Nothing here knows about jj commands. The stage is handed "the repository after operation
// N", works out where everything should be, and eases the picture toward it.
(function (JJ) {
  'use strict';

  const TAU = Math.PI * 2;
  const ROW_GAP = 1.45; // world units between a commit and its child
  const LANE_GAP = 4.6; // between lines of work; wide enough for a label to sit in the gap
  const NARROW_LANE_GAP = 4.2; // on a phone, where the label gives way before the picture does
  const NARROW = 560; // pixels of free width below which the picture is drawn more tightly
  const TOP_BAR = 44; // on a phone, the strip along the top that the theme switch and key sit in
  const SHEET_GAP = 1.5; // between one operation's sheet and the next
  const NODE_RADIUS = 0.33;
  const ORBIT_RADIUS = 0.68;
  const ORBIT_TILT = 0.3;
  const LABEL_GAP = 18; // pixels between the orbit of file changes and the commit's label
  const EASE_RATE = 4; // higher settles faster
  const FIELD_OF_VIEW = (32 * Math.PI) / 180;
  const MAX_SCALE = 76; // pixels per world unit; keeps a short graph from filling the screen
  const MAX_SHEETS = 6;
  const DEFAULT_LOOK = { yaw: -0.42, pitch: 0.2 };
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  // Canvas colors come from the stylesheet, so the picture follows the page's theme.
  const COLOR_VARS = {
    bg: '--bg',
    ink: '--ink',
    dim: '--ink-dim',
    line: '--line',
    wc: '--wc',
    commit: '--commit',
    immutable: '--immutable',
    conflict: '--conflict',
    chg: '--chg',
    cid: '--cid',
    ok: '--ok',
    bm: '--bm',
    sheet: '--sheet',
    onOrb: '--on-orb',
    'app.js': '--file-app',
    'style.css': '--file-style',
    'README.md': '--file-readme',
  };

  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  function channels(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }

  function rgba(hex, alpha) {
    const [r, g, b] = channels(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function mix(hexA, hexB, amount) {
    const a = channels(hexA);
    const b = channels(hexB);
    const blend = a.map((value, i) => Math.round(value + (b[i] - value) * amount));
    return `rgb(${blend.join(', ')})`;
  }

  class Stage {
    constructor(canvas, repo, panel, key) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.repo = repo;
      this.panel = panel;
      this.key = key;
      this.nodes = new Map(); // commit ID -> where its shape is now and where it is headed
      this.blocks = new Map(); // hunk ID -> the same, for the file-change blocks
      this.cam = {
        ...DEFAULT_LOOK,
        scale: 60,
        tx: 0,
        ty: 0,
        tz: 0,
        cx: 0,
        cy: 0,
        cursor: 0,
        sheets: 0,
        left: 0,
        top: 0,
      };
      this.goal = { ...this.cam };
      this.user = { yaw: 0, pitch: 0, zoom: 1 };
      this.state = null;
      this.step = null;
      this.clock = 0;
      this.flashAt = 0;
      this.still = false; // true: no easing and no idle motion
      this.readColors();
      this.listen();
      this.resize();
    }

    // ---- Public ------------------------------------------------------------------------

    show(step, instant) {
      this.step = step;
      this.state = this.repo.stateAt(step.op);
      this.flashAt = this.clock;
      this.setGoals();
      this.aim();
      if (instant || this.still) this.settle();
    }

    start() {
      let last = performance.now();
      const frame = (now) => {
        const elapsed = Math.min(0.05, (now - last) / 1000);
        last = now;
        this.clock += elapsed;
        this.update(elapsed);
        this.draw();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    readColors() {
      const style = getComputedStyle(document.documentElement);
      this.colors = {};
      for (const [name, variable] of Object.entries(COLOR_VARS)) {
        this.colors[name] = style.getPropertyValue(variable).trim();
      }
    }

    resetView() {
      this.user = { yaw: 0, pitch: 0, zoom: 1 };
      this.aim();
    }

    // ---- Where things should be ---------------------------------------------------------

    // A commit rests on the sheet of the last operation that could still see it. Visible
    // commits are on the front sheet; rewritten and abandoned ones fall back, one sheet for
    // every operation since.
    setGoals() {
      const { repo, state } = this;
      for (const commit of repo.commits.values()) {
        const node = this.nodeFor(commit.id);
        const seen = repo.lastVisibleOp(commit.id, state.index);
        node.goalAlpha = seen < 0 ? 0 : 1;
        if (seen < 0) continue;
        const at = repo.stateAt(seen).layout.pos.get(commit.id);
        node.lane = at.lane;
        node.gx = -at.lane * this.laneGap;
        node.gy = at.row * ROW_GAP;
        node.gz = -(state.index - seen) * SHEET_GAP;
        if (!node.placed) this.place(node, commit);
      }

      const holders = new Map();
      for (const id of state.view.visible) {
        const hunks = repo.get(id).hunks;
        hunks.forEach((hunkId, slot) => holders.set(hunkId, { id, phase: slot / hunks.length }));
      }
      for (const hunkId of repo.hunks.keys()) {
        const block = this.blockFor(hunkId);
        const holder = holders.get(hunkId);
        block.goalAlpha = holder ? 1 : 0;
        if (!holder) continue;
        block.owner = holder.id;
        block.goalPhase = holder.phase;
        if (!block.placed) {
          const owner = this.nodes.get(holder.id);
          Object.assign(block, {
            x: owner.x,
            y: owner.y,
            z: owner.z,
            phase: holder.phase,
            placed: true,
          });
        }
      }
    }

    nodeFor(id) {
      if (!this.nodes.has(id)) {
        this.nodes.set(id, {
          x: 0,
          y: 0,
          z: 0,
          alpha: 0,
          size: 1,
          gx: 0,
          gy: 0,
          gz: 0,
          goalAlpha: 0,
          lane: 0,
          placed: false,
        });
      }
      return this.nodes.get(id);
    }

    blockFor(id) {
      if (!this.blocks.has(id)) {
        this.blocks.set(id, {
          x: 0,
          y: 0,
          z: 0,
          alpha: 0,
          phase: 0,
          goalPhase: 0,
          goalAlpha: 0,
          owner: null,
          placed: false,
        });
      }
      return this.blocks.get(id);
    }

    // A commit enters where it came from: a rewrite starts on top of the version it
    // replaces, and a brand-new change grows out of its parent.
    place(node, commit) {
      const from = this.nodes.get(commit.predecessor) || this.nodes.get(commit.parents[0]);
      const origin = from && from.placed ? from : { x: node.gx, y: node.gy, z: node.gz };
      Object.assign(node, {
        x: origin.x,
        y: origin.y,
        z: origin.z,
        alpha: 0,
        size: commit.predecessor ? 1 : 0.2,
        placed: true,
      });
    }

    // Chooses the zoom and the screen position that fit the graph, its labels, and the trail
    // of older versions into the space the text panel leaves free.
    aim() {
      const { layout, index } = this.state;
      const area = this.area;
      const sheets = this.step.sheets ? 1 : 0;
      const look = this.step.look || DEFAULT_LOOK;
      // Leave room for a lane that has just emptied: its commits are still there, one sheet back.
      const lanes = Math.max(layout.lanes, index ? this.repo.stateAt(index - 1).layout.lanes : 1);
      const narrow = area.w < NARROW;
      const spanX = (lanes - 1) * this.laneGap;
      const spanY = (layout.rows - 1) * ROW_GAP;
      // Room on the left for versions that have fallen back. A phone gives them less, and
      // lets the older sheets run off the edge, so the commits stay large enough to read.
      const trail = (narrow ? 0.6 : 1.3) + sheets * (narrow ? 0.8 : 4.2);
      const rise = 2.7 + sheets * 2.6; // room above and below, more when sheets climb the screen
      this.labelRoom = Math.min(250, area.w * (narrow ? 0.4 : 0.5));

      const fitWide = (area.w - this.labelRoom - LABEL_GAP - 24) / (spanX + trail + ORBIT_RADIUS);
      const fitTall = area.h / (spanY + rise);
      const scale = Math.min(MAX_SCALE, fitWide, fitTall) * this.user.zoom;
      const left = (spanX / 2 + trail) * scale;
      const right = (spanX / 2 + ORBIT_RADIUS) * scale + LABEL_GAP + this.labelRoom;

      Object.assign(this.goal, {
        yaw: look.yaw,
        pitch: look.pitch,
        scale,
        tx: -spanX / 2,
        ty: spanY / 2,
        tz: -sheets * 2,
        cx: area.x + area.w / 2 + (left - right) / 2,
        cy: area.y + area.h / 2,
        cursor: this.state.index,
        sheets,
        left: -spanX - 1.3,
        top: spanY + 0.95,
      });
    }

    settle() {
      for (const node of this.nodes.values()) {
        Object.assign(node, { x: node.gx, y: node.gy, z: node.gz, alpha: node.goalAlpha, size: 1 });
      }
      for (const block of this.blocks.values()) {
        const owner = this.nodes.get(block.owner);
        if (owner) Object.assign(block, { x: owner.x, y: owner.y, z: owner.z });
        Object.assign(block, { alpha: block.goalAlpha, phase: block.goalPhase });
      }
      Object.assign(this.cam, this.goal);
    }

    update(elapsed) {
      const ease = this.still ? 1 : 1 - Math.exp(-elapsed * EASE_RATE);
      const toward = (now, goal) => now + (goal - now) * ease;

      for (const node of this.nodes.values()) {
        node.x = toward(node.x, node.gx);
        node.y = toward(node.y, node.gy);
        node.z = toward(node.z, node.gz);
        node.alpha = toward(node.alpha, node.goalAlpha);
        node.size = toward(node.size, 1);
        // Once gone, forget the position, so a commit that returns enters afresh.
        if (node.goalAlpha === 0 && node.alpha < 0.02) node.placed = false;
      }
      for (const block of this.blocks.values()) {
        const owner = this.nodes.get(block.owner);
        if (owner) {
          block.x = toward(block.x, owner.x);
          block.y = toward(block.y, owner.y);
          block.z = toward(block.z, owner.z);
        }
        block.alpha = toward(block.alpha, block.goalAlpha);
        block.phase = toward(block.phase, block.goalPhase);
        if (block.goalAlpha === 0 && block.alpha < 0.02) block.placed = false;
      }
      for (const key of Object.keys(this.goal))
        this.cam[key] = toward(this.cam[key], this.goal[key]);
    }

    // ---- Camera ------------------------------------------------------------------------

    resize() {
      const ratio = window.devicePixelRatio || 1;
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      this.canvas.width = Math.round(width * ratio);
      this.canvas.height = Math.round(height * ratio);
      this.size = { width, height, ratio };

      // The panel is a column beside the picture on wide screens and a sheet under it on
      // narrow ones. Either way the picture gets whatever the panel leaves.
      const panel = this.panel.getBoundingClientRect();
      const beside = panel.height > height * 0.7;
      this.area = beside
        ? { x: panel.right, y: 0, w: width - panel.right, h: height }
        : { x: 0, y: TOP_BAR, w: width, h: panel.top - TOP_BAR };
      // Beside the panel, the key runs along the bottom; the picture stops short of it.
      if (beside && this.key.open) this.area.h = this.key.getBoundingClientRect().top - 8;
      this.focal = this.area.h / 2 / Math.tan(FIELD_OF_VIEW / 2);
      this.laneGap = this.area.w < NARROW ? NARROW_LANE_GAP : LANE_GAP;
      if (this.state) {
        this.setGoals();
        this.aim();
        if (this.still) this.settle();
      }
    }

    prepareCamera() {
      const sway = this.still ? 0 : Math.sin(this.clock * 0.4) * 0.035;
      const yaw = clamp(this.cam.yaw + this.user.yaw, -1.45, 0.6) + sway;
      const pitch = clamp(this.cam.pitch + this.user.pitch, -0.2, 1);
      this.lens = {
        sinY: Math.sin(yaw),
        cosY: Math.cos(yaw),
        sinP: Math.sin(pitch),
        cosP: Math.cos(pitch),
        distance: this.focal / this.cam.scale,
      };
      this.fontSize = clamp((13 * this.cam.scale) / 66, 10.5, 14);
      this.spin = this.still ? 0.9 : this.clock * 0.45;
    }

    // World position to screen position. `scale` is pixels per world unit at that depth.
    project(x, y, z) {
      const { cam, lens } = this;
      const dx = x - cam.tx;
      const dy = y - cam.ty;
      const dz = z - cam.tz;
      const acrossX = dx * lens.cosY - dz * lens.sinY;
      const acrossZ = dx * lens.sinY + dz * lens.cosY;
      const up = dy * lens.cosP - acrossZ * lens.sinP;
      const toward = dy * lens.sinP + acrossZ * lens.cosP;
      const depth = Math.max(0.1, lens.distance - toward);
      const scale = this.focal / depth;
      return { x: cam.cx + acrossX * scale, y: cam.cy - up * scale, scale, depth };
    }

    // How strongly to draw something that sits `back` operations behind the present. The
    // reach is longer while the operation sheets are on show.
    fadeBehind(back) {
      const reach = 3.3 + this.cam.sheets * 3.4;
      const strength = (steps) => 0.85 * Math.max(0, 1 - steps / reach);
      if (back <= 0) return 1;
      return back < 1 ? 1 + (strength(1) - 1) * back : strength(back);
    }

    // ---- Drawing -----------------------------------------------------------------------
    // Everything is queued with its distance from the camera, then painted far to near.

    draw() {
      const { ctx } = this;
      const { width, height, ratio } = this.size;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (!this.state) return;

      this.prepareCamera();
      this.drawFloor();
      const items = [];
      this.queueSheets(items);
      this.queueEdges(items);
      this.queueThreads(items);
      this.queueCommits(items);
      this.queueBlocks(items);
      items.sort((a, b) => b.depth - a.depth);
      for (const item of items) item.draw();
      ctx.globalAlpha = 1;
    }

    // A field of dots under the graph, so the eye has a ground to read depth against.
    drawFloor() {
      const { ctx } = this;
      ctx.fillStyle = this.colors.line;
      for (let x = -11; x <= 5; x += 1) {
        for (let z = -12; z <= 3; z += 1) {
          const p = this.project(x, -0.95, z);
          const fade = clamp(1 - Math.hypot(x + 2, z + 3) / 9.5, 0, 1);
          if (p.depth < 1 || fade === 0) continue;
          const dot = clamp(p.scale * 0.035, 1, 2.4);
          ctx.globalAlpha = 0.55 * fade;
          ctx.fillRect(p.x - dot / 2, p.y - dot / 2, dot, dot);
        }
      }
    }

    queueSheets(items) {
      const { cam, state } = this;
      if (cam.sheets < 0.02) return;
      for (let op = Math.max(0, state.index - MAX_SHEETS); op <= state.index; op += 1) {
        const back = cam.cursor - op;
        const fade =
          cam.sheets * clamp(1 - back / (MAX_SHEETS + 0.5), 0, 1) * clamp(back + 1, 0, 1);
        if (fade < 0.02) continue;
        const z = -back * SHEET_GAP;
        const corners = [
          [cam.left, cam.top],
          [1.3, cam.top],
          [1.3, -0.8],
          [cam.left, -0.8],
        ].map(([x, y]) => this.project(x, y, z));
        const middle = this.project((cam.left + 1.3) / 2, cam.top / 2, z);
        items.push({
          depth: middle.depth + 0.6,
          draw: () => this.drawSheet(op, corners, z, back, fade),
        });
      }
    }

    drawSheet(op, corners, z, back, fade) {
      const { ctx, colors, repo } = this;
      const front = back < 0.5;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      corners.forEach((corner, i) =>
        i ? ctx.lineTo(corner.x, corner.y) : ctx.moveTo(corner.x, corner.y)
      );
      ctx.closePath();
      ctx.fillStyle = rgba(colors.sheet, (front ? 0.03 : 0.055) * fade);
      ctx.fill();
      ctx.strokeStyle = rgba(colors.sheet, 0.5 * fade);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Named under its lower left corner, where the labels step back like the log itself.
      const label = `${front ? 'now: ' : ''}${repo.ops[op].desc}`;
      ctx.font = `500 11px ${MONO}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = rgba(colors.sheet, 0.95 * fade);
      ctx.fillText(
        label.length > 44 ? `${label.slice(0, 43)}…` : label,
        corners[3].x + 4,
        corners[3].y + 5
      );
      if (front) return;

      // A small copy of the graph as that operation left it.
      const then = repo.stateAt(op).layout.pos;
      const spot = (id) => {
        const at = then.get(id);
        return this.project(-at.lane * this.laneGap, at.row * ROW_GAP, z);
      };
      ctx.strokeStyle = rgba(colors.dim, 0.35 * fade);
      ctx.fillStyle = rgba(colors.dim, 0.6 * fade);
      for (const id of then.keys()) {
        const p = spot(id);
        const parent = repo.get(id).parents[0];
        if (parent) {
          const q = spot(parent);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.5, p.scale * 0.07), 0, TAU);
        ctx.fill();
      }
    }

    queueEdges(items) {
      for (const id of this.state.view.visible) {
        const child = this.nodes.get(id);
        for (const parentId of this.repo.get(id).parents) {
          const parent = this.nodes.get(parentId);
          const alpha = Math.min(child.alpha, parent.alpha);
          if (alpha < 0.02) continue;
          const points = this.edgePoints(child, parent).map((point) =>
            this.project(point.x, point.y, point.z)
          );
          const depth = (points[0].depth + points[points.length - 1].depth) / 2 + 0.05;
          items.push({
            depth,
            draw: () =>
              this.drawLine(
                points,
                this.colors.line,
                alpha,
                clamp(points[0].scale * 0.045, 1.2, 3.2)
              ),
          });
        }
      }
    }

    // Straight within a lane. Between lanes: leave the child downward, arrive at the parent
    // from the side, the way `jj log` draws a line of work joining the trunk.
    edgePoints(child, parent) {
      if (Math.abs(child.x - parent.x) < 0.05) return [child, parent];
      const drop = child.y - parent.y;
      const bend = [
        child,
        { x: child.x, y: child.y - drop * 0.9, z: child.z },
        { x: parent.x + (child.x - parent.x) * 0.4, y: parent.y, z: parent.z },
        parent,
      ];
      const points = [];
      for (let i = 0; i <= 20; i += 1) {
        const t = i / 20;
        const weights = [(1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t * t * (1 - t), t ** 3];
        const along = (axis) => bend.reduce((sum, point, k) => sum + point[axis] * weights[k], 0);
        points.push({ x: along('x'), y: along('y'), z: along('z') });
      }
      return points;
    }

    // The thread that ties one version of a change to the version it replaced.
    queueThreads(items) {
      for (const [id, node] of this.nodes) {
        const before = this.nodes.get(this.repo.get(id).predecessor);
        if (!before) continue;
        const alpha =
          0.9 *
          Math.min(
            node.alpha * this.fadeBehind(-node.z / SHEET_GAP),
            before.alpha * this.fadeBehind(-before.z / SHEET_GAP)
          );
        if (alpha < 0.02) continue;
        const points = [node, before].map((end) => this.project(end.x, end.y, end.z));
        items.push({
          depth: (points[0].depth + points[1].depth) / 2 + 0.02,
          draw: () => this.drawLine(points, this.colors.chg, alpha, 1, [2, 4]),
        });
      }
    }

    drawLine(points, color, alpha, width, dash) {
      const { ctx } = this;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.setLineDash(dash || []);
      ctx.beginPath();
      points.forEach((point, i) =>
        i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }

    queueCommits(items) {
      for (const [id, node] of this.nodes) {
        const back = -node.z / SHEET_GAP;
        const alpha = node.alpha * this.fadeBehind(back);
        if (alpha < 0.02) continue;
        const commit = this.repo.get(id);
        const p = this.project(node.x, node.y, node.z);
        items.push({ depth: p.depth, draw: () => this.drawCommit(commit, node, p, back, alpha) });
        if (back < 0.5 && commit.hunks.length)
          this.queueOrbit(items, node, p, alpha * (1 - back * 2));
      }
    }

    // A commit in the present is solid. As it falls behind it turns into a hollow shell.
    drawCommit(commit, node, p, back, alpha) {
      const radius = NODE_RADIUS * p.scale * node.size;
      const solid = 1 - clamp(back / 0.5, 0, 1);
      if (solid < 1) this.drawShell(commit, p, radius, back, alpha * (1 - solid));
      if (solid > 0) this.drawSolid(commit, node, p, radius, alpha * solid);
    }

    drawShell(commit, p, radius, back, alpha) {
      const { ctx, colors } = this;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fillStyle = rgba(colors.bg, 0.6);
      ctx.fill();
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colors.dim;
      ctx.stroke();
      ctx.setLineDash([]);
      if (back > 2.4) return;
      // The commit ID it had. Alternate sheets write above and below, so the IDs of
      // neighboring shells in a trail do not land on each other.
      const below = Math.round(back) % 2 === 1;
      ctx.font = `400 ${Math.max(9.5, this.fontSize * 0.78)}px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = below ? 'top' : 'bottom';
      ctx.fillStyle = colors.dim;
      ctx.fillText(commit.id, p.x, p.y + (below ? radius + 5 : -radius - 5));
    }

    drawSolid(commit, node, p, radius, alpha) {
      const { ctx, colors, state } = this;
      const isWorkingCopy = state.view.wc === commit.id;
      const isImmutable = state.immutable.has(commit.id);
      const isConflicted = commit.conflicts.length > 0;
      const color = isImmutable
        ? colors.immutable
        : isConflicted
          ? colors.conflict
          : isWorkingCopy
            ? colors.wc
            : colors.commit;

      ctx.globalAlpha = alpha;
      if (isWorkingCopy) this.drawGlow(p, radius, color);
      if (this.isFresh(commit)) this.drawFlash(p, radius, color, alpha);
      if (isImmutable) this.drawGem(p, radius * (commit.parents.length ? 1.08 : 0.8), color);
      else this.drawOrb(p, radius, color);

      if (isWorkingCopy) {
        ctx.font = `700 ${radius * 1.25}px ${MONO}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = colors.onOrb;
        ctx.fillText('@', p.x, p.y + radius * 0.04);
      } else if (isConflicted) {
        const arm = radius * 0.36;
        this.drawLine(
          [
            { x: p.x - arm, y: p.y - arm },
            { x: p.x + arm, y: p.y + arm },
          ],
          colors.onOrb,
          alpha,
          radius * 0.16
        );
        this.drawLine(
          [
            { x: p.x + arm, y: p.y - arm },
            { x: p.x - arm, y: p.y + arm },
          ],
          colors.onOrb,
          alpha,
          radius * 0.16
        );
      }
      this.drawLabel(commit, node, p, radius, alpha);
    }

    drawOrb(p, radius, color) {
      const { ctx } = this;
      const shade = ctx.createRadialGradient(
        p.x - radius * 0.35,
        p.y - radius * 0.4,
        radius * 0.08,
        p.x,
        p.y,
        radius
      );
      shade.addColorStop(0, mix(color, '#ffffff', 0.72));
      shade.addColorStop(0.45, color);
      shade.addColorStop(1, mix(color, '#000000', 0.42));
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, TAU);
      ctx.fill();
    }

    // Four facets, lit from the upper left, in the diamond `jj log` uses for immutable commits.
    drawGem(p, radius, color) {
      const { ctx } = this;
      const tips = [
        [p.x, p.y - radius],
        [p.x + radius, p.y],
        [p.x, p.y + radius],
        [p.x - radius, p.y],
      ];
      const light = [0.28, 0, -0.38, -0.12]; // facet between tip i and the next one
      tips.forEach((tip, i) => {
        const next = tips[(i + 1) % 4];
        ctx.fillStyle =
          light[i] >= 0 ? mix(color, '#ffffff', light[i]) : mix(color, '#000000', -light[i]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tip[0], tip[1]);
        ctx.lineTo(next[0], next[1]);
        ctx.closePath();
        ctx.fill();
      });
    }

    drawGlow(p, radius, color) {
      const { ctx } = this;
      const pulse = this.still ? 1 : 1 + Math.sin(this.clock * 2.2) * 0.08;
      const reach = radius * 2.7 * pulse;
      const glow = ctx.createRadialGradient(p.x, p.y, radius * 0.8, p.x, p.y, reach);
      glow.addColorStop(0, rgba(color, 0.42));
      glow.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, reach, 0, TAU);
      ctx.fill();
    }

    // Commits made by the step on screen announce themselves with one expanding ring.
    isFresh(commit) {
      return commit.bornOp >= this.step.firstOp && commit.bornOp <= this.step.op;
    }

    drawFlash(p, radius, color, alpha) {
      const { ctx } = this;
      const progress = (this.clock - this.flashAt) / 1.3;
      if (this.still || progress >= 1) return;
      ctx.globalAlpha = alpha * (1 - progress) * 0.8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * (1.1 + progress * 1.7), 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = alpha;
    }

    // Two IDs on the first line, the description on the second, bookmarks above: the same
    // facts, in the same colors, that `jj log` prints beside each commit.
    drawLabel(commit, node, p, radius, alpha) {
      const { ctx, colors, state } = this;
      const size = this.fontSize;
      const line = size * 1.42;
      // Clear of the orbit, so a passing block never covers the text.
      const reach = ORBIT_RADIUS * p.scale + LABEL_GAP;
      const x = p.x + reach;
      // A lane with another lane to its right has only the gap between them to write in.
      // The trunk's labels have the rest of the picture's width, and never run off its edge.
      const gap = this.laneGap * p.scale * this.lens.cosY - reach - ORBIT_RADIUS * p.scale - 10;
      const open = Math.min(this.labelRoom, this.area.x + this.area.w - 8 - x);
      const room = node.lane > 0 ? gap : open;
      const prefix = state.prefixes.get(commit.id) || { change: 0, commit: 0 };

      ctx.globalAlpha = alpha;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      ctx.font = `400 ${size}px ${MONO}`;
      const ids = [
        { text: commit.change.slice(0, prefix.change), color: colors.chg, weight: 700 },
        { text: commit.change.slice(prefix.change), color: colors.dim },
      ];
      if (ctx.measureText(`${commit.change} ${commit.id}`).width <= room) {
        ids.push({ text: ` ${commit.id.slice(0, prefix.commit)}`, color: colors.cid, weight: 700 });
        ids.push({ text: commit.id.slice(prefix.commit), color: colors.dim });
      }
      this.write(x, p.y - line / 2, ids, room, MONO, size);

      const summary = [];
      if (!commit.parents.length) {
        summary.push({ text: 'root()', color: colors.dim });
      } else {
        if (commit.conflicts.length)
          summary.push({ text: '(conflict) ', color: colors.conflict, weight: 600 });
        if (!commit.hunks.length) summary.push({ text: '(empty) ', color: colors.ok });
        summary.push(
          commit.desc
            ? { text: commit.desc, color: colors.ink }
            : { text: '(no description set)', color: colors.dim }
        );
      }
      this.write(x, p.y + line / 2, summary, room, SANS, size);

      let tagX = x;
      for (const mark of this.repo.bookmarksAt(state.view, commit.id)) {
        tagX += this.drawBookmark(mark, tagX, p.y - line * 1.62, size * 0.9) + 6;
      }
    }

    // Writes colored runs of text on one line, cutting the last one short if room runs out.
    write(x, y, runs, room, family, size) {
      const { ctx } = this;
      let used = 0;
      for (const run of runs) {
        ctx.font = `${run.weight || 400} ${size}px ${family}`;
        let text = run.text;
        const cut = used + ctx.measureText(text).width > room;
        while (cut && text.length > 1 && used + ctx.measureText(`${text}…`).width > room)
          text = text.slice(0, -1);
        if (cut) text = text.length > 1 ? `${text}…` : '';
        ctx.fillStyle = run.color;
        ctx.fillText(text, x + used, y);
        used += ctx.measureText(text).width;
        if (cut) return;
      }
    }

    // A local bookmark is a filled tag, and says so when the remote agrees with it. A remote
    // bookmark on its own, left behind by local work, is an outline. Returns the tag's width.
    drawBookmark(mark, x, y, size) {
      const { ctx, colors } = this;
      const name = mark.remote ? `${mark.name}@origin` : mark.name;
      const suffix = mark.synced ? ' @origin' : '';
      ctx.font = `600 ${size}px ${MONO}`;
      const nameWidth = ctx.measureText(name).width;
      const width = nameWidth + ctx.measureText(suffix).width + 12;
      const height = size * 1.55;

      ctx.beginPath();
      ctx.roundRect(x, y - height / 2, width, height, height / 2);
      if (!mark.remote) {
        ctx.fillStyle = rgba(colors.bm, 0.16);
        ctx.fill();
      }
      ctx.setLineDash(mark.remote ? [3, 2] : []);
      ctx.strokeStyle = rgba(colors.bm, 0.75);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = colors.bm;
      ctx.fillText(name, x + 6, y);
      ctx.fillStyle = colors.dim;
      ctx.fillText(suffix, x + 6 + nameWidth, y);
      return width;
    }

    // The ring the file-change blocks ride on, split so the near half passes in front of
    // the commit and the far half behind it.
    queueOrbit(items, node, p, alpha) {
      const halves = { far: [], near: [] };
      for (let i = 0; i <= 32; i += 1) {
        const point = this.orbitPoint(node, (i / 32) * TAU);
        const half = Math.sin((i / 32) * TAU) < 0 ? halves.far : halves.near;
        half.push(this.project(point.x, point.y, point.z));
      }
      const faint = alpha * 0.4;
      items.push({
        depth: p.depth + 0.25,
        draw: () => this.drawLine(halves.far, this.colors.line, faint, 1),
      });
      items.push({
        depth: p.depth - 0.25,
        draw: () => this.drawLine(halves.near, this.colors.line, faint, 1),
      });
    }

    orbitPoint(center, angle) {
      const reach = Math.sin(angle) * ORBIT_RADIUS;
      return {
        x: center.x + Math.cos(angle) * ORBIT_RADIUS,
        y: center.y + reach * Math.sin(ORBIT_TILT),
        z: center.z + reach * Math.cos(ORBIT_TILT),
      };
    }

    queueBlocks(items) {
      for (const [hunkId, block] of this.blocks) {
        const alpha = block.alpha * this.fadeBehind(-block.z / SHEET_GAP);
        if (alpha < 0.02) continue;
        const point = this.orbitPoint(block, this.spin + block.phase * TAU);
        const p = this.project(point.x, point.y, point.z);
        const color = this.colors[this.repo.hunks.get(hunkId).file];
        items.push({ depth: p.depth, draw: () => this.drawBlock(p, color, alpha) });
      }
    }

    // A small cube: a front face with a lighter top and a darker side.
    drawBlock(p, color, alpha) {
      const { ctx } = this;
      const half = clamp(p.scale * 0.085, 3, 8);
      const lift = half * 0.7;
      const face = (points, fill) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.fill();
      };
      const [l, r, t, b] = [p.x - half, p.x + half, p.y - half, p.y + half];
      ctx.globalAlpha = alpha;
      face(
        [
          [l, t],
          [r, t],
          [r + lift, t - lift],
          [l + lift, t - lift],
        ],
        mix(color, '#ffffff', 0.4)
      );
      face(
        [
          [r, t],
          [r + lift, t - lift],
          [r + lift, b - lift],
          [r, b],
        ],
        mix(color, '#000000', 0.35)
      );
      face(
        [
          [l, t],
          [r, t],
          [r, b],
          [l, b],
        ],
        color
      );
    }

    // ---- Input -------------------------------------------------------------------------

    listen() {
      const { canvas } = this;
      let held = null;
      canvas.addEventListener('pointerdown', (event) => {
        held = { x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener('pointermove', (event) => {
        if (!held) return;
        // Dragging right swings the near side of the scene to the right, as if pushed.
        this.user.yaw -= (event.clientX - held.x) * 0.005;
        this.user.pitch += (event.clientY - held.y) * 0.004;
        held = { x: event.clientX, y: event.clientY };
      });
      const release = () => (held = null);
      canvas.addEventListener('pointerup', release);
      canvas.addEventListener('pointercancel', release);
      canvas.addEventListener('dblclick', () => this.resetView());
      canvas.addEventListener(
        'wheel',
        (event) => {
          event.preventDefault();
          this.user.zoom = clamp(this.user.zoom * Math.exp(-event.deltaY * 0.0012), 0.6, 2);
          this.aim();
        },
        { passive: false }
      );
      window.addEventListener('resize', () => this.resize());
      const watcher = new ResizeObserver(() => this.resize());
      watcher.observe(this.panel);
      watcher.observe(this.key);
    }
  }

  JJ.Stage = Stage;
})((window.JJ = window.JJ || {}));
