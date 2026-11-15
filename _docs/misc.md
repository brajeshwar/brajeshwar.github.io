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

It came up once more the same day and was declined for good, in his words:
*"I thought the Google API was for build, didn't realize this will load Google
while people visiting my website. If that is the case, I do not want to depend
on Google for something personal and experimental and lab."* There is no
build-time route either: Google's terms do not allow its 3D tiles to be saved
and shipped. Do not offer it again.

| file | what it is |
|---|---|
| `index.html` | the page, its CSS, the list of stops, and a pin for each |
| `walk.js` | the camera, the flights between stops, the controls |
| `draw.js` | WebGL2 with no library: the shaders, the sun and its shadow map |
| `city.js` | reads `city.json` into one mesh |
| `city.json` | the model as whole numbers, 2.4 MB: the ground, the buildings and their colors, the trees and their heights, the walk, the stops, and the landmarks' names |
| `poster.webp`, `poster-dark.webp` | the picture that stands in for the model |

**Each look is kept before the next is tried** (his word, 2026-11-15), as a
page beside `index.html` with its own scripts and pictures in a folder of the
same name, and a signed git tag on the commit that added it:

| version | page | what it is |
|---|---|---|
| `v0.1.0-grayscale` | `london-southbank-v0.1.0-grayscale.html` | the model in grays |
| `v0.2.0-tinted` | `london-southbank-v0.2.0-tinted.html` | blue river, green parks, warm ground; buildings gray |
| `v0.3.0-colored` | `london-southbank-v0.3.0-colored.html` | the same ground, and each building in its own color |

Each is marked `noindex`, and its back link goes to the live page.
**The kept pages do not read the live data.** `v0.3.0-colored/` holds a copy
of `city.json` as it was that day, and all three kept pages read that one. So
the live `city.json` is free to be remade; a later kept version brings its own
copy with it in the same way.

**Without JavaScript, or without WebGL2,** the page is the picture, the pins on
it (placed in percent, in the HTML), and the list they link to. The script adds
`is-live` to `.stage` once the model has drawn, or `is-still` if it cannot.

**The model is in color; the page round it is not** (2026-11-15: first *"the
next step of the Tinted Palette"*, then *"build the next better colored
one"*). This is a stated exception to the grayscale rule above, for the model
only.

- **The ground is tinted.** The river is blue, parks and trees green, the
  ground and roads warm. `DAY` and `NIGHT` in `walk.js` hold a color for each
  kind of ground; which set is used goes by whether the page's `--paper` is
  light or dark. By night one window in three is lit, lamp yellow.
- **Each building has its own color**, in `city.json` (`wallColor` and
  `roofColor` on `blocks` and `roofs`, five bits a channel). The shader calms
  it: `paint` in `walk.js` is how much of its color a building keeps, and the
  last two numbers of `light` are how dark a black one and how light a white
  one is drawn. Those three numbers are the whole of the taste; the data does
  not need making again to change them.
- **Where the colors come from:** the map's `building:colour` and
  `roof:colour` where it has them, else the color of its
  `building:material` or `roof:material`, else the building it is a part of.
  That covers 44% of walls and 42% of roofs. [WARNING] The rest are guesses: a
  wall borrows from one of its three nearest colored neighbors within 150 m,
  softened almost halfway to a neutral stone; a roof takes the gray of a
  London roof with a little of its own walls in it.
- **The river bridges' sides are painted** by name, by hand: Westminster
  green, Blackfriars red, Tower Bridge blue, and so on (`wallColor` on
  `decks`).

### How city.json was made

On 2026-11-15, from OpenStreetMap through the Overpass API, for the box
51.4972 to 51.5152 N, 0.1292 to 0.0698 W, and made again the same day with
heights from the Environment Agency's LIDAR survey (below). The script is not
kept. What it did:

- **Buildings** are `building` and `building:part` outlines, pulled up to
  their height. Where a building has parts, the parts are drawn and the
  outline only where they leave it uncovered. Roof shapes that are mapped are
  built: pyramids, domes, gables, hips, lean-tos, and barrel vaults. That is
  why Tower Bridge, St Paul's, the Houses of Parliament, and the London Eye
  look like themselves: someone mapped them piece by piece.
- **A height is the map's `height` where it has one, and the survey's
  otherwise.** The next section says how, and what is still a guess.
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

### Heights from the survey

Done 2026-11-15, as step 1 of the table further down (*"Then do Option 1"*).
The map knew the height of a third of the buildings. Another third it gave
only as a count of floors, and the rest, 36%, were guesses. The survey
measures them.

- **The survey** is the Environment Agency's LIDAR Composite 2022 at 1 m: the
  first-return surface model less the terrain model is the height of whatever
  stands on each square meter. Four 5 km tiles cover the board (TQ27ne,
  TQ28se, TQ37nw, TQ38sw), and every cell of it has both surfaces. It is
  under the Open Government Licence, which asks for the credit that is now
  under the map and in `city.json`'s `about`.
- **Lined up with the map** by sliding one over the other until the most
  footprints sat on tall cells: 2 m west and half a meter south, which took
  the share from 89.6% to 92.9%.
- **Which reading is the roof** was settled against the 746 heights people
  have mapped by hand. A flat roof stands at the middle height of its
  footprint (5% over the mapped height, at the median), and a shaped one is
  measured to its ridge (1% over).

| what the map says of a building | what is drawn | how many |
|---|---|---|
| a `height` | the map's height. The survey can be older than the building, and it reads glass badly: over most of one of the Shard's parts it sees nothing at all | 3,080 |
| a count of floors | the survey, unless the two differ by more than about two to one, when they are not looking at the same building and the floors stay at 3.2 m each | 2,859 measured, 496 kept |
| nothing | the survey | 3,381 |
| nothing, and the survey finds nothing standing | 3 m, or the little the survey shows. These are pontoons, yards, and kiosks, which used to be drawn as tall as their neighbors | 150 |
| nothing, and too small for the survey to measure | the median of the nine nearest known heights within 160 m, as before | 38 |

- [WARNING] **Floors were the surprise.** A count of floors at 3.2 m each
  came out 19% low at the median, so the survey replaces it wherever the two
  are plausibly the same building. Of the 6,240 buildings it measured, 3,455
  moved by more than 3 m and 712 by more than 10 m.
- **A part that starts above the ground keeps the map's word.** The survey
  sees only the top of whatever is highest at a spot.
- **Roofs:** where the map names no roof shape and the footprint is one plain
  building, a gable, a hip, a pyramid, and a lean-to are each fitted to the
  survey, and the best is built if it is believable: close to the survey,
  much better than a flat roof would be, and at a slope real roofs have. That
  gave 309 roofs (266 gables, 34 hips, 9 lean-tos). Tested on the roofs the
  map does name, it calls 5 of 1,081 flat roofs pitched, and finds 87 of 709
  pitched ones. [WARNING] So most pitched roofs on small houses are still
  drawn flat: a house here is five meters wide and the survey has one reading
  a meter. That is the price of not inventing any. The first thresholds, set
  by eye, built 203 lean-tos, half of them rising more than 5 m: buildings
  with a tall half and a low half, not roofs. Do not loosen them without
  running that test again.
- **Trees:** each mapped tree takes the tallest reading within 4 m of it that
  is not on a building, if that is between 4.5 and 38 m. That measured 4,035
  of the 6,744, at a median of 11 m and up to 34 m; the planes along the
  river are the tall ones. `treeTops` in `city.json` holds them in
  decimeters, in the order of `trees`, with 0 for a tree the survey did not
  find, which `city.js` draws as a young one of 5 to 8 m. The survey is
  flown mostly in winter, when the leaves are off, so a thin tree can be
  missed.
- **To do it again:** the tiles come from the survey catalogue at
  `environment.data.gov.uk` (search by a polygon, then two zips a tile, the
  surface and the terrain, about 70 MB each, GeoTIFF). Positions go from
  latitude and longitude to the National Grid, which over this board is a
  turn of a degree and a half and a slide, to within half a meter. The
  rasters are not kept; they are more than half a gigabyte.

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

### Where realism can go from here, without Google

Asked 2026-11-15: *"is this the best possible without Google? What would be
that next step to realism that we can generate and have it static and for us
to own?"* It is not the best possible. In order of what each step buys for
what it costs:

| step | what it adds | from | what it costs |
|---|---|---|---|
| 1. True shapes. [DONE] 2026-11-15, see above | measured heights for the buildings that were guessed, real roof forms, tree heights | Environment Agency LIDAR, 1 m surface and terrain models | took an evening; the data file grew by 90 KB, 43 KB of it after gzip |
| 2. Light and surface | softer shadows, shade in corners, sky and reflections on glass and water, more kinds of window, clutter on roofs | nothing new; shader work | a few hours; no weight |
| 3. Photograph from above | real roofs and ground, as seen from the air | Environment Agency vertical aerial photography, 10 to 50 cm | most of a day; several megabytes of imagery; facades stay plain |
| 4. A painted map | a fixed view redrawn by an image model, the Tiny London method run on our own renders | our model | GPU or API money; cannot turn or fly; its detail is invented |
| 5. Our own photographs in 3D | true photo-realism at a stop, from video he shoots there | his camera | a trip, GPU training, tens of megabytes a scene, and a renderer that is a library or a great deal of code |

- **Checked that day:** the LIDAR composite is published with no access
  constraints as 5 km GeoTIFF tiles and covers most of England; the aerial
  photography is under the Open Government Licence but was flown project by
  project, so it is patchy. No open model of London with roof shapes was found.
- **Checked since:** the LIDAR covers every cell of the board. For step 3,
  the same catalogue lists vertical aerial photography for all four tiles,
  but the only one it lists for them is from 2008, at 40 cm. [WARNING] That
  is eighteen years old: no Shard, no Blackfriars station roof. Look for a
  newer flight before building on it.
- **The ceiling:** photo-real facades across a whole city exist only in
  Google's and other paid photogrammetry. Open data has no pictures of walls.
  Step 5 is the only owned route to real photo-realism, one place at a time.
- **The order to take them in:** 1 is done; 2 is next, and he asked to be
  reminded of it. 3 wants a newer photograph than the one found. 4 is an art
  piece, not a truer model.

**The credit line under the map stays.** OpenStreetMap's license asks for
its half, and the Open Government Licence for the Environment Agency's.

**Tested** in `_test/`: the page settles as the model or the picture with no
errors, the picture and its pins work with WebGL taken away and with JavaScript
off, and the folder names no file outside itself. Checked by eye in Chrome
only; Safari and Firefox have not been tried.
