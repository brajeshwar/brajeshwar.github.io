# Startup Research, CSS text-overflow and why should you keep things simple

One of the early topics in the Founder Institute curriculum is "Startup Research". Here is a video and [slides](https://www.scribd.com/doc/33104662/SVFI-June-15-Start-up-Research-Adeo-Ressi) of a Startup Research lesson to the Silicon Valley program by Adeo Ressi, Founder of the Founder Institute.

The talk provides an overview of how the character of different markets affects the reality of operation, how good research is critical to helping a founder understand both the journey and the destination, and how founders cannot escape the realities of the market that they are in. It is a very informative lesson and provides many practical tips for performing diligent market research before diving into a market. Follow [@founding](https://twitter.com/#!/@founding) to keep yourself updated.

## text-overflow

You can now pretty much start using text-overflow CSS property as Firefox is implementing it soon. Other browsers pretty much [support them](https://www.caniuse.com/#search=text-overflow) for quite sometime - IE9, Chrome, Opera, Safari.

Here's how to show an ellips to represent clipped text;

```css
.ellips {
  overflow: hidden;
  white-space: nowrap; /* pre works as well */
  text-overflow: ellipsis;
}
```

[Here is why](https://bricss.net/post/7389475148/text-overflow-almost-supported-everywhere), "If you want to give users a chance of reading the clipped text, you could set overflow to auto instead of hidden to make a scrollbar appear. When this happens, the spec says that browsers should let users scroll to show more content. This only seems to work in Opera and IE9."

## Simple is Beautiful

Another amazing article from Andrew Chen on being simple is the better way - Simple products aren't only better designed, they're easier to market too. Highly optimized and simple products are dead simple to use - they have landing pages that communicate a compelling value, soft on-boarding flows, clear calls to action, and simple mechanics that drive a lot of value. The same things that make it a highly marketable product are the same things that make it well-designed, and a great thing for which every product should strive.

Read the full article at Andrew Chen's blog - [Simple is Marketable](https://andrewchenblog.com/2011/07/08/simple-is-marketable/).

While we're on the topic of marketing, here is a marketing truth from Conversation Marketing - [People buy pleasure, not prevention](https://www.conversationmarketing.com/2011/07/marketing-truths-people-pleasure-prevention.htm). So, whatever you're selling, make it a provider of good. Not a preventer of bad.

- Don't sell burglar protection. Sell security.
- Don't sell bike helmets. Sell really cool Transformer helmets that every kid's gonna want.
- Sell a 'good', not a preventer of 'bad', and you'll beat your less savvy competitors.