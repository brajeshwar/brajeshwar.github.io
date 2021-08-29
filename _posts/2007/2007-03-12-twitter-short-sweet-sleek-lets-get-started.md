# Twitter - short, sweet and sleek - Let's get started

Twitter has suddenly attained the status of a notoriously popular Application. After being fueled by <a href="http://sxsw.com/">SXSW</a>, everybody else is talking about Twitter including those <a href="http://manwithnoblog.com/2007/03/10/twitter-explosion/">who don't even have a blog</a>. Talks in the Blogosphere have spit out stats that Twitter got 1 million messages sent recently. Finally after about a year of its launch, Twitter has won. 

Of course, it is not everybody that loves Twitter, some seriously <a href="http://www.brianalvey.com/2007/03/10/putting-the-twit-in-twitter/">hate it</a>.

Wait, I just got a Twitter from BBC News - Train services resume along a stretch of the West Coast Main Line in Cumbria after a fatal train crash. <a href="http://tinyurl.com/2jkv4c">http://tinyurl.com/2jkv4c</a>

## Twitter

<a href="http://ross.typepad.com/">Ross Mayfield</a>, CEO of <a href="http://twitter.com/socialtext">SocialText</a> have an <a href="http://ross.typepad.com/blog/2007/03/twitter_tips_th.html">in-depth article</a> on Twitter, its statistics, etc. He describes Twitter as, "a mobile social software that lets you broadcast and receive short messages with your social network.  You can use it with SMS, on the web or IM." "A darn easy API has enabled other clients such as <a href="http://iconfactory.com/software/twitterrific">Twitterific</a> for the Mac.  Twitter is Continuous Partial Presence, mostly made up of mundane messages in answer to the question - What are you doing?. A never-ending steam of presence messages prompts you to update your own.  Messages are more ephemeral than IM presence -- and posting is of a lower threshold, both because of ease and accessibility, and the informality of the medium."

Ah! I got another Twitter from <a href="http://digg.com/">Digg</a> - The Pirate Bay gives diploma to the King of Sweden - <a href="http://tinyurl.com/ypwgb3">http://tinyurl.com/ypwgb3</a> - The Pirate Bay guys congratulates the King of Sweden for go.

At the time of writing this article, here are the Twitters that I follow (and perhaps you might be interested)

- <a href="http://twitter.com/Mols">Molly E. Holzschlag</a>
- <a href="http://twitter.com/emeyer">Eric Meyer</a>
- <a href="http://twitter.com/anildash">Anil Dash</a>
- <a href="http://twitter.com/JasonCalacanis">Jason Calacanis</a>
- <a href="http://twitter.com/zeldman">Jeffery Zeldman</a>
- <a href="http://twitter.com/steverubel">Steve Rubel</a>
- <a href="http://twitter.com/arstechnica">ArsTechnica</a>
- <a href="http://twitter.com/bbcnews">BBC News</a>
- <a href="http://twitter.com/cnnbrk">CNN Breaking News</a>
- <a href="http://twitter.com/digg_feeds">Digg</a>
- <a href="http://twitter.com/emilychang">Emily Chang</a>
- <a href="http://twitter.com/Ross">Ross Mayfield</a>
- <a href="http://twitter.com/defamer">Defamer</a>
- FlashGuru
- <a href="http://twitter.com/jesterxl">Jesse Warden</a>
- <a href="http://twitter.com/bit101">Keith Peters</a> (Adobe)
- <a href="http://twitter.com/apollocamp">Apollo</a> (Adobe)
- <a href="http://twitter.com/flex">Flex</a> (Adobe)
- <a href="http://twitter.com/mesh">Mike Chambers</a> (Adobe)
- <a href="http://twitter.com/mdowney">Mike Downey</a> (Adobe)

<a href="http://paulstamatiou.com/">Paul Stamatiou</a> have a good idea on how to Twitter on Steroid. Well, not really to that extend of irritation but that's what I come up with - Twitter on Steroid. Here's how. follow all the steps from Paul to get an <a href="http://paulstamatiou.com/2007/01/26/stammy-script-rss-to-twitter-using-php/">RSS to Twitter using PHP</a>. Now, get an array of all your RSS Feeds - your Blog(s), your Flickr Feed, your YouTube Videos - combine them into one (there are lots of services that does that). Finally, twitter this Mother RSS Feed. Paul have a cron job to do the RSS push, I'm sure we can work out a way to ping the app to Twitter whenever there is a publication from the Feed. That's it and you might even have a non-stop twitter-ing; to the point that your followers might get irritated. Use it wisely.

Twitter Powered

- <a href="http://geotwitter.org/">GeoTwitter</a>: <a href="http://www.google.com/apis/maps/">Google Maps API</a> + <a href="http://help.twitter.com/">Twitter API</a>
- Twadget: Windows Vista Sidebar gadget
- <a href="http://www.roflsoftware.com/2007/01/14/chitter/">Chitter</a>: MAC OS X plugin for iChat
- <a href="http://iconfactory.com/software/twitterrific">Twitterific</a>: Mac OS X tool
- <a href="http://ben-ward.co.uk/widgets/twitgit/">Twitgit</a>: Mac OS X Dashboard Widget
- Prom Queen: turn all your followers into friends

## TinyURL

<a href="http://tinyurl.com/">TinyURL</a> shortens your long url to a short redirect URL. TinyURL makes it extremely easy to use their service - on their website, browser toolbar - and an even easier API which makes Twitter so easy to have tiny URLs replacing long URLs that people twits. Twitter have made the best use of TinyURL and is perhaps its best companion.

For instance, in PHP, it can be simple as

```php
// the url to be shortened
$theurl = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
// the final result
$tiny_url =  file_get_contents("http://tinyurl.com/api-create.php?url=" . $theurl);
```