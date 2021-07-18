---
layout: post
title: Typography, One of the Most Important Aspect of Web Design
date: 2013-06-04 20:57:36.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  _yoast_wpseo_linkdex: '87'
  _edit_last: '67'
  _yoast_wpseo_focuskw: Typography
  _yoast_wpseo_title: Typography - One of the Most Important Aspect of Web Design
  _yoast_wpseo_metadesc: Take care of your Typography and you're half done with your
    Web Design.
  dsq_thread_id: '1360107610'
  _clicky_goal: a:2:{s:2:"id";s:0:"";s:5:"value";s:0:"";}
  amazonS3_cache: a:6:{s:75:"http://brajeshwar.wpengine.com/wp-content/uploads/pressing-16th-century.jpg";i:6700;s:72:"http://media.brajeshwar.com/wp-content/uploads/pressing-16th-century.jpg";i:6700;s:68:"http://brajeshwar.wpengine.com/wp-content/uploads/typeplate-logo.png";i:6699;s:65:"http://media.brajeshwar.com/wp-content/uploads/typeplate-logo.png";i:6699;s:73:"https://media.brajeshwar.com/wp-content/uploads/pressing-16th-century.jpg";i:6700;s:66:"https://media.brajeshwar.com/wp-content/uploads/typeplate-logo.png";i:6699;}
  trx_addons_post_views_count: '56'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2013/typography-one-of-the-most-important-aspect-of-web-design/"
---
<p>I say, "your web-design is already half done when you've taken care of the Typography." Typography is such an important aspect of User Interface Designs that it would be total folly to neglect it in the underneaths of font-family, font-size and font-weights.</p>
<p>Recently, I went to a casual gathering of Wordpress enthusiasts to mark the <a href="http://wordpress.org/news/2013/05/the-next-10-starts-now/">10th anniversary of Wordpress</a>, and we got talking about themes, plugins, frameworks and overalls of web designs. Amongst the interesting talks on Wordpress specific frameworks, themes and general User Interface Frameworks like Bootstrap, Foundation, <em>et al</em>, we also happened to talked about Typography.</p>
<p>Unfortunately, many were not really concerned about it but curious enough that they wanted to know more. This article is the result of that conversation, hoping that other designers would be able to kick-start on the ideas of Typography - explore it and even master it.</p>

<p>[caption id="attachment_6700" align="alignnone" width="800"]<img src="/static/2013/06/pressing-16th-century.jpg" alt="Printing press, 16th century in Germany" class="size-full wp-image-6700" /> Printing press, 16th century in Germany[/caption]</p>
<p>I'm not a Typography expert but I've a keen interest and always wanted to know more, learn the tactics of using it effectively to make User Interfaces that are easier and better for users. You do not have to be an expert in Typography to make good use of it in your web design works.</p>
<p><a href="http://typeplate.com/"><img src="/static/2013/06/typeplate-logo.png" alt="Typeplate" width="216" height="216" class="alignright size-full wp-image-6699" /></a></p>
<h2>Typeplate</h2>
<p>So, here is a basic foundation on Typography that should help you get started. Instead of doing a broad generalization - kerning, leading, letter-spacing, color and fonts - let me get straight to the basics with references a very good Typography Starter Kit - <a href="http://typeplate.com/">Typeplate</a>.</p>
<blockquote><p>Typeplate is a "typographic starter kit". It does not make aesthetic design choices, but define proper markup with extensible styling for common typographic patterns. A stripped-down Sass library concerned with the appropriate technical implementation of design patterns - not how they look.</p></blockquote>
<p>Besides the original Sass version, it's also ported to LESS and Stylus, complete with the raw CSS version. You can use Typeplate along with your favorite style frameworks.</p>
<p>If you're already using a CSS Preprocessor (Sass, LESS, Stylus), you should feel right at home and you can start tweaking the variables/settings to choose the font-size, line-height, etc.</p>
<h2>Base</h2>
<p>Typeplate uses <a href="http://modularscale.com/">Modular-Scale</a> to calculate and establish a Typographic scale early on. The font-sizes are established and you're advised not to pick random font-sizes anywhere in your design. Font-size should be a relative value to either your root default or it's parent element. Remember to maintain a type hierarchy that is harmonious and consistent.</p>
<h2>Word-wrap, Indentation and Hyphens</h2>
<p>Typeplate comes with word-wrap, indentation and hyphen taken care of.</p>
<p>By default, unbreakable words may be broken at arbitrary points if there are no otherwise acceptable break points in the line. However, you may choose to have lines break only at normal word break points.</p>
<p>There is a default indentation with Typeplate, of which I'm not overly fond of. Yes, historically we were taught about indentation as a starting point for a paragraph but the web have evolved away from that. Well, you can just turn that off in the Sass settings.</p>
<p>With Responsive Web Design these days, it makes even more sense to have your type more flexible. "In a fluid layout, browser width and typographic measure are linked: the wider the viewport, the more characters per line."</p>
<blockquote><p>Since hyphens is an inherited property, it isn't sufficient to set it for a limited number of elements and assume you're done. You have to make sure you've turned it off for the elements that shouldn't be hyphenated. -- <cite><small><a href="http://meyerweb.com/eric/thoughts/2012/12/17/where-to-avoid-css-hyphenation/">Eric Meyer</a></small></cite></p></blockquote>
<h2>Code Blocks</h2>
<p>How can a typography kit be complete without a code block style. Typeplate uses Monospace fonts (or "fixed pitch" fonts, contain characters that all have the same character width) for code blocks. <code>'l', '1' and 'i'</code> are easily distinguished with monospace, <code>'0', 'o' and 'O'</code> are easily distinguished and clear punctuation characters, especially braces, parenthesis and brackets.</p>
<h2>Figures</h2>
<p>Typeplate takes care of the figure element introduced in HTML5. Figure represents a unit of content, optionally with a caption, that is self-contained, that is typically referenced as a single unit from the main flow of the document, and that can be moved away from the main flow of the document without affecting the document's meaning. It is very effectively used with an image and a caption.</p>
<h2>Block Quotes & Pull Quotes</h2>
<p>We all love block quotes and Typeplate have a starting style for it, along with the style for the citation. You can extend it and style it to your choice of design.</p>
<p>It is interesting that Typeplate has a built-in style for Pull Quotes. Pull Quotes are nice but one should be careful that if not styled correctly, it can affect the design of the nearby elements.</p>
<h2>Footnotes</h2>
<p>Footnotes are a nice way to give references to your articles, content or blog posts. Typeplate has a footnote style ready to be used.</p>
<h2>More Typography</h2>
<p>Go ahead and explore Typeplate, download or clone <a href="https://github.com/typeplate/typeplate.github.io">the source</a> and study it. It has a pretty small footprint and it gives you a perfect foundation for your types and fonts. <a href="http://typeplate.com/">Typeplate</a> has other typography elements, such as - Small Capitals, Drop Capitals, Small Print, Definition List and even take special care of Ampersands.</p>
<p>For the more curious, who want to further their typography skill, you might want to look at <a href="http://ilovetypography.com/">I Love Typography</a> for a regular dose of Typography treatment.</p>
<p>Image Credits: <a href="http://en.wikipedia.org/wiki/Typography">Typography</a> on Wikipedia, <a href="http://typeplate.com/">Typeplate</a>.</p>
