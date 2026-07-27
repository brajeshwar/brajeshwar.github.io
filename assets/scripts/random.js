/* Random post — the whole of /random/, in eleven lines of work.
 *
 * The page ships the list of every post URL inline, in
 * <script type="text/plain" id="random-index">, pipe-separated. This picks one
 * and goes there. Nothing is fetched: the reader already loaded the page that
 * carries the index. See the comment in _pages/random.html for why the index
 * lives in the HTML rather than in a file under /assets/ (short version: that
 * path is cached for a year, so the index would freeze and new posts would
 * silently never appear).
 *
 * `location.replace`, NOT `location.href`. Replace overwrites /random/ in the
 * session history instead of adding to it, so Back from the post you land on
 * returns to wherever you clicked Random — not to this page, which would
 * immediately bounce you forward again and make Back appear broken.
 *
 * Loaded only on the page that has the index, via the conditional in
 * _layouts/default.html.
 *
 * With JavaScript off, none of this runs and the page's build-time pick is
 * already on screen as a real link. See guardrail 4.
 */
(function () {
  'use strict';

  var el = document.getElementById('random-index');
  if (!el) return;

  var urls = el.textContent.split('|');
  if (!urls.length) return;

  /* Never send someone back to the post they just came from. The odds are
     1 in ~1,456, but the one time it happens it reads as a broken button
     rather than as a coincidence — and it is three lines to rule out.

     Compared on pathname so the origin, query and hash cannot affect the
     match. Wrapped because referrer can be an opaque or malformed value
     depending on how the reader arrived, and `new URL` throws on those. */
  var from = '';
  try {
    from = new URL(document.referrer).pathname;
  } catch (e) { /* no usable referrer — nothing to exclude */ }

  if (from) {
    var others = urls.filter(function (u) { return u !== from; });
    /* Only take the filtered list if it left us something. A single-post site
       would otherwise filter down to nothing and navigate to undefined. */
    if (others.length) urls = others;
  }

  location.replace(urls[Math.floor(Math.random() * urls.length)]);
})();
