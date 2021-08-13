---
layout: post
title: Screen Sharing in Flash Media Server 2 Public Beta
---

Macromedia's "Flash Media Server 2 (Flash Media Server 2)":http://www.macromedia.com/software/flashmediaserver/public_beta/ goes public but restricted to USA, Europe and Japan. Well, looks like it is already time for a vacation to the United States!

*Good News*: I overheard that there is the Screenshare.dll somewhere in the modules/codecs folder. (In that case, why not try looking for the G711 Codec too.)
*Bad News*: I am 99% positive, Screen Sharing Code will go away in the final release. ;-)

__Note:__ The G711 Codec block is a logarithmic scalar quantizer designed for narrowband speech. Narrowband speech is defined as a voice signal with an analog bandwidth of 4 kHz and a Nyquist sampling frequency of 8 kHz. The block quantizes a narrowband speech input signal so that it can be transmitted using only 8-bits. The G711 Codec block has three modes of operation: encoding, decoding, and conversion.

Well, it might help doing something where Flash Player can take in phone calls and vice versa!
