---
layout: post
title: Shoot a terminal and install a ball
---

![Music on Tux)](/static/2008/linux-music.jpg)

In our last article -- <a href="/2008/software-installation-on-linux/">Software installation woes on Linux</a> -- we proved that installing a software package was as easy as it was rumored otherwise. We saw two pretty common and of course easy ways of software installation.

As promised, we shall now put our eyes down for the third and by far the most scaring way. Trust me, it is not at all as geeky as you have always figured it out to be. Following some easy steps by understanding what is each one of them doing shall help us master this art in sometime. Once you've learned, this would be a cakewalk just like the other two, previously described ways.

Before we move on, we should know the forms in which a source code package is available. Generally, a source code comes as a bundle which is a compressed file having an extension -- `.tar, .tar.gz, .tgz, .tar.bz` etc. They are often known as tar balls! Something similar to the zip or rar files you would have possibly come across on a MS Windows installation. But there is a difference in their composition, which we shall not bother to understand for now.

The source package often contains un-compiled source code. But trust me, you need not be a programmer to know how to proceed with compilation and installation of a package with the source code. Decades ago, with *nix systems, this was the sole way to install a software or a tool. Even today, this is one of the standard ways of installing packages on a Linux machine. Remember, this may not work in every case, but it will in most, provided you have the right dependencies installed.

Let's proceed to get things done or what we better term as GTD today! Before moving on, you must have the compiler tools installed. They all come with the package - build-essential. Install it using Synaptic for now. When you're sure you have the compiler tools installed, locate the software source on the the website (Quite normally, a software built for Linux has its source code available on it's own website in one of the compressed file formats.) and download it on your system. There after you need to extract it somewhere.

* It is advisable to to move it to the directory `/usr/local/src` (if the directory is not present, your may create one by using `mkdir /usr/local/src` or by a right click of your mouse!).
* Now again, there are two ways of extracting the contents of the file.
** One, simply right-click on the package and select Extract Here.
** Secondly, shoot a terminal and navigate to `/usr/local/src/` using the `cd /usr/local/src/` command. For the files ending in `.tar.gz`, use `tar -zxvf <filename>` to get the content. Similarly, the files ending in `.tar.bz2` can be decompressed using `tar -jxvf <filename>`.
* You would see a new directory in your present working directory. Use the command `ls` to see this directory name. Use the `cd <directory-name>` to navigate to this newly extracted directory. Remember, all this could have been done just with a few clicks of your mighty mouse! But here, we are trying to explain how things get done on a terminal. Believe me, it looks so fascinating while it's been done on a terminal!
* Moving on to the final stages, there are 3 prime tasks we do on a terminal while installation:
** Configuring the installation
** Compiling the software
** Installing the binaries

Configuring the installation

The pre-installation configuration is done by executing a `./configure` while you are in the correct directory. The aim of the configure script is to check for the dependencies and then create a `makefile`. In case, the script fails for some reason and tells you to install certain packages (which may happen quite often than not!), try to locate those names in Synaptic and install them (even if the name comes with an added `-dev` extension, install it as well. They are the development packages needed for compiling). There may be prompts like - there is no configure script. Do not worry, several packages do not come with one.

Compiling the software

Compilation is a process of turning the source code into an executable binary. When we type and run `make`. It reads the instructions in the `Makefile` and builds the application binaries.

Installing the binaries

Wait, we're almost there. To install, just type `sudo make install` and voila! It's all done. To remove the temporary files you can run `make clean`. To uninstall the program you run `sudo make uninstall` after navigating to the same directory whenever needed. Remember, the `make clean` and `make uninstall` commands shall only work if the programmer would have enabled them to.

You may now try your hands on a couple of tar balls to have an expertize. More from me, very soon. Stay connected!