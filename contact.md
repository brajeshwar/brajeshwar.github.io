---
layout: default
title: Contact
permalink: /contact/
---

Say [hi@brajeshwar.com](mailto:hi@brajeshwar.com)\
or find me at
[Github](http://github.com/brajeshwar),
[HackerNews](https://news.ycombinator.com/user?id=Brajeshwar),
and
[Twitter](https://twitter.com/brajeshwar).

---

[Please pick a schedule](https://meet.brajeshwar.com) appropriate to you, and let's meet/talk.

---

Of course, email is always the first and best communication medium, and I'm happy to get cold emails. I love thoughtful cold emails and would definitely reply. Here are a few tips;


- Short and grabs attention.
- Be clear on who you are.
- Either has a specific ask, an offer, or an actionable item.

---

<form id="contact-form" action="https://formspree.io/f/mrgrrljj" method="POST">
  <fieldset>
    <p id="contact-form-status" style="font-weight: bold;"></p>
    <p>
      <label for="name">Name</label><br>
      <input type="text" name="name" required>
    </p>
    <p>
      <label for="email">Email</label><br>
      <input type="email" name="email" required>
    </p>
    <p>
      <label for="subject">Subject</label><br>
      <input type="text" name="subject" required>
    </p>
    <p>
      <label for="message">Message</label><br>
      <textarea cols="50" rows="10" name="message" required></textarea>
    </p>
    <button type="submit">Send Email</button>
  </fieldset>
</form>

<script>
var form = document.getElementById("contact-form");

async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("contact-form-status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    status.innerHTML = "Thanks! Email Sent.";
    form.reset()
  }).catch(error => {
    status.innerHTML = "Oops! Didn't work. Can you please retry?"
  });
}
form.addEventListener("submit", handleSubmit)
</script>


{% comment %}
_Archived_

- [Blogspot](http://brajeshwar.blogspot.com)
- [Facebook](https://www.facebook.com/brajeshwar/)
- [Flickr](https://www.flickr.com/photos/brajeshwar/) `(2004-2015; 11+ million views)`
- [Medium](https://medium.com/@brajeshwar)
- [WordPress](https://profiles.wordpress.org/brajeshwar/)
{% endcomment %}