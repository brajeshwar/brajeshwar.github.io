---
layout: post
title: How-to - Numbered Pagination for your Wordpress Blog
---

There are a bunch of awesome Wordpress Plugins that can do `Numbered Pagination` for your Wordpress powered blog. However, it may be noted that Wordpress have the option to do it without relying on a plugin.

Let's do a clean, nice and simple numbered pagination as seen on this blog. You can choose to have either the light or the dark version.

Here is the code modified from Wordpress [Reference doc on Pagination](http://codex.wordpress.org/Function_Reference/paginate_links). The code is pretty self-explanatory. Just put it where you want your pagination to appear.

```php
<?php global $wp_query;
    $big = 99999999;
    echo paginate_links(array(
        'base' ?> str_replace($big, '%#%', get_pagenum_link($big)),
        'format' => '?paged=%#%',
        'total' => $wp_query->max_num_pages,
        'current' => max(1, get_query_var('paged')),
        'show_all' => false,
        'end_size' => 2,
        'mid_size' => 3,
        'prev_next' => true,
        'prev_text' => 'Prev',
        'next_text' => 'Next',
        'type' => 'list'
    ));
?>
```

![CSS3 Paginateion Style)](/static/2012/css3-paginate.png)

Feel free to use it this version or tweak it from the original - [Pagination Styles Demo](http://brajeshwar.github.io/paginate/) ([Source on Github](https://github.com/brajeshwar/paginate)). The source have the codes for both light and dark version.

```css
ul.page-numbers {
  list-style: none;
  margin: 1em auto;
  padding: 0;
  text-align: center;
  color: #555555;
  text-transform: uppercase;
  font-size: 90%;
}

ul.page-numbers li {
  display: inline;
}

ul.page-numbers a.page-numbers {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  background-color: #676767;
  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #f9f9f9), color-stop(100%, #eaeaea));
  background-image: -webkit-linear-gradient(#f9f9f9, #eaeaea);
  background-image: -moz-linear-gradient(#f9f9f9, #eaeaea);
  background-image: -o-linear-gradient(#f9f9f9, #eaeaea);
  background-image: linear-gradient(#f9f9f9, #eaeaea);
  margin: 2px;
  padding: 5px 10px;
  display: inline-block;
  border-top: 1px solid #fff;
  text-decoration: none !important;
  color: #555555 !important;
  font-size: smaller !important;
  text-shadow: white 0 1px 0;
}
ul.page-numbers a.page-numbers:first-child, ul.page-numbers a.page-numbers.first {
  margin-left: 0;
}
ul.page-numbers a.page-numbers:last-child, ul.page-numbers a.page-numbers.last {
  margin-right: 0;
}
ul.page-numbers a.page-numbers:hover, ul.page-numbers a.page-numbers:focus {
  color: #333333;
  border-color: #fff;
  background-color: #fdfdfd;
  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fefefe), color-stop(100%, #fafafa));
  background-image: -webkit-linear-gradient(#fefefe, #fafafa);
  background-image: -moz-linear-gradient(#fefefe, #fafafa);
  background-image: -o-linear-gradient(#fefefe, #fafafa);
  background-image: linear-gradient(#fefefe, #fafafa);
}
ul.page-numbers a.page-numbers.more {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border: 0 none !important;
  background: transparent !important;
  margin-left: 0;
  margin-right: 0;
}
ul.page-numbers a.page-numbers.active {
  -webkit-box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  -moz-box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  border-color: #505050 !important;
  color: #f2f2f2 !important;
  text-shadow: black 0 1px 0;
  background-color: #676767;
  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #5f5f5f), color-stop(100%, #5c5c5c));
  background-image: -webkit-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: -moz-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: -o-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: linear-gradient(#5f5f5f, #5c5c5c);
}
ul.page-numbers .prev:before {
  content: "\2039";
  padding-right: 0.5em;
}
ul.page-numbers .next:after {
  content: "\203A";
  padding-left: 0.5em;
}
ul.page-numbers .dots {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border: 0 none !important;
  background: transparent !important;
  color: #999999 !important;
  margin-left: 0.25em;
  margin-right: 0.25em;
}
ul.page-numbers .current {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  -moz-box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.75);
  background-color: #676767;
  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #5f5f5f), color-stop(100%, #5c5c5c));
  background-image: -webkit-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: -moz-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: -o-linear-gradient(#5f5f5f, #5c5c5c);
  background-image: linear-gradient(#5f5f5f, #5c5c5c);
  margin: 2px;
  padding: 5px 10px;
  display: inline-block;
  border-top: 1px solid #fff;
  text-decoration: none !important;
  font-size: smaller !important;
  border-color: #505050 !important;
  color: #f2f2f2 !important;
  text-shadow: black 0 1px 0;
}
```

That's it. A nice numbered pagination for your Wordpress Blog without the need of a plugin.