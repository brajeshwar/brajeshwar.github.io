# Adobe Flash can modify Router's UPnP Interface

Security firms and Interested Institutes keeps stumbling on security issues and vulnerabilities almost every waking hour of the day. Very recently, Google Researchers documented serious <a href="/2007/google-researchers-found-vulnerabilities-in-flash/">vulnerabilities in Adobe Flash SWFs</a>. Another Flash related security issues surfaced about a weeks ago that the Universal Plug and Play (UPnP) interface of <a href="http://www.gnucitizen.org/blog/hacking-the-interwebs">your Router may be highly vulnerable</a> to use by hackers seeking to modify their settings -- such as choice of DNS Server -- from an external location using Flash.

## How?

With Adobe Flash, attackers may corrupt the UPnP interface in the router and modify router settings by leveraging simple object access protocol messages (SOAP) to circumvent password protection or even the WPA (Wi-Fi Protected Access) encryption standard on routers.

Attacks generated by exploiting the UpnP interface may be <a href="http://www.gnucitizen.org/blog/hacking-the-interwebs">a hundred times more dangerous</a> than a recent attack in the wild using Flash and built on JavaScript host-scanning techniques. Nonetheless, researchers said they do not expect to see widespread exploit. It may be noted that in many cases, UPnP is remotely exploitable without interaction required from the victim, and all the attackers need to know is the IP address of the exploitable device.

The generation of SOAP messages using the Flash plug-in enables the attacker to avoid the problem of password authentication, and the fact that many home routers are configured to accept SOAP messages without any type of authentication compounds the threat, <a href="http://www.scmagazineus.com/Adobe-Flash-plug-and-play-interface-can-be-used-to-modify-router-settings/article/104421/">researchers said</a>.

## Adobe's suggestion to the issue

The suggested work-around from Adobe is that malicious router commands delivered via SOAP requests can be circumvented by disabling this functionality in the router. Turning off your UPnP will make life harder and probably your Skype or MSN wont work as flawlessly as before.

You can <a href="http://www.gnucitizen.org/blog/hacking-the-interwebs">download</a> a Harmless/Useless Proof of Concept code from GNU Citizen, for demonstration and eduction purposes.
