---
layout: post
title: Damn! I have to share this tip
date: 2003-09-18 08:04:46.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135614503'
  bitly_short_url: http://j.mp/mPv8zk
  retweet_cache: '1309551203:0'
  trx_addons_post_views_count: '60'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/damn-i-have-to-share-this-tip/"
---
<p>The way I organize my files, folders and everything else on my desktop, including my laptop, is that I keep all data files and everything else on a different drive than the operating system / program files. This definitely helps me in doing a very easy, click-clack-click format of my primary installation drive and be up and running fast enough with every of my data intact and all setting in place in a considerable quick time. Actually, I have a whole drive just for the program installation and another separate drive for my data files (40 GB for the Programs/OS + 80 GB for the data drive, with my current desktop configuration).<br />
Before going further, let me add that I am on a windows box and this post is invalid for other operating system.<br />
"My Documents" can always be assigned a different location by just firing its properties > and giving a desired target location and so also for "Temporary Internt Files". In fact, I really do not like default of a program installation. I even have my Actionscript syntax file loaded everytime <a href="http://www.textpad.com/" target="_blank" title="Textpad.com">Textpad</a> starts from a different location. The only hiccup that I usually stumble upon is the "Favorites" of my bookmarks in Internet Explorer which I miss in some way or the other during a fresh installation. But today I just figured this out too and damn I am happpy to find this out, thus share the same with you.<br />
<span class="codeRed">Be warned : It is said that the Windows Registry is not to be played around and not intended for the weak heart, so back up your registry before you do that. I am not responsible for anything stupid you do.</span> <span class="codeBlue">But if you follow the steps, no need to worry, everything will be a breeze.</span><br />
Steps to changing the "Favorites" Folder location :<br />
[0] Start > Run and type "regedit"<br />
[1] Go down to "HKEY_CURRENT_USER\Software\Microsoft\Windows\Current Version\Explorer\User Shell Folders"<br />
[2] You will see many other customizable folder besides the "Favorites", now change the "Favorites" folder location by double clicking on the "Favorites" value name on the right pane.<br />
That is it, close the Registry and open a new IE window, you have your Favorites folder pointed to where you wanted. You may wish to create a folder called "Favorites" on another driver or location before doing the whole steps.</p>
