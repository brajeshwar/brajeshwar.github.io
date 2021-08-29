# Google Researchers found vulnerabilities in Flash

The Register <a href="http://www.theregister.co.uk/2007/12/21/flash_vulnerability_menace/">reports</a> that Google Researchers have documented serious vulnerabilities in <a href="http://www.adobe.com/go/flashplayer/">Adobe Flash</a> content which leave tens of thousands of websites susceptible to attacks that steal the personal details of visitors.

The security bugs are in the Flash SWFs, the ubiquitous building blocks for graphics, animation, audio, video and high-end (Enterprise) Rich Internet Applications across the web. According to the research findings, the SWFs are vulnerable to attacks in which malicious strings can be injected into the legitimate code through cross-site scripting or XSS. Currently, there are no patches for the vulnerabilities. The latest <a href="http://www.adobe.com/go/flashplayer/">Flash Player</a> (version 9.0.115.0) release do not fix this vulnerabilities.

The vulnerabilities are laid out in an upcoming book <a href="http://www.amazon.com/Hacking-Exposed-Web-2-0-Solutions/dp/0071494618/">Hacking Exposed Web 2.0: Web 2.0 Security Secrets and Solutions</a>. It is due to hit store shelves soon, but is already in the hands of many security professionals. The book's authors, who work for penetration testing firm iSEC Partners as well as for Google, say a web search reveals more than 500,000 vulnerable applets on major corporate, government and media sites.

Alex Stamos, one of the book's authors said;

> Lots of people are vulnerable, and right now there are no protections available other than to remove those SWFs and wait for the authoring tools and/or Flash player to be updated. In the mean time, people will have to think, "What kind of flash am I using on my site," and manually test for vulnerabilities.
> 
> Removing the vulnerable content will require combing through website directories for SWF files and then testing them one by one. Updates in the Adobe software that renders SWF files in browsers are also likely, but they probably wouldn't quell the threat completely.

Here is an attack scenarios -- A bank website hosts marketing graphics in the form of a vulnerable Flash applet. Attackers who trick a customer into clicking on a malicious link are able to execute the SWF file but inject malicious code variables that cause the customer's authentication cookies or login credentials to be sent to the attacker.

Stamos adds that Adobe is likely to update its Flash Player so it does a better job of vetting code variables before executing SWF files. But he said interaction with third-party code is such a core part of the way Flash works that updates to the player would likely provide only a partial fix. Eradicating the problem will require updates for all of the SWF rendering and Flash authoring tools so they no longer generate buggy Flash content.

Perhaps, this is the second big vulnerability that made such a noise about Flash Player insecurity. However, we should remember that the technique is pretty much applicable to all other technologies - Javascript, Server Side Scripts, etc. Being able to do that in Flash SWFs make it a bit techy, automatic and sophisticated. Personally, I'm not sure if the Registry authors know all the abilities of Flash, they keep talking about just graphics and animations about Flash. Well, that's so Flash 4; we're in Flash 9 now! The Internet has lots of people who hate Flash because they still think Flash of the Flash 4 or Flash 5 "Skip Intro" days.
