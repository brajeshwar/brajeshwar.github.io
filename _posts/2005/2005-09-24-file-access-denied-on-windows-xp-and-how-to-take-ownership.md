# File Access Denied on Windows XP and how to take ownership

In a recent hard disk crash, I had to do a restore from my back-up. Some of the files on a back-up drive was somehow avoiding me with an "Access Denied" even though I was logged in as the Administrator. I looked around and finally got the solution on how to take ownership of a file or folder in Windows.

# Here are the simplified steps.

1. Log on to the computer with an account that has administrative credentials. If you are running Microsoft Windows XP Home Edition, you must start the computer in safe mode, and then log on with an account that has Administrative rights to have access to the `Security` tab.
1. If you are using Windows XP Professional, you must disable Simple File Sharing.
1. Right-click the folder/file that you want to take ownership of, and then click `Properties`.
1. Click the `Security` tab, and then click <kbd>OK</kbd> on the Security message (if one appears).
1. Click `Advanced`, and then click the `Owner` tab.
1. In the `Name` list, click your user name, or click `Administrator` if you are logged in as Administrator, or click the `Administrators` group. If you want to take ownership of the contents of that folder, select the `Replace owner on subcontainers and object` check box.
1. Click <kbd>OK</kbd>, and then click <kbd>Yes</kbd> when you receive the following message:
You do not have permission to read the contents of directory `folderName`. Do you want to replace the directory permissions with permissions granting you Full Control?
All permissions will be replaced if you press Yes.
1. Click <kbd>OK</kbd>, and then reapply the permissions and security settings that you want for the folder and its contents.

That’s it.