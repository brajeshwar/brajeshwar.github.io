---
layout: post
title: Aftermath of a Fresh Windows Install, Few Tips
date: 2006-02-12 15:46:24.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135615331'
  bitly_short_url: http://j.mp/mQwcTY
  retweet_cache: '1309547849:0'
  trx_addons_post_views_count: '39'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2006/aftermath-of-a-fresh-windows-install-few-tips/"
excerpt: Windows, Tips and tricks
---
<p>Whenever I do an install or a re-intall of "Windows (Windows)":http://www.microsoft.com/, I do coupla Must-Do-Tweaks. I have them written down so I know how to execute them in steps. Let me archive some of them here for future reference.</p>
<p>*Customize Folder Context Menu*</p>
<p>Start > Run and type "Regedit"</p>
<p>[HKEY_CLASSES_ROOT\Folder\Shell\]<br />
[HKEY_CLASSES_ROOT\AllFilesystemObjects\shell\]<br />
[HKEY_CLASSES_ROOT\Directory\Shell\]</p>
<p>*Shutdown is Slower - Windows XP*</p>
<p>Start > Run and type "Regedit"</p>
<p>[HKEY_LOCAL_MACHINE<br />
\SYSTEM<br />
\CurrentControlSet<br />
\Control<br />
\Session Manager<br />
\Memory Management]</p>
<p>Set ClearPageFileAtShutdown value to 0</p>
<p>*Alternate method for Windows XP Professional*</p>
<p>Start > Run and type "Secpol.msc"<br />
Click Local Policies | Security Options<br />
In the right-pane, set "Shutdown: Clear virtual memory pagefile" to "Disabled"</p>
<p>However, this setting is not the only cause for slow shutdowns. Non-responsive programs and Services also contribute to slow shutdowns. Lowering the WaitToKillServiceTimeOut may help as well. The WaitToKillServiceTimeout value name in the registry allows you to specify a length of time that the service control manager must wait for services to complete the shut-down request. To do this;</p>
<p>Start > Run and type "Regedit"</p>
<p>HKEY_LOCAL_MACHINE<br />
\SYSTEM<br />
\CurrentControlSet<br />
\Control<br />
\WaitToKillServiceTimeout</p>
<p>Then, reduce the Service timeout value (default being 20000ms) to your preference.</p>
<p>Similarly, set the AutoEndTasks to 1 in the following registry key: </p>
<p>HKEY_CURRENT_USER<br />
\Control Panel<br />
\Desktop</p>
<p>"AutoEndTasks" value determines whether user processes end automatically when the user either logs off or shuts down Windows 2000/XP.<br />
<br />
*How to Set the Command prompt default path to a certain directory*</p>
<p>When you type CMD in the RUN box, you will see a Command Prompt Window defaulting to your user profile home directory (%Userprofile%). If you want to set the default path to a different directory, you may do so by editing the registry.</p>
<p>Start > Run and type "Regedit"</p>
<p>HKEY_CURRENT_USER\Software\Microsoft\Command Processor</p>
<p>In the right-pane, double-click Autorun and set the folder there, preceded by a CD\ (as you type in DOS). If Autorun is missing, create a new REG_SZ (String Value) there.</p>
<p>Example: Typing just CD\ makes the Command Prompt default to C:\ drive or whatever drive you've installed Windows. You may also use a batch file so that it executes the contents automatically upon launching the Command Prompt. Some organizations display banners for their employees once CMD is launched.</p>
<p>Type CMD /? in the Command Prompt for a detailed information about it's parameters</p>
<p>*How to locate Documents and Settings folders*</p>
<p>HKEY_LOCAL_MACHINE (Shared all users)<br />
HKEY_CURRENT_USER (Current User)<br />
\SOFTWARE<br />
\Microsoft<br />
\Windows<br />
\CurrentVersion<br />
\Explorer<br />
\User Shell Folders</p>
<p>*How to Turn Off Zip Folders in XP*</p>
<p>Start > Run and type "Regedit"</p>
<p>To turn OFF: regsvr32 /u zipfldr.dll<br />
To turn ON: regsvr32 zipfldr.dll</p>
<p>*How to Turn off Error Reporting*</p>
<p>Click through</p>
<p>\Control Panel<br />
\System<br />
\Advanced tab<br />
\Error Reporting</p>
<p>*Prior articles on similar topic*</p>
<p>* "File Access Denied on Windows XP and how to take ownership (File Access Denied on Windows XP and how to take ownership)":http://www.brajeshwar.com/archives/2005/09/file-access-denied-on-windows-xp-and-how-to-take-ownership/<br />
* "Safe-Guard Microsoft Outlook Datas (Safe-Guard Microsoft Outlook Datas)":http://www.brajeshwar.com/archives/2005/03/safeguard-microsoft-outlook-datas/<br />
* "Custom Documents and Settings Folder (Custom Documents and Settings Folder)":http://www.brajeshwar.com/archives/2004/07/custom-documents-and-settings-folder/<br />
* "Custom Favorites Folder (Custom Favorites Folder)":http://www.brajeshwar.com/archives/2003/09/damn-i-have-to-share-this-tip/</p>
<p>Note: In future, instead of spawning new articles, I should just append new tips/tricks to this article.<br />
<span class="codeRed">It is always better to back-up your registry before trying out anything with it.</span></p>
<p>Update - Links<br />
* "Windows XP/2000 Commands & Tools (Windows XP/2000 Commands & Tools)":http://www.networkclue.com/os/Windows/commands/index.aspx<br />
* "Command-line reference A-Z (Command-line reference A-Z)":http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/ntcmds.mspx<br />
* "Customize a new Windows XP Installation (Customize a new Windows XP Installation)":http://www.petri.co.il/customize_a_newp_xp_installation.htm</p>
