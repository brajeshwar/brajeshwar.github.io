# Flex 1.5, an Introduction

Here is a brief write-up about my take on Flex 1.5. Not very exhaustive but highlights few features I like best. More to follow in eventual post along with my development phases. Out of the many [features](http://www.macromedia.com/support/documentation/en/flex/1_5/releasenotes.html#whatsnew) of Flex 1.5, I particularly liked RSL or the Runtime Shared Library, Remote Object and the History Manager the best.

RSL is an SWF which can have shared assets such as images, components, and even other SWF files. This file is extracted from an SWC file before distributing, and is cached locally by the Flash player. So, next time the Flex application is requested, the Flash Player loads the RSL from the local client's cache. The Flash player will try to get a new SWF File only when the RSL descriptor file or its dependencies change. Eventually, RSL allows us to have common external assets sharable across different applications and are more aptly usable for larger Flex Applications.

An RSL can be used after it is being defined or created with the .SWS extension.

```html
<library>
   <namespace uri="http://www.macromedia.com/2003/mxml">
   	....
   </namespace>
   <embed source="CommonLogo.jpg" symbolid="Logo" />
   <embed source="CommonStyle.swc" symbolid="Style" />
   <embed source="CommonAssets.swf" symbolid="CAssets" />
   ...
   ...
   ...
</library>
```

Then the RSL is accessed from your web directory

```html
<mx:application rsl="MyRSL.sws">
or
<mx:application rsl="MyRSL.sws;moreRSL.sws;anotherRSL.sws">
or a pre-compiled SWC file
<mx:application rsl="MyRSL.swc">
</mx:application></mx:application></mx:application>
```

*Remote Object* allows __Remoting__ in Flex, thus allowing us to call methods on Java Objects that is on a Java Application Server, __e.g.__ [JRun](http://www.macromedia.com/go/jrun/), where Flex is running. `RemoteObject` thus allows us to access JavaBeans including __Plain Old Java Objects__ which are in the web application classpath. The bottomline is, `<mx:remoteobject>` uses AMF, the encoding used Flash Remoting and as we all know, AMF is way faster and native to the Flash Player than other methods of communication like Web-Services, SOAP.

*History Manager* is another cool feature that have been pending in Flash for eons and when implemented, we still wished that it to be more better. History Manager allows the back and forward browser buttons to go back or forward to its previous/next states and this works beautifully across most modern standard browsers.