# An open source PHP client for SURBL; thanks to the spam attack on nsfw.in

Couple of days back, I got an email from Amazon Abuse Desk, that botnet spammers were abusing <a href="http://nsfw.in">NSFW.in</a>. Our IP on the AWS EC2 was added to <a href="http://www.spamhaus.org/sbl/">The Spamhaus Block List</a>. Some Russian botnet spam gangs were creating automates short url at NSFW.in.

<a href="http://abhiomkar.in/">Abhinay</a> created a PHP Client for <a href="http://www.surbl.org/">SURBL</a>. Now, NSFW.in short-link creation just need to look up the domain against SURBL to see if a domain is blacklisted or not.

The <a href="https://github.com/abhiomkar/php-surblclient">SURBL PHP client</a> is released as Open-Source under MIT license and is <a href="https://github.com/abhiomkar/php-surblclient">available at Github</a>.

<a href="http://nsfw.in/">NSFW.in</a> is a url shortening service that makes unsafe URLs safer!
