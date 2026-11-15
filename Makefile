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

.PHONY: albums build cv-pdf pagefind serve dev clean test test-site test-urls lint format

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

## cv-pdf  — re-print /cv/ to static/pdf/brajeshwar-oinam.pdf (A4), then COMMIT it.
##           A static file, not a build step: run this whenever _pages/cv.md changes.
##           Uses the installed Google Chrome; set CHROME=/path/to/chrome to pick another.
cv-pdf:
	bundle exec jekyll build
	bash scripts/cv-pdf.sh

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

## test    — build a production-parity copy into _test/site, then run every check
##           against it (_docs/testing.md). Its OWN directory, not _site: a running
##           `jekyll serve --future` writes 2099 drafts into _site, and the tests
##           must see what deploys, not the preview. No album fetch — tests stay
##           offline, and nothing asserts on the Albums strip.
TEST_SITE := _test/site
test: test-site
	SITE=$(TEST_SITE) npx playwright test -c _test/playwright.config.mjs

## test-site — just the build half of `test`, the same steps CI runs, in CI's order
test-site:
	JEKYLL_ENV=production bundle exec jekyll build -q -d $(TEST_SITE)
	node scripts/build-agent-markdown.mjs $(TEST_SITE)
	npx --yes esbuild $(TEST_SITE)/assets/scripts/*.js --minify --outdir=$(TEST_SITE)/assets/scripts --allow-overwrite --log-level=warning
	node scripts/hash-assets.mjs $(TEST_SITE)
	npx pagefind --site $(TEST_SITE) --quiet

## test-urls — ADD every URL in the current test build to _test/urls.txt, the list
##           the URL-preservation test holds the site to. Run after publishing,
##           then commit the file. It only ever adds; removing a line is a decision.
test-urls: test-site
	node _test/update-urls.mjs $(TEST_SITE)

## lint    — ESLint + Stylelint + a Prettier check over the CODE: _sass, assets/scripts,
##           scripts, _test. Never content, never the Liquid layouts. CI runs this too.
lint:
	npm run lint

## format  — rewrite the same files in the house style (.prettierrc.mjs), then `make lint`
format:
	npm run format

## clean   — remove _site/ and Jekyll caches
clean:
	bundle exec jekyll clean
