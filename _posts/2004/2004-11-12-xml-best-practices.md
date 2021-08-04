---
layout: post
title: XML Best Practices
---

[David Bau](http://davidbau.com/) have a quick, crisp write-up on [XML Best Practices](http://davidbau.com/archives/2003/11/10/xml_best_practices.html).

An excerpt;

How to Recognize Good XML Technique

It is not hard to recognize when good XML techniques are being used in a development effort. Here are the two things that you see:

- More than one person is reading the same XML in a vanilla editor. When you see this, it probably means that your next new programmer will also be able to understand your critical data too.
- More than one program is reading the same XML using different parsing code. When you see this, it probably means that your next legacy system can be made to understand your precious data too.
On the other hand, it is also easy to recognize XML misuse:
- Nobody knows how to read the raw XML. If it scares programmers to think about using a plain text editor to look at your XML, it probably means that your XML was made purely for computer consumption. It is probably not doing much better than a bytestream would.
- Only one program can read the XML. If nobody seems to be capable of writing a another parser for your XML format, then it has become just yet another opaque data format for you. Why even use XML?