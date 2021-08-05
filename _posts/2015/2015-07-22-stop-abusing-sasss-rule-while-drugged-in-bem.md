---
layout: post
title: Stop abusing Sass's '&-rule' while drugged in BEM
---

[BEM](http://bem.info/) is awesome and we all love it. Our team at Razorfish, India have successfully moved bag-n-baggage to writing BEM style class names. The best benefit so far is that it is easier to work together in larger teams and much faster while fixing bugs. The other advantage I've seen is that we can move and/or switch team members across projects without having to do an extensive knowledge transfer. They feel right at home and in ease with the patterns across projects.

So, when Sass 3.4 released with a well-defined `&-rule`, we went crazy and went BEM-BEM with it on everything we wrote. Here is how it goes;

```sass
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
```

This looks pretty good and harmless. In-fact, you feel that you can now avoid writing that classname, `.block` multiple times and thus DRY everything. Unfortunately, we realized that the moment we go deeper, wrote more codes, switch/add more people to the team - it was getting harder to do the usual global search to debug the codes.

Well, we ended up not using it. Thus,

```sass
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
```

What happens now is that we can quickly do a project-wide search for that 'element' or the 'modifier' with its full namespace as seen in the HTML. The question though, that might arise, is what happens if we have to change the block's classname. Well, it is matter of an easy find-n-replace. With IDEs capability to select multiple selections, this should not be an issue at all. For instance, you can do a quick `CMD + d` in Sublime Text and Atom to select all the 'block'.

So, the thumb-rule is to avoid `&-rule` for full classnames that you find in HTMLs but use it with ones that you do not really see it in your HTML code - pseudo classes.
