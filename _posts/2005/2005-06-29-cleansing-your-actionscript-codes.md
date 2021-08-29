# Cleansing your ActionScript codes

We all know that Flash uses only reference counting to do garbage collection. So, we have come to the decision that it is a wise idea to take special care to dispose circular references as these tend to hang around a lot. In ActionScript, take care that you are cleaning up external references before destroying or unloading movieclips. Our internal team usually have a dispose method in most of the objects that nulls external references before hand.

```as
// for movieclip subclasses
public function dispose ():Void
{
 externalRef = null;
 this.removeMovieClip ();
};
//
// for other class instances use something like
myObject.dispose ();
myObject = null;
```