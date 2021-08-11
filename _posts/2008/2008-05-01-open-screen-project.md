---
layout: post
title: Flash SWF and FLV/F4V Video is now Open Source
---
Today, Adobe <a href="http://www.adobe.com/aboutadobe/pressroom/pressreleases/200804/050108AdobeOSP.html">announced</a> the Open Screen Project and with it came the ultimate good news -- the SWF and FLV/F4V formats are now totally open source. Adobe has dropped the licensing restrictions on the formats. So, not only can you create tools that writes SWFs (this was already open) but now you can create tools that plays the formats back (you no longer need to just rely on the Flash Player).

The <a href="http://www.adobe.com/openscreenproject/">Open Screen Project</a> initiative by Adobe is supported by a group of industry leaders, including ARM, Chunghwa Telecom, Cisco, Intel, LG Electronics Inc., Marvell, Motorola, Nokia, NTT DoCoMo, Qualcomm, Samsung Electronics Co., Sony Ericsson, Toshiba and Verizon Wireless.

Well, one of the missing name in the list above is that of <a href="http://www.apple.com/">Apple</a>, which feels that <a href="http://www.brajeshwar.com/2008/flash-on-the-iphone/">Flash is not good enough for the iPhone</a>. It may be remembered that CEO Steve Jobs has publicly criticized Flash for being too slow.

The project is dedicated to driving rich Internet experiences across televisions, personal computers, mobile devices, and consumer electronics. Also supporting the Open Screen Project are leading content providers, including BBC, MTV Networks, and NBC Universal, who want to reliably deliver rich Web and video experiences live and on-demand across a variety of devices.

> The Open Screen Project will enable a consistent runtime environment that will remove barriers for developers and designers as they publish content and applications across desktops and devices, including phones, mobile Internet devices, and set top boxes. The Open Screen Project will address potential technology fragmentation by enabling the runtime technology to be updated seamlessly over the air on mobile devices. The consistent runtime environment is intended to provide optimal performance across a variety of operating systems and devices, and ultimately provide the best experience to consumers.

Adobe's work towards accelerating the deployment of content and Rich Internet Applications (RIA) includes;

- Removing restrictions on use of the SWF and FLV/F4V specifications
- Publishing the device porting layer APIs for Adobe Flash Player
- Publishing the Adobe Flash Cast protocol and the AMF protocol for robust data services
- Removing licensing fees -- making next major releases of Adobe Flash Player and Adobe AIR for devices free

So, we see that the next version of the Flash Player and the AIR runtime will have two separate parts. The layer that is platform specific will be separate from the layer that is the real brains of the Flash system. This means that it will be easy to embed the Flash player any new non-PC device. All you will have to do is port the platform specific layer to your device. And Adobe will be providing a reference implementation so that you can see exactly how to do it, just making minor changes related to the specifics of your platform.

The Silicon Alley Insider went ahead to <a href="http://www.alleyinsider.com/2008/5/adobe_finally_takes_on_apple_google_in_mobile">speculate</a> that Adobe is finally ready to start competing with Google and Apple for mobile platform developers.

What does this mean for the Flash Platform Developers and Designers?

I think Aral put it on a <a href="http://aralbalkan.com/1332">much better way</a>.

> It means Flash _everywhere_. It means you picked the right platform to develop your skills on. It means Flash will be around for a long, long time!

References;

- <a href="http://www.adobe.com/devnet/swf/">SWF</a> Specifications
- <a href="http://www.adobe.com/devnet/flv/">FLV</a> Specifications
- <a href="http://opensource.adobe.com/wiki/display/blazeds/Developer+Documentation">AMF</a> Specifications
- Open Screen Project <a href="http://www.adobe.com/openscreenproject/faq/">FAQ</a>