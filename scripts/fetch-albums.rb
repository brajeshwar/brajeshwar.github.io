#!/usr/bin/env ruby
# frozen_string_literal: true

# ---------------------------------------------------------------------------
# fetch-albums.rb — build /album/ from albums.oinam.com instead of by hand.
#
# Reads https://albums.oinam.com/feed.xml (RSS 2.0, the 50 most recent items)
# and writes _data/albums.yaml, which the home page's Albums strip reads. Runs
# in the Actions workflow BEFORE `jekyll build`, and from `make albums` locally.
#
# ⚠️ IT FEEDS ONE SURFACE, NOT TWO. /album/ was deleted on 2026-09-01 — hours
# after this script replaced its data file — and is a redirect stub to
# albums.oinam.com now (_redirect/album.md). The strip on the home page is all
# that is left here, and its heading is the link out. This script survived that
# deletion because the strip still needs the feed; if the strip ever goes too,
# so do this file, _data/albums.yaml, the workflow step and the Makefile target.
#
# ⚠️ RUN IT AS `ruby`, NEVER `bundle exec ruby`. Everything here is stdlib —
# net/http, uri, rexml, yaml — which is the whole reason this is Ruby and not
# a new Node dependency. But rexml is a BUNDLED GEM in Ruby 3.3, and bundler
# hides bundled gems that the Gemfile does not name: under `bundle exec` this
# dies on `require "rexml/document"`. Bare `ruby` loads it fine. Adding rexml
# to the Gemfile would work too and is exactly the dependency this avoids.
#
# ---------------------------------------------------------------------------
# WHAT REPLACED WHAT
# ---------------------------------------------------------------------------
# _data/album.yaml was a hand-maintained list of eight curated photographs cut
# to /static/album/*.webp, sorted by filename, oldest first. It is gone: every
# picture is served from albums.oinam.com now, and this file is generated. The
# eight .webp files themselves were kept — seven are referenced by nothing, and
# /about/ still uses the eighth.
#
# Consequences of that, so nobody reads them as bugs:
#
#   ORDER IS THE FEED'S. Newest first, written in feed order, and index.html
#   takes a plain slice off the head — no `reverse`, which the old newest-LAST
#   file needed. A rolling 50-item window has no stable other end: its oldest
#   entry moves every time a photo is added upstream.
#
#   EVERY THUMBNAIL IS 4:3. They are `fit=cover` 640x480 (or 480x640 for a
#   portrait crop) rather than the hand-cut .webp files' native shapes. The
#   strip crops to its own ratio anyway, so this only ever mattered to the
#   masonry on /album/, which is gone. Using the URLs exactly as given is
#   deliberate; see the billing note below.
#
#   NOT COMMITTED. _data/albums.yaml is gitignored and generated. A checkout
#   with no build step has no album data and the strip renders NOTHING — an
#   absent home-page section, not an error — which is what `make albums` and
#   the workflow step are for. ⚠️ The Cloudflare Pages backup's build command
#   is set dashboard-side and does not run this, so the strip is missing there
#   until that command is updated.
#
# ---------------------------------------------------------------------------
# THE FIELDS, AND WHY EACH IS WHAT IT IS
# ---------------------------------------------------------------------------
# title  <title>. The caption if a caller ever passes `captions` (the strip
#        does not), and the bookplate text if an item ever arrives with no
#        picture. NOT the alt any more — see below.
# url    <link>, the permalink on albums.oinam.com. Absolute, so the includes
#        emit it verbatim, marked with the ↗ and no forced target.
# img    <media:thumbnail url>, absolute. ⚠️ USED EXACTLY AS GIVEN. Do not
#        compose a new /cdn-cgi/image/ width to fit some layout: every
#        DISTINCT transformation width is separately billed per month at
#        Cloudflare, and 640x480 / 480x640 are already paid for. A "nicer" fit
#        costs money every month for as long as it is deployed.
# NO `alt`, AND THAT IS THE POINT (2026-09-01: "remove alt from albums
#        images"). The thumbnails ship a bare `alt=""` — the HTML for "this
#        picture is decorative, skip it" — and nothing here has to compute it.
#
#        ⚠️ THE FIELD USED TO EXIST AND WAS SCRAPED OUT OF <content:encoded>'s
#        <img alt="…">, because albums.oinam.com leaves an uncaptioned photo's
#        alt empty rather than have a screen reader announce a filename. That
#        was 48 of 50 items empty, a regex over a CDATA'd HTML fragment, and a
#        Liquid trap in two includes — all of it to arrive at "" almost every
#        time. Deleting it lands in the same place with none of the machinery.
#
#        ⚠️ AND THE EMPTY alt STILL MATTERS, so do not go one step further and
#        drop the ATTRIBUTE. An <img> with no alt at all is invalid HTML and
#        sends assistive tech to the filename — "IMG_9018.jpeg" — which is the
#        exact outcome the old scraping existed to prevent. `alt=""` is the
#        answer; having no data to put in it is what changed.
#
#        home-strip.html emits it from `decorative = true`, not from this file.
#
# NO `w`/`h`, deliberately, decided three times and now moot: the masonry that
# the argument was about lived on /album/, which is deleted. The strip crops
# every frame to its own ratio with `object-fit: cover`, so per-item dimensions
# would change nothing there. The full measurement is in _includes/card-grid.html
# if the question ever comes back with a new masonry page.
#
# ---------------------------------------------------------------------------
# FAILURE IS LOUD, ON PURPOSE
# ---------------------------------------------------------------------------
# Any problem — a bad status, a redirect loop, unparseable XML, zero items, or
# a single item missing a link or a thumbnail — aborts with a non-zero exit
# and takes the build down with it. His call: "If the fetch fails, fail the
# build loudly rather than shipping an empty grid — the daily cron will
# retry." A half-fetched grid is worse than a red build, because nobody sees
# it. The 00:01 cron means the worst case is a day of the previous deploy,
# which is the last GOOD one.
# ---------------------------------------------------------------------------

require "net/http"
require "uri"
require "rexml/document"
require "yaml"

FEED_URL = "https://albums.oinam.com/feed.xml"
OUTPUT   = File.expand_path("../_data/albums.yaml", __dir__)

def die(message)
  warn "fetch-albums: #{message}"
  exit 1
end

# One redirect hop is followed by hand rather than with a gem. Net::HTTP does
# not follow them at all, and albums.oinam.com is behind a CDN that could grow
# an http->https or a trailing-slash redirect without anyone here noticing.
def fetch(url, hops = 3)
  die "too many redirects fetching #{FEED_URL}" if hops.zero?

  uri = URI.parse(url)
  response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https",
                             open_timeout: 15, read_timeout: 30) do |http|
    http.get(uri.request_uri, "User-Agent" => "brajeshwar.com build (fetch-albums.rb)")
  end

  case response
  when Net::HTTPSuccess    then response.body
  when Net::HTTPRedirection then fetch(URI.join(url, response["location"]).to_s, hops - 1)
  else die "#{url} returned #{response.code} #{response.message}"
  end
# ⚠️ IOError IS IN THIS LIST FOR A REASON. A connection that times out at the
# SOCKET raises IO::TimeoutError (an IOError), not Net::OpenTimeout — observed
# 2026-09-01. Without it the script still exits non-zero, so the build still
# fails, but it fails with a twenty-line Ruby backtrace instead of one line
# saying which host did not answer. The point of failing loudly is being
# readable in the Actions log.
rescue SocketError, SystemCallError, IOError, Net::OpenTimeout, Net::ReadTimeout,
       OpenSSL::SSL::SSLError => e
  die "could not reach #{url}: #{e.class}: #{e.message}"
end

def text_of(item, name)
  element = item.get_elements(name).first
  element ? element.texts.map(&:value).join.strip : nil
end

body = fetch(FEED_URL)

begin
  document = REXML::Document.new(body)
rescue REXML::ParseException => e
  die "#{FEED_URL} is not parseable XML: #{e.message}"
end

items = document.get_elements("/rss/channel/item")
die "#{FEED_URL} parsed but contained no <item> elements" if items.empty?

albums = items.each_with_index.map do |item, index|
  title = text_of(item, "title")
  link  = text_of(item, "link")

  # The prefixed lookup first, then a prefix-agnostic one. RSS namespace
  # prefixes are conventional, not fixed — a generator is free to bind the
  # Yahoo media namespace to any prefix it likes — and this element is the one
  # thing here with no fallback: no thumbnail, no card.
  thumbnail = item.get_elements("media:thumbnail").first
  thumbnail ||= REXML::XPath.first(item, "*[local-name()='thumbnail']")
  src = thumbnail && thumbnail.attributes["url"]

  die "item #{index + 1} (#{title.inspect}) has no <link>" if link.nil? || link.empty?
  die "item #{index + 1} (#{title.inspect}) has no <media:thumbnail url>" if src.nil? || src.empty?

  {
    # A caption can carry a newline (one does); an attribute full of them is
    # legal and unreadable. Collapse to single spaces on the way in.
    "title" => title.to_s.gsub(/\s+/, " ").strip,
    "url"   => link,
    "img"   => src
  }
end

header = <<~YAML
  # ⚠️ GENERATED — DO NOT EDIT. Overwritten by scripts/fetch-albums.rb on every
  # build, from #{FEED_URL}. Gitignored, so an edit here is
  # lost the next time anyone runs `make albums` and never reaches the deploy.
  #
  # To change what /album/ shows, change albums.oinam.com. The reasoning behind
  # every field — and behind the ones that are deliberately absent — is in the
  # script, not here, because this file is disposable and the script is not.
  #
  # Fetched from the #{albums.length} most recent items, newest first.
YAML

File.write(OUTPUT, header + albums.to_yaml)
puts "fetch-albums: wrote #{albums.length} items to #{OUTPUT.sub(Dir.pwd + "/", "")}"
