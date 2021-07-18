---
layout: post
title: Mac OS X Lion review by Arstechnica, Graphic Designer's mistakes and Why you
  do not need to define "0" a unit in CSS
date: 2011-07-26 23:55:51.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Lion
- Mac OS X
meta:
  _edit_last: '67'
  dsq_thread_id: '369245848'
  trx_addons_post_views_count: '35'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2011/mac-os-x-lion-review-by-arstechnica-graphic-designers-mistakes-and-why-you-do-not-need-to-define-0-a-unit-in-css/"
---
<h3>Mac OS X Lion</h3>
<p>Arstechnica did a brilliant, detailed and exhaustive review of Apple's new <a href="http://www.apple.com/macosx/">Mac OS X</a> Lion -- <a href="http://arstechnica.com/apple/reviews/2011/07/mac-os-x-10-7.ars/">Mac OS X 10.7 Lion: the Ars Technica review</a>. Definitely worth a thorough reading.</p>
<p>From the article, here's a tip on how to burn a bootable Lion Installation.</p>
<p>* Download Mac OS X Lion from the App Store.<br />
* Before you go ahead and Install, once you have the installer application, do a "Show Package Contents" on the Installer.<br />
* You should find a 3.74GB disk image (InstallESD.dmg, stored in the Contents/SharedSupport folder).<br />
* Use that disk image to burn a Lion installation DVD or create an emergency external boot disk.</p>

<h3>10 Mistakes a Graphic Designer Shouldn't be Making</h3>
<p><a href="http://www.graphicdesignblog.org/">Charlie Johnson</a> shared a nice article on <a href="http://www.designtaxi.com/article/101675/10-Mistakes-a-Graphic-Designer-Shouldn-t-be-Making/">10 Mistakes a Graphic Designer Shouldn't be Making</a> at <a href="http://www.designtaxi.com/">DesignTaxi</a>.</p>
<p><em>The Mistakes to avoid:</em></p>
<p># Working without a design brief.<br />
# Ignoring the target audience.<br />
# Not maintaining a contract.<br />
# Avoiding contact with the client.<br />
# Procrastinating.<br />
# Not staying up-to-date.<br />
# Not starting in black and white.<br />
# Pass off plagiarism as inspiration.<br />
# Neglecting the power of simplicity.<br />
# Lose confidence.</p>
<h3>You do not need to define "0" a unit in CSS</h3>
<p>I see quite a lot of CSS where the "0" is suffixed with a unit like "px", "em". Well, "0" do not have a unit and do not need one. The unit identifier can be omitted if the value is a <a href="http://www.w3.org/TR/CSS21/syndata.html#length-units">length</a> (<a href="http://dev.w3.org/csswg/css3-values/#ltlengthgt">CSS3 Editor Draft</a>). After a zero length, the unit identifier is optional. However, the exception is if '0' is an "angle", the unit identifier is required. You'll have to say "0deg".</p>
<p>Thanks to a <a href="http://l-c-n.com/">Philippe Wittenbergh</a>, an awesome CSS guy (When I'm stuck, he's my CSS go-to person) for clarification on this one at the <a href="http://www.css-discuss.org/">CSS-Discuss list</a>.</p>
