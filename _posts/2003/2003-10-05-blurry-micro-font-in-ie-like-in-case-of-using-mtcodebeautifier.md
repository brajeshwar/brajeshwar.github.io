---
layout: post
title: Blurry Micro font in IE (like in case of using MTCodeBeautifier)
date: 2003-10-05 13:15:40.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135614515'
  bitly_short_url: http://j.mp/jGbvhG
  retweet_cache: '1309551757:0'
  trx_addons_post_views_count: '38'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/blurry-micro-font-in-ie-like-in-case-of-using-mtcodebeautifier/"
---
<p>I have seen this issue on a couple of blogs and was there even on my blog too, hope things are cleared now or atleast with the next upcoming blog version of mine, things should be all fine. I am talking about the micro font size in IE specially those codes using <a href="http://voisen.org/archives/projects/000239.php">MTCodeBeautifier</a>.</p>
<p>If you are using relative font like em, setting your<br />
body { font-size: 76%; }</p>
<p>Then using ems like<br />
p, pre {<br />
font : 400 1.0em/1.6em "Courier New", Courier, monospace;<br />
}</p>
<p>will definitely stop IE from showing fonts as micro, which keeps the text more or less legible when the user sets his/her font size to smallest or you define it as small, read further here at <a href="http://www.thenoodleincident.com/tutorials/typography/index.html">typography page</a> at <a href="http://www.thenoodleincident.com/">noodle incident</a>. While we are here, this <a href="http://www.thenoodleincident.com/tutorials/typography/incremental_differences.html">link</a> should also be worth a read.</p>
