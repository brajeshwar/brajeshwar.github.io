#!/usr/bin/env bash
# cv-pdf.sh — print the built /cv/ to _site/cv/brajeshwar-oinam.pdf
#
# Run AFTER the site is built (and, in CI, after hash-assets.mjs), from the
# repo root:  bash scripts/cv-pdf.sh
#
# The PDF is /cv/ exactly as a reader's browser prints it: the same page, the
# same assets/print.css, and the same `.page-cv` print rules in _sass/cv.scss.
# There is no second CV to maintain; edit _pages/cv.md and the next build
# re-prints it. Added 2026-10-31.
#
# ⚠️ IT PRINTS OVER HTTP, NOT file://. Every stylesheet, script, and font is
# linked root-relative (/assets/...), and under file:// those resolve to the
# root of the disk. So _site is served on loopback for the length of one print.
# The page is printed at /cv/, which assumes an empty baseurl — true while the
# site is on its own domain (CNAME), so configure-pages hands back no base path.
#
# ⚠️ --virtual-time-budget IS LOAD-BEARING. Chrome fetches a `media="print"`
# stylesheet late and at low priority, and headless --print-to-pdf does not
# wait for it: without the budget, print.css was never even REQUESTED (the
# server log shows it), and the result was five pages wearing the site's
# header, footer, and gray ground. With it: four clean pages. Measured
# 2026-10-31 on Chrome 156.
#
# ⚠️ THE PAGE COUNT IS LOGGED, NOT ENFORCED. The CV is meant to print on four
# pages (see cv.scss), but it is his to edit; a check that failed on five would
# block every deploy the day a role is added. A missing or broken file is what
# fails the build — and so does a page that is plainly not the CV. If the
# server never answers, or /cv/ 404s, Chrome still writes a valid one-page PDF
# of its error page, so "is it a PDF" alone would ship that. Hence the 200
# check before printing and a floor of two pages after: an error page is
# always one, the CV never fewer than three.

set -euo pipefail

SITE="_site"
OUT="$SITE/cv/brajeshwar-oinam.pdf"
PORT="${CV_PDF_PORT:-4311}"
URL="http://127.0.0.1:$PORT/cv/"

if [ ! -f "$SITE/cv/index.html" ]; then
  echo "cv-pdf: $SITE/cv/index.html not found; build the site first" >&2
  exit 1
fi

# Chrome: $CHROME if set, else whatever is on PATH, else the macOS app.
# GitHub's ubuntu-latest image ships Google Chrome preinstalled, so CI
# downloads nothing.
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in google-chrome google-chrome-stable chromium chromium-browser \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
  done
fi
if [ -z "$CHROME" ]; then
  echo "cv-pdf: no Chrome or Chromium found; set CHROME=/path/to/chrome" >&2
  exit 1
fi
"$CHROME" --version

# ⚠️ --no-sandbox ON LINUX ONLY. Ubuntu 24.04 (ubuntu-latest) restricts
# unprivileged user namespaces through AppArmor, and Chrome's sandbox needs
# them; on a runner it dies with "No usable sandbox". What it renders here is
# our own static HTML from loopback, so the sandbox protects nothing.
SANDBOX=""
[ "$(uname -s)" = "Linux" ] && SANDBOX="--no-sandbox"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$SITE" >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT

for _ in $(seq 1 50); do
  curl -fs -o /dev/null "$URL" && break
  sleep 0.2
done
curl -fs -o /dev/null "$URL" || { echo "cv-pdf: $URL never answered 200" >&2; exit 1; }

rm -f "$OUT"
# --no-pdf-header-footer: a file to send is not a print-out, so no date, URL,
# or page numbers in the margin. The 20mm @page margin paginates the same
# with or without them (cv.scss), so this changes the chrome, not the pages.
# $SANDBOX is unquoted on purpose: empty, it must vanish, not pass "".
# (Not an array — macOS bash 3.2 calls an empty one unbound under set -u.)
"$CHROME" --headless $SANDBOX --disable-gpu \
  --no-pdf-header-footer --virtual-time-budget=10000 \
  --print-to-pdf="$PWD/$OUT" "$URL"

if [ ! -s "$OUT" ] || [ "$(head -c 5 "$OUT")" != "%PDF-" ]; then
  echo "cv-pdf: $OUT is missing or not a PDF" >&2
  exit 1
fi

# Each page is one `/Type /Page` object; `/Type /Pages` is the tree above them.
PAGES=$(python3 -c 'import re,sys; print(len(re.findall(rb"/Type\s*/Page(?!s)", open(sys.argv[1],"rb").read())))' "$OUT")
if [ "$PAGES" -lt 2 ]; then
  echo "cv-pdf: $OUT has $PAGES page(s); that is an error page, not the CV" >&2
  exit 1
fi

# Gutenberg sets the print font to "Helvetica Neue", Helvetica, Arial — a Mac
# stack. Linux has none of the three, so fontconfig substitutes (Liberation
# Sans, metric-compatible with Arial). Logged so a fifth page can be traced
# to the font rather than guessed at.
echo "cv-pdf: wrote $OUT — $PAGES pages, $(wc -c < "$OUT" | tr -d ' ') bytes"
echo "cv-pdf: fonts: $(grep -a -o '/BaseFont */[A-Za-z0-9+_-]*' "$OUT" | sed 's/.*+//' | sort -u | tr '\n' ' ')"
