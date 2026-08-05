# nsfw-ish Responsive b**bs, err, responsive content with html/css

Working on a website that needs to be responsive.

Client: Can we get the boobs of the images of those females be responsive. Make them bigger in desktop browsers, subtle in tablets and "ok" in Smartphones. Perhaps extra large on very big monitors.

Me: Hmmmm, sure, why not. I can even do a "<a href="http://www.youtube.com/watch?v=dQw4w9WgXcQ">boobs.js</a>" to do a 3D canvas resizing to make it more realistic. It can fall back to Flash for IE.

So, I went ahead and started styling the pages. Here is the code snippet for the responsive boobs.

```css
// Smartphones
@media (max-width: 480px) {
	boob-size: 32;
	boob-cup: A;
}

// Tablets and bigger landscape phones
@media (min-width: 480px) and (max-width: 768px) {
	boob-size: 34;
	boob-cup: B;
}

// Portrait tablet to landscape and desktop browsers
@media (min-width: 768px) and (max-width: 940px) {
	boob-size: 36;
	boob-cup: C;
}

// X-Large desktop
@media (min-width: 1210px) {
	boob-size: 38;
	boob-cup: D;
}
```

I know, that's a scary nightmare, right! Today morning, I woke up totally sweating with those codes haunting and hurting my brain.

## Addendum, 2026: the nightmare compiles

That snippet was invented. `boob-size` and `boob-cup` are not properties, and the declarations sit bare inside `@media` with no selector to belong to. A browser in 2011 dropped every line of it.

It was two hyphens away from being real. Custom properties accept almost any name and almost any value, and they arrived in 2016 — five years after this post. Prefix the invented properties with `--`, give them a rule to live in, and the joke runs:

```css
.cup-demo { --n: 0; --cup: "—"; }

@media (max-width: 480px) {
  .cup-demo { --n: 32; --cup: "A"; }
}
@media (min-width: 480px) and (max-width: 768px) {
  .cup-demo { --n: 34; --cup: "B"; }
}
@media (min-width: 768px) and (max-width: 940px) {
  .cup-demo { --n: 36; --cup: "C"; }
}
@media (min-width: 1210px) {
  .cup-demo { --n: 38; --cup: "D"; }
}

.cup-demo__readout { counter-reset: band var(--n); }

.cup-demo__readout::after {
  content: counter(band) var(--cup);
}

.cup-demo__bar { width: calc(var(--n) * 8px); }
```

One number does both jobs: `counter()` prints it, and `calc()` turns it into an actual width. No JavaScript.

<style>
/* Scoped to this post. The demo below is the only thing on the site that uses
   these rules, so they live here instead of in the shared stylesheet, which
   ships to every page. The breakpoints are the original four, verbatim. */
.cup-demo { --n: 0; --cup: "—"; }

@media (max-width: 480px)                        { .cup-demo { --n: 32; --cup: "A"; } }
@media (min-width: 480px) and (max-width: 768px) { .cup-demo { --n: 34; --cup: "B"; } }
@media (min-width: 768px) and (max-width: 940px) { .cup-demo { --n: 36; --cup: "C"; } }
@media (min-width: 1210px)                       { .cup-demo { --n: 38; --cup: "D"; } }

.cup-demo__panel {
  display: grid;
  justify-items: start;
  gap: var(--space-2xs);
  padding: var(--space-s);
  background-color: var(--bg-color-low);
  border-radius: var(--border-radius);
}

.cup-demo__label {
  font-size: var(--step--2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-color-lower);
}

.cup-demo__readout {
  counter-reset: band var(--n);
  font-family: var(--font-mono);
  font-size: var(--step-3);
  line-height: 1;
  color: var(--text-color);
}

.cup-demo__readout::after { content: counter(band) var(--cup); }

.cup-demo__bar {
  height: 6px;
  width: calc(var(--n) * 8px);
  background-color: var(--text-color);
  border-radius: var(--border-radius-tiny);
  transition: width 120ms ease-out;
}
</style>

<figure class="cup-demo">
  <div class="cup-demo__panel">
    <span class="cup-demo__label">Responsive output</span>
    <span class="cup-demo__readout" aria-hidden="true"></span>
    <span class="cup-demo__bar" aria-hidden="true"></span>
  </div>
  <figcaption>
    Resize the browser window and the readout re-cups itself &mdash; 32A on a phone, 38D past 1210px.
    Between 940 and 1210 it reads &ldquo;—&rdquo;, because the original snippet has no rule for that range;
    the client, at those widths, does not exist.
  </figcaption>
</figure>
