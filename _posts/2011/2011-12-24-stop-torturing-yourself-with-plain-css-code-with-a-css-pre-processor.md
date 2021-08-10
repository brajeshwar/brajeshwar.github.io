---
layout: post
title: Stop torturing yourself with plain CSS, code with a CSS pre-processor
---

First, let me tell you, I'm pretty good with CSS. However, I've always hated writing CSS. Writing CSS is like using dried woods, leaves and rocks to lit a fire everything you need to cook something. You may become very good with it, but it's an unforgiving task and you've to do the rigorous feat every time you need the fire. CSS is bland, dumb, linear and it's utter lack of intelligence is derogatory even to the most novice coder.

Many designers and developers have urged the need for variables, constants or at-least some rudimentary intelligence. But it is unlikely, a far-fetched dream and is not happening anytime soon. And, there is the often dreaded math you have to do every time you write CSS grids/columns.

Nonetheless, help is at hand and I will say with certainty that if you still write CSS without a pre-processor, you're doing it the very hard way. Why not use a CSS pre-processor!

There are quite a few popular CSS pre-processor available now -- <a href="http://lesscss.org/">LessCSS</a>, <a href="http://sass-lang.com/">Sass</a> and <a href="http://learnboost.github.com/stylus/">Stylus</a>. Personally, I prefer Sass with `scss` syntax but it is just a preference and you're free to pick a choice of your own.

Some of the good reasons to use one of these CSS pre-processors are:

- Variables - This alone is good enough to get you started. You can easily define your variables (colors, fonts, baseline, etc), thus making it easy to change it at one place without wading through the spaghetti of CSS codes when you need to change them.
- Mixins - If you've talked with developers or dabble with some Object Oriented Programming languages, you'd have heard this term quite often. In object-oriented programming languages, a mixin is a class that provides a certain functionality to be inherited or just reused by a subclass. With the help of a pre-processor, you can write 'mixins' which can be re-used in other CSS classes or mixed with other mixins.
- Nesting - You can nest classes and have a much cleaner CSS code.
- Functions - There are quite a bit of pre-defined functions and options available to you. What if I tell you that you can just do something like, `darken(white, 50%)`, which will produce a gray color instead of white.

I won't go into the details - syntax, features, etc. for the pre-processors; just pick one and go with it, they're all pretty much the same and you can switch amongst them easily. Get yourself comfortable with one and start using it.

## Tools to help you get started

Compass

As mentioned above, I choose Sass with `scss` syntax because that is very close to CSS and I won't be totally at lost if I've to drop everything and have to write in raw CSS. I also happen to come across Compass sometime back and I love it. <a href="http://compass-style.org/">Compass</a> is the ultimate and must-have authoring tool if you're using Sass.

Installation, usage and more tools

Unlike the early days, you no longer have to tinker with the command-line while dealing with the pre-processors, there are lots of tools that can make life way easier for you. You don't have an excuse not to use it.

- <a href="http://compass.handlino.com/">CompassApp</a> (Win, Mac, Linux) helps you compile stylesheets easily without resorting to command line interface.
- <a href="http://incident57.com/codekit/">CodeKit</a> automatically compiles Less, Sass, Stylus, CoffeeScript & Haml files. It effortlessly combines, minifies and error-checks Javascript. It even optimizes jpeg & png images, auto-reloads your browser and lets you use the same files across many projects.
- <a href="http://livereload.com/">LiveReload</a> monitors changes in the file system. As soon as you save a file, it is preprocessed as needed, and the browser is refreshed.
