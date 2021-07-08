---
layout: post
title: How to delete all Photos and get off Google Photos
---

If you are on the Internet, you might have used one or more of <a href="https://about.google/intl/ALL_us/products/">Google's many products</a>. Sometimes, Google makes decisions that impact the lives of many people. Some of these decisions have a detrimental effect on people.

## Google Photos

<a href="https://photos.google.com">Google Photos</a> was a free service (with limitations) until May 31, 2021. From Jun 1, 2021, you have to subscribe to a paid plan once you hit your 15GB Google storage limit spread across <a href="https://www.gmail.com/">Gmail</a>, <a href="https://drive.google.com/">Google Drive</a>, and <a href="https://photos.google.com">Google Photos</a>.

I wanted a backup option to our family's primary Apple Photos. I also liked Google Photos's ability to have a single pool for your whole family. We had subscribed to the 2TB plan for quite a while, where we sync up the original resolution of the photos.

Recently, while trying to prune and clear up storage, I realize that Google had made it extremely difficult to do so.

## Backup / Google Takeout

Before doing anything, I strongly suggest creating a full back of your Google content. Follow the instructions at <a href="https://takeout.google.com">Google Takeout</a> and get a copy of your Backups.

## Deleting Photos

<iframe width="800" height="450" src="https://www.youtube.com/embed/a4Mfg3Rb_4Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Google Photos was the one taking up most of the storage. It wasn't an easy task to bulk-delete. You have to select photos within your viewport and delete them manually. The best case is going inside an "Album" or Categories and deleting all of them.

I found a working script for Google Chrome <a href="https://github.com/mrishab/google-photos-delete-tool">Google Photos Delete All Tool</a>, which helped deletion (working version mentioned ahead). Unfortunately, Google Photos web interface seems to update their HTML tag and CSS classes, which no longer worked. I made a tiny tweak in the Button Labels and DELETE duration between actions. Even then, it was not without flaws. It did not work all the time, and I had to tweak/resize the viewport, retry few times, and when it worked, I just let it do its magic. I have a pretty beefy computer (40GB RAM), and I still needed to pick a longer delay between delete cycles.

<img src="{{ site.baseurl }}/assets/2021/06/activity-monitor.png" alt="Activity Monitor" width="2144" height="1436" class="alignnone size-full wp-image-7262" />

I sent a <a href="https://github.com/mrishab/google-photos-delete-tool/pull/36">Pull Request</a> to the source. By the time of writing this article, the Pull Request is yet to be honored. The updated script is at <a href="https://github.com/oinam/google-photos-delete-tool">github.com/oinam/google-photos-delete-tool</a>. This works as of JUN 2021.

<img src="{{ site.baseurl }}/assets/2021/06/iMac-40GB-RAM-2019.png" alt="About iMac" width="1396" height="926" class="alignnone size-full wp-image-7267" />

## Follow the steps to delete your Google Photos.

1. Block images on photos.google.com.
2. Open Developer Tools > Console.
3. Copy and Paste the script -- <a href="https://github.com/oinam/google-photos-delete-tool/blob/master/delete_photos.js">delete_photos.js</a> (you might want to view the Raw File).
4. Hit ENTER and let it run.

It will take hours, even days, if you have lots of photos. Let it run. It took me over two weeks to clean up about 1TB of data (Gmail, Google Photos, and Google Drive). You will need to do this for every individual member of the family who is on Google One.

## Google One

<img src="{{ site.baseurl }}/assets/2021/06/google-one-storage-management-scaled.jpg" alt="Google One Storage Management" width="1858" height="2560" class="alignnone size-full wp-image-7261" />

Clean up at Google One’s Storage isn’t easy either. The hardest ones are going to be the Large Items. I had no idea where the “Large Files” were stored. So, I cannot delete it from the local synced Drive but have to hunt and peck at the <a href="https://one.google.com/storage/management">Google Storage Management</a> Dashboard. Be careful; you might be deleting important files.

<img src="{{ site.baseurl }}/assets/2021/06/google-one-support-india-rbi-e1623319298791.png" alt="Google One Support Chat" width="610" height="808" class="alignnone size-full wp-image-7265" />

For Google One Subscribers, you do get the opportunity to talk to an actual person from Google Support. From my interaction, I learned that, in India, due to the new Reserve bank of India eMandate, Google can’t automatically charge you for your subscription and change to a different plan. You’ll have to cancel your current subscription and re-subscribe with the desired Plan.

Block of Images in your Browser Settings, and try the List View instead of Thumbnails. It will make it faster for you to select and delete. Best of luck and I hope it goes well for you.

As of Jun, 2021, I have decided to stay with the <a href="https://one.google.com">Google One</a> Plan of 100GB and stay within that limit.