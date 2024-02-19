# Static Blog with Github and Markdown

For a static blog written in Markdown, Github has all of that built-in.

When you’re on Github, use its IDE by pressing the `.` key. You can, of course, use Git and edit the files locally.

Own and maintain these two folders `_posts` and `_assets`. If you are going to write regularly, I suggest creating sub-folders inside `_posts` but name your Markdown files by date such as `2024-02-5-foo-bar-is-my-file.md`.

On Github, use Github Pages (officially powered by Jekyll) and deploy using one of the pre-defined Jekyll Themes[1]. That’s it, your blog is at `reponame.github.io` which you can CNAME it from a domain you own just like I did mine at `brajeshwar.com`.

Comments: You can either use Github Discussion as your blog’s commenting system or embed a third party service which you can export and carry around when you change such services. Honestly, and personally, I don’t want to deal with comments these days.

Now, for the customization, the themes are in simple Jekyll[2] which you can play around with.
In future, if you want to move from Jekyll to something else, you just have to worry about that `_posts` and `_assets` folder. They may have different naming convention but you can just config-managed it or change it to your choice. This is why I suggested owning that two yourself.

You also may not worry about FrontMatter[3] (meta in the header) and its accompanying jazz by asking Jekyll to use the plugins `jekyll-optional-front-matter` and `jekyll-titles-from-headings`. These comes as part of the officially supported Jekyll plugins[4] by Github. That way, you are just writing a human-readable plain-text spiced up with Markdown and readable by almost every other Static Site Generator.

Now, play with the `_config.yml` that Jekyll generates for you from the theme above to define your post dates, navigation, and others. Jekyll is one of the OGs — the Gandalf of Static Site Generators. If you have a problem, someone somewhere has solved that.

If you really think of it, “there is no spoon”, eer, I mean “Jekyll.”

1. https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll

2. https://jekyllrb.com

3. https://frontmatter.codes/docs/markdown

4. https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll#plugins