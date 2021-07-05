---
layout: post
title: You blog, then better ask your boss
date: 2003-10-29 07:08:07.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags: []
meta:
  dsq_thread_id: '135614524'
  bitly_short_url: http://j.mp/mSwkGs
  retweet_cache: '1309551422:0'
  trx_addons_post_views_count: '42'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/you-blog-then-better-ask-your-boss/"
---
<p>Do you blog? And are you employed? Be careful your boss may not like what you blog, this guy got fired (<a href="http://www.michaelhanscom.com/eclecticism/2003/10/of_blogging_and.html">read actual thread</a>) because he <a href="http://www.michaelhanscom.com/eclecticism/2003/10/even_microsoft_.html">wrote something</a> on his blog that his company do not like. Similarly, better be careful with your blog content and follow your web-host's rules and regulation. I got a warning of "Abuse-Copyright Infringement" because of some of the comments on this blog. I had to spend half a day reading all comments and deleting many of them. Right now, I am following the Tip No. 6 of of the seven quick steps to spam-free blog.<br />
<!--more--><br />
For the archive sack, here is the Step No. 6.<br />
<strong>Reasoning</strong> : One of the reasons that comment spam is such a pain is that it takes several clicks through MT's interface to get rid of a single post. If you could kill a spam easily as soon as it appeared, their effectiveness would be reduced dramatically, with the hopeful aim of deterring spammers entirely.<br />
<strong>The fix </strong>: This is another Perl insert, this time into the file lib/MT/App/Comments.pm (about line 150):</p>
<p>$Text::Wrap::cols = 72;<br />
$body = Text::Wrap::wrap('', '', $body) . "\n$link_url\n\n" .<br />
   $app->translate('IP Address:') . ' ' . $comment->ip . "\n" .<br />
   $app->translate('Name:') . ' ' . $comment->author . "\n" .<br />
   $app->translate('Email Address:') . ' ' . $comment->email . "\n" .<br />
   $app->translate('URL:') . ' ' . $comment->url . "\n\n" .<br />
   $app->translate('Comments:') . "\n\n" . $comment->text . "\n";<br />
$body .= "\nTo delete this comment, click this link:\n".<br />
   $app->{cfg}->CGIPath . "mt.cgi?__mode=delete_confirm&" .<br />
   "_type=comment&id=".$comment->id ."&blog_id=" . $blog->id ."\n";<br />
MT::Mail->send(\%head, $body);</p>
<p>It inserts a link into the mail that, when followed, jumps straight to the "Delete comment? [Yes/No]" page in MT (though, irritatingly, this page will close the browser window after you've hit the button, so you'll want to ensure the page appears in a spare/new window when you click on the link).</p>
<p>[Update : Other links related to spamming, <a href="http://www.paulgraham.com/better.html" title="Bayesian Filtering">Bayesian filtering</a>, <a href="http://plato.stanford.edu/entries/turing-test/" title="turing test">Turing Test</a>]</p>
