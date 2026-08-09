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

## The reader-facing half: `_includes/page-actions.html` (2026-08-09)

Everything above is machinery no reader sees. `page-actions.html` is the bar that puts it in
front of them — *"Open in OpenAI · Claude | [md] [pdf]"* — modelled on
<https://ovellum.oss.oinam.com/docs/>. Live on `/cv/`; **any page or post can include it
unchanged**, since it derives everything from `page`:

```liquid
{% include page-actions.html %}              <!-- that is the whole thing -->
{% include page-actions.html kind="post" %}  <!-- only improves the prompt wording -->
```

The AI links do not upload or embed anything. They open a new chat pre-filled with
`Read <abs-url>.md — I have questions about this …`, so **the `.md` twin is the entire
mechanism** and has to be public. `url_encode` (not `uri_escape`) so the nested URL is fully
percent-encoded, matching what the reference bar sends.

⚠️ The `.md` URL expression is duplicated in `_layouts/default.html`, which emits the
`<link rel="alternate" type="text/markdown">` for the same file. Change one, change both.

⚠️ **Twins are CI-only**, so every link in the bar 404s under `jekyll serve`. Run
`node scripts/build-agent-markdown.mjs` after a build to check them locally. Not worth a local
build step — but unlike esbuild and hash-assets, this one is *visible*, so expect it to be
reported as broken.

PDF is `window.print()`, honestly: there is no PDF generator here. `assets/print.css` is
Gutenberg-based and linked `media="print"`, so the result is a clean document. The button ships
`hidden` and `page-actions.js` unhides it — with JavaScript off there is no dead control, and
the reader's own Print command still works (guardrail 4).

## ⚠️ Liquid and HTML comments are stripped (2026-08-09) — and why that mattered

`build-agent-markdown.mjs` reads the **source** file, so Jekyll never gets a chance to strip
Liquid comments out of it. The pages here carry long ones: `/cv.md` opened with 30 lines about
why `/cv/` stopped using the timeline component, ahead of any actual CV. Audited across the
site, **14 of 24 pages were shipping author-only build notes** into `/llms.txt` consumers.

`stripLiquidComments` now removes both `{% comment %}` spellings and HTML comments, next to
`stripFrontMatter`.

## ⚠️ OPEN: HTML-sourced pages emit HTML, not Markdown

The script's premise is that the source is Markdown — true for all 1,457 posts, and false for
the 14 pages converted to `.html` since 2026-08-01. Their twins are readable content (an LLM
parses HTML fine) but they are not Markdown, and a reader clicking the `[md]` icon on `/cv/`
gets tags.

Fixing it means an HTML→Markdown conversion — a new dependency, or per-page handling — and it
touches every page's agent output, so it is **deliberately not bundled** with the bar above.
See [`todo.md`](todo.md) for the audit.
