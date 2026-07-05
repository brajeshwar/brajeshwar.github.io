# Agents — plain-text Markdown for AI

Every post and page is published with a **plain-text Markdown twin** so AI agents can read
clean content instead of scraping HTML, plus a **`/llms.txt`** index for discovery. Built as a
**post-build step** (like Pagefind) — no Jekyll plugin, no content files touched.

## URLs
Append **`.md`** to any page URL (sibling file, trailing slash dropped):

| Page | Markdown twin |
|---|---|
| `/about/` | `/about.md` |
| `/2026/childhood-computing/` | `/2026/childhood-computing.md` |
| `/` (home) | — (a listing, not an article; excluded) |

## Discovery
1. **`<link rel="alternate" type="text/markdown" href="…md">`** in every post/page `<head>`
   (`_layouts/default.html`, gated on `page.collection == 'posts' or 'pages'`).
2. **`/llms.txt`** ([llmstxt.org](https://llmstxt.org)) — a Markdown index: site title +
   description, then every page and post linked to its `.md` (posts grouped by year, newest
   first). ~1,480 entries.

## How it's built
Three pieces, run in this order (CI and `make build`):

1. **`agents-manifest.json`** (repo root) — a plugin-free Jekyll template. Emits
   `{ site, docs:[{url, path, title, date, collection}] }` for every post + page. **Jekyll owns
   the URL truth** (permalinks + `jekyll-titles-from-headings`), so the script never re-derives
   a slug. `sitemap: false`; it's a build artifact, deleted before deploy.
2. **`scripts/build-agent-markdown.mjs`** (Node, no deps) — reads the manifest, opens each
   **source** `.md` (clean Markdown, not rendered HTML), strips YAML front matter, and writes
   `_site/<slug>.md`. Then writes `_site/llms.txt`. Then deletes the manifest.
3. Runs in `.github/workflows/jekyll-build-deploy.yml` right after `jekyll build`, before
   Pagefind (Pagefind indexes HTML only, so the `.md`/`.txt` files don't interfere). Same order
   in the `Makefile` `build` target.

## Content shape of each `.md`
```
# {Title}

> Markdown version of https://brajeshwar.com/{url}/{ — YYYY-MM-DD for posts}

{source body, front matter stripped}
```
- The title comes from Jekyll (front matter or the H1 via `titles-from-headings`); a duplicate
  leading `#`/`<h1>` in the body is removed so there's exactly one title.
- **Dates: posts only.** Collection pages have no real date — Jekyll defaults them to the build
  time — so the date is omitted for pages to avoid implying they were published "today".

## Notes / gotchas
- **Extension is `.md`** (not `.txt`) — matches the "append `.md`" convention agents try, and
  signals the format. Served as `text/markdown`.
- Zero content files touched; the twins live only in `_site`. To regenerate locally:
  `make build` (or `bundle exec jekyll build && node scripts/build-agent-markdown.mjs`).
- The twins are generated *after* `jekyll build`, so they're **not** in `sitemap.xml` — the
  head `rel=alternate` links and `/llms.txt` are the discovery path.
