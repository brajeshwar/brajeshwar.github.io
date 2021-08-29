# Screenweaver HX - write haXe Desktop Applications

Screenweaver HX is the [haXe](/2005/haxe-programming-language/) wrapper to develop Desktop Application. With [SWHX](http://www.haxe.org/swhx), you create an application by using two layers;

1. the System layer : written in haXe and using the Neko API, you can access the local filesystem, databases, network sockets.
2. the Flash layer : written in haXe or any other technology capable of producing SWF, you can use this layer to display the graphical interface, handle user interactions, play sound and video.

You can communicate synchronously between theses two layers by using haXe Remoting. These two layers are both crossplatform and all you need is the SWHX Boot executable that is initializating the application.