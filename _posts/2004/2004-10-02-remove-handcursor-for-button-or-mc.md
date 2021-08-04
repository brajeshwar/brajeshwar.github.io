---
layout: post
title: Remove HandCursor for Button or MC
---

Here is a common reply to forum users for the querry, "How do I remove the hand cursor from all instance of Buttons or MCs without specifying it individually?".

Modify the script below to suit your needs. Apply it using `removeHand();`

```as
myRoot = this;
function removeHand() {
 for (i in myRoot) {
  if ((myRoot[i] instanceof Button) || (myRoot[i] instanceof MovieClip)) {
   myRoot[i].useHandCursor = false;
   }
 }
};
```