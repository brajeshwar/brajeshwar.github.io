# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a Jekyll-based personal blog and website for brajeshwar.com. The site follows Jekyll conventions with:

- **Content**: Blog posts in `_posts/` organized by year (2001-2025+), pages in `_pages/`
- **Templates**: Layouts in `_layouts/` (default, post, page, page-full)
- **Styling**: CSS organized in `_includes/css/` with component-based structure
- **Data**: YAML files in `_data/` for books, devices, movies, navigation, etc.
- **Static assets**: Images, fonts, and scripts in `assets/` and root directory

## Development Commands

### Local Development
```bash
bundle install          # Install Ruby dependencies
bundle exec jekyll serve # Start local development server at http://localhost:4000
```

### Building
```bash
bundle exec jekyll build # Build site to _site/ directory
```

### Search Index
The site uses Pagefind for search functionality:
```bash
npm install pagefind     # Install search indexer
npx pagefind --site _site # Build search index after Jekyll build
```

## Content Structure

- **Posts**: Markdown files in `_posts/YYYY/` with front matter
- **Pages**: Static pages in `_pages/` 
- **Data**: Structured content in `_data/` YAML files for books, devices, movies, TV shows
- **Drafts**: Future content in `_drafts/` organized by year ranges

## Deployment

The site deploys automatically via GitHub Actions:
- Triggered on push to main branch and daily schedule
- Builds with Ruby 3.3.5 and Node.js 18
- Generates Pagefind search index
- Deploys to GitHub Pages

## Configuration

Key Jekyll settings in `_config.yml`:
- Pretty permalinks: `/:title/` for posts, `/:name/` for pages
- Markdown: kramdown with rouge syntax highlighting
- Plugins: feed, sitemap, pagination, optional front matter, titles from headings
- SASS compilation with compression