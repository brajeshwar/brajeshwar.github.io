# Adobe announced BlazeDS, AMF Specification goes Open Source

On December 13th, Adobe <a href="http://www.adobe.com/aboutadobe/pressroom/pressreleases/200712/121307BlazeDS.html">announced</a> plans to release source code for its remoting and messaging technologies under a new open source product named <a href="http://www.adobe.com/go/blazeds/">BlazeDS</a>. BlazeDS is currently available as <a href="http://labs.adobe.com/technologies/blazeds/">beta</a> on Adobe Labs.

BlazeDS developers to easily connect to back-end distributed data and push data in real-time to Adobe Flex and Adobe AIR applications for more responsive rich Internet application (RIA) experiences.

Previously available only as part of Adobe <a href="http://www.adobe.com/products/livecycle/dataservices">LiveCycle Data Services ES</a>, Adobe is announcing its plans to contribute the proven BlazeDS technologies to the community under the LGPL v3. BlazeDS gives the rapidly growing Adobe developer community free access to the powerful remoting and messaging technologies developed by Adobe.

Along with the beta release of BlazeDS comes the new AMF binary data protocol specification. Adobe promises to make the source code available by early 2008. AMF dates back to 2001 when it was first introduced in Flash Player 6 and was overhauled for Flash Player 9 when Adobe moved to its new ActionScript Virtual Machine. AMF is primarily designed to facilitate binary serialization of ActionScript objects and types. The latest AMF 3 coincide with the release of ActionScript 3.0. AMF 3 also supports some new data types introduced in ActionScript 3.0.

The availability of the documentation will make it possible and way easier for developer to implement support for AMF in server-side programming languages that are currently not officially supported by Adobe. This will eventually help increase the adoption of AMF and make it easier for developer to incorporate <a href="http://www.adobe.com/go/flashremoting/">Flash Remoting</a> into new and existing Internet Applications.

"The combination of BlazeDS with Flex and Adobe AIR helps reduce the time it takes for developers to build responsive and highly innovative RIAs that deliver rich, dynamic, branded content and applications across all major browsers and operating systems," said David Mendels, senior vice president, Business Productivity Business Unit at Adobe. "Contributing these technologies, including the AMF specification, to the open source community opens them up for other non-Java backends, helping to rapidly advance this important RIA feature set."

<a href="http://blogs.adobe.com/pfarland/">Peter Farland</a>, of the Adobe Flex Team, urges the community to take advantage of the Proxy Service and to contribute to its functionality going forward;

The Proxy Service is often overlooked, but did you know that it provides the following capabilities?

- It provides better REST functionality with support for HTTP 1.1 PUT, DELETE, HEAD, TRACE, OPTIONS in addition to just GET and POST methods?
- It provides access to non-UTF8 formatted text as the Proxy should be able to read in many more character set encodings - because it is Java based the stream will be converted into UCS-2 internally and then the Proxy will always format this data back to the Flash Player as UTF-8?
- It allows 3rd party URLs to be aliased so that they do not have to be hard coded or exposed in your application (and Proxy destinations can also be locked down so that only authorized users can tunnel though to a 3rd party destination).
- It provides a way to get back the response data even when the HTTP status code is not 200?
- It provides a way to login to a 3rd party endpoint that issues a Basic Authentication challenge without exposing the pop-up to the end user (that is, you can build a custom Flex UI as a login form and set the remote credentials for the proxy to use in pre-authenticating to a 3rd party endpoint).