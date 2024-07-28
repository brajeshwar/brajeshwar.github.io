# Alert Component, handling event in a better way

Something around the mid September, there was a post on using Alert Component for Flash MX 2004 Pro.

There had been a project (classified as of now) here where Alert Component was commissioned to be used for all Alerts (that is what they are for). Then couple of issues arose, of which, I am not sure if people have already known that, solved through a better way or have better ways of handling the issue. Like the examples in the doc and like the one in the recent post for the Alert component, a need arises to do something similar but from nested classes. If the function reference are specified like a normal callback, the scope in which the function is called becomes undefined. The need was to pass the handler object and the string callback function, so that callback is in the correct scope.

Well, according to the example in the docs the clickHandler is a function reference. But if you pass a function reference as a argument, the scope with which the function is called is not going to be what you need. To get around to this, a listener object which had a click method was used, instead of the function reference and it worked; found the tip in the Using Component Events tree. Now, should we say that the docs are wrong on this. You have to pass a listener object that is either handling the event the DOM way or listen to the event the new dispatcher way.

```ActionScript
this.confirmListener = {
 click:function (evt) {
  trace (evt.detail);
 };
};

var Alert = mx.controls.Alert;
Alert.okLabel = "Synchronize Now";
Alert.cancelLabel = "Add New";
Alert.yesLabel = "Close";
Alert.buttonWidth = 100;

Alert.show (
 "Message",
 "Confirmation",
 Alert.OK | Alert.CANCEL | Alert.YES,
 this,
 this.confirmListener,
 "",
 Alert.OK
);
```
