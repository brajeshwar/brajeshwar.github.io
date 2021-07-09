---
layout: post
title: ContextMenu, is that for 8Ball?
date: 2004-09-18 00:37:12.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  bitly_short_url: http://j.mp/lEzMLs
  retweet_cache: '1309567316:0'
  dsq_thread_id: '847157825'
  trx_addons_post_views_count: '46'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/contextmenu-is-that-for-8ball/"
---
<p><?php ImgBlog("macromediaflash/8ball.jpg", 0, "8Ball", "");?>The introduction of @ContextMenu@ and @ContextMenuItem@ in Flash player 7 was a good move from Macromedia. But, it is still in a very nascent stage and is not really that usable. Every since its early release of the Player, I had always felt that it can be put to good use but never got a project right enough to implement the same. When finally there was a real need for a real *Right Click Menu*, I am sorta stump as a proper implementation was not that possible!<br />
<!--more--><br />
Personally, I feel the current implementation of the @ContextMenu@ is a bit incomplete. The problem with the player's implementation is it only allows context menus to be added to movieclips that are on the root stage. You cannot have context menu's in nested movieclips.</p>
<p>In any medium sized application there will be atleast 3 tiers of @MovieClips@. Let us see the below hierarchy for an instance;</p>
<pre>
_level0
     mcFoo
         mcItem01
         mcItem02
     mcBar
         mcToolButton01
         mcToolButton02
</pre>
<p>and so on. Now we can attach right click menus on mcFoo, but not on mcItem01 where it is also really needed. Further there is a possibility that we need to have links rendered on a separate movieclip in mcFoo, etc.</p>
<p>This is either an oversight or a bug with the implementation of the @ContextMenu@ support in flash 7 player. With the current implementation it is not possible to have right click menu support in many Typical Applications at all.</p>
<p>I just wish this is fully and properly implemented in the next version of Flash, the much talk of the community, "*8Ball* (8Ball)":http://www.markme.com/mesh/archives/006055.cfm</p>
