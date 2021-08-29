# Dynamic CSS and DataURI to the rescue

We at `Paisa.com` are developing a financial Web Application, trying to make it easier for users to invest their money. We, in fact, have a rather nifty way of allowing users to browse through Stocks without the overhead complexity of trying to calculate the figures and stats.

## The Situation

We wanted to have an identifying logo for each and every company. Well, that is about 3000+ companies. The logos themselves are small - 24 x 24 pixels each.

## The Problem

The size of each logo is rather negligible. So, that's not the problem. The problem is the number of HTTP calls we'll have to do fetch these logos. Atop that, we've no clue what the user will pull and push the filter criteria to view her results. So, we have a problem of displaying 3000+ images and we've no clue when and where they'll appear.

## The Solution (Not)

Initially, I was thinking of doing a rather complex matrix of Image Sprites by combining them in pre-defined groups based on -- BSE-100, BSE-200, Alphabetical, etc. However, this introduces useless image downloads (bigger size now due to the combined sprite) and not really that re-usable at multiple places. So, CSS-Image-Sprite was NOT the solution.

## The Better Solution

One fine evening, an article popped up on [HackerNews](http://news.ycombinator.com/) -- [Data URIs make CSS sprites obsolete](http://www.nczonline.net/blog/2010/07/06/data-uris-make-css-sprites-obsolete/). Then, I knew this is something I can pursue to accomplish what we wanted.

In our situation, as each and every company is accompanied by their BSE Code, we inserted that in a class `bse_xxxxxx` (via Python in our case). We do have a default class, `stock_logo` that keeps a default logo ready just in case we don't have the logo of the company or is being changed or it simply does not exist. This default class also defines how the logo will be displayed, what will be the padding style etc. The class `bse_xxxxxx` is used only to insert the actual logo as a background-image.

Next, Javascript picks up the IDs of the actual logos to be displayed (in our example, from the special attribute `imgID`) and then constructs a link to a handler which generates a CSS file with Data-URIs embedded in it so that we can download all the required images with a single HTTP call and insert them seamlessly into an HTML file.

## Example:

Say the markup is like this -

```html
<li class="img img_500" imgid="500">Foo</li>
<li class="img img_600" imgid="600">Bar</li>
```

The JS code extracts the "imgID" from the li and constructs a query like the one below and inserts it into the DOM inside a link tag -

`stylesheets/logos.css?i=500|600`

Then, the special handler generates a CSS file by reading the actual images and base64 encoding them. The CSS file is loaded into the DOM and the new images show up instantly.

## Use Cases

The use cases look rather rare and might not be something you can use out of the box. However, we hope this will help someone who needs something similar and hope that this will inspire them in solving their own problem. We've use Python for our codes but this can be done in any Server Side Programming Language. We used Closure JS Framework with our Javascript but jQuery, a more common framework, was used in this example.

## Browser Support and the obvious Internet Explorer

The [article](http://www.nczonline.net/blog/2010/07/06/data-uris-make-css-sprites-obsolete/) by Nicholas refers to his [CSSEmbed](http://github.com/nzakas/cssembed) solution which uses [MHTML](http://en.wikipedia.org/wiki/MHTML) mode to make IE6 and IE7 compatible stylesheets that use internal images similar to data URIs. So, you can use a conditional HTML comment to import IE specific styles.

This is our first cut to the solution, we'll always be on the look-out to improve the solution (think Caching). If you've questions, or just want to say something, feel free to comment.

[Source on Github](http://github.com/Brajeshwar/datauri-dynamic-css).
