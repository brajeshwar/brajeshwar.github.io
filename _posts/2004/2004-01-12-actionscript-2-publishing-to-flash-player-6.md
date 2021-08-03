---
layout: post
title: Actionscript 2 publishing to Flash player 6
---

First, let me thank Mike Chambers, Peter Hall and Darshan for their help in getting me along on this topic. I will update this further in future when more things are discovered doing something along the way. You can also read something in the similar line at [Jesse Warden](http://www.jessewarden.com/)'s blog entry - Shared Libraries only work within same version SWF.

Actionscript 2 can be published to all versions of Flash Player 6. The main differences in AS2/FP6 and AS2/FP7 are

1. In FP6, when class A extends B, the constructor for B will get executed in a "dummy" fashion. This is because

`A.prototype = new B();`

is emitted to set up the inheritance chain. This behavior was fixed in FP7 by adding the sactionExtends bytecode, which the compiler now takes advantage of when publishing to FP7.

2. In FP6, casting between strong types will not fail and return null if the types are unrelated.

```
var a:ClassA;
var b:ClassB;
a = ClassA(b);
```

In FP7, if the classes are unrelated, you will properly get null. This is because the sactionCastOp bytecode is not supported in FP6.

3. In FP6, casting between interfaces doesn't work properly. This is because the sactionImplements bytecode is not supported in FP6.

Everything will also be case-insensitive in FP6, so you have to watch out for that too. Also, if you publish as vanilla FP6, it will be significantly slower than FP6 r65 or FP7. All of the V2 UI components were published to FP6 r65. And someone suggested me never to do casting if you are publishing to F6.
