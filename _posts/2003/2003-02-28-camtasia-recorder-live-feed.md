---
layout: post
title: Camtasia Recorder live feed
---

All the way long, I had been thinking that Camtasia Studio Recorder can output only a max of 320 x 240 resolution. But I am wrong, now you can broadcast whatever dimension I wish. As there is no easy way to do an application sharing or a desktop sharing directly with Macromedia Flash Communication Server MX 1.0/1.5, [Camtasia Studio](https://www.techsmith.com) comes to the rescue with its live record output feature.

Steps

(a) create a video object on your stage and size it to 640 x 480, give an instance name of say "camtasia_mc".

(b) add the following frame script

```
//let us get the Camtasia Studio Video Capture Driver
//you may throw up an array of camera source available and
//let the user choose from them
//for this, we know what we are doing, so let us get it
for (i = 0; i < camera.names.length; i++) {
 if (camera.names[i] == "Camtasia Studio Video Capture Driver") {
  break;
 }
}
// Get the camera
mycamera = camera.get(i);
mycamera.setMode(640, 480, 5, true);
mycamera.setQuality(0, 50);
//show the live output
camtasia_mc.attachVideo(mycamera);
```

(c) start live recorder and remember to set the video format to 640 x 480 (In the Camtasia Recorder Program, Tools > Option > Live > Default Video Format and Choose 640 x 480 )

(d) run your Flash document.

There you see your live feed coming out in the Flash document. This same technique cam be used for any camera source, like a TV Tuner card which can in turn broadcast a TV channel live using Flashcom Server.