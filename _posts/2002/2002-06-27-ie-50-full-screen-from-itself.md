# IE 5.0 + full Screen from itself

There was some discussion on the Macromedia Flash Forum about Full screen from the page itself. I just thought I will share that too here. You may alternatively have the click to be onLoad of the Body so that the browser goes fullscreen on load itself.

Have the folllowing Javascript

```
function fullscreen(){
 var hdiff;
 window.moveTo(-4,-4);
 window.resizeTo(screen.width,screen.height);
 hdiff=window.screenTop;
 window.moveTo(-6,-hdiff-7);
 window.resizeTo(screen.width+13,screen.height+hdiff+35)
}
```

and on your link put a `href=""javascript:fullscreen();"`.
