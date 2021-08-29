# IBM's Innovation - Open Source EGL Tools

IBM announced the release of <a href="http://www.eclipse.org/edt/">Eclipse EGL Web Developer Tool</a> version 0.7. It is the first open source version of its EGL development tool. EGL stands for Enterprise Generation Tools, which is developed by IBM. It is a programming tool deliberated to meet the challenges of new, multi platform application development by providing a common language and programming model across languages, frameworks and runtime podium. The language makes use of concepts familiar to anyone that uses statically typed languages like Java, COBOL, C, etc. On the other hand, the language borrows the notion of Stereotype from Universal Modeling Language, not usually found in statically typed programming languages. 

EGL is not just another language. The philosophy behind was to build up a new platform without implying to learn a new language. EGL has many great features like Source editing, Visual Editing, Rich Widget Library, Debugging, IDE Test Server, Database Access, Web services and Batch Programs.

As stated by Eclipse on the web, some of the features that make EGL different are:

- Common language, syntax and programming model across all parts of the application, regardless of where the code is deployed.
- Leverages proven, existing platforms such as web browsers and Java VMs and technologies such as Dojo, ExtJS, Java JPA by assembling into efficient, lower level code.
- Complements, does not replace existing technologies and existing infrastructure investments.
- Proven technology that is used by hundreds of enterprise customers all over the world.
- Extensible compiler and code generation framework that supports adaptation to the unique needs to specific developer communities and changing requirements.

## What can you do with EGL?

The current set of <a href="http://www.eclipse.org/edt/">Eclipse EGL tools</a> (delivered in the 0.7.0 release) are focused on simplifying the development of web solutions. With these tools one can:

- Visually construct modern rich applications that run in all popular web browsers, utilizing Dojo and other standard HTML widgets.
- Integrate with existing JSON and XML-based web services.
- Create web services that perform business logic and interface with relational databases.
- Test and debug end-to-end (browser to server) across the entire solution without needing to configure or deploy to a server.
- Deploy to a local Java application server (like Apache Tomcat) and export as a standard Java web archive (WAR).

There are 4 project templates given on the official <a href="http://xeglblog.blogspot.in/2011/10/welcome-to-official-eclipse-edt-team.html">Eclipse EDT team blog</a> to kick-start new projects:

- <strong>Basic</strong> - for developing EGL programs, services, and libraries.
- <strong>Web 2.0 Client</strong> - for developing rich web applications that use existing web services.
- <strong>Web 2.0 Client with Services</strong> - for developing rich web applications and new web services.
- <strong>Hello World</strong> - an example project that contains rich web application and service.

EGL is repeatedly illustrated as a <a href="http://en.wikipedia.org/wiki/IBM_Informix-4GL">4GL</a>. When EGL was only accessible in the context of IBM products and was a closed black box this view was reasonable. Nevertheless, the existing Eclipse operation is not just the repeat of that closed system in an open source arena. It is an entirely comprehensive and extensible framework for articulating domain specific concepts in a programming lingo, mutually with an extensible compiler / code generation framework. Being the programming language itself, EGL provides a syntax and compiler for producing and validating instances of the EGL meta model. The real deal is in the code generators that read these models to produce code. 

In addition to that, any code generator can be extended to include new programming model elements, or modify existing code generation patterns without disturbing the original generator. For example an extended generator would be one that was constructed upon the base Java generator, but was extended to understand how to map user interface application concepts to an Anroid runtime framework. New generators can be written to aim for runtimes that may not subsist today. For example, a new generator would be one that targets an Objective C runtime instead of Java or Javascript. 

IBM's resolution to make the most out of its EGL tooling source, did not come as a bombshell to any person who has followed IBM's action over the last few years as it relates to the a high level Enterprise Generation Language, that outputs Enterprise Java, Java Script, HTML and other Web Oriented languages. In a nutshell, EGL is a higher level, universal application development language. This tool is constructed on the free EGL community Edition software that IBM plant in 2008. It gives IBM i shops another option for developing rich Web applications that run on the <a href="http://www-03.ibm.com/systems/power/software/i/about.html">IBM i operating system</a> that can access RPG logic.

For sure, this is Big Blue's Big Bang!
