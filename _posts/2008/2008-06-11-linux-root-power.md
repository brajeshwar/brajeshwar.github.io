# The power of 'root' in Linux

<img class="small right" src="/static/2008/linux-root-power.png" alt="The power of root in Linux" loading="lazy">

After our previous recitation -- <a href="/2008/filesystem-file-organization-in-linux/">Filesystem and File Organization in Linux</a> -- we hope the picture of the complete Linux file system would be resident in your minds. We are now equipped enough to try our hands on the beautiful operating system - Linux. But before we take you to the next stage, a very old saying boggled my mind - `look before you leap`!

Let us go a little deep about the access privileges and rights which a root user has on a Linux system. Root is the default name for system administrator in a *NIX system - a super user who can do anything and everything within the operating system. As a result, root login should be used with special care. While working with a root login, we can end up doing a lot of harm to our system as well as the data, accidentally.

Need for the root account

Root login is required to perform actions which change the settings for all system-wide users or to modify the users' accounts. We shall also have to use the root account for certain system operations.

Like,

* To add new users to the system and administer the user data.<br />
* To install system-wide software.<br />
* To configure I/O devices like - a scanner or a TV tuner card, for example.<br />
* To configure system services like - a web or FTP server.

Is root really dangerous ? Why?

Yes, the main reason being security. One of the important rules of Linux operating system states that `root` account shall be used only in case when we are unable to perform an operation as a normal user. If you are logged in as a `root`, your system is much more vulnerable to the external attacks. For example, your favorite web browser may probably have a security loophole and if you happen to use it from the `root` account, you expose the whole operating system the world! If you work on the same web browser using an unprivileged account, it could only affect your personal configuration and data (if it is unencrypted). Here lies the difference.

How to use the root account safely and efficiently?

Ideally, one should avoid logging on to the root account via the GUI. Working continuously as `root` isn't recommended for the reasons cited above. It is advisable to switch to the super user using the `sudo` command before another command (That's with reference to Ubuntu Linux. This may vary from distro to distro.) This gives a temporary `root` access to the current user to run a single command, without having the need to actually log on as `root`. Using `sudo` command is said to be a little more secure than logging directly as root. Several distros enable `sudo` for the first user by default and disabling the direct `root` login via the GUI. <a href="http://polishlinux.org/linux/ubuntu/">Ubuntu</a> is a prime example of this very approach.

This was all about the super user access privileges which we needed to know before we start to install applications and try them on our Linux installation. In our next article, we shall emphasize on how easy, fast and interesting it is to install a software application on a Linux distro. We'll dig into all the possible ways of installing a software on Linux - the command line way to the modern GUI way!