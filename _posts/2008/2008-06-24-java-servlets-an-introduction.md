# Java Servlets, an introduction

We've been talking a lot about Linux lately. Let's break out a bit from that and talk about another topic -- the Java Servlet Technology. We'll try to cover some basic aspects of <a href="http://java.sun.com/products/servlet/">Java Servlet Technology</a> and may be a little more.

To give you a basic idea, Servlets are the server side components that are the Java counterpart to dynamic web content technologies like CGI, PHP and ASP.NET.

A lot of techniques have been developed to overcome the problems associated with Common Gateway Interface (CGI) and Servlets lie among them. Now, if you're unsure of the problems associated with CGI then you need to move back to the early days of the Web. In the early days of Web, a server could construct a page dynamically but a separate process was required to handle each request, separate processes were required to read the data from the HTTP request and to write the data to the HTTP response, separate processes were required to communicate with the database. All these activities required a lot of server resources and hence, resulted in the development of programs that were not able to deliver the expected performance.

Servlets were introduced to overcome these problems and now, Servlets have gained a lot of popularity among developers for creating a number of server applications. So, what're Servlets? Servlets are the small programs that are run on the server side of the connection and they're used to dynamically extend the functionality of a web server. They follow the standard framework, use portable Java language and so, developers can use Servlets for creating efficient server side applications that can run on any Servlet enabled web server.

As such, Servlets are not designed for any specific protocol but they're mainly used for processing HTTP requests. It uses the classes available in the Java packages -- `javax.servlet.http` and `javax.servlet`. In addition to this, Servlets run inside the Java Virtual Machine and they enjoy the access to the entire family of Java APIs.

A Servlet is basically a Servlet class that implements the Servlet interface. Specific methods are to be implemented in order to create a Servlet meant for processing client requests and it is the web developer's duty to carefully implement these methods. If the methods are not implemented to process a certain request then an error is generated when that particular request is encountered.

Life Cycle of a Servlet

`init()`, `service()` and `destroy()` methods are central to the life cycle of the Servlet as they're implemented by every Servlet and these methods are called at specific times during the life cycle of the Servlet.

Here's a typical scenario so as to understand when these methods are called --

* Whenever an end-user enters a web address into the web browser, the web browser generates an HTTP request for the same. This request is sent to a server which maps it to a particular Servlet. The appropriate Servlet is then dynamically loaded into the address space of the web server.
* The `init()` method is invoked by the server and the method can be used to pass on the initialization parameters to the Servlet. The `init()` method is called only once in the entire life of the Servlet and it must be called before the Servlet can be used to service any request.
* The `service()` method is then invoked so as to process the HTTP request and each request is to be serviced in its own separate thread. It can also be used to generate an HTTP response after reading and processing the HTTP request. Once a request has been serviced, the Servlet remains in the address space of the server and it is available to process other requests received from the clients.
* The `destroy()` method is called to unload the Servlet from server's address space. It relinquishes the resources allotted to the Servlet before taking it out of the service. The `destroy()` method is also called only once in the entire life of the Servlet.

As Servlets are written in Java, they offer a number of advantages over CGI programs which suffer from serious performance problems. Some of the advantages of using Servlets over CGI Programs --

* A Servlet executes within the address space of the server and so, a separate process is not required to handle each request as there are N threads available for a single copy of the Servlet class. This results in better performance.
* A Servlet can easily communicate with databases, applets or with other software through sockets as the full functionality of the Java class library is available to it. This makes Servlets very powerful when compared to the CGI programs. This also results in better performance.
* Servlets inherit the safety features provided by the Java language. Java's exception handling mechanism allows a Servlet to easily handle the errors. They're also safe from the memory management problems because of Java's automatic garbage collection feature.
* Servlets are WORA programs i.e. write once, run anywhere programs as they're written in Java. The platform-independent feature of Servlets is a great advantage as it allows us to create Servlets that can be used on the servers with different operating systems and different implementations.
* A Servlet is also benefited with the Java Security Manager which enforces a set of restrictions so as to protect the resources of the server. This makes Servlets more secure when compared to the CGI programs.

To conclude, Servlets offer a number of benefits and enjoy the access to the entire family of Java APIs which allow web developers to use Servlets for creating a number of server side applications meant for serving different purposes. These days, Servlets are a popular choice among developers for creating portable, secure, robust, interactive applications. 

Well, there's a lot to be covered for Java Servlets but for now, I believe you must have gained some insight into what're Servlets and what're the benefits of using Servlets. I'll be writing more articles discussing the various interesting aspects of Java Servlets so keep reading this site.
