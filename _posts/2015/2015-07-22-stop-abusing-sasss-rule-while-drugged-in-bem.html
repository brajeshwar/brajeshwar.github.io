---
layout: post
title: Stop abusing Sass's '&-rule' while drugged in BEM
date: 2015-07-22 15:40:02.000000000 +05:30
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- General
tags: []
meta:
  _edit_last: '67'
  _yoast_wpseo_focuskw: Sass, BEM
  _yoast_wpseo_linkdex: '67'
  dsq_thread_id: '3958996094'
  trx_addons_post_views_count: '108'
author:
  login: Brajeshwar
  email: brajeshwar@gmail.com
  display_name: Brajeshwar
  first_name: Brajeshwar
  last_name: Oinam
permalink: "/2015/stop-abusing-sasss-rule-while-drugged-in-bem/"
---
<p><a href="http://bem.info/">BEM</a> is awesome and we all love it. Our team at Razorfish, India have successfully moved bag-n-baggage to writing BEM style class names. The best benefit so far is that it is easier to work together in larger teams and much faster while fixing bugs. The other advantage I've seen is that we can move and/or switch team members across projects without having to do an extensive knowledge transfer. They feel right at home and in ease with the patterns across projects.</p>
<p>So, when Sass 3.4 released with a well-defined <code>&-rule</code>, we went crazy and went BEM-BEM with it on everything we wrote. Here is how it goes;</p>
<pre>
.block {
  display: inline-block;
  border: $border-width $border-style $border-color;
  background: $bg-color;

  &__element {
    border: $border-width $border-style darken($border-color, 15%);
    background: lighten($bg-color, 15%);
    
    &--modifier {
      border-color: $border-color-shiny;
      background: $bg-color-mate;
    }
  }
}
</pre>
<p>This looks pretty good and harmless. In-fact, you feel that you can now avoid writing that classname, <code>.block</code> multiple times and thus DRY everything. Unfortunately, we realized that the moment we go deeper, wrote more codes, switch/add more people to the team - it was getting harder to do the usual global search to debug the codes.</p>
<p>Well, we ended up not using it. Thus,</p>
<pre>
.block {
  display: inline-block;
  border: $border-width $border-style $border-color;
  background: $bg-color;
}

.block__element {
  border: $border-width $border-style darken($border-color, 15%);
  background: lighten($bg-color, 15%);
}

.block__element--modifier {
  border-color: $border-color-shiny;
  background: $bg-color-mate;
}
</pre>
<p>What happens now is that we can quickly do a project-wide search for that 'element' or the 'modifier' with its full namespace as seen in the HTML. The question though, that might arise, is what happens if we have to change the block's classname. Well, it is matter of an easy find-n-replace. With IDEs capability to select multiple selections, this should not be an issue at all. For instance, you can do a quick <code>CMD + d</code> in Sublime Text and Atom to select all the 'block'.</p>
<p>So, the thumb-rule is to avoid <code>&-rule</code> for full classnames that you find in HTMLs but use it with ones that you do not really see it in your HTML code - pseudo classes.</p>
