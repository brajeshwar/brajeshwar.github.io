---
layout: post
title: Prevent HotLinking with .htaccess
---

It is fine for people to take images, css, js and other medias from your site as long as they re-host it on their own server after making a copy. Also, known as HotLinking, stealing people's bandwidth by linking directly to other site's images, js, css files is a bad thing. If you are a site owner and want to prevent hotlinking or serve an alternate content, here is an easy solution using <a href="http://httpd.apache.org/docs/1.3/howto/htaccess.html">.htaccess</a>.

Create a .htaccess file and place it on the root of the domain where you want to prevent hotlinking. In my case, it is `www.brajeshwar.com`. Add or append, the following codes between the *Rewrite Rule* else create the same.

```
<ifmodule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^http://(www\.)?brajeshwar.com/.*$ [NC]
RewriteRule \.(gif|jpg|js|css)$ - [F]
</ifmodule>
```

This will prevent hotlinking to my gif, jpg, js and css files.
Note: <a href="http://httpd.apache.org/docs/1.3/mod/mod_rewrite.html">mod_rewrite</a> should be enabled for this to work.

In an event where you want to replace a hotlinked media with an alternate media, here is the change for the .htaccess file.

```
<ifmodule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^http://(www\.)?brajeshwar.com/.*$ [NC]
RewriteRule \.(gif|jpg)$ http://media.brajeshwar.com/i/brajeshwar.jpg [R,L]
</ifmodule>
```

So, they will see me instead of the hot linked image. ;-) This came to light after Jason Scott's article on [Freedom, Justice and a Disturbingly Gaping Ass](http://ascii.textfiles.com/archives/000278.html).

Google Defines Hotlinking as the intentional usage of someone's bandwidth without that person's authorization. It is also known as Bandwidth Theft.