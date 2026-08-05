# How Facebook Scales with OpenSource tools

Everyone knows about the humble (and not so ethical) beginnings of Facebook. From a poor man's version of `Hot or Not` for Harvard students to the current-day Facebook, they grew to more than 500 million active users. The growth sure is, exponential; and the reach is, unparalleled. Coupled with over 900 million objects (pages, groups, events and community pages) that the users interact with and more than 30 billion pieces of content -- web links, news stories, blog posts, notes, photo albums, etc., shared each month; Facebook is a nightmare (pun intended), both in terms of the storage and the delivery of this huge data content to members across the globe interconnected -- to each other in unimaginable ways.

Contrary to what most of the populace knows, Facebook has been developed from the ground up, using [Open Source](https://www.opensource.org/) software. Developers building Platform scale with their own applications are using many of the same infrastructure technologies that power Facebook. The reliance of Facebook on open source software has gone beyond the [LAMP stack](<https://en.wikipedia.org/wiki/LAMP_(software_bundle)>) + [Memcached](https://memcached.org/). 

Let's have a look at the Open Source tools which result in Facebook's success & popularity.

## Scribe:

[Scribe](https://github.com/facebook/scribe) was developed at Facebook and released as open source to handle the 25 terabytes of data it logs every day. It is designed to be scalable, extensible without client-side modification, and robust to failure of the network or any specific machine. The installation at Facebook runs on thousands of machines and reliably delivers tens of billions of messages a day. 

## HIVE:

[Hive](https://wiki.apache.org/hadoop/Hive) is a data warehouse infrastructure built on top of [Hadoop](https://en.wikipedia.org/wiki/Hadoop). It provides tools to enable easy data ETL (Extract, Transform, Load), a mechanism to put structures on the data, and the capability to querying and analysis of large data sets stored in Hadoop files. Hive defines a simple SQL like query language, called QL, that enables users familiar with SQL to query the data. It is best used for batch jobs over large sets of immutable data (like web logs). What Hive values most are scalability, extensibility, fault-tolerance and loose-coupling with its input formats.

## HipHop:

[HipHop for PHP](https://github.com/facebook/hiphop-php) is a source code transformer for PHP script code. HipHop programmatically transforms PHP source code into highly optimized C++ and then uses g++ to compile it to machine code. HipHop was created by Facebook, under the lead of Haiping Zhao, to save resources on their servers.

## Cassandra:

[Cassandra](https://en.wikipedia.org/wiki/Apache_Cassandra) was developed by Facebook to power their Inbox Search feature. It is an Apache Software Foundation top-level project now, designed to handle very large amounts of data spread out across many commodity servers while providing a highly available service with no single point of failure. [Digg](https://digg.com/) and [Twitter](https://twitter.com/) are also supported by Cassandra.

## Thrift:

[Thrift](https://en.wikipedia.org/wiki/Apache_Thrift) is a framework developed for "scalable cross-language services development" to work efficiently and seamlessly between C++, C#, Java, Perl, Python, PHP, Erlang and Ruby. Originally developed at Facebook, it is now an open source project in the Apache Software Foundation Incubator.

As Facebook grows, it continually faces scalability challenges that no one has solved, and it is trying to engineer its way through them. Already, Facebook is the second most-trafficked PHP site in the world (Yahoo is 'currently' #1), and one of the largest MySQL installations anywhere, running thousands of databases. In terms of total photo page views, it exceeds the entire next largest photo sites combined.

As of now, let's just say, Hail Facebook!
