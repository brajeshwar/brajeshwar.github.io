---
layout: post
title: Google, Yahoo! and other Search Engines will index Flash Files
---

This is the beginning of a new phenomena -- Google, the leader in Search -- will now be able to index textual content in Flash files of all kinds -- Flash menus, buttons to banner, to self-contained Flash websites. Google have <a href="http://googleblog.blogspot.com/2008/06/google-learns-to-crawl-flash.html">launched their Flash indexing algorithm</a>, we can expect improved visibility of Flash content, with better search results and snippets.

People who have once shunned Flash for the lack of visibility on Search Engines can now rejoice. Earlier, it have been very difficult to make Flash contents indexable by Search Engines.

Ted's got a nice, short and sweet explanation on <a href="http://www.onflex.org/ted/2008/06/searchable-swf.php">how this works</a>; 

With the help of Adobe Flash Player, Search Engines like Google, Yahoo! have their spiders playback SWFs in the Flash Player runtime. The SWF Files actually runs inside the web spiders and allows all contents within an SWF to be indexed.

> The cool part is that this also covers dynamic data loaded in from requests to a server, these are typically ignored in both AJAX and SWF applications.

Google Webmaster Central Blog have some bulleted details on this and here are some of them (more or less verbatim);

Q: Which Flash files can Google better index now?

Google have improved the ability to index textual content in SWF files of all kinds. This includes Flash buttons, menus, self-contained Flash websites, and everything in between.

Q: What content can Google better index from these Flash files?

All of the text that users can see as they interact with your Flash file. If your website contains Flash, the textual content in your Flash files can be used when Google generates a snippet for your website. Also, the words that appear in your Flash files can be used to match query terms in Google searches.

In addition to finding and indexing the textual content in Flash files, Google is also discovering URLs that appear in Flash files, and feeding them into their crawling pipeline -- just like we do with URLs that appear in non-Flash webpages. For example, if your Flash application contains links to pages inside your website, Google may now be better able to discover and crawl more of your website.

Q: What about non-textual content, such as images?

At present, Google is only discovering and indexing textual content in Flash files. If your Flash files only include images, Google will not recognize or index any text that may appear in those images. Similarly, Google do not generate any anchor text for Flash buttons which target some URL, but which have no associated text.

Also note that Google do not index FLV files, such as the videos that play on YouTube, because these files contain no text elements.

Q: How does Google "see" the contents of a Flash file?

Google have developed an algorithm that explores Flash files in the same way that a person would, by clicking buttons, entering input, and so on. Their algorithm remembers all of the text that it encounters along the way, and that content is then available to be indexed.

Q: What do I need to do to get Google to index the text in my Flash files?

Nothing. The improvements that Google have made do not require any special action on the part of web designers or webmasters. If you have Flash content on your website, Google will automatically begin to index it.

That said, you should be aware that Google is now able to see the text that appears to visitors of your website. If you prefer Google to ignore your less informative content, such as a "copyright" or "loading" message, consider replacing the text within an image, which will make it effectively invisible to Google.

Q: What are the current technical limitations of Google's ability to index Flash?

There are three main limitations at present, and Google is already working on resolving them:

- Googlebot does not execute some types of JavaScript. So if your web page loads a Flash file via JavaScript, Google may not be aware of that Flash file, in which case it will not be indexed.
- Google currently do not attach content from external resources that are loaded by your Flash files. If your Flash file loads an HTML file, an XML file, another SWF file, etc., Google will separately index that resource, but it will not yet be considered to be part of the content in your Flash file.
- While Google is able to index Flash in almost all of the languages found on the web, currently there are difficulties with Flash content written in bidirectional languages. Until this is fixed, Google will be unable to index Hebrew language or Arabic language content from Flash files.