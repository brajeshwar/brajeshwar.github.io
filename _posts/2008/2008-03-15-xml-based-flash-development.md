---
layout: post
title: XML-based Flash Development
date: 2008-03-15 07:07:40.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Adobe
- Adobe Flash CS4
- Colin Moock
- flash
- Flash CS4
- John Nack
- Manish Jethani
- XFL
- XML
meta:
  dsq_thread_id: '135705775'
  bitly_short_url: http://j.mp/kQglOj
  retweet_cache: '1309570762:0'
  trx_addons_post_views_count: '50'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/xml-based-flash-development/"
excerpt: So in theory, you might one day edit the images of an XFL file directly in
  Photoshop without disturbing the timeline information also contained in that file.
  Or you might be able to import a page from a word processing document into a Flash
  presentation.
---
<p>Early Pre-Release Adobe Software users have started talking about some of the new features of <strong>Diesel</strong> code-name for the upcoming <a href="http://www.adobe.com/go/flash/">Adobe Flash</a> version 10 aka Adobe Flash CS4.</p>
<p>I came across <a href="http://www.moock.org/blog/archives/000269.html">an article</a> from <strong>Colin Moock</strong> about a New Source Format that Flash CS4 will flaunt -- XFL -- some sort of an XML-based compressed file which will carry the source material of your Flash Document. Well, don't get really excited yet, we're talking about a pre-release software and Adobe might just decide to remove the feature(s). These features are subject to change, none of this may even happen at all. However, this is a very promising direction for Flash.</p>

<p>Every Flash Designer and Developers alike knows that the binary source file .fla is very closed proprietary format of Macromedia/Adobe. It is thus virtually impossible for third-party software to interchange source with the Flash IDE. Being a binary format, this also proves to be one hell of a concern for most Version Control systems -- CVS, SubVersion.</p>
<p>Well, as Moock pointed out, this is going to change with the upcoming version of Flash CS4. Flash will now be able to export/import this new source format XFL. The XFL will be comprised of an XML file describing the structure of the Flash Document and a folder with the Document's assets (graphics, sounds, etc). Adobe, when Flash CS4 goes public, will document them allowing third-party tools to import and export XFL.</p>
<p>In the text of Colin Moock,</p>
<blockquote><p>So in theory, you might one day edit the images of an XFL file directly in Photoshop without disturbing the timeline information also contained in that file. Or you might be able to import a page from a word processing document into a Flash presentation.</p></blockquote>
<p></p>
<p>Moock further added, "Being XML-based, the new XFL format should be fairly easy to understand and generate. That means any small tool company, web agency, or even independent developer will be able to create a purpose-built authoring tool that can output XFL. Of course, the XFL file would then need to be opened in the Flash authoring tool for final .swf export. But a .jsfl script should be able to ease the workflow between an XFL-generating tool and the Flash-authoring .swf-compilation process."</p>
<p>"The natural next step in the evolution of XFL authoring would be to take the Flash authoring tool out of the equation altogether. If Adobe were to offer a command-line XFL-to-SWF compiler along with XFL, nearly any decent programmer would be able to create a .swf-authoring tool, even in ActionScript."</p>
<p>The whole new XFL feature will bring out an even greater level of control between layout, design and business logic. In an e-mail reply from <a href="http://manishjethani.com/">Manish Jethani</a> when I asked his opinion about this new feature, he was elated that developer can now write tools to work more effectively with Designers. Developer can make minor edits to the XML file without having to go the designers.</p>
<p>Some of the other prominent features expected to be part of Adobe Flash CS4 includes -- inverse kinematics, a new tweening model, 3D "postcards in space", and advanced text components.</p>
<p><strong>References</strong></p>
<p>* Colin Moock -- <a href="http://www.moock.org/blog/archives/000269.html">XFL: Flash's New Source Format</a><br />
* John Nack -- <a href="http://blogs.adobe.com/jnack/2008/03/flash_moving_to.html">Flash moving to an XML-based authoring format</a></p>
