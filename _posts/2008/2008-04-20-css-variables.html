---
layout: post
title: CSS Variables
date: 2008-04-20 07:32:55.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- apple
- attribute
- CSS
- CSS Object Model
- Daniel Glazman
- David Hyatt
- Disruptive Innovations
- property
- stylesheet
- Stylesheets
- Variable
- Variables
meta:
  _edit_last: '67'
  dsq_thread_id: '135616853'
  bitly_short_url: http://j.mp/mrxWTI
  retweet_cache: '1309582328:16'
  trx_addons_post_views_count: '176'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/css-variables/"
excerpt: It is very common to find repeated property values in a CSS stylesheet. CSS
  Variables allow authors to define variables that are reusable as property values
  anywhere in a stylesheet and queryable/modifiable through an extension of the CSS
  Object Model.
---
<p>CSS Variables can define stylesheet-wide values identified by a token and usable in all CSS declarations. A recurring value, like colors or background-color in a stylesheet, will be way easier to update across the stylesheet if a developer has to modify at just one single place or value instead of modifying all style rules applying the <em>property:value</em> pair.</p>
<p>CSS Variables, once implemented, will allow authors to define variables that are reusable as property values anywhere in a stylesheet and queryable/modifiable through an extension of the CSS Object Model.</p>
<p>Majority of the Web Designers and Developers has been requesting a way of defining CSS Variables since its early release. Nonetheless, some are of the opinion that it is not needed and will complicate matters.</p>
<p><strong>Why variables in CSS?</strong></p>
<p>Many a times, any CSS developer would have felt that s/he is using repeated property values in a CSS stylesheet, for instance to make sure semantically different elements in a web page have a similar rendering and user experience. CSS does offer a way to group styles using groups of selectors, but we tend to neglect it more because of the fact that it's difficult to maintain, decreases readability and of course semantically distinct elements rarely share all style rules.</p>
<p><a href="http://disruptive-innovations.com/zoo/cssvariables/">CSS Variables Note</a> names David Hyatt of <a href="http://www.apple.com/">Apple</a> as one of the author, the other is Daniel Glazman of Disruptive Innovations. We might see a early implementation of CSS Variables in a future version of Safari!</p>
<p><strong>The CSS Variables Definition</strong></p>
<p>CSS Variables should be defined in an <code>@variables</code> at-rule. An <code>@variable</code> at-rule is composed of the '@' character followed by the 'variables' identifier, optional target media types (separated by commas) and a block of variable definitions. The definition of a variable must precede all style rules contained or imported in the stylesheet.</p>
<p>Each variable definition contained in the block of variables is a declaration composed as CSS style declarations of an identifier, a semi-colon and one value. As in CSS declarations, optional whitespaces and comments are allowed anywhere.</p>
<p>The definition of variables crosses <code>@import</code> boundaries. That means that the definition of a variable contained in a <strong>Stylesheet B</strong> imported from a <strong>Stylesheet A</strong> applies to all rules directly contained or imported into <strong>Stylesheet A</strong>.</p>
<p><strong>Usage Example</strong></p>
<p>Using the value of a variable as the value or one of the values of a property in a CSS declaration should be achieved using the new functional notation @var()@. This function takes only one argument being the identifier being the name of the variable. The declaration becomes invalid if the variable does not exist.</p>
<pre class="prettyprint linenums">
@variables {
	oColor: #fefedb;
	oBgColor: #ccc;
	oMargin: 1em;
	oPadding: 1em;
}
@variables print { /* applies only to print */
	oColor: #000;
	oBgColor: #fff;
	oMargin: 2em;
	oPdding: 2em;
}
div#post div.entry {
	border: 1px solid #666;
	font: normal normal normal 1em/1.6em "Lucida Grande", Lucida, Verdana, sans-serif;
	margin: var(oMargin);
	padding: var(oPadding);
	color: var(oColor);
	background-color: var(oBgColor);
}
</pre>
<p>The above shows that we've styled the @div#post div.entry@ with color, background-color, padding and margin which have been defined earlier in <code>@variables</code> for screen medium by default and we can override the same same for "print" medium through the <code>@variables print</code>.</p>
<p>More advanced details of CSS Variables -- Grammar, Interfaces like CSSRule, CSSVariablesRule, CSSVariablesDeclaration, CSSValue, CSSVariable, etc -- are discussed in details at the <a href="http://disruptive-innovations.com/zoo/cssvariables/">CSS Variables Note</a>.</p>
<p><strong>Ok, so what if I want to start using CSS Variables now?</strong></p>
<p>There are many hacked solutions available at the moment, though restricted to PHP environment, to inject variables inside your CSS. Some of them like <a href="http://sperling.com/examples/pcss/">CSS-PHP Variable</a> and <a href="http://www.chrisjdavis.org/php-in-css">Variables in your CSS via PHP</a> treats CSS like PHP and thus able to inject PHP variables rendering them inside your CSS codes.</p>
<p>The near perfect way in the line of the above CSS Variables initiative is luckily available at Shaun Inman's website -- <a href="http://www.shauninman.com/archive/css_ssc">CSS Server-side Constants</a>.</p>
<p><strong>CSS-SSC</strong></p>
<p>CSS-SSV hijacks the syntax of @rules to isolate variable definitions. Variable names and their values are defined like any other CSS property. The goal was to make this as easy-to-use and native-looking as possible:</p>
<pre class="prettyprint linenums">
@server variables {
	variableName: variableValue;
}
</pre>
<p>This is how variables are embeded in the CSS:</p>
<pre class="prettyprint linenums">
selector {
	property: variableName;
}
</pre>
<p>Here is an example from Shaun's own CSS-SSV:</p>
<pre class="prettyprint linenums">
@server variables {
	primaryLinkColor: #AB6666;
}

a {
	color: primaryLinkColor;
}
</pre>
<p>If you wish to try out Shaun's method, it is available through his <a href="http://www.shauninman.com/archive/css_ssc">CSS-SSV</a> Page. Otherwise, let's hope that CSS Variables are implemented quick enough so we can reap the benefit, optimize and save our time writing Stylesheets.</p>
