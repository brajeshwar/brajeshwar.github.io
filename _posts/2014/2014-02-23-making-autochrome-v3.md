---
layout: post
title: The Making of Autochrome v3
---

## Autochrome v2

It all started with an eagerness to create one of the simplest WordPress Photoblog. After a rough work with the first version of Autochrome, the second version saw a huge improvement in speed, crispness and a clear focus to the photos. Autochrome v2 leveraged the powers of WordPress while achieving minimalism and simplicity to give users a no-nonsense WordPress Photography Theme.

## What we wanted to achieve with Autochrome v3

We really wanted to push the limit with `Autochrome v3`. We knew we needed to do something different so users can achieve more with the third version. There were few interim version of Autochrome which were never published but rather thrown away because they were not good enough, not worthy to be the successor of Autochrome v2.

While continuing and even pushing the envelope on minimalism and simplicity, we knew Autochrome v3 have to be faster, way faster, and have a laser focus on the Photographs and nothing else.

## Design

With Autochrome, we wanted to achieve a photography blog with very minimal graphical elements in the interface; as Dieter Rams put it "Design is as little design as possible." We knew this approach in a way help us to bring more focus the the content -- the photograph. This where we started. We sketched various ideas. Picked one idea which made sense.

We believe that Design is not just how it looks; Design is also about how it works. We started questioning.

- How can we avoid page loads while going to the next photo?
- Can we make it faster?
- Can we make it work on desktop, tablet as well as mobile devices?
- Can these possible with WordPress?

We realize that today's Single Page Web Apps might help solve these problems. So to try out, we prototyped a JSON API over WordPress. We did succeed. From there we considered building the front end which consumes these API endpoints.

We considered, <a href="http://backbonejs.org/">Backbone.js</a> and <a href="http://angularjs.org/">AngularJS</a>. We previously had experience with Backbone.js but AngularJS was our first. After reading a lot and testing out, we found AngularJS to the winner.

Well, here is our advice for the folks are looking for a Javascript framework, "The learning curve of AngulaJS is on a bit higher side; but it's really worth the time." For us, AngularJS helped in keeping the code well structured and it's directives saved a lot of spaghetti code.

With this setup, we were able to achieve roughly over 50 times faster in page rendering in Autochrome v3 than its earlier version.

<figure>
  <img src="/static/2014/autochrome-grunt.jpg" alt="Autochrome Grunt" loading="lazy">
  <figcaption>
    Pretty hack-ish at the moment but Grunt helps with WordPress Theme Development.
  </figcaption>
</figure>

## Development

We chose our favorites: <a href="http://sass-lang.com/">SASS</a> and <a href="http://coffeescript.org/">CoffeeScript</a> variants for the pre-processors. Made use of <a href="http://gruntjs.com/">Grunt</a> to watch and compile those files. So far using Grunt was straight forward.

But when the time came to hash the Stylesheets and Javascript files in a WordPress theme, things were not so straight forward.

In order to concatenate and revision the Javascript files while building the distribution archive, we made use of grunt task `grunt-usemin`. But, in the case of WordPress Stylesheet, we avoided filename based hashing. Since, WordPress looks for the exact filename `style.css`, and a hashed filenames like `style.34d3e234.css` didn't work with WordPress. 

So we decided to go with using the `$ver` parameter in the function `wp_enqueue_style()` in WordPress which conventionally used to include stylesheets in themes. During the build using the grunt task `grunt-text-replace` we injected the hash of the file as parameter. Some call this method as query based hashing and if you are using <a href="http://www.cloudflare.com/">CloudFlare</a> CDN, you may got ahead and set the "Static Content Caching Level" to Aggressive to cache these query based URLs.

{% include video source="youtube" id="4zUnFMUdnvI" %}

## Deployment

Grunt along with Git comes to the rescue during builds and deployments. After tagging and marking our release versions, we can deploy our builds pretty quickly from the command-line to our demo server, without worrying about (S)FTP or doing any of the manual uploads. A `grunt build` gives us a clean WordPress Theme Installer and a zip file to be sent to our merchant, which is ready to be sold to customers.

## Autochrome WordPress Theme

> Autochrome is a minimal, photography WordPress theme with special attention to your photos.

## WP-Portkey

<a href="https://github.com/theme6/wp-portkey">WP-Portkey</a> (Github) is our Open Source WordPress Theme Development Workflow we use at <a href="http://theme6.com/">Theme6</a>. We will keep improving it as we continue to use it.
