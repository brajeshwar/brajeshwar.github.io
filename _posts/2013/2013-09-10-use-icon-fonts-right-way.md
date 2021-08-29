# How to use Icon Fonts the right way

Icon Fonts are a smart way to deploy scalable icons in your website and web app design projects. They are treated as part of your text and so you can apply all the properties you apply to a text - size, color, text-shadow, transparency, transform, etc.

You might have used some of the icon fonts, such as;

- <a href="http://fontawesome.io/">Font Awesome</a>, 
- <a href="http://www.entypo.com/">Entypo</a>, 
- <a href="http://icomoon.io/">IcoMoon</a>, 
- <a href="http://symbolset.com/">Symbolset</a>, 
- <a href="http://typicons.com/">Typicons</a>, 
- <a href="http://somerandomdude.com/work/iconic/">Iconic</a>, 
- <a href="http://zocial.smcllns.com/">Zocial</a>, 
- <a href="http://designmodo.com/linecons-free/">Linecons</a>, 
- <a href="http://shoestrap.org/downloads/elusive-icons-webfont/">Elusive Icons</a>, etc.

The easiest and simplest way to use them is to dump the font variants, drop in the icon style classes and use them in your html with an `<i class="icon-myicon"></i>`. However, with this method, you're forcing your users to download the whole font, when you actually use just a few of the icons.

There is a better way of doing it. Create a custom set of icon fonts with one or more fonts and build only the icons that you will need. This will reduce the file size of the custom font and so also a reduced CSS file size.

Here is how you can do it. Play around and perhaps make it part of your design process.

There are two good services that will help you achieve this feat - [IcoMoon App](http://icomoon.io/app/) and [Fontello](http://fontello.com/). Here are some of the salient features of both services;

- Free.
- Store Sessions for future use and update. Also to share it with your co-worker.
- Custom name for your out font.
- Custom tagging/naming of icons.
- Custom CSS prefix class for icons.
- Have quite a large sets of free and open source Icon Fonts.
- Allow Base64 Encoding and Embedding Fonts in the CSS.

IcoMoon  does have the added advantage that you can upload your own custom icons or Icon Fonts to the pool of icons you can work with. For instance, if you have purchased a premium Icon Font and want to use it with other Icon Fonts or you want to include a custom set of artworks as icons for your design project. IcoMoon accepts SVG for such custom Icons.

<img class="small right" src="/static/2013/icomoon-icon.png" alt="IcoMoon Icon Font" loading="lazy">

Let's take a look at the <a href="http://icomoon.io/app/">IconMoon App</a>. Fontello isn't that different. You should be good with whichever service you choose.

## Import Icons

IcoMoon App allows you to import you own custom icon (SVG) and use it as part of your final Icon Font.

## Icons

IcoMoon have a wide variety of Icon Fonts in it's Icon Library. Browse, select and add the icons you want to use.  You can edit the icons, tag them, scale, resize, move, rotate or duplicate them. Once you're happy with your selection, download your custom Icon Font and the associated CSS. You do have options to set the name of your Icon Font, prefix for your icon classes and other options.

## Download & Use

Download your Icon Font and use it with your project. Tip: If you use a CSS Preprocessor, you should separate that @font-face module and just update the Icon Classes styles with new icons added or removed while you work with your design.

## Store/Load Sessions

You should save your session (a json file) so you can come back later and load up the session to continue where you left - to add, edit or remove icons. You can also share the session file with your co-worker so work on the same Icon Font.