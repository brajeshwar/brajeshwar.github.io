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

**`_test/browser.spec.mjs`** runs in real Chrome on a plain static server, like Pages:

- **Theme matrix**: OS light/dark × saved light/dark/auto gives the right `color-scheme`, meta
  and page color, and switching in the panel takes effect at once.
- **No script errors** on the home page, a footnoted post, `/about/`, `/archives/`, `/books/`,
  `/cv/`, `/search/`, `/random/` and the 404.
- **Sidenotes** appear on a wide screen.
- **JavaScript off** (guardrail 4): every page above renders its content, footnotes stay
  footnotes, `/search/` shows its `<noscript>` way out, and auto still follows a dark OS.

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
