---
layout: post
title: Django 1.0 alpha released
date: 2008-07-22 05:56:41.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: []
tags:
- Alpha
- Django
- Newforms
- Python
- Releases
- svn
- Templates
- XSS
meta:
  dsq_thread_id: '309969920'
  bitly_short_url: http://j.mp/iq8QJW
  retweet_cache: '1309548126:0'
  trx_addons_post_views_count: '47'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/django-10-alpha-released/"
excerpt: Django 1.0 Alpha is the first in a series of preview/development releases
  leading up to the eventual release of Django 1.0, currently scheduled to take place
  in early September 2008.
---
<p>Django Project have <a href="http://www.djangoproject.com/weblog/2008/jul/21/10-alpha/">released Django 1.0 Alpha</a> today (22nd Jul, 2008 IST). If this is the timeline Django would stick to; then, Django 1.0 final release should hit the web on 2nd Sep, 2008. Alpha 1.0 release includes all of the major features due for inclusion in the final Django 1.0.</p>

<p>Here are the important dates from the <a href="http://code.djangoproject.com/wiki/VersionOneRoadmap#schedule">Django 1.0 Schedule</a>;</p>
<p>table{border:1px solid #666}.<br />
|_. Date |_. Django 1.0 |<br />
| Jul 20, 2008 | 1.0 Alpha |<br />
| Aug 05, 2008 | 1.0 Beta 1 |<br />
| Aug 12, 2008 | 1.0 Beta 2 |<br />
| Aug 19, 2008 | 1.0 RC 1 |<br />
| Sep 02, 2008 | 1.0 |</p>
<p><em>Here are some interesting excerpts from the <a href="http://www.djangoproject.com/documentation/release_notes_1.0_alpha/">Release Notes</a>;</em></p>
<p><strong>The much needed @newforms-admin@ is refactored and here to stay.</strong></p>
<p>The <a href="http://www.djangoproject.com/documentation/admin/">Django administrative interface</a> (@django.contrib.admin@) has been completely refactored; admin definitions are now completely decoupled from model definitions (no more @class Admin@ declaration in models!), rewritten to use Django's new form-handling library (introduced in the 0.96 release as django.newforms, and now available as simply django.forms) and redesigned with extensibility and customization in mind.</p>
<p><strong>Improved Django ORM</strong></p>
<p>Django's object-relational mapper -- the component which provides the mapping between Django model classes and your database, and which mediates your database queries -- has been dramatically improved by a massive refactoring. For most users of Django this is backwards-compatible; the public-facing API for database querying underwent a few minor changes, but most of the updates took place in the ORM's internals.</p>
<p><strong>Automatic escaping of template variables</strong></p>
<p>To provide improved security against cross-site scripting (XSS) vulnerabilities, Django's template system now <a href="http://www.djangoproject.com/documentation/templates/#automatic-html-escaping">automatically escapes the output</a> of variables. This behavior is configurable, and allows both variables and larger template constructs to be marked as safe (requiring no escaping) or unsafe (requiring escaping). Sweet!</p>
<p><strong>How to get a copy of Django?</strong></p>
<p>* Django <a href="http://www.djangoproject.com/download/">Download Page</a><br />
* @svn co http://code.djangoproject.com/svn/django/trunk/@ (our choice)<br />
* Or else you can stay with the <a href="http://www.djangoproject.com/download/">stable release</a>.</p>
