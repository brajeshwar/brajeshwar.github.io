---
layout: post
title: Amazon CloudFront, an Awesome CDN
date: 2008-11-19 14:59:18.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Reviews
- Technology
tags:
- Amazon
- AWS
- cdn
- CloudFront
- S3
meta:
  _edit_last: '1'
  dsq_thread_id: '135617165'
  bitly_short_url: http://j.mp/lpyCLQ
  retweet_cache: '1309577583:0'
  trx_addons_post_views_count: '51'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/amazon-cloudfront-awesome-cdn/"
excerpt: Amazon CloudFront delivers your content using a global network of edge locations.
  Requests for your objects are automatically routed to the nearest edge location,
  so content is delivered with the best possible performance.
---
<div class="figure"><img src="{{ site.baseurl }}/assets/2008/11/cloud.jpg" alt="The Cloud" />
<p class="credit"><abbr class="type" title="Photograph">Photo</abbr> by <cite><a href="http://flickr.com/photos/liebermann/491036447/">Zeitspuren</a></cite></p>
<p class="caption"><em class="title">The Cloud</em>Be prepared to move with the clouds.</p>
</div>
<p><!--more--></p>
<p>Amazon announced <a href="http://aws.amazon.com/cloudfront/">CloudFront</a> just about a day back and <a href="http://ocricket.com/">we were</a> extremely excited that we would be able to serve files faster to our users.</p>
<p>I won't detail about Amazon CloudFront as their blog have done a good job on that -- <a href="http://aws.typepad.com/aws/2008/11/distribute-your-content-with-amazon-cloudfront.html">Distribute Your Content With Amazon CloudFront</a>.</p>
<p>What our team did was some simple test to see the speed and response time for our new Amazon CloudFront CDN-ed content.</p>
<p><strong>The Test and the Result (INDIA)</strong></p>
<p>First, we created a distribution for our AWS S3 bucket and put a file in the bucket. We then download the file from the CloudFront</p>
<p><code>$ wget http://mydist.cloudfront.net/wallpaper.jpg</code></p>
<p>We got an average speed of 60 KBps! :-)</p>
<p>Next, we tried downloading the same file directly from our S3 bucket</p>
<p><code>$ wget http://mybucket.s3.amazonaws.com/wallpaper.jpg</code></p>
<p>Then, we saw that we got an average speed of 10 KBps :-(</p>
<p>So, we decided to figure out which CloudFront server were we redirected to from India. We did a simple @dig@ on our CloudFront URL</p>
<p><code>$ dig mydist.cloudfront.net</code></p>
<p>And look for yourself --</p>
<pre name="code" class="JScript">
;; QUESTION SECTION:
;mydist.cloudfront.net.	IN	A

;; ANSWER SECTION:
mydist.cloudfront.net. 60 IN	A	216.137.55.211
mydist.cloudfront.net. 60 IN	A	216.137.55.216
mydist.cloudfront.net. 60 IN	A	216.137.55.213
mydist.cloudfront.net. 60 IN	A	216.137.55.108
mydist.cloudfront.net. 60 IN	A	216.137.55.100
mydist.cloudfront.net. 60 IN	A	216.137.55.233
mydist.cloudfront.net. 60 IN	A	216.137.55.201
mydist.cloudfront.net. 60 IN	A	216.137.55.35
</pre>
<p>Hmm. Let's find out where the servers are really located ;)</p>
<p><code>$ traceroute 216.137.55.211</code></p>
<p>Be ready to be surprised.</p>
<pre name="code" class="JScript">
1  192.168.0.254 (192.168.0.254)  1.538 ms  1.911 ms  2.421 ms
2  * * *
3  dsl-mum-erx-238.127.144.59.airtelbroadband.in (59.144.127.238)  39.002 ms  40.846 ms  41.552 ms
4  125.18.13.137 (125.18.13.137)  44.072 ms  44.514 ms  44.787 ms
5  125.21.167.25 (125.21.167.25)  77.995 ms  80.059 ms  80.509 ms
6  p4-2-0-0.r01.sngpsi02.sg.bb.gin.ntt.net (129.250.12.225)  110.669 ms 94.407 ms  94.981 ms
7  ge-0-0-0.r00.sngpsi02.sg.bb.gin.ntt.net (129.250.4.33)  103.501 ms 103.697 ms  104.116 ms
8  * p1-1-1-3.r02.newthk01.hk.bb.gin.ntt.net (129.250.4.129)  136.561 ms 138.106 ms
9  ae-4.r20.newthk01.hk.bb.gin.ntt.net (129.250.2.246)  138.550 ms 139.714 ms  140.381 ms
10  po-2.a05.newthk01.hk.ra.gin.ntt.net (203.131.240.174)  144.352 ms 145.710 ms  146.653 ms
11  203.131.243.162 (203.131.243.162)  150.713 ms  151.553 ms  153.725 ms
12  216.137.55.211 (216.137.55.211)  156.607 ms  128.642 ms  129.524 ms
</pre>
<p>Neat, from <strong>India to Hong Kong</strong> in 12 hops :-)</p>
<p><strong>The Test and the Result (US)</strong></p>
<p>Cool. We then decided to see how better is it for people in the United States by using a server located physically in the US.</p>
<p><code>$ dig mydist.cloudfront.net</code></p>
<pre name="code" class="JScript">
;; ANSWER SECTION:
mydist.cloudfront.net. 60 IN	A	216.137.39.110
mydist.cloudfront.net. 60 IN	A	216.137.39.157
mydist.cloudfront.net. 60 IN	A	216.137.39.171
mydist.cloudfront.net. 60 IN	A	216.137.39.46
mydist.cloudfront.net. 60 IN	A	216.137.39.224
mydist.cloudfront.net. 60 IN	A	216.137.39.65
mydist.cloudfront.net. 60 IN	A	216.137.39.77
mydist.cloudfront.net. 60 IN	A	216.137.39.225
</pre>
<p><code>$  traceroute 216.137.39.110</code></p>
<pre name="code" class="JScript">
1  209-20-80-2.slicehost.net (209.20.80.2)  0.000 ms  0.000 ms  0.000 ms
2  209.20.79.225 (209.20.79.225)  0.000 ms  0.000 ms  0.000 ms
3  ge-6-13-115.car1.StLouis1.Level3.net (4.79.132.225)  0.000 ms 0.000 ms 0.000 ms
4  ae-11-11.car2.StLouis1.Level3.net (4.69.132.186)  0.000 ms  4.001 ms 0.000 ms
5  AMAZONCOM.car2.StLouis1.Level3.net (4.53.162.66)  0.000 ms  0.000 ms 0.000 ms
6  216.137.39.110 (216.137.39.110)  0.000 ms  0.000 ms  0.000 ms
</pre>
<p>Wow! Only 6 hops :-)</p>
<p>So, as you can see CloudFront really works as a good Content Delivery Network and is extremely affordable, no entry cost at all. Check out their <a href="http://aws.typepad.com/">blog</a>.</p>
