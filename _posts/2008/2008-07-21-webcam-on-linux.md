---
layout: post
title: Running a webcam on Linux
---

<a href="http://www.gnome.org/projects/cheese/"><img class="small-right" src="/static/2008/cheese-big.png" alt="Cheese"></a>

You've got a brand new notebook with an in-built webcam and you're in love with Linux. The problem is, your webcam runs only on the pre-installed Windows Vista/XP! This is one of the common hindrances I've found people meddling with. The celebration spree takes a poise when you end up wasting a lot of time on forums, websites, IRCs, etc. looking for the perfect solution to help you get the camera in action.

Trust me, it's not that difficult. It's just the right tool, you're probably under a shadow of. I recently came across one of them. It's called <a href="http://www.gnome.org/projects/cheese/">Cheese</a>! It's an open source webcam application for Linux users. 

If you could picture all this to be just a lame web camera supporting tool, let me tell you that Cheese doesn't just let you take photos and videos but incorporates special visual effects to them. Cheese was written as part of Google's Summer of Code 2007 by Daniel G. Siegel. Cheese comprises of some really cool features like a countdown timer and support for saving pictures to <a href="http://flickr.com/">Flickr</a> with the flick and F-spot support prerequisites.

Cheese has an interface similar to interface that of Phone Booth, a similar application which available for the Mac OS X users.

Cheese is built on <a href="http://www.gstreamer.net/">GStreamer</a> and uses GTK, Cairo and D-Bus. Although Gstreamer is nowhere close to Xine engine when it comes to playback quality, but the flexibility it gives to the developers tempt them to make outstanding applications using this very media application development platform. After its success at Summer of Code in 2007, the development of this application continued thereafter. 

To install, just shoot your terminal and type `sudo apt-get install cheese` (for ubuntu). Cheese is already available on the Ubuntu 8.04 Repositories.

Though Cheese has support for both audio as well as video captures, the later has reportedly met with a few bugs which eventually leads the application to crash, in some cases.

The eye candy effects are really good. They let you be creative with your images and videos with options to apply multiple effects to the images or videos by selecting more than one effect. Check out the <a href="http://www.gnome.org/projects/cheese/screenshots.html">screenshots</a>.

Note: You may also send your own snapshots, for them to appear on the <a href="http://live.gnome.org/Cheese/Snapshots/">Cheese Snapshots Website</a>.

To summarize it, Cheese happens to be an extremely useful application for the webcam support. It may not be a matter of surprise is it starts getting bundled with GNOME desktop environment in the future releases.
