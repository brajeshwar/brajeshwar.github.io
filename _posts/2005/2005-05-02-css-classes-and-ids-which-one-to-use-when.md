# CSS classes and IDs, Which one to use when?

I was trying out a way to float 4 DIVs inside a parent DIV on a quick site design, and this topic came up to my mind. I even explained this to a group of attendees at the [India MAX 2004](/2004/macromedia-max-2004-india-chapter/), Bangalore. Many times in the past, I have tried to get this archived but somehow slipped my mind, so, here we go.

## Classes and IDs, which one, when and why?

By now, it is rather a common thing, most (x)html/css layout designers know very well where to separate ID selectors from classes in CSS! This article should most aptly apply to newcomers.

The [W3C](http://www.w3.org/) defines that attributes of the type ID cannot have the same value more than once in a document, which means that it is unique for that particular document. Nonthless, as of today, most browsers will not complain even if you violate the same. It may be noted that a CSS ID Selector usually contains a `#` followed by the ID value.

```css
#myid {
	position: relative;
	margin: 0 auto;
	padding: 0;
	text-align: left;
	background: url(pattern.gif) repeat-y;
}
```

or

```css
div#myid {
	position: relative;
	margin: 0 auto;
	padding: 0;
	text-align: left;
	background: url(pattern.gif) repeat-y;
}
```

Classes on the other hand can be used many times in a document. So, they are best used to define a common style which can be used on multiple elements on your document. They start with a . (dot) followed by the value.

```css
.myClass {
	font: normal normal normal 86%/1.6em "Lucida Grande", "Lucida Sans Unicode";
	border-top: 1px solid #ebebeb;
	text-transform: lowercase;
	color: #666;
}
```

An element can have an ID selector and [mutiple classes](/2004/multiple-class-in-css/) applied to it. Remember one important thing here -- ID selectors have higher precedence over class selectors.

So, IDs are for specific unique elements in your particular document and classes to be applicable to multiple elements in a document.
