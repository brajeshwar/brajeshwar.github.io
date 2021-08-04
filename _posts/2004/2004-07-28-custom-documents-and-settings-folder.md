---
layout: post
title: Custom ---Documents and Settings--- Folder
---

I use Windows XP Professional on my Thinkpad and Windows 2000 Professional on my Desktop, so this article applies to the two but I think the underlying idea should be similar in most Windows Box. Personally, I always have a nasty habit of loosing settings just because I format my main system drive (usually C drive) often. This does not affect my data storage as I have every of my datas on a different drive and once all system installations are over, I am ready to work straight away. But what will happen to some of my settings/datas that are akin to application programs? Without going too deep into the explanation, let us just solve this issue by diverting your user or rather "Documents and Settings" and its associated folder from the System drive to your desired location.

Navigate to

HKEY_LOCAL_MACHINE (Shared all users)
HKEY_CURRENT_USER (Current User)
\SOFTWARE
\Microsoft
\Windows
\CurrentVersion
\Explorer
\User Shell Folders

and change the values there.

This is now pretty useful for me as I can have my global Actionscript Include files and Flash MX base classes without worrying if they will be lost when I format my drive next time. It is advised not to play with the registry and to <strong>create back-ups</strong> before doing anything, I suggest you do the same.