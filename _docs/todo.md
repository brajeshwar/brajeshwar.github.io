# Todo — brajeshwar.com

Running list of site tasks, beyond the v2027 redesign phases (those are tracked in
[`memory.md`](memory.md) and [`v2027/spec.md`](v2027/spec.md)). Absorbed from the
`brajeshwar.com-2027` planning braindump.

## Content & pages
- [ ] **Year archives** — `/2001/`, `/2002/`, … in the [Simon Willison](https://simonwillison.net/) style.
- [ ] **Home = text only.** Reduce the homepage to writing; convert Books into a list of top rereads.
- [ ] **Page template (Full Width)** — Pages, Photos, Wear, Devices, Books, Films.
- [ ] **Page template (Ideal Width)** — posts, articles, optimised for reading.
- [ ] **Timeline template** — `cv.brajeshwar.com` as part of `/about`; eventually replaces the LinkedIn profile.
- [ ] **Photos component** — a style that highlights key photos. Likely after <https://pictures.oinam.com> is up.

## Infrastructure & migrations
- [ ] **Redirect** `docs.brajeshwar.com` → <https://archive.oinam.com> via Cloudflare Workers.
- [ ] **Move Jekyll redirects** to Cloudflare / plain HTML — or drop them and give a good explanation + next-step in the **404 page**.
- [ ] **Migrate `cdn.oinam.com`** remnants to `brajeshwar.com`.
- [ ] **YouTube videos** — move to `brajeshwar.com`, or embed and ignore, or self-host (PeerTube for Oinam or similar).

## Design system & performance
- [ ] **Adopt [Lucide](https://lucide.dev) icons** — inline the raw `<svg>` (currentColor,
      zero-fetch) into `_includes/icons/`; standardise the header search icon + any future
      icons on it. See [`styles.md`](styles.md) §4.
- [ ] **Geist `.ttf` → `.woff2`.** `assets/fonts/geist/Geist-Variable.ttf` is a raw TrueType;
      convert to woff2 (much smaller) so readers who pick Geist pay less. Inter and Libre
      Baskerville are already woff2. (Default load is unaffected — fonts load only when chosen.)
- [ ] **Scope `sidenotes.js` to article pages.** It's loaded site-wide via `default.html` but
      only does anything where footnotes exist; skip it on the homepage/pages to shave a
      request from non-article loads (performance-budget tidy, not urgent).
- [x] **Reading width = character-based** — `--measure: 66ch` (~60–70 chars/line); video embeds
      switched to `aspect-ratio: 16/9`. See [`styles.md`](styles.md) §1.
- [x] **Default theme = monotone grayscale** — locked; zero-chroma scale + gray accent, colour
      opt-in. Link affordance via underline. See [`styles.md`](styles.md) §2 / [`design.md`](design.md).
- [x] **Page-load budget < 100 KB** (non-article pages) — documented as a hard target; homepage
      already ~48 KB raw / ~13 KB gzip. See [`design.md`](design.md) → *Performance budget*.

## Open questions
- [ ] **Theme toggle without JS?** Do we really need to remember the Light/Dark preference (and thus JavaScript)? A CSS-only approach: <https://codepen.io/ditheringidiot/pen/JjbzNMz>. (Note: the current build deliberately persists reader choice via JS + a no-flash snippet; revisit only if the CSS-only tradeoff is worth losing persistence.)

## Done
- [x] **Modern Font Stacks** adopted — <https://modernfontstacks.com> *(2025-12-30)*
- [x] **Search → dedicated `/search/` page** to reduce load on other pages.
- [x] **Search moved off Algolia → Pagefind.** Algolia (adopted 2025-06) hit monthly limits too easily; <https://pagefind.app> replaces it. See [`search.md`](search.md).
