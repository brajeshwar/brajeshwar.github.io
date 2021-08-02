---
layout: page
title: Blog
permalink: /blog/
---

{% include google-search.html %}

<section id="page-blog" class="page-blog list-reset list-alternate-bg link-reset">
  {%- for post in site.posts -%}
  {%- assign currentdate = post.date | date: "%Y" -%}
  
  {%- if currentdate != date -%}
    {%- unless forloop.first -%}</ol>{% endunless %}
    <h2 id="year-{{post.date | date: "%Y"}}" class="archives-list__title">{{ currentdate }}</h2>
    <ol>
      {% assign date = currentdate %}
    {%- endif -%}
      <li>
        <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d' }}</time>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {%- if forloop.last -%}</ol>{% endif %}
  {% endfor %}
</section>
