# Modular Typography and Spacing Rhythms

I was creating a simple website for [my daughter’s art](https://amara.oinam.art), and I wanted to do it quickly while maintaining a semblance of rhythm and modularity. I don’t want to spend time maintaining it, but I should remember how things work when I come back. The best way to do that was to use already-done, researched, and working methods, especially with typography and spacing.

> A modular scale, like a musical scale, is a prearranged set of harmonious proportions.
> — [Robert Bringhurst](https://en.wikipedia.org/wiki/Robert_Bringhurst)

![Typography)](/static/2013/typography-legends.png)

Typography is one of the [most important aspect](/2013/typography-one-of-the-most-important-aspect-of-web-design/) of web design. In the early days of the web, maintaining modularity without encroaching on fixing things based on optical judgments took work. The [modular scale calculator](https://www.modularscale.com) is one of the best tools for defining and understanding modular scaling in Typography. [Practical Typography](https://practicaltypography.com) by Matthew Butterick is a must-read.

With the advancement in [Cascading Style Sheets](https://en.wikipedia.org/wiki/CSS) (CSS) and its rapid adoption by modern browsers, maintaining modular typographic and spacing rhythms has become much easier and simpler.

The [type](https://utopia.fyi/type/calculator/) and [space](https://utopia.fyi/space/calculator/) calculator at Utopia makes it much easier to maintain consistent and smooth typography across multiple screen sizes and resolutions. This approach’s user benefit is that typography will always look “right,” regardless of the device used. The fun part is that this can all be done with plain CSS, its [variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), and the magic of [clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp).