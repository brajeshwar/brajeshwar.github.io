# Hosting — brajeshwar.com

How the site is built and served: GitHub, Cloudflare, and the versions behind both.
Decisions are dated where they were taken.

## Where it runs

The primary host is GitHub Pages, built and deployed by GitHub Actions. Cloudflare Pages
builds the same repo as a backup, added 2026-07-26, reversing the 2026-07-05 call recorded
below. Cloudflare also provides DNS and CDN, sitting in front of the GitHub Pages origin.

Only the GitHub Pages deploy answers on brajeshwar.com. The Cloudflare Pages build is a
standby: it proves the site still builds somewhere else, and can be promoted by moving DNS.

## GitHub: build and deploy

`.github/workflows/jekyll-build-deploy.yml` is the modern actions/deploy-pages flow, not the
legacy branch-publish. It triggers on push to main, a daily cron at 00:01 UTC, and manual
dispatch.

The cron is not decoration. Jekyll defaults to future: false, so a post dated ahead of today
is simply not built. Without a daily rebuild, post-dated articles would never appear on their
own; the cron is what publishes them. It is also why the local build count runs lower than
the number of files in _posts/.

Steps: checkout → Ruby → Node → configure-pages → jekyll build → agent Markdown twins →
Pagefind index → upload artifact → deploy.

The build passes `--baseurl "${{ steps.pages.outputs.base_path }}"`. With a custom domain
set, base_path is empty, so links resolve at the domain root.

### Versions

Moved here from README.md on 2026-07-26.

We build with GitHub Actions, not with GitHub Pages' own Jekyll. The Pages
[dependency versions](https://pages.github.com/versions/) list pins Jekyll 3.10.x through the
github-pages gem and no longer applies to us. Gemfile.lock is the source of truth, which is
how we run Jekyll 4.

- Ruby 3.3.5, pinned in the workflow.
- Jekyll 4.4.1, kramdown 2.5.1, kramdown-parser-gfm 1.1.0, Liquid 4.0.4, Rouge 4.5.2.
- Dart Sass: jekyll-sass-converter 3.1.0, sass-embedded 1.89.2. The old Sass 3.7.4 line
  meant Ruby Sass.
- Five plugins: jekyll-feed 0.17.0, jekyll-sitemap 1.4.0, jekyll-paginate 1.1.0,
  jekyll-optional-front-matter 0.3.2, jekyll-titles-from-headings 0.5.3.
- Actions: checkout@v4, setup-ruby@v1, setup-node@v4, configure-pages@v5,
  upload-pages-artifact@v3, deploy-pages@v4.
- Node 22 LTS, to run Pagefind, scripts/build-agent-markdown.mjs, and the esbuild minify
  step. build-agent-markdown.mjs imports nothing beyond node:fs and node:path, so there is
  still no package.json and no npm dependency tree to carry. Bumped from 18 on 2026-07-27;
  18 had passed end of life on 30 Apr 2025. 22 is also what the site is developed against
  locally, so the two now match.
- Pagefind is not pinned. The workflow runs npm install pagefind, so every build takes
  whatever npm calls latest, 1.5.2 today.
- esbuild is not pinned either: npx --yes esbuild, added 2026-07-27. It minifies
  _site/assets/scripts/*.js in place, so no HTML reference depends on it and a failure
  degrades to unminified rather than to a broken page. See _docs/javascript.md.

### Limits

GitHub warns above 50 MiB per file and blocks above 100 MiB. A published Pages site may be
no larger than 1 GB. The 10-builds-per-hour cap does not apply to us, since we build through
our own Actions workflow.

## Repo and domain

The repo is brajeshwar/brajeshwar.github.io, a user site. Git URL is
git@github.com:brajeshwar/brajeshwar.github.io.git.

The custom domain comes from the committed CNAME file, which lands in the published output.
That file, not the repo name, is what makes Pages serve at brajeshwar.com. _config.yml is
already domain-based: url: https://brajeshwar.com, baseurl: ''.

### Decision: do not rename the repo to brajeshwar.com (2026-07-05)

It would keep working, since the CNAME overrides the repo name and base_path stays empty,
but renaming turns a user site into a project site. That makes root-serving depend on the
custom domain, where a user-site repo serves at root unconditionally; it can reset the Pages
custom-domain setting on rename (self-heals on the next deploy via CNAME, but check
Settings → Pages); and it needs a local git remote set-url. A cosmetic gain for a slightly
less sturdy setup. Keep brajeshwar.github.io.

## Cloudflare: DNS and CDN

Grey cloud (DNS-only) is name resolution alone; traffic goes straight to GitHub Pages,
which has its own Fastly CDN. Orange cloud (proxied) puts Cloudflare's edge in front, giving
CDN, caching, WAF, analytics, and Workers.

The proxy earns its place mainly through Workers, since the roadmap has edge-redirect work
(see [`todo.md`](todo.md)): docs.brajeshwar.com → archive.oinam.com, migrating the Jekyll
redirects, the cdn.oinam.com migration, the 404 next-steps. The CDN speed gain alone is
marginal; the site is tiny and already CDN-backed.

Setup gotcha: SSL mode must be Full, not Flexible, or you get redirect loops. GitHub Pages
must issue its Let's Encrypt cert first. The reliable order is grey-cloud DNS, wait for
Pages to show the cert and enable "Enforce HTTPS", then flip to orange-cloud with SSL =
Full.

## Cache headers we actually get (measured 2026-07-27)

Not configured by us; there is no `_headers` file in the repo. This is what the edge
returns, and it drove the decision to externalise the CSS:

| Path | `Cache-Control` | Effect |
|---|---|---|
| `/assets/*` (css, js, fonts) | `max-age=31536000` | **one year**, gzipped |
| HTML pages | `max-age=600` | 10 minutes |

    $ curl -sSI https://brajeshwar.com/assets/print.css
    cache-control: max-age=31536000
    content-encoding: gzip

⚠️ **A year means no re-request and no revalidation.** The browser does not ask; it uses
its copy. Any asset we ship under a stable filename is therefore unreachable to a returning
reader for up to a year, and that was quietly true of every JavaScript fix since the move to
this host.

`scripts/hash-assets.mjs` is the answer. It renames assets to `<name>.<hash>.ext` after the
build and rewrites every reference, so changed bytes always arrive at a new URL, which is
the one thing a cache cannot satisfy. It runs in the Actions deploy, after the esbuild
minify step (hashing before minifying would describe bytes we do not ship). A build that
skips it stays on the unhashed paths and is internally consistent; see the backup note
below.

It covers fonts too, in two passes (2026-07-27). CSS references fonts and HTML references
CSS, so the leaves are hashed first: fonts, then the font URLs inside the built stylesheets
are rewritten, and only then is the CSS hashed, so that a stylesheet's hash covers its own
font URLs. Hashing them in one pass would have produced a CSS hash describing content about
to change. Fonts nothing references are left alone rather than renamed to a URL nobody
links to.

### Why a hash and not `?v=<published-date>`

Brajeshwar asked, 2026-07-27. Same goal, and the query string is the older technique, but it
loses twice over.

First, a date busts when nothing changed. This site rebuilds on a daily cron, so
`?v=2026-07-28` would hand every returning reader a new URL every day and re-download
byte-identical CSS ~365 times a year — worse than no busting at all, which at least serves
from cache. A content hash changes only when the bytes change: a handful of times a year.
The date answers *"when did we build"*; the question is *"did this file change"*.

Second, some caches ignore query strings. A hashed filename is a genuinely different
resource to every cache, proxy, and browser there is. A query string is a hint
intermediaries may disregard, and Cloudflare ships a cache level, *Ignore Query String*,
that does exactly that. The bust would silently stop working and nothing would look wrong.

So: leave the browser TTL at a year. A shorter TTL (a month, say) is what you choose when
filenames are stable and you are hedging against staleness. Hashing removes the staleness,
so shortening it only makes returning readers re-fetch identical files more often for no
benefit. `max-age=31536000` on an immutable URL is the standard pairing. The knob, if it is
ever wanted, is Cloudflare → Caching → Configuration → Browser Cache TTL.

Conditional requests still work when they are reached: an `If-None-Match` against the weak
ETag returns `304` with zero bytes. That is the fallback, not the mechanism.

## Cloudflare Pages: the backup build (2026-07-26)

This reverses the 2026-07-05 decision, which was to keep Cloudflare Pages dormant on the
grounds that a second host is redundant. The point now is insurance rather than speed: if
the Actions pipeline or Pages itself breaks, a second builder that already produces a
working _site is worth the small setup cost.

The settings are all dashboard-side:

- Build command: `bundle exec jekyll build && node scripts/build-agent-markdown.mjs && npx
  pagefind --site _site` — three of the four steps `make build` and CI run.
  ⚠️ It does **not** include the esbuild minify step (added to CI 2026-07-27), and that is
  deliberate: the step rewrites files in place and changes no HTML reference, so the backup
  simply serves unminified JavaScript and works identically. Add
  `&& npx --yes esbuild _site/assets/scripts/*.js --minify --outdir=_site/assets/scripts --allow-overwrite`
  before the pagefind step if you ever want parity. Leave off the --baseurl flag; baseurl
  is already '' in _config.yml.
- Output directory: _site
- Environment: JEKYLL_ENV = production, for parity with the Actions build.

The build command needs no `bundle install` in front of it. Pages reads the Gemfile and
runs it automatically before the command, which is why the Gemfile and Gemfile.lock must
stay committed. (SKIP_DEPENDENCY_INSTALL=1 turns that off, which we do not want.)

Decided 2026-07-26: let Cloudflare use its own defaults, and pin nothing at our end. The v3
build image ships Ruby 3.4.4 and Node 22.16.0, and the backup runs on those. We
deliberately do not add a .ruby-version or .nvmrc to the repo root, and do not set
RUBY_VERSION or NODE_VERSION in the dashboard. If a default moves and the build breaks, we
fix it then; a standby is not worth the maintenance of a second set of version pins that
would also leak into local dev and into the Actions build. (Override files exist if we ever
change our mind; the v2 image, Ruby 3.2.2 / Node 18.17.1, is deprecated on 23 Feb 2027, so
stay on v3.)

A consequence worth knowing: the two builders now run different Ruby and Node versions,
Actions on Ruby 3.3.5 / Node 22, Cloudflare on whatever v3 ships. That is a feature here.
The backup building green on newer versions is early warning that an upgrade on the Actions
side would be safe.

The old README line claimed Ruby 3.3.5 was "the one working with CloudFlare Pages." Nothing
in the repo records why it was really picked, and it is not a Cloudflare requirement.

Things to keep straight:

- Do not point brajeshwar.com at the Cloudflare Pages project. It serves at its
  project.pages.dev address, and the custom domain stays on GitHub Pages. Promoting the
  backup should be a deliberate DNS move, never the default.
- The CNAME file is a GitHub Pages mechanism. Cloudflare Pages ignores it, which is
  harmless.
- On the standby, the feed, the sitemap, and the absolute-URL head tags still say
  brajeshwar.com, because _config.yml sets url to production. That is correct, and correct
  again the moment the backup is promoted — but it means the pages.dev build verifies that
  the site still *builds*, not that it serves as an independent site. Don't read those
  links as a bug.
- Cloudflare now steers new projects to Workers static assets rather than Pages. Pages is
  not being retired and existing projects stay supported, but it is in maintenance and new
  features land on Workers first. Fine for a backup; revisit if it ever becomes primary.

## Guardrail: don't publish dev files (fixed 2026-07-05)

_config.yml `exclude:` replaces Jekyll's default excludes, so it must re-list the important
ones. Publishing was leaking /CLAUDE/, /Makefile, /scripts/…, which are now excluded
(CLAUDE.md, Makefile, scripts, plus node_modules, vendor). Do not exclude
agents-manifest.json: Jekyll must render it for build-agent-markdown.mjs, which deletes it
before deploy. Re-check _site/ for stray dev files after touching exclude or adding
root-level tooling.
