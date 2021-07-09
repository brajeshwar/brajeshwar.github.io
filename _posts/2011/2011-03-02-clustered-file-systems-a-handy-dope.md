---
layout: post
title: Clustered File Systems - a handy dope!
date: 2011-03-02 23:12:27.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Clustered File Systems
- File System Choices
- Shared Data Storage
- software
- Software Design
meta:
  _edit_last: '67'
  dsq_thread_id: '244260605'
  bitly_short_url: http://j.mp/k0oW43
  retweet_cache: '1309536171:1'
  trx_addons_post_views_count: '76'
author:
  login: Deeptaman
  email: d.mukherjee05@gmail.com
  display_name: Deeptaman Mukherjee
  first_name: Deeptaman
  last_name: Mukherjee
permalink: "/2011/clustered-file-systems-a-handy-dope/"
---
<p>There exists a handful of options to choose from as far as <a href="http://en.wikipedia.org/wiki/Clustered_file_system">clustered and high storage files</a> are concerned, but in order to understand the functioning of each file system there needs to be some research conducted. Each option of storage architecture and file system is essential as each have their own limitations that are severe and hence require meticulous design work. Here, I will try elaborating on a few common physical storage configurations, as well as clustered and distributed file system options. This should be a good beginning which will help us in looking into the best of technology.</p>
<p><!--more--></p>
<p><img class="alignright" src="{{ site.baseurl }}/assets/2011/03/clustered-file-systems.gif" alt="an example of clustered file systems" /></p>
<h3>Technologies & their Underlying Architecture</h3>
<p>The problem with <a href="http://en.wikipedia.org/wiki/Category:Shared_disk_file_systems">shared-disk setups</a> is that they have a single point of failure which is the storage system. The use of the word 'shared-disk' is quite confusing. It is said, "<a href="http://compnetworking.about.com/od/networkstorage/f/san-vs-nas.htm">SANs & NAS</a> appliances, and commodity hardware running Linux can all replicate the underlying disks in real-time to another storage node, which provides a simulated shared-disk environment." It is because the underlying block devices are duplicated; the nodes gain access to the same data and hence run a clustered file system thereby breaking the meaning of the word shared-disk. On the other hand <a href="http://en.wikipedia.org/wiki/Shared_nothing_architecture">share-nothing</a> is considered as the reason for shared-disk single points of failure. Master server would be notified of the changes with the help of nodes with distinct storage capabilities.</p>
<p><img class="alignright" src="{{ site.baseurl }}/assets/2011/03/shared-disk-setup.gif" alt="Example of a Shared Disk Setup" /></p>
<h3>Design Options</h3>
<p>The reason why users cannot access the same block device through more than 2 servers is because at the system level, the file system is built in such a way that the locking files protect the data from any errors made. However, this is not the case at the operating system level whereby the file system drivers can gain full leverage and gain access to the underlying block device after which it will be free from blockage and hence easier to roam. The assumption that most file systems are work under is that they are given a block device and thus it will be their own thing.</p>
<p>In order to settle this, clustered file systems install and run a concurrent control mechanism. Certain systems are more comfortable with storing metadata inside of a partition within the shared device. And some other systems opt for a centralized metadata server. But the commonality between both systems is that the cluster allows all nodes to gain a consistent view of the kind of scenario the file system is in and hence allow for a safe concurrent access. Having said all this, there is one final thing that is essential to note, and that is - the clustered file systems model needs fast and immediate action when it comes to fixing a node which does something wrong. Proper fencing must be implemented so when a node writes bad data or encodes the wrong message with the <a href="http://www.webopedia.com/TERM/M/metadata.html">metadata</a>, the node will be able to defend the offender.</p>
<h3>Clustered File System Choices</h3>
<p>Before ending this dope on clustered file systems, I thought it is essential for me to mention some of the well-known and widely used Cluster File Systems which are - <a href="http://www.redhat.com/gfs/">GFS</a>, <a href="http://oss.oracle.com/projects/ocfs/">OCFS</a>, <a href="http://www.vmware.com/products/vmfs/index.html">VMFS</a>, <a href="http://wiki.lustre.org/index.php/Main_Page">Lustre</a> & <a href="http://hadoop.apache.org/">Hadoop</a>.</p>
