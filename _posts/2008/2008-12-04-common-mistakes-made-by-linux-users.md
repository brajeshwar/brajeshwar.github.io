---
layout: post
title: 10 common mistakes made by Linux users
date: 2008-12-04 06:22:22.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Open Source
tags:
- 10-mistakes
- Linux
- linux-mistakes
- mistakes
- root
- top-10
meta:
  _edit_last: '67'
  _wp_old_slug: 10-common-mistakes-made-by-linux-users
  dsq_thread_id: '135617192'
  bitly_short_url: http://j.mp/j2Omba
  retweet_cache: '1309526580:0'
  trx_addons_post_views_count: '159'
author:
  login: Praval
  email: catchme@praval.com
  display_name: Praval Singh
  first_name: Praval
  last_name: Singh
permalink: "/2008/common-mistakes-made-by-linux-users/"
excerpt: There are a few ubiquitous mistakes which a lot of Linux admins make while
  administering a Linux box. If kept in mind, these mistakes can be avoided to keep
  a smooth work flow.
---
<div class="figure"><img src="/static/2008/12/everyone-makes-mistakes.jpg" alt="Be human: Make mistakes. Learn from them." />
<p class="credit"><abbr class="type" title="Photograph">Photo</abbr> by <cite><a href="http://www.flickr.com/photos/gregbiche/324444264/">Greg Biche</a></cite></p>
<p class="caption"><em class="title">Be human</em>Make mistakes. Learn from them</p>
</div>
<p>Working on a Linux machine is a matter of proud and gravity for a lot of geeks. I could never know why! But there are a few ubiquitous mistakes which a lot of them make while administering a Linux box. If kept in mind, these mistakes can be avoided to keep a smooth work flow in a Linux environment.</p>
<p><strong>Out of many, I would like to enlist a few of them;</strong></p>
<p># <strong>Root User Log in:</strong> Always try to avoid logging in as a root user, because logging in from root gives you access to all permissions which has a couple of dilemmas. The first being a probable mistake via GUI can hamper the system extensively and the second being the running of X via a root which makes a PC more susceptible.<br />
# <strong>Avoiding updates:</strong> As a good administrator it is always expected on one's part to keep updating your system to make it a more secure one. This will make the system more resistant to attacks hence make it more stable.<br />
# <strong>Installing applications from different binary types:</strong> Installation of various files from .deb package and their dependencies from source, or vice-versa might not always work, because the dependencies are more complex in nature. So, it is advisable to install files from .deb package as many related applications become simple to upgrade from within the package management system.<br />
# <strong>A server boot to X:</strong> In order to make a few administrations tasks trouble-free, the server boot to X ultimately results in memory wastage and loss in CPU cycles. This also helps in restricting the access to your system and results in utmost privacy.<br />
# <strong>Low password strength:</strong> Passwords should always have the utmost security and their strength should be good. It is better to keep a password which is hard to memorize than keeping a password more prone to the hacking fraternity.<br />
# <strong>Misunderstanding the file permissions:</strong> The rwx method which stands for r=read, w=write, x=execute is used to handle permissions effectively. Proper permissions can help a system in many ways while improper permissions can lead to a system getting hacked. Therefore, an administrator must have good enough knowledge of the unique code of permissions.<br />
# <strong>Zero backup of critical configuration files:</strong> To avoid unnecessary problems, it is always better to have a backup of all important configuration files. Necessary backups include those of Samba, Apache, and MySQL.<br />
# <strong>Ignoring log files:</strong> /var/log is the default destination for all log files. Log files are used to locate all generic errors. The use of third party applications is also growing day by day and thus an application called logwatch has come into prominence which creates various reports for us to solve the discrepancies in /var/log files.<br />
# <strong>Neglecting the command line:</strong> It is actually a tough task to memorize all the commands and this is taken care of mostly by GUI. But at times, ignoring command lines which is faster, easier, more secure, and more reliable is a moronic decision on the user's part. A basic understanding of the working of command lines can help a user and lead to correct judgments.<br />
# <strong>Non-installation of a working kernel:</strong> A machine requires a kernel and its proper updating. An update of a current kernel, if it works well, is actually a better thing to do than deleting previous kernels. If an update is successful deleting previous kernels which acted as backup is advisable.</p>
<p>These were few of the top mistakes which a Linux administrator/user can avoid to help use the resources in a better and safer way.</p>
