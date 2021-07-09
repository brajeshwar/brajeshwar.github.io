---
layout: post
title: SWX - A new data exchange format for Flash
date: 2007-04-07 01:17:31.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '142924993'
  bitly_short_url: http://j.mp/iuI71M
  retweet_cache: '1309552123:0'
  trx_addons_post_views_count: '31'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2007/swx-a-new-data-exchange-format-for-flash/"
excerpt: 'SWX (known as Tangent during its beta) stands for SWF Data Exchange Format.
  It''s a new way of working with data in Flash that uses simple SWF files to exchange
  data. SWX is the natural, native way to get data into Flash: You @loadMovie();@
  your data!'
---
<p><a href="http://swxformat.org/">SWX</a> is designed to provide Flash developers with a simple and enjoyable experience when building data-driven applications. The key words here are simple, enjoyable and experience. SWX is compatible with Flash 6 r65+ to Flash 8 (ActionScript 1 and ActionScript 2). On the server-side, it has been tested and works well with PHP 5. At the time of its alpha release, SWX does not support ActionScript 3 and Flash 9.</p>
<p>At the core of SWX is a SWF assembler (SwfCompiler.php) that creates SWX SWF files from PHP data structures. (Currently, only PHP is supported) and a SWX gateway (swx.php) that acts as a front controller for data requests. On the client side, SWX serializes any data to be sent to the back-end using the native object notation for the back-end. Currently, there is support for PHP with PHON (PHP Object Notation).<br />
<!--more--><br />
PHON is a new data format. It stands for PHP Object Notation. It is based on JSON (JavaScript Object Notation) by Douglas Crockford. Basically, it is a native PHP data structure. PHON is a very limited subset of PHP.</p>
<p>Read more about <a href="http://swxformat.org/">SWF Data Exchange Format</a>.</p>
