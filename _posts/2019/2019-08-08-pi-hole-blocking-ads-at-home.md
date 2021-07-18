---
layout: post
title: Pi-hole - Blocking Ads at Home
date: 2019-08-08 08:08:29.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Open Source
- Technology
tags:
- Pi-Hole
- Raspberry Pi
meta:
  classic-editor-remember: classic-editor
  _edit_last: '67'
  _thumbnail_id: '7054'
  trx_addons_post_views_count: '317'
  trx_addons_post_likes_count: '0'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2019/pi-hole-blocking-ads-at-home/"
---
<p><a href="https://pi-hole.net/">Pi-hole</a> is a DNS sinkhole that protects your devices from unwanted content, without installing any client-side software. The best part of Pi-hole is that it can work off cheap hardware such as a <a href="https://www.raspberrypi.org">Raspberry Pi</a>.</p>
<p>Last month, I bought a Raspberry Pi 3-MODB-1GB and a 16GB MicroSDHC (MicroSD) Memory Card. That was enough to run an Ad Blocker Service for the whole home.</p>
<p><img src="/static/2019/08/raspberry-pi-4.png" alt="Raspberry Pi-4" width="846" height="560" class="alignnone size-full wp-image-7055" /></p>
<h2>Raspberry Pi</h2>
<ol>
<li>First, we need to set up a <a href="https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up">Raspberry Pi</a> (official guide).</li>
<li>Get a microSD card with a capacity of at least 8 GB. I suggest getting a 16GB one for some extra room, just in case. The price difference isn't worth saving. Plug the microSD card to a desktop computer and follow the steps to <a href="https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/3">Setup the microSD card</a>  (official guide) and thus unzipping the Raspbian operating system content to the drive. Install the Raspbian operating system via NOOBS.</li>
<li>Plug in the microSD Card, monitor, keyboard, and a mouse. That's it. Power it up.</li>
<li>Follow the on-screen instructions to finish setting up the Raspbian operating system. Restart and the Raspberry Pi is ready to setup Pi-hole.</li>
</ol>
<p><img src="/static/2019/08/pi-hole-logo.png" alt="Pi-hole" width="512" height="512" class="alignnone size-full wp-image-7056" /></p>
<h2>Pi-Hole</h2>
<ol>
<li>There are three ways to install Pi-hole. Follow the one that works for you - <a href="https://github.com/pi-hole/pi-hole/#one-step-automated-install">Install Pi-Hole</a> (official guide).</li>
<li>Follow the on-screen instructions. You'll just be pressing the RETURN key a lot.</li>
<li>Pick your choices of options along the way. Do not forget to pause at the last screen and record the admin password and other details. </li>
<li>The final step is to point your <a href="https://www.lifewire.com/how-to-change-dns-servers-on-most-popular-routers-2617995">Internet Router's DNS</a> (just one, delete the others) to the Pi-hole IP (remember the screen from the earlier step).</li>
</ol>
<p><a href="https://pi-hole.net">Pi-hole</a> have a really nice web-enabled Admin dashboard which can be accessed inside your Network via <mark><a href="http://pi.hole/admin">http://pi.hole/admin</a></mark> or <mark>//[Raspberry Pi's IP address]/admin/</mark> or <mark><a href="http://raspberrypi.local/admin/">http://raspberrypi.local/admin/</a></mark>. </p>
<p><img src="/static/2019/08/Screenshot-2019-07-29-19.30.09.png" alt="Pi-Hole Dashboard" width="1001" height="623" class="alignnone size-full wp-image-7062" /></p>
<p>Pi-hole works pretty well without much fanfare that you might be left with a feeling that you're missing something. I've been running Pi-hole as the Ad-Blocker for my home and seems to be working good so far.</p>
<p>Go, have fun.</p>
