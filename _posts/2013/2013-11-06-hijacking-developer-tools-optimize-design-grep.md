# Hijacking Developer Tools to Optimize your Design - Grep

Today, let's pick a developer tool to help enhance a designer's workflow - [Grep](http://en.wikipedia.org/wiki/Grep). Grep is a command-line tool for searching plain-text data sets for lines matching a regular expression. Linux and Mac are very likely to have Grep with their OS. Windows user can grab the [Grep for Windows](http://gnuwin32.sourceforge.net/packages/grep.htm).

## Getting Started with Grep

Let's learn to use `grep` to search a single or multiple stylesheets (CSS, LESS or Sass files) and take the right decision on how to optimize, and write better production-ready codes.

Grep is used via a command-line interface such as Terminal, iTerm or your favorite Windows command-line Program.

Start with a simple search for a term in a CSS file. For instance, let's search for "border-radius" in the file "style.css". We will denote the command-prompt with a `"$"`.

`$ grep border-radius style.css`

This will show you the lines of code where you have "border-radius". If you have a small enough CSS, you should be able to know what border-radius you have used.

You can alternatively search for the existence of a particular term in multiple files. Let's search for the existence of "border-radius" in all of our .scss partials;

`$ grep border-radius *.scss`

What about making it a bit more meaningful and useful by adding a line-number to the output.

`$ grep -n border-radius style.css`

Let's go a little further and run it against all files inside a folder. Let's look for all existence of "border-radius" inside all the files 'recursively' in the "sass" folder of a design project.

`$ grep -n -r border-radius sass`

This shows the files and their corresponding line-numbers of the existence of "border-radius".

That should get you started. I urge you to look more closely, play with it and read the manual anytime with `man grep`. The power of grep and regular expression can prove to be a really powerful tool to help designers write codes better.

![Grep Example)](/static/2013/grep-example.png)

## Grep as Part of the Design Workflow

Sometime back, I wrote an article on [How to use Icon Fonts the right way](/2013/use-icon-fonts-right-way/). Well, what about improving that design workflow with the help of grep?

The gist of the article was to select and use only the icons that you'll need in the design project. The goal was to reduce the file size of the font-files. In-fact, for a lesser number of icons, you can embed the whole font-family inside your CSS.

However, it is going to be a task where you go back and forth to one of such fonts services, repeating the task every time you need a different or additional icons.

Instead of the above workflow, why not use the icon-fonts (all of them) during development. This will allow you to use all the icons of your choice from one or more families - FontAwesome, Entypo, Icomoon, etc.

Once ready for production and deployment, grep through the styles and look for "icon-" which should be good enough to bring up all the existence of icons used in your project. You just have to make a list of the icons used as seen from the grep result and build just that specific font-family.

## Furthermore

In a more advanced environment, you can extract data such as the colors used in a particular design project, the variants of border-radius values used, the number of existence of text-shadows, `et al` and take informed decisions - settle on a color guide depending the frequency of a particular color, standardized on a border-radius or even set a standard, uniform text-shadows across the project. Tools such as [CSSLint](http://csslint.net/), [CSSCSS](http://zmoazeni.github.io/csscss/) can be added to your workflow for a more advanced design and development of styles for your design project.

I hope, you the designers, now have some inkling of what a tool like grep can help you. You'll need to get your hands dirty with the terminal and some command-line. Let me assure you they are not that hard and it is OK to hijack such developer tools to help your design work.