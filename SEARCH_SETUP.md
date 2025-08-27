# Search Provider Setup

This site supports multiple search providers. Here's how to switch between them:

## Current Setup
- **Active**: Google Custom Search (via `search-google.html`)
- **Available**: Algolia (configured but not active)
- **New**: Pagefind (ready to test)

## Search Providers

### 1. Google Custom Search (Current)
- File: `_includes/search-google.html`
- Page: `search.html` includes `search-google.html`
- No build step required

### 2. Algolia (Configured)
- File: `_includes/search-algolia.html` and `_includes/search-modal.html`
- Requires API keys in `_config.yml`
- Uses workflow: `.github/workflows/algolia-index-push.yml`

### 3. Pagefind (New)
- File: `_includes/search-pagefind.html`
- Test page: `search-pagefind.html`
- Uses workflow: `.github/workflows/jekyll-pagefind-deploy.yml`

## Switching to Pagefind

### Step 1: Test Pagefind
1. Rename current workflow: `jekyll-build-deploy.yml` → `jekyll-build-deploy.yml.backup`
2. Rename Pagefind workflow: `jekyll-pagefind-deploy.yml` → `jekyll-build-deploy.yml`
3. Push changes and let GitHub Actions build
4. Visit `/search-pagefind/` to test

### Step 2: Make Pagefind Primary (if satisfied)
Edit `search.html`:
```html
---
layout: page
title: Search
styles: css/4.1-search.css
style: page-search
---

{% include search-pagefind.html %}
```

### Step 3: Revert if Needed
1. Restore original workflow files
2. Change `search.html` back to `{% include search-google.html %}`

## Pagefind Features
- ✅ Highlights search terms
- ✅ Clean, minimal interface
- ✅ No API limits or costs
- ✅ Works offline after initial load
- ✅ Automatically indexes all content

## Notes
- Pagefind runs after Jekyll builds the site
- Search index is generated automatically from your content
- No configuration needed beyond the workflow setup