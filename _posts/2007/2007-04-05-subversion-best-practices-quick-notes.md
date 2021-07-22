---
layout: post
title: Subversion Best Practices - Quick Notes
date: 2007-04-05 16:38:12.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- branches
- control
- cvs
- repository
- svn
- tags
- trac
- trunk
- version
meta:
  _edit_last: '1'
  dsq_thread_id: '135616299'
  bitly_short_url: http://j.mp/jwz8rH
  retweet_cache: '1309553129:0'
  trx_addons_post_views_count: '46'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2007/subversion-best-practices-quick-notes/"
excerpt: This is a quick set of guidelines for making the best use of Subversion in
  your day-to-day software development work including why and when to branch, learn
  about merging.
---
<p>I was trying to know a bit more about Subversion folder management myself. While looking around, I found a quick and to-the-point article at Subversion Best Practices. I decided to profile a Quick-View version for my reference.</p>
<p><strong>BASIC</strong></p>
<p># REPOSITORY: <a href="http://svnbook.red-bean.com/svnbook/ch05s04.html#svn-ch-5-sect-6.1">Official recommendation</a> is to have three folders/subdirectories under the Project Root - "trunk", "branches" and "tags".<br />
# COMMIT WISELY: Commit to reflect a <a href="http://svnbook.red-bean.com/svnbook/ch04s03.html">single purpose</a>.<br />
# ISSUE-TRACKER: Create 2-way links between Subversion changesets and issue-tracking database.<br />
# TRACK MERGES MANUALLY: Write descriptive log message that explains <a href="http://svnbook.red-bean.com/svnbook/ch04s03.html#svn-ch-4-sect-3.2">your merge</a>.</p>
<p><br />
<strong>WHEN, WHAT AND WHY TO BRANCH, TAG</strong></p>
<p># NEVER BRANCH: Small project, small team. It is easy to follow, have low barrier to entry but this is a chaotic development, might break <em>/trunk</em> often.<br />
# ALWAYS BRANCH: Big team, Big project, dedicated management and supervision. The <em>/trunk</em> remains safe and is always the stable version but this will isolate coders from one another, sometimes can create conflicts and requires users to know how to use SVN effectively with extra merging lessons.<br />
# BRANCH WHEN NEEDED: Perhaps the best and my favorite. The <em>/trunk</em> is still the stable version, branches and tags are created as and when required. However, this needs a bit more work in managing the SVN and a sync between developers. Lots of testing before merging, committing.</p>
<p><br />
<strong>SO ...</strong></p>
<p>* Main branch is of course the <em>/trunk</em><br />
* Create branches at <em>/branches/~theBranches</em> to work separately off the main trunk and merge later.<br />
* Tag out releases or major versions etc at <em>/tags/~theTags</em></p>
<p><strong>UPDATES</strong></p>
<p>1st Oct, 2007: Kalid Azad has <a href="http://betterexplained.com/articles/a-visual-guide-to-version-control/">A Visual Guide to Version Control</a>.</p>
