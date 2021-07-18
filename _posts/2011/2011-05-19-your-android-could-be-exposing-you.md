---
layout: post
title: Your Android could be Exposing YOU!
date: 2011-05-19 16:00:36.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- android
- Security
- Technology
meta:
  _edit_last: '67'
  dsq_thread_id: '307867777'
  bitly_short_url: http://j.mp/kEOyeV
  retweet_cache: '1309582960:1'
  trx_addons_post_views_count: '38'
author:
  login: Deeptaman
  email: d.mukherjee05@gmail.com
  display_name: Deeptaman Mukherjee
  first_name: Deeptaman
  last_name: Mukherjee
permalink: "/2011/your-android-could-be-exposing-you/"
---
<p>The private eye has discovered that <a href="http://android.com/">Android</a> devices are no longer a safe haven for your personal information. The private eye is a German University - <a href="http://www.uni-ulm.de/en/in/mi/staff/koenings/catching-authtokens.html">University of Ulm</a>, which claims that more than 99% of all smartphones that run Google's Android operating system are susceptible to mobile hackers. An unencrypted Wi-Fi network is the little window needed by mobile hackers to gain access to everything that is important in your life. </p>
<p>Google Calendar, Twitter, Facebook <em>et al</em> are vulnerable to an impersonation attack. This discovery is a follow up to Rice University professor Dan Wallach's <a href="http://www.freedom-to-tinker.com/blog/dwallach/things-overheard-wifi-my-android-smartphone">blog post</a> in February that mentioned the nature and magnanimity of this threat. Even though Android devices are being retracted or updated, the process will be a success only if all the devices are freed from this shortcoming, otherwise the catastrophe will be unimaginable. The bug has been fixed in Android 2.3.4 and 3.0 (for smartphones) - the latest version of the operating system - the bulk of mobile carriers and handset manufacturers have not yet issued an update. "We are aware of this issue, have already fixed it for calendar and contacts in the latest versions of Android, and we're working on fixing it in Picasa", said a Google representative in an e-mail statement. Another issue this raises is the need for better update practices in Android hardware vendors.</p>
<p><!--more--></p>
<p><img src="/static/2011/05/android-broken.jpg" alt="Android under attack" /></p>
<p>Launching an impersonation attack is very easy on new Androids as well as Google services that use <a href="http://code.google.com/apis/accounts/docs/AuthForInstalledApps.html">ClientLogin</a>. Applications request an <a href="http://en.wikipedia.org/wiki/Security_token">auth Token</a> with the ClientLogin Protocol from the Google service by sending an account name and password via an HTTPS connection. This auth Token is valid for 2 weeks and used for subsequent requests to the Google service API. Using an HTTP connection as opposed to the secure HTTPS puts the device at peril. The representative further added, "For instance, the adversary can gain full access to the calendar, contacts information, or private Web albums of the respective Google user. This means that the adversary can view, modify, or delete any contacts, calendar events, or private pictures. This is not limited to items currently being synced but affects all items of that user."</p>
<p>An attacker could link multiple auth Tokens by setting up a Wi-Fi access point with the same name of a common network provider and look for Android phones with default settings to sync with. Syncing would fail, but the invader could capture auth Tokens for each service that attempted to sync. This exposes Calendar data and users' contacts. The invader could change the stored e-mail addresses of contacts and the Google user would be at risk of giving out sensitive information to an unidentified recipient. "We tested this attack with Android versions 2.1 (Nexus One), 2.2 (HTC Desire, Nexus One), 2.2.1 (HTC Incredible S), 2.3.3 (Nexus One), 2.3.4 (HTC Desire, Nexus One), and 3.0 (Motorola XOOM) and with the native Google Calendar, Google Contacts, and Gallery apps (or respective synchronization services)", the report said.</p>
<p>Crisis management groups are being formed by Google's handset and carrier partners to begin setting guidelines for a new update initiative. The participants want to guarantee the availability of regular updates for 18 months on new handsets. They will delineate some rules to reduce the gap between the new and old versions of Android. Although it is too early to speak about results, that is the need of the hour. If the group can build consensus around a reasonable set of update policies, it would be counted as a win for Android adopters. It would also help moderate the ambiguity about product lifespan. This could be the update everyone has been waiting for. </p>
<p>While the companies manage this crisis, the users should switch off synchronization in the settings menu when connecting to an open Wi-Fi network. There ain't a thing as being 'too careful'.</p>
