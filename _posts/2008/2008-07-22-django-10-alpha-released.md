---
layout: post
title: Django 1.0 alpha released
---

Django Project have <a href="http://www.djangoproject.com/weblog/2008/jul/21/10-alpha/">released Django 1.0 Alpha</a> today (22nd Jul, 2008 IST). If this is the timeline Django would stick to; then, Django 1.0 final release should hit the web on 2nd Sep, 2008. Alpha 1.0 release includes all of the major features due for inclusion in the final Django 1.0.

Here are the important dates from the <a href="http://code.djangoproject.com/wiki/VersionOneRoadmap#schedule">Django 1.0 Schedule</a>;

|Date |Django 1.0 |
| -- | -- |
| Jul 20, 2008 | 1.0 Alpha |
| Aug 05, 2008 | 1.0 Beta 1 |
| Aug 12, 2008 | 1.0 Beta 2 |
| Aug 19, 2008 | 1.0 RC 1 |
| Sep 02, 2008 | 1.0 |

Here are some interesting excerpts from the <a href="http://www.djangoproject.com/documentation/release_notes_1.0_alpha/">Release Notes</a>;

The much needed `newforms-admin` is refactored and here to stay.

The <a href="http://www.djangoproject.com/documentation/admin/">Django administrative interface</a> (`django.contrib.admin`) has been completely refactored; admin definitions are now completely decoupled from model definitions (no more `class Admin` declaration in models!), rewritten to use Django's new form-handling library (introduced in the 0.96 release as django.newforms, and now available as simply django.forms) and redesigned with extensibility and customization in mind.

Improved Django ORM

Django's object-relational mapper -- the component which provides the mapping between Django model classes and your database, and which mediates your database queries -- has been dramatically improved by a massive refactoring. For most users of Django this is backwards-compatible; the public-facing API for database querying underwent a few minor changes, but most of the updates took place in the ORM's internals.

Automatic escaping of template variables

To provide improved security against cross-site scripting (XSS) vulnerabilities, Django's template system now <a href="http://www.djangoproject.com/documentation/templates/#automatic-html-escaping">automatically escapes the output</a> of variables. This behavior is configurable, and allows both variables and larger template constructs to be marked as safe (requiring no escaping) or unsafe (requiring escaping). Sweet!

How to get a copy of Django?

* Django <a href="http://www.djangoproject.com/download/">Download Page</a>
* `svn co http://code.djangoproject.com/svn/django/trunk/` (our choice)
* Or else you can stay with the <a href="http://www.djangoproject.com/download/">stable release</a>.
