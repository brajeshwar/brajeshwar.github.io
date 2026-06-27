# SEARCH — brajeshwar.com

Site-wide search in the header, powered by **Pagefind**, lazy-loaded so it costs
nothing on normal page loads. Partner docs: [`MEMORY.md`](MEMORY.md).

## UI choice — Modular UI (not the Default UI)
Pagefind 1.5 ships three front-ends; we use the **Modular UI** (`pagefind-modular-ui.js`),
assembled in our own ⌘K shell. It's by far the lightest, themes via the same
`--pagefind-ui-*` vars, and gives full control of markup. (We're on Pagefind **1.5.2** — current;
this is a UI choice, not a version question. The Default UI we used before is heavier; the
Component UI / `<pagefind-modal>` is heavier still and harder to theme.)

| Front-end | eager JS+CSS (gzip) | |
|---|---|---|
| Default UI (`pagefind-ui.js`) | ~32 KB | what we used before |
| Component UI (`pagefind-component-ui.js`) | ~40 KB | native modal, best a11y, heavy |
| **Modular UI (`pagefind-modular-ui.js`)** | **~5 KB** | ← we use this in our own shell |

## Why lazy
The index is sharded and fetched on demand — only the small Modular UI runtime is eager,
and even that loads on **first open** (Option 1). Measured for this site (~1,480 pages, gzip):

| When | Files | Transfer |
|---|---|---|
| **Page load** | nothing (just the trigger markup) | ~0 |
| **First open** | `pagefind-modular-ui.js` + `.css` | **~5 KB** |
| **First keystroke / focus** | core + `wasm.en` + entry | ~85 KB (once, cached) |
| **Per query / per result** | index chunks (~28 KB) / fragments (~4 KB) | on demand |
| Full index on disk | `index/` 2 MB + `fragment/` 6 MB | never loaded wholesale |

## How it works — in-place ⌘K command palette
- **Markup** (`_includes/header.html`): a `<site-search>` with
  - `a.site-search__trigger` → a real link to **`/search/`** (the JS-off fallback) + a
    `kbd.site-search__hint` (⌘K / Ctrl K, set per-platform by JS),
  - a `.site-search__backdrop` and a `.site-search__panel > #header-search` (both `hidden`).
- **Markup** also has three mount points inside the panel: `#header-search-input`,
  `#header-search-summary`, `#header-search-results` (one per Modular UI component).
- **Script** (`assets/scripts/search.js`, `defer`): opens a **centered popup in place** —
  never navigates while JS is on. Opened by the trigger **or ⌘K / Ctrl+K** (global keydown);
  closed by **Esc** or backdrop. On first open it injects `pagefind-modular-ui.css` +
  `pagefind-modular-ui.js` **once**, then builds a `PagefindModularUI.Instance` and adds
  `Input` + `Summary` + `ResultList` (`showImages: false` — text-only) into the three mounts,
  and focuses the input. The Input preloads Pagefind on focus, so the first query is instant.
  If Pagefind can't load, it shows an in-panel message linking to `/search/` (no auto-navigate).
  - **Ready-guard**: init runs on `DOMContentLoaded` (like `sidenotes.js`) so handlers always
    attach — do not remove it.
- **Styles** (`_includes/css/8.2-tools-search.css`, in the base bundle): the trigger, the
  centered command-palette panel + scrim, the ⌘K hint badge, the error message, result-list
  spacing (`.pagefind-modular-list-*`), and `--pagefind-ui-*` overrides on `.site-search__panel`
  mapping Pagefind onto our semantic tokens (results follow the active theme).
- **Asset URLs**: all `assets/scripts/*.js` load via `{{ '…' | relative_url }}` (root-relative),
  so they work under `jekyll serve` AND in production. **Do not** use `prepend: site.url` for
  scripts — that hardcodes `https://brajeshwar.com/…`, which 404s locally and made the trigger
  fall through to a plain navigation (the "search just goes to /search/" bug).
- **`/search/` page** (`_pages/search.html`): full-page Pagefind UI with an **auto-focused**
  input (`pagefind-autofocus.js`) — the JS-off fallback and a shareable search URL. Unchanged.
- **Index scope**: `<header>` and `<footer>` carry **`data-pagefind-ignore`** so the repeating
  chrome (nav, the ⌘K hint badge, footer columns) is excluded from the index — otherwise it
  pollutes every result's excerpt (the header sits at the top of `<body>`, so its text led every
  excerpt). Only real page content is indexed. *(Posts that genuinely mention ⌘K — e.g. Monaco,
  Safari — will still show it in their own excerpts; that's real content.)*
- **Build/deploy**: unchanged — `.github/workflows` runs `npx pagefind --site _site` after the
  Jekyll build.

## Verified (live, plain `jekyll serve`, 1440px)
- [x] **⌘K** opens the centered palette in place; **click** opens it too — neither navigates.
- [x] Query "monaco" → 2 results, highlighted, rendered inline.
- [x] **Esc** / backdrop close; reopening works.
- [x] `/search/` page loads with the input **auto-focused**.
- [x] Page load injects **no** Pagefind assets (only the trigger markup).

## Running search locally
`jekyll serve` does **not** build the Pagefind index (only CI does), and its `--watch`
even wipes `_site/pagefind/` on every rebuild — so ⌘K shows *"Search isn't available right
now"* under a bare `jekyll serve`. Use the **`Makefile`**:

| Command | What you get |
|---|---|
| `make serve` | build + index, then serve static `_site` → **⌘K search works**. No live-reload (re-run after edits). |
| `make dev`   | `jekyll serve` with live-reload, **no** search index (palette shows the fallback). For content/layout. |
| `make build` | full production-parity build into `_site/` (site + index). |
| `make pagefind` | (re)build just the index against the current `_site/`. |

`search.js` is cached hard by the dev server — **hard-reload** after changing it.
