---
layout: post
title: XML Best Practices
date: 2004-11-12 08:32:14.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '181426447'
  bitly_short_url: http://j.mp/jax6LX
  retweet_cache: '1309548675:0'
  trx_addons_post_views_count: '45'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/xml-best-practices/"
---
<p><a href="http://davidbau.com/" title="David Bau">David Bau</a> have a quick, crisp write-up on <a href="http://davidbau.com/archives/2003/11/10/xml_best_practices.html" title="XML Best Practices">XML Best Practices</a>.<br />
<!--more--><br />
<em>An excerpt</em>:<br />
<strong>How to Recognize Good XML Technique</strong><br />
It is not hard to recognize when good XML techniques are being used in a development effort. Here are the two things that you see:</p>
<p># More than one person is reading the same XML in a vanilla editor. When you see this, it probably means that your next new programmer will also be able to understand your critical data too.<br />
# More than one program is reading the same XML using different parsing code. When you see this, it probably means that your next legacy system can be made to understand your precious data too.</p>
<p>On the other hand, it is also easy to recognize XML misuse:</p>
<p># Nobody knows how to read the raw XML. If it scares programmers to think about using a plain text editor to look at your XML, it probably means that your XML was made purely for computer consumption. It is probably not doing much better than a bytestream would.<br />
# Only one program can read the XML. If nobody seems to be capable of writing a another parser for your XML format, then it has become just yet another opaque data format for you. Why even use XML?</p>
