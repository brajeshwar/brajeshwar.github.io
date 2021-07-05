---
layout: post
title: Why won't index files deployed on Cloudfront work like it does in S3?
date: 2013-06-20 08:00:40.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags: []
meta:
  _yoast_wpseo_linkdex: '83'
  _edit_last: '67'
  _yoast_wpseo_focuskw: Cloudfront
  _yoast_wpseo_title: Why won't index files deployed on Cloudfront work like it does
    in S3?
  dsq_thread_id: '1410254094'
  _clicky_goal: a:2:{s:2:"id";N;s:5:"value";N;}
  amazonS3_cache: a:6:{s:71:"http://brajeshwar.wpengine.com/wp-content/uploads/s3-static-hosting.png";i:6711;s:68:"http://media.brajeshwar.com/wp-content/uploads/s3-static-hosting.png";i:6711;s:74:"http://brajeshwar.wpengine.com/wp-content/uploads/cloudfront-s3-origin.png";i:6710;s:71:"http://media.brajeshwar.com/wp-content/uploads/cloudfront-s3-origin.png";i:6710;s:69:"https://media.brajeshwar.com/wp-content/uploads/s3-static-hosting.png";i:6711;s:72:"https://media.brajeshwar.com/wp-content/uploads/cloudfront-s3-origin.png";i:6710;}
  trx_addons_post_views_count: '137'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2013/why-wont-index-files-deployed-on-cloudfront-work-like-it-does-in-s3/"
---
<p>I seriously had no clue about this. It was one the most irritating thing while deploying static site hosting on Amazon Cloudfront. I had in-fact stayed with S3 for sites that had folders with "index.html". Here is the solution for those who haven't figured out yet.</p>
<p>I was recently deploying a Jekyll powered static site for LxiDD - <a href="//pitch.lxidd.com/">pitch.lxidd.com</a>. During the test phase, it all worked fine being deployed on the S3. When I decided that it's ok to move to Cloudfront -- except for the root index, anything else inside a folder won't display without appending the "index.html" at the end.</p>
<p><!--more--></p>
<p><em>This does not work.</em><br />
<code>http://pitch.lxidd.com/solution/</code></p>
<p><em>But with the index.html, it does</em><br />
<code>http://pitch.lxidd.com/solution/index.html</code></p>
<h2>Solution</h2>
<p>By default, when you deploy a Cloudfront Distribution, it will point to the location of the S3 Origin - <code>pitch.lxidd.com.s3.amazonaws.com</code>. Instead of that origin, your Cloudfront Distribution should have points its origin to S3 Endpoint which looks something like - <code>pitch.lxidd.com.s3-website-us-east-1.amazonaws.com</code></p>
<h2>Steps</h2>
<p><strong>1. Look at the "Properties" of the S3 Bucket and copy that link.</strong></p>
<p><img src="{{ site.baseurl }}/assets/2013/06/s3-static-hosting.png" alt="s3-static-hosting" class="alignnone size-full wp-image-6711" /></p>
<p><strong>2. Now Add/Edit your Cloudfront Distribution Origin to that link.</strong></p>
<p><img src="{{ site.baseurl }}/assets/2013/06/cloudfront-s3-origin.png" alt="cloudfront-s3-origin" class="alignnone size-full wp-image-6710" /></p>
<p>I hope that works for you.</p>
