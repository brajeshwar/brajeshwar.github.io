---
layout: post
title: Firestarter - A modern Linux Firewall
date: 2008-10-21 05:04:24.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags:
- dhcp
- filters
- firestarter
- firewall
- iptable
- Linux
- Security
- traceroute
- traffic
- ubuntu
meta:
  _edit_last: '67'
  dsq_thread_id: '135831153'
  bitly_short_url: http://j.mp/kwFwpe
  retweet_cache: '1309575452:0'
  trx_addons_post_views_count: '61'
author:
  login: Praval
  email: catchme@praval.com
  display_name: Praval Singh
  first_name: Praval
  last_name: Singh
permalink: "/2008/firestarter-a-modern-linux-firewall/"
excerpt: Irrespective of the operating system, intrusion is one of the key concerns
  for computers connected to a network. Firewalls, as a matter of fact provide a resistance
  to this, if not a fool proof protection.
---
<div class="figure"><img src="/static/2008/10/rj45.jpg" alt="Firewall" />
<p class="credit"><abbr class="type" title="Photograph">Photo</abbr> by <cite><a href="http://www.flickr.com/photos/negatyf/361668397/">UkaszSie</a></cite></p>
<p class="caption"><em class="title">Firewalls</em>You can never escape them!</p>
</div>

<p>The Firestarter Team says;</p>
<blockquote><p>Linux security does not have to be complex, and simplicity does not have to mean sacrificing power.</p></blockquote>
<p>Irrespective of the operating system, intrusion is one of the key concerns for computers connected to a network. Black hats and white hats have always had a tug-of-war over intrusion detection techniques. Firewalls, as a matter of fact provide a resistance to this, if not a fool proof protection. Firewalls may be a hardware device or a software program used to filter information coming from within or outside the outside network into your private network or your workstation. Firewall may not be the best and the sole way to be secured on a network, but does act like the first cover against most of the network based attacks. </p>
<p>While hunting out for a firewall application to safe guard my Linux installation, I came across a good firewall named <a href="http://www.fs-security.com/">Firestarter</a> for Linux. It has an intuitive graphical interface which allows you to configure the firewall in Linux using built in <em>IPtables</em>/<em>IPchains</em> utilities. </p>
<p><a href="http://www.fs-security.com/">Firestarter</a> is a powerful and user friendly firewall beneficial for both Linux desktop users and System Administrators. We shall check out the installation configuration of <strong>Firestarter</strong> on your Linux machine to help shield your data. </p>
<p>To do a terminal install, fire the run pop-up and type: <code>$sudo apt-get install firestarter</code></p>
<p>If things go fine, you'll have <strong>Firestarter</strong> installed in few keystrokes. You may do the same using any of the alternative ways to install an application, discussed previously in one of my articles. </p>
<p><strong>Setting up Firestarter</strong></p>
<p>Go to <em>System > Administrator > Firestarter</em> (for Ubuntu)</p>
<p>It will allow you to setup your initial configuration when you run the <strong>Firestarter</strong> for the very first time. Initial steps consist of detection of network devices and selection of one. You also get an option of enabling dial out for modem users and that for for IP address assigned via <a href="http://en.wikipedia.org/wiki/Dhcp">DHCP</a>. </p>
<p>Do check your routers' setting if you are using <em>DHCP</em> to assign local address. After checking all the options according to your need, click forward, you'll be asked for Internet connection sharing. Enable it if your system is on a network. Select the device type - hub/switch. Save your settings.</p>
<p>Get back to the main application window which consists of three tabs - <strong>Status</strong>, <strong>Events</strong> & <strong>Policy</strong>. The <strong>status</strong> indicator shows whether the <strong>Firestarter</strong> is active, disabled or locked. <strong>Event</strong> shows the list of attempted connections that it has blocked. The entries listed in red should be focused. You can visualize the rules for your firewall in the <strong>Policy</strong> window. It also allows you to create your own policies including options to enable or disable inbound/outbound traffic. These rules can be applied on hosts/ports. </p>
<p>There are primarily 3 inbound policy groups: </p>
<p># Allow connections from hosts- It will allow the traffic from the host which can be predefined by the user as a trusted source.<br />
# Allow service- It consist of two parameters - service and target. User can enter a name manually or <strong>Firestarter</strong> will try to determine the service name itself. The target maybe: Anyone, LAN clients, or a user specified IP, host/network.<br />
# Forward service- It is only active if the Internet Connection Sharing is enabled.</p>
<p>Permissive mode allows the user to specify rules that limit outbound connections. Restrictive mode permits you to specify which connections are allowed to have outbound communication.<br />
In order to experience some advanced features, you may go to <em>Preferences</em>. </p>
<p><strong>Firestarter</strong> doesn't really affect your work real-estate as you can minimize it to the system tray by exiting the application and it will notify you by turning its icon to red when a suspicious block alert is encountered. ICMP filtering provides a way to send simple messages containing information or errors.</p>
<p>Options like <em>Echo Request</em> and <em>Echo Reply</em> tells how your firewall handles pings. To block incoming pings, click on Echo reply. <em>Traceroute</em> prevents your machine from being traced via trace route. <em>Tos</em> filtering allows you to set priority on the use of network traffic.</p>
<p>Overall, <a href="http://www.fs-security.com/"><strong>Firestarter</strong></a> happens to be a great firewall for most users. Do check it out!</p>
