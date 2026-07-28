# Agents — plain-text Markdown for AI

Every post and page is published with a plain-text Markdown twin, so AI agents can read clean
content instead of scraping HTML, and a `/llms.txt` index handles discovery. It is built as a
post-build step, like Pagefind: no Jekyll plugin, and no content files touched.

## URLs
Append `.md` to any page URL. The twin is a sibling file, with the trailing slash dropped:

| Page | Markdown twin |
|---|---|
| `/about/` | `/about.md` |
| `/2026/childhood-computing/` | `/2026/childhood-computing.md` |
| `/` (home) | — (a listing, not an article; excluded) |

## Discovery
Two paths lead agents to the twins. Every post and page `<head>` carries a
`<link rel="alternate" type="text/markdown" href="…md">`, added in `_layouts/default.html`
and gated on `page.collection == 'posts' or 'pages'`. And `/llms.txt`
([llmstxt.org](https://llmstxt.org)) is a Markdown index: the site title and description,
then every page and post linked to its `.md`, posts grouped by year, newest first. It runs to
roughly 1,480 entries.

## How it's built
Three pieces run in this order, in CI and in `make build`.

First, `agents-manifest.json` at the repo root is a plugin-free Jekyll template. It emits
`{ site, docs:[{url, path, title, date, collection}] }` for every post and page. Jekyll owns
the URL truth (permalinks plus `jekyll-titles-from-headings`), so the script never re-derives
a slug. It is marked `sitemap: false`, and as a build artifact it is deleted before deploy.

Then `scripts/build-agent-markdown.mjs`, Node with no dependencies, reads the manifest, opens
each source `.md` (the clean Markdown, not rendered HTML), strips the YAML front matter, and
writes `_site/<slug>.md`. After that it writes `_site/llms.txt`, then deletes the manifest.

The step runs in `.github/workflows/jekyll-build-deploy.yml` right after `jekyll build` and
before Pagefind; Pagefind indexes HTML only, so the `.md` and `.txt` files don't interfere.
The `Makefile` `build` target uses the same order.

## Content shape of each `.md`
```
# {Title}

> Markdown version of https://brajeshwar.com/{url}/{ — YYYY-MM-DD for posts}

{source body, front matter stripped}
```

The title comes from Jekyll, either front matter or the H1 via `titles-from-headings`, and a
duplicate leading `#` or `<h1>` in the body is removed so there is exactly one title. Dates
appear for posts only: collection pages have no real date, since Jekyll defaults them to the
build time, so the date is omitted for pages to avoid implying they were published "today".

## Notes / gotchas
- The extension is `.md`, not `.txt`. It matches the "append `.md`" convention agents try and
  signals the format. Served as `text/markdown`.
- Zero content files are touched; the twins live only in `_site`. To regenerate locally, run
  `make build` (or `bundle exec jekyll build && node scripts/build-agent-markdown.mjs`).
- The twins are generated *after* `jekyll build`, so they are not in `sitemap.xml`; the head
  `rel=alternate` links and `/llms.txt` are the discovery path.
