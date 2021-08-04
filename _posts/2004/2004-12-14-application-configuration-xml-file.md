---
layout: post
title: Application Configuration (XML) File
---

Today as I was doing a round of [Java Blogs](http://www.javablogs.com/), I came across an article, "On Configuration and XML".

We have been using some sorta config.xml for most, well for all our Flash Applications. Not only does this makes life easier for the client but even for us while testing, debugging and even when we have to make quick changes without getting dirty with the codes. And yes, once the Application is deployed, changing nifty things is a breeze with the config.xml file. You should have read the happy, satisfied client's mails when we simply tell them to change some strings in the xml and they have what they want.


In this article, I like the idea of having a UI Tool to edit the configuration file. We have not really given a thought on the same but then it will be pretty simple. We can build a simple Flash Application where the UI will be dynamically generated from its own config.xml. We will give this to the client and there he goes, he simply load a default config.xml of the application and is modified to suit the installation/server environment; that's it. This standalone application will be plain-wrapped with some third party tool like Flash Studio Pro or may be even use Director so that we can do the loading/writing xml thingy.

> "Naturally as we move away from the world of programmers it becomes less beneficial to have configuration in code.  Why?  Because non-programmers can't manage the configuration.  In this case what you'll probably really want to do is to provide a UI for configuring your code.  This is where XML makes a lot more sense since it is a lot easier to parse and produce an XML file than it is to do the same with a programming language.  It is easier to create a UI over an XML file than a file written in a programming language.

So, like all things, what you use for configuring your application should depend a lot on who is configuring your application.  XML is a nice middle-ground choice for many applications.  There are examples of course where XML may cause more problems than solve them, but in many cases if a complex configuration is required XML is a good solution."
