---
layout: post
title: Adobe Feeds Aggregator
date: 2008-05-06 06:29:30.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags:
- Adobe
- Aggregator
- Christian Cantrell
- ColdFusion
- Feeeds
- Macromedia
- Mike Chambers
- MXNA
- RSS
meta:
  _edit_last: '1'
  adman_disable: 'on'
  dsq_thread_id: '174106181'
  bitly_short_url: http://j.mp/jr3ngr
  retweet_cache: '1309568076:0'
  trx_addons_post_views_count: '59'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/adobe-feeds/"
excerpt: Thanks to Christian Cantrell, Mike Chambers, Ben Forta, Jonathan Wall, and
  the whole team for resurrecting MXNA as the new Adobe Feeds. Adobe Feeds have been
  upgraded from a single server architecture to a cached-load-balanced multi server
  architecture.
---
<p>MXNA's been a good resource site for Adobe Technology with articles being aggregated from many blogs. However, of late, there were lots of uproar from the community as MXNA wasn't able to withstand the traffic onslaught. It was plagued with regular downtimes and slow in serving the aggregated contents.</p>
<p>MXNA was started, during the times of <a href="http://fullasagoog.com/">Full as a Goog</a>, by Mike Chambers and Christian Cantrell as a simple aggregation site for Macromedia technology related blogs. My website was lucky to be one of those first few which MXNA aggregated during its early days. With the move to Adobe, MXNA grew tremendously, outgrew its infrastructure and it has been really seeking attention for an improvement.<br />
<br />
Well, thanks to Mike Chambers and the team, we can rejoice again as MXNA is now back on as <a href="http://feeds.adobe.com/">Adobe Feeds</a>.</p>
<p>Currently, <a href="http://feeds.adobe.com/">Adobe Feeds</a> runs on a new architecture;</p>
<p>* 1 - Load Balancer<br />
* 5 - Apache + CF8 Clustered<br />
* 1 - Database Server MYSQL<br />
* 1 - Feed Aggregation Server (reads all RSS and populates database)</p>
<p>The initial MXNA was powered by one single server running ColdFusion 6 and MySQL on Apache.</p>
