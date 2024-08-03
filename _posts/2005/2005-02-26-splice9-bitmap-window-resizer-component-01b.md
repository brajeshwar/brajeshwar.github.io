# Splice9 - Bitmap Window Resizer Component 0.1b

"Wow! This is so nice. I finish my 2 weeks work in a day", was from a phrase of one happy e-mail we received long back during the early third quarter of the year 2004. The e-mail was from a client who doubles up as a Graphic UI Layout Designer. We did a JSFL command panel for chopping and resizing windows for a heavy windows intensive Enterprise Flash Application. Its basic function was to chop up a selected bitmap into desired slices of 3x3, 3x1, 1x3 according to the type of windows our code was to apply resizing to graphically themed windows.

## Splice9

Splice9 crops a selected bitmap into 9 pieces and put them inside a MovieClip. Once the cropping is done, it creates assets (movieclips of 9 pieces) in library with a linkage name in a folder named Splice9 and brings the MovieClip to the stage and 

- names those instances,
- create layers,
- writes required actionscript,
- saves the file,
- publishes it.

And what you get a ready-made resizeable window!

How to use it?

- Create a reverse oinam.com domain class util package; "com.oinam.util"
- Install Splice9 class (Splice9.as) in "com.oinam.util" folder
- Install the Spilce9.mxp
- Run command Splice9 inside Flash IDE; Commands > Splice9

You can use the Splice9 class anywhere you like, in that case, change the class Splice9 and the generated codes in the Window MC.

Note;

In order to review in published html page in a browser, the html settings of width and height of emdedded swf movie should be 100%. It may be noted that the published HTML by Macromedia Flash by default is a Transitional HTML 4.01 Doctype thus it won't make it 100% in browsers like Firefox, just remove the doctype and set it to quark mode and test it.

Will not auto-Publish

Actually if the symbol is created properly there is no need to actually jump into that symbol? Use the symbol to the spliced mc in code and test perhaps, but jumping inside the symbol to see if things work, seems like a debugging feature.

Default Resize dimension

It would be useful to have it scale to an initial dimension, say splice into 3x3 grid, and make its initial size say 400x300, with the splices resized by jsfl.

Actually here's another idea!

After doing the splicing we have a 3x3(or 3x1,1x3, etc) grid. What if we allow the grid to be resizable with a custom scale-resize tool? Custom tools are possible in flash. So you select the bitmap, click the window resize command, select splice options and you get a spliced mc. Instead of going inside the spliced mc, the symbol on stage could then be made selected with the custom scale-resize tool. So now you can stretch the symbol and it would stretch the inside splices instead of the whole mc. This would be very useful for panel backgrounds, and any other windows. So basically you have an authortime equivalent of the Splice9 class. And this would be useful for designers also!

Well, it may be a wise idea that you add a package folder in your common ActionScript Packages as sources released from Oinam.com will likely go there. And we plan to release useful utility classes and other classes after about 6 months or so. Nonthless, we might modify the same for general public consumption, apply restriction to the license et al. So, if you wish to use our free classes, please have a folder hierarchy in your ActionScript class Repository; `com > oinam`. You are though free to change the opensource files to your wish.

What is an ActionScript class path?

By default, Flash will read a class located at the same folder root as the FLA or from the `classes` folder of your Macromedia Flash Installation.

How to custom configure class path?

You need to configure the ActionScript paths in your Flash IDE.

Make the current directory `(.)` in the AS2 settings of Flash to be on top of the default class path. This enables overriding classes in MM's classpath with local modified versions. Then you can either have your custom class path after that or follow after Macromedia's path.

A typical order would look like,

```
.
/Repository/AS2Classes
$(LocalData)/Classes
```

The second one here is the one where you can add `com > oinam` for your usage. Currently for this source file, add another folder `util` and put the ActionScript class there.