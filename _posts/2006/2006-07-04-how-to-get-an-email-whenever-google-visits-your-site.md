---
layout: post
title: How to get an email whenever Google visits your site
date: 2006-07-04 18:00:12.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- ".htaccess"
- Email
- google
- Googlebot
- Visits
meta:
  dsq_thread_id: '135615567'
  _edit_last: '67'
  bitly_short_url: http://j.mp/l3gktQ
  retweet_cache: '1309575458:0'
  trx_addons_post_views_count: '39'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2006/how-to-get-an-email-whenever-google-visits-your-site/"
excerpt: Do you want to be emailed whenever Google's spider (GoogleBot) visits your
  site or your page(s)? If yes, here is an easy way to do it.
---
<p>I was reading the article - "Ever wanted to know when google crawls your site (Ever wanted to know when google crawls your site)":http://swik.net/web/Ever+wanted+to+know+when+google+crawls+your+site%3F via "Digg (Digg)":http://digg.com/. The article explains how you to send an email via a PHP Script when Google's spider (GoogleBot) visits your site. So, why not automate that for each and every page that is PHP powered. </p>
<p>To include the script on every page of your site, let us follow the following steps;</p>
<p>1. Modify your .htaccess file (create if you do not have one) to use the auto_prepend_file feature, it should have this line</p>
<pre>php_value auto_prepend_file /home/yourdomain.com/www/html/autoappend.php</pre>
<p>(a single line full absolute path to the autoappend.php on your server)</p>
<p>2. Create/Modify your autoappend.php (you are free to change the file name accordingly here and in the .htaccess file) to include the PHP script from *swik.net* (I've modified it slightly to have a clickable url when you get the mail);</p>
<pre>
<?php //let us notify someone when google crawls this page
if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Googlebot' ) !== false )
{
    // The email address we want to send the email to
    $email_address = 'mymail@domain.com';
     // Send the email
    mail($email_address,'Googlebot Visit', 'Googlebot has visited your page: http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']);
}
?>
</pre>
<p><strong>But, my files extension is not PHP even though my server support PHP, how do I use this?</strong></p>
<p>Well, you can use the same .htaccess to enable PHP for any file extension, you have to add this line</p>
<pre>AddType application/x-httpd-php .html .htm</pre>
<p>This will parse all files with the extension _html_ and _htm_ as PHP scripts.</p>
<p><strong>References</strong></p>
<p>* "Comprehensive guide to .htaccess (Comprehensive guide to .htaccess)":http://www.javascriptkit.com/howto/htaccess.shtml<br />
* "PHP auto_append_file (PHP auto_append_file)":http://www.google.com/search?hl=en&q=auto_prepend_file&btnG=Google+Search</p>
<p>*Update*</p>
<p># 2006 June 5 (10:00 am) - Be careful to set a filter for your email for this one. Now, I'm bombarded with "Googlebot Visit" mails!<br />
# 2006 June 5 (02:00 pm) - This is perhaps a bad idea for a high traffic website. So, far I have received over 500 emails in just about 5 hours. I'm turning mine off.</p>
