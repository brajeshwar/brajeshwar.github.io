---
layout: post
title: DD-WRT, VPN and Apple Airport Routers
date: 2016-11-24 17:02:08.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Airport Extreme
- apple
- Apple Router
- DD-WRT
- Routers
- VPN
meta:
  _edit_last: '67'
  _yoast_wpseo_focuskw_text_input: DD-WRT, VPN, Apple Airport Routers
  _yoast_wpseo_focuskw: DD-WRT, VPN, Apple Airport Routers
  _yoast_wpseo_linkdex: '61'
  amazonS3_cache: a:11:{s:84:"http://media.brajeshwar.com/wp-content/uploads/2016/11/24093146/airport-wireless.jpg";i:6878;s:92:"http://media.brajeshwar.com/wp-content/uploads/2016/11/24093146/airport-wireless-753x600.jpg";i:6878;s:78:"http://brajeshwar.wpengine.com/wp-content/uploads/2016/11/airport-wireless.jpg";i:6878;s:86:"http://brajeshwar.wpengine.com/wp-content/uploads/2016/11/airport-wireless-753x600.jpg";i:6878;s:46:"https://billing.cactusvpn.com/aff.php?aff=1738";a:1:{s:9:"timestamp";i:1492150102;}s:86:"http://media.brajeshwar.com/wp-content/uploads/2016/11/24121027/oinam-home-network.png";i:6879;s:80:"http://brajeshwar.wpengine.com/wp-content/uploads/2016/11/oinam-home-network.png";i:6879;s:94:"http://media.brajeshwar.com/wp-content/uploads/2016/11/24121027/oinam-home-network-546x600.png";i:6879;s:88:"http://brajeshwar.wpengine.com/wp-content/uploads/2016/11/oinam-home-network-546x600.png";i:6879;s:85:"https://media.brajeshwar.com/wp-content/uploads/2016/11/24093146/airport-wireless.jpg";i:6878;s:87:"https://media.brajeshwar.com/wp-content/uploads/2016/11/24121027/oinam-home-network.png";i:6879;}
  _yoast_wpseo_primary_category: '3'
  _yoast_wpseo_content_score: '30'
  _yoast_wpseo_metadesc: How can you get DD-WRT and VPN working with Apple Airport
    Routers.
  dsq_thread_id: '5328344306'
  classic-editor-remember: classic-editor
  trx_addons_post_views_count: '958'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2016/dd-wrt-vpn-apple-airport-routers/"
---
<p>Apple's Airport <a href="http://www.apple.com/airport-extreme/">Extreme</a> and <a href="http://www.apple.com/airport-express/">Express</a> are brilliant at what they do. They are secure, yet easy to set up and maintain. Well, you do not need to maintain them - they tend to just keep working. It makes it super easy for an Apple product eco-system to co-exist without much hassle and fuss.</p>
<p><img src="/static/2016/11/airport-wireless.jpg" alt="Airport Wireless" width="1280" height="1020" class="aligncenter size-full wp-image-6878" /></p>
<p>After many Linksys and D-Link Wi-Fi Routers, I started with the first generation Airpot Express and upgraded to the first <a href="http://www.apple.com/airport-time-capsule/">Airport Time Capsule</a> when it was released in 2008. The time capsule (Airport Extreme with Time Machine enabled Drive) lasted for 5 years and the Airport Express, a little over 6 years. Our current Home Network Setup is powered by an Airport Extreme and few Airport Expresses.</p>
<p>However, the apple routers are limited in their functionality. I wanted a VPN sitting in between the Internet and my home network without disturbing my original setup. I also wanted to have the option to turn the VPN OFF/ON quickly as and when I needed. I researched for a bit and settled on a cheap flashable wi-fi router - <a href="https://www.amazon.com/Asus-RT-N18U-Mbps-Power-Router/dp/B00KPWLXYU">Asus RT-N18U</a>. I flashed the Asus router with <a href="http://www.dd-wrt.com/">DD-WRT</a>.</p>
<p>There are other Open Source Router firmwares which are equally good. I chose DD-WRT, as I find it easier, and have used it earlier. Some other alternatives you might want to try are - <a href="http://www.polarcloud.com/tomato">Tomato</a>, <a href="https://openwrt.org/">OpenWRT</a>, <a href="http://www.gargoyle-router.com/">Gargoyle</a>, etc.</p>
<p>I'm not very technical but I can understand technology, and knows a thing or two about how things work. So, I chose simpler setups and things that just work. My current setup works for now.</p>
<h2>DD-WRT</h2>
<blockquote><p>DD-WRT is a Linux based alternative OpenSource firmware suitable for a great variety of WLAN routers and embedded systems. The main emphasis lies on providing the easiest possible handling while at the same time supporting a great number of functionalities within the framework of the respective hardware platform used.</p></blockquote>
<p>Flashing a router and installation of DD-WRT is pretty straight forward. The most important part is to choose the right firmware for the router, making sure that the <a href="http://www.dd-wrt.com/site/support/router-database">router is supported by DD-WRT</a>. Following the instructions on the <a href="http://www.dd-wrt.com/wiki/index.php/Installation">installation</a> should be good enough.</p>
<p>Once all installed and running, here are few basic setting <a href="http://dfarq.homeip.net/recommended-dd-wrt-settings/">recommendations</a> suggested by industry experts.</p>
<ul>
<li>Change the default network from something like 192.168.1.1 to 192.168.xx.xx of your choice.</li>
<li>Broadcast the SSID but secure it with WPA2 with AES. If you're not worried about backward compatibility, you can disable TKIP.</li>
<li>Of course, change your Admin password from the default to something better.</li>
<li>Always have a backup of your settings. It tends to be useful.</li>
</ul>
<h2>Services - VPN, NAS, the bells and whistles</h2>
<p>The features and functionalities of DD-WRT are humongous. Pick the ones you want to use and you can ignore the others to their default/disabled state. If you have signed up for a VPN, which are much needed these days than ever, read-up on their OpenVPN (better than the other protocols so far) documentation for DD-WRT and set it up.</p>
<p>I really liked the simplicity of <a href="http://www.expressrefer.com/refer-a-friend/30-days-free/?referrer_id=9163756&amp;utm_campaign=referrals&amp;utm_medium=copy_link&amp;utm_source=referral_dashboard">ExpressVPN</a>, and it just worked for me. If you are shopping for one, most of the VPN Providers have a trial period - from 2 days to a week, or even sometimes a month. A 2-day trial should be enough for you to make a choice. I once got a good deal on <a href="https://billing.cactusvpn.com/aff.php?aff=1738">CactusVPN</a> and I subscribe to their <a href="https://billing.cactusvpn.com/aff.php?aff=1738">VPN + SmartDNS</a>.</p>
<p>Try out other good VPN providers - <a href="https://www.goldenfrog.com/vyprvpn">VyprRVPN</a>, <a href="http://nordvpn.com/?ref=144199368">NordVPN</a>, <a href="https://www.ipvanish.com/">IPVanish</a>, <a href="https://buffered.com/">Buffered</a>, <a href="https://www.anonymizer.com/">Anonymizer</a>, <a href="https://www.privateinternetaccess.com/">Private Internet Access</a>, <a href="https://torguard.net/">Tor Guard</a>, <a href="https://www.slickvpn.com/">Slick VPN</a>, <a href="https://mullvad.net/">MullVad</a>, <a href="https://www.blackvpn.com/">Black VPN</a>, <a href="https://www.smartvpn.com/">Smart VPN</a>, <a href="https://privatevpn.com/">Private VPN</a>, etc. Have a look at <a href="https://thatoneprivacysite.net/">That One Privacy Site</a> to do a thorough research that fits your requirements. More VPN reviews can be found on <a href="https://thebestvpn.com/">TheBestVPN</a>.</p>
<h2>DD-WRT Router + Apple Airport</h2>
<p>Finally, I combined the two worlds - the DD-WRT Router facing the Internet and the Apple Airport Extreme managing the Home Network.</p>
<p><strong>Internet</strong></p>
<p>Setup the DD-WRT Router to face the internet - set up your PPPoE, tethering or the IP that your Internet Service Provider gave you. Enable DHCP so that the DD-WRT router can act as the DHCP Server. You can set up additional options such as the firewall, ad-blocker, access restrictions, etc. Make sure the Internet and everything else is working here perfectly. Leave the Wi-Fi enabled and working to get back to it, just in case, your primary Apple Router fails or just to debug/edit settings to the DD-WRT router. This also decouples the harsh Internet from your home network.</p>
<p><strong>Apple Airport Router</strong></p>
<p>This is your primary network where all your devices are connected. As the Internet is now taken care by the DD-WRT router, we have to just plug in the Airport Router's LAN to the LAN network of the DD-WRT Router.</p>
<p>Play around with the Airport Router settings of your choices. However, here are a few key important setups that the Apple Airport Router needs to make it work in this setup;</p>
<ol>
<li>In the <strong>Internet</strong> tab, connect using DHCP so it gets its unique IP from the DD-WRT Router. You can change the DNS server either here or in the DD-WRT router. I kept it at the DD-WRT Router.</li>
<li>Now, <strong>Create a wireless network</strong> with the settings of your choice.</li>
<li>For the most important part, turn the <strong>Router Mode Off (Bridge Mode)</strong>. We're not routing anything with the Apple Airport but merely managing the Wireless Internet Network.</li>
</ol>
<p>Of course, with Apple rumored to be <a href="https://www.bloomberg.com/news/articles/2016-11-21/apple-said-to-abandon-development-of-wireless-routers-ivs0ssec">abandoning the router business</a>, in future, you can just plug off the Apple Router part and move to your DD-WRT router as the primary network manager.</p>
<p><img src="/static/2016/11/oinam-home-network.png" alt="Oinam Home Network" width="1226" height="1348" class="alignnone size-full wp-image-6879" /></p>
<p>That's it. You can now have the flexibility, security of a DD-WRT Router and Wireless Network managed by an Apple Router to easily and consistently connect all your devices. All your devices, from phones to laptops to the connected TV, can connect to the Internet encapsulated via a VPN. I'm still experimenting and will continue to play with my setup. The current setup has been running for a year or so, without any issues.</p>
