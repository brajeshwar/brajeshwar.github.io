---
layout: post
title: Dynamic CSS and DataURI to the rescue
date: 2010-07-27 08:37:36.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- CSS
- DataURI
- Javascript
- Python
meta:
  _edit_last: '67'
  _wp_old_slug: ''
  dsq_thread_id: '135617419'
  bitly_short_url: http://j.mp/mlXmZd
  retweet_cache: '1309576370:12'
  trx_addons_post_views_count: '78'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2010/dynamic-css-and-datauri-to-the-rescue/"
excerpt: DataURI is a URI scheme that provides a way to include data in-line in web
  pages as if they were external resources. Data URIs are sometimes called Uniform
  Resource Locators, although they do not actually locate anything remote.
---
<div class="figure"><a href="http://paisa.com/"><img src="/static/2010/07/paisa-com.png" alt="Paisa" /></a>
<p class="caption"><em class="title">Paisa</em> Consumer Finance Redefined.</p>
</div>
<p>Source Files available at Github - <a href="http://github.com/Brajeshwar/datauri-dynamic-css">DataURI and Dynamic CSS</a> (<a href="http://github.com/Brajeshwar/datauri-dynamic-css/archives/master">Download</a>)</p>
<p><strong>How it all started?</strong></p>
<p>We at <a href="http://paisa.com/">Paisa</a> are developing a financial Web Application, trying to make it easier for users to invest their money. We, in fact, have a rather nifty way of allowing users to browse through Stocks without the overhead complexity of trying to calculate the figures and stats.</p>
<p><strong>The Situation</strong></p>
<p>We wanted to have an identifying logo for each and every company. Well, that is about 3000+ companies. The logos themselves are small - 24 x 24 pixels each.</p>
<p><strong>The Problem</strong></p>
<p>The size of each logo is rather negligible. So, that's not the problem. The problem is the number of HTTP calls we'll have to do fetch these logos. Atop that, we've no clue what the user will pull and push the filter criteria to view her results. So, we have a problem of displaying 3000+ images and we've no clue when and where they'll appear.</p>
<p><strong>The Solution (Not)</strong></p>
<p>Initially, I was thinking of doing a rather complex matrix of Image Sprites by combining them in pre-defined groups based on -- BSE-100, BSE-200, Alphabetical, etc. However, this introduces useless image downloads (bigger size now due to the combined sprite) and not really that re-usable at multiple places. So, CSS-Image-Sprite was NOT the solution.</p>
<p><strong>The Better Solution</strong></p>
<p>One fine evening, an article popped up on <a href="http://news.ycombinator.com/">HackerNews</a> -- <a href="http://www.nczonline.net/blog/2010/07/06/data-uris-make-css-sprites-obsolete/">Data URIs make CSS sprites obsolete</a>. Then, I knew this is something I can pursue to accomplish what we wanted.</p>
<p>In our situation, as each and every company is accompanied by their BSE Code, we inserted that in a class "bse_xxxxxx" (via Python in our case). We do have a default class, "stock_logo" that keeps a default logo ready just in case we don't have the logo of the company or is being changed or it simply does not exist. This default class also defines how the logo will be displayed, what will be the padding style etc. The class "bse_xxxxxx" is used only to insert the actual logo as a background-image.</p>
<p>Next, Javascript picks up the IDs of the actual logos to be displayed (in our example, from the special attribute `imgID`) and then constructs a link to a handler which generates a CSS file with Data-URIs embedded in it so that we can download all the required images with a single HTTP call and insert them seamlessly into an HTML file.</p>
<p><strong>Example:</strong></p>
<p>Say the markup is like this -</p>
<p><code>
<li class="img img_500" imgid="500">Foo</li>
<p></code><br />
<code>
<li class="img img_600" imgid="600">Bar</li>
<p></code></p>
<p>The JS code extracts the "imgID" from the li and constructs a query like the one below and inserts it into the DOM inside a link tag -</p>
<p><code>stylesheets/logos.css?i=500|600</code></p>
<p>Then, the special handler generates a CSS file by reading the actual images and base64 encoding them. The CSS file is loaded into the DOM and the new images show up instantly.</p>
<p><strong>Use Cases</strong></p>
<p>The use cases look rather rare and might not be something you can use out of the box. However, we hope this will help someone who needs something similar and hope that this will inspire them in solving their own problem. We've use <a href="http://www.python.org/">Python</a> for our codes but this can be done in any Server Side Programming Language. We used <a href="http://code.google.com/closure/">Closure JS Framework</a> with our Javascript but <a href="http://jquery.com/">jQuery</a>, a more common framework, was used in this example.</p>
<p><strong>Thanks</strong></p>
<p>Special thanks to @<a href="http://twitter.com/ghoseb">BGhose</a> who stitched all the solutions together in a deployable and usable form. I had to write only a few Stylesheet sample codes for just few companies to show them how it can be done and @<a href="http://twitter.com/prajwalit">Prajwalit</a> easily threw in some Javascript magic and <a href="http://sidhantgodiwala.wordpress.com/">Sidhant</a> completed the Server Side code. Now, we're just throwing in the logos in our bucket without caring for anything else except to name them against the BSE Codes for the companies. It will just continue to work like a charm.</p>
<p><strong>Browser Support and the obvious Internet Explorer</strong></p>
<p>The <a href="http://www.nczonline.net/blog/2010/07/06/data-uris-make-css-sprites-obsolete/">article</a> by Nicholas refers to his <a href="http://github.com/nzakas/cssembed">CSSEmbed</a> solution which uses <a href="http://en.wikipedia.org/wiki/MHTML">MHTML</a> mode to make IE6 and IE7 compatible stylesheets that use internal images similar to data URIs. So, you can use a conditional HTML comment to import IE specific styles.</p>
<p>This is our first cut to the solution, we'll always be on the look-out to improve the solution (think Caching). If you've questions, or just want to say something, feel free to comment.</p>
<p>Source Files available at Github - <a href="http://github.com/Brajeshwar/datauri-dynamic-css">DataURI and Dynamic CSS</a> (<a href="http://github.com/Brajeshwar/datauri-dynamic-css/archives/master">Download</a>)</p>
