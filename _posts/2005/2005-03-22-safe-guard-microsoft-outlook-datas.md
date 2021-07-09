---
layout: post
title: Safe-Guard Microsoft Outlook Datas
date: 2005-03-22 07:47:01.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags: []
meta:
  dsq_thread_id: '192159677'
  bitly_short_url: http://j.mp/mkfPXV
  retweet_cache: '1309541270:0'
  trx_addons_post_views_count: '34'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2005/safe-guard-microsoft-outlook-datas/"
excerpt: The tip here is an outcome of my tweaking and fooling around with Microsoft
  Outlook for the past coupla days, and applies aptly to Microsoft Outlook 2003 on
  Windows XP Professional (because that is what I am running). I did look around for
  few additional information so that I can give a more better information, like details
  for lower version(s) of Outlook.
---
<p>The tip here is an outcome of my tweaking and fooling around with Microsoft Outlook for the past coupla days, and applies aptly to Microsoft Outlook 2003 on Windows XP Professional (because that is what I am running). I did look around for few additional information so that I can give a more better information, like details for lower version(s) of Outlook. This is just a small tip which I wish to remind myself through this article, please search around the Internet, it is flooded with tips and tricks on the similar topic. When I refer to Microsoft Outlook datas here, I am refering to the Mail, Calendar, Notes, Task and all other datas that Outlook handles.</p>
<p><!--more--><br />
How to store Outlook Datas outside its install folder, better even, outside the System Program Install Drive (usually C: for me)?</p>
<p># Close Outlook if it is opened<br />
# Start > Control Panel > Mail<br />
# Create a New Profile "YourName", once done, you may add e-mail IDs or you can do that later<br />
# While you are still in the Account Settings Page, change the "Deliver new e-mail to the following location" to a new location (I used a folder Outlook on my D: drive)<br />
# If you use Auto-Archive feature, then have it Auto-Archive to this same folder, thus it may look like D:\Outlook\Archive.pst besides your "OutlookData.pst"<br />
# You can delete the Default Data Storage file that came with Outlook from the "Data File Management" console</p>
<p><em>What if you did this when you already have your datas stored in the default storage file, well, just go to the Outlook Default Folder and copy-paste that over your new Data Storage File.</em></p>
<p>*Where is the default Microsoft Outlook Data Folder?*</p>
<p>In Outlook 2003;</p>
<p>* File > Data File Management<br />
* Click on your data file, it is usually "Personal Folders"<br />
* Open Folder</p>
<p><em>In Windows XP, the default is in "/Documents and Settings/User/Local Settings/Application Data/Microsoft/Outlook"</em></p>
<p>In Outlook 2002;</p>
<p>* Click with the right mouse button on Outlook Today either in the Outlook bar or in the folder list.<br />
* Select Properties from the pop-up menu.<br />
* Select Advanced....<br />
* Notice the path listed under Path:.<br />
* Select the path excluding the file name (usually this will be "outlook.pst") with your mouse.<br />
* Press Ctrl-C to copy the path.<br />
* Now select Run... from the Start menu.<br />
* Press Ctrl-V to paste the path<br />
* Hit Enter to open your Outlook data folder in Windows Explorer.</p>
<p>*Why am I so paranoid about putting datas/files in their default location?*</p>
<p>Here are few of the many reasons that I am so skeptical about putting data files on the installation folder/drive</p>
<p>* My <a href="http://www.brajeshwar.com/2004/attitude-adjustment-problem-with-softwares/">attitude adjustment problem</a> with softwares<br />
* <a href="http://www.brajeshwar.com/2003/damn-i-have-to-share-this-tip/">Change location of your Favorites</a> in Windows/IE</p>
