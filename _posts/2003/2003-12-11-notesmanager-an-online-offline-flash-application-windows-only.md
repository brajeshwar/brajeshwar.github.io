# NotesManager - an online-offline Flash Application - Windows Only

NotesManager allows you manage notes for various projects in your company while maintaining synchronization between the remote database and the local client database. It allows multiple team members to work in tandem from different locations, while maintaining a synchronized set of notes between them. The current application is done using both v1 and v2 components and targetted at Flash Player 7.0.14.0 and above, back end database is powered by MySQL and data porting to and fro by Flash Remoting (CFMX) and the wrapper is done using [Flash Studio Pro](http://www.multidmedia.com/)

The NotesManager interface consists of a collapsible menu, the left navigational menu and the right entry and comment menu. In addition to these menus, there are various pop up dialogs that are shown when the user clicks on a button or menu item. You can choose to work in 2 connection modes in NotesManager. Online and Offline mode.

*Online Mode* will always try to connect to the remote server and send the local database change to the remote server immediately. If an error occurs when trying to do this, the change will get saved locally to be performed during the next synchronization.

*Offline Mode* will save the local database change action locally, and will publish it remotely when you synchronize the next time. Offline mode is more suited when you are not connected to the internet, and when you wish to make numerous changes locally for the time being, which you will synchronize when you connect to the internet.

When you are working with NotesManager, you are typically working with 2 databases, a remote database on the server and the local database. Whenever you make any change to the local database, it has to be send to the remote database, so that other people can see the updated records. Hence you are prompted to synchronize whenever you change the local database, by add/editing or deleting any record. 

However you do not need to synchronize the database every time to make a change. Say you wish to add 5 new entries for a project. You can use offline mode from the file menu, add the entries, choosing not to synchronize the database every time. And after you are done with the changes, clicking Synchronize Now only once. The program will publish all the changes you made to the local database to the remote server during synchronization for you. This saving of local changes is done for all forms of changes that can happen to the local database, ie:- add entry, delete comment, add login, edit entry, etc. Also if any change fails during the local to remote synchronization, due to a bad internet connection for instance, the change will automatically be queued, so you only have to try again when the internet connection is working, the change will succeed eventually. There is an option to compact your local database from the Preference section.

And here is a bit of how the fscommands work in FSP, you may realize that it is not the actual way how it works according to MDM, the creator of FSP.

Firstly "object.watch" was used instead of the "setInterval". So you only wait as long as the fscommand takes to execute and no more. Now although MDM says that FSP will only work for variables in _level0. It has been found that isn't completely accurate. The shell when setting the output variable does something on the lines of eval("variable"), where variable is the output variable name passed. With a little bit of testing it was found that if a fully resolvable variable paths was used, it works fine as well. Just so long as there is declare/initialize the variable before calling the fscommand.

So, the following, is valid in FSP.

```
var o = {};
o.myVar = "";
fscommand ("flashstudio.foo", "_level0.o.myVar");
//
//Now if you were watching the myVar for 
//changes you could setup a callback like.
//
this.onMyVar = function () {
 //myVar in o was changed
};
//
o.watch ("myVar", this.onMyVar);
```

Given the above it should now be possible to have a standardized means to run fscommands and have callbacks to use the same where they return output in a standardized way without having to write individual watches.