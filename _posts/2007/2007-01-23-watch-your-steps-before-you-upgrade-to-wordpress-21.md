---
layout: post
title: Watch your steps before you upgrade to Wordpress 2.1
date: 2007-01-23 15:57:08.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags: []
meta:
  dsq_thread_id: '135616192'
  bitly_short_url: http://j.mp/jogzzt
  retweet_cache: '1309574314:0'
  trx_addons_post_views_count: '49'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2007/watch-your-steps-before-you-upgrade-to-wordpress-21/"
---
<p>I ran into issues while trying to upgrade a Wordpress 2.0.7 installation to the new "Wordpress 2.1 (Wordpress 2.1)":http://wordpress.org/ release. I was upgrading my "Wordpress Labs Install Module (Wordpress Labs Install Module)":http://labs.brajeshwar.com/wp/ and thus there was no damage done. My test WP install stalled; thus I decided to write this article as a warning to those upgrading to Wordpress 2.1.</p>
<p>So, here is a mild reminder when you upgrade your Wordpress Install to the "Latest Release (Latest Release)":http://wordpress.org/latest.tar.gz (they have the "Zip (Zip)":http://wordpress.org/latest.zip version too). This article assumes that you have a 2.0.x version of Wordpress already installed; if you're looking for a new installation or the official Wordpress installation guide, please read the "Wordpress Docs (Wordpress Docs)":http://codex.wordpress.org/Main_Page.<br />
<!--more--><br />
"Wordpress 2.1 (Wordpress 2.1)":http://wordpress.org/development/2007/01/ella-21/ is a brand new package complete with more efficient database code, faster than previous versions, more Ajax. It is also bundled with the powerful anti-spam plugin for Wordpress - "Akismet (Akismet)":http://akismet.com/blog/2007/01/version-20/.</p>
<p>PRE-UPGRADE CHECKLIST</p>
<p>Let us be prepared before we upgrade from Wordpress 2.0.x to Wordpress 2.1.</p>
<p># Back-up your database.<br />
_It is an extremely easy task with "Wordpress DB Backup (Wordpress DB Backup)":http://www.ilfilosofo.com/blog/wp-db-backup. I think this was pre-packaged with the release of 2.0.5 or something close to that. However, this is done away with in the latest 2.1 Release. My assumption is that (I think this is what the Wordpress team thinks) with the *Wordpress Export* feature, this is no longer needed. However, this old plugin still works and is great even with WP 2.1; I think you should keep it handy._<br />
# Backup your other Wordpress related files (mostly custom edited/added ones).<br />
_Personally, I prefer to keep uploads, images and other Wordpress non-related files outside of the Wordpress installation. This way, I don't really worry about over-writing files or deleting the same by mistake._<br />
# De-activate all Plugins.<br />
_I think this is where my first upgraded stalled. So, de-activate your plugins._</p>
<p>UPGRADE</p>
<p>Now, the upgrade to Wordpress 2.1. Well, you can either do a clean upload or overwrite the WP files. In my case, I did an overwrite.</p>
<p># Upload all the new Wordpress 2.1 files and overwrite old files except *wp-config.php*.<br />
# Now go to your /wp-admin/ folder and you should be asked for an upgrade which usually points to /wp-admin/upgrade.php</p>
<p>That should take care of the upgrade. But we are not done yet, there are few things we should take care of - the Post Upgrade steps.</p>
<p>POST-UPGRADE</p>
<p># Activate all plugins. You may like to visit and check the "compatible plugin list (Plugins compatible with Wordpress 2.1)":http://codex.wordpress.org/Plugins/Plugin_Compatibility/2.1.<br />
# Enable "Use the visual editor when writing" in your Profile page. Many bloggers do not use the Visual Editor in the 2.0.x days but with the tabbed Visual-Code view in Wordpress 2.1, it is worth the switch.<br />
# Check if your "Pages" are correct. In my case, all pages got converted into Articles; I had to manually convert them to Pages again.<br />
# Database Query Caching is built in with Wordpress 2.1.</p>
<p>All done, then you check out the "new features (new features)":http://wordpress.org/development/2007/01/ella-21/.</p>
<p>IMPORTANT PLUGINS TO UPGRADE</p>
<p>* If you use the "Subscribe to Comments (Subscribe to Comments)":http://txfx.net/code/wordpress/subscribe-to-comments/ plugins, you should upgrade to the latest release (Subscribe to Comments 2.1) as there is an error message when using the 2.0.8 version of the plugin with WordPress 2.1.<br />
* Upgrade "WP-Cache (WP-Cache)":http://mnm.uib.es/gallir/wp-cache-2/ to "v 2.0.22 (Wp-Cache v2.0.22)":http://mnm.uib.es/gallir/wp-content/wp-cache-2-0-22.zip.</p>
<p>_Disclaimer_ : The above observations on Wordpress 2.1 installation, upgrade are my personal experience and may vary from yours.</p>
