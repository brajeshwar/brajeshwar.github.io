# ContextMenu, is that for 8Ball?

The introduction of `@ContextMenu@` and `@ContextMenuItem@` in Flash player 7 was a good move from Macromedia. But, it is still in a very nascent stage and is not really that usable. Every since its early release of the Player, I had always felt that it can be put to good use but never got a project right enough to implement the same. When finally there was a real need for a real *Right Click Menu*, I am sorta stump as a proper implementation was not that possible!

Personally, I feel the current implementation of the `@ContextMenu@` is a bit incomplete. The problem with the player's implementation is it only allows context menus to be added to movieclips that are on the root stage. You cannot have context menu's in nested movieclips.

In any medium sized application there will be atleast 3 tiers of `@MovieClips@`. Let us see the below hierarchy for an instance;

```
_level0
     mcFoo
         mcItem01
         mcItem02
     mcBar
         mcToolButton01
         mcToolButton02
```

and so on. Now we can attach right click menus on mcFoo, but not on mcItem01 where it is also really needed. Further there is a possibility that we need to have links rendered on a separate movieclip in mcFoo, etc.

This is either an oversight or a bug with the implementation of the `@ContextMenu@` support in flash 7 player. With the current implementation it is not possible to have right click menu support in many Typical Applications at all.