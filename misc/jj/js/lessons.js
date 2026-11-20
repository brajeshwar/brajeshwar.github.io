// The lesson: one small repository, taken through a working day with jj.
//
// Each step names the command a person would type, runs it against the model, and keeps
// what jj would print. The whole story is played once, up front; a step then only has to
// remember which operation it ended on.
//
// Each step also says how the same thing is done in Git, and plays it through the small Git
// model in git.js, so the panel can draw where Git stands. Those commands follow the Git
// command table in the jj documentation where it has a matching row.
(function (JJ) {
  'use strict';

  // Camera angles, in radians. A step with no `look` uses the stage's default view.
  const LOOK_BEHIND = { yaw: -0.8, pitch: 0.26 };
  const LOOK_ALONG_THE_LOG = { yaw: -0.6, pitch: 0.32 };

  JJ.buildLesson = function buildLesson(repo, git) {
    const steps = [];
    let chapter = '';

    function step(definition) {
      const firstOp = repo.ops.length;
      const cmd = definition.cmd ? definition.cmd() : '';
      const out = definition.run ? definition.run() : [];
      if (definition.git.run) definition.git.run();
      steps.push({
        chapter,
        title: definition.title,
        body: definition.body,
        git: { label: 'The same step in Git', ...definition.git },
        look: definition.look || null,
        sheets: Boolean(definition.sheets),
        cmd,
        out,
        firstOp,
        op: repo.ops.length - 1,
        gitState: git.snapshot(),
      });
    }

    // Before the lesson starts: a clone of a small project with one shared commit on main.
    const startFiles = [
      { file: 'app.js', region: 'app.js:timer' },
      { file: 'README.md', region: 'README.md:intro' },
    ];
    const start = repo.importCommit({
      parents: [JJ.ROOT_COMMIT],
      desc: 'Start the timer app',
      files: startFiles,
    });
    git.clone('Start the timer app', startFiles);
    repo.view.bookmarks.set('main', start.id);
    repo.view.remotes.set('main', start.id);
    repo.record('fetch from git remote into empty repo');
    repo.newChange({ on: ['main'] });

    // The changes the story follows, by change ID, since their commit IDs keep moving.
    let pause;
    let docs;
    let darkTheme; // the Git commit that is lost, and found again in the reflog

    const pauseButton = [
      { file: 'app.js', region: 'app.js:controls' },
      { file: 'style.css', region: 'style.css:buttons' },
    ];

    chapter = 'The working copy is a commit';

    step({
      title: 'A repository, standing up',
      body: `Each shape is a commit, and newer work sits higher. The diamonds are commits
        already shared with others, which jj will not rewrite. The orb marked
        <code>@</code> is your working copy. In jj the working copy is a real commit, not a
        staging area off to the side.`,
      cmd: () => 'jj log',
      run: () => repo.logLines(),
      git: {
        cmd: ['git log --oneline --graph'],
        note: `Git's log shows commits only. Your unsaved edits live outside it, in the
          working tree and the index, and the log cannot show them.`,
      },
    });

    step({
      title: 'Edit files. That is all',
      body: `You change <code>app.js</code> and <code>style.css</code>. There is no
        <code>add</code> and no staging. The next jj command you run snapshots your files
        straight into <code>@</code>. The small blocks circling a commit are the file
        changes it holds.`,
      cmd: () => 'jj st',
      run: () => repo.editFiles(pauseButton),
      git: {
        cmd: ['git add app.js style.css'],
        run: () => {
          git.edit(pauseButton);
          git.add(['app.js', 'style.css']);
        },
        note: `Git records nothing until you stage the files and then commit them. Until
          then the edits exist only as files on disk.`,
      },
    });

    step({
      title: 'Describe it whenever you like',
      body: `A commit can get its message at any point: before the work, after it, or five
        rewrites later. Nothing forces you to name a thing before you understand it.`,
      cmd: () => 'jj describe -m "Add pause button"',
      run: () => {
        const out = repo.describe('Add pause button');
        pause = repo.changeOf('@');
        return out;
      },
      git: {
        cmd: ['git commit -m "Add pause button"'],
        run: () => git.commit('Add pause button'),
        note: `In Git the message and the commit arrive together. Changing a message later
          means amending the commit or rebasing.`,
      },
    });

    chapter = 'Changes and commits';

    step({
      title: 'Two IDs, two jobs',
      body: `Every commit carries two IDs. The <span class="chg">change ID</span>, in
        letters, names the piece of work and never changes. The
        <span class="cid">commit ID</span>, in hex, names one exact snapshot, so every
        rewrite gets a new one. The pale shells trailing behind the orb are the earlier
        snapshots of this same change. Nothing was overwritten.`,
      look: LOOK_BEHIND,
      cmd: () => 'jj evolog',
      run: () => repo.evologLines(),
      git: {
        cmd: ['git reflog'],
        note: `Git has no change ID. An amended commit is simply a different commit, and
          nothing ties it to the one it replaced. The reflog, a list of where
          <code>HEAD</code> has been, is the closest thing.`,
      },
    });

    step({
      title: 'Start the next change',
      body: `<code>jj new</code> starts a fresh, empty change on top. The one below is done
        for now, but it is never locked. You can come back to it at any time.`,
      cmd: () => 'jj new',
      run: () => repo.newChange(),
      git: {
        none: 'Nothing to type',
        note: `<code>git commit</code> already left you ready for the next commit. The jj
          command that describes and starts anew in one go is <code>jj commit</code>.`,
      },
    });

    step({
      title: 'Work, then describe',
      body: `Edit <code>README.md</code>, then describe the change. jj snapshots your files
        first and sets the message second: two operations from one command, and two shells
        left behind.`,
      cmd: () => 'jj describe -m "Document the pause button"',
      run: () => {
        repo.editFiles([{ file: 'README.md', region: 'README.md:pause' }]);
        const out = repo.describe('Document the pause button');
        docs = repo.changeOf('@');
        return out;
      },
      git: {
        cmd: ['git commit -am "Document the pause button"'],
        run: () => {
          git.edit([{ file: 'README.md', region: 'README.md:pause' }]);
          git.commit('Document the pause button', { all: true });
        },
        note: `One command in Git too, though <code>-a</code> only picks up files Git
          already tracks. A new file still needs <code>git add</code>.`,
      },
    });

    chapter = 'Edit anywhere';

    step({
      title: 'Go back to an older change',
      body: `You spot a bug in the pause button. Go back to that change. There is no stash
        and no detached state to worry about: <code>@</code> simply moves there, and the
        work above it stays where it is.`,
      cmd: () => `jj edit ${repo.short(pause)}`,
      run: () => repo.edit(pause),
      git: {
        cmd: ['git rebase -i origin/main'],
        run: () => git.rebaseToEdit('origin/main'),
        note: `In Git you start an interactive rebase and mark the commit
          <code>edit</code>, after stashing any unsaved work. Until the rebase ends, the
          checkout sits in a special in-between state.`,
      },
    });

    step({
      title: 'What sits above follows along',
      body: `Fix <code>app.js</code>. The pause change gets a new snapshot, and jj
        <strong>rebases the change above it automatically</strong>. Both commit IDs are
        new. Both change IDs are the same as before.`,
      cmd: () => 'jj st',
      run: () => repo.editFiles([{ file: 'app.js', region: 'app.js:pause-fix' }]),
      git: {
        cmd: ['git commit -a --amend', 'git rebase --continue'],
        run: () => {
          git.edit([{ file: 'app.js', region: 'app.js:pause-fix' }]);
          git.commit(null, { all: true, amend: true });
          git.continue();
        },
        note: `Git replays the later commits only because you are inside that rebase. Any
          other branch stacked on the old commit is left pointing at it, and has to be
          rebased by hand.`,
      },
    });

    step({
      title: 'Return to the top',
      body: `To carry on where you left off, start a new change on the newest one.`,
      cmd: () => `jj new ${repo.short(docs)}`,
      run: () => repo.newChange({ on: [docs] }),
      git: {
        none: 'Nothing to type',
        note: `When the rebase finishes, Git puts you back at the tip of the branch.`,
      },
    });

    chapter = 'Move work between commits';

    step({
      title: 'A fix that belongs elsewhere',
      body: `You notice a typo in the README. The fix belongs in the change below, not in
        a commit of its own. Make the edit anyway, right where you are.`,
      cmd: () => 'jj st',
      run: () => repo.editFiles([{ file: 'README.md', region: 'README.md:typo' }]),
      git: {
        cmd: ['git add README.md'],
        run: () => {
          git.edit([{ file: 'README.md', region: 'README.md:typo' }]);
          git.add(['README.md']);
        },
        note: `The same edit. In Git it waits in the index until you say which commit
          should get it.`,
      },
    });

    step({
      title: 'Squash it down',
      body: `<code>jj squash</code> moves what is in <code>@</code> into its parent. Watch
        the block travel. <code>@</code> is empty again and ready for the next thing.
        <code>jj split</code> does the reverse, and <code>jj squash --into</code> can send
        the work to any commit.`,
      cmd: () => 'jj squash',
      run: () => repo.squash(),
      git: {
        cmd: ['git commit --amend --no-edit'],
        run: () => git.commit(null, { amend: true }),
        note: `This is easy in Git because the target is the newest commit. For an older
          one, Git needs a fixup commit and an autosquash rebase.`,
      },
    });

    chapter = 'A rebase always finishes';

    const teammate = [
      { desc: 'Rename start to play', files: [{ file: 'app.js', region: 'app.js:controls' }] },
    ];

    step({
      title: 'Meanwhile, on main',
      body: `A teammate pushed to <code>main</code>. After a fetch, <code>main</code> has
        moved up, and your two changes now hang off the old spot.`,
      cmd: () => 'jj git fetch',
      run: () => repo.gitFetch('main', teammate),
      git: {
        cmd: ['git fetch'],
        run: () => git.fetch('main', teammate),
        note: `The same in both. In Git only <code>origin/main</code> moves; your local
          <code>main</code> waits for a pull.`,
      },
    });

    step({
      title: 'Move the stack, conflicts and all',
      body: `Move your work onto the new <code>main</code>. The teammate changed the same
        lines of <code>app.js</code>, so there is a conflict. In jj the rebase
        <strong>still finishes</strong>. The conflict is recorded inside the commit, shown
        in red, and everything above carries it until it is fixed.`,
      cmd: () => `jj rebase -s ${repo.short(pause)} -o main`,
      run: () => repo.rebase(pause, 'main'),
      git: {
        cmd: ['git rebase origin/main'],
        run: () => git.rebase('origin/main'),
        note: `Git stops at the first commit that conflicts. The branch is left half-moved
          until you resolve it and run <code>git rebase --continue</code>, or give up with
          <code>git rebase --abort</code>.`,
      },
    });

    chapter = 'Conflicts can wait';

    step({
      title: 'Fix it when you are ready',
      body: `Nothing is blocked. When you choose to deal with it, start a change on top of
        the first red commit. The empty <code>@</code> you leave behind held nothing, so
        jj drops it for you.`,
      cmd: () => `jj new ${repo.short(pause)}`,
      run: () => repo.newChange({ on: [pause] }),
      git: {
        none: 'No equivalent',
        note: `In Git there is no “later”. The rebase is paused on the conflict, and the
          checkout can do little else until you deal with it.`,
      },
    });

    step({
      title: 'Resolve in a commit of its own',
      body: `Edit the conflict markers in <code>app.js</code>, or run
        <code>jj resolve</code>. Your new change is clean. The red commits are still
        waiting for the fix to reach them.`,
      cmd: () => 'jj st',
      run: () =>
        repo.editFiles([
          { file: 'app.js', region: 'app.js:controls', resolves: 'app.js:controls' },
        ]),
      git: {
        cmd: ['git add app.js'],
        run: () => {
          git.edit([{ file: 'app.js', region: 'app.js:controls' }]);
          git.add(['app.js']);
        },
        note: `The same edit to the same kind of markers. In Git, staging the file is how
          you say it is resolved.`,
      },
    });

    step({
      title: 'Squash the fix into place',
      body: `Squash the fix into the conflicted commit. It turns clean, jj rebases the
        change above it, and that one turns clean too.`,
      cmd: () => 'jj squash',
      run: () => repo.squash(),
      git: {
        cmd: ['git rebase --continue'],
        run: () => git.continue(),
        note: `Git then carries on to the next commit, and may stop again there. In jj the
          whole stack had already moved, so one fix settles it.`,
      },
    });

    chapter = 'Side work needs no name';

    step({
      title: 'Try an idea on the side',
      body: `Want to try something else? Start a change on <code>main</code>. A second line
        of work grows beside the first. It has no branch name and does not need one.`,
      cmd: () => 'jj new main -m "Try a dark theme"',
      run: () => repo.newChange({ on: ['main'], desc: 'Try a dark theme' }),
      git: {
        cmd: ['git switch -c dark-theme origin/main'],
        run: () => git.switchTo('dark-theme', { create: 'origin/main' }),
        note: `Git wants a branch name first, and a stash or a commit if you have unsaved
          work. A commit that no branch points to drops out of the log and is deleted in
          time.`,
      },
    });

    step({
      title: 'Both lines stay in view',
      body: `Edit <code>style.css</code>. Both lines of work are visible in
        <code>jj log</code> at once, and you move between them with <code>jj edit</code>
        or <code>jj new</code>. There is no “current branch” to switch.`,
      cmd: () => 'jj st',
      run: () => repo.editFiles([{ file: 'style.css', region: 'style.css:theme' }]),
      git: {
        cmd: ['git commit -am "Try a dark theme"'],
        run: () => {
          git.edit([{ file: 'style.css', region: 'style.css:theme' }]);
          git.commit('Try a dark theme', { all: true });
          darkTheme = git.headHash();
        },
        note: `To get back to the other line of work in Git, you switch branches, after
          stashing or committing whatever is unfinished.`,
      },
    });

    chapter = 'Bookmarks and Git';

    step({
      title: 'A name, only when you need one',
      body: `Git needs a branch name to receive a push. jj calls these
        <strong>bookmarks</strong>: plain labels on a commit. A bookmark does not creep
        forward when you add commits above it, but it does follow its commit through
        every rewrite.`,
      cmd: () => `jj bookmark set pause-button -r ${repo.short(docs)}`,
      run: () => repo.bookmarkSet('pause-button', docs),
      git: {
        cmd: ['git branch pause-button main'],
        run: () => git.branch('pause-button', 'main'),
        note: `A Git branch moves forward with every commit you make while it is checked
          out. A jj bookmark stays where you put it until you move it.`,
      },
    });

    step({
      title: 'Push to Git',
      body: `Underneath, this is an ordinary Git repository. Push the bookmark and your
        teammates see a normal branch. They never need to know you used jj.`,
      cmd: () => 'jj git push --bookmark pause-button',
      run: () => repo.gitPush('pause-button'),
      git: {
        cmd: ['git push origin pause-button'],
        run: () => git.push('pause-button'),
        note: `The same result on the remote. After a rewrite Git needs
          <code>--force-with-lease</code>; jj makes that safety check on every push.`,
      },
    });

    chapter = 'Nothing is lost';

    step({
      title: 'The operation log',
      body: `Every command you ran was recorded as an <strong>operation</strong>. Each
        sheet reaching back is the whole repository as it stood after one command. The
        pale shells you have been seeing live on those sheets.`,
      look: LOOK_ALONG_THE_LOG,
      sheets: true,
      cmd: () => 'jj op log',
      run: () => repo.opLogLines(6),
      git: {
        cmd: ['git reflog'],
        note: `Git keeps a separate reflog for <code>HEAD</code> and for each branch. None
          of them records the repository as a whole, so there is no single list of what
          you did.`,
      },
    });

    step({
      title: 'A mistake',
      body: `Now you throw away the dark theme, and a minute later you wish you had not.`,
      look: LOOK_ALONG_THE_LOG,
      sheets: true,
      cmd: () => 'jj abandon @',
      run: () => repo.abandon('@'),
      git: {
        cmd: ['git switch main', 'git branch -D dark-theme'],
        run: () => {
          git.switchTo('main');
          git.deleteBranch('dark-theme');
        },
        note: `In Git the commit is not destroyed yet, but nothing points to it any more,
          and garbage collection will remove it in time.`,
      },
    });

    step({
      title: 'Undo',
      body: `<code>jj undo</code> puts the repository back as it was one sheet ago. The dark
        theme returns, exactly as you left it. The undo is itself a new operation, so even
        that can be undone.`,
      look: LOOK_ALONG_THE_LOG,
      sheets: true,
      cmd: () => 'jj undo',
      run: () => repo.undo(),
      git: {
        cmd: ['git reflog', 'git branch dark-theme <hash>'],
        run: () => git.branch('dark-theme', darkTheme),
        note: `Git has no undo. You search the reflog for the lost commit's hash and point
          a new branch at it, provided garbage collection has not run first.`,
      },
    });

    step({
      title: 'The shape of jj',
      body: `<ul>
          <li>The working copy is a commit, snapshotted for you.</li>
          <li>A change keeps its ID while its commits come and go.</li>
          <li>Rewrite anything, and what sits above follows.</li>
          <li>Conflicts are saved in commits and can wait.</li>
          <li>Every command is an operation, and <code>jj undo</code> walks back.</li>
        </ul>
        Drag the picture to look around. To read more:
        <a href="https://docs.jj-vcs.dev/latest/" target="_blank" rel="noopener">the jj documentation</a>,
        <a href="https://github.com/jj-vcs/jj/blob/main/docs/git-comparison.md" target="_blank" rel="noopener">its comparison with Git</a>,
        <a href="https://sarthakag.bearblog.dev/from-git-to-jj-jujutsu/" target="_blank" rel="noopener">From Git to jj</a>,
        and <a href="https://ethanlowman.com/posts/jj-primer/" target="_blank" rel="noopener">a jj primer</a>.`,
      git: {
        label: 'Next to Git',
        note: `What jj does without: the index, the stash, a current branch, and a rebase
          that stops halfway. What it adds: one log of everything you did, and an undo for
          all of it.`,
      },
    });

    return steps;
  };

  // A step's terminal and its Git box, as lines of HTML. The panel and the page's
  // script-free copy of the lesson (scripts/jj-lesson.mjs) both draw from these.
  JJ.terminalLines = function terminalLines(step) {
    if (!step.cmd) return [];
    return [`<span class="prompt">$</span> <span class="typed">${step.cmd}</span>`, ...step.out];
  };

  JJ.gitLines = function gitLines(step) {
    // Git's commands, or a plain word when it has none for this step.
    const typed = (step.git.cmd || []).map(
      (line) => `<span class="prompt">$</span> ${line.replace(/</g, '&lt;')}`
    );
    const none = step.git.none ? [`<span class="none">${step.git.none}</span>`] : [];
    return [...typed, ...none];
  };
})((window.JJ = window.JJ || {}));
