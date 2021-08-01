---
layout: post
title: Character Entities Cheat Sheet for HTML, CSS and Javascript
---

I always had to fiddle and look around multiple sources to get the correct Character Entity with their named or numeric entity for HTML, the unicode entity for CSS, or the Octal-encoded character for Javascript.

For instance, in CSS, to add &rarr; in the content of :before, you can write;

```
.more:before {
  content: "\2192";
  margin-right: 1em;
}
```

So, I decided to go ahead, spend some time and made a nice, clean, easy-to-navigate one page site to display, literally, all Character Entity for HTML, CSS and Javascript.

[Character Entities (HTML, CSS & Javascript)](http://oinam.github.io/entities/)
([source](https://github.com/oinam/entities/))
