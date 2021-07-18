---
layout: post
title: Tune your site for Windows SP 2
date: 2004-08-14 22:39:23.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  _edit_last: '1'
  dsq_thread_id: '135614918'
  bitly_short_url: http://j.mp/liMRcZ
  retweet_cache: '1309549405:0'
  trx_addons_post_views_count: '44'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/tune-your-site-for-windows-sp-2/"
---
<p>I just upgraded to Service Pack 2 on my Windows XP Professional Box and when logged in back after a successful installation, suddenly the Flash Interface I was working on is no longer displayed. IE 6.0 told me that it had blocked the content (Active X) "to help protect your security, Internet Explorer has restricted this file from showing active content that could access your computer. Click here for options..."</p>

<p>Prepare yourself, read more about <a href="http://www.macromedia.com/devnet/logged_in/wanbar_sp2.html" title="Upcoming Changes in Microsoft Windows XP Service Pack 2">Upcoming Changes in Microsoft Windows XP Service Pack 2</a>. View the recorded <a href="http://macromedia.breezecentral.com/p53473670/" title="Microsoft Windows XP SP 2 effect on Macromedia Flash Player">Breeze Presentation</a> while it last. </p>
<p>Some of the must read articles on Microsoft are:</p>
<p>* <a href="http://www.microsoft.com/technet/prodtechnol/winxppro/maintain/sp2chngs.mspx" title="Changes to Functionality in Service Pack 2">Changes to Functionality in Service Pack 2</a><br />
* <a href="http://support.microsoft.com/default.aspx?pr=windowsxpsp2" title="Service Pack 2 Support Center">Service Pack 2 Support Center</a><br />
* <a href="http://msdn.microsoft.com/security/productinfo/xpsp2/default.aspx?pull=/library/en-us/dnwxp/html/xpsp2web.asp" title="Fine Tune Your Website for Service Pack 2">Fine Tune Your Website for Service Pack 2</a></p>
<p>[<strong>Update</strong>: Thanks to JD for his comment about the issue, here is the relevant link.<br />
The trick is to add &lt;!-- saved from url=(0017)http://localhost/ --&gt; on the second line of your html. Here, (0017) is the string length (http://localhost/) of your URL that follows it.]</p>
