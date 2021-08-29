# Finding love in Sass and Susy with a Compass

I've dabbled, played and tinkered with HTML/CSS for quite sometime but never took it seriously. Neither did I enjoyed doing them that much to relish the awesomeness of CSS. Of late, I've involved knee deep in some serious and heavy duty CSS. For some odd reason, I liked the way things worked out and am intrigued enough that I want to know more and go deeper, improvise and do it more better, and efficiently.

Today, let me chronicle some of the tools, utilities I stumbled upon and I hope that it will be useful to other web developer/designers. Our team embraced semantic and well marked-up HTML long back and <a href="http://www.w3.org/TR/html5/">HTML5</a> is proving to be a boon for us. But for this article, let's keep HTML5 for another sunny day and let me just talk CSS.

Many people have many concerns with CSS, some of the glaring ones being the <em>lack of variables, inability to nest styles</em>, etc. Many CSS gurus and advanced users are smart enough to twist around this and write smart CSS and still remain sane about it. However, for the normal and not-that-advanced CSS developers and designers, I feel there is a real need for them. That's where many of these CSS pre-processor comes in as a savior.

Topics;

- <a href="http://sass-lang.com/">Sass</a>
- <a href="http://wiki.github.com/chriseppstein/compass">Compass</a>
- a little bit of <a href="http://github.com/ericam/compass-susy-plugin">Susy</a>
- How to get Started (Installation and Usage)
- Few introductory Best Practices
- A working Live Demo

I won't even talk about their integration with other major Application Servers like Merb, Jekyll, Ruby on Rails, etc. I'll assume a standalone CSS-Project to make it easier for you to start off. Integration is the much easier part.

## Sass

Before going ahead, let me say that I like Nathan Borror's article -- <a href="http://nathanborror.com/posts/2009/nov/30/sass-isnt-me/">Sass isn't for me</a> and the reasoning behind it. Fortunately, Sass is for me and will be for most of you. Of course, i'll tell you how we manage 3000+ lines of CSS codes with Sass without having to scroll much and without having to wait for compass to compile those 'ballooning' 10,000+ lines Sass codes.

Simply put, Sass helps you write CSS in a different syntax, cascade your way through the styles, and use variables, mixins and nested rules.

Let's look at a simple example (excerpt from the <a href="http://sass-lang.com/">Sass</a> website)

<script src="http://gist.github.com/617990.js?file=css-pre-sass"></script>
<script src="http://gist.github.com/617990.js?file=sass-ified"></script>

Which means you can use that "table-scaffolding" mixin again and again wherever you need it. Sass is easy to start and the best place to would be to visit the <a href="http://sass-lang.com/tutorial.html">Sass Tutorial</a>. Read below for Sass installation and usage.

## Compass

For me, the need for <a href="http://wiki.github.com/chriseppstein/compass">Compass</a> was just to supplement Sass compilation without my intervention. I was ready to jump into Sass without any gears or tools or frameworks. However, Compass was a pleasant surprise for me and I'm loving every bit of it now.

Once Compass is installed, it comes built-in with the <a href="http://wiki.github.com/chriseppstein/compass/supported-frameworks">following frameworks</a> ready for you:

- Core Compass Styles/Framework
- Blueprint CSS
- YUI Grid
- 960.gs

And here are some of the popular <a href="http://wiki.github.com/chriseppstein/compass/compass-plugins">Compass-Plugins</a> you can add:

- 960.gs
- Baseline
- Compass Colors
- Drupal Zen
- Fancy Buttons
- GraphPaper
- Grid Coordinates
- Slickmap
- Susy

While I'm working on Sass, I simply turn on Compass to watch my folder and forget about it - `compass --watch`. Jump to the end of the article for Installation and usage of Compass.

## Susy

Honestly, it was the name that strike me and I'm not complaining my choice of this particular Compass Plugin. <a href="http://www.oddbird.net/susy/">Susy</a> is a grid and utility plugin for Compass. Susy helps you do away with some of the calculations you always do when you deal with the <a href="http://www.w3.org/TR/CSS2/box.html">CSS Box Model</a> (understand it better with the interactive <a href="http://redmelon.net/tstme/box_model/">CSS Box Model</a>).

However, if you're already comfortable with the other available plugins, it would be wise to start off Sass with that plugin/framework.

## How to get Started (Installation and Usage)

We'll have to accomplish two important steps (a) Install Compass and (b) Install Sass. Both Compass and Sass require you to have Ruby installed. Make sure you have rubygems version 1.3 or greater by running `gem -v` in your Terminal (or Command Line). I'm on Mac OS X but the commands should be same for Linux users and eventually hope Windows users can do the same.

INSTALL Compass

`$ gem sources --add http://gems.github.com/`
`$ sudo gem install chriseppstein-compass`

You have successfully installed compass if you can perform this command

`$ compass -v`

and get something like
```
Compass 0.8.17 [2465bab]
Copyright (c) 2008-2009 Chris Eppstein
Released under the MIT License.
```

In future, you can update Compass by this command

`$ sudo gem update chriseppstein-compas`

## How to use Compass

You can start a new Compass Project in a folder of your choice by typing this command

`$ compass --sass-dir=sass .`

or with added options

`$ compass --sass-dir=sass --css-dir=css --images-dir=i .`

or start a plugin enabled Compass project (let's take Susy in our case)

`$ compass -r susy -f susy <projectname>`

Now, to actually use (or run) compass while you're working on Sass. You'll have to ask Compass to watch over your Sass folder or you can compile them to CSS manually. I love the watch and forget thingy - `compass --watch`.

Run compass

From within your project directory:

`$ compass`

From any directory:

`compass -u path/to/project`

To monitor your project for changes and automatically recompile:

`compass --watch [path/to/project]`

## INSTALL Sass

Well, if you just finished the above steps of installing Compass, then Sass was already installed! Isn't that nice? It comes with two command-line tools for you to use right away.

A sass translator for your existing css files

`$ css2sass my-styles.css my-styles.sass`

A sass compiler for single files that emits css

`$ sass my-styles.sass my-styles.css`

Nonetheless, if you need to install Sass, then here we go.

`sudo gem install haml`

Ah! that's because Sass is part of <a href="http://haml-lang.com/">Haml</a> Project.

## Few introductory Best Practices

We always want to know how to get things started ASAP and with anything new, we want a primer, guidelines, demos, working examples. I would suggest reading on the Tutorials, examples and documentations a bit on <a href="http://github.com/chriseppstein/compass">Compass</a> and <a href="http://sass-lang.com/">Sass</a>.

One things I learnt during CSS and applied in Sass that proved useful is to separate the modules as much as you can. Keep separate Sass files that does separate stuffs and 'sass import' them in a single sass file which will eventually be compiled to a single CSS. That way, I won't have to scroll through one single 'screen.sass' with 10,000+ lines of sass codes.

Here is an example;

Set the following sass files

- _reset.sass
- _base.sass
- screen.sass
- _othersass.sass
- _anothersass.sass
- _yetanothersassmodule.sass

and in the screen.sass file (which actually compiles to your single compressed screen.css) import your other sass files:

```css
@import reset.sass
@import base.sass
@import othersass.sass
```
so on and so forth

Btw, that 'underscore' in the sass filenames denote that they should be expanded inside the screen.sass and not act like a CSS import (which will add another HTTP request by your website).

## Notes

- CSS Box Model -- The modern solution for supported browsers is to use CSS3's `box-sizing` set to `border-box` (the default is "content-box").
- <a href="http://lesscss.org/">LessCSS</a> -- I've heard good reviews about LessCSS, another CSS-Preprocessor like Sass. It's just that I've never tried it seriously.
