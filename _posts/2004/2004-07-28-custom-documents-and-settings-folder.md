---
layout: post
title: Custom ---Documents and Settings--- Folder
date: 2004-07-28 11:47:58.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '139878577'
  bitly_short_url: http://j.mp/lY6KOs
  retweet_cache: '1309546841:0'
  trx_addons_post_views_count: '43'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/custom-documents-and-settings-folder/"
---
<p>I use Windows XP Professional on my Thinkpad and Windows 2000 Professional on my Desktop, so this article applies to the two but I think the underlying idea should be similar in most Windows Box. Personally, I always have a nasty habit of loosing settings just because I format my main system drive (usually C drive) often. This does not affect my data storage as I have every of my datas on a different drive and once all system installations are over, I am ready to work straight away. But what will happen to some of my settings/datas that are akin to application programs? Without going too deep into the explanation, let us just solve this issue by diverting your user or rather "Documents and Settings" and its associated folder from the System drive to your desired location.<br />
Navigate to<br />
HKEY_LOCAL_MACHINE (Shared all users)<br />
HKEY_CURRENT_USER (Current User)<br />
\SOFTWARE<br />
\Microsoft<br />
\Windows<br />
\CurrentVersion<br />
\Explorer<br />
\User Shell Folders<br />
and change the values there.<br />
<!--more--><br />
This is now pretty useful for me as I can have my global Actionscript Include files and Flash MX base classes without worrying if they will be lost when I format my drive next time. It is advised not to play with the registry and to <strong>create back-ups</strong> before doing anything, I suggest you do the same. There was another entry before just for <a href="http://www.brajeshwar.com/archives/2003/09/damn-i-have-to-share-this-tip/" title="custom favorites folder">favorites</a>.</p>
<p>(I am sorry that this post is likely to appear twice on aggregators because I change the title as I thought I had textile plug-in installed but it was on my <a href="http://www.brajeshwar.com/archives/2004/07/movable-type-on-localhost/" title="Movable Type on Localhost">local movable type</a> installation and not online.)</p>
