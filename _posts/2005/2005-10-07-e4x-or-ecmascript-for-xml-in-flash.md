# E4X or ECMAScript for XML in Flash

Somewhere around the second quarter of this year, [RichInternet.de](http://www.richinternet.de/blog/index.cfm?mode=entry&entry=EE964A78-AB13-4064-4EE3927DD33888B6) mentioned about one of their [message about E4X ](http://groups.yahoo.com/group/flexcoders/message/15305) on FlexCoders. With the announcement of Flash Player 8.5, Flex Builder 2 and eventually the next Flash IDE, version 9 that will support the much anticipated ActionScript 3.0, it is about time we look back to that topic.

E4X Specification states, E4X adds native XML datatypes to the ECMAScript language, extends the semantics of familiar ECMAScript operators for manipulating XML objects and adds a small set of new operators for common XML operations, such as *searching and filtering*. It also adds support for *XML literals, namespaces, qualified names* and other mechanisms to facilitate XML processing.

*What does E4X have to do with ActionScript?*

__ECMA - AS__

We know that ActionScript's core language is based on ECMAScript. But ECMAScript (ECMA-262) had no way of working with XML Data. ActionScript 1.0 and 2.0 had classes and methods for working with XML data, they are however were not based on ECMAScript standard.

__ECMA does XML__

With the new ECMAScript Edition 4, it defines a new set of classes and functionality for working with XML Data. Well, these classes and functionality are what is called E4X or more appropriately ECMAScript for XML.

__Benefits__

Well, it will make ActionScripting easier, simpler, cool!

* Simple - E4X makes it easier to write and understand code while working with XML Data
* Consistent - Methods and reasoning behind E4X is consistent and consistent with other part of ActionScript
* Same as what we have been doing - You can now manipulate XML data with well-known operators like the dot operator (.)

Ok, so let us look at something

```html
// Let us have some XML Data as literals for simplicity sake
// and for the FlashKnights, I have a big list, what you see here is just the beginning, ;-)
var myXML:XML =
<flashknights>
	<knight id="1">
		<fname>Mike Chambers</fname>
		<url>http://weblogs.macromedia.com/mesh/</url>
	</knight>
	<knight id="2">
		<fname>Branden Hall</fname>
		<url>http://www.waxpraxis.org/</url>
	</knight>
	<knight id="3">
		<fname>Colin Moock</fname>
		<url>http://www.moock.org/blog/</url>
	</knight>
	<knight id="4">
		<fname>Grank Skinner</fname>
		<url>http://www.gskinner.com/blog/</url>
	</knight>
	<knight id="5">
		<fname>Guy Watson</fname>
		<url>http://www.flashguru.co.uk/</url>
	</knight>
<flashknights>
```

Now, we would do something like

`trace (myXML.knight[0].fName);`
`trace (myXML.knight.(`id==5).fName);`
`trace (myXML.knight.(fName=="Grank Skinner").url);`

See, we are doing away with the DOM-style APIs like firstChild, nextSibling, etc., with E4X we just *dot down* to grab the node you want. Multiple nodes are indexable with [n], similar to the elements of an Array. E4X allows us to write less code and execute it faster because more processing can be done at the native level.

__Backward ActionScript Compatibility__

E4X have an `XML` Class, to avoid conflict with the same, the `XML` Class in ActionScript 2.0 was renamed to `XMLDocument` and I am sure, ActionScript 3.0 will sport the same. As the news is ripe with the fact that E4X is making it into AS 3.0, we can expect the core classes to be part of AS 3.0 and the legacy classes still packaged with Flash so we can still use them if needed be.