# Hosting & DNS — brajeshwar.com

How the live site is served, and the decisions taken 2026-07-05.

## Current setup (keep it)
- **Host: GitHub Pages**, built + deployed by GitHub Actions
  (`.github/workflows/jekyll-build-deploy.yml`, the modern `actions/deploy-pages` flow —
  **not** the legacy branch-publish). Triggers: **push to `main`**, daily `cron`, manual.
- **Repo: `brajeshwar/brajeshwar.github.io`** — a **user site**. Git URL
  `git@github.com:brajeshwar/brajeshwar.github.io.git`.
- **Custom domain: `brajeshwar.com`**, via the committed **`CNAME`** file (contents:
  `brajeshwar.com`) which lands in the published output. This file — not the repo name —
  is what makes Pages serve at the domain. Config is domain-based already:
  `_config.yml` `url: https://brajeshwar.com`, `baseurl: ''`.
- The workflow builds with `--baseurl "${{ steps.pages.outputs.base_path }}"`; with a custom
  domain set, `base_path` is empty (root), so links resolve at the domain root.

## Decision: do NOT rename the repo to `brajeshwar.com`
It *would* keep working (the CNAME/custom domain overrides the repo name, and `base_path`
stays empty), but renaming turns a **user site** into a **project site**, which:
- makes root-serving *depend* on the custom domain (a user-site repo serves at root
  unconditionally — more bulletproof);
- can reset the Pages custom-domain setting on rename (self-heals on next deploy via CNAME,
  but verify Settings → Pages);
- frees the `brajeshwar.github.io` user-site slot; needs a local `git remote set-url`.

Net: **cosmetic gain, slightly less robust — not worth it. Keep `brajeshwar.github.io`.**
No repo changes are needed; the CNAME already makes the domain work.

## Decision: Cloudflare = DNS (+ proxy later), NOT Cloudflare Pages
- **Do not use Cloudflare Pages. Keep it dormant.** It would be a redundant second host and
  mean rebuilding the Jekyll + Pagefind + agent-markdown pipeline on Cloudflare's build. No
  benefit over the working GitHub Pages + Actions setup.
- **Cloudflare for DNS: yes.** Note the distinction:
  - **grey cloud (DNS-only)** = name resolution only; traffic goes straight to GitHub Pages
    (which already has its own Fastly CDN). *No Cloudflare CDN.*
  - **orange cloud (proxied)** = Cloudflare's edge in front → Cloudflare CDN + caching + WAF +
    analytics + **Workers**.
- **Proxy (orange cloud) is worth it — mainly for Workers**, because the roadmap has
  edge-redirect work (see [`todo.md`](todo.md)): `docs.brajeshwar.com → archive.oinam.com`,
  migrating the Jekyll redirects, `cdn.oinam.com` migration, the 404 next-steps. Those require
  Cloudflare to be in the request path. The CDN *speed* gain alone is marginal (the site is
  tiny and already CDN-backed by GitHub Pages).
- **Proxy setup gotcha:** Cloudflare SSL mode must be **Full** (not Flexible → redirect loops),
  and GitHub Pages must issue its Let's Encrypt cert **first**. Reliable order: DNS **grey-cloud**
  → wait for Pages to show the cert and enable "Enforce HTTPS" → flip to **orange-cloud** with
  SSL = Full. Stable after that.

## Guardrail: don't publish dev files (fixed 2026-07-05)
`_config.yml` `exclude:` **replaces** Jekyll's default excludes, so it must re-list the
important ones. Publishing was leaking `/CLAUDE/`, `/Makefile`, `/scripts/…` — now excluded
(`CLAUDE.md`, `Makefile`, `scripts`, plus `node_modules`, `vendor`). **Do not exclude
`agents-manifest.json`** — Jekyll must render it for `build-agent-markdown.mjs`, which deletes
it before deploy. Re-check `_site/` for stray dev files after touching `exclude` or adding
root-level tooling.
