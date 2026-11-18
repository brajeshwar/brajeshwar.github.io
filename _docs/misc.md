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
- **A foot that owns up.** Each says it was made with AI and may not be
  accurate, gives a last-updated date, and links home to brajeshwar.com,
  since none of the site's own header or footer is there. The date is written
  by hand; `_test/build.spec.mjs` holds it to the folder's last commit.
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
home, zoom in, zoom out, day or night, then previous stop, fly the walk, and
next stop. The last three were words on a row under the model until
2026-11-15, where a short window pushed them out of sight. They are pictures
now, and every button names
itself in a tooltip on hover or focus, with its key if it has one. The tooltip
is the button's own `aria-label`, drawn by CSS, so what is shown and what a
screen reader says are one string.

**While the walk is being flown, its speeds fly out beside the button:** a
quarter, a half, 1, 1.5, and 2 times (2026-11-15: *"when it is active, fly
out an option menu on the side of the button"*). Choosing one does not stop
the flight; it runs the same flight's clock at another rate from where it has
got to. The speed is kept until the page is left, and is the fly-by's alone:
Next and Previous fly at their own pace. [WARNING] At twice the speed the
camera turns at up to 80 degrees a second, twice what the flight was smoothed
to, so 2 times is jerkier through the bends. That is the reader's choice.
The menu is 14.75rem wide in the CSS, and the button's tooltip is set that
much further out so the two do not cover each other; change one with the
other.

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
| `draw.js` | WebGL2 with no library: the shaders, the sun and its shadow map, and the sky map |
| `city.js` | reads `city.json` into one mesh |
| `city.json` | the model as whole numbers, 2.4 MB: the ground, the buildings and their colors, the trees and their heights, the walk, the stops, and the landmarks' names |
| `poster.webp`, `poster-dark.webp` | the picture that stands in for the model |
| `photos/` | his photos from the walk, under the stops they show |

**Each look is kept before the next is tried** (his word, 2026-11-15), as a
page beside `index.html` with its own scripts and pictures in a folder of the
same name, and a signed git tag on the commit that added it:

| version | page | what it is |
|---|---|---|
| `v0.1.0-grayscale` | `london-southbank-v0.1.0-grayscale.html` | the model in grays |
| `v0.2.0-tinted` | `london-southbank-v0.2.0-tinted.html` | blue river, green parks, warm ground; buildings gray |
| `v0.3.0-colored` | `london-southbank-v0.3.0-colored.html` | the same ground, and each building in its own color |
| `v0.4.0-measured` | `london-southbank-v0.4.0-measured.html` | the same colors, with heights, roofs, and trees measured from the survey; the last with hard shadows and one kind of window |

Each is marked `noindex`, and its back link goes to the live page.
**The kept pages do not read the live data.** `v0.3.0-colored/` holds a copy
of `city.json` as it was before the survey, and the first three kept pages
read that one; `v0.4.0-measured/` holds the measured one. So the live
`city.json` is free to be remade; a later kept version brings its own copy
with it in the same way.

**Without JavaScript, or without WebGL2,** the page is the picture, the pins on
it (placed in percent, in the HTML), and the list they link to. The script adds
`is-live` to `.stage` once the model has drawn, or `is-still` if it cannot.

**The page is night by the reader's own clock** (2026-11-15: *"why not detect
from the user's time and set it automatically. Of course, add a day/night
toggle amongst the buttons"*). Night is the whole page gone dark, and the
model with it: lit windows, lamps on the river. The rule is one function,
`light.night()`, in the script in the page's head, so it is settled before
the page paints. In order:

1. what the reader chose with the button, which holds for the visit
   (`sessionStorage`, `walk-light`) and is forgotten when the tab closes;
2. a standing wish for dark: the system's, or the site's own saved theme.
   Someone who asks for dark is never shown a bright page at noon;
3. the clock: night from seven in the evening to six in the morning, by the
   reader's own time, wherever they are.

`walk.js` asks again every minute, so evening comes on with the page open.
The button's key is N, and neither it nor the key stops a flight. [WARNING]
The hours are fixed. It is not sunset: nothing here knows where the reader
is, and asking would be a permission prompt for a decoration. Without
JavaScript the page follows the system alone, as it always did.

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

### Light and surface

Done 2026-11-15, as step 2 of the table further down, after he said of the
survey's heights: *"I don't see much difference in the visuals but I believe
this is better with the dimension. Do the next option 2."* No data changed;
it is all in `draw.js`, with a little in `city.js` and the colors in
`walk.js`.

- **The light has color.** The sky's light is cool and the sun's warm, so
  shade is blue-gray and a lit wall is not. `sky` in `DAY` and `NIGHT` is
  the only color to choose: the renderer makes the sun whatever adds up
  with it to white on open ground, so a tint still means what it says.
- **Shadows are soft, and softer far from what casts them.** For each
  pixel the shader first finds how far off the caster is (nine reads of the
  shadow map, the same nine for every pixel), then looks over a disc whose
  radius is 6 cm for each meter of that gap, from 30 cm to 4 m (twelve
  reads, the disc turned by a grain of each pixel's own).
- **The sky map puts shade in corners.** Once, at load, the model is drawn
  from straight above into a height map, and a second pass works out for
  every square meter how much of the sky it sees, twelve directions each.
  A narrow street, a courtyard, the foot of a wall, and a roof under a
  taller neighbor are darker for it, with no shadow falling there. It is one
  texture, 4096 by 2048 (2048 by 1024 on a small screen), and took about
  40 ms to make on his Mac. `tone[2]` in `walk.js` is how deep the shade
  goes; 0 turns it off.
- **Windows are of six kinds:** plain, tall sashes, two lights to a bay,
  glass between piers, strips along each floor (every wall over 40 m), and
  a wall of glass. A building draws its kind from its seed. Half the taller
  ones have a shop's wide glass at street level. Up close each pane differs
  a little, one in three has a blind part way down, and there is a sill.
  Far off, a wall takes the even tone of all its glass, which is why the
  whole-board view is a shade grayer than it was.
- **Glass and water mirror a sky that is not there.** `above` in `walk.js`
  is its three colors: overhead, the horizon, and the town below it. The
  page behind the model is still paper. [WARNING] Looked down on, an upright
  pane would mirror only the street, so every pane is leaned back, as if
  seen from the pavement. That is a cheat, and it is what makes a glass
  tower read as glass from above.
- **The river** has four trains of waves, kept as the lean they give the
  surface. It mirrors more of the sky toward the horizon, throws the sun
  back when the camera faces south-west, and by night carries the lamps of
  the banks as streaks drawn out toward the camera.
- **Flat roofs have parapets, and these are built, not painted.** `city.js`
  lays a flat roof 50 to 110 cm below the top of its walls, so the walls
  stand up round it, cast a shadow on it, and show their inner face. Nothing
  under 4.5 m has one. The wall seen from behind is the same triangles; the
  shader turns its light round.
- **What stands on a flat roof is painted:** plant in boxes with a shadow
  beside each, a skylight in one lot in ten, and a lift room now and then on
  a roof over 18 m. They sit in lots 6.5 m square, laid square to the
  building's longest wall, and only where the sky map says the middle of
  the lot is well back from the roof's edge. [WARNING] They have no height:
  seen from low down they are marks on the roof.
- Pitched roofs are laid in courses, grass is patchy, and no two trees are
  one green.

What it cost, measured on his Mac at 2880 by 1800: a frame still fits the
display's 120 a second in the whole-board view, at a stop, and flying, as it
did before; the page is live 40 ms later. [WARNING] Not measured on a phone
or an old laptop. The shader does about three times the texture reads it
did. If it drags there, the first things to cut are the twelve reads in
`sunlit()` and the size of the sky map.

Traps. All but the first drew wrong before they drew right:

- [WARNING] GLSL keeps words a script does not: `cast`, `half`, `sample`,
  `filter`, `input`, `output`, and `common` cannot be names in a shader.
- The sky map knows heights, not slopes. On a dome it takes the upper half
  for something overhanging the lower, so only flat surfaces read it.
- A wall must read the open air beside it at its own height. Read at the
  ground, the side of a tall building standing over a low neighbor came out
  black, because the ground there is indoors.
- A road is painted at its bridge's height past the bridge's end, where the
  map has no surface that high. Anything with no surface under it is left
  unshaded.
- The map stores heights up to 127.5 m. Every roof above that is one height
  to it, which only matters where two towers touch.

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

**The photos** are his own, taken on the walk on June 18 to 21, 2026
(2026-11-18: *"make it better if you can reference my photos"*). Fourteen of
the twenty-three he gave show a stop, and they sit under its words in the
list, named for it (`bfi-1.webp`). The other nine were taken between stops:
the Frida Kahlo mural near Blackfriars, the river from the north bank, the
lanes behind it, a telephone box on the Embankment. They were left out, not
hung on a stop they do not show. Which stop a photo belongs to was settled by
its GPS against the walk's stops, then by looking at it.

- Made with `sips -Z 960` and `cwebp -q 72 -metadata none`, about 75 KB each.
  [WARNING] `-metadata none` is what strips the GPS and the time from the
  originals. Keep it if a photo is ever added.
- They keep their color, a second stated exception to the grayscale rule,
  with the model.
- A click on a photo is a click on its stop: `walk.js` takes any click inside
  a `[data-stop]` and flies there. So there is no link to the full size.
- Under the stop's `<p>`, never inside it, and with no `<p>` or `<strong>` of
  their own, because `walk.js` fills the caption from the first of each.

**The pictures** are the model's own overview, 1600 by 800, with the controls
and caption hidden, once in each color scheme. The `--x` and `--y` on each pin
in the HTML are where the script had put that pin in the same view. Remake
both whenever the look or the stops change. [WARNING] Make them with the
browser's clock held at noon, and the dark one by asking for a dark system.
Made in the evening with the clock left alone, both come out night.

**The article's picture**, `static/2026/london-southbank-walk.webp`, is the
whole board seen from an angle and tipped well over, so the buildings stand
up: turned 16 degrees, looking down at 31, through an 11 degree lens
(2026-11-15: *"can we have a tilted image with the 3D view more visible from
an angle"*). It replaced a north-up one he had asked for earlier the same
day, which lay flat. The pins are left in and there is no background at all,
so it sits on the article in Light and in Dark. It is 2880 by 1200 and goes
in a `<figure class="gallery">`, which carries it past the article to the
width of the window, up to 1600 pixels. Two things were done for that one
render and are not in the page: WebGL was asked for a see-through canvas and
cleared to nothing; and the camera was moved until the board's corners and
its tallest tower filled 97% of a 1200 by 500 frame. [WARNING] The lens stays
under 12 degrees. Past that the model fades into the paper's color with
distance, which on no background is a pale smear. Remake the picture with
the other two.

### Where realism can go from here, without Google

Asked 2026-11-15: *"is this the best possible without Google? What would be
that next step to realism that we can generate and have it static and for us
to own?"* It is not the best possible. In order of what each step buys for
what it costs:

| step | what it adds | from | what it costs |
|---|---|---|---|
| 1. True shapes. [DONE] 2026-11-15, see above | measured heights for the buildings that were guessed, real roof forms, tree heights | Environment Agency LIDAR, 1 m surface and terrain models | took an evening; the data file grew by 90 KB, 43 KB of it after gzip |
| 2. Light and surface. [DONE] 2026-11-15, see above | softer shadows, shade in corners, sky and reflections on glass and water, more kinds of window, clutter on roofs | nothing new; shader work | took an evening; no weight |
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
- **The order to take them in:** 1 and 2 are done. 3 wants a newer
  photograph than the one found. 4 is an art piece, not a truer model.

**The credit line under the map stays.** OpenStreetMap's license asks for
its half, and the Open Government Licence for the Environment Agency's.

**Tested** in `_test/`: the page settles as the model or the picture with no
errors, the picture and its pins work with WebGL taken away and with JavaScript
off, and the folder names no file outside itself. Checked by eye in Chrome
only; Safari and Firefox have not been tried.
