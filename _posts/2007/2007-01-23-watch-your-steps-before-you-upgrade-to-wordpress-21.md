# Watch your steps before you upgrade to Wordpress 2.1

I ran into issues while trying to upgrade a Wordpress 2.0.7 installation to the new Wordpress 2.1 release.

> Wordpress 2.1 is a brand new package complete with more efficient database code, faster than previous versions, more Ajax. It is also bundled with the powerful anti-spam plugin for Wordpress - [Akismet](http://akismet.com/blog/2007/01/version-20/).

PRE-UPGRADE CHECKLIST

Let us be prepared before we upgrade from Wordpress 2.0.x to Wordpress 2.1.

## Back-up your database.

It is an extremely easy task with [Wordpress DB Backup](http://www.ilfilosofo.com/blog/wp-db-backup). I think this was pre-packaged with the release of 2.0.5 or something close to that. However, this is done away with in the latest 2.1 Release.

## Backup Wordpress files (mostly custom edited/added ones).

Personally, I prefer to keep uploads, images and other Wordpress non-related files outside of the Wordpress installation. This way, I don't really worry about over-writing files or deleting the same by mistake.

# De-activate all Plugins.

I think this is where my first upgraded stalled. So, de-activate your plugins.

UPGRADE

Now, the upgrade to Wordpress 2.1. Well, you can either do a clean upload or overwrite the WP files. In my case, I did an overwrite.

- Upload all the new Wordpress 2.1 files and overwrite old files except *wp-config.php*.
- Now go to your /wp-admin/ folder and you should be asked for an upgrade which usually points to /wp-admin/upgrade.php

That should take care of the upgrade. But we are not done yet, there are few things we should take care of - the Post Upgrade steps.

POST-UPGRADE

- Activate all plugins. You may like to visit and check the "compatible plugin list (Plugins compatible with Wordpress 2.1)":http://codex.wordpress.org/Plugins/Plugin_Compatibility/2.1.
- Enable "Use the visual editor when writing" in your Profile page. Many bloggers do not use the Visual Editor in the 2.0.x days but with the tabbed Visual-Code view in Wordpress 2.1, it is worth the switch.
- Check if your "Pages" are correct. In my case, all pages got converted into Articles; I had to manually convert them to Pages again.
- Database Query Caching is built in with Wordpress 2.1.

All done, then you check out the [new features](http://wordpress.org/development/2007/01/ella-21/).