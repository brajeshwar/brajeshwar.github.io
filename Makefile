# brajeshwar.com — local dev loop. See _docs/search.md + _docs/agents.md.
#
# One PRE-build step, then Jekyll, then three post-build steps (exactly like CI):
#   0. ruby scripts/fetch-albums.rb           → _data/albums.yaml, the Albums strip
#   1. node scripts/build-agent-markdown.mjs  → .md twins + /llms.txt for AI agents
#   2. esbuild --minify (in place)            → JS at ~40% of its source size
#   3. npx pagefind --site _site              → the ⌘K SEARCH INDEX
#
# IMPORTANT: `jekyll serve` on its own does NOT build the search index — and its
# --watch even wipes _site/pagefind/ on every rebuild. So ⌘K search only works
# locally when you serve a freshly indexed _site. Use `make serve` for that.

.PHONY: albums build pagefind serve dev clean

## albums  — fetch albums.oinam.com's feed into _data/albums.yaml (generated, gitignored).
##           The home page's Albums strip is EMPTY without it, so `build` runs it
##           first — exactly as the Actions workflow does.
##           ⚠️ `ruby`, not `bundle exec ruby`: the script is stdlib-only, but rexml is a
##           bundled gem and bundler hides those unless the Gemfile names them.
albums:
	ruby scripts/fetch-albums.rb

## build   — full production-parity build into _site/ (site + agent .md + search index)
build: albums
	bundle exec jekyll build
	node scripts/build-agent-markdown.mjs
	npx --yes esbuild _site/assets/scripts/*.js --minify --outdir=_site/assets/scripts --allow-overwrite
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
