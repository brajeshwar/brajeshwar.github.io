---
layout: post
title: ActionScript Garbage Collection, a Best Practice
date: 2005-07-22 20:23:45.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135835328'
  bitly_short_url: http://j.mp/mPkLbZ
  retweet_cache: '1309574994:0'
  trx_addons_post_views_count: '47'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/actionscript-garbage-collection-a-best-practice/"
---
<p>At the end of last month, I posted an article about "Cleansing your ActionScript codes (Cleansing your ActionScript codes)":http://www.brajeshwar.com/archives/2005/06/cleansing-your-actionscript-codes/; somewhere there seem I can still add a few more to it. I got few mails regarding the same, on my site log I even found people searching for @externalRef@ and also on "MXNA (MXNA)":http://weblogs.macromedia.com/. Read below and I hope the reference to @externalRef@ might also get cleared.</p>
<p>A discussion surfaced out of that article and I hope other people may benefit from the same. *Components* that @extends@ *MovieClip*, which are loaded and unloaded by the user, there have been issues and if we need to clean this up, do some kinda manual garbage collection!</p>
<p>So, can't we just do it with an @onUnload@ event?</p>
<p>Well, @onUnload@ is fired After the movieclip has been removed. So it is better to remove external references before they are deleted. For instance if your movieclip(myMC) is subscribed to a component(myButton) that is outside it with @addEventListener@, then myButton would have a reference to myMC. So before destroying myMC it would be better to delete the reference myMC in myButton by using @removeEventListener@.</p>
<p>Similarly if you have an external reference to other outside objects in your class you need to remove them before you delete your movieclip.</p>
<p>For movieclips we can wrap all this into one dispose method that removes itself after deleting external references. So,</p>
<p>bc[as]. myMC.dispose ();<br />
myMC.removeMovieClip ();<br />
//<br />
//would be shortened to<br />
myMC.dispose ();</p>
<p>where myMC.dispose would also remove itself at the end.</p>
