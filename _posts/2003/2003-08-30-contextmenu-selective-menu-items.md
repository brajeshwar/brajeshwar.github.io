---
layout: post
title: ContextMenu; selective menu items
---

With Flash MX 2004, it is now known that you can play around with the context menu that you get when you right click (win) and Control click (mac). The ContextMenu can be attached to a Button, MovieClip or a TextField and to the Flash Movie itself. For Buttons, MovieClips and TextField, this can be used with the newly introduced "menu"; Button.menu, MovieClip.menu and TextField.menu respectively.

You can use the ContextMenu class with the standard menus on the Flash Context Menu like save, zoom, quality, play, loop, print, settings, debugger, About Macromedia ... and edit menus like, cut, copy, paste etc that you see in areas like text areas. Nevertheless, uptil the latest Flash player, the "Settings" and "About Macromedia ..." are fixed and cannot be removed.


Here is a simple example to hide selective menu items from the context menu.

```
conMenu_cm = new ContextMenu ();
//remove the menu items "zoom" and "quality"
conMenu_cm.builtInItems.zoom = false;
conMenu_cm.builtInItems.quality = false;
_level0.menu = conMenu_cm;
```

Here is another simple example to hide all built-in menus but show only selective ones.

```
conMenu_cm = new ContextMenu ();
//hide the BuiltInItems
conMenu_cm.hideBuiltInItems();
//show just the zoom
conMenu_cm.builtInItems.zoom = true;
_level0.menu = conMenu_cm;
```