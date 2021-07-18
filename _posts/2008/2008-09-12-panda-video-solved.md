---
layout: post
title: Panda - Video Solved
date: 2008-09-12 06:42:51.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technology
tags:
- Amazon
- API
- AWS
- EC2
- FFMpeg
- Merb
- Panda
- PandaStream
- Ruby
- S3
- SimpleDB
- streaming
- video
- Videos
meta:
  dsq_thread_id: '135860885'
  bitly_short_url: http://j.mp/jEFClv
  retweet_cache: '1309572146:0'
  trx_addons_post_views_count: '39'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2008/panda-video-solved/"
excerpt: By providing an elegant REST API, Panda makes it completely painless to implement
  full video uploading, encoding and streaming functionality to your web application
  in a matter of hours.
---
<p><a href="http://pandastream.com/"><img src="/static/2008/09/panda_arch.gif" alt="Panda: Video Solved" style="border: 0 none; float: right;" /></a>Panda is an awesome open source solution for video uploading, encoding and streaming.</p>
<p>By providing an elegant REST API, Panda makes it completely painless to implement full video uploading, encoding and streaming functionality to your web application in a matter of hours.</p>
<p>* Runs completely within <a href="http://aws.amazon.com/">Amazon's Web Services</a> utilising EC2, S3 and SimpleDB.<br />
* Everything contained within one elegant <a href="http://www.merbivore.com/">Merb</a> application.<br />
* Support for the numerous encoding profiles <a href="http://ffmpeg.mplayerhq.hu/">FFmpeg</a> supports including FLV, h264 for Flash a iPhone formats.<br />
* Lovely little admin dashboard for managing your videos.</p>

<p><strong>Runs in the cloud</strong></p>
<p>Panda runs completely in the cloud computing environment provided by Amazon Web Services. The application runs on a customised EC2 instance with everything pre-installed, including FFmpeg and an plethora of codecs. SimpleDB is used to store all of data for video, encoding, accounts and encoding profiles. Uploaded and encoded video files are then stored on S3.</p>
<p><strong>Simple to integrate</strong></p>
<p>Your Panda EC2 instance will provide a simple REST (both YAML and XML formats support) API for listing, creating, editing and deleting videos. When a new video is created on your site the actual file upload takes place in a popup or iframe. Doing so means that the large video file is uploaded directly to your Panda EC2 instance so you don't have to handle it within your application. The server also is configured to support an upload progress bar so user's can see the video upload in progress.</p>
<p>Once a video has been uploaded the encoding daemon will pickup the job and encode the video to the encoding profiles you specify. Upon completion Panda will send a notification back to your application to let it know the video has finished encoding and can be watched.</p>
<p>The superb <a href="http://www.jeroenwijering.com/?item=Jwp_FLV_Media_Player">JW FLV Player</a> is used by default, but because you've got access to all of the video files you can use any Flash video player out there.</p>
<p><strong>More about Panda</strong></p>
<p>* <a href="http://pandastream.com/">Panda Website</a><br />
* <a href="http://pandastream.com/docs/getting_started">Get Started</a><br />
* <a href="http://pandastream.com/docs">Documentation</a><br />
* <a href="http://github.com/newbamboo/panda">Source at Github</a></p>
<p>Panda was created by the specialist Ruby on Rails (and Merb!) development company <a href="http://new-bamboo.co.uk/">New Bamboo</a>.</p>
