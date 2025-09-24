# Backup: Time Machine is Convenience; Cloned Copy is the Crown

Twenty years ago, I learned a lesson the hard way. I will never forget that event for the entirety of my life, especially when it comes to the importance of having backups, have [backups of everything](/2021/backup/), so you have the flexibility to [walk away](/2025/can-i-walk-out/).

On that fateful day, as I returned to Bombay from Bangalore, I realized that the Hard Disk of my IBM ThinkPad R51 had crashed! No warnings. No chance. Everything gone. It was a brutal reset. I did, however, [have backups of my work](/2005/thou-shall-back-up-everyday/), which saved me.

That moment was when I realized the importance of having good backups. I built routines around them. I read, experimented, and refined my approach. Over time, those routines hardened into habits and philosophies to [backup, backup, and backup](/2021/backup/).

Still, theory and habit only help so much when disaster strikes again.

## The Crash of 2025

A few days ago, my long-serving iMac (5+ years old) gave its final gasp. Its internal disk died. Unrecoverable. I saw it coming, but I was hoping it would drag on for at least another year.

Thankfully, it wasn’t the first time I’d trodden this path. I had a Time Machine backup in place. Over the years, Time Machine had collected hourly, daily, and weekly snapshots. It kept file histories, old drafts, and settings. It was a safety net.

Well, the limits of a Time Machine backup are that it provides versioned files, but not always a live, bootable system when the host machine itself fails. You still have to rebuild or restore to a new machine. It’s not always seamless.

## The Homework Resurrection: A Small Miracle

I do have a story about the time macOS’s [Time Machine](https://en.wikipedia.org/wiki/Time_Machine_(macOS)) proved its worth. About a year ago, my daughter lost some of her school homework that she had been working on her computer. She asked me if I could do something about it, so I fired up Time Machine and went back in time to retrieve her homework. That definitely confirmed what she had in my mind about me—a standard nerd who can make computers do magic. All I did was stick a simple external Hard Drive to her Mac and set it as a Time Machine Backup. That little rescue is precisely what versioned backups do well: recover deleted files, restore earlier drafts, or pick specific versions.

## Cloned Copy takes the Crown

Anyway, nothing, however, can beat a bootable cloned drive. If your system drive fails, you can swap in the clone (or boot from it) and continue as if nothing catastrophic happened. I use [Carbon Copy Cloner](https://bombich.com), but there are other alternatives, such as [SuperDuper](https://www.shirt-pocket.com/SuperDuper/).

And yes, I also have Cloud Backups, but they are just the files and data related to work, family, and personal use.

I’m now of the opinion that if one can invest and afford a second working computer, one can just swap it when things go south. That way, treat tools as tools to get things done and not get attached to them.

My friend Kathan Shah of [Spurge](https://spurge.rentals) helped by sourcing a MacBook within a few hours, and I was back in business. Settings, apps, files—everything almost as it was. If you’re in India and needs help with refurbished computers, phones, and devices, I highly recommend their team. They are super helpful to Startups and SMBs alike.

## Both Strategies Matter

From my experiences, here’s what works (and must work) in a backup strategy:

| Strategy | Strength | Limitation |
|---|---|---|
| Time Machine (or versioned backups) | Recovers deleted files, earlier versions, individual files | Doesn’t always give you an instant bootable system; restore can be slow |
| Bootable Cloned Drive | You can swap/boot instantly after disk failure | Must be refreshed regularly; takes full-disk space |
| Offsite / Redundant Copies | Protects against theft, fire, catastrophic simultaneous failure | More cost, more management overhead |

Apple’s Time Machine is designed to maintain snapshots over time (hourly, daily, weekly). With macOS Big Sur and later, Time Machine uses APFS snapshots for greater speed and reliability.

However, many backup experts caution that Time Machine volumes and structures are delicate. Copying or cloning a Time Machine backup volume is often unreliable or unsupported due to how it maintains links and snapshots. Some users advocate starting a fresh backup on a new drive rather than migrating the old one.  

Meanwhile, cloning software (Carbon Copy Cloner, in my case) remains a staple for bootable backups; however, on newer Apple Silicon Macs, the rules for booting from clones have become stricter. Disk cloning, in general, is the process of copying an entire disk (including the filesystem, metadata, and slack space) so that the copy is bootable and identical.

## Be Prepared

- Backups are **NOT** optional. 
- Use both versioned backups (Time Machine) and full clones. They serve different disaster modes.  
- Test your backups. Periodically boot from clones. Restore files from Time Machine to ensure they work.  
- Keep redundant and offsite copies. The worst failure is when your backup fails as well.  
- When your family thinks you’re a “computer wizard” for rescuing lost homework—that’s the real reward.
