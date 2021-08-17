---
layout: post
title: 5 best-practices of a successful Linux user
---

Were you a born Linux user? I mean did you dirty your hands with Linux before you happened to stumble on any other Operating System? I doubt! I am no exception. Most of us have migrated to -- part time or full time -- a tux box. There would have been one or more reasons which would have tempted each one of us to try this operating system and some of us, never looked back. Few would have probably turned out to be Linux professionals, while others would still be struggling with what's good and what's perfect.

Today, we shall have our eyes on a few practices which are all time favorites of efficient Linux users:

1. Do not login as `root`: Yes, you got it right. This is by far the best Linux practice one should build up from the very beginning. The fact that most of us would have had a lot of years spent on a Windows machine makes us biased on having an Administrator account. More than 70% of the people whom I have met log on to their Windows machine with an administrator account. Linux is different. The power a root user has is enormous it can do wonders and can tempt you do a blunder too. Thanks to the lit fuse bombs on the root-login wallpaper for making it pretty obvious!
1. Keep `/home` on a different partition:  There are times which you would want to switch distros, or may be un-install one for ever to get a new one. Having /home on the same drive as / would mean you losing everything on the /home directory after a format. Linux however gives you a better choice. Create a new partition and place your `/home` on it. This enables you to reinstall/change your Linux distro without losing your data and personal settings. Just in case you wish to do this with an already installed Linux distro, you may wait for the next post to help you move your `/home` to a new partition altogether! Alternately, the Internet already has an answer to it. Thankfully!
1. File naming conventions: Ok, there is no set convention for naming a file in most of the operating systems. But, there is no harm following one. Of course Linux allows you to name files anything but a "/" (forward slash) or " " (null character). Try to follow a regime, which may include:
- Only alphanumeric characters, periods, underscores and hyphens.
- Avoid using spaces in filenames, this makes your job easy on terminals. Use hyphens or underscores instead.
- Avoid using special symbols like "%", "$", etc. They have special meanings on a shell prompt.
1. Do not run away from CLI: You've not got hold of quite a few ways to fix things on your Linux machine. You may be happy using the GUI window to install new apps. This may be `synaptic`, `yum`, `yast` or whatever. But having a good hand at the terminal is never a waste. If you can accomplish some basic tasks on the terminal, I am sure you'll be far more confident and proud than you were without this ability. Hacking into or tweaking you machine is definitely fun but do not intend to just copy-paste commands from the Internet cloud. Try using the man page to know what each of the commands do, so that next time you know what you're doing before you hit the return key on the terminal.
1. Handle the system crashes effectively: Linux is not Windows. Hence, `CTRL+ALT+DEL` is not the only solution to move on with. You can try out better ways to recover your machine to a stable state without having the need to reboot your machine. Go for options like `killall`, `kill PID`, force quit, CTRL+ALT+BACKSPACE to end your X session, etc. We've discussed about killing the processes previously.

These were a few guidelines which would increase your efficiency with Linux and will make you perfect. Remember, practice does that with everyone. Stay tuned for more action!
