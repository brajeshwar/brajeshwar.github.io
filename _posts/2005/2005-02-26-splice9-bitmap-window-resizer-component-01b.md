---
layout: post
title: Splice9 - Bitmap Window Resizer Component 0.1b
date: 2005-02-26 20:34:09.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135615143'
  bitly_short_url: http://j.mp/kPlodc
  retweet_cache: '1309564601:0'
  trx_addons_post_views_count: '43'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/splice9-bitmap-window-resizer-component-01b/"
---
<p>"Wow! This is so nice. I finish my 2 weeks work in a day", was from a phrase of one happy e-mail we received long back during the early third quarter of the year 2004. The e-mail was from a client who doubles up as a Graphic UI Layout Designer. We did a JSFL command panel for chopping and resizing windows for a heavy windows intensive Enterprise Flash Application. Its basic function was to chop up a selected bitmap into desired slices of 3x3, 3x1, 1x3 according to the type of windows our code was to apply resizing to graphically themed windows.</p>
<p>*Splice9*</p>
<p>__What does it do?__<br />
Splice9 crops a selected bitmap into 9 pieces and put them inside a MovieClip. Once the cropping is done, it creates assets (movieclips of 9 pieces) in library with a linkage name in a folder named Splice9 and brings the MovieClip to the stage and </p>
<p>* names those instances,<br />
* create layers,<br />
* writes required actionscript,<br />
* saves the file,<br />
* publishes it.</p>
<p>And what you get a ready-made resizeable window!</p>
<p>"Preview (Preview Splice9)":http://www.brajeshwar.com/downloads/jsfl/splice9/ | "Download (Download Splice9)":http://www.brajeshwar.com/downloads/jsfl/splice9/Splice9.zip (MXP and Sample File)<br />
<!--more--><br />
__How to use it?__</p>
<p># Create a reverse oinam.com domain class util package; "com.oinam.util"<br />
# Install Splice9 class (Splice9.as) in "com.oinam.util" folder<br />
# Install the Spilce9.mxp<br />
# Run command Splice9 inside Flash IDE; Commands > Splice9</p>
<p>__You can use the Splice9 class anywhere you like, in that case, change the class Splice9 and the generated codes in the Window MC.__</p>
<p>[*Note*:<br />
In order to review in published html page in a browser, the html settings of width and height of emdedded swf movie should be 100%.<br />
It may be noted that the published HTML by Macromedia Flash by default is a Transitional HTML 4.01 Doctype thus it won't make it 100% in browsers like Firefox, just remove the doctype and set it to quark mode and test it.]</p>
<p>*What more is coming?*</p>
<p>* A Commercial Version (contact us if you want to be informed or want a copy, it may be free or we may charge a very minimal fee)<br />
* Use of SWF instead of XUI.<br />
Because XUI cannot repopulate fields but an swf can have prepopulated numbers and at the same time remember what was the last value. This will help in repetitive splicing.</p>
<p>* Will not auto-Publish<br />
Actually if the symbol is created properly there is no need to actually jump into that symbol? Use the symbol to the spliced mc in code and test perhaps, but jumping inside the symbol to see if things work, seems like a debugging feature.</p>
<p>* Default Resize dimension<br />
It would be useful to have it scale to an initial dimension, say splice into 3x3 grid, and make its initial size say 400x300, with the splices resized by jsfl.</p>
<p>Actually here's another idea!<br />
After doing the splicing we have a 3x3(or 3x1,1x3, etc) grid. What if we allow the grid to be resizable with a custom scale-resize tool? Custom tools are possible in flash. So you select the bitmap, click the window resize command, select splice options and you get a spliced mc. Instead of going inside the spliced mc, the symbol on stage could then be made selected with the custom scale-resize tool. So now you can stretch the symbol and it would stretch the inside splices instead of the whole mc. This would be very useful for panel backgrounds, and any other windows. So basically you have an authortime equivalent of the Splice9 class. And this would be useful for designers also!</p>
<p>__Etcetera__</p>
<p>Well, it may be a wise idea that you add a package folder in your common ActionScript Packages as sources released from Oinam.com will likely go there. And we plan to release useful utility classes and other classes after about 6 months or so. Nonthless, we might modify the same for general public consumption, apply restriction to the license __et al__. So, if you wish to use our free classes, please have a folder hierarchy in your ActionScript class Repository; @com > oinam@. You are though free to change the opensource files to your wish.</p>
<p>__What is an ActionScript class path?__<br />
By default, Flash will read a class located at the same folder root as the FLA or from the *classes* folder of your Macromedia Flash Installation.</p>
<p>__How to custom configure class path?__<br />
You need to configure the ActionScript paths in your Flash</p>
<p>Make the current directory (.) in the AS2 settings of Flash to be on top of the default class path. This enables overriding classes in MM's classpath with local modified versions. Then you can either have your custom class path after that or follow after Macromedia's path.</p>
<p>A typical order would look like,</p>
<p>.<br />
D:\Repository\AS2Classes<br />
$(LocalData)/Classes</p>
<p>The second one here is the one where you can add @com > oinam@ for your usage. Currently for this source file, add another folder @util@ and put the ActionScript class there.</p>
<p>"Preview (Preview Splice9)":http://www.brajeshwar.com/downloads/jsfl/splice9/ | "Download (Download Splice9)":http://www.brajeshwar.com/downloads/jsfl/splice9/Splice9.zip (MXP and Sample File)</p>
