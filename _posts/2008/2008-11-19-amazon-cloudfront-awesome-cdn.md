# Amazon CloudFront, an Awesome CDN

Amazon announced <a href="http://aws.amazon.com/cloudfront/">CloudFront</a> just about a day back and we were extremely excited that we would be able to serve files faster to our users.

I won't detail about Amazon CloudFront as their blog have done a good job on that -- <a href="http://aws.typepad.com/aws/2008/11/distribute-your-content-with-amazon-cloudfront.html">Distribute Your Content With Amazon CloudFront</a>.

What our team did was some simple test to see the speed and response time for our new Amazon CloudFront CDN-ed content.

The Test and the Result (INDIA)

First, we created a distribution for our AWS S3 bucket and put a file in the bucket. We then download the file from the CloudFront

`$ wget http://mydist.cloudfront.net/wallpaper.jpg`

We got an average speed of 60 KBps! :-)

Next, we tried downloading the same file directly from our S3 bucket

`$ wget http://mybucket.s3.amazonaws.com/wallpaper.jpg`

Then, we saw that we got an average speed of 10 KBps :-(

So, we decided to figure out which CloudFront server were we redirected to from India. We did a simple `dig` on our CloudFront URL

`$ dig mydist.cloudfront.net`

And look for yourself --

```shell
;; QUESTION SECTION:
mydist.cloudfront.net.	IN	A

;; ANSWER SECTION:
mydist.cloudfront.net. 60 IN	A	216.137.55.211
mydist.cloudfront.net. 60 IN	A	216.137.55.216
mydist.cloudfront.net. 60 IN	A	216.137.55.213
mydist.cloudfront.net. 60 IN	A	216.137.55.108
mydist.cloudfront.net. 60 IN	A	216.137.55.100
mydist.cloudfront.net. 60 IN	A	216.137.55.233
mydist.cloudfront.net. 60 IN	A	216.137.55.201
mydist.cloudfront.net. 60 IN	A	216.137.55.35
```

Hmm. Let's find out where the servers are really located ;)

`$ traceroute 216.137.55.211`

Be ready to be surprised.

```shell
1  192.168.0.254 (192.168.0.254)  1.538 ms  1.911 ms  2.421 ms
2  * * *
3  dsl-mum-erx-238.127.144.59.airtelbroadband.in (59.144.127.238)  39.002 ms  40.846 ms  41.552 ms
4  125.18.13.137 (125.18.13.137)  44.072 ms  44.514 ms  44.787 ms
5  125.21.167.25 (125.21.167.25)  77.995 ms  80.059 ms  80.509 ms
6  p4-2-0-0.r01.sngpsi02.sg.bb.gin.ntt.net (129.250.12.225)  110.669 ms 94.407 ms  94.981 ms
7  ge-0-0-0.r00.sngpsi02.sg.bb.gin.ntt.net (129.250.4.33)  103.501 ms 103.697 ms  104.116 ms
8  * p1-1-1-3.r02.newthk01.hk.bb.gin.ntt.net (129.250.4.129)  136.561 ms 138.106 ms
9  ae-4.r20.newthk01.hk.bb.gin.ntt.net (129.250.2.246)  138.550 ms 139.714 ms  140.381 ms
10  po-2.a05.newthk01.hk.ra.gin.ntt.net (203.131.240.174)  144.352 ms 145.710 ms  146.653 ms
11  203.131.243.162 (203.131.243.162)  150.713 ms  151.553 ms  153.725 ms
12  216.137.55.211 (216.137.55.211)  156.607 ms  128.642 ms  129.524 ms
```

Neat, from India to Hong Kong in 12 hops :-)

The Test and the Result (US)

Cool. We then decided to see how better is it for people in the United States by using a server located physically in the US.

`$ dig mydist.cloudfront.net`

```shell
;; ANSWER SECTION:
mydist.cloudfront.net. 60 IN	A	216.137.39.110
mydist.cloudfront.net. 60 IN	A	216.137.39.157
mydist.cloudfront.net. 60 IN	A	216.137.39.171
mydist.cloudfront.net. 60 IN	A	216.137.39.46
mydist.cloudfront.net. 60 IN	A	216.137.39.224
mydist.cloudfront.net. 60 IN	A	216.137.39.65
mydist.cloudfront.net. 60 IN	A	216.137.39.77
mydist.cloudfront.net. 60 IN	A	216.137.39.225
```

`$  traceroute 216.137.39.110`

```shell
1  209-20-80-2.slicehost.net (209.20.80.2)  0.000 ms  0.000 ms  0.000 ms
2  209.20.79.225 (209.20.79.225)  0.000 ms  0.000 ms  0.000 ms
3  ge-6-13-115.car1.StLouis1.Level3.net (4.79.132.225)  0.000 ms 0.000 ms 0.000 ms
4  ae-11-11.car2.StLouis1.Level3.net (4.69.132.186)  0.000 ms  4.001 ms 0.000 ms
5  AMAZONCOM.car2.StLouis1.Level3.net (4.53.162.66)  0.000 ms  0.000 ms 0.000 ms
6  216.137.39.110 (216.137.39.110)  0.000 ms  0.000 ms  0.000 ms
```

Wow! Only 6 hops :-)

So, as you can see CloudFront really works as a good Content Delivery Network and is extremely affordable, no entry cost at all. Check out their <a href="http://aws.typepad.com/">blog</a>.
