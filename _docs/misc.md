# /misc/ — one-off pages

A home for pieces that go with an article but stand on their own: an interactive
map, a small tool, a visual essay. Chosen 2026-11-15 over `/etc/` (a Unix joke
that tells a reader nothing) and `/lab/` (kept for later, if experiments ever
need a section of their own). The first is `/misc/london-southbank/`, the walk
that goes with `/2026/london-stroll-along-southbank/`.

The rules:

- **One folder each, everything inside it.** `misc/<name>/index.html` carries
  its own CSS, and its scripts, data, and pictures sit beside it in the folder.
  It does not load `site.css` or anything from `/assets/`, and nothing of it
  reaches another page. Deleting the folder removes it completely.
- **No front matter**, so Jekyll copies the files as they are: no layout, no
  Liquid, no hashing, no minifying. The build tests that check every site page
  (theme snippet, title, `<h1>`) pick pages by the site stylesheet, so they
  skip these by design.
- **Still the site's manners:** grayscale, system fonts, the saved Light or
  Dark from `localStorage.theme`, whole without JavaScript, and no emoji (the
  emoji test scans `misc/`). Plain JavaScript, no libraries. A script may be
  split into native modules (`<script type="module">`), which need no build
  step; `make lint` holds `misc/**/*.js` to the same ESLint and Prettier as
  the site's own.
- **Its URL is permanent once pushed**, like any other (guardrail 2), so it
  goes into `_test/urls.txt` by hand.
- **Generators stay out of the repo.** If a drawing or a data file was made by
  a script, the script was one-time; the output is what ships. Say here how it
  was made, so it can be made again.

## /misc/london-southbank/ — the model

A model of central London along the Thames, 4.1 km by 2 km, drawn in the
browser: about ten thousand buildings, the river and its eleven bridges, the
railway viaducts, the roads, and 6,700 trees. The hands are the Greenage map's
(`~/dev/greenage-map`), at his word: a drag turns and tips it, a right-drag or
Shift-drag moves it, the wheel zooms to the pointer, and a model let go of
mid-move carries on a little and eases to rest. On a touchscreen one finger
turns and two move and zoom. The walk is a loop of twenty-two
stops, out along the South Bank from Waterloo Station to Shad Thames, across
Tower Bridge, back along the north bank, and across Westminster Bridge. Next
and Previous fly the camera low along the path to the neighboring stop. "Fly
the walk" is one flight round the whole loop, about two minutes, that eases off
past each stop as its name comes up; Pause leaves the camera where it has got
to.

**Every control is in one toolbar, top right, inside the model:** compass,
home, zoom in, zoom out, then previous stop, fly the walk, and next stop. The
last three were words on a row under the model until 2026-11-15, where a short
window pushed them out of sight. They are pictures now, and every button names
itself in a tooltip on hover or focus, with its key if it has one. The tooltip
is the button's own `aria-label`, drawn by CSS, so what is shown and what a
screen reader says are one string.

[WARNING] The flights play even when the system asks for reduced motion. Every
flight starts at a button, a key, or a pin, so it is the thing that was asked
for. The first version obeyed the setting and jumped from stop to stop, which
is all he saw on his own Mac, where Reduce Motion is on, before asking for the
fly-by on 2026-11-15. The setting still stops what nobody asked for: the
carry-on after a drag, the list scrolling itself smoothly, and the fades.

**The camera does not follow the path. It flies a line of its own**
(2026-11-15, after *"The flight is cool but its janky"*). The walk as mapped
has 150 corners sharper than sixty degrees, and a camera made to follow it was
shoved sideways and swung its head at every one. `walk.js` blurs the walk into
a line (its place over 30 m, its direction over 60 m), slows through bends so
the head never turns faster than 40 degrees a second, and gives the camera
weight, so it brakes before a bend and not at it. Flown on paper at sixty
frames a second round the whole loop, the head's turning fell from 94 to 38
degrees a second at the 95th percentile and from 371 to 41 at the worst, and
the shove on the camera fell about tenfold. It cost no data and no library;
the price is that the camera cuts corners a walker cannot, by a few meters and
at the worst dogleg by thirty. The path drawn on the ground is still the true
one. Drawing was never the trouble: his Mac held 8 ms a frame before and after.

**Photo-real was asked for and declined, 2026-11-15.** The only photo-real 3D
of London is Google's Photorealistic 3D Tiles, which need an API key with
billing, load Google's script, and leave the page depending on Google for as
long as it is up. Tiny London, the reference, is a fixed picture redrawn from
renders of those tiles; it cannot turn. Offered both, he chose "Self-contained
model, open data". If the photo-real view is ever wanted as a switch on top,
the key comes from his Google account, with him.

| file | what it is |
|---|---|
| `index.html` | the page, its CSS, the list of stops, and a pin for each |
| `walk.js` | the camera, the flights between stops, the controls |
| `draw.js` | WebGL2 with no library: the shaders, the sun and its shadow map |
| `city.js` | reads `city.json` into one mesh |
| `city.json` | the model as whole numbers, 2.2 MB, and 655 KB as the live site serves it gzipped: the ground, the buildings, the walk, the stops, and the landmarks' names |
| `poster.webp`, `poster-dark.webp` | the picture that stands in for the model |

**Version 0.1.0, the grayscale model, is kept** (2026-11-15, before color was
tried): `london-southbank-v0.1.0-grayscale.html` beside `index.html`, with its
own scripts and pictures in `v0.1.0-grayscale/`, and the git tag
`v0.1.0-grayscale` on the commit that added it. It is marked `noindex` and its
back link goes to the live page.
[WARNING] The kept copy reads the live `city.json`. Whatever is added to that
file, the layers the kept `city.js` reads have to stay as they are, or the
copy breaks without anyone looking at it.

**Without JavaScript, or without WebGL2,** the page is the picture, the pins on
it (placed in percent, in the HTML), and the list they link to. The script adds
`is-live` to `.stage` once the model has drawn, or `is-still` if it cannot.

**The look is the page's own.** `walk.js` reads `--paper` and `--ink` from the
page's CSS and picks a day or a night set of tones by which is darker. By night
one window in three is lit. Each building's tone is the luminance of its mapped
color or material, so brick is darker than stone, and still gray.

### How city.json was made

Once, on 2026-11-15, from OpenStreetMap through the Overpass API, for the box
51.4972 to 51.5152 N, 0.1292 to 0.0698 W. The script is not kept. What it did:

- **Buildings** are `building` and `building:part` outlines, pulled up to
  their `height`, or to 3.2 m for each of `building:levels`. Where a building
  has parts, the parts are drawn and the outline only where they leave it
  uncovered. Roof shapes that are mapped are built: pyramids, domes, gables,
  hips, lean-tos, and barrel vaults. That is why Tower Bridge, St Paul's, the
  Houses of Parliament, and the London Eye look like themselves: someone
  mapped them piece by piece.
- [WARNING] About a quarter of the buildings have no mapped height. Each of
  those takes the median of the nine nearest that do, within 160 m. They are
  plausible, not measured.
- **The river** is the mapped water, cut out of the board 4.5 m down. Ships
  (HMS Belfast, the Golden Hinde) sit at the waterline. Bridge decks are the
  mapped `man_made=bridge` outlines at a height given by hand for each bridge;
  the piers under them are spaced evenly, not surveyed.
- **The walk** is the shortest path over the mapped footways through a list
  of points, with ways that belong to the Thames Path relations costing less
  than half, so it keeps to the river.
- Positions are in decimeters and heights in centimeters, each coordinate the
  difference from the one before. The layout of every layer is in the comment
  at the top of `city.js`.

**Landmarks are named as the camera comes near** (2026-11-15: *"Label the
landmarks nearby as one goes by or fly-by"*). `places` in `city.json` holds
sixty-three, each a name, a place, and the height of the roof at that place.
A name shows while its landmark is near where the camera looks: within 210 to
380 m by how far the view stands back, 300 m more through the flying lens, and
2.2 m more for every meter the landmark is tall. At most eight show, nearest
first, and never one that would cover a pin, the toolbar, the caption, or
another name. The whole-board view names nothing.

- The names are the page's, not always the map's: the map's "Sky Garden" is
  "20 Fenchurch Street" here, and its "City Hall" is "Old City Hall", the
  Assembly having moved out.
- To add one by hand, append `[name, x, y, height]` to `places`: x and y in
  decimeters from the board's south-west corner, height in centimeters. From
  a latitude and longitude, x is (longitude + 0.1292) x 694244 and y is
  (latitude - 51.4972) x 1112579.

**A stop is in two places:** an `<li id>` in the page's list (with a `.pin` of
the same number) and a pair in `city.json`'s `stops`, the id and an index into
`route`. The build test fails if the two lists differ. Moving a stop along the
existing path is a change to that index; a new path needs the data made again.
Which way the camera faces at each stop is the `FACING` table in `walk.js`.

**The pictures** are the model's own overview, 1600 by 800, with the controls
and caption hidden, once in each color scheme. The `--x` and `--y` on each pin
in the HTML are where the script had put that pin in the same view. Remake
both whenever the look or the stops change.

**The article's picture**, `static/2026/london-southbank-walk.webp`, is the
whole board with north straight up, so it lies level across the page, with the
pins left in and no background at all, so it sits on the article in Light and
in Dark. It is 2880 by 1200 and goes in a `<figure class="gallery">`, which
carries it past the article to the width of the window, up to 1600 pixels
(2026-11-15: *"north up, so it is horizontal and not slanted. And make the
image large to extend beyond the article"*). Three things were done for that
one render and are not in the page: WebGL was asked for a see-through canvas
and cleared to nothing; the lens was lengthened from 7 degrees to 1.6, so the
board's sides do not lean in; and the view was zoomed until the board filled
95% of a 1200 by 500 frame. The page's own opening view is still turned
fourteen degrees. Remake the picture with the other two.

**The credit line under the map stays.** OpenStreetMap's license asks for it.

**Tested** in `_test/`: the page settles as the model or the picture with no
errors, the picture and its pins work with WebGL taken away and with JavaScript
off, and the folder names no file outside itself. Checked by eye in Chrome
only; Safari and Firefox have not been tried.
