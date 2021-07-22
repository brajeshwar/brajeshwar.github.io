---
layout: post
title: Multiple Sitemaps on a single Domain
date: 2008-02-28 05:30:11.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- google
- Robots.txt
- Search Engines
- Sitemap
- Webmaster
meta:
  _edit_last: '1'
  dsq_thread_id: '135616744'
  bitly_short_url: http://j.mp/iSDRe6
  retweet_cache: '1309559160:0'
  trx_addons_post_views_count: '74'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/maintain-multiple-sitemaps-on-a-single-domain/"
excerpt: Google makes it easier for webmasters to place Sitemaps for multiple hosts
  on a single host and then letting them know by including the location of these Sitemaps
  in the appropriate robots.txt.
---
<p>Do you have more than one website, or rather lots of them? You can now reduce one hassle of the many that goes in maintaining lots of websites, blogs -- the ability to place Sitemaps for multiple hosts on a single host through robots.txt.</p>
<p>We know how to include <a href="http://www.brajeshwar.com/2007/just-add-to-your-robotstxt-no-need-to-submit-sitemap-to-google/">auto-discovery of Sitemaps</a> using robots.txt. Google have <a href="http://googlewebmastercentral.blogspot.com/2008/02/cross-submissions-via-robotstxt-on.html">announced</a> a new way for Sitemap cross-submissions using Google Webmaster Tools, making it possible to submit Sitemaps for multiple hosts on a single dedicated host.</p>

<p><strong>HOW TO DO IT</strong></p>
<p>For instance, if I want to submit and maintain Sitemaps for each of my blogs --</p>
<p>* <a href="http://www.brajeshwar.com/">www.brajeshwar.com</a><br />
* <a href="http://www.odetoapple.com/">www.odetoapple.com</a> and<br />
* <a href="http://blog.oinam.com/">blog.oinam.com</a></p>
<p>and to make things easier, I want to host all the Sitemaps on <a href="http://www.brajeshwar.com/">brajeshwar.com</a>.</p>
<p>I can make the best out of cross-submission support by telling the search engines (Google, Yahoo!, Microsoft) where the Sitemaps are with robots.txt --</p>
<p># The robots.txt for brajeshwar.com would include: @Sitemap: http://www.brajeshwar.com/sitemap-www-brajeshwar.xml@<br />
# Similarly, the robots.txt for odetoapple.com would include: @Sitemap: http://www.brajeshwar.com/sitemap-www-odetoapple.xml@<br />
# And for the third one, the robots.txt for blog.oinam.com would include: @Sitemap: http://www.brajeshwar.com/sitemap-blog-oinam.xml@</p>
<p></p>
<p><em>Here are a few other useful notes about the implementation (from Microsoft)</em></p>
<p>* robots.txt can have multiple "Sitemap:" references.<br />
* Limit the size of robots.txt file to less than 1 MB.<br />
* If multiple sitemaps for a domain include the same URL with conflicting metadata (i.e. priority, change frequency, etc), the metadata will be disregarded and just the URL will be considered.<br />
* Individual sitemap files should never be larger than 10 MB when uncompressed. This includes all sitemap file formats: XML, RSS and Text.</p>
<p><strong>References</strong></p>
<p>* Yahoo! -- Making Sitemaps Easier to Manage and Scale<br />
* Microsoft -- <a href="http://blogs.msdn.com/webmaster/archive/2008/02/27/microsoft-to-support-cross-domain-sitemaps.aspx">Microsoft to Support Cross-Domain Sitemaps</a></p>
<p><em>Note:</em> For Wordpress powered blogs, this may be nothing to worry about as there are good plugins that maintains the Sitemaps auto-magically for you.</p>
