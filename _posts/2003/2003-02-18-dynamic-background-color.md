# Dynamic background color

Peter Hall posted a solution to setting the background color using Actionscript, actually drawing a rectangle on the background below any other elements on the document. Someone on the Macromedia Flash Forum re-iterated that question, so I thought some of you may still would like to have a look at a modified version.

This one will only fill the viewable stage and not the whole maximum allowable space of 5760 px of the Flash Document Scene.

```as
//define a var for sh and sw
//let us add 2 px each as flash eats them
//in the Stage Object from the actual flash dimension
var sh = Stage.height + 4;
var sw = Stage.width + 4;
var rp = 0; //let us have a start point
trace("stage height = " + sh + "& stage width = " + sw + " in pixels");
setBG = function (col) {
 with (_level0) {
  clear();
  if (col != undefined) {
   beginFill(col);
   moveTo(rp, rp);
   lineTo(sw, rp);
   lineTo(sw, sh);
   lineTo(rp, sh);
   endFill();
  }
 }
 this.__bg__ = col;
};
//
getBG = function () {
 return this.__bg__;
};
//
Stage.addProperty("bgColor", getBG, setBG);
delete setBG;
delete getBG;
```

How to use it -- `Stage.bgColor = 0x0000ff;`

That's it.