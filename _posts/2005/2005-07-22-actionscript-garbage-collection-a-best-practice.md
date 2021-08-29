# ActionScript Garbage Collection, a Best Practice

At the end of last month, I posted an article about [Cleansing your ActionScript codes](/2005//cleansing-your-actionscript-codes/); somewhere there seem I can still add a few more to it.

`onUnload` is fired After the movieclip has been removed. So it is better to remove external references before they are deleted. For instance if your movieclip(myMC) is subscribed to a component(myButton) that is outside it with `addEventListener`, then myButton would have a reference to myMC. So before destroying myMC it would be better to delete the reference myMC in myButton by using `removeEventListener`.

Similarly if you have an external reference to other outside objects in your class you need to remove them before you delete your movieclip.

For movieclips we can wrap all this into one dispose method that removes itself after deleting external references. So,

```as
myMC.dispose ();
myMC.removeMovieClip ();
//
//would be shortened to
myMC.dispose ();
```

where `myMC.dispose` would also remove itself at the end.
