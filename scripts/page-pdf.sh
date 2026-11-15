#!/usr/bin/env bash
# page-pdf.sh — print one built page to a static PDF.
#
#   bash scripts/page-pdf.sh <path> <out.pdf> [min-pages]
#
# Two pages use it: `make cv-pdf` prints /cv/ to static/pdf/brajeshwar-oinam.pdf,
# and `make own-pdf` prints /own/ to static/pdf/own.pdf. Both build the site
# first; then COMMIT the PDF. It is a static file: the deploy only copies it.
# Each page's A4 comes from its own named @page (cv.scss, own.scss). This was
# cv-pdf.sh, for the CV alone, until 2026-11-15.
#
# [WARNING] STATIC, NOT GENERATED IN CI — his call, 2026-10-31: "Let's create a proper
# PDF and keep it static so I can just link to it." An Actions step printing it
# on every build existed for a few hours that day and never shipped. So the PDF
# is only as fresh as the last `make cv-pdf`: edit _pages/cv.md, re-run this,
# commit both together.
#
# The PDF is /cv/ exactly as a reader's browser prints it: the same page, the
# same assets/print.css, and the same `.page-cv` print rules in _sass/cv.scss,
# which also set the paper to A4 (a named page, so only /cv/ is A4). There is
# no second CV to maintain.
#
# [WARNING] IT PRINTS OVER HTTP, NOT file://. Every stylesheet, script, and font is
# linked root-relative (/assets/...), and under file:// those resolve to the
# root of the disk. So _site is served on loopback for the length of one print.
#
# [WARNING] AND UNDER THE REAL HOSTNAME. Chrome resolves the page's relative links
# (/about/, the PDF link itself) against the URL it printed, and writes them
# into the PDF as absolute URLs — printed from 127.0.0.1, the file shipped
# links to http://127.0.0.1:4311/about/. --host-resolver-rules points
# brajeshwar.com at the loopback server, so the links read
# http://brajeshwar.com/about/, which the live site 301s to https.
#
# [WARNING] --virtual-time-budget IS LOAD-BEARING. Chrome fetches a `media="print"`
# stylesheet late and at low priority, and headless --print-to-pdf does not
# wait for it: without the budget, print.css was never even REQUESTED (the
# server log shows it), and the result was five pages wearing the site's
# header, footer, and gray ground. With it: four clean pages. Measured
# 2026-10-31 on Chrome 156.
#
# [WARNING] The page count is logged, not enforced. What fails is a print that is
# plainly not the page: if the server never answers, or the path 404s, Chrome
# still writes a valid one-page PDF of its error page. Hence the 200 check
# before printing, and the optional floor after it: the CV passes 2, since an
# error page is always one and the CV never fewer than three. /own/ is meant
# to be one sheet, so it relies on the 200 check alone.

set -euo pipefail

PAGE="${1:?usage: page-pdf.sh <path> <out.pdf> [min-pages]}"
OUT="${2:?usage: page-pdf.sh <path> <out.pdf> [min-pages]}"
MIN_PAGES="${3:-1}"
SITE="${SITE:-_site}"
PORT="${PDF_PORT:-4311}"
HOST="brajeshwar.com"
URL="http://$HOST$PAGE"

if [ ! -f "$SITE${PAGE}index.html" ]; then
  echo "page-pdf: $SITE${PAGE}index.html not found; build the site first" >&2
  exit 1
fi

# Chrome: $CHROME if set, else whatever is on PATH, else the macOS app.
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in google-chrome google-chrome-stable chromium chromium-browser \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
  done
fi
if [ -z "$CHROME" ]; then
  echo "page-pdf: no Chrome or Chromium found; set CHROME=/path/to/chrome" >&2
  exit 1
fi
"$CHROME" --version

# --no-sandbox on Linux only: Ubuntu 23.10+ restricts the unprivileged user
# namespaces Chrome's sandbox needs, and it dies with "No usable sandbox".
# What it renders here is our own static HTML from loopback.
SANDBOX=""
[ "$(uname -s)" = "Linux" ] && SANDBOX="--no-sandbox"

# Node, not python3 -m http.server (2026-11-15): Python queues five
# connections, and a page with a dozen images reset the rest, so logos and
# even print.css went missing from the PDF at random.
node _test/serve.mjs "$SITE" "$PORT" >/dev/null 2>&1 &
SERVER=$!
disown "$SERVER"   # no "Terminated" job notice when the trap kills it
trap 'kill "$SERVER" 2>/dev/null || true' EXIT

LOCAL="http://127.0.0.1:$PORT$PAGE"
for _ in $(seq 1 50); do
  curl -fs -o /dev/null "$LOCAL" && break
  sleep 0.2
done
curl -fs -o /dev/null "$LOCAL" || { echo "page-pdf: $LOCAL never answered 200" >&2; exit 1; }

# Print to a temporary file and move it into place only once it checks out,
# so a failed run never leaves the committed PDF half-written or deleted.
TMP="$(mktemp -t page-pdf.XXXXXX)"
trap 'kill "$SERVER" 2>/dev/null || true; rm -f "$TMP"' EXIT

# --disable-features=HttpsUpgrades…: Chrome 157 upgrades an http:// address
# to https:// before loading it, and the loopback server speaks only http, so
# every print failed with ERR_BLOCKED_BY_CLIENT (found 2026-11-15; Chrome 156
# printed the CV without it).
# --no-pdf-header-footer: a file to send is not a print-out, so no date, URL,
# or page numbers in the margin. The 20mm @page margin paginates the same
# with or without them (cv.scss), so this changes the chrome, not the pages.
# $SANDBOX is unquoted on purpose: empty, it must vanish, not pass "".
# (Not an array — macOS bash 3.2 calls an empty one unbound under set -u.)
"$CHROME" --headless $SANDBOX --disable-gpu \
  --no-pdf-header-footer --virtual-time-budget=10000 \
  --disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable \
  --host-resolver-rules="MAP $HOST 127.0.0.1:$PORT" \
  --print-to-pdf="$TMP" "$URL"

if [ ! -s "$TMP" ] || [ "$(head -c 5 "$TMP")" != "%PDF-" ]; then
  echo "page-pdf: Chrome wrote no PDF" >&2
  exit 1
fi

# Each page is one `/Type /Page` object; `/Type /Pages` is the tree above them.
PAGES=$(python3 -c 'import re,sys; print(len(re.findall(rb"/Type\s*/Page(?!s)", open(sys.argv[1],"rb").read())))' "$TMP")
if [ "$PAGES" -lt "$MIN_PAGES" ]; then
  echo "page-pdf: the print has $PAGES page(s), fewer than $MIN_PAGES; not the page it should be" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
mv "$TMP" "$OUT"
chmod 644 "$OUT"   # mktemp makes it 0600
echo "page-pdf: wrote $OUT — $PAGES pages, $(wc -c < "$OUT" | tr -d ' ') bytes"
