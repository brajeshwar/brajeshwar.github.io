---
layout: post
title: CSS Variables
---

CSS Variables can define stylesheet-wide values identified by a token and usable in all CSS declarations. A recurring value, like colors or background-color in a stylesheet, will be way easier to update across the stylesheet if a developer has to modify at just one single place or value instead of modifying all style rules applying the `property: value` pair.

CSS Variables, once implemented, will allow authors to define variables that are reusable as property values anywhere in a stylesheet and queryable/modifiable through an extension of the CSS Object Model.

Majority of the Web Designers and Developers has been requesting a way of defining CSS Variables since its early release. Nonetheless, some are of the opinion that it is not needed and will complicate matters.

## Why variables in CSS?

Many a times, any CSS developer would have felt that s/he is using repeated property values in a CSS stylesheet, for instance to make sure semantically different elements in a web page have a similar rendering and user experience. CSS does offer a way to group styles using groups of selectors, but we tend to neglect it more because of the fact that it's difficult to maintain, decreases readability and of course semantically distinct elements rarely share all style rules.

[CSS Variables Note](http://disruptive-innovations.com/zoo/cssvariables/) names David Hyatt of [Apple](http://www.apple.com/) as one of the author, the other is Daniel Glazman of Disruptive Innovations. We might see a early implementation of CSS Variables in a future version of Safari!

## The CSS Variables Definition

CSS Variables should be defined in an `@variables` at-rule. An `@variable` at-rule is composed of the '@' character followed by the 'variables' identifier, optional target media types (separated by commas) and a block of variable definitions. The definition of a variable must precede all style rules contained or imported in the stylesheet.

Each variable definition contained in the block of variables is a declaration composed as CSS style declarations of an identifier, a semi-colon and one value. As in CSS declarations, optional whitespaces and comments are allowed anywhere.

The definition of variables crosses `@import` boundaries. That means that the definition of a variable contained in a `Stylesheet B` imported from a `Stylesheet A` applies to all rules directly contained or imported into `Stylesheet A`.

## Usage Example

Using the value of a variable as the value or one of the values of a property in a CSS declaration should be achieved using the new functional notation `@var()@`. This function takes only one argument being the identifier being the name of the variable. The declaration becomes invalid if the variable does not exist.

```css
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
```

The above shows that we've styled the @div#post div.entry@ with color, background-color, padding and margin which have been defined earlier in `@variables` for screen medium by default and we can override the same same for "print" medium through the `@variables print`.

More advanced details of CSS Variables -- Grammar, Interfaces like CSSRule, CSSVariablesRule, CSSVariablesDeclaration, CSSValue, CSSVariable, etc -- are discussed in details at the [CSS Variables Note](http://disruptive-innovations.com/zoo/cssvariables/).

## What if you want to start using CSS Variables now?

There are many hacked solutions available at the moment, though restricted to PHP environment, to inject variables inside your CSS. Some of them like [CSS-PHP Variable](http://sperling.com/examples/pcss/) and [Variables in your CSS via PHP](http://www.chrisjdavis.org/php-in-css) treats CSS like PHP and thus able to inject PHP variables rendering them inside your CSS codes.

The near perfect way in the line of the above CSS Variables initiative is luckily available at Shaun Inman's website -- [CSS Server-side Constants](http://www.shauninman.com/archive/css_ssc).

## CSS-SSC

CSS-SSV hijacks the syntax of @rules to isolate variable definitions. Variable names and their values are defined like any other CSS property. The goal was to make this as easy-to-use and native-looking as possible:

```css
@server variables {
	variableName: variableValue;
}
```

This is how variables are embeded in the CSS:

```css
selector {
	property: variableName;
}
```

Here is an example from Shaun's own CSS-SSV:

```css
@server variables {
	primaryLinkColor: #AB6666;
}

a {
	color: primaryLinkColor;
}
```

If you wish to try out Shaun's method, it is available through his [CSS-SSV](http://www.shauninman.com/archive/css_ssc) Page. Otherwise, let's hope that CSS Variables are implemented quick enough so we can reap the benefit, optimize and save our time writing Stylesheets.
