# An open source PHP client for SURBL; thanks to the spam attack on nsfw.in

Couple of days back, I got an email from Amazon Abuse Desk, that botnet spammers were abusing [NSFW.in](https://nsfw.in). Our IP on the AWS EC2 was added to [The Spamhaus Block List](https://www.spamhaus.org/sbl/). Some Russian botnet spam gangs were creating automates short url at NSFW.in.

[Abhinay](https://abhiomkar.in/) created a PHP Client for [SURBL](https://www.surbl.org/). Now, NSFW.in short-link creation just need to look up the domain against SURBL to see if a domain is blacklisted or not.

The [SURBL PHP client](https://github.com/abhiomkar/php-surblclient) is released as Open-Source under MIT license and is [available at Github](https://github.com/abhiomkar/php-surblclient).

[NSFW.in](https://nsfw.in/) is a url shortening service that makes unsafe URLs safer!
