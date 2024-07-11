# min-height, max-width, min-height, max-height

A dreamweaver list friend of mine, ask me to test a page of his on my IE 5+ on a Windows OS and I learn something very useful. You must have seen and designed some or the other form of liquid (stretchable) design. You would have successfully done liquid table layouts but you must have the itchy feeling that you should also do this with text, so that they become stretchable according to the dimension of the browser.

This is possible with the [CSS2 standard (CSS2 standard)](http://www.w3.org/TR/REC-CSS2/) but this does not work in IE 5+. Neverthless, there is a work-around to this, check this [nifty Javascript](http://and.doxdesk.com/file/software/js/minmax.js) that solves the problem. Just tug [this Javascript ()](http://and.doxdesk.com/file/software/js/minmax.js) in your HTML.

Now, You can have something like;

```
.myStyle {
	width : 50%;
	max-height : 12px;
	max-width : 4px;
	min-height : 10px;
	min-width : 2px;
}
```