// A small model of a Git repository, played beside the jj one.
//
// The lesson runs the same story through both. Here a commit is a snapshot with a hash and
// nothing more: an amend or a rebase makes new commits, and the old ones stay only for as
// long as a branch or HEAD can reach them. Edits wait in the working tree, then the index,
// until a commit takes them. A rebase replays commits one at a time and stops at the first
// conflict. After each step the panel draws a snapshot of all this.
(function (JJ) {
  'use strict';

  const HASH_LENGTH = 7;

  class Git {
    constructor(seed) {
      this.random = JJ.seededRandom(seed * 31 + 1);
      this.commits = new Map(); // hash -> { hash, parent, msg, files: [{ file, region }] }
      this.branches = new Map();
      this.remotes = new Map(); // by the branch's name, drawn as origin/<name>
      this.head = { branch: 'main' }; // or { at: hash } while a rebase holds it
      this.tree = []; // edits on disk, not staged: { file, region, conflict }
      this.index = []; // edits staged for the next commit
      this.rebasing = null;
      this.reached = new Set();
    }

    // ---- Commits -----------------------------------------------------------------------

    makeCommit(parent, msg, files) {
      let hash;
      do {
        hash = '';
        for (let i = 0; i < HASH_LENGTH; i += 1)
          hash += Math.floor(this.random() * 16).toString(16);
      } while (this.commits.has(hash));
      this.commits.set(hash, { hash, parent, msg, files });
      return hash;
    }

    resolve(ref) {
      if (ref === 'HEAD') return this.headHash();
      if (ref.startsWith('origin/')) return this.remotes.get(ref.slice(7));
      return this.branches.get(ref) || ref;
    }

    headHash() {
      return this.head.branch ? this.branches.get(this.head.branch) : this.head.at;
    }

    moveHead(hash) {
      if (this.head.branch) this.branches.set(this.head.branch, hash);
      else this.head.at = hash;
    }

    // Oldest first: the commits on `tip` that are not on `base`.
    commitsSince(base, tip) {
      const below = new Set();
      for (let at = base; at; at = this.commits.get(at).parent) below.add(at);
      const list = [];
      for (let at = tip; at && !below.has(at); at = this.commits.get(at).parent) list.unshift(at);
      return list;
    }

    // The regions of files changed on `tip` since it parted from `base`.
    regionsSince(base, tip) {
      return new Set(
        this.commitsSince(base, tip).flatMap((hash) =>
          this.commits.get(hash).files.map((f) => f.region)
        )
      );
    }

    // ---- Commands ----------------------------------------------------------------------

    clone(msg, files) {
      const hash = this.makeCommit(null, msg, files);
      this.branches.set('main', hash);
      this.remotes.set('main', hash);
    }

    edit(files) {
      for (const change of files) {
        this.tree = this.tree.filter((f) => f.file !== change.file);
        this.tree.push({ ...change, conflict: false });
      }
    }

    add(names) {
      const staged = this.tree.filter((f) => names.includes(f.file));
      this.tree = this.tree.filter((f) => !names.includes(f.file));
      this.index = [
        ...this.index.filter((f) => !names.includes(f.file)),
        ...staged.map((f) => ({ ...f, conflict: false })),
      ];
    }

    commit(msg, { all = false, amend = false } = {}) {
      if (all) this.add(this.tree.map((f) => f.file));
      const head = this.commits.get(this.headHash());
      const hash = amend
        ? this.makeCommit(head.parent, msg || head.msg, [...head.files, ...this.index])
        : this.makeCommit(head.hash, msg, this.index);
      this.index = [];
      this.moveHead(hash);
    }

    fetch(name, commits) {
      let tip = this.remotes.get(name);
      for (const { desc, files } of commits) tip = this.makeCommit(tip, desc, files);
      this.remotes.set(name, tip);
    }

    // `git rebase -i <upstream>` with the first commit marked `edit`.
    rebaseToEdit(upstream) {
      const todo = this.commitsSince(this.resolve(upstream), this.headHash());
      this.rebasing = {
        branch: this.head.branch,
        total: todo.length,
        done: 1,
        todo: todo.slice(1),
      };
      this.head = { at: todo[0] };
    }

    rebase(upstream) {
      const onto = this.resolve(upstream);
      const todo = this.commitsSince(onto, this.headHash());
      this.rebasing = { branch: this.head.branch, total: todo.length, done: 0, todo };
      this.head = { at: onto };
      this.replay();
    }

    continue() {
      const stopped = this.rebasing.stopped;
      if (stopped) {
        const old = this.commits.get(stopped);
        this.head.at = this.makeCommit(this.head.at, old.msg, old.files);
        this.index = [];
        this.rebasing.stopped = null;
      }
      this.replay();
    }

    // Copies each commit left to do onto HEAD, and stops at the first that touches what
    // the new base has already changed.
    replay() {
      const run = this.rebasing;
      while (run.todo.length) {
        const old = this.commits.get(run.todo.shift());
        run.done += 1;
        const theirs = this.regionsSince(old.parent, this.head.at);
        const clashing = old.files.filter((f) => theirs.has(f.region));
        if (clashing.length) {
          run.stopped = old.hash;
          this.tree = clashing.map((f) => ({ ...f, conflict: true }));
          return;
        }
        this.head.at = this.makeCommit(this.head.at, old.msg, old.files);
      }
      this.branches.set(run.branch, this.head.at);
      this.head = { branch: run.branch };
      this.rebasing = null;
    }

    switchTo(name, { create = null } = {}) {
      if (create) this.branches.set(name, this.resolve(create));
      this.head = { branch: name };
    }

    branch(name, ref) {
      this.branches.set(name, this.resolve(ref));
    }

    deleteBranch(name) {
      this.branches.delete(name);
    }

    push(name) {
      this.remotes.set(name, this.branches.get(name));
    }

    // ---- What the panel draws ----------------------------------------------------------

    reachable() {
      const tips = [...this.branches.values(), ...this.remotes.values(), this.headHash()];
      const seen = new Set();
      for (let at of tips) {
        for (; at && !seen.has(at); at = this.commits.get(at).parent) seen.add(at);
      }
      return seen;
    }

    // Where Git stands now. Commits that the last step left with no branch to reach them
    // are kept for this one picture, so the reader sees them go.
    snapshot() {
      const reached = this.reachable();
      const dropped = [...this.reached].filter((hash) => !reached.has(hash));
      this.reached = reached;
      const commit = (hash) => ({ ...this.commits.get(hash), dropped: !reached.has(hash) });
      const run = this.rebasing;
      return {
        commits: [...reached, ...dropped].map(commit),
        lost: this.commits.size - reached.size,
        branches: [...this.branches],
        remotes: [...this.remotes],
        head: this.headHash(),
        detached: !this.head.branch,
        onBranch: this.head.branch || null,
        tree: this.tree.map((f) => ({ ...f })),
        index: this.index.map((f) => ({ ...f })),
        rebase: run && { done: run.done, total: run.total, conflict: Boolean(run.stopped) },
      };
    }
  }

  JJ.Git = Git;
})((window.JJ = window.JJ || {}));
