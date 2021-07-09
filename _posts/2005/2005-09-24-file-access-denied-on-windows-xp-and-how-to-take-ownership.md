---
layout: post
title: File Access Denied on Windows XP and how to take ownership
date: 2005-09-24 05:34:34.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- access
- denied
- Microsoft
- network
- ownership
- root
- tips
- tricks
- windows
- xp
meta:
  dsq_thread_id: '135607550'
  bitly_short_url: http://j.mp/imOzNP
  retweet_cache: '1309584411:0'
  _edit_last: '67'
  trx_addons_post_views_count: '938'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/file-access-denied-on-windows-xp-and-how-to-take-ownership/"
excerpt: Problem with file ownership in Windows! Here is how to take ownership of
  a file or folder in Windows XP.
---
<p>In a recent hard disk crash, I had to do a restore from my back-up. Some of the files on a back-up drive was somehow avoiding me with an "Access Denied" even though I was logged in as the Administrator. I looked around and finally got the solution on how to <a href="http://support.microsoft.com/default.aspx?scid=kb;en-us;308421&Product=winxp">take ownership of a file or folder</a>  in Windows.</p>
<h3>Here are the simplified steps.</h3>
<p># Log on to the computer with an account that has administrative credentials. If you are running Microsoft Windows XP Home Edition, you must start the computer in safe mode, and then log on with an account that has Administrative rights to have access to the <strong>Security</strong> tab.<br />
# If you are using Windows XP Professional, you must disable Simple File Sharing.<br />
# Right-click the folder/file that you want to take ownership of, and then click <strong>Properties</strong>.<br />
# Click the <strong>Security</strong> tab, and then click <strong>OK</strong> on the Security message (if one appears).<br />
# Click <strong>Advanced</strong>, and then click the <strong>Owner</strong> tab.<br />
# In the <strong>Name</strong> list, click your user name, or click <strong>Administrator</strong> if you are logged in as Administrator, or click the <strong>Administrators</strong> group. If you want to take ownership of the contents of that folder, select the <strong>Replace owner on subcontainers and object</strong> check box.<br />
# Click <strong>OK</strong>, and then click <strong>Yes</strong> when you receive the following message:<br />
You do not have permission to read the contents of directory <em>folderName</em>. Do you want to replace the directory permissions with permissions granting you Full Control?<br />
All permissions will be replaced if you press Yes.<br />
# Click <strong>OK</strong>, and then reapply the permissions and security settings that you want for the folder and its contents.</p>
<p>That's it.</p>
