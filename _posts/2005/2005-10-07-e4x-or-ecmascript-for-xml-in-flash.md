---
layout: post
title: E4X or ECMAScript for XML in Flash
date: 2005-10-07 07:08:17.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135615231'
  bitly_short_url: http://j.mp/iErXhJ
  retweet_cache: '1309584385:0'
  trx_addons_post_views_count: '43'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/e4x-or-ecmascript-for-xml-in-flash/"
---
<p>Somewhere around the second quarter of this year, "RichInternet.de (Flash Player to support E4X)":http://www.richinternet.de/blog/index.cfm?mode=entry&entry=EE964A78-AB13-4064-4EE3927DD33888B6 mentioned about one of their "message about E4X (E4X in Flex 2.0)":http://groups.yahoo.com/group/flexcoders/message/15305 on FlexCoders. With the announcement of Flash Player 8.5, Flex Builder 2 and eventually the next Flash IDE, version 9 that will support the much anticipated ActionScript 3.0, it is about time we look back to that topic.</p>
<p>E4X Specification states, E4X adds native XML datatypes to the ECMAScript language, extends the semantics of familiar ECMAScript operators for manipulating XML objects and adds a small set of new operators for common XML operations, such as *searching and filtering*. It also adds support for *XML literals, namespaces, qualified names* and other mechanisms to facilitate XML processing.</p>
<p>*What does E4X have to do with ActionScript?*</p>
<p>__ECMA - AS__<br />
We know that ActionScript's core language is based on ECMAScript. But ECMAScript (ECMA-262) had no way of working with XML Data. ActionScript 1.0 and 2.0 had classes and methods for working with XML data, they are however were not based on ECMAScript standard.</p>
<p>__ECMA does XML__<br />
With the new ECMAScript Edition 4, it defines a new set of classes and functionality for working with XML Data. Well, these classes and functionality are what is called E4X or more appropriately ECMAScript for XML.</p>
<p>__Benefits__<br />
Well, it will make ActionScripting easier, simpler, cool!</p>
<p>* Simple - E4X makes it easier to write and understand code while working with XML Data<br />
* Consistent - Methods and reasoning behind E4X is consistent and consistent with other part of ActionScript<br />
* Same as what we have been doing - You can now manipulate XML data with well-known operators like the dot operator (.)<br />
<br />
Ok, so let us look at something</p>
<p>bc[as]. // Let us have some XML Data as literals for simplicity sake<br />
// and for the FlashKnights, I have a big list, what you see here is just the beginning, ;-)<br />
var myXML:XML =<br />
<flashknights><br />
	<knight id="1"><br />
		<fname>Mike Chambers</fname><br />
		<url>http://weblogs.macromedia.com/mesh/</url><br />
	</knight><br />
	<knight id="2"><br />
		<fname>Branden Hall</fname><br />
		<url>http://www.waxpraxis.org/</url><br />
	</knight><br />
	<knight id="3"><br />
		<fname>Colin Moock</fname><br />
		<url>http://www.moock.org/blog/</url><br />
	</knight><br />
	<knight id="4"><br />
		<fname>Grank Skinner</fname><br />
		<url>http://www.gskinner.com/blog/</url><br />
	</knight><br />
	<knight id="5"><br />
		<fname>Guy Watson</fname><br />
		<url>http://www.flashguru.co.uk/</url><br />
	</knight><br />
<flashknights></p>
<p>Now, we would do something like<br />
@trace (myXML.knight[0].fName);@ // Mike Chambers<br />
@trace (myXML.knight.(@id==5).fName);@ // Guy Watson (look at that @ which is supported by E4X)<br />
@trace (myXML.knight.(fName=="Grank Skinner").url);@ // http://www.gskinner.com/blog/</p>
<p>Hmmm, while on the topic of E4X, "Jesse (Jesse Warden)":http://www.jessewarden.com/ once exclaimed, =="node.child[0] ... pimp ... can it get any easier?"==</p>
<p>See, we are doing away with the DOM-style APIs like firstChild, nextSibling, etc., with E4X we just *dot down* to grab the node you want. Multiple nodes are indexable with [n], similar to the elements of an Array. E4X allows us to write less code and execute it faster because more processing can be done at the native level.</p>
<p>__Backward ActionScript Compatibility__<br />
E4X have an @XML@ Class, to avoid conflict with the same, the @XML@ Class in ActionScript 2.0 was renamed to @XMLDocument@ and I am sure, ActionScript 3.0 will sport the same. As the news is ripe with the fact that E4X is making it into AS 3.0, we can expect the core classes to be part of AS 3.0 and the legacy classes still packaged with Flash so we can still use them if needed be.</p>
<p>Reference Articles;</p>
<p>* "Macromedia Announces Flex 2 Product Line And Flash Player 8.5 (Macromedia Announces Flex 2 Product Line And Flash Player 8.5)":http://www.macromedia.com/macromedia/proom/pr/2005/announcing_flex2.html<br />
* IBM's article, "Scripting with E4X (Scripting with E4X)":http://www-128.ibm.com/developerworks/library/ws-ajax1/<br />
* "E4X Specification (E4X Specification)":http://www.ecma-international.org/publications/standards/Ecma-357.htm ("PDF Version (PDF Version)":http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-357.pdf)<br />
* "Flex 2 matters to You (Macromedia Edge article on Flex 2 matters to You)":http://www.macromedia.com/go/CSPN/</flashknights></flashknights></p>
