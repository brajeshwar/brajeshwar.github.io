// Wires the lesson to the page: the text panel, the step controls, and the stage.
(function (JJ) {
  'use strict';

  const SEED = 7; // any number works; this one gives IDs that are easy to tell apart
  const query = new URLSearchParams(location.search);
  const find = (id) => document.getElementById(id);

  const repo = new JJ.Repo(SEED);
  const steps = JJ.buildLesson(repo, new JJ.Git(SEED));
  const chapters = [...new Set(steps.map((step) => step.chapter))];
  const stage = new JJ.Stage(find('stage'), repo, find('panel'), find('key'));
  const gitPicture = new JJ.GitPicture(find('git-picture'));
  let current = 0;

  // ---- Theme ---------------------------------------------------------------------------
  // The page's head settles day or night before paint. The button swaps it for this
  // visit; the next visit goes by the clock again.

  function activeTheme() {
    return document.documentElement.dataset.theme;
  }

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name=color-scheme]').content = activeTheme();
    find('theme').textContent = activeTheme() === 'dark' ? 'Light' : 'Dark';
    stage.readColors();
    gitPicture.readColors();
  }

  find('theme').addEventListener('click', () => {
    const theme = activeTheme() === 'dark' ? 'light' : 'dark';
    try {
      sessionStorage.setItem('jj-theme', theme);
    } catch (error) {
      // Private windows may refuse storage; the choice then lasts for this page only.
    }
    applyTheme(theme);
  });

  // ---- Steps ---------------------------------------------------------------------------

  function showStep(index, instant) {
    current = Math.min(steps.length - 1, Math.max(0, index));
    const step = steps[current];
    const chapterNumber = chapters.indexOf(step.chapter) + 1;

    find('chapter').textContent = `Chapter ${chapterNumber} of ${chapters.length}: ${step.chapter}`;
    find('title').textContent = step.title;
    find('body').innerHTML = step.body;
    find('count').textContent = `${current + 1} / ${steps.length}`;

    const terminal = find('terminal');
    const wrap = (lines) => lines.map((line) => `<div>${line}</div>`).join('');
    terminal.hidden = !step.cmd;
    terminal.innerHTML = wrap(JJ.terminalLines(step));
    find('git-label').textContent = step.git.label;
    find('git-commands').innerHTML = wrap(JJ.gitLines(step));
    find('git-note').innerHTML = step.git.note;
    gitPicture.show(step.gitState);
    document.querySelector('.lesson').scrollTop = 0;

    find('back').disabled = current === 0;
    find('next').textContent = current === steps.length - 1 ? 'Start again' : 'Next';
    [...find('progress').children].forEach((item, i) => {
      item.firstChild.classList.toggle('done', i < current);
      item.firstChild.toggleAttribute('aria-current', i === current);
    });

    history.replaceState(null, '', `#${current + 1}`);
    stage.show(step, instant);
  }

  function forward() {
    showStep(current === steps.length - 1 ? 0 : current + 1);
  }

  function buildProgress() {
    const list = find('progress');
    steps.forEach((step, i) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.title = `${i + 1}. ${step.title}`;
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => showStep(i));
      item.classList.toggle('opens-chapter', i > 0 && steps[i - 1].chapter !== step.chapter);
      item.append(button);
      list.append(item);
    });
  }

  find('back').addEventListener('click', () => showStep(current - 1));
  find('next').addEventListener('click', forward);
  window.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const onButton = event.target.closest('button, summary');
    if (
      event.key === 'ArrowRight' ||
      event.key === 'PageDown' ||
      (event.key === ' ' && !onButton)
    ) {
      event.preventDefault();
      forward();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      showStep(current - 1);
    }
  });

  // ---- Start ---------------------------------------------------------------------------

  // `?still` freezes all motion, which is also what a reduced-motion setting asks for.
  stage.still = query.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The key lies open along the bottom of a wide screen and folds away on a narrow one.
  const wide = matchMedia('(min-width: 900px)');
  const placeKey = () => (find('key').open = wide.matches);
  wide.addEventListener('change', placeKey);
  placeKey();

  buildProgress();
  applyTheme();
  showStep((parseInt(location.hash.slice(1), 10) || 1) - 1, true);
  stage.start();
})(window.JJ);
