---
layout: post
title: Shared Fonts Manager
date: 2004-04-23 13:36:07.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Reviews
tags: []
meta:
  dsq_thread_id: '135614655'
  bitly_short_url: http://j.mp/mcFWhD
  retweet_cache: '1309584600:0'
  trx_addons_post_views_count: '35'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/shared-fonts-manager/"
---
<p>A new product, "Shared Fonts Manager (Shared Fonts Manager)":http://www.sharedfonts.com/, which enables the loading of font libraries into Flash movies, was released recently. As the author was not that comfortable with english, here is a translated version of a criss cross of e-mails and the final result. Thanks to the translator and thanks to the author of the project, Ivan Dembicki (aka Iv) for the information.<br />
<br />
__Here is the public consumable excerpt from our talk;__</p>
<p>*Brajeshwar*: What new possibilities does SFM bring to creating Flash projects and its development?<br />
*Iv*: With the help of SFM, you can fundamentally change the work with embedded fonts in Flash. It is now possible to create a single font library on a site and load necessary fonts via a program on an as needed basis.</p>
<p>*Brajeshwar*: However, you can create a single font library by using shared libraries. What is the difference?<br />
*Iv*: Shared libraries come with a couple of considerable inconveniences, which often restrain developers:<br />
- the placement of shared assets into a Flash movie during the developing process makes it impossible to work with them via a program<br />
- the halt of animation during loading of a Flash movie<br />
- the inability to use loaded shared assets in other loaded movies</p>
<p>I tried to solve these problems in developing my project. It is now possible to:<br />
- load any font with a loadMovie command at any time<br />
- monitor the loading process with the help of a preloader<br />
- receive an acknowledgement upon a successful loading of a font<br />
- format text fields with property html=false; using the setTextFormat method<br />
- install the embedFonts=true; property into text fields with property html=true; upon which the loaded fonts will be applied</p>
<p>*Brajeshwar*: How can SFM be used in practice?<br />
*Iv*: In the first place, I think, the product would be really useful in multilingual projects, when a Flash movie can be told the location of necessary texts and from which libraries to acquire fonts.<br />
Secondly, it can, quite sufficiently, simplify the localization of flash movies. The work with hieroglyphs plays a special interest. Europeans neglect to think about the fact that a Chinese or a Japanese font can be often larger than one MB. In this situation, a specific library could be created for the most commonly used hieroglyphs, while each of the rest could be allocated a library of its own and thus be loaded as it becomes necessary.<br />
A new possibility of creating projects in which a client can format text for a Flash movie with the help of HTML and without limiting himself to turned-on fonts only now arises.<br />
The font map property method allows dynamic designation of necessary library lists. All that's left is the loading and application of necessary fonts.</p>
<p>*Brajeshwar*: Do you offer any sort of discounts to web developers?<br />
*Iv*: I think that web developers should not pay for the SFM and was able to insist upon this. The full version of the product is available to them for free without any obligation. This also applies to companies that do web design, when the fee is applicable only to their clients. And still, the price of $15 for licensing of one domain is not burdensome even to the not-so-rich companies.</p>
<p>*Brajeshwar*: Thanks for such detailed answers and your valuable time.<br />
*Iv*: Thank you for such good questions.</p>
