---
layout: post
title: Tiny Link - a Wordpress plugin to create a TinyURL for your articles
date: 2007-08-18 03:14:20.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- link
- plugin
- short
- tiny
- tinyurl
- url
- wordpress
meta:
  _edit_last: '1'
  _wp_old_slug: tiny-link-a-wordpress-plugin-to-create-a-tinyurl-for-your-articles
  adman_disable: 'on'
  dsq_thread_id: '135616619'
  bitly_short_url: http://j.mp/iNgKnJ
  retweet_cache: '1309570985:0'
  trx_addons_post_views_count: '298'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2007/tiny-link-wordpress-plugin/"
excerpt: Tiny Link is a Wordpress plugin that creates an alternate TinyURL link to
  your article or post permalink. This will be useful while sending hyperlinks in
  emails, typing on mobile devices, et al.
---
<p>I was in search of a way to automagically get an alternate short link for the lengthy URL of my articles. I tried a plugin but somehow went kaput and never worked for me. I decided to write one for myself and came up with a very simple solution. - <strong>Tiny Link</strong>.</p>
<p>Well, <a href="http://wordpress.org/extend/plugins/tiny-link/">Tiny Link</a> is a Wordpress plugin that creates an alternate <a href="http://tinyurl.com/">TinyURL</a> link to your article or post permalink.</p>

<p>I hope this will be useful while sending hyperlinks in emails to avoid the word-wrap for lengthy article URLs. This should also be useful (as far as I can guess) to mobile device users so they will can type a shorter url to read an article.</p>
<p><strong>TINY LINK</strong></p>
<p>* Visit & Download <a href="http://wordpress.org/extend/plugins/tiny-link/">Tiny Link</a> from Wordpress.</p>
<p><strong>USAGE</strong></p>
<p>The most straight forward usage would be to add this simple script</p>
<pre name="code" class="php">
<?php TinyLink() ?>
</pre>
<p>to one of your template - "single.php".</p>
<p>However, a slightly advanced usage will be, to first check if the plugin is installed, if yes, then execute this module. We can even give a direct link to it, so users can copy the link by right-clicking (Mac: Ctrl + Click) the hyperlink.</p>
<pre name="code" class="php">
<?php if (function_exists('TinyLink')) { ?>
Tiny alternate link for this article: 
<a href="<?php TinyLink() ?>" title="TinyURL link to - <?php the_title(); ?>"><?php TinyLink() ?></a>
<?php } ?>
</pre>
<p>Feel free to give me your feedbacks, errors encountered, bugs founds, <em>et al</em>. If you wish to take it further, you're most welcome to join the project.</p>
