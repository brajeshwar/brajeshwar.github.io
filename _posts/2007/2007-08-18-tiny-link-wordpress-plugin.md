# Tiny Link - a Wordpress plugin to create a TinyURL for your articles

I was in search of a way to automagically get an alternate short link for the lengthy URL of my articles. I tried a plugin but somehow went kaput and never worked for me. I decided to write one for myself and came up with a very simple solution.

Well, <a href="http://wordpress.org/extend/plugins/tiny-link/">Tiny Link</a> is a Wordpress plugin that creates an alternate <a href="http://tinyurl.com/">TinyURL</a> link to your article or post permalink.

I hope this will be useful while sending hyperlinks in emails to avoid the word-wrap for lengthy article URLs. This should also be useful (as far as I can guess) to mobile device users so they will can type a shorter url to read an article.

## TINY LINK

Download <a href="http://wordpress.org/extend/plugins/tiny-link/">Tiny Link</a> from Wordpress.

## USAGE

The most straight forward usage would be to add this simple script

`<?php TinyLink() ?>`

to one of your template - "single.php".

However, a slightly advanced usage will be, to first check if the plugin is installed, if yes, then execute this module. We can even give a direct link to it, so users can copy the link by right-clicking (Mac: Ctrl + Click) the hyperlink.

`<?php if (function_exists('TinyLink')) { ?>`