# Repository Guidelines

## Project Structure & Module Organization
- Source: `_posts/` (blog posts `YYYY-MM-DD-slug.md`), `_pages/` (static pages), layouts in `_layouts/`, partials in `_includes/`, data in `_data/`.
- Assets: `assets/` and `static/` for images, CSS, JS. Do not edit `_site/` (build output).
- Config: `_config.yml` (permalinks, plugins), `.editorconfig` (formatting), workflows in `.github/workflows/jekyll-build-deploy.yml`.

## Build, Test, and Development Commands
- `bundle install`: install Ruby gems (use Ruby `3.3.5`).
- `bundle exec jekyll serve`: run locally at `http://localhost:4000` (use `--livereload` if desired).
- `bundle exec jekyll build`: produce the site in `_site/`.
- `npx pagefind --site _site`: generate the search index locally (Pagefind powers search in CI).
- `bundle exec jekyll doctor`: basic site health checks.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; LF line endings; trim trailing whitespace; final newline (per `.editorconfig`).
- Markdown: prefer heading-derived titles (front matter optional). Use Kramdown + GFM; add language hints to code fences (e.g., ruby).
- Filenames: lowercase, dash-separated slugs (e.g., `_posts/2025-08-29-repo-guidelines.md`). Place page content in `_pages/` when not at root.
- Content: keep text-first; treat media as optional/ornamental. Follow examples in `styleguide.md` (figure, captions, asides).

## Testing Guidelines
- No unit tests; validate by building locally: `bundle exec jekyll build && bundle exec jekyll doctor`.
- Manually verify changed pages render, links work, and images are optimized. Keep per-file size < 50 MB (GitHub Pages limit).

## Commit & Pull Request Guidelines
- Commits: imperative, concise messages. Optional scopes like `content:`, `layout:`, `build:`, `docs:` (e.g., `content: add Pagefind how-to`).
- PRs: include summary, affected paths/URLs, before/after screenshots (when visual), and linked issues. Note any config/plugin changes.
- Requirements: build passes locally; no edits to `_site/`; keep diffs focused; update search index locally if content materially changes.

## Security & Configuration Tips
- Do not commit secrets. Algolia keys in `_config.yml` are search-only; Pagefind is the default search indexer in CI.
- When adding plugins, update `Gemfile` and `_config.yml` together and verify `jekyll serve` locally.
