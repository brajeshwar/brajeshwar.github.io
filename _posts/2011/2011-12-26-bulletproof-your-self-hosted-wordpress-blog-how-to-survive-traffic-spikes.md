# Bulletproof your self-hosted Wordpress blog - how to survive traffic spikes

There is a rather complex, long and detailed article on how to <a href="http://www.maxmasnick.com/guides/bulletproof_your_blog/">Bulletproof your blog: a guide for surviving traffic spikes</a>, but for all the other self-hosted Wordpress blogs out there, here is a simple non-geeky solution suited for most of us. You don't need to edit anything, pull or push anything - you've to just worry about your actual writing/blogging.

Recently one of my article, [Desingineer - the mythical person every Startups are looking for](/2011/desingineer-the-mythical-person-every-startups-are-looking-for/), stayed on the frontpage of HackerNews for about 24 hours and it held up without any problem. Here is the [video](/2011/how-is-it-like-during-the-first-hour-when-your-site-is-on-top-of-hackernews/) of the traffic onslaught.

## Hosting

Host with a service provider who can scale up when you get a traffic spike. These days, there are Wordpress speciality hosting providers. If yours is Wordpress, why not host with them. I've hosted with both WPEngine and Page.ly and they're equally good - go ahead and pick one.

### [WPEngine](http://wpengine.com/)

I hosted my own blog when they were starting. They're very good. Some of the best tech geeks, I respect, are behind this company. They know the ins and outs of Wordpress. Unfortunately, my site can no longer afford their price of $199 per month. However, the starting price of $49 may be just fit for most blogs.

### [Page.ly](http://page.ly/)

My site is currently hosted on Page.ly. Their support is super awesome. Their recent upgrade to better infrastructure is well noticed and is showing good signs. My site's uptime is awesome - some 99.99% or so for the last couple of months. Most blogs should be able to take advantage of their starting price of $19.95 per month hosting package and their $49.95 per month is pretty good enough for more popular blogs. If you hit any of the ceiling, they will gently ask you to upgrade to a higher plan.

### Cache Plugin

A must-have for any self-hosted Wordpress blog. Both of the above hosting providers will take care of installing and maintaining a cache plugin they're comfortable with. You don't even have to worry about that. `WP Total Cache` is a popular one.

## CloudFlare

CloudFlare literally reduces everything in half - the spike, the in-coming hits, threats, bandwidths and even the cost. For any decently trafficked self hosted blog, CloudFlare is a very good solution. The free version is good enough. CloudFlare even comes built-in with a robust DNS Manager.

## CDN (Optional)

Use a CDN for your static assets - images, photos, videos. I use Amazon's Cloudfront for all my static files on separate sub-domains. This has few advantages

- My wordpress is pristine Wordpress with just my theme files. If I need to move or change hosting providers, I can do it with just the Database Backup and can do it within minutes.
- Reduces load on your Wordpress hosting provider thus staying within their bandwidth limit (mostly).
- AWS (S3, Cloudfront) is pretty cheap and thanks to CloudFlare, the cost can be cut to half.

That's it, simple and straight, (i) go for good Wordpress specific hosting provider (ii) CloudFlare.
