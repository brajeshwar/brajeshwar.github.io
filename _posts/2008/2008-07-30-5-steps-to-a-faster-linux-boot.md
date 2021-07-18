---
layout: post
title: 5 steps to a faster Linux boot
date: 2008-07-30 01:00:22.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
tags:
- boot
- GNOME
- GUI
- KDE
- Kernel
- Linux
- window manager
- Xfce
meta:
  _edit_last: '1'
  dsq_thread_id: '135617059'
  bitly_short_url: http://j.mp/k9I7AC
  retweet_cache: '1309538137:0'
  trx_addons_post_views_count: '65'
author:
  login: Praval
  email: catchme@praval.com
  display_name: Praval Singh
  first_name: Praval
  last_name: Singh
permalink: "/2008/5-steps-to-a-faster-linux-boot/"
excerpt: You don't need to have a wireless kernel module loaded if you're on Ethernet
  LAN. This task is complex and will require a kernel recompilation, which unfortunately
  is not the easiest task to accomplish.
---
<div class="figure"><img src="/static/2008/07/linux-boot-time.jpg" alt="Efficient Boot Time in Linux" />
<p class="credit"><abbr class="type" title="Photograph">Photo</abbr> by <cite><a href="http://www.flickr.com/photos/udo/241045585/">Udo Herzog</a></cite></p>
<p class="caption"><em class="title">Boot Times</em>Did you forget that on Linux?</p>
</div>

<p>We've seen and heard that Linux seldom faces a system halt or crash. Most of the people who have switched to Linux stay happy with the fact that they need not press the 3-button command to get the task manager every now and then, on their old machines. Linux has no doubt proved to be a blessing in disguise for machines which have limited hardware options and are low on resources.</p>
<p>This might indicate that a lot of geeks keep their boxes turned on for days(may be months in some cases!) However, for a normal use Linux machine, a daily boot would be pretty obvious. </p>
<p>We have seen a lot of tips and tricks to make Windows boot faster than before. Such recommendations have been popular and remarkably acknowledged across the world wide web. On similar grounds, we shall today try and figure out a few ways in which an average user can help reduce the boot time of a Linux box.</p>
<p># <strong>Use a lightweight window manager:</strong> <a href="http://www.kde.org/">KDE</a> and <a href="http://www.gnome.org/">GNOME</a> are no doubt the two most widely used window managers. But this, by no means shall mean that they're the only option you have. <a href="http://xwinman.org/">Check out</a> for a lot of options you have at your disposal. Based on your requirements, you may switch to a lighter window manager or desktop to help you get most out of the available hardware juice by drastically reducing the graphical boot time and memory consumption.<br />
# <strong>De-select the unnecessary services:</strong> There are a lot of services running on the back ground, which you would be unaware of. A lot of them, you'd never need! If you're using Linux just as a desktop, you would not need httpd, sendmail, etc. If you never use a bluetooth device, make sure you turn off the bluetooth service at startup. If you happen to use Linux just as a Web server, you can close a lot of services which a web server doesn't need. You can see all the services and their roles at the Administration panel within the menu and take a look at the Services. Just disable all of the services you do not want to start automatically.<br />
# <strong>Use a text based login in lieu of Graphical login window:</strong> Most of us love the graphical login window on Linux. However, for machines which are low on resource, there is an alternative - Text based login. The graphical login increases load times. Most of Linux machines boot to <a href="http://www.linfo.org/runlevel_def.html">run level</a> 3 instead of run level 5. This will probably halt at the text-based login, where you'll just have to log in and issue <code>startx</code> to start the desktop of your choice.<br />
# <strong>Use a lightweight Linux distro:</strong> Before deciding on the Linux distro, you need to check out the juice your hardware has. Instead of installing the bulky Fedora, you may opt for Arch, Ubuntu or Puppy Linux. The boot times for Arch and Puppy Linux are amazingly small. Amongst larger distributions, OpenSuSE has one of the fastest boot times.<br />
# <strong>Disable unnecessary kernel modules - Only for Geeks and Administrators!</strong> This one is for the people who love things out-of-the-box! The Linux kernel consists of a lot of modules, each associated with an operation of a task or group of inter-related tasks. For example - You don't need to have a wireless kernel module loaded if you're running over an Ethernet LAN. This task is complex and will require a kernel recompilation, which unfortunately is not the easiest task to accomplish. To go along with this, you will need the kernel source, which can be downloaded from the distro's website. Thereafter, you need to follow the standard steps for compiling a kernel, with a difference that you shall go through and disable all the modules you don't need.<br />
At this point, you may take help of <a href="http://www.bootchart.org/">Bootchart</a>. It lets you find out which kernel modules are currently installed and are running on your system. Apart from this, it illustrates for you what is happening during your system boot!</p>
<p>These were a few methods which would help you run Linux better and faster than before. These recommendations are made keeping an eye on the Linux users who do not cherish today's fast and hardware rich machines! Stay tuned for more action.</p>
