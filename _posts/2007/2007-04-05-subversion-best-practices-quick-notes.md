# Subversion Best Practices - Quick Notes

I was trying to know a bit more about Subversion folder management myself. While looking around, I found a quick and to-the-point article at Subversion Best Practices. I decided to profile a Quick-View version for my reference.

BASIC

- REPOSITORY: <a href="http://svnbook.red-bean.com/svnbook/ch05s04.html#svn-ch-5-sect-6.1">Official recommendation</a> is to have three folders/subdirectories under the Project Root - "trunk", "branches" and "tags".
- COMMIT WISELY: Commit to reflect a <a href="http://svnbook.red-bean.com/svnbook/ch04s03.html">single purpose</a>.
- ISSUE-TRACKER: Create 2-way links between Subversion changesets and issue-tracking database.
- TRACK MERGES MANUALLY: Write descriptive log message that explains <a href="http://svnbook.red-bean.com/svnbook/ch04s03.html#svn-ch-4-sect-3.2">your merge</a>.


WHEN, WHAT AND WHY TO BRANCH, TAG

- NEVER BRANCH: Small project, small team. It is easy to follow, have low barrier to entry but this is a chaotic development, might break <em>/trunk</em> often.
- ALWAYS BRANCH: Big team, Big project, dedicated management and supervision. The <em>/trunk</em> remains safe and is always the stable version but this will isolate coders from one another, sometimes can create conflicts and requires users to know how to use SVN effectively with extra merging lessons.
- BRANCH WHEN NEEDED: Perhaps the best and my favorite. The <em>/trunk</em> is still the stable version, branches and tags are created as and when required. However, this needs a bit more work in managing the SVN and a sync between developers. Lots of testing before merging, committing.

SO ...

* Main branch is of course the <em>/trunk</em>
* Create branches at <em>/branches/~theBranches</em> to work separately off the main trunk and merge later.
* Tag out releases or major versions etc at <em>/tags/~theTags</em>

UPDATES

1st Oct, 2007: Kalid Azad has <a href="http://betterexplained.com/articles/a-visual-guide-to-version-control/">A Visual Guide to Version Control</a>.
