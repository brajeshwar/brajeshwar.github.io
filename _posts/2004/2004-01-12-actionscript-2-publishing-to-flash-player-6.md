---
layout: post
title: Actionscript 2 publishing to Flash player 6
date: 2004-01-12 20:19:26.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- ActionScript
- flash
- Flash Player
meta:
  adman_disable: 'on'
  dsq_thread_id: '135614616'
  bitly_short_url: http://j.mp/ivnLWZ
  retweet_cache: '1309544985:0'
  trx_addons_post_views_count: '46'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/actionscript-2-publishing-to-flash-player-6/"
---
<p>First, let me thank Mike Chambers, Peter Hall and Darshan for their help in getting me along on this topic. I will update this further in future when more things are discovered doing something along the way. You can also read something in the similar line at <a href="http://www.jessewarden.com/" title="jesse warden">Jesse Warden</a>'s blog entry <a href="http://www.jessewarden.com/archives/000396.html" title="shared libraries only work within same version swf">"Shared Libraries only work within same version SWF</a>"</p>
<p>Actionscript 2 can be published to all versions of Flash Player 6. The main differences in AS2/FP6 and AS2/FP7 are</p>
<p>1. In FP6, when class A extends B, the constructor for B will get executed in a "dummy" fashion. This is because</p>
<p><code>A.prototype = new B();</code></p>
<p>is emitted to set up the inheritance chain. This behavior was fixed in FP7 by adding the sactionExtends bytecode, which the compiler now takes advantage of when publishing to FP7.</p>
<p>2. In FP6, casting between strong types will not fail and return null if the types are unrelated.</p>
<p><code>var a:ClassA;<br />
var b:ClassB;<br />
a = ClassA(b);</code></p>
<p>In FP7, if the classes are unrelated, you will properly get null. This is because the sactionCastOp bytecode is not supported in FP6.</p>
<p>3. In FP6, casting between interfaces doesn't work properly. This is because the sactionImplements bytecode is not supported in FP6.</p>
<p>Everything will also be case-insensitive in FP6, so you have to watch out for that too. Also, if you publish as vanilla FP6, it will be significantly slower than FP6 r65 or FP7. All of the V2 UI components were published to FP6 r65. And someone suggested me never to do casting if you are publishing to F6.</p>
