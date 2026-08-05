# Panda - Video Solved

Panda is an awesome open source solution for video uploading, encoding and streaming.

By providing an elegant REST API, Panda makes it completely painless to implement full video uploading, encoding and streaming functionality to your web application in a matter of hours.

* Runs completely within [Amazon's Web Services](https://aws.amazon.com/) utilising EC2, S3 and SimpleDB.
* Everything contained within one elegant [Merb](https://www.merbivore.com/) application.
* Support for the numerous encoding profiles [FFmpeg](https://ffmpeg.mplayerhq.hu/) supports including FLV, h264 for Flash a iPhone formats.
* Lovely little admin dashboard for managing your videos.

Runs in the cloud

Panda runs completely in the cloud computing environment provided by Amazon Web Services. The application runs on a customised EC2 instance with everything pre-installed, including FFmpeg and an plethora of codecs. SimpleDB is used to store all of data for video, encoding, accounts and encoding profiles. Uploaded and encoded video files are then stored on S3.

Simple to integrate

Your Panda EC2 instance will provide a simple REST (both YAML and XML formats support) API for listing, creating, editing and deleting videos. When a new video is created on your site the actual file upload takes place in a popup or iframe. Doing so means that the large video file is uploaded directly to your Panda EC2 instance so you don't have to handle it within your application. The server also is configured to support an upload progress bar so user's can see the video upload in progress.

Once a video has been uploaded the encoding daemon will pickup the job and encode the video to the encoding profiles you specify. Upon completion Panda will send a notification back to your application to let it know the video has finished encoding and can be watched.

The superb [JW FLV Player](https://www.jeroenwijering.com/?item=Jwp_FLV_Media_Player) is used by default, but because you've got access to all of the video files you can use any Flash video player out there.

More about Panda

* [Panda Website](https://pandastream.com/)
* [Get Started](https://pandastream.com/docs/getting_started)
* [Documentation](https://pandastream.com/docs)
* [Source at Github](https://github.com/newbamboo/panda)

Panda was created by the specialist Ruby on Rails (and Merb!) development company [New Bamboo](https://new-bamboo.co.uk/).
