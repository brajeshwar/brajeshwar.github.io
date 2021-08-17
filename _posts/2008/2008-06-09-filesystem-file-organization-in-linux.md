---
layout: post
title: Filesystem & file organization in Linux
---

Let's hope that our earlier article -- <a href="/2008/choice-of-linux-distros/">Which Linux distro is right for you?</a> -- helped you decide a distro suitable for you. With the assembly of a complete Linux machine, it's time now to look into the architectural design of the operating system and look how robust Linux is with an efficient file management system it has. We shall now dive in to understand the file system and the file hierarchy of a Linux system.

A common description of the UNIX system, which also holds good for a Linux operating system says, "On a UNIX system, everything is a file; if something is not a file, it is a process."

This statement holds good because there are special kind of files that are more than - just files, say - pipes and sockets, for that matter. But, saying that everything is a file is an acceptable generalization, just for simplicity. A Linux system, just like any *NIX based system doesn't differentiate between a file and a directory, since a directory is just another file which contains names of other files. Applications, programs, documents, services, images and just about everything else on a Linux operating system is a file! Even the input and output devices are considered as files, according to the Linux system.

In order to manage all these files in an organized and orderly fashion, we think of them in a tree-like structure on the hard disk. We shall now continue to use this image of the directory while we shall peep into the roles of each leaf of the tree. The picture below says it all.

The file system where a Linux distro is probably installed is either ext2 or ext3 and is referred to as data partition. The other important partition is known as the swap partition which works as an extended physical memory. It is generally advisable for the swap partition to be 1.5 times the amount of physical memory installed on the system.

That was a picture of the file organization in a Linux operating system. Linux also has a remarkable support for a large number of file systems - ext, ext2, minix, umsdos, msdos, vfat, proc, xia, smb, ncp, sysv, iso9660, hpfs, affs, ufs, etc. The file system, as we saw, is represented hierarchically with '/' (root) being the top most level. Each new file system is added into a single file system tree as and when it is mounted.

All the file systems are mounted onto a directory and the files of the mounted file system form the existing contents of that directory. This directory is called the mount directory or mount point. When the file system is unmounted, the mount directory's own files are once again revealed. This great feature of Linux systems to enable on-the-fly mounting and un-mounting of various file systems without the need of fetching different drivers, makes them stand apart. This also gives the users and developers freedom to choose from a variety of file systems to handle their files.

The kind of organization Linux has for the files is a good reason in making Linux systems more secure. The estimate of how strong this architecture is can be made by the fact that there has hardly been any noticeable change in this design over the past decade. So, this means we're running a system which has deep underlying roots!
