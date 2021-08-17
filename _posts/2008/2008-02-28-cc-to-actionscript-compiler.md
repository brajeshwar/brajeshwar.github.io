---
layout: post
title: C/C++ to Flash Compiler
---

While browsing around Flash/Flex blogs, I stumbled on an interesting article from Ted -- <a href="http://www.onflex.org/ted/2008/02/extending-adobe-flash-player-and-adobe.php">Extending Adobe Flash Player and Adobe AIR with C and C++</a> via ActionScript 3.

The interesting thing as told by Ted was that Adobe's Engineers are working on an internal project which is sort of a cross-compiler for ActionScript allowing any c/c++ code to run in the Flash Player or Adobe AIR. This is a rather nerve racking feat and Ted have already written of many interesting implications for  extending Adobe's platform in terms of legacy code, programming languages, and other open source code libraries.

> Part of this implementation includes a pattern in ActionScript that allows for "green threading" that supports executing synchronous code in the asynchronous ActionScript virtual machine. The work done here is quite groundbreaking and has highlighted quite a few performance improvements in the current virtual machine while expanding the capability of the platform.

Adobe engineers and hackers have ported the C++ version of Quake 1 engine into Flash Player and it worked perfectly and performed well. This is extreme engineering and an utmost over-the-top expectation from the Flash Player. What if multiplayer games can be played without even downloading a piece of it, right off the browser, have all the office tools working flawlessly right inside your browser -- well, it is rather limitless of what you can do; think of it and it might just be possible.
