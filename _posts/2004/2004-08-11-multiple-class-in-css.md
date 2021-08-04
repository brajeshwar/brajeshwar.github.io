---
layout: post
title: Multiple Class in CSS
---

Damn! Why was I never told, taught, tiped that this is possible and modern browsers support 'em. The oracle of CSS would be laughing at me for learning this late, yes very late. I had missed an online conference today while trying to get my head around to this trivia, "mutltiple classes" in CSS. I have learnt long back that I can have a class piggybag to an ID but what was troubling me was that I wanted to inherit all properties of a particular class and then apply some sparingly used class to few HTML elements (they appear one or twice in a page while the parent class was appearing many times in a page).

What I have been thinking all along was that we cannot apply two classes, well logically thinking, it is not possible to do class="firstClass" class="secondClass" inside, say, a single DIV tag. I was very tempted to break the valid standard rule and do an ID="firstClass" class="secondClass" but I know I will be breaking my own principle, "stick to the rules". I ended up nesting DIV tags just to inherit the parent property (that sucks)! And I know of few fallouts if I keep using this technique and that will be particularly with IE (IE are still used by majority of the people, believe me! Some people think Internet means IE, even some seasoned developers/designers have not heard of Firefox).

I have got into this issue before and I wanted to avoid the same here. If the parent container has a background colour and is positioned (relative), then the floated child elements will not show their  background (colour or image); and if the child is a floated image, then the whole image disappears. It is there, but "behind" (eh!) the background of the parent element. The solution is to also position the child element ({position: relative}).

Ok, now coming to the point, much to my surprise (I am feeling like a dork now) is that CSS can take in multiple classes, just separate the classes by a whitespace; myClass="classOne classTwo" (look at the whitespace separating the classes). Ah! you can have more than two classes, yes, multiple classes. Isn't this good news, now I have some good ideas to shorten my CSS even more.