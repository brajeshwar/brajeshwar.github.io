---
layout: post
title: The 'end task' procedure for Linux
---

In our previous article -- <a href="/2008/linux-vocabulary/">Sharpen your Linux vocabulary</a> -- we visualized few commonly used terms in context with the Linux  operating system and its surroundings! I thank and appreciate the readers for  adding on a few more words.

While I was figuring out a way to run Internet using a CDMA wireless modem on  my Linux machine, one of the applications refused to respond due to some rare  error. This very incident reminded me to come up with following article which  elaborates few methods to help you terminate a process or application running on  a Linux distribution - something similar to 'end task' on a windows operating  system.

Remember, there is no <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Del</kbd> key combination on Linux - by default!

Let us now see some of the interesting ways to kill those stuck and stubborn  processes. A very mundane and primitive way is to use the command `ps  aux`, look through the process list until you find the PID (process ID) you want and issue the kill command.

Alternatively, a better way is to use the 'killall' command which would automatically kill a program based on its name.

`# killall mozilla-bin`

There may be times when you shall only know a part of the name. In such a  scenario, you can combine ps with grep, kill and awk to produce something like this.

`# ps aux | grep mozilla | awk '{print $2}' | xargs kill`

Now if that was tedious, there are still simpler ways. Enter pkill and the  closely related pgrep. All these commands are part of the sys-apps/procps  package and are specifically designed to search for or kill running processes. The previous command could be replaced with the following:

`# pkill mozilla`

If you just need to list the PID's instead of killing them, you may just use  pgrep.

Lastly, if you have a runaway process hogging /dev/dsp, or some other file or  socket, you can use fuser, which displays the PID's of process using a specified file or filesystem. You can give it the -k option and can easily kill those processes:

`# fuser -k /dev/dsp`

Now with the power of these commands, you shall never have the problem of  'killing' or stopping a process which you are unable to do otherwise.

Remember a fact that Linux has a lot of features which may not be evident by  default or on the first look. But the depth it has considering the underlying  architecture and a strong command line integration is simply superb. I would  advise you to look out for a few HOW-TO's, hang around in the IRC's and  participate in the discussions at various Linux forums - either as an audience  or a contributor.

More than an operating system Linux is a large community and strong  relationship between its members. A relationship of sharing knowledge and  reusing it, unlike reinventing the wheel!
