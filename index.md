---
layout: home
title: Brajeshwar Oinam
type: home
---

My name is Brajeshwar Oinam.

I am an entrepreneur, and technologist, with a deep focus on leadership in products and designs. I have been a developer, designer, and creative product direction with a track record of building products and leading teams.

I co-founded [Valinor Earth](https://valinor.earth) with two of my close friends, with whom I have worked on multiple projects and companies. We build sustainable and profitable technology practices helping businesses curb climate change.

I write about design, entrepreneurship, productivity, software, startups, and technology. Here are some of the recent articles from the __[blog](/blog/)__, which started in 2001 and has {{site.posts | size}} articles.

<section class="blog-articles__list">
  <ol>
    {%- for post in site.posts limit:10 -%}
    <li>
      <a href="{{post.url}}">{{ post.title | escape }}</a>
      <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %-d, %Y' }}</time>
    </li>
    {%- endfor -%}
  </ol>
</section>

Read more [about me](/about/), the history of this [website](/about/brajeshwar.com/), browse the articles [archive](/blog/), or send me an [email](/contact/).