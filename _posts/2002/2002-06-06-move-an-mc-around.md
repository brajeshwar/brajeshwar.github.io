---
layout: post
title: Move an MC around
---

```as
// How to move your MovieClip around
MovieClip.prototype.moveAround = function(){
 Key.addListener(this);
 this.onKeyDown = function (){
  this._x += Key.isDown (Key.RIGHT)*1 - Key.isDown (Key.LEFT)*1;
  this._y += Key.isDown (Key.DOWN)*1 - Key.isDown (Key.UP)*1;
 }
};
```

```as
// How to apply
myMC.moveAround();
```