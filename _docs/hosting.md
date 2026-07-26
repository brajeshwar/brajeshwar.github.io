# Hosting — brajeshwar.com

How the site is built and served: GitHub, Cloudflare, and the versions behind both.
Decisions are dated where they were taken.

## Where it runs

- Primary: GitHub Pages, built and deployed by GitHub Actions.
- Backup: Cloudflare Pages, building the same repo. Added 2026-07-26, reversing the
  2026-07-05 call recorded below.
- DNS and CDN: Cloudflare, in front of the GitHub Pages origin.

Only the GitHub Pages deploy answers on brajeshwar.com. The Cloudflare Pages build is a
standby — it proves the site still builds somewhere else, and can be promoted by moving DNS.

## GitHub: build and deploy

`.github/workflows/jekyll-build-deploy.yml` — the modern actions/deploy-pages flow, not the
legacy branch-publish. Triggers: push to main, a daily cron at 00:01 UTC, and manual dispatch.

The cron is not decoration. Jekyll defaults to future: false, so a post dated ahead of today
is simply not built. Without a daily rebuild, post-dated articles would never appear on their
own — the cron is what publishes them. It is also why the local build count runs lower than
the number of files in _posts/.

Steps: checkout → Ruby → Node → configure-pages → jekyll build → agent Markdown twins →
Pagefind index → upload artifact → deploy.

The build passes `--baseurl "${{ steps.pages.outputs.base_path }}"`. With a custom domain set,
base_path is empty, so links resolve at the domain root.

### Versions

Moved here from README.md on 2026-07-26.

We build with GitHub Actions, not with GitHub Pages' own Jekyll. The Pages
[dependency versions](https://pages.github.com/versions/) list pins Jekyll 3.10.x through the
github-pages gem and no longer applies to us. Gemfile.lock is the source of truth, which is
how we run Jekyll 4.

- Ruby 3.3.5, pinned in the workflow
- Jekyll 4.4.1, kramdown 2.5.1, kramdown-parser-gfm 1.1.0, Liquid 4.0.4, Rouge 4.5.2
- Dart Sass — jekyll-sass-converter 3.1.0, sass-embedded 1.89.2. The old Sass 3.7.4 line
  meant Ruby Sass.
- Five plugins: jekyll-feed 0.17.0, jekyll-sitemap 1.4.0, jekyll-paginate 1.1.0,
  jekyll-optional-front-matter 0.3.2, jekyll-titles-from-headings 0.5.3
- Actions: checkout@v4, setup-ruby@v1, setup-node@v4, configure-pages@v5,
  upload-pages-artifact@v3, deploy-pages@v4
- Node 18, only to run Pagefind and scripts/build-agent-markdown.mjs. That script imports
  nothing beyond node:fs and node:path, so there is no package.json and no npm dependency
  tree to carry. Node 18 passed end of life on 30 Apr 2025 — worth bumping to 22.
- Pagefind is not pinned. The workflow runs npm install pagefind, so every build takes
  whatever npm calls latest, 1.5.2 today.

### Limits

GitHub warns above 50 MiB per file and blocks above 100 MiB. A published Pages site may be no
larger than 1 GB. The 10-builds-per-hour cap does not apply to us, since we build through our
own Actions workflow.

## Repo and domain

Repo is brajeshwar/brajeshwar.github.io — a user site. Git URL
git@github.com:brajeshwar/brajeshwar.github.io.git.

The custom domain comes from the committed CNAME file, which lands in the published output.
That file, not the repo name, is what makes Pages serve at brajeshwar.com. _config.yml is
already domain-based: url: https://brajeshwar.com, baseurl: ''.

### Decision: do not rename the repo to brajeshwar.com (2026-07-05)

It would keep working — the CNAME overrides the repo name and base_path stays empty — but
renaming turns a user site into a project site. That makes root-serving depend on the custom
domain, where a user-site repo serves at root unconditionally; it can reset the Pages
custom-domain setting on rename (self-heals on the next deploy via CNAME, but check
Settings → Pages); and it needs a local git remote set-url. Cosmetic gain, slightly less
robust. Keep brajeshwar.github.io.

## Cloudflare: DNS and CDN

Grey cloud (DNS-only) is name resolution alone — traffic goes straight to GitHub Pages, which
has its own Fastly CDN. Orange cloud (proxied) puts Cloudflare's edge in front, giving CDN,
caching, WAF, analytics, and Workers.

The proxy earns its place mainly through Workers, since the roadmap has edge-redirect work
(see [`todo.md`](todo.md)): docs.brajeshwar.com → archive.oinam.com, migrating the Jekyll
redirects, the cdn.oinam.com migration, the 404 next-steps. The CDN speed gain alone is
marginal — the site is tiny and already CDN-backed.

Setup gotcha: SSL mode must be Full, not Flexible, or you get redirect loops. GitHub Pages
must issue its Let's Encrypt cert first. Reliable order — grey-cloud DNS, wait for Pages to
show the cert and enable "Enforce HTTPS", then flip to orange-cloud with SSL = Full.

## Cloudflare Pages: the backup build (2026-07-26)

This reverses the 2026-07-05 decision, which was to keep Cloudflare Pages dormant on the
grounds that a second host is redundant. The point now is insurance rather than speed: if the
Actions pipeline or Pages itself breaks, a second builder that already produces a working
_site is worth the small setup cost.

Settings, all dashboard-side:

- Build command: `bundle exec jekyll build && node scripts/build-agent-markdown.mjs && npx
  pagefind --site _site` — the same three steps as `make build` and as CI. Leave off the
  --baseurl flag; baseurl is already '' in _config.yml.
- Output directory: _site
- Environment: JEKYLL_ENV = production, for parity with the Actions build.

The build command needs no `bundle install` in front of it. Pages reads the Gemfile and runs
it automatically before the command, which is why the Gemfile and Gemfile.lock must stay
committed. (SKIP_DEPENDENCY_INSTALL=1 turns that off, which we do not want.)

**Decided 2026-07-26: let Cloudflare use its own defaults. Pin nothing at our end.** The v3
build image ships Ruby 3.4.4 and Node 22.16.0, and the backup runs on those. We deliberately
do **not** add a .ruby-version or .nvmrc to the repo root, and do not set RUBY_VERSION or
NODE_VERSION in the dashboard. If a default moves and the build breaks, we fix it then — a
standby is not worth the maintenance of a second set of version pins that would also leak
into local dev and into the Actions build. (Override files exist if we ever change our mind;
the v2 image, Ruby 3.2.2 / Node 18.17.1, is deprecated on 23 Feb 2027, so stay on v3.)

A consequence worth knowing: the two builders now run different Ruby and Node versions —
Actions on Ruby 3.3.5 / Node 18, Cloudflare on whatever v3 ships. That is a feature here.
The backup building green on newer versions is early warning that an upgrade on the Actions
side would be safe.

The old README line claimed Ruby 3.3.5 was "the one working with CloudFlare Pages." Nothing
in the repo records why it was really picked, and it is not a Cloudflare requirement.

Things to keep straight:

- Do not point brajeshwar.com at the Cloudflare Pages project. It serves at its
  project.pages.dev address, and the custom domain stays on GitHub Pages. Promoting the
  backup should be a deliberate DNS move, never the default.
- The CNAME file is a GitHub Pages mechanism. Cloudflare Pages ignores it, which is harmless.
- On the standby, the feed, the sitemap, and the absolute-URL head tags still say
  brajeshwar.com, because _config.yml sets url to production. That is correct, and correct
  again the moment the backup is promoted — but it means the pages.dev build verifies that
  the site still *builds*, not that it serves as an independent site. Don't read those links
  as a bug.
- Cloudflare now steers new projects to Workers static assets rather than Pages. Pages is not
  being retired and existing projects stay supported, but it is in maintenance and new
  features land on Workers first. Fine for a backup; revisit if it ever becomes primary.

## Guardrail: don't publish dev files (fixed 2026-07-05)

_config.yml `exclude:` replaces Jekyll's default excludes, so it must re-list the important
ones. Publishing was leaking /CLAUDE/, /Makefile, /scripts/… — now excluded (CLAUDE.md,
Makefile, scripts, plus node_modules, vendor). Do not exclude agents-manifest.json: Jekyll
must render it for build-agent-markdown.mjs, which deletes it before deploy. Re-check _site/
for stray dev files after touching exclude or adding root-level tooling.
