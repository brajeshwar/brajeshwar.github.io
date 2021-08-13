---
layout: post
title: Flash Video Meta Injectors
---

I was looking for simple way to find out the width and height of FLVs. I found two good tools which does lot more than what I wished for, [FLV MetaData Injector](http://www.buraks.com/flvmdi/) and [FLVTool2](http://inlet-media.de/flvtool2/).

[FLV MetaData Injector](http://www.buraks.com/flvmdi/), from [Buraks(http://www.buraks.com/), is a command line tool that adds the required Meta Data at the header of FLV files. You can even save an xml version of the details so generated. There is a GUI tool to make life easier, it even even allows you to select a folder and run the tool on the whole folder containing many FLVs.

[FLVTool2](http://inlet-media.de/flvtool2/) is another command line FLV Metadata Injector tool. Unlike the one from Buraks, this lacks a GUI interface.

Both the tools being command-line based, they can be used on the server to manipulate FLVs using a Server Side Script.