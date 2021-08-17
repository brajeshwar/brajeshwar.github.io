---
layout: post
title: Caesars Box
---

Here is the ActionScript code to break the code [128-10-93-85-10-128-98-112-6-6-25-126-39-1-68-78](/2004/128-10-93-85-10-128-98-112-6-6-25-126-39-1-68-78/).

```as
function decodeCaesarsBox (sCode, sDelim, sDict) {
 var a = sCode.split (sDelim);
 var sBox = " ";
 var a2 = new Array ();
 var n = a.length;
 var iRoot = Math.sqrt (n);
 if (iRoot == Math.floor (iRoot)) {
  for (var i = 0; i < n; ++i) {
   sChar = sDict.charAt (Number (a [i])-1);
   sBox += sChar + "\t";
   if ((i+1)%iRoot == 0) {
    sBox += "\r ";           
   };
    a2.push (sChar);
  };   
 trace ("> Caesar's Box");
 trace (sBox);
 var a3 = new Array ();
 i = 0;
 var j = 0;
 while (a3.length != a2.length) {
  a3.push (a2 [i]);
  i += iRoot;           
  if (i >= a2.length) {
   i = ++j;
  };
 };
 trace ("> In Straight line");
 trace (a3.join (""));
 } else {
  trace ("Error, Caesar's box only works on perfect squares");
 };
};
```