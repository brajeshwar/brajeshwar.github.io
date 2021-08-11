---
layout: post
title: Handling HTTP GET Requests in Java Servlets
date: 2008-07-02 17:35:55.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
tags:
- GET
- HTTP
- Java
- Servlets
meta:
  _edit_last: '1'
  dsq_thread_id: '135616959'
  bitly_short_url: http://j.mp/lTeoYe
  retweet_cache: '1309546519:0'
  trx_addons_post_views_count: '189'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/handling-http-get-requests-in-java-servlets/"
excerpt: Servlets can be used for handling both the GET Requests and the POST Requests.
  An individual developing servlets for handling HTTP Requests needs to override one
  of these methods in order to process the request and generate a response.
---
<p>Earlier, we've <a href="/2008/java-servlets-an-introduction/">introduced you to Java Servlets</a> -- what they are, life cycle, advantages. Let's move ahead with Java Servlets and get some simple code to handle the HTTP GET Request to show you how to write a servlet.</p>
<p>Servlets can be used for handling both the GET Requests and the POST Requests. However in this post, let's write the code for handling the GET Request. The HttpServlet class is used for handling HTTP GET Requests as it has some specialized methods that can efficiently handle the HTTP requests. These methods are;</p>
<p>* doGet()<br />
* doPost()<br />
* doPut()<br />
* doDelete()<br />
* doOptions()<br />
* doTrace()<br />
* doHead()</p>
<p>An individual developing servlets for handling HTTP Requests needs to override one of these methods in order to process the request and generate a response. The servlet is invoked dynamically when an end-user submits a form.<br />
<br />
Let's look at a sample HTML FORM</p>
<pre name="code" class="html">
<form name="F1" action="/servlet/ColServlet">

Select the color:
<select name="col" size="3">
    <option value="blue">Blue</option>
    <option value="orange">Orange</option>
</select>

<input type="submit" value="Submit" />
</form>
</pre>
<p>Here's the code for ColServlet.java that overrides the @doGet()@ method to retrieve data from the HTTP Request and it then generates a response as well.</p>
<pre name="code" class="java">
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
</pre>
<p>In order to make this code work, compile the servlet and open the HTML file and hit the "submit" button after selecting a color. Once you press the submit button, the browser will display a response that is generate dynamically by invoking the servlet. Well, this was a very simple servlet and it's always good to start with basic stuff. However, there's no end to what you can do with Java Servlets as you can make complex servlets to do several complex tasks.</p>
