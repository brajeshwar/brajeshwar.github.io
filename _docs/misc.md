# /misc/ — one-off pages

A home for pieces that go with an article but stand on their own: an interactive
map, a small tool, a visual essay. Chosen 2026-11-15 over `/etc/` (a Unix joke
that tells a reader nothing) and `/lab/` (kept for later, if experiments ever
need a section of their own). The first is `/misc/london-southbank/`, the walk
that goes with `/2026/london-stroll-along-southbank/`.

The rules:

- **One folder each, everything inside it.** `misc/<name>/index.html` carries
  its own CSS and JS. It does not load `site.css` or anything from
  `/assets/`, and nothing of it reaches another page. Deleting the folder
  removes it completely.
- **No front matter**, so Jekyll copies the file as it is: no layout, no
  Liquid, no hashing. The build tests that check every site page (theme
  snippet, title, `<h1>`) pick pages by the site stylesheet, so they skip
  these by design.
- **Still the site's manners:** grayscale, system fonts, the saved Light or
  Dark from `localStorage.theme`, whole without JavaScript, and no emoji (the
  emoji test scans `misc/`). Plain JavaScript, no libraries.
- **Its URL is permanent once pushed**, like any other (guardrail 2), so it
  goes into `_test/urls.txt` by hand.
- **Generators stay out of the repo.** If a drawing was made by a script, the
  script was one-time; the output is what ships.
