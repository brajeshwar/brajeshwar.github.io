# Twitter - short, sweet and sleek - Let's get started

Twitter has suddenly attained the status of a notoriously popular Application. After being fueled by [SXSW](https://sxsw.com/), everybody else is talking about Twitter including those [who don't even have a blog](https://manwithnoblog.com/2007/03/10/twitter-explosion/). Talks in the Blogosphere have spit out stats that Twitter got 1 million messages sent recently. Finally after about a year of its launch, Twitter has won. 

Of course, it is not everybody that loves Twitter, some seriously [hate it](https://www.brianalvey.com/2007/03/10/putting-the-twit-in-twitter/).

I just got a tweet from BBC News - Train services resume along a stretch of the West Coast Main Line in Cumbria after a fatal train crash. [https://tinyurl.com/2jkv4c](https://tinyurl.com/2jkv4c)

## Twitter

[Ross Mayfield](https://ross.typepad.com/), CEO of [SocialText](https://twitter.com/socialtext) have an [in-depth article](https://ross.typepad.com/blog/2007/03/twitter_tips_th.html) on Twitter, its statistics, etc. He describes Twitter as, "a mobile social software that lets you broadcast and receive short messages with your social network.  You can use it with SMS, on the web or IM." "A darn easy API has enabled other clients such as [Twitterific](https://iconfactory.com/software/twitterrific) for the Mac.  Twitter is Continuous Partial Presence, mostly made up of mundane messages in answer to the question - What are you doing?. A never-ending steam of presence messages prompts you to update your own.  Messages are more ephemeral than IM presence -- and posting is of a lower threshold, both because of ease and accessibility, and the informality of the medium."

Another tweet from [Digg](https://digg.com/) - The Pirate Bay gives diploma to the King of Sweden - [https://tinyurl.com/ypwgb3](https://tinyurl.com/ypwgb3) - The Pirate Bay guys congratulates the King of Sweden for go.

At the time of writing this article, here are the Twitters that I follow (and perhaps you might be interested)

- [Molly E. Holzschlag](https://twitter.com/mholzschlag)
- [Eric Meyer](https://twitter.com/emeyer)
- [Anil Dash](https://twitter.com/anildash)
- [Jason Calacanis](https://twitter.com/JasonCalacanis)
- [Jeffery Zeldman](https://twitter.com/zeldman)
- [Steve Rubel](https://twitter.com/steverubel)
- [ArsTechnica](https://twitter.com/arstechnica)
- [BBC News](https://twitter.com/bbcnews)
- [CNN Breaking News](https://twitter.com/cnnbrk)
- [Digg](https://twitter.com/digg_feeds)
- [Emily Chang](https://twitter.com/emilychang)
- [Ross Mayfield](https://twitter.com/Ross)
- [Defamer](https://twitter.com/defamer)
- [FlashGuru](https://twitter.com/_appbuzz)
- [Jesse Warden](https://twitter.com/jesterxl)
- [Keith Peters](https://twitter.com/bit101) (Adobe)
- [Apollo](https://twitter.com/apollocamp) (Adobe)
- [Flex](https://twitter.com/flex) (Adobe)
- [Mike Chambers](https://twitter.com/mesh) (Adobe)
- [Mike Downey](https://twitter.com/mdowney) (Adobe)

[Paul Stamatiou](https://paulstamatiou.com/) have a good idea on how to Twitter on Steroid. Well, not really to that extend of irritation but that's what I come up with - Twitter on Steroid. Here's how. follow all the steps from Paul to get an [RSS to Twitter using PHP](https://paulstamatiou.com/2007/01/26/stammy-script-rss-to-twitter-using-php/). Now, get an array of all your RSS Feeds - your Blog(s), your Flickr Feed, your YouTube Videos - combine them into one (there are lots of services that does that). Finally, twitter this Mother RSS Feed. Paul have a cron job to do the RSS push, I'm sure we can work out a way to ping the app to Twitter whenever there is a publication from the Feed. That's it and you might even have a non-stop twitter-ing; to the point that your followers might get irritated. Use it wisely.

Twitter Powered

- [GeoTwitter](https://geotwitter.org/): [Google Maps API](https://www.google.com/apis/maps/) + [Twitter API](https://help.twitter.com/)
- Twadget: Windows Vista Sidebar gadget
- [Chitter](https://www.roflsoftware.com/2007/01/14/chitter/): MAC OS X plugin for iChat
- [Twitterific](https://iconfactory.com/software/twitterrific): Mac OS X tool
- [Twitgit](https://ben-ward.co.uk/widgets/twitgit/): Mac OS X Dashboard Widget
- Prom Queen: turn all your followers into friends

## TinyURL

[TinyURL](https://tinyurl.com/) shortens your long url to a short redirect URL. TinyURL makes it extremely easy to use their service - on their website, browser toolbar - and an even easier API which makes Twitter so easy to have tiny URLs replacing long URLs that people twits. Twitter have made the best use of TinyURL and is perhaps its best companion.

For instance, in PHP, it can be simple as

```php
// the url to be shortened
$theurl = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
// the final result
$tiny_url =  file_get_contents("http://tinyurl.com/api-create.php?url=" . $theurl);
```