# Why won't index files deployed on Cloudfront work like it does in S3?

I seriously had no clue about this. It was one the most irritating thing while deploying static site hosting on Amazon Cloudfront. I had in-fact stayed with S3 for sites that had folders with `index.html`. Here is the solution for those who haven't figured out yet.

I was recently deploying a Jekyll powered static site. During the test phase, it all worked fine being deployed on the S3. When I decided that it's ok to move to Cloudfront -- except for the root index, anything else inside a folder won't display without appending the `index.html` at the end.

By default, when you deploy a Cloudfront Distribution, it will point to the location of the S3 Origin - `staticWebsite.com.s3.amazonaws.com`. Instead of that origin, your Cloudfront Distribution should have points its origin to S3 Endpoint which looks something like - `staticWebsite.com.s3-website-us-east-1.amazonaws.com`

## Steps

### 1. Look at the "Properties" of the S3 Bucket and copy that link.

![s3-static-hosting)](/static/2013/s3-static-hosting.png)

### 2. Now Add/Edit your Cloudfront Distribution Origin to that link.

![cloudfront-s3-origin)](/static/2013/cloudfront-s3-origin.png)

I hope that works for you.