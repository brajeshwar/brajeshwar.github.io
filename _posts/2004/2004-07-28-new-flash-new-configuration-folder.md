---
layout: post
title: New Flash, New Configuration Folder
---

With the release of the new sexy, sensual updater comes many improvements, changes and updates. With all informations floating around, it is easy to just search on some prominent sites and read them, but here is an info that ain't floating around, so let me have it here for me to read later. Lately, I have been experiencing the habit of searching my own site to look up articles that I have writen, tips shared. In order that I can refer to them again, here we go again for the archive.

With the new Flash Updater, she have change her configuration folder a bit. The user profile size have drastically decrease its size as she have removed some configuration folders and external player from the "First Run" folder to the "Application-Level Configuration" folder. She have also moved the HelpPanel to all-user-level configuration. Now, you will find authplay.dll (file), ComponentFLA, Components, Importers, Libraries and Templates  in the application-level configuration folder.

<strong>Application-level configuration folder:</strong> This is the configuration folder for the application itself. Typical paths to this folder are:
Windows: \Program Files\Macromedia\Flash MX 2004\"language"\Configuration\
Mac: HD/Applications/Macromedia Flash MX 2004/Configuration/ 

<strong>First run folder:</strong> This is a folder that is a sibling to the application-level configuration folder. Folders and files in this folder are automatically copied by Flash to the user-level configuration folder. Typical paths to this folder are:
Windows: \Program Files\Macromedia\Flash MX 2004\"language"\First Run\
Mac: HD/Applications/Macromedia Flash MX 2004/First Run/ 

<strong>User-level configuration folder:</strong> This is the configuration folder found in the user profile area. This folder is always writable by the current user. Flash MX 2004 uses the "Local Settings" folder for the user-level configuration files. Note that this differs from Flash MX and the rest of the Studio MX family (including DW MX 2004). Typical paths to this folder are:
Windows: \Documents and Settings\"username"\Local Settings\Application Data\Macromedia\Flash MX 2004\"language"\Configuration
Mac: HD/Users/"username"/Library/Application Support/Macromedia/Flash MX 2004/"language"/Configuration/