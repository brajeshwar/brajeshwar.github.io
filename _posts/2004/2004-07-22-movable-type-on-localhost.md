---
layout: post
title: Movable Type on Localhost
date: 2004-07-22 00:14:37.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135614849'
  bitly_short_url: http://j.mp/juyi4L
  retweet_cache: '1309547792:0'
  trx_addons_post_views_count: '55'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2004/movable-type-on-localhost/"
excerpt: How to setup Movable Type Locally with WAMP!
---
<p>Though the aim is to have Movable Type running on your local computer, but then we will have to go through two important (may be more) installations, namely an Apache/PHP/mySQL server and Perl. Let me tell you that this is more of my own experience, I am sure you can use your preferred installations though adhearing to the necessary requisites. This are the downloads that you will need;</p>
<p>* <a href="http://www.wampserver.com/" title="Wamp5">Wamp5</a><br />
* <a href="http://www.activestate.com/Products/ActivePerl/" title="Active Perl">Active Perl</a> and<br />
* <a href="http://movabletype.org/" title="Movable Type">Movable Type</a></p>
<p>Wamp5, at the time of writing this article was at version 1.1. The installation was straight forward, simple, quick and very easy. Just take care that it will not clash with an already running web server like IIS, simply stop your current web server during the installation. Though it should be rather similar in most windows box, I am refering to Windows 2K/XP installation in this article.<br />
WAMP5 is a web server for your windows box, which installs the following applications - Apache, PHP, MySQL database, PHPmyadmin and SQLitemanager on your computer. The Tray Icon that it have as its service manager is also easy to customize to suit your needs, just edit the "wampserver.ini" using a text editor to suit your style and needs. I have specifically added a stop/start IIS and stop/start ColdFusion so that I can switch between Wamp5 and IIS/Cold Fusion. If you prefer other installation other than Wamp5, please go ahead. The Wamp5 installation was rather straight forward and easy, so let us move on to the next i.e Perl and the Database Module, a bit more difficult one, well, I mean comparing to Wamp5 intallation.<br />
<br />
After you download Active Perl, extract the content to any location of your choice. It will extract a folder and a batch file. Now, concentrate on the batch file and leave the folder there. You would be using the DOS Command Prompt here to do the installation, double clicking on the batch file will not yield nothing. I think I better put down the Active Perl and our database module installation in steps;</p>
<p># Launch the batch installer through command prompt.<br />
# Follow the installation steps which are straight foward till now, I would rather prefer to have "Y" to most of the questions asked during the installation. It will try to install on "c:\perl", it is upto you to choose where to install the same. You are free to install it anywhere as that makes little difference.<br />
# Remember, our main aim is to install Movable Type, so let us tinker a bit with some Perl modules;<br />
(a) If you wish to use the Berkeley Database, go to your command prompt and type "PPM" without the quotes. Ok, if you get the PPM > prompt then the environment variable have been successful registered with the path else it has not, so you may wish to log off and login to Windows or Re-start. Once you path is registered in the environment variables, try doing PPM again in the command prompt. Type "Install DB_File" without the quotes and ENTER. Now you can type "Quit" and say bye bye to the command prompt.<br />
(b) If you wish to use MySQL. Go to DOS Command Prompt and type "PPM". Now type "Install DBI" > ENTER. Once that install is done, type "Install DBD-mysql" > ENTER. You should be done by now.</p>
<p>Now, let us move ahead with the Movable Type Modification and Installation.</p>
<p># Now that all the pre-requisites are taken care of, let us install Movable Type. Follow the Installation Manual of Movable Type to copy the files to your desired location.<br />
# Before running mt-check, mt-load, we will have to modify some setting of all our cgi files, well we have to modify all cgi files that you get as commonly they will point to perl like "#!/usr/bin/perl" but we do not have that convention in windows. The change is just on the first line of your CGI files, so it shoould be easy. Change any reference to perl in your cgi files to your current location. Keep in mind if you have not enabled environment variable path during perl installation, you will have to give a full path like "c:\perl\bin\perl.exe" but if you have given the path in the environment variable, you can simply do "perl.exe" so most of our cgi files with have the first line as "#!perl.exe -w", without the quotes though.<br />
# If you are using your default installation, the "mt-db-pass.cgi" should be left blank.<br />
# Add your MT Database to MySQL though PHPmyadmin or through the MySQL command console.<br />
# I think, that's it. Now do your mt-check.cgi, then mt-load.cgi. They should likely look like http://localhost/cgi-bin/mt/mt-check.cgi and http://localhost/cgi-bin/mt/mt-load.cgi respectively.<br />
Launch and enjoy Movable Type on your own machine. I noticed that I cannot install both MT 2.x and MT 3.0 version on my online Linux server but locally, both are installed and working properly.</p>
<p>*Update*: Here is a "PDF of Running Movable Type Locally (PDF of Running Movable Type Locally)":http://www.appnel.com/files/running-mt-locally.pdf for Mac OS X.</p>
