---
layout: post
title: Web video gone wild
---

Recently, Adobe <a href="/2007/flash-player-supports-h264-the-standard-deployed-in-blu-ray-and-hd-dvd/">announced</a> the availability of the beta version of their latest Flash Player. With it came the good news about the future of high quality video on the Internet - support for H.264 video, ACC Audio, etc. Of course, the superior quality that <a href="http://en.wikipedia.org/wiki/H.264">H.264</a> will bring is definitely going to be a key factor in the future. However, what tagged along with the good news were some caveats and strings that will make you to think and ponder upon what it will cost you.

Reading through the blog of an Adobe Flash Player Engineer, <a href="http://www.kaourantin.net/" title="Tinic Uro">Tinic Uro</a>, it appears that Adobe intends to lock down streaming H.264 into the Flash Player from NON-FMS Servers. Well, with that move, the ones on Adobe's line of fire are the likes of - <a href="http://osflash.org/red5">Red5</a>, haXe Video, <a href="http://www.wowzamedia.com/">Wowza Media Systems</a> and all other efforts (open source or otherwise) to stream Video on the Web through the Flash Player.

Why Streaming? I can just do Progressive Download!

Very true! Even <a href="http://www.youtube.com/" title="YouTube">YouTube</a> does Progressive Download, no Streaming. They use a high end <a href="http://en.wikipedia.org/wiki/Content_Delivery_Network" title="Content Delivery Network">Content Delivery Network</a> (CDN) - <a href="http://www.bitgravity.com/" title="BitGravity">BitGravity</a> - to serve media (video in this case). This means that a lot can be achieved with "Progressive Download". <a href="http://www.youtube.com/" title="YouTube">YouTube</a> even allow you to "forward seek" the videos which were the key feature of streaming servers. This pretty much seem to position "progressive download" at par with "streaming".

So, if it is just content delivery, perhaps "progressive download" is as good as "streaming". You can always continue to "progressive download" video unless "streaming" serves a special purpose and requirement for you.

However, don't get so carried away! There are lots what <a href="http://www.adobe.com/products/flashmediaserver/">Flash Media Server</a>, specially the upcoming version 3, has to offer. You might just want to read on for the good part of "streaming".

Before that, it's the weekend (Sunday at my place), so let's enjoy a bit of off-topic but related video about what would happen if there were no <a href="http://www.adobe.com/go/flashplayer/">Flash Player</a> - <a href="http://www.youtube.com/watch?v=bjgXnMVMimg">iPhone Parody No Flash</a> from YouTube.

Adobe's Streaming Flash Media Server

With the exploding growth of Video on the Web, audiences are expecting high-quality experiences. Adobe's vice president Jim Guerard recently talked about Adobe's forthcoming Flash Media Server (FMS) 3 which will allow publishers to integrate video into their sites and applications with more control over playback, interactivity and branding. FMS 3 is scheduled for release in the first quarter of 2008.

One of the key noticeable feature of FMS 3 will be its ability to provide live or recorded streaming to Flash Lite 3 powered Mobile Phones. Flash Lite 3-enabled phones are expected to be on the market by the end of 2007.


FMS 3 will support the new file format which Flash Player 9 can load and play - .mp4,.m4v,.m4a,.mov and .3gp. Simply drop video files you might have encoded using one of the countless tools out there onto the server and it'll stream. Even if the moov atom (index information in MPEG-4 files) is at the end of the file which a "progressive download" cannot do. A "progressive download" have to wait until the file is completely downloaded before it is played back. However, you can use tools like qt-faststart.c from Mike Melanson to fix your files so that the index is at the beginning of the file.

Adobe is in talk with <a href="http://www.cisco.com/" title="Cisco">Cisco</a> to integrate Flash Media Server 3 into Cisco's Content Delivery System. Well, looks like the battle between <a href="/2007/microsoft-silverlight-10/" title="Microsoft Silverlight">Microsoft Silverlight</a> and Adobe Flash Player is going to be fought on our Television sets too, besides the already hot battle scenes on the desktops and mobile devices.

I have not extended the article with the technical details of the new Flash Player 9 as Tinic have done an extremely well-written lengthy article - <a href="http://www.kaourantin.net/2007/08/what-just-happened-to-video-on-web_20.html">What just happened to video on the web?</a> His article is worth a thorough read.