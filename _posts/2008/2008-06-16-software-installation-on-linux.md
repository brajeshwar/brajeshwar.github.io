---
layout: post
title: Software installation woes on Linux
---

![Windows Vista Everything Included)](/static/2008/vista-malice.jpg)

While we gracefully installed our <a href="/2008/choice-of-linux-distros/">favorite Linux distro</a>, one of the mundane problems which most users face is - installing a new software. In the beginning, software installation on a Linux distro can seem extremely intimidating while using a terminal but more often than not we can install things graphically. Installing software on Linux is not only easier than most of us think, but it also has some special features which help software's to be updated automatically!

Primarily, there are 3 main ways to install a software on Linux.

* Downloading a package which is a .deb/.rpm file.
* Using apt-get with a software repository.
* Lastly, by compiling the source yourself - we shall take this in an elaborated article, very soon.

Downloading a package which is a .deb/.rpm file

The first way of installing software is by using a .deb/.rpm file.  As mentioned in one of our previous articles, .deb refers to installation files associated with debian based distros and .rpm files are RedHat based package manager files.

Here and thereafter, we shall concentrate on .deb files whenever we happen to encounter both the flavors. Remember that there is not much of a difference in the way they're executed. It it is just that how these are fabricated depending on the underlying distro they are meant for - debian or RPM based.

Coming back to the first way of installing software, this method is pretty similar to installing a software on a MS windows with an executable file. Just download a .deb file for the software you want to install, double click to open it via the default package manager- synaptic in case of <a href="http://www.ubuntu.com">ubuntu</a> (debian) and type in your password  when prompted. We hope you'd have speculated which password should this be! Installing a software by this method shall automatically check for any additional dependencies you may need and will download and install them too.

One of the disappointing fact about this type of installation is not every  program created for Linux has a .deb for users to use for installation. Also, new programs generally do not have a .deb at first until they get more users and popularity. Lastly when the software is updated it will not automatically update, you will need to uninstall it then grab the new .deb package.

A great website to get  .deb packages for popular Linux programs is <a href="http://www.getdeb.net/">getdeb.net</a>.

Using apt-get with a software repository

The second way of installing programs is by using a software repository. The advantages of installation through a software repository is that when a program is updated, the update manager will let you know and you can update all such software's with click a few clicks. Most Linux distributions have several popular programs built into there own software repositories which are already set up for you to use.

Depending on your knowledge there are again two ways of installing softwares from a repository. Most modern Linux distributions have a built-in GUI way to find and install software.

For example, on Ubuntu if you navigate to System > Administration > Synaptic Package Manager. Within the package manager, a complete list of software's is available. One can select and install them with a few clicks of the mouse button. A user can even do a search for a software. Secondly, we can also use the repositories by the CLI.

Shoot a terminal and type, "sudo apt-get install > software-name >" without the quotes. The sudo command gives the computer root privileges to be able to make an installation. Apt-get command tells the computer to get software from the repositories, download and install it.

There may be several software's which may not be located in the repositories that your Linux distribution manages and comes with, as a default. In such an event, you may have to add more repositories. In Ubuntu you can add a software repository by navigating to System > Administration > Software Sources.

In the window that pops up, choose the "Third-Party Software" tab and click the "add" button. Copy and paste your repository address in the desired location. A repository address will look something like this: deb http://archive.ubuntu.com/ubuntu/ hardy main.

Out of the 2 ways, which we've discussed, the best one is to install a software by using a software repository. This method is fairly easy and keeps the software's up-to-date automatically.

Compiling the Source

The third method is one which is universally valid for all linux distros and is pretty common amongst the Linux pros and geeks. I'm sure we all would love to have a hands-on session on the same. But this is a more detailed and (may appear to be) a tedious process for the newbies. For this very reason, we'll take care of the command line source compilation method in one of our upcoming article. Stay connected!
