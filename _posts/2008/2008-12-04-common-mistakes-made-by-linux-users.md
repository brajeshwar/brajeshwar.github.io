# 10 common mistakes made by Linux users

Working on a Linux machine is a matter of proud and gravity for a lot of geeks. I could never know why! But there are a few ubiquitous mistakes which a lot of them make while administering a Linux box. If kept in mind, these mistakes can be avoided to keep a smooth work flow in a Linux environment.

Out of many, I would like to enlist a few of them;

1. Root User Log in: Always try to avoid logging in as a root user, because logging in from root gives you access to all permissions which has a couple of dilemmas. The first being a probable mistake via GUI can hamper the system extensively and the second being the running of X via a root which makes a PC more susceptible.
1. Avoiding updates: As a good administrator it is always expected on one's part to keep updating your system to make it a more secure one. This will make the system more resistant to attacks hence make it more stable.
1. Installing applications from different binary types: Installation of various files from .deb package and their dependencies from source, or vice-versa might not always work, because the dependencies are more complex in nature. So, it is advisable to install files from .deb package as many related applications become simple to upgrade from within the package management system.
1. A server boot to X: In order to make a few administrations tasks trouble-free, the server boot to X ultimately results in memory wastage and loss in CPU cycles. This also helps in restricting the access to your system and results in utmost privacy.
1. Low password strength: Passwords should always have the utmost security and their strength should be good. It is better to keep a password which is hard to memorize than keeping a password more prone to the hacking fraternity.
1. Misunderstanding the file permissions: The rwx method which stands for r=read, w=write, x=execute is used to handle permissions effectively. Proper permissions can help a system in many ways while improper permissions can lead to a system getting hacked. Therefore, an administrator must have good enough knowledge of the unique code of permissions.
1. Zero backup of critical configuration files: To avoid unnecessary problems, it is always better to have a backup of all important configuration files. Necessary backups include those of Samba, Apache, and MySQL.
1. Ignoring log files: /var/log is the default destination for all log files. Log files are used to locate all generic errors. The use of third party applications is also growing day by day and thus an application called logwatch has come into prominence which creates various reports for us to solve the discrepancies in /var/log files.
1. Neglecting the command line: It is actually a tough task to memorize all the commands and this is taken care of mostly by GUI. But at times, ignoring command lines which is faster, easier, more secure, and more reliable is a moronic decision on the user's part. A basic understanding of the working of command lines can help a user and lead to correct judgments.
1. Non-installation of a working kernel: A machine requires a kernel and its proper updating. An update of a current kernel, if it works well, is actually a better thing to do than deleting previous kernels. If an update is successful deleting previous kernels which acted as backup is advisable.

These were few of the top mistakes which a Linux administrator/user can avoid to help use the resources in a better and safer way.
