---
image: /static/2025/ship-of-theseus.webp
---

# Ship of Theseus and the Ever-Evolving Codebase

If you’ve ever worked in software long enough, you’ve likely experienced a moment of existential dread: Is this even the same product we started with? Or did we just quietly rebuild the whole thing, piece by piece, until nothing of the original remains?

Welcome to the Ship of Theseus,[^ShipTheseus] tech edition. The philosophers asked: if every plank of a ship is replaced, is it still the same ship? We ask: if every line of code is rewritten, is it still the same product or just a very confident doppelgänger with version control?

## When a Codebase Becomes a Haunted House

Most codebases start out small, innocent, and almost cute. A little `index.html` here, a few styles, and a few routes there. You pat it on the head, call it “MVP,” and ship it. But then, users arrive. Investors arrive. Worse-Best Problem happens when enterprise customers arrive.

Suddenly, your ship needs new planks. You swap out a database engine because MongoDB is “so 2010.” You rewrite your frontend because React got a new hooks API. You gut your backend because someone said the words “microservices” in a board meeting. By the fifth rewrite, the only things that remain original are your broken dreams and the logo.

And yet, your users still call it the same app. They don’t know or care that the authentication flow has been re-implemented twelve times. To them, it’s still “that app that takes forever to load.”

## Brand, UX, and the Illusion of Sameness

Here’s the kicker: customers don’t care about your philosophical struggles. They care that the button is still blue, that their data is still there, and that the login works on the third attempt. To them, the “sameness” of your product lives in **brand and experience**, not in your lovingly hand-crafted code.

Think about [Slack](https://slack.com/). Behind the scenes, their stack has been overhauled more times than a Formula 1 car during a race. But to users, Slack is Slack: the place where unread messages go to die.

Or consider [Airbnb](https://airbnb.com/). Their codebase could be written in COBOL by ghosts of IBM engineers for all users’ care, as long as the “Book Now” button still works and the photos are flattering enough to hide the moldy bathroom.

## Developers: The Only People Who Notice

The paradox is that developers are the only ones losing sleep over identity crises of codebases. Nobody else cares. Imagine telling a customer: “Actually, this is a completely new product, because we rewrote the backend in Rust.” The customer will blink, nod politely, and still complain about the pricing.

To management, it’s still the same product because the billing system continues to extract money. To marketing, it’s the same because the font hasn’t changed. To users, it’s the same because they can still forget their password.

Only the engineers are crying in the corner, “But it’s not the same anymore.”

## You Are the Shipwright

So, is a rewritten product the same product? The answer is: **yes, until the users say otherwise**. Sameness in software isn’t about the code; it’s about continuity of trust. If users trust that their stuff works, the ship is intact, even if you swapped out every plank for Typescript, Rust, or whatever Hacker News is fawning over this week.

At the end of the day, codebases are just ships at sea, constantly patched, rebuilt, and repainted. Your job isn’t to preserve some mythical “original” product; it’s to keep the thing floating, keep the sails up, and make sure the passengers overlook the duct tape.

Because in tech, the Ship of Theseus has Wi-Fi, push notifications, and a subscription plan.

## So, …

- **Brand continuity** is what makes the ship “the same.”  
- **UX familiarity** makes users stay.  
- **Trust** is the real product, not the code.  

Rewrite, refactor, replace. Just don’t tell the users. And remember: even if you’ve replaced every single plank, you’re still sailing the same ship. It just has more bugs now.

[^ShipTheseus]: The [Ship of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus), also known as Theseus’s Paradox, is a paradox and common thought experiment about whether an object is the same object after having all of its original components replaced over time, typically one after the other. In Greek mythology, [Theseus](https://en.wikipedia.org/wiki/Theseus), the mythical king of the city of [Athens](https://en.wikipedia.org/wiki/Athens), rescued the children of Athens from King [Minos](https://en.wikipedia.org/wiki/Minos) after slaying the minotaur and then escaped onto a ship going to Delos. Each year, the Athenians would commemorate this by taking the ship on a pilgrimage to Delos to honour [Apollo](https://en.wikipedia.org/wiki/Apollo).