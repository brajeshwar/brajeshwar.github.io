---
layout: post
title: Fedora 15 with GNOME 3 & some cool upgrades!
date: 2011-04-30 08:24:26.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Open Source
tags:
- Fedora
- GNOME
- Launch
- New Features
- Open Source
- Tools &amp; Apps
meta:
  _edit_last: '67'
  dsq_thread_id: '291786352'
  bitly_short_url: http://j.mp/iMcddm
  retweet_cache: '1309583719:8'
  trx_addons_post_views_count: '57'
author:
  login: Deeptaman
  email: d.mukherjee05@gmail.com
  display_name: Deeptaman Mukherjee
  first_name: Deeptaman
  last_name: Mukherjee
permalink: "/2011/fedora-15-with-gnome-3-some-cool-upgrades/"
---
<p>The next version of <a href="http://fedoraproject.org/wiki/Releases/15/FeatureList">Fedora</a>, Version 15 is available for download as a beta version. The beta version was released and a reworked boot loading system will be featured by this OS. The <a href="http://fedoraproject.org/wiki/Releases/15/FeatureList">major changes for the Linux distribution</a> are hopefully taken care of and the complete release is scheduled for May 2011; it is to be noted that this period of release is approximately a month after the release of Ubuntu 11.04. New releases of Fedora can usually be expected about once every six months.</p>
<p><!--more--></p>
<p><a href="http://fedoraproject.org/"><img src="{{ site.baseurl }}/assets/2011/04/fedora.jpg" alt="Fedora 15" class="alignright" /></a></p>
<p>This version of Fedora uses a radically updated GNOME (<a href="http://www.gnome3.org/">GNOME 3</a>) which is significantly different from the GNOME 2 desktop. According to <a href="http://fedoraproject.org/wiki/User:Jsmith">Jared Smith</a>, the Fedora project leader, this next generation GNOME has a different way of organizing things up. He also adds that since some things will be essentially different in the GNOME due to the significant changes, people have to get used to it. </p>
<p>Programs and services can be automatically started when the computer is booted up just like the previous versions, but in an advanced manner with a new initialization and session manager. So far, Fedora uses <em>SysVinit</em> and Upstart for this service, but the new version will use <em>systemd</em> and this is faster and more sophisticated compared to those. <em>Systemd</em> uses the advantages of multiple core technologies to load programs and services parallel while the system boots up. It also staggers the startup of some programs until required. For instance the Web server will not be started until the first request comes, says Smith.</p>
<p>There is a potentially appealing feature that is introduced for system administrators called consistent network device naming where they can use BIOS-provided names. These names for ports are consistent and not arbitrary thus eliminating confusions. This will be very useful for cases when servers have multiple Ethernet connections, as it happens normally. </p>
<p><a href="http://www.gnome3.org/"><img src="{{ site.baseurl }}/assets/2011/04/gnome-3.png" alt="GNOME 3" class="alignright" /></a></p>
<p>One of the interesting features includes dynamic Firewall management, where we can make changes to the Firewall and make them work without having to reboot the system. Time saving!</p>
<p>Other features that will be included in this version are:</p>
<p>* <a href="http://www.libreoffice.org/">Libre Office</a>: This is one of the old Open Office based office suite which was once forgotten, but very much alive now.<br />
* <a href="http://boxgrinder.org/">Box Grinder</a>: A virtual appliance utility; an easy to use command line tool that facilitates the creation of appliances or virtual images from simple plain text application files.<br />
* <a href="http://en.wikipedia.org/wiki/Robotics_suite">Robotics Suite</a>: Tools for people who are enthusiastic about robotics. It provides a robotic simulation environment.<br />
* <strong>Sugar</strong>: A desktop environment which is specialized for K12 education from <a href="http://sugarlabs.org">Sugarlabs</a>. According to Fedora project this includes an enhanced activity set to provide a stable demo environment for Sugar as well as environment for developers.<br />
* <a href="http://pino-app.appspot.com/">Pino Twitter</a>: In Ubuntu it is Gwibber by default.<br />
* <a href="http://projects.gnome.org/rhythmbox/">Rhythmbox</a>: an integrated music management application based on the powerful Gstreamer media framework.<br />
* <a href="http://live.gnome.org/Cheese">Cheese</a>: a photobooth-inspired GNOME application used for taking pictures and videos from a webcam. It can also be used for applying fancy graphical effects.<br />
* <a href="http://projects.gnome.org/evolution/">Evolution</a>: the GNOME mailer, calendar, contact manager and communications tool.</p>
