---
layout: post
title: Hijacking Developer Tools to Optimize your Design - Grep
date: 2013-11-06 19:18:13.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  _yoast_wpseo_linkdex: '90'
  _edit_last: '67'
  _yoast_wpseo_focuskw: grep
  _yoast_wpseo_metadesc: Grep is a command-line tool for searching plain-text data
    sets for lines matching a regular expression.
  dsq_thread_id: '1941554981'
  amazonS3_cache: a:3:{s:67:"http://brajeshwar.wpengine.com/wp-content/uploads/grep-example1.png";i:6752;s:64:"http://media.brajeshwar.com/wp-content/uploads/grep-example1.png";i:6752;s:65:"https://media.brajeshwar.com/wp-content/uploads/grep-example1.png";i:6752;}
  trx_addons_post_views_count: '84'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2013/hijacking-developer-tools-optimize-design-grep/"
---
<p>Today, let's pick a developer tool to help enhance a designer's workflow - <a href="http://en.wikipedia.org/wiki/Grep">Grep</a>. Grep is a command-line tool for searching plain-text data sets for lines matching a regular expression. Linux and Mac are very likely to have Grep with their OS. Windows user can grab the <a href="http://gnuwin32.sourceforge.net/packages/grep.htm">Grep for Windows</a>.</p>

<h2>Getting Started with Grep</h2>
<p>Let's learn to use <em>grep</em> to search a single or multiple stylesheets (CSS, LESS or Sass files) and take the right decision on how to optimize, and write better production-ready codes.</p>
<p>Grep is used via a command-line interface such as Terminal, iTerm or your favorite Windows command-line Program.</p>
<p>Start with a simple search for a term in a CSS file. For instance, let's search for "border-radius" in the file "style.css". We will denote the command-prompt with a <strong>"$"</strong>.</p>
<p><em>$ grep border-radius style.css</em></p>
<p>This will show you the lines of code where you have "border-radius". If you have a small enough CSS, you should be able to know what border-radius you have used.</p>
<p>You can alternatively search for the existence of a particular term in multiple files. Let's search for the existence of "border-radius" in all of our .scss partials;</p>
<p><em>$ grep border-radius *.scss</em></p>
<p>What about making it a bit more meaningful and useful by adding a line-number to the output.</p>
<p><em>$ grep -n border-radius style.css</em></p>
<p>Let's go a little further and run it against all files inside a folder. Let's look for all existence of "border-radius" inside all the files 'recursively' in the "sass" folder of a design project.</p>
<p><em>$ grep -n -r border-radius sass</em></p>
<p>This shows the files and their corresponding line-numbers of the existence of "border-radius".</p>
<p>That should get you started. I urge you to look more closely, play with it and read the manual anytime with <em>man grep</em>. The power of grep and regular expression can prove to be a really powerful tool to help designers write codes better.</p>
<p><img src="/static/2013/11/grep-example1.png" alt="grep example" width="800" height="500" class="alignnone size-full wp-image-6752" /></p>
<h2>Grep as Part of the Design Workflow</h2>
<p>Sometime back, I wrote an article on <a href="http://brajeshwar.wpengine.com/2013/use-icon-fonts-right-way/">How to use Icon Fonts the right way</a>. Well, what about improving that design workflow with the help of grep?</p>
<p>The gist of the article was to select and use only the icons that you'll need in the design project. The goal was to reduce the file size of the font-files. In-fact, for a lesser number of icons, you can embed the whole font-family inside your CSS.</p>
<p>However, it is going to be a task where you go back and forth to one of such fonts services, repeating the task every time you need a different or additional icons.</p>
<p>Instead of the above workflow, why not use the icon-fonts (all of them) during development. This will allow you to use all the icons of your choice from one or more families - FontAwesome, Entypo, Icomoon, etc.</p>
<p>Once ready for production and deployment, grep through the styles and look for "icon-" which should be good enough to bring up all the existence of icons used in your project. You just have to make a list of the icons used as seen from the grep result and build just that specific font-family.</p>
<h2>Furthermore</h2>
<p>In a more advanced environment, you can extract data such as the colors used in a particular design project, the variants of border-radius values used, the number of existence of text-shadows, <em>et al</em> and take informed decisions - settle on a color guide depending the frequency of a particular color, standardized on a border-radius or even set a standard, uniform text-shadows across the project. Tools such as <a href="http://csslint.net/">CSSLint</a>, <a href="http://zmoazeni.github.io/csscss/">CSSCSS</a> can be added to your workflow for a more advanced design and development of styles for your design project.</p>
<p>I hope, you the designers, now have some inkling of what a tool like grep can help you. You'll need to get your hands dirty with the terminal and some command-line. Let me assure you they are not that hard and it is OK to hijack such developer tools to help your design work.</p>
