---
layout: post
title: Flashcom Video Player Source
---

The title would have been much better if I can have a full sentence; "A Flashcom Application coded with OOP patterned to MVP, to detect user bandwidth and play specific FLV".

We have recently been fascinated by a fad; "no hanging codes on frames". You can remember the old days of Flash 5 when there was no option but to write piggy-bag codes on Buttons and MovieClips. But hey, there was [Flem](http://chattyfig.figleaf.com/flem/) by [Branden Hall](http://www.waxpraxis.org/), which helped you write codes pretty much on the frames and not really on top of the MovieClips. But then as Flash/ActionScript evolved into a more matured form, things have taken shape in a much better way.

The next step was collection of Scripts/Codes on a single frame on the main timeline if possible and a few ones on the frame(s) of nested MovieClips. But then with more advancement and the ability to code more and more in an OOP manner, we can now reduce the number of frames where codes are hung in your FLA. If you look at the current application, you can see a single include file that initialize the necessary modules and the presenter took over the whole thing. Well, you virtually write everything in your favorite Text-Editor without taxing on Flash to do the loooooooooong compilation everytime you publish your Flash Document (Movie). Oh! Yes, [MTASC](http://www.mtasc.org/) have been a boon for ActionScript 2 Compilation.

This application check the bandwidth speed of a user accessing the application and serves a particular flash video (flv) accordingly. The settings/configuration is configured in an external "config.xml".

The importance here is not really what the application can do but on how to approach, adapt a methodology on building a Rich Internet Application with AS 2.0, adapting OOP/DP.

The application uses Object Oriented Programming Methodology and is patterned closely to Model-View-Presenter. Macromedia Flash MX 2004 Professional was used for the application and coded in ActionScript 2.0.