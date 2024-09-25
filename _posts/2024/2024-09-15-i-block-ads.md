# I Block Ads

Growing up during the TV boom of the 1980s and 90s, I loved Advertisements.[^Advertising] That was actually how one learned about new things. Advertisements (ads) are intended to let people know what they didn’t know and to reiterate if they might forget.

Recently, after I upgraded to [macOS Sequoia 15.0](http://apple.com/macos/macos-sequoia/), I realized that my current AdBlocker,[^Adblocking] [AdGuard](https://adguard.com/), was not working in Safari. This was [due to a conflict](https://github.com/AdguardTeam/CoreLibs/issues/1914) between Adguard and Apple [iCloud Private Relay](https://support.apple.com/en-us/102602). For now, I fixed it by turning the Private Relay <kbd>OFF</kbd> while waiting for Adguard/Apple to release a patch.

In that short window of a few hours, I realized that the Internet is an unforgiving place to browse without an AdBlocker. As I was on my usual chore of collecting and sharing `interesting`, `weird`, and `strange` finds for [Hacker News](/2023/hacker-news/), I was stunned to see how unusable the browsing experience had become.

I pay for a lot of the media I consume, and many of them are just to remove the ads. I will do my part where I can and where I can afford to buy my way out of Ads. Unfortunately, that is a small portion — everywhere else is littered with ads.

The digital world has skewed intentions to such a degree that ads are now **targeted, trained, and tailored** to the point that if you divert your attention a few fractions elsewhere, they will **recalculate, recalibrate, and retarget** to get back to you to think and believe in what they intend you to.

> The best minds of my generation are thinking about how to make people click ads. — [Jeff Hammerbacher](https://en.wikipedia.org/wiki/Jeff_Hammerbacher)

I block ads in the browser (client) and at the DNS level. The combination of these two is effective enough for now.

Of course, I don’t hate ads. It is a legitimate business model. I just don’t like the over-done ads that is everywhere, and in everything. For reference, Google generated over $224 billions in 2022, and $237.86 billions in 2023 from ads.

<img class="full" src="/static/2024/ads-ads-ads.webp" alt="Ads Ads Ads" loading="lazy">

These days, it is impossible to read/view the actual content of most websites—they are filled with the landmines of ads. There is no way to have a normal decent web experience without an AdBlocker or a few of them. Someone rightly said, “Content” is an advertising term for whatever fills the space between all the ads.

Even the USA’s agency, [FBI suggest using Adblockers](https://www.ic3.gov/Media/Y2022/PSA221221). The reasoning, in this case, is to avoid falling prey to cyber criminals impersonating brands using search engine advertisement services to defraud users. ([archive](https://archive.is/3Mioj))

Here are a few tools to get you started;

## DNS Resolvers with AdBlockers

These tools help you resolve your internet queries by routing them through their servers worldwide. One of the features included in these services is blocking ads at the DNS level. You can use this and other client-side AdBlockers for a more effective Ad blocking setup.

- [NextDNS](https://nextdns.io) protects you from all kinds of security threats, blocks ads and trackers on websites and in apps and provides a safe and supervised Internet for kids — on all devices and on all networks.
- [Control D](https://controld.com) is a modern and customizable DNS service that blocks threats, unwanted content and ads - on all devices.
- [AdGuard DNS](https://adguard-dns.io/) / [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) controls all web traffic on your devices, block ads, trackers, and malicious domains.
- [Pi-Hole](https://pi-hole.net) network-wide ad blocking via your own Linux hardware. [I started with this](/2019/pi-hole-blocking-ads-at-home/).

## Ad-Blockers

- [uBlock Origin](https://ublockorigin.com) - Free, open-source ad content blocker.
- [AdGuard](https://adguard.com/) - Surf the Web ad-free and safely.

## Others

- [AdBlock Tester](https://adblock-tester.com) tests your Browser’s AdBlocking effectiveness.

[^Advertising]: [Advertising](https://en.wikipedia.org/wiki/Advertising) is the practice and techniques employed to bring attention to a product or service. Advertising aims to present a product or service in terms of utility, advantages and qualities of interest to consumers. It is typically used to promote a specific good or service, but there are a wide range of uses, the most common being commercial advertisement.

[^Adblocking]: [Ad blocking](https://en.wikipedia.org/wiki/Ad_blocking) or ad filtering is a software capability for blocking or altering online advertising in a web browser, an application or a network. This may be done using browser extensions or other methods.