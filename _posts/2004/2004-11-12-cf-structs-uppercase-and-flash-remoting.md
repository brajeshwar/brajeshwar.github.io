---
layout: post
title: CF Structs, uppercase and Flash Remoting
date: 2004-11-12 06:41:09.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135615022'
  bitly_short_url: http://j.mp/lKGOoW
  retweet_cache: '1309548706:0'
  trx_addons_post_views_count: '44'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/cf-structs-uppercase-and-flash-remoting/"
---
<p>Today, I saw a post from Jesse on <a href="http://www.jessewarden.com/archives/2004/11/case_sensitivit.html" title="Case Sensitivity in Unexpected Place: XML Object">Case Sensitivity in Unexpected Place: XML Object</a>. This reminded me of a small issue that we faced while on some projects where we have used ColdFusion for Flash Remoting. This might  be helpful for some people out there;</p>
<p>ColdFusion seem to have an issue when dealing with flash remoting, wherein, the names of properties in any structs returned by the remote methods, get converted to uppercase.<br />
<!--more--><br />
Eg:</p>
<p>bc. // code in a cf function<br />
<cfset obj="StructNew()" /><br />
<cfset obj.value="foo" /><br />
<cfreturn obj /></p>
<p>On the flash side this would yield an object,</p>
<p>@{VALUE:"foo"};@</p>
<p>instead of</p>
<p>@{value:"foo"};@</p>
<p>With nested structs this could become, </p>
<p>oResult.DATA.SOMESTATUS,<br />
oResult.DATA.EMAILCHECK, etc.</p>
<p>The workaround to this problem is to use the array access operator in any ColdFusion structs you intend to return to flash. So, the above ColdFusion code needs to be written as,</p>
<p>bc. <cfset obj="StructNew()" /><br />
<cfset obj ["value"]="foo" /><br />
<cfreturn obj /></p>
