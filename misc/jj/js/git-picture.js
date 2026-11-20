// Draws where Git stands after a step, in the panel's Git box: the commits and branches,
// newest at the top, and under them the working tree and the index, the two places an
// edit waits in Git and never in jj. A rebase stopped part way says so across
// the top. Commits the step left with no branch to reach them are drawn dashed, once.
(function (JJ) {
  'use strict';

  const ROW = 30; // between a commit and its parent
  const ZONE_HEIGHT = 40; // the working tree and index boxes along the bottom
  const UNDER = ZONE_HEIGHT + 32; // from the oldest commit to the foot of the picture
  const FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const COLOR_VARS = {
    ink: '--ink',
    dim: '--ink-dim',
    line: '--line',
    wc: '--wc',
    commit: '--commit',
    conflict: '--conflict',
    bm: '--bm',
    panel: '--panel-line',
    'app.js': '--file-app',
    'style.css': '--file-style',
    'README.md': '--file-readme',
  };

  class GitPicture {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.state = null;
      this.readColors();
      new ResizeObserver(() => this.draw()).observe(canvas);
    }

    readColors() {
      const style = getComputedStyle(document.documentElement);
      this.colors = {};
      for (const [name, variable] of Object.entries(COLOR_VARS)) {
        this.colors[name] = style.getPropertyValue(variable).trim();
      }
      this.draw();
    }

    show(state) {
      this.state = state;
      this.draw();
    }

    // As tall as the commits need, so a short history leaves the panel more room.
    draw() {
      const { canvas, context: c, state } = this;
      const width = canvas.clientWidth;
      if (!state || !width) return;
      const graph = this.layout(state);
      const top = state.rebase ? 22 : 4;
      const height = top + 16 + (graph.rows - 1) * ROW + UNDER;
      const ratio = window.devicePixelRatio || 1;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      c.clearRect(0, 0, width, height);
      c.textBaseline = 'middle';

      if (state.rebase) {
        const { done, total, conflict } = state.rebase;
        c.fillStyle = conflict ? this.colors.conflict : this.colors.wc;
        c.font = `600 11px ${FONT}`;
        const why = conflict ? 'on a conflict' : 'for you to edit';
        c.fillText(`Rebase stopped at ${done} of ${total}, ${why}`, 0, 8);
      }
      this.drawGraph(state, graph, width, height - UNDER);
      this.drawZones(state, width, height - ZONE_HEIGHT);
    }

    // ---- Commits and branches ----------------------------------------------------------

    layout(state) {
      const byHash = new Map(state.commits.map((commit) => [commit.hash, { ...commit }]));
      const row = (hash) => {
        const commit = byHash.get(hash);
        if (commit.row === undefined) commit.row = commit.parent ? row(commit.parent) + 1 : 0;
        return commit.row;
      };
      // Lanes from the tips, the branch you work on first, so the trunk stays at the left.
      const tips = [
        ...state.branches.map(([, hash]) => hash),
        ...state.remotes.map(([, hash]) => hash),
        state.head,
        ...state.commits.filter((commit) => commit.dropped).map((commit) => commit.hash),
      ];
      let lanes = 0;
      for (const tip of tips) {
        let claimed = false;
        for (let at = tip; at && byHash.get(at).lane === undefined; at = byHash.get(at).parent) {
          byHash.get(at).lane = lanes;
          claimed = true;
        }
        if (claimed) lanes += 1;
      }
      for (const commit of byHash.values()) row(commit.hash);
      const rows = Math.max(...[...byHash.values()].map((commit) => commit.row)) + 1;
      return { byHash, lanes, rows };
    }

    labels(state) {
      const names = new Map();
      const add = (hash, text, color) => {
        if (!names.has(hash)) names.set(hash, []);
        names.get(hash).push({ text, color });
      };
      if (state.detached) add(state.head, 'HEAD', this.colors.wc);
      for (const [name, hash] of state.branches) {
        const here = name === state.onBranch;
        add(hash, here ? `HEAD → ${name}` : name, here ? this.colors.wc : this.colors.bm);
      }
      for (const [name, hash] of state.remotes) add(hash, `origin/${name}`, this.colors.dim);
      return names;
    }

    drawGraph(state, { byHash, lanes }, width, bottom) {
      const c = this.context;
      // The last lane keeps room for its labels.
      const laneWidth = Math.min(130, (width - 150) / Math.max(1, lanes - 1));
      const at = (commit) => ({
        x: 8 + commit.lane * laneWidth,
        y: bottom - commit.row * ROW,
      });

      c.lineWidth = 1.5;
      for (const commit of byHash.values()) {
        if (!commit.parent) continue;
        const from = at(commit);
        const to = at(byHash.get(commit.parent));
        c.strokeStyle = this.colors.line;
        c.globalAlpha = commit.dropped ? 0.5 : 1;
        c.setLineDash(commit.dropped ? [3, 3] : []);
        c.beginPath();
        c.moveTo(from.x, from.y);
        const middle = (from.y + to.y) / 2;
        c.bezierCurveTo(from.x, middle, to.x, middle, to.x, to.y);
        c.stroke();
      }

      const names = this.labels(state);
      for (const commit of byHash.values()) {
        const { x, y } = at(commit);
        c.globalAlpha = commit.dropped ? 0.55 : 1;
        c.setLineDash(commit.dropped ? [2, 2] : []);
        c.beginPath();
        c.arc(x, y, 5.5, 0, Math.PI * 2);
        if (commit.dropped) {
          c.strokeStyle = this.colors.dim;
          c.stroke();
        } else {
          c.fillStyle = this.colors.commit;
          c.fill();
        }
        if (commit.hash === state.head) {
          c.setLineDash([]);
          c.strokeStyle = this.colors.wc;
          c.lineWidth = 2;
          c.beginPath();
          c.arc(x, y, 8.5, 0, Math.PI * 2);
          c.stroke();
          c.lineWidth = 1.5;
        }

        const refs = names.get(commit.hash) || [];
        c.font = `10px ${FONT}`;
        c.fillStyle = this.colors.dim;
        const hashY = refs.length ? y + 6 : y;
        c.fillText(commit.dropped ? `${commit.hash} dropped` : commit.hash, x + 13, hashY);
        let textX = x + 13;
        c.font = `600 10px ${FONT}`;
        for (const ref of refs) {
          c.fillStyle = ref.color;
          c.fillText(ref.text, textX, y - 6);
          textX += c.measureText(ref.text).width + 7;
        }
      }
      c.globalAlpha = 1;
      c.setLineDash([]);

      if (state.lost) {
        c.font = `10px ${FONT}`;
        c.fillStyle = this.colors.dim;
        const commits = state.lost === 1 ? 'commit' : 'commits';
        c.fillText(`${state.lost} ${commits} now only in the reflog`, 0, bottom + 18);
      }
    }

    // ---- The working tree and the index ------------------------------------------------

    drawZones(state, width, y) {
      const half = (width - 8) / 2;
      this.drawZone('Working tree', 'clean', state.tree, 0, y, half);
      this.drawZone('Index', 'empty', state.index, half + 8, y, half);
    }

    drawZone(title, nothing, files, x, y, width) {
      const c = this.context;
      c.strokeStyle = this.colors.panel;
      c.lineWidth = 1;
      c.beginPath();
      c.roundRect(x + 0.5, y + 0.5, width - 1, ZONE_HEIGHT - 1, 6);
      c.stroke();
      c.font = `600 9px ${FONT}`;
      c.fillStyle = this.colors.dim;
      c.fillText(title.toUpperCase(), x + 8, y + 11);
      c.font = `10px ${FONT}`;
      if (!files.length) {
        c.fillText(nothing, x + 8, y + 27);
        return;
      }
      let fileX = x + 8;
      for (const file of files) {
        const name = file.conflict ? `${file.file} ×` : file.file;
        c.fillStyle = this.colors[file.file];
        c.fillRect(fileX, y + 23, 8, 8);
        c.fillStyle = file.conflict ? this.colors.conflict : this.colors.ink;
        c.fillText(name, fileX + 12, y + 27);
        fileX += c.measureText(name).width + 22;
      }
    }
  }

  JJ.GitPicture = GitPicture;
})((window.JJ = window.JJ || {}));
