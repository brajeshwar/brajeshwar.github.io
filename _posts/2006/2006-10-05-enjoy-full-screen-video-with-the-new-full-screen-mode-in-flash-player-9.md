# Enjoy Full Screen Video with the new Full Screen mode in Flash Player 9

With the release of the new updates for Windows and Mac, besides fixing a bunch of bugs, Flash Player 9 will support Full Screen Mode on the web straight out of the browser.

Although full screen mode can be used for any type of Flash application, Flash video applications were the primary use case Adobe focused on in this initial implementation. For this reason, there are a number of security restrictions to full screen mode which may limit its usefulness with some fully interactive Flash applications or games. Adobe plans to address these limitations in future versions of the Flash Player as they continue to develop this feature.

Developers need to understand the following end-user security-related restrictions and design content accordingly. These restrictions apply to the Flash plugin and ActiveX control, but not to the Flash standalone player or Flash projectors.

- To enable full screen, developers must add a new object and embed tag parameter - 'allowFullScreen' - to their html. This parameter defaults to false, or not allowing full screen. To allow full screen, developers must set allowFullScreen to true in their object/embed tags.
- An overlay dialog will appear when the movie enters full screen mode, instructing the user how to exit and return to normal mode. The dialog appears for a few seconds, then fades out.
- The ActionScript that initiates full screen mode can only be called in response to a mouse click or key press. If it is called in  other situations it will be ignored (in ActionScript 2.0) or throw an exception (in ActionScript 3.0).
- Users cannot enter text in text input fields while in full screen mode. All keyboard input and key-related ActionScript is disabled while in full screen mode, with the exception of the keyboard shortcuts that take the viewer out of fullscreen mode.

Another enhancement that was added based on developer feedback is the ADDED_TO_STAGE and REMOVED_FROM_STAGE events to allow a DisplayObject to monitor and know when it can or cannot access its stage property. The ADDED_TO_STAGE event is dispatched to a DisplayObject when it (or the tree in which it is contained) is added to the stage. The REMOVED_FROM_STAGE event is dispatched to a DisplayObject when it (or the tree in which it is contained) is removed from the stage.

The list of reported issues that have been fixed in Update 1. (The numbers in brackets indicate the reported bug number)

- MovieClip.currentLabel behavior inconsistent with MovieClip.currentLabels. Returns null, but correct label name is expected. (169127)
- Setting stage.mouseChildren or stage.tabChildren to false does not disable mouse interaction for the stage's children. (175090)
- Method closures do not work as keys in a Dictionary. (177261)
- Pixel-snapped FlashType has incorrect spacing when scaled as compared to changing the point size of the font. (174530)
- Non-integer letter-spacing values in CSS corrupts text field rendering. Floating point values for letter-spacing in CSS are now supported. Previously, non-integer values were not handled correctly and text would not draw as expected. (182482)
- When the hitTestState of a SimpleButton is the same as any of the visible states, moving the SimpleButton instance will result in screen artifacts. Workaround: use a different shape instance for the hitTestState. (172822)
- When calling out to ExternalInteface for FSCommand various timer related events, such as "enter frame," no longer trigger. (178286)
- Pixel-based grid fitting does not work for Flash Player 9.0.20.0 for PowerPC or Intel-based Macintosh computers in Rosetta mode. Pixel-based grid fitting works in native mode on Intel-based Macs. Designers and developers that are using pixel-based grid fitting for Flash Type should use native mode on Intel-based Macs or the PowerPC version 9.0.16.0 if developing and viewing content on a PowerPC system. (180560)
- Crash in ActiveX control related to onSoundCompletion handling.(177131)