# brajeshwar.com — local dev loop. See _docs/SEARCH.md.
#
# Jekyll builds the site; Pagefind builds the SEARCH INDEX as a post-build step
# (exactly like CI: bundle exec jekyll build → npx pagefind --site _site).
#
# IMPORTANT: `jekyll serve` on its own does NOT build the search index — and its
# --watch even wipes _site/pagefind/ on every rebuild. So ⌘K search only works
# locally when you serve a freshly indexed _site. Use `make serve` for that.

.PHONY: build pagefind serve dev clean

## build   — full production-parity build into _site/ (site + search index)
build:
	bundle exec jekyll build
	npx pagefind --site _site

## pagefind — (re)build just the search index against the current _site/
pagefind:
	npx pagefind --site _site

## serve   — preview with WORKING ⌘K search: build + index, then serve static _site.
##           No live-reload (watch would wipe the index); re-run after edits.
serve: build
	bundle exec jekyll serve --skip-initial-build --no-watch

## dev     — fast iteration with live-reload, but NO search index (the palette
##           shows its "open the search page" fallback). For content/layout work.
dev:
	bundle exec jekyll serve

## clean   — remove _site/ and Jekyll caches
clean:
	bundle exec jekyll clean
