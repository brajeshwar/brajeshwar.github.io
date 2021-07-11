---
layout: page
title: Archives
permalink: /archives/
---

<main id="page-archives" class="page-archives list-reset">
  {% for post in site.posts  %}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}

    {% if forloop.first %}
    <h2 id="{{ this_year }}-ref">{{this_year}}</h2>
    <ol>
      {% endif %}
      <li><span>{{ post.date | date: '%b %d' }}</span> <a href="{{ post.url }}">{{ post.title }}</a></li>
      {% if forloop.last %}
    </ol>
    {% else %}
      {% if this_year != next_year %}
      </ol>
      <h2 id="{{ next_year }}-ref">{{next_year}}</h2>
      <ol>
      {% endif %}
    {% endif %}
  {% endfor %}
</main>
