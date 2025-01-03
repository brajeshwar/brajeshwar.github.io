# brajeshwar.com - 20+ years old site - WordPress to Static

The website has come a long way - well - 20 years. It started as a Flash Site in 2001. I moved on to Blogspot, later known as [Blogger](https://www.blogger.com/), then to [MovableType](https://movabletype.org) (2002), and later to [WordPress](https://wordpress.org) (2003-ish or so) ever since its early beta. I stayed with WordPress for a very long time - about 18 years.

I had spent enough hobby time with WordPress that I published quite a few themes, plugins, and some went on to become pretty popular. Every design iterations were themed and open sourced. One theme even went to be acquired by [Automattic](https://automattic.com), the company behind WordPress.

After 20 years, as of Jun 2021, I have done away with comments and discarded a whole lot of other metadata. I have also pruned over 250 articles. Now, articles are just Markdown files with a `# Title` and the content. There are NO `tags`, `categories`, `SEO`, `analytics` or any other `jazz` at all.

The Markdown files don’t even have front matter[^frontmatter] and are as human-readable as possible and will likely be readable on any system now and ever. I have decided to stay as plain-text as possible while using Markdown syntax for a minimal visual guide to differentiate content variations such as `headings`, `code`, and sometimes to add aesthetically relevant media — audio, video, and images.

[Plain-Text](/2022/plain-text/) makes life much simpler. I can write in tools that focus on writing without worrying about Static Site Generators like [Jekyll](https://jekyllrb.com), [Hugo](https://gohugo.io), [11ty](https://www.11ty.dev) or any other Jamstack[^Jamstack] to render the website.

I can write quickly and easily write with my default Editor, [Sublime Text](https://www.sublimetext.com) or use other fantastic Plain-Text/Markdown writing tools at my disposal such as [iA Writer](https://ia.net/writer), [Typora](https://typora.io), [Panda](https://bear.app/panda/), or [Obsidian](https://obsidian.md).

Here are some well-written articles that will help you setup Sublime Text as the ultimate Markdown Editor. I did a combination of few ideas, simplified them, and tweaked it for my own style; go ahead and make your IDE your own. It should not be hard to adapt this for other editors too.

- [Building an ultimate writing machine from Sublime Text](https://tonsky.me/blog/sublime-writer/)
- [Writing in Sublime Text](https://kittygiraudel.com/2015/05/18/writing-in-sublime-text/)
- [6 Ways to Turn Sublime Text Into the Perfect Blogging Tool](https://www.sitepoint.com/sublime-text-perfect-blogging-6-ways/)
- [How To Turn Sublime Text 3 Into the Ultimate Markdown Editor](https://www.guidingtech.com/26607/turn-sublime-text-3-markdown/)
- [How To Set Up Sublime Text for Markdown Editing](https://plaintext-productivity.net/2-04-how-to-set-up-sublime-text-for-markdown-editing.html)

> In 2001, the domain, `brajeshwar.com` was booked on a dare and I'm happy with that decision. [Read the Story](/about/brajeshwar.com/).

## WordPress to Jekyll

### Q. Why did I chose Jekyll?

It is one of the simplest and the first few originals of Static Site Generators. Jekyll is established, stable, and has a huge community. If you have a problem, someone somewhere had very likely solved it.

It is the default tool at [Github Pages](https://pages.github.com) to generate static websites. One less thing to worry about is hosting your website.

<iframe width="100%" src="https://www.youtube.com/embed/xlwn1hFa5QI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Q. How did I do it?

Your mileage may vary, and I did stumble on few hiccups. However, it was easy, and people have solved many other complex problems when converting WordPress to Jekyll. In my case, I was not worried about neither the design nor the comments. 

My whole aim was to get all posts (articles) as Markdown files.

[Jekyll Exporter](https://wordpress.org/plugins/jekyll-exporter/) can convert your content to Jekyll compatible content. Unfortunately, it always died on me while converting my site (1500+ posts, pages, etc.) on the live server.

I ended up importing my WordPress content using the [Jekyll Import](https://github.com/jekyll/jekyll-import) gem. You can read the [official documentation](https://import.jekyllrb.com) to get started. I chose the [wordpress.com](https://import.jekyllrb.com/docs/wordpressdotcom/) version instead of the suggested self-hosted [wordpress](https://import.jekyllrb.com/docs/wordpress/) version (my website is self-hosted) because the Wordpress version requires access to the database, whereas, with the Wordpress.com version, you can just export and run this locally on your computer without the database.

This will take time. Mine had lots of images, audio, and video files being referenced from the articles. I waited for about 30-min.

I believed I got the final files as `.html` with many HTML markup left-overs from WordPress, [Textile](https://textile-lang.com), and custom codes that were forgotten over the years. I used [Pandoc](https://pandoc.org) to selectively convert a lot of the HTML markup to their Markdown equivalent.

I was happy with the final result, and the website was already running. However,  the files needed some manual cleaning as there were remnants of shortcodes (WordPress, Textile, custom plugins) and a few other metadata.

Almost every day, during the months of July and August of 2021, I spent about 10-15 minutes cleaning up the posts -- one year at a time -- from 2001 to 2020. I have too many posts to handle, so I separated each year into their own folders. [Sublime Text](https://www.sublimetext.com) made it easy to do a `Find & Replace` across folders to fix many references, links, etc. I was able to do sweeping replacements across 1500+ text files quickly in a matter of seconds.

Here are some references that I read while importing WordPress content to Jekyll;

- [How to Convert a Wordpress Site to Jekyll with Github Pages](https://adam.garrett-harris.com/2015-02-26-how-to-convert-a-wordpress-site-to-jekyll-with-github-pages/)
- [Migrating WordPress blog to Jekyll](https://nts.strzibny.name/migrating-wordpress-to-jekyll/)
- [How To: WordPress to Jekyll](https://paulstamatiou.com/how-to-wordpress-to-jekyll/)
- [From Wordpress To Jekyll](https://www.bawbgale.com/from-wordpress-to-jekyll/)

### Q. What about Static Assets from WordPress's wp-content?

I had ported the static parts to AWS S3 long back, and that made life easier. It made it easy for me to switch and try out hosting providers. I had to worry about the WordPress Posts part; all the static contents were already on AWS S3 with Cloudfront. The other reason was, once when my website was rather popular, I spent a lot on hosting and bandwidth were capped. With AWS, I spent less than double-digit dollars a month even when I was serving over 100GBs month bandwidth with the static sites (including open source downloads).

But it was not without its own problem. My articles were littered with `https://media.brajeshwar.com`, and `https://downloads.brajeshwar.com` references to the static files. However, to the readers and website visitors, it continues to work. Now, I'm serving all static files alongside the website, which are also just static HTML. Of course, it took less than 5-sec to do a `Find & Replace` and `Save All` in Sublime Text to convert all of that.

Even if you have your WordPress content inside the default `wp-content`, it should still be easy to transform your WordPress blog into a Static Site. It is up to you to name your static folder to anything -- stick with the `wp-content` inherited from WordPress, rename it to something like Jekyll's `assets`, or stick to a more generic `static` (Hugo uses static).

## Jekyll + Github Pages

[![Oinam Jekyll Theme)](/static/2021/oinam-jekyll-cover.png)](https://oinam.github.io/oinam-jekyll/)

With still a lingering 1200 posts, Jekyll Server was really slow. It took north of `10sec` to reflect the changes. I also tried [Hugo](https://gohugo.io) which turns out to be super-fast. However, I wanted a simpler solution. I stuck out with Jekyll and deployed on [Github Pages](https://pages.github.com). Well, once the design was done, I **DO NOT** have to run Jekyll while writing; if I want to preview, a MarkDown previewer is enough. Better yet -- take a break, make tea or coffee and come back for the rendered site. ;-)

During the early days, I wrote all sorts of crap. Many a blog post could have been a tweet but then, there was no [Twitter](https://twitter.com/brajeshwar).

I ended up designing a clean, simple, and minimal Jekyll Theme. The theme is open-sourced - [Oinam Jekyll](https://oinam.github.io/oinam-jekyll/). Feel free to use it, contribute or do anything you want.

It has the must-have and minimal [plugins](https://pages.github.com/versions/) to get the basics of writing and blogging work. Anything beyond what is there must be added after careful consideration.

As always, this website is [open source](https://github.com/brajeshwar/brajeshwar.github.io). Feel free to comment, raise issues, or fix up a pull request.

> Tip: In your website repository on [Github](https://github.com), hit the key <kbd>.</kbd> (that is a period), and you get yourself an excellent editor (VS Code). Now, you can write from anywhere on anything that has a browser.

## Onwards

The primary objective is to achieve tool-independent content. This ensures that all content remains transferable between diverse systems like CMS[^CMS] and SSG[^SSG], facilitating the generation of browser-compatible HTML. Storing content as plain text in Markdown format simplifies the task of shifting between systems.

This approach obviates the intricate steps often involved in content transfer, such as exporting, importing, and compatibility adjustments. Instead, integrating Markdown files into a new website platform requires minimal intervention.

For instance, in the case of my website, I can swap Jekyll for Hugo any time and run this website without worrying about the actual website content.

I'm learning a lot and a lot more to learn while moving to a [plain-text lifestyle](/2022/plain-text/). [Pandoc](https://en.wikipedia.org/wiki/Pandoc), [Markdown](https://en.wikipedia.org/wiki/Markdown), and [LaTeX](https://en.wikipedia.org/wiki/LaTeX) are my current tooling choices.

[^frontmatter]: Any file that contains a YAML front matter block will be processed by Jekyll as a special file. The [front matter](https://jekyllrb.com/docs/front-matter/)  must be the first thing in the file and must take the form of valid YAML set between triple-dashed lines. Here is a basic example:

[^Jamstack]: [Jamstack](https://en.wikipedia.org/wiki/Jamstack) stands for Javascript, API and Markup (generated by a static site generator) and was first coined by Mathias Biilmann, CEO of Netlify in 2015.

[^CMS]: A content management system (CMS) is computer software used to manage the creation and modification of digital content (content management). A [CMS](https://en.wikipedia.org/wiki/Content_management_system) is typically used for enterprise content management (ECM) and web content management (WCM).

[^SSG]: Static site generators (SSGs) are engines that use text input files (such as Markdown, reStructuredText, and AsciiDoc) to generate static web pages. Static sites generated by static site generators do not require a backend after site generation, making them first-class citizens on content delivery networks (CDNs). Some of the most popular static site generators are Jekyll, Hugo, and Next.js, etc. [SSGs](https://en.wikipedia.org/wiki/Static_site_generator) are typically for rarely-changing, informative content, such as product pages, news websites, (software) documentation, manuals, and blogs.