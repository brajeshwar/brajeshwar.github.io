# Adobe AIR and Security

I was reading an Adobe article about an upcoming security update for Flash Player in this month of April, 2008. The Flash Player security update provides further mitigations for issues listed in the December 2007 <a href="http://www.adobe.com/support/security/bulletins/apsb07-20.html">Security Bulletin ABSP07-20</a> for DNS rebinding and cross-domain policy file vulnerabilities, and <a href="http://www.adobe.com/support/security/advisories/apsa07-06.html">Security Advisory APSA07-06</a> for cross-site scripting vulnerabilities in SWFs.

Well, the Adobe AIR shares technology with Flash Player and thus it is likely that Adobe AIR too will get an update with these fixes. This prompted me to do a rather lengthy article on a related topic -- Adobe AIR and Security -- which have been lingering in my to-do list for quite a while. Lengthy but this article will still fall short of all the details of AIR security as it is a big subject in itself.

What is affected? What should AIR developer care about?

From AIR perspective, this is a very minute update and is likely that most existing AIR applications will continue to work without requiring any change. Nonetheless, certain applications that may be affected which are subject to the same security restrictions in the updated Flash Player;

* SWF or HTML content loaded from outside of the application (for example, from a web URL or from a local directory)
* SWF content hosted within HTML in an AIR application

If your AIR application is using affected content (non-application SWF/HTML; SWF in HTML) to do any of the following, consult Adobe's <a href="http://www.adobe.com/devnet/flashplayer/articles/flash_player9_security_update.html">Flash Player 9 security update article</a>;

* Use sockets or XMLSockets, regardless of the domain the SWF is connecting to
* Use `addRequestHeader` or `URLRequest.requestHeaders` in any network API call when sending or loading data cross-domain or Rely on cross-domain access to web services, where HTTP headers are used to interact with the service
* Uses SWFs that are exported for Flash Player 7 or below that communicate with the hosting HTML by any means
* Uses '"javascript:'" through network APIs to communicate outside a SWF

Installing/Upgrading the new AIR should just replace your current AIR version. The application descriptor does not require change. Any other Applications that do not rely on these types of content will not be affected by the security update. Specifically, all-SWF and all-HTML applications where all content files are loaded from the application's directory will remain unaffected. It may be noted that, the AIR runtime periodically checks to see if any updates are available. Once an updated version is detected, the AIR runtime will download it in the background and automatically install it.

However, this is very unlikely to have anything to do with the <a href="/2008/adobe-air-ready-for-linux/">Adobe AIR for Linux Alpha</a> release as it was dropped very recently. But keep a watch eye over Adobe if you're developing or using Adobe AIR applications.

Adobe AIR (erstwhile Central, Apollo)

If you were one of those veterans who have heard, seen and beta-tested <a href="/2003/macromedia-central-10/">Central</a>, <a href="/2007/apollo/">Apollo</a>; you'd know of the three striking technical and business topics that overwhelm the applications -- Branding, Licensing and Security. Out of these three, I believe, starting with Apollo, Adobe AIR have solved the issues of 'Branding' and 'Licensing'. What left is Security and this is something which will remain, we'll continue to fight.

Talk about Adobe Applications and Software Security, then the <a href="http://blogs.adobe.com/stateofsecurity/">blog of Adobe's Lucas Adamski</a> is the place to look for. We know that Adobe AIR is kinda-sorta-Desktop-Web Application which means it inherits the security issues of both the web and the desktop, it even makes it more compound due to the fact that it access the web from the desktop and vice-versa in-a-way. 

In his article -- <a href="http://www.adobe.com/devnet/air/articles/introduction_to_air_security.html">Introducing the Adobe AIR security model</a>, Lucas says

A desktop application has certain characteristics. On the one hand, desktop applications generally have a lot more privileges than a similar web application, as they have been installed by the user to a specific desktop machine, implying a degree of trust that is greater than that of arbitrary web content. On the other hand, the privileges inherent in a desktop application require a greater degree of caution as certain coding practices and patterns that may be common in web applications may never be acceptable in a desktop application.

During the initial Installation and eventual update of AIR Applications, an inherent security information is provided to a user. (a) It displays the publisher name and the certificate that is used with the application. (b) There is also the aspect of Code Signing which is a process of digitally signing code to ensure the integrity of an AIR application. Developers can sign AIR applications with a certificate issued by a Certification Authority or by constructing a self-signed certificate. These two broad aspects of AIR Security, though, is not the focus of this article. We'll talk more about AIR Security at the Sanbox level, at the core of the AIR Application processes.

The Security Sandboxes

Adobe AIR have an intricate security architecture that categorically defines permission for all the files beloging to the application. These are files that are part of the "application" and other files "loaded" by the application. Security restrictions are imposed depending on the oring of these files.

Broadly;

* Files that resides in the application directory are allocated the application security sandbox.
* Files that are outisde of the application directory are assigned to a non-application security sandbox.

Application Security Sandbox

When an AIR is installed, it loads some files to a user's computer and they go inside a directory which is termed as the Application Directory. They are automatically put in the Application Security Sandbox. They have access to all the AIR APIs and can do lots of things including the security risk operations -- read and write files, draw to the screen, communicate with the network, etc..

So, it will be comforting to say that the AIR security model of sandboxes is infact the Flash Player security model with this additional "Application Security Sandbox".

The runtime uses these security sandboxes to define the range of data that a file may access and the operations it may execute. To maintain local security, the files in each sandbox are isolated from the files of other sandboxes. For example, a SWF file loaded into an AIR application from an external Internet URL is placed into the remote sandbox, and does not by default have permission to script into files that reside in the application directory, which are assigned to the application sandbox.

Non-Application Security Sandbox

The other files and request from a network or internet are thrown into the "Non-Application Security Sandbox". They are imposed the same set of restrictions as SWFs running on the Flash Player inside a Web Browser. Unlike content in the application security sandbox, HTML code in a non-application security sandbox can use JavaScript methods to execute dynamically generated code at any time. They have no access to the privileged AIR APIs that provide application functionality.

The villainy of "Desktop + Web"

We are so used to the browser security sandbox that we tend to ignore most of security issues originating from the web and inflicting our desktop environment. Everybody is also smart enough to realize that without a user intervention, it is almost impossible to do any harm to your computer from the web by-passing your browser's security sandbox. Well, there are numerous methods and ways a web application works that would be too dangerous to be combined with the local system access inherent to a Desktop Application. With our Desktop Applications, we take it for granted that it should have access to our systems -- download, install and run. "This in theory allows the user to inspect and approve the application before installing or running it for the first time."

Now, we take it for granted that the desktop application will inform us if it is downloading and installing anything -- updates, plugins, etc. -- this happens even if we give it the access to do the updates automatically on its own. Well, security breaches happens when this thin red line is crossed -- when the application tries to bypass the user and does things on its own. This is where your Desktop Application Security Sandbox comes in and prevents any impending catastrophe.

The security model for the HTML application sandbox in AIR varies significantly from the sandbox available in the browser. The reason behind this is there are a number of design and implementation patterns common to HTML web applications that are too dangerous to be combined with the local system access inherent in the AIR application sandbox.

Adobe AIR is the super easy way to develop Desktop + Web Combo applications and Developers can use their existing skills -- HTML, Ajax, Flash. Eventually, a developer may be tempted to wield his/her web-dev-power such as remote script import, use of dynamic script generation and injection of innerHTML and outerHTML DOM elements. These actions are pretty common and normal in the world of HTML. However, such practices are not allowed within the AIR security sandbox.

Well, what it actually means is -- look at the Adobe AIR security model more like that of a Desktop one -- rather than a web application. Henceforth, with the restrictions upon dynamic coding and script import, the AIR Application sandbox is referred by Adobe as the safest sandbox to place your application code, as the risk from injection attacks is greatly reduced as compared to a typical browser security sandbox. The application sandbox in AIR thus restricts or prohibits a number of APIs even if it provides direct access to the system APIs.

Developers and AIR Security

Well, with great power comes great responsibility.

Because AIR applications are natively installed, they have a different security contract with the end user. This contract between the application and the end user is made at install time just like native applications, and it includes the capability for the application to read and write across the local file system. Unless there are administrator restrictions applied to the user's computer, AIR applications are privileged to write to any location on the user's hard drive.

This freedom comes with a higher degree of responsibility for developers. Accidental application security gaps jeopardize not only the functionality of the application, but also the integrity of the user's computer. Developers should be careful and stay within the user and application specific storage directory for their AIR applications. Applications may use the encrypted local store to store information that must be secured, such as login credentials for web services.