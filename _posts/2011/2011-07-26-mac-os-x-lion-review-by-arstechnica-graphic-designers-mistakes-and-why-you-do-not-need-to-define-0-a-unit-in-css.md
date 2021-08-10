---
layout: post
title: Mac OS X Lion review by Arstechnica, Graphic Designer's mistakes and Why you do not need to define "0" a unit in CSS
---

## Mac OS X Lion

Arstechnica did a brilliant, detailed and exhaustive review of Apple's new <a href="http://www.apple.com/macosx/">Mac OS X</a> Lion -- <a href="http://arstechnica.com/apple/reviews/2011/07/mac-os-x-10-7.ars/">Mac OS X 10.7 Lion: the Ars Technica review</a>. Definitely worth a thorough reading.

From the article, here's a tip on how to burn a bootable Lion Installation.

- Download Mac OS X Lion from the App Store.
- Before you go ahead and Install, once you have the installer application, do a "Show Package Contents" on the Installer.
- You should find a 3.74GB disk image (InstallESD.dmg, stored in the Contents/SharedSupport folder).
- Use that disk image to burn a Lion installation DVD or create an emergency external boot disk.

## 10 Mistakes a Graphic Designer Shouldn't be Making

<a href="http://www.graphicdesignblog.org/">Charlie Johnson</a> shared a nice article on <a href="http://www.designtaxi.com/article/101675/10-Mistakes-a-Graphic-Designer-Shouldn-t-be-Making/">10 Mistakes a Graphic Designer Shouldn't be Making</a> at <a href="http://www.designtaxi.com/">DesignTaxi</a>.

The Mistakes to avoid;

1. Working without a design brief.
1. Ignoring the target audience.
1. Not maintaining a contract.
1. Avoiding contact with the client.
1. Procrastinating.
1. Not staying up-to-date.
1. Not starting in black and white.
1. Pass off plagiarism as inspiration.
1. Neglecting the power of simplicity.
1. Lose confidence.

## You do not need to define "0" a unit in CSS

I see quite a lot of CSS where the "0" is suffixed with a unit like "px", "em". Well, "0" do not have a unit and do not need one. The unit identifier can be omitted if the value is a <a href="http://www.w3.org/TR/CSS21/syndata.html#length-units">length</a> (<a href="http://dev.w3.org/csswg/css3-values/#ltlengthgt">CSS3 Editor Draft</a>). After a zero length, the unit identifier is optional. However, the exception is if '0' is an "angle", the unit identifier is required. You'll have to say "0deg".

Thanks to a <a href="http://l-c-n.com/">Philippe Wittenbergh</a>, an awesome CSS guy (When I'm stuck, he's my CSS go-to person) for clarification on this one at the <a href="http://www.css-discuss.org/">CSS-Discuss list</a>.
