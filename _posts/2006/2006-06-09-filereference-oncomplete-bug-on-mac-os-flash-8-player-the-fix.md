---
layout: post
title: FileReference onComplete bug on Mac OS Flash 8 Player & the fix
---

I overhead the conversation yesterday that the file upload on the mac was _not working_ or rather the `FileReference onComplete` was not being fired. Today, [Abdul Qabiz finally confirmed the bug](http://www.abdulqabiz.com/blog/archives/flash_and_actionscript/workaround_file.php). He also eventually found the fix for the same. The fix was to send an empty response from the server side upload script.

The bug is supposedly fixed in Flash Player 9.