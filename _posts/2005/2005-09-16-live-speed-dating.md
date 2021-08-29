# Live Speed Dating

This application have gone through many phases; from ActionScript 1.0 to Actionscript 2.0, FCS Clustering from Delphi to ColdFusion/Flash combo, MS SQL 2000 to MySQL to PostGreSQL, changes coupla developers' hand. The Team is finally able to bring this out in a fully functional application.

## Live Speed Dating

LSD or Live Speed Dating is about an Enterprise Rich Internet Application that allows people to engage in Audio-Video and text chat in a varied setting. The main feature of the application is the LSD . At any point in time the application's site will have various LSD events scheduled so people can engage in a blind speed date online.

People login to the application and then signup/checkin into the event they would like to participate in. At the scheduled time of the event, the LSD kicks in. The application pairs off people into group of one-on-one sessions. During each sessions the users have an audio video chat with the person they are paired with. At the end of the session the user gets to vote and give a testimonial for their partner. Then they move on to the next partner they are paired with and so on until the final session. It is like a "*musical chairs*" of sorts. During the voting stage of a session, the user gets to vote on various categories, but mainly they choose to flag the user as "*dateable*" or "*don't date*". The application architecture also supports resuming back into event stages even after a disconnect which was an uphill task during the initial architecture.

Once all the sessions of an event are complete the event is considered over. The user then gets to see the results of tier LSD. Here they are shown users that they matched with. A "*Match*" is made when both the partners selected each other as "*dateable*" during the voting stage of the LSD session. The details of the "*dates*" are not revealed till they pay up or sign up with a paid subscription.

## Flash Communication Server Switch Network

Flash Communication Server Switch Network or rather lovingly known as FCSN internally among the Oinam Team, is a network of flashcom applications that monitor the activity of a group of flashcom servers in a cluster, and provide a means to distribute load across this cluster of flashcom servers.

The primary use case for FCSN is to provide load distribution of users for 1-1 type of flashcom applications (LSD) and/or static content delivery. Further, FCSN also provides a cap on the number of users that are distributed to nodes in the flashcom cluster, thus protecting any node in the cluster from being overloaded with traffic that it may not be able to handle.

FCSN does this monitoring from an external flashcom server and generally runs independent of the flashcom application serving cluster. To avoid a single point of failure multiple switches and bridges can be used that could span a cluster of such polling flashcom servers, that only run fcsn applications. Further, since the polling flashcom servers only connect to the nodes in the cluster, they can be run on flashcom personal edition licenses itself. The amount connections (license type) needed on a polling server is typically twice the number of nodes in the cluster.
