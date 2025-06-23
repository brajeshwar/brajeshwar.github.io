# History of the browser user-agent, and why “Mozilla”

<img class="small left" src="/static/2025/mozilla-mascot.svg" alt="Mozilla Mascot">

Today, I learned a fascinating history lesson—[Why do all browsers’ user agents start with “Mozilla/”?](https://stackoverflow.com/questions/1114254/why-do-all-browsers-user-agents-start-with-mozilla)

Aaron Andersen wrote the best answer in his article, [History of the browser user-agent string](https://webaim.org/blog/user-agent-string-history/). ([archive](https://web.archive.org/web/20080904080055/https://webaim.org/blog/user-agent-string-history/))

Read the article above for details, but here is the brief.

The story behind why all browsers’ user agents start with `Mozilla` is a fascinating mix of early web browser rivalry, technical quirks, and clever tricks to ensure websites worked properly.

It began with [NCSA Mosaic](https://www.ncsa.illinois.edu/research/project-highlights/ncsa-mosaic/), the first popular web browser, which identified itself as `NCSA_Mosaic/2.0 (Windows 3.1)`. This was followed by Netscape Navigator, which adopted the user-agent string `Mozilla/1.0 (Win3.1)` to signify its advanced features. In response, Microsoft [Internet Explorer](http://localhost:4000/2022/internet-explorer/) mimicked Netscape’s user-agent string to gain compatibility with websites that served content based on the Mozilla identifier.

As browsers evolved, they continued to include `Mozilla` in their user-agent strings, even if they were not based on the original Netscape codebase. For instance, Google Chrome, which uses the WebKit rendering engine, adopted a user-agent string that included `Mozilla` to ensure compatibility with websites expecting that identifier. This practice led to a situation where all major browsers’ user-agent strings started with `Mozilla`, despite their differing underlying technologies.

Over time, this redundancy became a source of confusion and inefficiency. In response, Google [announced in 2020](https://groups.google.com/a/chromium.org/g/blink-dev/c/-2JIRNMWJ7s/m/u-YzXjZ8BAAJ) that it would freeze parts of Chrome’s user-agent string to reduce its role in browser fingerprinting and to encourage the adoption of the more privacy-conscious Client Hints API. Similarly, Firefox began freezing portions of its user-agent string in 2023 to align with this privacy initiative. Despite these changes, the legacy of the `Mozilla` prefix persists in modern browsers’ user-agent strings.

Well, the user agent string is a lie. Today’s user agent strings are often a tangled mess of legacy tokens just to trick websites into working well.

“Mozilla” originally meant the [giant green lizard mascot](https://en.wikipedia.org/wiki/Mozilla_(mascot)) of Netscape, but now it’s just a token in the user agent — a relic of early web browser competition.