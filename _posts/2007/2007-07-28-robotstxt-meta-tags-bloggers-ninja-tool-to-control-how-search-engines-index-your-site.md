---
layout: post
title: Robots.txt, meta tags; Blogger's Ninja Tool to control how search engines index
  your site
date: 2007-07-28 14:07:05.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags: []
meta:
  dsq_thread_id: '135616559'
  _edit_last: '67'
  bitly_short_url: http://j.mp/k7WYH9
  retweet_cache: '1309545120:0'
  trx_addons_post_views_count: '53'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2007/robotstxt-meta-tags-bloggers-ninja-tool-to-control-how-search-engines-index-your-site/"
excerpt: How does Google know what parts of a website the site owner wants to have
  show up in search results? Can publishers specify that some parts of the site should
  be private and non-searchable? The good news is that those who publish on the web
  have a lot of control over which pages should appear in search results - through
  robots.txt and meta tags.
---
<p><img src="/static/2007/07/robots.jpg" alt="Robots" class="alignright" /></p>
<p>I've been doing some bit of my own research on how to weed out non-usable contents and show just the good contents to search engines. I began to use robots.txt sometime back but they are limited to just disallow of some folders (like my wordpress installation folder - "wp"). The other day, I was reading the <a href="http://googleblog.blogspot.com/2007/07/robots-exclusion-protocol-now-with-even.html">Robots Exclusion Protocol</a> (REP) on Google's own Blog, and learnt a lot that was missing from my understanding of how you can take control of Search Engines indexing your site's content.</p>
<p><strong>Meta Tags</strong></p>
<p><a href="http://www.google.com/">Google</a> have recently introduced a new META tag that will allow us to set when we want the page to be removed from the main Google Web Search results. For instance, if you want to remove a particular page after end of this year, then add the following Meta tag to your page (the date format is <a href="http://www.ietf.org/rfc/rfc0850.txt">RFC 850</a>);</p>
<p><code>META NAME="GOOGLEBOT" CONTENT="unavailable_after: 31-Dec-2007 24:00:00 GMT</code></p>
<p>However, the REP Meta tags works only for  HTML Pages. Nonetheless, Google gave us an option to control access to other documents - Adobe PDF Files, Video and Audio file and many other types. This thus extends the same flexibility for specifying per-URL tags to all other file type. You've to simply add any supported Meta tag to a new X-Robots-Tag directive in the HTTP Header used to serve the file.</p>
<p><em>Here are some examples;</em></p>
<p>&rarr; Don't display a cache link or snippet for this item in the Google search results<br />
<code>X-Robots-Tag: noarchive, nosnippet</code></p>
<p>&rarr; Don't include this document in the Google search results<br />
<code>X-Robots-Tag: noindex</code></p>
<p>&rarr; Tell us that a document will be unavailable after 31st Dec 2007, 12:00 pm GMT<br />
<code>X-Robots-Tag: unavailable_after: 31 Dec 2007 24:00:00 GMT</code></p>
<p>You can combine multiple directives in the same document.</p>
<p>&rarr; Do not show a cached link for this document, and remove it from the index after 31st Dec 2007, 12:00 pm GMT<br />
<code>X-Robots-Tag: noarchive</code><br />
<code>X-Robots-Tag: unavailable_after: 31 Dec 2007 24:00:00 GMT</code></p>
<p><strong>Robots.txt</strong></p>
<p>Robots.txt allows you to control how search engines access your web site. It allows us to control access at multiple levels -- the entire site, through individual directories, pages of a specific type, down to individual pages.</p>
<p><strong>Googlebot specific robots.txt</strong></p>
<p>Google Robots, unlike other bots, allow the use of wildcards - <strong>*</strong> - to match a sequence of characters. This way, we can do complex Allow and Disallow directive to the Googlebots.</p>
<p>To block all wordpress files from being crawled by Googlebots, we can have</p>
<p><code><br />
User-Agent: Googlebot<br />
Disallow: /wp-*.php<br />
</code></p>
<p>It can be even in the form of a folder patten - here, a pattern of myimages_xyz can be blocked (where xyz represents your numbers folders or something similar)</p>
<p><code><br />
User-Agent: Googlebot<br />
Disallow: /myimages_*/<br />
Disallow: /porn/*.jpg (see, I can block google from looking at my porn images ;-) )<br />
</code></p>
<p>The Googlebot also has an allow tag to allow your files, folders to be crawled by it. This is particularly useful when used in combination with the Wildcard pattern matching scheme to create more complex robots.txt. Here, let's block a sub-folder on a site but allow some specific folders or files within that sub-folder. Let's assume that we have installed Wordpress inside a folder called "wp" at the root of the website. So, let's block the wp folder but allow the /wp/wp-content/uploads/ to be crawled.</p>
<p><code><br />
User-Agent: Googlebot<br />
Disallow: /wp/<br />
Allow: /wp/wp-content/uploads/<br />
</code></p>
<p>You can do a even more complex Disallow/Allow pattern matching. Let say, if "?" indicates a session ID, we might like to exclude all URLs that contain them to avoid duplicate pages for the Googlebot. However, URLs that ends with a "?" may be the page that we want to include. In this scenario, we can block any URL that includes a "?" but not the one that specifically ends in "?"</p>
<p><code><br />
User-Agent: Googlebot<br />
Allow: /*?$<br />
Disallow: /*?<br />
</code></p>
<p>A combination and permutation of robots.txt and Meta Tags can help you fine-grain control over your site's content. Together, robots.txt and META tags give you the flexibility to express complex access policies.</p>
<p><strong>REFERENCES</strong></p>
<p>* <a href="http://googleblog.blogspot.com/2007/01/controlling-how-search-engines-access.html">Controlling how search engines access and index your website</a><br />
* <a href="http://googleblog.blogspot.com/2007/02/robots-exclusion-protocol.html">The Robots Exclusion Protocol</a><br />
* <a href="http://googleblog.blogspot.com/2007/07/robots-exclusion-protocol-now-with-even.html">Robots Exclusion Protocol: now with even more flexibility</a><br />
* <a href="http://www.robotstxt.org/wc/exclusion-admin.html">Web Server Administrator's Guide to the Robots Exclusion Protocol</a><br />
* Robotstxt.org on <a href="http://www.robotstxt.org/wc/exclusion.html">Robots Exclusion</a></p>
<p>[poll=26]</p>
