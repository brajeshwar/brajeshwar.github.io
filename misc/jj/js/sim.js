// A small, deterministic model of a Jujutsu (jj) repository.
//
// It keeps just enough of jj's behavior to teach with: a commit is never changed in place,
// a rewrite makes a new commit that carries the same change ID, descendants follow a
// rewritten parent on their own, conflicts are stored inside commits, and every command
// appends one entry to an operation log that can be stepped back through.
//
// The lesson runs this model once, start to finish. The picture on screen is always "the
// repository as it stood after operation N", so stepping backward needs no undo logic here.
(function (JJ) {
  'use strict';

  // jj prints change IDs in "reverse hex": the digits 0-f are written z-k, so a change ID can
  // never be mistaken for a commit ID.
  const CHANGE_DIGITS = 'zyxwvutsrqponmlk';
  const HEX_DIGITS = '0123456789abcdef';
  const ID_LENGTH = 8;
  const OP_ID_LENGTH = 12;
  const ROOT_COMMIT = '0'.repeat(ID_LENGTH);
  const ROOT_CHANGE = 'z'.repeat(ID_LENGTH);
  const TRUNK = 'main';

  // Seeded, so the lesson shows the same IDs on every load.
  function seededRandom(seed) {
    let state = seed >>> 0;
    return function next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cloneView(view) {
    return {
      wc: view.wc,
      visible: new Set(view.visible),
      bookmarks: new Map(view.bookmarks),
      remotes: new Map(view.remotes),
    };
  }

  // For each ID, the length of the shortest prefix no other ID in the list shares. jj
  // highlights exactly this much of every ID, because it is all you need to type.
  function uniquePrefixLengths(ids) {
    return ids.map((id) => {
      let length = 1;
      while (
        length < id.length &&
        ids.some((other) => other !== id && other.startsWith(id.slice(0, length)))
      ) {
        length += 1;
      }
      return length;
    });
  }

  function idHtml(kind, id, prefix) {
    return `<span class="${kind}"><b>${id.slice(0, prefix)}</b>${id.slice(prefix)}</span>`;
  }

  class Repo {
    constructor(seed) {
      this.random = seededRandom(seed);
      this.commits = new Map(); // commit ID -> commit. Nothing is ever removed.
      this.hunks = new Map(); // hunk ID -> one file change, the unit that squash moves around
      this.ops = []; // the operation log, oldest first
      this.changeOrder = new Map(); // change ID -> the order changes were started in
      this.incomingRegions = null; // set only while a rebase is moving commits
      this.rewritten = []; // commits made by the command now running
      this.states = [];
      this.view = { wc: null, visible: new Set(), bookmarks: new Map(), remotes: new Map() };
      this.createCommit({ id: ROOT_COMMIT, change: ROOT_CHANGE, parents: [] });
    }

    // ---- Reading the repository -------------------------------------------------------

    get(id) {
      return this.commits.get(id);
    }

    workingCopy() {
      return this.get(this.view.wc);
    }

    changeOf(rev) {
      return this.get(this.resolve(rev)).change;
    }

    // Turns what a user would type (`@`, `@-`, a bookmark, a change ID or its prefix) into
    // one commit ID.
    resolve(rev) {
      const view = this.view;
      if (rev === '@') return view.wc;
      if (rev === '@-') return this.get(view.wc).parents[0];
      if (rev.endsWith('@origin')) return view.remotes.get(rev.slice(0, -'@origin'.length));
      if (view.bookmarks.has(rev)) return view.bookmarks.get(rev);
      const matches = [...view.visible].filter((id) => this.get(id).change.startsWith(rev));
      if (matches.length !== 1) {
        throw new Error(`Revision "${rev}" names ${matches.length} commits, expected one`);
      }
      return matches[0];
    }

    // What a user would type to name this change right now: its unique prefix, though never
    // a single letter, which reads like a typo in a lesson.
    short(change) {
      const lengths = this.prefixLengths(this.view);
      return change.slice(0, Math.max(2, lengths.get(this.resolve(change)).change));
    }

    childrenOf(id) {
      return [...this.view.visible].filter((other) => this.get(other).parents.includes(id));
    }

    ancestorsOf(ids) {
      const seen = new Set();
      const queue = [...ids];
      while (queue.length) {
        const id = queue.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        queue.push(...this.get(id).parents);
      }
      return seen;
    }

    // jj refuses to rewrite commits that others may already have: by default, everything
    // reachable from the trunk bookmark on the remote.
    immutableSet(view) {
      const trunk = view.remotes.get(TRUNK);
      return this.ancestorsOf(trunk ? [ROOT_COMMIT, trunk] : [ROOT_COMMIT]);
    }

    prefixLengths(view) {
      const commits = [...view.visible].map((id) => this.get(id));
      const change = uniquePrefixLengths(commits.map((commit) => commit.change));
      const commit = uniquePrefixLengths(commits.map((entry) => entry.id));
      const lengths = new Map();
      commits.forEach((entry, i) =>
        lengths.set(entry.id, { change: change[i], commit: commit[i] })
      );
      return lengths;
    }

    // The bookmarks sitting on a commit. A local bookmark knows whether its remote
    // counterpart is on the same commit; a remote one is listed alone only when it is not.
    bookmarksAt(view, id) {
      const found = [];
      for (const [name, target] of view.bookmarks) {
        if (target === id)
          found.push({ name, remote: false, synced: view.remotes.get(name) === id });
      }
      for (const [name, target] of view.remotes) {
        if (target === id && view.bookmarks.get(name) !== id) found.push({ name, remote: true });
      }
      return found;
    }

    // Everything the picture needs to draw the repository as it stood after one operation.
    stateAt(index) {
      if (!this.states[index]) {
        const view = this.ops[index].view;
        this.states[index] = {
          index,
          op: this.ops[index],
          view,
          layout: JJ.layout(this, view),
          immutable: this.immutableSet(view),
          prefixes: this.prefixLengths(view),
        };
      }
      return this.states[index];
    }

    // The latest operation, no later than `upTo`, whose view still showed this commit.
    lastVisibleOp(id, upTo) {
      for (let index = upTo; index >= this.get(id).bornOp; index -= 1) {
        if (this.ops[index].view.visible.has(id)) return index;
      }
      return -1;
    }

    // ---- Building blocks ---------------------------------------------------------------

    freshId(digits, taken, length = ID_LENGTH) {
      for (;;) {
        let id = '';
        for (let i = 0; i < length; i += 1) id += digits[Math.floor(this.random() * digits.length)];
        if (!taken.has(id)) return id;
      }
    }

    createHunk({ file, region, resolves = null }) {
      const hunk = { id: `hunk-${this.hunks.size}`, file, region, resolves };
      this.hunks.set(hunk.id, hunk);
      return hunk.id;
    }

    createCommit({
      id,
      change,
      parents,
      desc = '',
      hunks = [],
      ownConflicts = [],
      predecessor = null,
    }) {
      const commit = {
        id: id || this.freshId(HEX_DIGITS, this.commits),
        change: change || this.freshId(CHANGE_DIGITS, this.changeOrder),
        parents: [...parents],
        desc,
        hunks: [...hunks],
        ownConflicts: [...ownConflicts],
        predecessor,
        bornOp: this.ops.length,
      };
      if (!this.changeOrder.has(commit.change))
        this.changeOrder.set(commit.change, this.changeOrder.size);
      commit.conflicts = this.conflictsOf(commit);
      this.commits.set(commit.id, commit);
      this.view.visible.add(commit.id);
      return commit;
    }

    // A commit is conflicted by what it introduced or inherited, less whatever its own
    // changes resolve.
    conflictsOf(commit) {
      const regions = new Set(commit.ownConflicts);
      for (const parent of commit.parents) {
        for (const region of this.get(parent).conflicts) regions.add(region);
      }
      for (const hunkId of commit.hunks) regions.delete(this.hunks.get(hunkId).resolves);
      return [...regions];
    }

    // A commit that arrives from elsewhere, such as a teammate's work in a fetch.
    importCommit({ parents, desc, files }) {
      return this.createCommit({
        parents,
        desc,
        hunks: files.map((file) => this.createHunk(file)),
      });
    }

    record(desc) {
      const op = {
        id: this.freshId(HEX_DIGITS, new Set(), OP_ID_LENGTH),
        desc,
        view: cloneView(this.view),
      };
      this.ops.push(op);
      return op;
    }

    // The heart of the model. The old commit is left untouched and hidden; a new commit takes
    // its place under the same change ID, and every child is rewritten onto the new one.
    rewrite(oldId, patch) {
      const old = this.get(oldId);
      if (this.immutableSet(this.view).has(oldId)) {
        throw new Error(`Commit ${oldId} is immutable`);
      }
      const parents = patch.parents || old.parents;
      const commit = this.createCommit({
        change: old.change,
        parents,
        desc: patch.desc === undefined ? old.desc : patch.desc,
        hunks: patch.hunks || old.hunks,
        ownConflicts: this.incomingRegions
          ? this.conflictsFromMove(old, parents)
          : old.ownConflicts,
        predecessor: oldId,
      });
      this.rewritten.push(commit.id);
      this.replaceInView(oldId, commit.id);

      let rebased = 0;
      for (const childId of this.childrenOf(oldId)) {
        const child = this.get(childId);
        const moved = child.parents.map((parent) => (parent === oldId ? commit.id : parent));
        rebased += 1 + this.rewrite(childId, { parents: moved }).rebased;
      }
      return { id: commit.id, rebased };
    }

    // Local bookmarks and the working copy follow a rewritten commit. Remote bookmarks do
    // not: they record where the remote was last seen.
    replaceInView(oldId, newId) {
      const view = this.view;
      view.visible.delete(oldId);
      if (view.wc === oldId) view.wc = newId;
      for (const [name, target] of view.bookmarks) {
        if (target === oldId) view.bookmarks.set(name, newId);
      }
    }

    // While a rebase is under way: a moved commit gains a conflict wherever it touches a
    // region its new ancestors also changed, unless it already inherits that conflict.
    conflictsFromMove(old, parents) {
      const inherited = new Set(parents.flatMap((parent) => this.get(parent).conflicts));
      const own = new Set(old.ownConflicts);
      for (const hunkId of old.hunks) {
        const region = this.hunks.get(hunkId).region;
        if (this.incomingRegions.has(region) && !inherited.has(region)) own.add(region);
      }
      return [...own];
    }

    // jj quietly drops a working-copy commit you move away from if it holds nothing at all.
    discardIfEmpty(id) {
      if (!id || !this.view.visible.has(id)) return;
      const commit = this.get(id);
      const bookmarked = [...this.view.bookmarks.values()].includes(id);
      const empty = commit.hunks.length === 0 && !commit.desc;
      if (empty && !bookmarked && this.childrenOf(id).length === 0) this.view.visible.delete(id);
    }

    // ---- Commands ----------------------------------------------------------------------
    // Each one changes the view, records an operation, and returns what jj would print.

    // Editing files does nothing until the next jj command, which first snapshots them into
    // the working-copy commit. This is that snapshot, reported the way `jj st` would.
    editFiles(files) {
      this.rewritten = [];
      const wc = this.workingCopy();
      const hunks = [...wc.hunks, ...files.map((file) => this.createHunk(file))];
      const result = this.rewrite(wc.id, { hunks });
      this.record('snapshot working copy');
      return [
        ...this.rebasedNote(result.rebased, ' onto updated working copy'),
        ...this.statusLines(),
      ];
    }

    describe(desc) {
      this.rewritten = [];
      const id = this.view.wc;
      const result = this.rewrite(id, { desc });
      this.record(`describe commit ${id}`);
      return [...this.rebasedNote(result.rebased), ...this.workingCopyLines()];
    }

    newChange({ on = ['@'], desc = '' } = {}) {
      const parents = on.map((rev) => this.resolve(rev));
      const previous = this.view.wc;
      this.view.wc = this.createCommit({ parents, desc }).id;
      this.discardIfEmpty(previous);
      this.record('new empty commit');
      return this.workingCopyLines();
    }

    edit(rev) {
      const id = this.resolve(rev);
      const previous = this.view.wc;
      this.view.wc = id;
      this.discardIfEmpty(previous);
      this.record(`edit commit ${id}`);
      return this.workingCopyLines();
    }

    // Moves the working copy's changes into its parent. The emptied commit is abandoned and
    // a fresh empty one takes its place, as jj does.
    squash() {
      this.rewritten = [];
      const source = this.workingCopy();
      const parent = this.get(source.parents[0]);
      if (this.childrenOf(source.id).length) {
        throw new Error('This model only squashes a working copy that has no children');
      }
      this.view.visible.delete(source.id);
      const result = this.rewrite(parent.id, {
        hunks: [...parent.hunks, ...source.hunks],
        desc: parent.desc || source.desc,
      });
      this.view.wc = this.createCommit({ parents: [result.id] }).id;
      this.record(`squash commits into ${parent.id}`);
      return [...this.rebasedNote(result.rebased), ...this.workingCopyLines()];
    }

    // `jj rebase -s SOURCE -o ONTO`: moves a commit and everything above it.
    rebase(sourceRev, ontoRev) {
      this.rewritten = [];
      const source = this.get(this.resolve(sourceRev));
      const onto = this.resolve(ontoRev);
      this.incomingRegions = this.regionsGained(source.parents, onto);
      const result = this.rewrite(source.id, { parents: [onto] });
      this.incomingRegions = null;
      this.record(`rebase commit ${source.id} and descendants`);

      const lines = [`Rebased ${1 + result.rebased} commits to destination`];
      const conflicted = this.rewritten.filter((id) => this.get(id).conflicts.length);
      if (conflicted.length) {
        lines.push(
          `<span class="bad">New conflicts appeared in ${conflicted.length} commits:</span>`
        );
        for (const id of [...conflicted].reverse()) lines.push(`  ${this.commitHtml(id)}`);
        lines.push(
          '<span class="dim">Hint: To resolve the conflicts, start by creating a commit</span>'
        );
        lines.push(
          `<span class="dim">on top of the first conflicted commit: jj new ${this.short(source.change)}</span>`
        );
      }
      return lines;
    }

    // The regions changed by commits the source will newly sit on top of.
    regionsGained(oldParents, onto) {
      const before = this.ancestorsOf(oldParents);
      const regions = new Set();
      for (const id of this.ancestorsOf([onto])) {
        if (before.has(id)) continue;
        for (const hunkId of this.get(id).hunks) regions.add(this.hunks.get(hunkId).region);
      }
      return regions;
    }

    abandon(rev) {
      this.rewritten = [];
      const id = this.resolve(rev);
      const commit = this.get(id);
      const lines = ['Abandoned 1 commits:', `  ${this.commitHtml(id)}`];

      this.view.visible.delete(id);
      let rebased = 0;
      for (const childId of this.childrenOf(id)) {
        const parents = this.get(childId).parents.flatMap((parent) =>
          parent === id ? commit.parents : [parent]
        );
        rebased += 1 + this.rewrite(childId, { parents }).rebased;
      }
      for (const [name, target] of this.view.bookmarks) {
        if (target === id) this.view.bookmarks.delete(name);
      }
      const wasWorkingCopy = this.view.wc === id;
      if (wasWorkingCopy) this.view.wc = this.createCommit({ parents: commit.parents }).id;
      this.record(`abandon commit ${id}`);

      if (rebased)
        lines.push(`Rebased ${rebased} descendant commits onto parents of abandoned commits`);
      return wasWorkingCopy ? [...lines, ...this.workingCopyLines()] : lines;
    }

    bookmarkSet(name, rev) {
      const id = this.resolve(rev);
      const existed = this.view.bookmarks.has(name);
      this.view.bookmarks.set(name, id);
      this.record(`point bookmark ${name} to commit ${id}`);
      const verb = existed ? 'Moved 1 bookmarks to' : 'Created 1 bookmarks pointing to';
      return [`${verb} ${this.commitHtml(id)}`];
    }

    gitPush(name) {
      const id = this.view.bookmarks.get(name);
      const before = this.view.remotes.get(name);
      this.view.remotes.set(name, id);
      this.record(`push bookmark ${name} to git remote origin`);
      const change = before
        ? `Move forward bookmark ${name} from ${before} to ${id}`
        : `Add bookmark ${name} to ${id}`;
      return ['Changes to push to origin:', `  ${change}`];
    }

    // A fetch that brings new commits for a bookmark. A local bookmark that was in step with
    // the remote moves along with it.
    gitFetch(name, incoming) {
      let tip = this.view.remotes.get(name);
      const inStep = this.view.bookmarks.get(name) === tip;
      for (const commit of incoming) tip = this.importCommit({ parents: [tip], ...commit }).id;
      this.view.remotes.set(name, tip);
      if (inStep) this.view.bookmarks.set(name, tip);
      this.record('fetch from git remote(s) origin');
      return [`bookmark: ${name}@origin [updated] tracked`];
    }

    // Restores the view from before the latest operation. Run again, it reaches one
    // operation further back. Either way the restore is itself a new operation.
    undo() {
      const last = this.ops[this.ops.length - 1];
      const undone = last.restored === undefined ? this.ops.length - 1 : last.restored;
      const target = this.ops[undone - 1];
      if (!target) throw new Error('Nothing left to undo');
      this.view = cloneView(target.view);
      this.record(`undo: restore to operation ${target.id}`).restored = undone - 1;
      return [`Restored to operation: ${target.id} ${target.desc}`, ...this.workingCopyLines()];
    }

    // ---- What jj would print -----------------------------------------------------------
    // Shortened from the real output, with the same shape and the same colors.

    commitParts(id) {
      const commit = this.get(id);
      const prefix = this.prefixLengths(this.view).get(id) || { change: 0, commit: 0 };
      const names = this.bookmarksAt(this.view, id).map((mark) => {
        if (mark.remote) return `${mark.name}@origin`;
        return mark.synced || !this.view.remotes.has(mark.name) ? mark.name : `${mark.name}*`;
      });
      const summary = [];
      if (commit.conflicts.length) summary.push('<span class="bad">(conflict)</span>');
      if (!commit.hunks.length) summary.push('<span class="ok">(empty)</span>');
      summary.push(
        commit.desc ? escapeHtml(commit.desc) : '<span class="dim">(no description set)</span>'
      );
      return {
        change: idHtml('chg', commit.change, prefix.change),
        commit: idHtml('cid', commit.id, prefix.commit),
        marks: names.length ? `<span class="bm">${names.join(' ')}</span>` : '',
        summary: summary.join(' '),
      };
    }

    // One commit on one line, the way jj names a commit in its messages.
    commitHtml(id) {
      const parts = this.commitParts(id);
      const marks = parts.marks ? [`${parts.marks} |`] : [];
      return [parts.change, parts.commit, ...marks, parts.summary].join(' ');
    }

    workingCopyLines() {
      const wc = this.workingCopy();
      return [
        `Working copy  (@) now at: ${this.commitHtml(wc.id)}`,
        `Parent commit (@-)      : ${this.commitHtml(wc.parents[0])}`,
      ];
    }

    statusLines() {
      const wc = this.workingCopy();
      const files = [...new Set(wc.hunks.map((hunkId) => this.hunks.get(hunkId).file))];
      const changes = files.length
        ? ['Working copy changes:', ...files.map((file) => `<span class="ok">M ${file}</span>`)]
        : ['The working copy has no changes.'];
      return [
        ...changes,
        `Working copy  (@) : ${this.commitHtml(wc.id)}`,
        `Parent commit (@-): ${this.commitHtml(wc.parents[0])}`,
      ];
    }

    rebasedNote(count, where = '') {
      return count ? [`Rebased ${count} descendant commits${where}`] : [];
    }

    // `jj log` for a single line of history, from the working copy down to the root.
    logLines() {
      const immutable = this.immutableSet(this.view);
      const lines = [];
      for (let id = this.view.wc; id; id = this.get(id).parents[0]) {
        const parts = this.commitParts(id);
        if (id === ROOT_COMMIT) {
          lines.push(`◆  ${parts.change} root() ${parts.commit}`);
          break;
        }
        const glyph = id === this.view.wc ? '@' : immutable.has(id) ? '◆' : '○';
        lines.push(
          [`${glyph} `, parts.change, parts.commit, parts.marks].filter(Boolean).join(' ')
        );
        lines.push(`│  ${parts.summary}`);
      }
      return lines;
    }

    // `jj evolog`: every snapshot the change in the working copy has been through.
    evologLines() {
      const lines = [];
      for (let id = this.view.wc; id; id = this.get(id).predecessor) {
        lines.push(`${id === this.view.wc ? '@' : '○'}  ${this.commitHtml(id)}`);
      }
      return lines;
    }

    opLogLines(limit) {
      const newestFirst = [...this.ops].reverse().slice(0, limit);
      return newestFirst.map(
        (op, i) =>
          `${i === 0 ? '@' : '○'}  <span class="cid">${op.id}</span> ${escapeHtml(op.desc)}`
      );
    }
  }

  JJ.Repo = Repo;
  JJ.seededRandom = seededRandom;
  JJ.ROOT_COMMIT = ROOT_COMMIT;
})((window.JJ = window.JJ || {}));
