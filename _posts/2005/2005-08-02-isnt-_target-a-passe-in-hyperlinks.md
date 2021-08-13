---
layout: post
title: Isn't _target a passe in hyperlinks?
---

I am not really a fan of html hyperlinks spawning new windows, my reason may be particularly because I use a tabbed browser (firefox) as my primary browser and I wish to remain in one window with tabs opened if needed be. Some people say, "I want surfers to stay on my site". But why, if they want, they will come back; why are you forcing them. And technically, it is also not part of newer specs anyway, xhtml 1.1 no longer have `_target`. It is the surfer/user who should decide if the link should be a flowing link from one to the other or to open a new window. If the user wants the link to open in a new window s/he will definitely do it manually. Why should one take away the choice from the user.

Jakob Nielsen's [Top 10 New Mistakes of Web Design](http://www.useit.com/alertbox/990530.html) have valid points. Quoting his Point No. 2.

`Opening New Browser Windows.`

Opening up new browser windows is like a vacuum cleaner sales person who starts a visit by emptying an ash tray on the customer's carpet. Don't pollute my screen with any more windows, thanks. If I want a new window, I will open it myself! Designers open new browser windows on the theory that it keeps users on their site.

But even disregarding the user-hostile message implied in taking over the user's machine, the strategy is self-defeating since it disables the Back button which is the normal way users return to previous sites. Users often don't notice that a new window has opened, especially if they are using a small monitor where the windows are maximized to fill up the screen. So a user who tries to return to the origin will be confused by a grayed out Back button.

Bloggers, web developers/designers, if you feel that this is not untrue, please do away with `_target` and let us give surfers the freedom to pick their choice.
