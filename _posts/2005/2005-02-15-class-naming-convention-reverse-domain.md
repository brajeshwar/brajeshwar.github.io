---
layout: post
title: Class naming convention, Reverse domain
date: 2005-02-15 13:39:45.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Class
- Convention
- Domain
meta:
  _edit_last: '1'
  adman_disable: 'on'
  dsq_thread_id: '136133095'
  bitly_short_url: http://j.mp/iVDvkj
  retweet_cache: '1309540895:0'
  trx_addons_post_views_count: '58'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/class-naming-convention-reverse-domain/"
excerpt: The reverse domain naming convention  is very unique. This becomes more prominent
  if we are to distribute our codes, work within a team of developers.
---
<p>Well, there are still questions that we consider understood and took no further discussion. Today, a friend asked me why most people use the reverse domain name for class package naming convention; @com.oinam.util.MyClass@.</p>
<p>Well, it is because of the fact that this naming convention is very unique. This becomes more prominent if we are to distribute our codes, work within a team of developers.</p>
<p>Following the defined convention, the prefix of our packages should always be written in all lowercase plain ASCII letters (well, we still don't have a domain names with $, # or * yet), and they should be of the top-level domain names viz: com, edu, gov, mil, net, org (you are also allowed to use one of the English two-letter codes identifying countries as specified in ISO Standard 3166, 1981).</p>
<p><!--more--></p>
<p>The other part of the package name is usually the project name or a company's division, department, machine, login names or commonly used packages like "util", "arcade".</p>
<p>Thus, a typical class, say "MyClass" with the class definition "com.oinam.util.MyClass" would have been in the folder "util" which is inside "oinam" which resides on the top folder "com". Structurily, @com > oinam > util > MyClass.as@</p>
