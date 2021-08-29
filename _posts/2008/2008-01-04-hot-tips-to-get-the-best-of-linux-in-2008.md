# Hot tips to get the best of Linux in 2008

At the onset of this new year - 2008 - I would like to share some Linux tips with you. It won't matter which version are you using because I'll talk mostly about the Linux Console. Most common windows user will probably feel the console in Linux to be a little intimidating, nevertheless when the time comes, you'll notice that it is the best way to be highly productive.

Read, practice the following instructions to get yourself comfortable with Linux;

Avoid out of the session or close the terminal with the command Ctrl+D

- set -o ignoreeof Enable Ctrl+D
- set +o ignoreeof Disable Ctrl+D

The Alias -- We introduce a command with an alias, and the shell will recode it with its value. For example, whether we define an alias this way: alias buscar="find. -name", when we input commands in the line buscar name_file the shell will execute find. -name name_file and will seek the file we ask starting in the current path.

`Alias name_of_the_alias="command_which_will_execute_the_alias".`

To disable an alias use the command unalias:  unalias name_of_de_alias. If you want to see the alias defined in the system just write: alias. 

Most recently used commands -- Execute the following instruction in the console: 

`history|awk '{print $2}'|awk 'BEGIN {FS="|"} {print $1}'|sort|uniq -c|sort -rn|head -10`

The history command shows a list of all recently executed commands. You can use the arrow keys to navigate the next and previous commands.

Kill all the process in a determined application -- This command will be very useful when you are running programs which tend to drag on the system resources. Open terminal and type: ps aux c. It will show you a complete list of running processes.  The first column contain the user owner of the process, the second one is the PID of the process and if we jump to the last column we will see the name of the application which belong to each processes. If the application you want to kill is, for example, Firefox, then it would be: `ps aux c | grep firefox` and then write `kill -9`. The next time you do a `ps aux c | grep firefox`, this program shouldn't appear anymore.

Get the basic system information -- There are some commands you can use to determine basic information of your machine such as kernel version, hardware information and others. The following command lines shows what they'll return when executed;

```shell
$ cat /proc/version  = "It returns a full string of information"
$ uname -m = "The result of the machine's number"
$ uname -r = "Show the version of the kernel"
$ uname -n = "Returns the local domain name"
$ uname -s = "Will show the system name"
$ uname -p = "It tells you the type and name of the processor"
$ uname -a = "Will show all the information above and also the date and time of the system"
```

Use the Calendar -- With the following commands you can have different views and displays of the Calendar in the different versions of Linux. 

```shell
cal -3 = "Simply display the calendar"
cal 1 2008 = "This command display a calendar of a particular month of the year"
date -d fri = "Display the date of the next on the current or next week"
date --date='25 Dec' +%A = "Tell you which day will be Christmas this year"
```

Disk Space -- Having sufficient and optimized disc space is something vital for good performance of your system. In the case of Linux, here are the different ways to optimize your storage space and display information of your hard disc. 

```shell
df -h = "This command display the free disc space"
fdisk -l = "Very similar to Windows environment show you the partitions of the disc"
ls -lSr = "Display the all the files and the biggest last"
du -s * | sort -k1,1rn | head = "Show top disc users in the current directory"
```

Set Operations -- In Linux you can make operations with files quickly. Test the following commands which help you a lot to manipulate files. 

```shell
LANG=C sort file1 file2 | uniq" = "Make the union of unsorted files"
LANG=C sort file1 file2 | uniq -d = "Intercept unsorted files"
LANG=C comm file1 file2 | sed 's/^\t*//' = "Union of sorted files"
LANG=C comm -3 file1 file2 | sed 's/^\t*// = "Symmetric difference of sorted files"
```

Text Manipulation -- Manipulation of text is another very important aspect of the work. Let's see some of this in Linux. 

```shell
sed -n 's/.*<title>\(.*\)<\/title>.*/\1/ip;T;q' = "Extract title from an HTML page"
sed -n '10,20p;20q' = "Print lines from 10 to 20"
sed ':a; /\\$/N; s/\\\n//; ta' = "Concatenate lines between \"
sed 's/[ \t]*$//' = "Remove trailing spaces from lines"
sed 's/string1/string2/g' = "Replace string1 with string2"</title>
```

Searching of Files -- Faster method to search for almost anything under a Linux platform.

```shell
alias l='ls -l --color=auto'page" = "Make a quick  listing of directories"
ls -lrt = "List files by date"
find -name '*.[ch]' | xargs grep -E 'expr' "Search 'expr' in the current directory and below"
find -type f ! -perm -444 = "Find files not readable by all"
locate -r 'file[^/]*\.txt' = "Search cached index for names"
```

Frozen Windows -- Sometimes you can have a frozen window, and there are two fast ways to solve this problem without turning off your computer or restarting it. First, you can try the traditional key combination of Ctrl + Alt + Backspace.

The other way is a little more complicated than the previous one but is more efficient. Hit Ctrl + Alt + F2 to jump to the virtual console. Then log in with your user name, password and type the following: 

`ps -ax | grep startx`

This executed command will provide you the PID of your Xserver. Then kill it with the next command

`kill -9 PID_Number`

If you want return to your first console, just press Alt + F1. 

Remote Execution -- With the service "rexec" you can have remote execution, very useful when you are working on a network environment. The user using this service must authenticate with a user name and password.
