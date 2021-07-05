---
layout: post
title: Alert Component, handling event in a better way
date: 2003-11-08 19:43:28.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- ActionScript
- Alert
- Component
- flash
meta:
  _edit_last: '1'
  adman_disable: 'on'
  dsq_thread_id: '135614542'
  bitly_short_url: http://j.mp/lNNVH3
  retweet_cache: '1309581946:0'
  trx_addons_post_views_count: '39'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/alert-component-handling-event-in-a-better-way/"
---
<p>Something around the mid September, there was a post on using <a href="http://www.brajeshwar.com/2003/alert-component-in-flash-mx-2004/" title="Alert Component">Alert Component</a> for <a href="http://www.macromedia.com/software/flash/" title="macromedia flash mx 2004 professional">Flash MX 2004 Pro</a>.</p>
<p><!--more--></p>
<p>There had been a project (classified as of now) here where Alert Component was commissioned to be used for all Alerts (that is what they are for). Then couple of issues arose, of which, I am not sure if people have already known that, solved through a better way or have better ways of handling the issue. Like the examples in the doc and like the one in the recent post for the Alert component, a need arises to do something similar but from nested classes. If the function reference are specified like a normal callback, the scope in which the function is called becomes undefined. The need was to pass the handler object and the string callback function, so that callback is in the correct scope.</p>
<p>Well, according to the example in the docs the clickHandler is a function reference. But if you pass a function reference as a argument, the scope with which the function is called is not going to be what you need. To get around to this, a listener object which had a click method was used, instead of the function reference and it worked; found the tip in the Using Component Events tree. Now, should we say that the docs are wrong on this. You have to pass a listener object that is either handling the event the DOM way or listen to the event the new dispatcher way.</p>
<pre name="code" class="as">
this.confirmListener = {
 click:function (evt) {
  trace (evt.detail);
 };
};

var Alert = mx.controls.Alert;
Alert.okLabel = "Synchronize Now";
Alert.cancelLabel = "Add New";
Alert.yesLabel = "Close";
Alert.buttonWidth = 100;

Alert.show (
 "Message",
 "Confirmation",
 Alert.OK | Alert.CANCEL | Alert.YES,
 this,
 this.confirmListener,
 "",
 Alert.OK
);
</pre>
