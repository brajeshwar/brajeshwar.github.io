---
layout: default
type: home
title: Brajeshwar Oinam
---

My name is Brajeshwar Oinam.

I am an entrepreneur, and technologist, with a deep focus on leadership in products and designs. I have been a developer, designer, and creative product direction with a track record of building products and leading teams.

I write about design, entrepreneurship, productivity, software, startups, and technology. Here are some recent articles from the [Blog](/blog/).

<div class="content-extend">
  <ul class="blog-articles__list">
    {%- for post in site.posts limit:5 -%}
    <li>
      <a href="{{post.url}}">{{ post.title | escape }}</a>
      <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %-d, %Y' }}</time>
    </li>
    {%- endfor -%}
  </ul>
</div>

I co-founded [Valinor Earth](https://valinor.earth) with two of my close friends, with whom I have worked on multiple projects and companies. We build sustainable and profitable technology practices helping businesses curb climate change.