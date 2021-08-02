---
layout: home
title: Brajeshwar Oinam
type: home
---

Hi, I am Brajeshwar Oinam.

I have been writing since 2001. I write about productivity, technology, entrepreneurship, startup life, and design.

### Recent articles

<section id="home-blog" class="home-blog list-reset">
  <ul>
    {% for post in site.posts limit:5 %}
    <li><a href="{{post.url}}">{{ post.title | escape }}</a></li>
    {% endfor %}
  </ul>
</section>

Browse the [blog](/blog/) for the whole list of {{site.posts | size}} articles.

## Work

I co-founded <a href="https://valinor.earth">Valinor Earth</a> with two of my close friends, with whom I have worked on multiple projects and companies. We build sustainable and profitable technology practices helping businesses curb climate change.