---
layout: post
title: SCORM, what is, what isn't, Flash and scorm and SCORM FAQ
date: 2003-12-04 09:09:34.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- ActionScript
- flash
- Javascript
- Scorm
meta:
  _edit_last: '67'
  dsq_thread_id: '135614604'
  bitly_short_url: http://j.mp/jzZFQA
  retweet_cache: '1309584896:0'
  trx_addons_post_views_count: '141'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2003/scorm-what-is-what-isnt-flash-and-scorm-and-scorm-faq/"
excerpt: SCORM stands for Sharable Content Object Reference Model - SCORM is a set
  of specifications created by the Advanced Distributed Learning initiative (ADL).  SCORM
  specifies how content can be built and reused across any Learning Management System
  (LMS), and how LMSs can be constructed to use any Sharable Content Object (SCO).
---
<p>As a follow-up to my <a href="http://www.brajeshwar.com/2003/scorm-the-sharable-courseware-object-reference-model/" title="scorm, the sharable courseware object reference model">previous post</a>, I was lucky the other day on <a href="http://chattyfig.figleaf.com" title="flash lounge">Flash Lounge</a> on a questions which was not really related but somehow landed on the topic of SCORM. And so, here are more details about the same. Thanks a lot to Aaron E. Silvers., Senior Multimedia Integrator of <a href="http://www.adlnet.org/" title="advanced distribtuted learning">ADL, Advanced Distributed Learning</a>.</p>
<p><strong>What is SCORM?</strong></p>
<p>SCORM stands for Sharable Content Object Reference Model - SCORM is a set of specifications created by the Advanced Distributed Learning initiative (ADL).  SCORM specifies how content can be built and reused across any Learning Management System (LMS), and how LMSs can be constructed to use any Sharable Content Object (SCO).</p>
<p>SCORM speaks to the following "ilities" :</p>
<p>Accessibility : From multiple remote locations through the use of metadata and packaging standardization, and using (but not restricted to) web standards.<br />
Adaptability : By tailoring instruction to individual and/or organizational needs.<br />
Affordability : Developing and aggregating learning content in modular ways to promote learning efficiency, productivity and reuse while reducing development time and costs.<br />
Durability : Across revisions of operating systems and software.<br />
Interoperability : Across multiple tools and platforms.<br />
Reusability : Through the design, management and distribution of tools and learning content across multiple applications.</p>
<p><strong>What isn't SCORM?</strong></p>
<p>SCORM is NOT,<br />
A programming language,<br />
A standard that must be adhered to or complied with,<br />
A design pattern (though through conformance to SCORM, some patterns become clear - like abstraction.</p>
<p><em>What's the impact of SCORM conformance on a front-end developer in HTML</em></p>
<p>You need JavaScript to be able to handle communication between the SCO and SCORM's API (the communication between learner and LMS via interaction with the SCO). Otherwise, there's only seven different requests that a SCO can make of an LMS. The only two commands that each piece of content MUST make in order to be a SCO are an Initialize (let the LMS know that the SCO is launched) and a Terminate (let the LMS know that the SCO is no longer in use).  Everything else is gravy. So from a front-end developer's perspective; if you can call the API with JavaScript, you're set to go.</p>
<p><em>What's the impact of SCORM conformance on a Flash / ActionScript developer</em></p>
<p>Actually, working with Flash and SCORM is pretty easy, because Flash is so flexible.  There's only about 200 ways to skin a cat in Flash, and so it is with SCORM. Many developers rely on FSCommand to communicate with JavaScript, but this method is believe to besloppy, hackneyed, lazy, old practice.  Sure, it works but it doesn't work on everything. GetURL() will be your friend.  That and Object.watch() and setInterval(), clearInterval().  Using those will enable you to communicate back and forth with JavaScript as it speaks to the LMS.</p>
<p><em>Perspective of a Personalized SCORM-related FAQ</em></p>
<p>Q.  What specific guidelines and/or best practices do I need to follow as a content developer in order to make sure the Flash & Dreamweaver content is comformant?<br />
A. There are two main practices you'll follow to make sure your content is conformant.  You'll run it in the 1.3 Run-Time Environment (due to be released as Beta very soon), and if your package loads and runs, well, it works!</p>
<p>In February or March 2004, there the likelyhood of the release of the "SCORM 1.3 test suite".  The diagnostics it returns when you test your content will let you know specifically where each piece of content may fail.</p>
<p>If you can get your content to pass the Test Suite, you'll be right as rain.  Those are the only two benchmarks available to us since there's no LMS available that handles 1.3, and it will probably be a while until they come around.</p>
<p>Q. Which tools do you use?<br />
A. Use Flash MX 2004 and Dreamweaver MX 2004. You can use other tools available in the market for the same.  </p>
<p>Now as far as the technologies that are employable,<br />
XHTML 1.0 strict, CSS2, ActionScript, JavaScript, PHP, MySQL, XML and a little bit of ColdFusion if needed (including CFC's if you are doing remoting with Flash).</p>
<p>As well, there's an extension for Dreamweaver MX by DigitalThink (available on Macromedia Exchange) that does a really good job of making 1.2 conformant content, or editing your content to automagically convert to 1.2.  A good guess would be that they will support 1.3, even if the sequencing is very simple.</p>
<p>Q. As a developer, what pieces do I really need to know about SCORM?<br />
A. Here are some unsorted tips to follow when creating content:</p>
<p># Avoid using FSCommand() to communicate with JavaScript (in Flash) : Most of the tools already available to Flash for SCORM development rely heavily on FSCommand(). FSCommand() only will work effectively in a Windows environment.  So, in the future, if your content is viewed on anything other than Windows, the communication will probably fail.  Instead, move your reliance to getURL() to call on your JavaScript functions. Well, this are still personal preferences, you are free to experiment on your own. It is preferable to develop once, and at the same time develop for everything.  Switching to getURL() means that your content will interact appropriately in Windows, Linux, Mac - on Internet Explorer, Netscape, Mozilla, Opera - whatever browser is being utilized by the LMS.<br />
# Abstract your API wrapper to course-specific functions : If you call on the functions in the API wrapper specifically in all your development, you're setting yourself up for disaster.  The naming conventions have changed in every version of SCORM and it's likely that it's going to continue to evolve.  Create a separate javascript file that has function names that simply call on the functions in the API wrapper.  Call on THOSE functions instead of directly calling on the functions in the API wrapper.  That way, even if the function names change in later versions of SCORM, you're changing only one file instead of digging into every single HTML page and Flash file, copying and pasting all the way through. Save myself the hassle of doing that by abstracting as much as possible.<br />
# Utilize XHTML and CSS2 to maximize accessibility and skin-ability : If you're using XHTML in combination with CSS2, you're going to make it easy to deploy your content to multiple platforms.  Not just different OS's, either - cell phones, PDA's - just about any web-enabled device will benefit from the organization you adhere to if you're conforming to W3C standards. If you use CSS2 style sheets, you can set multiple layout files with the same class names to "skin" your content.  In this manner, you can meta-data the CSS style sheet.  By abstracting style from the content, you'll also be able to apply different styles for different deployments. When you author XHTML with &lt;div&gt; tags, you're dividing up your content in a logical manner.  In the absence of the CSS (like on a web-enabled device or a phone), the content still lays out logically.  You can't do that if you're using &lt;table&gt; tags. The obvious advantage to using these technologies is that your 95% of the way to being 508-compliant in doing so (the other 5% being testing - because a good developer wants to be "sure" that a screen reader can actually read/interact with content appropriately).<br />
# Get in on the planning stages for content development early : You have to be really proactive at the<br />
planning stages of Instructional Development.  Don't wait until the ID's have a curriculum in-place that they want to develop, telling you what technologies they want available.  Determine their real priorities - is it<br />
the user experience they want or the curriculum plan?  Is the SCORM conformance a priority for content object re-use, or is it so it will be compatible with any LMS?  These decisions all have impact on how your SCO's<br />
will be defined, which will have a huge impact on how you're going to develop a project.<br />
For example, if you're building one large Flash piece that's going to set objectives and display tons of content - sort of acting as its own LMS, then re-use of individual pieces of content can't be a priority.  You can still tag all those pieces of content as assets, but not SCOs (a SCO can't launch a SCO). In this example, the large Flash "player" would be the one SCO in this package, with each piece of "content" that it would display being simply an asset.  You can launch assets as part of an aggregation - even on their own, and thus re-use assets, but they're not SCOs.<br />
# The ease of SCORM development is in the front-end : Remember that all you need to make a SCO a SCO is an Initialize() and a Terminate().  Everything else is gravy.  In total, there are only 7 calls (there is a getValue() and a setValue() and then about 3 diagnostic calls) to the LMS.  That's it.  So developing for SCORM is pretty easy when you think about it, because each SCO is dumb.  By that it simply means that each SCO is independent of any other SCO, so you don't have to know what's going on with other SCOs in order to build one.  The LMS handles all that information.<br />
# The pain of SCORM development is in the organization of the entire course, and by definition, the manifest : The manifest controls the sequencing, the interactions, the listing of assets - all the magic happens in the manifest.<br />
A reiteration of what we doubtlessly know :  it's all XML.  Which means if you can outline or map your course, even at a high level that just outlines the page titles, you can design your course how you want and assume that you'll be able to find help by the way of direct help (through some means of support) or indirect help (by assuming tools will come to assist you in sequencing).<br />
# METADATA - but be smart about it : Developing MetaData is important.  Really important.  Forget that SCORM doesn't require it.  The fact of the matter is that you'll want to reuse the stuff you build, eventually.  It's a heck of a lot easier to build MetaData as you're developing than it is to go back in years from now to try and tag a SCO.</p>
<p>But, it is also suggested to keep in mind that you're not going to re-use every single little thing you list as an asset. So restrict your metadata work to those things you'll likely re-use.</p>
<p>Your SCOs.  It makes sense to author MetaData for each SCO, because it increases the likelihood of their re-use. And as each SCO is (supposedly) the smallest chunk of content you have on any specific topic, it's just common sense that any chunk of content may apply to something else later on, in another aggregation.</p>
<p>Your assets.  Does every single JPEG, GIF and SWF need to be MetaData'd?  Probably not.  Use your time wisely.  If you find that you're using the same graphic more than once in a package, you should probably include MetaData for it.  The thumb rule logic would be that if "YOU" are using it more than once, chances are a few years from now, someone else would, too, if they can find it.</p>
