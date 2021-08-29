# Web standards compliant Javascript Flash detect and embed

There was an uproar during late 2002 when [alistapart](http://www.alistapart.com/) came up with an article [Flash Satay](http://www.alistapart.com/articles/flashsatay/). Nonthless, few limitations came as a package deal and one need to hack around the same. During the days of the [Eolas Patent](http://news.com.com/2100-1032_3-5106129.html), the workaround where Javascript was used to embed Flash, was indeed serving up a dual role to attain Web Standard compliancy. But then that the Patent is no more a worry, the tiresome work-around is thus better left alone.

[Geoff Stearns](http://blog.deconcept.com/) wrote an article, [Web standards compliant Javascript Flash detect and embed](http://blog.deconcept.com/2004/10/14/web-standards-compliant-javascript-flash-detect-and-embed/) which then gave birth to the ultimate in Standard Compliant Flash Object/Embed, the [SWFObject](http://blog.deconcept.com/swfobject/).

## UPDATES

I think I will just add some more text to make things easier and able to just read this to understand the core requirement, functionalities. The method have the ability to detect the Flash player major version and thus decide either to display the "swf" or an alternate content; even better as it can be bypassed just in case user has Flash but the detect failed for some reason(s). The method have have the ability to include additional parameters and variables passed to the "swf" via the Flashvars.

```as
// To pass Flashvars
var myFlashObject = new FlashObject("flashvars.swf", "flashvarsID", "500", "300", 7, "#ffffff");
myFlashObject.addParam("flashvars", "&flashVarTxt=From FlashVars");
myFlashObject.write();
```

Another cool features was the ability to target a specific element to place the "swf" in by passing an element id in the write() method;

`myFlashObject.write("mydiv");``

Well, this will be even better when we want to have content at the top hierarchy of the html while keeping the "swf" container script away from the same. For instance, you can have an "swf" masthead but use the script at a lower hierarchy so that search engines will find the actual content first and our tags/scripts later.