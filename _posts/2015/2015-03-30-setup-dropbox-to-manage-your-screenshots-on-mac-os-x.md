# Setup Dropbox to manage your screenshots on Mac OS X

There are quite a lot of Screenshot management apps for Mac OS X. I like most of them but I also like <a href="https://db.tt/Ko3m4LDu" title="Dropbox">Dropbox</a> a lot. With the Screenshot management feature from Dropbox, you can now do away with all those Screenshot apps and use the tool you already have.

First, enable Dropbox to handle your Screenshots.

<img class="large" src="/static/2015/dropbox-screenshots.png" alt="Dropbox > Settiings > Import">

Second, drop your OS X screenshots automatically into Dropbox's Screenshot folder.

<em>Via the Terminal

`$ defaults write com.apple.screencapture location ~/Dropbox/Screenshots/;killall SystemUIServer`

Or use a utility such as <a href="http://www.titanium.free.fr/onyx.html" title="OnyX">OnyX</a>

<img class="large" src="/static/2015/onyx-screenshot.png" alt="OnyX">

I'm guessing you can do this on Windows and Linux too if you can automatically drop your screenshots to the Dropbox/Screenshots folder.

Now, the screenshots you take with your OS X is now in Dropbox and the URL is copied and ready to be pasted anywhere.

> Aside: I use [Hazel](https://www.noodlesoft.com) to clean up my Screenshots folder to remove file older than a month. You can use any of your favorite cleaning utility to clean yours to avoid Screenshots piling up your Dropbox folder.

Just in case:

- <kbd>CMD</kbd> + <kbd>SHFT</kbd> + <kbd>3</kbd> Fullscreen Screenshot.
- <kbd>CMD</kbd> + <kbd>SHFT</kbd> + <kbd>4</kbd>, then drag crosshair - Screenshot of your desired area.
- <kbd>CMD</kbd> + <kbd>SHFT</kbd> + <kbd>4</kbd>, then <kbd>Spacebar</kbd> - Screenshot specific app, dialog boxes, etc.