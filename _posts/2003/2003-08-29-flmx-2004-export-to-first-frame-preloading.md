---
layout: post
title: FLMX 2004 - export to first frame & preloading
---

Proper `preloading from 0%` was always a question with the introduction of components as they are "exported in first frame" thus making it rather impossible to have the preloader in the same document with the components and do a proper preloader.

The question arises again with the coming Flash MX 2004/Professional and the introduction of Actionscript 2.0 where classes are exported on the first frame by default. In Flash documents where many classes are used, it will eventually add load to the first frame, thus a longer time to download and the viewer have to wait until all the classes are downloaded. Reading the comments on Peter Hall's post, a little discussion on how to do preloading came up.

For Classes, we can specify the frame where your classes are packaged and exported, and not necessarily on the first frame.

1. Go to File > Publish Settings
2. Click the Flash tab > ActionScript version

Now just change the "Export Frame for Classes" to whichever frame you wish, but take care that it is a frame number  that exist on your Timeline.

And about components and preloading, we can do something like this. First deselect "Export in first frame" for any compiled clip symbols (v2 components).
Then as there is the ProgressBar component which you are likely to use for the preloading, just have "Export in first frame" for this component.
