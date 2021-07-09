---
layout: post
title: Opera Dragonfly, Easy web apps debugging
date: 2008-05-16 17:22:05.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Browser
- CSS
- DOM
- Dragonfly
- Javascript
- Mobile
- Opera
meta:
  dsq_thread_id: '136559854'
  bitly_short_url: http://j.mp/jzbPkq
  retweet_cache: '1309570656:0'
  trx_addons_post_views_count: '63'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/opera-dragonfly/"
excerpt: Debug JavaScript, inspect CSS and the DOM, and view any errors -- Opera Dragonfly
  makes developing using Opera easier than ever, both on your computer and mobile
  phone.
---
<div class="figure"><img src="{{ site.baseurl }}/assets/2008/05/opera-dragonfly.jpg" alt="Opera Dragonfly" />
<p class="credit"><abbr class="type" title="Image">Image</abbr> from <cite>Opera</cite></p>
<p class="caption"><em class="title">Opera Dragonfly</em>Developer Tools to debut Javascript, inspect CSS and the DOM, and view errors.</p>
</div>
<p><!--more--></p>
<p>Opera released their new Developer Tools -- <a href="http://www.opera.com/products/dragonfly/">Opera Dragonfly</a> -- about a week back. The initial alpha version include</p>
<p>* JavaScript debugger<br />
* DOM inspector<br />
* CSS inspector<br />
* Command Line to allow commands to be inputed<br />
* Error Console that outputs validation errors and warnings exhibited by the CSS and JavaScript connected with the page<br />
* Proxy to allow debugging directly on mobile devices</p>
<p>Upcoming versions will also support editing of CSS/DOM/JavaScript, a single window mode and XHR/HTTP Headers inspection. Opera Dragonfly is built using Web technologies (XML, CSS and JavaScript) and will auto-update when a new version is released. The application will run in a persistent cache, so that it is accessible when offline, and so that it doesn't have to communicate with the Opera server, except when it updates.</p>
<p>Opera Dragonfly will support all browsers that include the Core-2.1 rendering engine (except Opera Mini). This currently includes Opera 9.5 beta 2 and the forthcoming Opera Mobile 9.5 release.  A proxy exists that allows Opera Dragonfly on the desktop to communicate with Opera on supported mobiles and devices. This makes debugging on devices easier as you can use a regular keyboard, mouse and monitor.</p>
<p>The early Alpha launch was received with great enthusiasm from the developer community and Opera received lots of feedback from people. There are few things which developers have found and Opera Dragonfly team is working on them;</p>
<p>* There's a problem with the caching, which means that if you flush the cache and then try to launch Dragonfly while offline, you might run into problems.<br />
* It doesn't run with Javascript disabled, another soon to be fixed bug.</p>
<p>The Opera Dragonfly is also working on the Scope documentation which they plan to release in the coming days.</p>
<p>Chris Mills' article on <a href="http://dev.opera.com/articles/view/introduction-to-opera-dragonfly/">Introduction to Opera Dragonfly</a> should give you much more details about Opera Dragonfly. <a href="http://dev.opera.com/articles/view/opera-dragonfly-architecture/">Opera Dragonfly Architecture</a> covers covers the architecture of Opera Dragonfly in detail, showing what the different components in the architecture are, and how they interact during Dragonfly's running.</p>
<p><em>Note:</em> If you're on the Mac, there's a bug whereby OS X's video memory gets corrupted, causing a crash. <a href="http://www.opera.com/products/dragonfly/">Download</a> the latest drop to avoid this.</p>
