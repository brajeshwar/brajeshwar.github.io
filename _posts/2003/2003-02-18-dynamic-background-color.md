---
layout: post
title: Dynamic background color
date: 2003-02-18 17:20:29.000000000 +05:30
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
- Peter Hall
meta:
  _edit_last: '67'
  adman_disable: 'on'
  dsq_thread_id: '135614229'
  _syntaxhighlighter_encoded: '1'
  bitly_short_url: http://j.mp/mmdXfD
  retweet_cache: '1309579429:0'
  trx_addons_post_views_count: '51'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/dynamic-background-color/"
---
<p>Peter Hall posted a solution to setting the background color using Actionscript, actually drawing a rectangle on the background below any other elements on the document. Someone on the Macromedia Flash Forum re-iterated that question, so I thought some of you may still would like to have a look at a modified version.</p>
<p>This one will only fill the viewable stage and not the whole maximum allowable space of 5760 px of the Flash Document Scene.</p>
<pre class="prettyprint linenums">
//define a var for sh and sw
//let us add 2 px each as flash eats them
//in the Stage Object from the actual flash dimension
var sh = Stage.height + 4;
var sw = Stage.width + 4;
var rp = 0; //let us have a start point
trace("stage height = " + sh + "& stage width = " + sw + " in pixels");
setBG = function (col) {
 with (_level0) {
  clear();
  if (col != undefined) {
   beginFill(col);
   moveTo(rp, rp);
   lineTo(sw, rp);
   lineTo(sw, sh);
   lineTo(rp, sh);
   endFill();
  }
 }
 this.__bg__ = col;
};
//
getBG = function () {
 return this.__bg__;
};
//
Stage.addProperty("bgColor", getBG, setBG);
delete setBG;
delete getBG;

//Usage
Stage.bgColor = 0x0000ff;
</pre>
<p>That's it.</p>
