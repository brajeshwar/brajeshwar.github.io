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
