---
layout: post
title: Can SELINUX impose a better confidentiality over encryption?
date: 2008-12-11 06:49:27.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Open Source
tags:
- encryption
- Linux
- Open Source
- Security
- selinux
meta:
  _edit_last: '67'
  dsq_thread_id: '136703166'
  bitly_short_url: http://j.mp/mEoKlE
  retweet_cache: '1309555433:0'
  trx_addons_post_views_count: '60'
author:
  login: Praval
  email: catchme@praval.com
  display_name: Praval Singh
  first_name: Praval
  last_name: Singh
permalink: "/2008/can-selinux-impose-a-better-confidentiality-over-encryption/"
excerpt: SE Linux is the Security-Enhanced Linux project started by the NSA which
  lets you secure Linux at every echelon from the kernel up. SE Linux is in essence
  a defense against hackers giving users another stratum of protection to online information.
---
<div class="figure"><img src="/static/2008/12/security.jpg" alt="Security: Always an issue. Be it Windows, or Linux." />
<p class="credit"><abbr class="type" title="Photograph">Photo</abbr> by <cite><a href="http://www.flickr.com/photos/carbonnyc/2294144289/">CarbonNYC</a></cite></p>
<p class="caption"><em class="title">Security</em>Always an issue. Be it Windows, or Linux.</p>
</div>
<p><!--more--></p>
<p>One issue that may come to the mind of a Linux user is - How to secure data that comes in from an encrypted file? This critique takes the point that SE Linux is the reply. SE Linux is the Security-Enhanced Linux project started by the NSA which lets you secure Linux at every echelon from the kernel up. SE Linux is in essence a defense against hackers giving users another stratum of protection to online information. </p>
<p>The current topic of debate on the Debian-security mailing list is about how to shield data which comes from an encrypted file. SE Linux can protect the reading of the data from an encrypted file that one reads from /dev/mem (for all memory of the machine) or /proc//mem (for the memory of the process). But the logic behind is not that uncomplicated as one may assume. There are certain domains with the ultimate privileges in most of the SELinux configuration. To mention a few, there is unconfined_t for a default configuration and sysadm_t for a "strict" configuration. The USP of SE Linux is that it doesn't mandate a domain with ultimate privileges. If a majority of Linux users have an unconfined_t configuration and rest have a "strict" configuration, the domain that can access /dev/mem will always be there. The "strict" configuration can put SE Linux in permissive mode and can access /dev/mem. Though it is uncertain if it really works like this! But something close.</p>
<p>But that doesn't imply that SE Linux is not at all beneficial to its users. The difference between a typical Linux system and SE Linux system is that the former has many daemons running as root, while the later has only few processes running as root. The root owned processes that SE Linux constrains are commonly the network facing daemons and others which are riskier. The ones which aren't constrained by SE Linux policy are the processes related to early stages of the system boot and few of the other trusted processes </p>
<p>SE Linux helps when the user doesn't want everyone to have an access but enables a person to read what is worth sharing. So if a person doesn't need to know some or part of information, the user has the ability not to give access to that information. A new domain can be created by a policy which will access the decrypted data and deny its ability to ptrace itself. It will require around some time, as it is not the default configuration.</p>
<p>All what SE Linux can provide the users is another improvement in security but it cannot completely help overcome the risk associated with the security problems. If we look into it broadly, we can analyze the fact that accessing of certain data with a single program exclusively for it, is quite impossible. But the idea that can fix the problem may be - using a public key to the secret keys that will be exported rather than exporting the encrypted keys.</p>
<p>If you have got the secret key, you can send file signed by the secret key and read file encrypted to it anyway. Of course, you could grant root an appropriate security clearance, but a common perception is that the more people know a secret, the less secure it is. But SE Linux provides a hybrid of concepts and capabilities drawn from mandatory access controls, <a href="http://en.wikipedia.org/wiki/Role-based_access_control">role-based access control</a> (RBAC), and <a href="http://en.wikipedia.org/w/index.php?title=Type_enforcement_architecture&amp;action=edit&amp;redlink=1">type enforcement architecture</a>. With the help of third-party tools it can build a variety of security policies. </p>
<p>All in all, SE Linux is still under the process of modification so that it can provide something which is considered to be unattainable yet, but hopefully it will be. Soon. </p>
