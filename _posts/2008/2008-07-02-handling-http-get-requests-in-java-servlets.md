---
layout: post
title: Handling HTTP GET Requests in Java Servlets
---

Earlier, we've <a href="/2008/java-servlets-an-introduction/">introduced you to Java Servlets</a> -- what they are, life cycle, advantages. Let's move ahead with Java Servlets and get some simple code to handle the HTTP GET Request to show you how to write a servlet.

Servlets can be used for handling both the GET Requests and the POST Requests. However in this post, let's write the code for handling the GET Request. The HttpServlet class is used for handling HTTP GET Requests as it has some specialized methods that can efficiently handle the HTTP requests. These methods are;

* doGet()
* doPost()
* doPut()
* doDelete()
* doOptions()
* doTrace()
* doHead()

An individual developing servlets for handling HTTP Requests needs to override one of these methods in order to process the request and generate a response. The servlet is invoked dynamically when an end-user submits a form.

Let's look at a sample HTML FORM

```html
<pre name="code" class="html">
<form name="F1" action="/servlet/ColServlet">

<select name="col" size="3">
    <option value="blue">Blue</option>
    <option value="orange">Orange</option>
</select>

<input type="submit" value="Submit" />
</form>
```

Here's the code for ColServlet.java that overrides the `doGet()` method to retrieve data from the HTTP Request and it then generates a response as well.

```java
// import the java packages that are needed for the servlet to work
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

// defining a class
public class ColServlet extends HttpServlet
{

public void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException  

// request is an object of type HttpServletRequest and it's used to obtain information
// response is an object of type HttpServletResponse and it's used to generate a response
// throws is used to specify the exceptions than a method can throw
 
  {

    String colname =  request.getParameter("col"); 
   
   // getParameter() method is used to retrieve the selection made by the user
    response.setContentType("text/html");
    PrintWriter info = response.getWriter();
    info.println("The color is: ");
    info.println(col);
    info.close();
    }
}
```

In order to make this code work, compile the servlet and open the HTML file and hit the "submit" button after selecting a color. Once you press the submit button, the browser will display a response that is generate dynamically by invoking the servlet. Well, this was a very simple servlet and it's always good to start with basic stuff. However, there's no end to what you can do with Java Servlets as you can make complex servlets to do several complex tasks.
