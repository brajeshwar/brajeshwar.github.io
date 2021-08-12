---
layout: post
title: Safe-Guard Microsoft Outlook Datas
---

The tip here is an outcome of my tweaking and fooling around with Microsoft Outlook for the past coupla days, and applies aptly to Microsoft Outlook 2003 on Windows XP Professional (because that is what I am running). I did look around for few additional information so that I can give a more better information, like details for lower version(s) of Outlook. This is just a small tip which I wish to remind myself through this article, please search around the Internet, it is flooded with tips and tricks on the similar topic. When I refer to Microsoft Outlook datas here, I am refering to the Mail, Calendar, Notes, Task and all other datas that Outlook handles.

How to store Outlook Datas outside its install folder, better even, outside the System Program Install Drive (usually C: for me)?

- Close Outlook if it is opened
- Start > Control Panel > Mail
- Create a New Profile "YourName", once done, you may add e-mail IDs or you can do that later
- While you are still in the Account Settings Page, change the "Deliver new e-mail to the following location" to a new location (I used a folder Outlook on my D: drive)
- If you use Auto-Archive feature, then have it Auto-Archive to this same folder, thus it may look like `D:\Outlook\Archive.pst` besides your "OutlookData.pst"
- You can delete the Default Data Storage file that came with Outlook from the "Data File Management" console

What if you did this when you already have your datas stored in the default storage file, well, just go to the Outlook Default Folder and copy-paste that over your new Data Storage File.

Where is the default Microsoft Outlook Data Folder?

In Outlook 2003;

- File > Data File Management
- Click on your data file, it is usually "Personal Folders"
- Open Folder

In Windows XP, the default is in "/Documents and Settings/User/Local Settings/Application Data/Microsoft/Outlook"

In Outlook 2002;

- Click with the right mouse button on Outlook Today either in the Outlook bar or in the folder list.
- Select Properties from the pop-up menu.
- Select Advanced....
- Notice the path listed under Path:.
- Select the path excluding the file name (usually this will be "outlook.pst") with your mouse.
- Press Ctrl-C to copy the path.
- Now select Run... from the Start menu.
- Press Ctrl-V to paste the path
- Hit Enter to open your Outlook data folder in Windows Explorer.