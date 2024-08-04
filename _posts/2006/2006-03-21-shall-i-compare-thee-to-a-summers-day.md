# Shall I Compare Thee to a Summer’s Day?

Everybody wrote this; it is still too tempting not to mention it here.

William Shakespeare's Sonnet - [Shall I Compare Thee to a Summer's Day?](https://en.wikipedia.org/wiki/Sonnet_18).

```as
// Sonnet 18: Shall I compare thee to a summer's day? by William Shakespeare
// ported to ActionScript 2.0 by Satori Canton
var summer:Object = {};
var thee:Object = {};
summer.name = "Summer Day";
thee.name = "Thee";
summer.lovelyness = 9;
thee.lovelyness = 10;
summer.temperature = 98;
thee.temperature = 98.6;
summer.lease = new Date(2006, 7, 31).getTime() - new Date(2006, 5, 1).getTime();
thee.lease = new Date(2042, 6, 12).getTime() - new Date(1970, 8, 25).getTime();
summer.complexion = 0xFFCC33;
thee.complexion = 0xFFCCCC;
summer.fair = 10;
thee.fair = 10;
//
summer.getValue = function():Number {
  return --this.fair;
};
thee.getValue = function():Number {
  return this.fair;
};
summer.incrementTime = function():Number {
  return --this.lease;
};
thee.incrementTime = function():Number {
  return this.lease;
};
//
var man:Object = {};
man.hasEyes = true;
man.canBreath = true;
man.lease = 10000;
man.liveLong = function():Void {
  this.lease *= 10;
};
man.giveLife = function(o:Object):Void {
  o.lease++;
  trace(o.name + " is given life");
};
man.compare = function(o1:Object, o2:Object):Void {
  if (this.canBreath && this.hasEyes) {
    this.liveLong();
    var n1:Number = 0;
    var n2:Number = 0;
    var o1isBetter:Boolean;
    for (var i in o1) {
      if (typeof (o1[i]) == "function") {
        o1isBetter = o1[i]() > o2[i]() ? true : false;
      } else {
        o1isBetter = o1[i] > o2[i] ? true : false;
      }
      n1 += Number(o1isBetter);
      n2 += Number(!o1isBetter);
    }
  this.giveLife(n1 > n2 ? o1 : o2);
  }
};
man.compare(summer, thee);
```