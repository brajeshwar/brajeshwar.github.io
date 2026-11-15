# Testing

Added 2026-11-15, after the Dark-mode click flash: *"Let's write a full test suite so things
like this do not pop up next time."*

    make test

That builds a production-parity copy of the site into `_test/site/` (about 15 seconds) and
runs every check against it (about 10 more). In CI the same suite runs against `_site/` after
Pagefind and **before the upload, so a failing test stops the deploy**. The live site stays on
the last good build, the same deal as the album fetch.

## Why its own build directory

The tests read a separate build in `_test/site`, never the `_site/` you are previewing. A
running `jekyll serve --incremental --future` writes the 2099 drafts and other future-dated
posts into `_site/`, and the tests must see what deploys, not the preview. Found the first
time this suite ran: `_site/2099/` existed locally while every one of those URLs 404s live.

`make test` skips the album fetch so it stays offline. Nothing asserts on the Albums strip.

## What is in it

One runner, Playwright, for both tiers. `@playwright/test` is the only test dependency, and
the browser is the installed **Google Chrome** (`channel: 'chrome'`), not a downloaded one.
GitHub's runner image already has Chrome, so the daily cron downloads nothing.

**`_test/build.spec.mjs`** reads the built files, with no browser:

| check | the rule or bug behind it |
|---|---|
| every URL in `_test/urls.txt` resolves | guardrail 2 |
| redirect stubs refresh to their target, never to another stub | guardrail 2, the `/photos/` re-point |
| no `/2099/` output, none in the sitemap | `_posts/todo/` hides nothing; the date does |
| no CLAUDE / Makefile / package.json / scripts / `.scss` in the output | `exclude:` and `.gitignore` are two switches |
| explicit Dark and Light pin `color-scheme` | the click flash, 2026-11-15 |
| every page runs the no-flash snippet before the stylesheet, with one color-scheme meta | same |
| no `/*!` in the CSS; no Sass block comment left open | the `.timeline h2` comment that ate two declarations |
| no color literals outside `themes.scss` (one allowlisted scrim) | "no hardcoded colors" |
| every page has a lang, a title and an `<h1>` | layouts emit the title |
| every `/assets/` reference exists | hash renaming |
| `sidenotes.js`, `anchors.js` and `strip-nav.js` load only where they have work | the Liquid `assign … contains` trap |
| the Pagefind index exists | search |
| the South Bank walk names no file outside its folder, its list of stops matches its model, every building has its two colors, and every landmark it names is on the board, once | [`misc.md`](misc.md): a one-off is self-contained, and a stop lives in two files |

**`_test/browser.spec.mjs`** runs in real Chrome on a plain static server, like Pages. The
server is `_test/serve.mjs`, about forty lines of Node. Python's `http.server` did the job
until 2026-11-15, but it queues only five connections, and parallel workers on macOS got
reset ("Failed to load resource" in tests with nothing wrong). Its 404 message also happened
to match the old favicon filter, so it had been hiding a broken image on `/about/`:

- **Theme matrix**: OS light/dark × saved light/dark/auto gives the right `color-scheme`, meta
  and page color. The Light/Dark toggle flips at once, and switching back to the system's
  own mode forgets the choice so the page follows the system again.
- **No script errors** on the home page, a footnoted post, `/about/`, `/archives/`, `/books/`,
  `/cv/`, `/search/`, `/random/` and the 404.
- **Sidenotes** appear on a wide screen.
- **JavaScript off** (guardrail 4): every page above renders its content, footnotes stay
  footnotes, `/search/` shows its `<noscript>` way out, and auto still follows a dark OS.
- **`/misc/london-southbank/`**: the page settles as the model or as the picture, with no
  errors either way. CI's Chrome may have no WebGL2, so the test accepts both and then takes
  WebGL away on purpose: the picture loads, every pin shows and leads to its stop, and no
  button is left on show. The same holds with JavaScript off. With the browser's clock set, the
  page is night at ten in the evening and day at noon, and the button turns it over for the
  visit. Flying the walk brings out its speeds; choosing one leaves the flight going, and
  pausing puts them away.

The JS-off theme test found a real bug the day it was written: with scripting off, `<html>`
never gets `data-theme="auto"`, so a dark-OS reader got the light page. `themes.scss` now
treats a missing `data-theme` as auto.

## Keeping it honest

- **New posts do not need anything.** The URL check only fails on a URL that *disappears*.
  To put new URLs under the same protection, run `make test-urls` now and then and commit
  `_test/urls.txt`. It only ever adds; taking a URL off the list is a decision, made by hand,
  and it normally comes with a `_redirect/` stub.
- **Keep it offline and deterministic.** It gates the daily deploy, so nothing in it may
  fetch the network (no external link checking) or depend on timing beyond polling for a
  transition to end.
- **When a test fails, ask first whether the test or the site is wrong.** Two of the first
  four failures were test bugs: a `//` matched inside `https://`, and a color read in the
  middle of the body's 500 ms fade.
- `_test/` starts with an underscore, so Jekyll never copies it. `package.json` and the
  lockfile are root-level and are excluded in `_config.yml`, the same as the Makefile.

## Lint and format

Added 2026-11-15: *"Can we lint our code and format (prettifier) them?"*

    make lint      # check: ESLint, Stylelint, prettier --check. CI runs this, after the tests
    make format    # rewrite in the house style, then run make lint

**Scope is the code and nothing else:** `_sass/`, `assets/scripts/`, `misc/**/*.js`,
`scripts/` and `_test/`, plus the config files. Never `_posts`, `_pages`, `_drafts` or `_data` (guardrail 1), and
never `_layouts` or `_includes`, because Prettier does not understand Liquid and would mangle it.
The paths live in `package.json`'s `lint` and `format` scripts.

| tool | config | what it holds the code to |
|---|---|---|
| Prettier | `.prettierrc.mjs` | layout: single quotes, 100 columns, ES5 trailing commas |
| ESLint | `eslint.config.mjs` | `@eslint/js` recommended, correctness only. Browser globals for `assets/scripts` and `misc` (whose scripts are modules), Node for the rest |
| Stylelint | `.stylelintrc.mjs` | `stylelint-config-recommended-scss`, correctness only, three rules off (each says why) |

- [WARNING] **Prettier removed the hand-aligned columns** in the Sass (the `:` in `config.scss`'s
  ratio list, the `--step-*` values). It has no option to keep them. The reformat is its own
  commit. If the columns matter more than the tool, revert that one commit and drop the
  `prettier --check` from `npm run lint`, or CI will fail on the unformatted code.
- **The reformat changed no rendered value.** The built stylesheet differed in six lines across
  three rules, all of them spelling: hex went lowercase (`#FFFCF0` → `#fffcf0`) and trailing
  zeros dropped (`0.10` → `0.1`). The tests passed before and after.
- What the first lint run found, fixed with no change in behavior: a variable in `search.js`
  that was assigned and never read, a needless escape in a `sidenotes.js` regex, a raw BOM
  character in a `build-agent-markdown.mjs` regex (now `﻿`), and two `word-wrap`
  declarations (now `overflow-wrap`, the standard name for the same property).
- Two ESLint rules are relaxed rather than "fixed": `catch (e) {}` around `localStorage` is
  deliberate, since storage can throw and the right response is to carry on.
- `eslint.config.mjs` is excluded in `_config.yml`, because ESLint will not read a dotfile name.
  The other two configs are dotfiles, which Jekyll never copies.
