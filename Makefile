# brajeshwar.com — local dev loop. See _docs/search.md + _docs/agents.md.
#
# Jekyll builds the site; two post-build steps then run (exactly like CI):
#   1. node scripts/build-agent-markdown.mjs  → .md twins + /llms.txt for AI agents
#   2. npx pagefind --site _site              → the ⌘K SEARCH INDEX
#
# IMPORTANT: `jekyll serve` on its own does NOT build the search index — and its
# --watch even wipes _site/pagefind/ on every rebuild. So ⌘K search only works
# locally when you serve a freshly indexed _site. Use `make serve` for that.

.PHONY: build pagefind serve dev clean

## build   — full production-parity build into _site/ (site + agent .md + search index)
build:
	bundle exec jekyll build
	node scripts/build-agent-markdown.mjs
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
