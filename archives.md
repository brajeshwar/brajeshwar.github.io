---
layout: page
title: Archives
permalink: /archives/
---

<section id="page-archives" class="page-archives list-reset list-alternate-bg link-reset">
  {%- for post in site.posts -%}
  {%- assign currentdate = post.date | date: "%Y" -%}
  
  {%- if currentdate != date -%}
    {%- unless forloop.first -%}</ol>{% endunless %}
    <h2 id="year-{{post.date | date: "%Y"}}" class="archives-list__title">{{ currentdate }}</h2>
    <ol>
      {% assign date = currentdate %}
    {%- endif -%}
      <li>
        <span class="post-list__meta">{{ post.date | date: '%b %d' }}</span>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {%- if forloop.last -%}</ol>{% endif %}
  {% endfor %}
</section>
