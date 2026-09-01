#!/usr/bin/env ruby
# frozen_string_literal: true

# ---------------------------------------------------------------------------
# fetch-albums.rb — build /album/ from albums.oinam.com instead of by hand.
#
# Reads https://albums.oinam.com/feed.xml (RSS 2.0, the 50 most recent items)
# and writes _data/albums.yaml, which /album/ and the home page's Album strip
# both read. Runs in the Actions workflow BEFORE `jekyll build`, and from
# `make albums` locally.
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
# picture is served from albums.oinam.com now, and this file is generated.
#
# Consequences of that, so nobody reads them as bugs:
#
#   ORDER FLIPPED. The feed is newest-first and this writes it in feed order,
#   so /album/ now reads newest → oldest. The old page read forwards through
#   time, which a rolling 50-item window cannot do anyway — the oldest entry
#   moves every time a photo is added. index.html dropped its `reverse` to
#   match.
#
#   EVERY CARD IS 4:3. The thumbnails are `fit=cover` 640x480 (or 480x640 for
#   a portrait crop), so the masonry's "each photo keeps its native shape"
#   premise is over — that was a property of the hand-cut .webp files. Using
#   the URLs exactly as given is deliberate; see the billing note below.
#
#   NOT COMMITTED. _data/albums.yaml is gitignored and generated. A checkout
#   with no build step has no album data and both surfaces render nothing,
#   which is what `make albums` and the workflow step are for. ⚠️ The
#   Cloudflare Pages backup's build command is set dashboard-side and does not
#   run this, so its /album/ is empty until that command is updated.
#
# ---------------------------------------------------------------------------
# THE FIELDS, AND WHY EACH IS WHAT IT IS
# ---------------------------------------------------------------------------
# title  <title>. The caption if a caller ever passes `captions`, and the
#        bookplate text if an item ever arrives with no picture. NOT the alt
#        any more — see below.
# url    <link>, the permalink on albums.oinam.com. Absolute, so both includes
#        emit it verbatim with rel="noopener".
# img    <media:thumbnail url>, absolute. ⚠️ USED EXACTLY AS GIVEN. Do not
#        compose a new /cdn-cgi/image/ width to fit some layout: every
#        DISTINCT transformation width is separately billed per month at
#        Cloudflare, and 640x480 / 480x640 are already paid for. A "nicer" fit
#        costs money every month for as long as it is deployed.
# alt    The alt attribute albums.oinam.com itself put on the <img> inside
#        <content:encoded> — its own decision, not one made here.
#
#        ⚠️ AND IT IS OFTEN DELIBERATELY EMPTY. An item with no caption is
#        titled after its file ("London — IMG_9018.jpeg") and its <description>
#        falls back to the album name ("London") — 48 of the 50 items in the
#        feed as measured. albums.oinam.com ships alt="" for exactly those,
#        rather than have a screen reader announce a filename, and copying
#        that verbatim is the point. Neither the title nor the description is
#        a safe fallback: the title IS the filename, and the description is
#        the album name repeated on every photo in it.
#
#        So when the regex below finds nothing, the answer is "" — never a
#        guess. An empty alt on a decorative thumbnail is correct HTML; a
#        filename read aloud is not.
#
#        ⚠️ AN EMPTY alt ONLY SURVIVES BECAUSE THE INCLUDES WERE FIXED. Both
#        card-grid.html and home-strip.html used `item.alt | default:
#        item.title`, and Liquid's `default` filter treats "" as empty and
#        substitutes — so every one of these would have become its filename.
#        They now test `{% if item.alt %}`, which is Ruby truthiness and so
#        true for "". Change either back and this file's whole alt policy is
#        silently undone.
#
# NO `w`/`h`, deliberately, which has now been decided three times. They would
# do nothing: page.scss declares `aspect-ratio: auto` on masonry images, which
# cancels the UA rule that derives a ratio from the attributes. Both halves or
# neither — the full measurement is in _includes/card-grid.html.
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

# The alt albums.oinam.com wrote, pulled out of the CDATA'd HTML fragment.
#
# ⚠️ A REGEX AND NOT AN XML PARSE, DELIBERATELY. <content:encoded> holds an
# HTML fragment whose <img> is not self-closed, so it is not well-formed XML
# and REXML raises on it. The fragment is machine-generated and its shape is
# stable; a regex that misses simply yields "", which is the safe answer here
# rather than a degraded one.
def alt_from(item)
  encoded = item.get_elements("content:encoded").first
  return "" unless encoded

  text = encoded.texts.map(&:value).join
  text[/<img\b[^>]*\balt="([^"]*)"/, 1].to_s
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
    "img"   => src,
    "alt"   => alt_from(item).gsub(/\s+/, " ").strip
  }
end

header = <<~YAML
  # ⚠️ GENERATED — DO NOT EDIT. Overwritten by scripts/fetch-albums.rb on every
  # build, from #{FEED_URL}. Gitignored, so an edit here is
  # lost the next time anyone runs `make albums` and never reaches the deploy.
  #
  # To change what /album/ shows, change albums.oinam.com. The reasoning behind
  # every field — and why `alt` is so often deliberately empty — is in the
  # script, not here, because this file is disposable and the script is not.
  #
  # Fetched from the #{albums.length} most recent items, newest first.
YAML

File.write(OUTPUT, header + albums.to_yaml)
puts "fetch-albums: wrote #{albums.length} items to #{OUTPUT.sub(Dir.pwd + "/", "")}"
