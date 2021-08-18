---
layout: page
title: Blog
permalink: /blog/
---

{% include search-google.html %}

{%- for post in site.posts -%}
{%- assign currentdate = post.date | date: "%Y" -%}

{%- if currentdate != date -%}
  {%- unless forloop.first -%}</ul>{% endunless %}
  <h2 id="year-{{post.date | date: "%Y"}}">{{ currentdate }}</h2>
  <ul class="blog-articles__list">
    {% assign date = currentdate %}
  {%- endif -%}
    <li class="one-liner">
      <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d' }}</time>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {%- if forloop.last -%}</ul>{% endif %}
{% endfor %}