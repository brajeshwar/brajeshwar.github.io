---
layout: post
title: Classed stage objects with empty library
date: 2004-08-18 01:03:29.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- ActionScript
- flash
- Peter Hall
meta:
  _edit_last: '1'
  adman_disable: 'on'
  dsq_thread_id: '135614933'
  bitly_short_url: http://j.mp/iGyUnz
  retweet_cache: '1309584611:0'
  trx_addons_post_views_count: '37'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/classed-stage-objects-with-empty-library/"
excerpt: 'Every class is compiled into a swf in the same way that we used to include
  AS1 classes, by putting them inside an #initclip block of a linked movieclip. The
  linkage name of the movieclip is @__Packages@ followed by the full package and class
  name.'
---
<p>If you wish to read the original article instead of this one which I am archiving for my own reference as I keep scrambling for the link everytime I try to refer to, then head over to Peter Hall's post on How to create classed stage objects with an empty library? Below is the reproduction of my friend, Peter Hall's article;</p>
<p>Some time back, Peter Hall reported that every class is associated with a library symbol. This means that every class has a corresponding library symbol with a predictable linkage name derived from the full class name. So, we can simply include a component without adding a symbol to the library. Well this help prevent tightly coupling your class codes from your FLA.</p>

<p>Every class is compiled into a swf in the same way that we used to include AS1 classes, by putting them inside an #initclip block of a linked movieclip. The linkage name of the movieclip is <code>"__Packages."</code> followed by the full package and class name. For example the class <code>com.peterjoel.data.XMLLoader</code> would be exported with a movieclip with linkage <code>"__Packages.com.peterjoel.data.XMLLoader"</code></p>
<p>If you are making a component, you can define it like this:</p>
<pre name="code" class="as">
class com.peterjoel.MyComponent extends UIComponent {
	 static var symbolName:String = "__Packages.com.peterjoel.MyComponent";
	 static var symbolOwner:Object = MyComponent;
	 // associate the symbol to the class when the class is defined 
	 static var symbolLinked = Object.registerClass(symbolName, symbolOwner); 
}
</pre>
<p>This will allow you to use the V2 method createClassObject, without worrying about the symbol. But you could do that anyway if you were using createClassObject because that assumes that you have included the V2 framework, so you would have the export symbol for UIObject available to "borrow" anyway. </p>
<p>But, using this linkage, you can just use attachMovie, without relying on the framework at all. For example, define a simple class that draws a coloured rectangle: </p>
<pre name="code" class="as">
class com.peterjoel.shapes.Rectangle extends MovieClip{
	 static var symbolName:String = "__Packages.com.peterjoel.shapes.Rectangle";
	 static var symbolOwner:Function = Rectangle;
	 public var width:Number = 100; 
	 public var height:Number = 100; 
	 public var color:Number = 0;
	 function Rectangle (){
			draw();
	 }
	 function draw():Void{
			beginFill(color);
			moveTo(0,0);
			lineTo(width, 0); 
			lineTo(width, height); 
			lineTo(0, height); 
			lineTo(0, 0); 
			endFill();
	 }
	 // associate the symbol to the class when the class is defined 
	 static var symbolLinked = Object.registerClass(symbolName, symbolOwner); 
} 
</pre>
<p><strong>Usage</strong></p>
<pre name="code" class="as">
import com.peterjoel.shapes.Rectangle;
var initObj:Object = {width:150, height:80, color:0xFF0000};
attachMovie(Rectangle.symbolName, "rect_mc", 1, initObj);
</pre>
<p>And for those who want a <a href="http://downloads.brajeshwar.com/flashmx2004/classwithemptylibrary/" title="view demo">quick view</a> of the simple downloadable <a href="http://downloads.brajeshwar.com/flashmx2004/classwithemptylibrary/classwithemptylibrary.zip" title="download">sample file</a>.<br />
[Disclaimer: I don't see it documented, so it is your choice.]</p>
<p>*Update*</p>
<p>In ActionScript 3.0, you can instantiate movieclip/sprites directly with new ClassName (). So @__Packages@ is no longer needed.</p>
