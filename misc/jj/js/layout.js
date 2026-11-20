// Places the visible commits on a grid: a row for how far each sits from the root, and a
// lane for each line of work. The stage turns rows and lanes into positions in space.
(function (JJ) {
  'use strict';

  JJ.layout = function layout(repo, view) {
    const commits = [...view.visible].map((id) => repo.get(id));
    const immutable = repo.immutableSet(view);
    const started = (commit) => repo.changeOrder.get(commit.change);

    const rows = new Map();
    function rowOf(commit) {
      if (!rows.has(commit.id)) {
        const above = commit.parents.map((parent) => rowOf(repo.get(parent)) + 1);
        rows.set(commit.id, Math.max(0, ...above));
      }
      return rows.get(commit.id);
    }
    commits.forEach(rowOf);

    const children = new Map(commits.map((commit) => [commit.id, []]));
    for (const commit of commits) {
      if (commit.parents.length) children.get(commit.parents[0]).push(commit);
    }
    // One child continues its parent's lane: shared history first, so the trunk stays
    // straight, then whichever change was started earliest.
    for (const siblings of children.values()) {
      siblings.sort((a, b) => immutable.has(b.id) - immutable.has(a.id) || started(a) - started(b));
    }

    const lanes = new Map();
    let nextLane = 0;
    const inOrder = [...commits].sort((a, b) => rowOf(a) - rowOf(b) || started(a) - started(b));
    for (const commit of inOrder) {
      const parent = commit.parents[0];
      const continues = parent && children.get(parent)[0] === commit;
      lanes.set(commit.id, continues ? lanes.get(parent) : nextLane++);
    }

    const pos = new Map(
      commits.map((commit) => [commit.id, { lane: lanes.get(commit.id), row: rowOf(commit) }])
    );
    return { pos, lanes: nextLane, rows: Math.max(...rows.values()) + 1 };
  };
})((window.JJ = window.JJ || {}));
