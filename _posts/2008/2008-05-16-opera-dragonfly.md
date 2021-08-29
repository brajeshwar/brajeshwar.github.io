# Opera Dragonfly, Easy web apps debugging

Opera released their new Developer Tools -- <a href="http://www.opera.com/products/dragonfly/">Opera Dragonfly</a> -- about a week back. The initial alpha version include

* JavaScript debugger
* DOM inspector
* CSS inspector
* Command Line to allow commands to be inputed
* Error Console that outputs validation errors and warnings exhibited by the CSS and JavaScript connected with the page
* Proxy to allow debugging directly on mobile devices

Upcoming versions will also support editing of CSS/DOM/JavaScript, a single window mode and XHR/HTTP Headers inspection. Opera Dragonfly is built using Web technologies (XML, CSS and JavaScript) and will auto-update when a new version is released. The application will run in a persistent cache, so that it is accessible when offline, and so that it doesn't have to communicate with the Opera server, except when it updates.

Opera Dragonfly will support all browsers that include the Core-2.1 rendering engine (except Opera Mini). This currently includes Opera 9.5 beta 2 and the forthcoming Opera Mobile 9.5 release.  A proxy exists that allows Opera Dragonfly on the desktop to communicate with Opera on supported mobiles and devices. This makes debugging on devices easier as you can use a regular keyboard, mouse and monitor.

The early Alpha launch was received with great enthusiasm from the developer community and Opera received lots of feedback from people. There are few things which developers have found and Opera Dragonfly team is working on them;

* There's a problem with the caching, which means that if you flush the cache and then try to launch Dragonfly while offline, you might run into problems.
* It doesn't run with Javascript disabled, another soon to be fixed bug.

The Opera Dragonfly is also working on the Scope documentation which they plan to release in the coming days.

Chris Mills' article on <a href="http://dev.opera.com/articles/view/introduction-to-opera-dragonfly/">Introduction to Opera Dragonfly</a> should give you much more details about Opera Dragonfly. <a href="http://dev.opera.com/articles/view/opera-dragonfly-architecture/">Opera Dragonfly Architecture</a> covers covers the architecture of Opera Dragonfly in detail, showing what the different components in the architecture are, and how they interact during Dragonfly's running.