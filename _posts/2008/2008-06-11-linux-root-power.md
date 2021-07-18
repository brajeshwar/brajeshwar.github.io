---
layout: post
title: The power of 'root' in Linux
date: 2008-06-11 05:16:07.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- command line
- Linux
- root
- sudo
- ubuntu
meta:
  _edit_last: '67'
  dsq_thread_id: '135616934'
  bitly_short_url: http://j.mp/kaXetU
  retweet_cache: '1309585245:0'
  trx_addons_post_views_count: '183'
author:
  login: Praval
  email: catchme@praval.com
  display_name: Praval Singh
  first_name: Praval
  last_name: Singh
permalink: "/2008/linux-root-power/"
excerpt: "'Root' is the default name for system administrator in a *NIX system --
  a super user who can do anything and everything within the operating system."
---
<p>After our previous recitation -- <a href="http://www.brajeshwar.com/2008/filesystem-file-organization-in-linux/">Filesystem and File Organization in Linux</a> -- we hope the picture of the complete Linux file system would be resident in your minds. We are now equipped enough to try our hands on the beautiful operating system - Linux. But before we take you to the next stage, a very old saying boggled my mind - <em>look before you leap</em>!</p>
<p><img src="/static/2008/06/linux-root-power.png" alt="The power of root in Linux" class="alignright" /></p>
<p>Let us go a little deep about the access privileges and rights which a root user has on a Linux system. <strong>Root</strong> is the default name for system administrator in a *NIX system - a super user who can do anything and everything within the operating system. As a result, root login should be used with special care. While working with a root login, we can end up doing a lot of harm to our system as well as the data, accidentally.</p>
<p><strong>Need for the root account</strong></p>
<p>Root login is required to perform actions which change the settings for all system-wide users or to modify the users' accounts. We shall also have to use the root account for certain system operations.</p>
<p>Like,</p>
<p>* To add new users to the system and administer the user data.<br />
* To install system-wide software.<br />
* To configure I/O devices like - a scanner or a TV tuner card, for example.<br />
* To configure system services like - a web or FTP server.</p>
<p><strong>Is root really dangerous ? Why?</strong></p>
<p>Yes, the main reason being security. One of the important rules of Linux operating system states that <em>root</em> account shall be used only in case when we are unable to perform an operation as a normal user. If you are logged in as a <em>root</em>, your system is much more vulnerable to the external attacks. For example, your favorite web browser may probably have a security loophole and if you happen to use it from the <em>root</em> account, you expose the whole operating system the world! If you work on the same web browser using an unprivileged account, it could only affect your personal configuration and data (if it is unencrypted). Here lies the difference.</p>
<p><strong>How to use the root account safely and efficiently?</strong></p>
<p>Ideally, one should avoid logging on to the root account via the GUI. Working continuously as <em>root</em> isn't recommended for the reasons cited above. It is advisable to switch to the super user using the <em>sudo</em> command before another command (That's with reference to Ubuntu Linux. This may vary from distro to distro.) This gives a temporary <em>root</em> access to the current user to run a single command, without having the need to actually log on as <em>root</em>. Using <em>sudo</em> command is said to be a little more secure than logging directly as root. Several distros enable <em>sudo</em> for the first user by default and disabling the direct <em>root</em> login via the GUI. <a href="http://polishlinux.org/linux/ubuntu/">Ubuntu</a> is a prime example of this very approach.</p>
<p>This was all about the super user access privileges which we needed to know before we start to install applications and try them on our Linux installation. In our next article, we shall emphasize on how easy, fast and interesting it is to install a software application on a Linux distro. We'll dig into all the possible ways of installing a software on Linux - the command line way to the modern GUI way!</p>
<p>(Image: <a href="http://xkcd.com/149/">XKCD</a>)</p>
