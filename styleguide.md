---
layout: page
title: Styleguide
---

# Styleguide

## Articles

- If possible, avoid front matter. If used, it should be optional.
- There is an optional cover-picture. Can we make this an optional element but as part of the content and styled as a `cover-picture`?

## Images

- Books: `360px x 480px` (styled as `240px x 320px`)
- Film:  `300px x 400px` (styled as `225px x 300px`)
- Gallery has a container, `class="gallery" markdown="1"`, then is a markdown list with images, optionally with a link.

## Styles

- Avoid
	+ gradients
	+ box-shadows

Custom, strange, and `why I did that` ones. I need to stop doing custom styles.

- `aside, {:.aside}` for custom styled aside.
- `{:.aside .right}` flushes right
- `{:.mark}` shares the same style as HTML <mark>MARK</mark> and is a highlighted text/phrase block.
- images can be `.small`, `.medium`, `.large`, or `.full`. Besides the default `left` alignment, they can be flushed `.right`.