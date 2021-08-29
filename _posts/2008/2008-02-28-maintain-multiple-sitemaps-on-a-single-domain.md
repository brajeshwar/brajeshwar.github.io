# Multiple Sitemaps on a single Domain

Do you have more than one website, or rather lots of them? You can now reduce one hassle of the many that goes in maintaining lots of websites, blogs -- the ability to place Sitemaps for multiple hosts on a single host through robots.txt.

We know how to include <a href="/2007/just-add-to-your-robotstxt-no-need-to-submit-sitemap-to-google/">auto-discovery of Sitemaps</a> using robots.txt. Google have <a href="http://googlewebmastercentral.blogspot.com/2008/02/cross-submissions-via-robotstxt-on.html">announced</a> a new way for Sitemap cross-submissions using Google Webmaster Tools, making it possible to submit Sitemaps for multiple hosts on a single dedicated host.

For instance, if I want to submit and maintain Sitemaps for each of these sites --

- www.domain.com
- sub-domain.domain.com, and
- blog.domain.com

and to make things easier, I want to host all the Sitemaps on `domain.com`.

I can make the best out of cross-submission support by telling the search engines (Google, Yahoo!, Microsoft) where the Sitemaps are with robots.txt --

- The robots.txt for domain.com would include: `Sitemap: http://www.domain.com/sitemap-www-domain.xml`
- Similarly, the robots.txt for sub-domain.domain.com would include: `Sitemap: http://www.domain.com/sitemap-sub-domain.domain.xml`
- And for the third one, the robots.txt for blog.oinam.com would include: `Sitemap: http://www.domain.com/sitemap-blog-domain.xml`

Here are a few other useful notes about the implementation

- robots.txt can have multiple "Sitemap:" references.
- Limit the size of robots.txt file to less than 1 MB.
- If multiple sitemaps for a domain include the same URL with conflicting metadata (i.e. priority, change frequency, etc), the metadata will be disregarded and just the URL will be considered.
- Individual sitemap files should never be larger than 10 MB when uncompressed. This includes all sitemap file formats: XML, RSS and Text.