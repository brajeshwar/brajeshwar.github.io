---
layout: default
title: Contact
permalink: /contact/
---

Say [hi@brajeshwar.com](mailto:hi@brajeshwar.com)\
or find me at
[Github](http://github.com/brajeshwar),
[HackerNews](https://news.ycombinator.com/user?id=Brajeshwar),
[LinkedIn](https://www.linkedin.com/in/brajeshwar/),
and
[Twitter](https://twitter.com/brajeshwar).

---

Email is always the first and best communication medium, and I'm happy to get cold emails. I love thoughtful cold emails and would definitely reply. Please, tell me know who you are and your message be clear, and short that grabs attention with a specific ask, an offer, or an actionable item.

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
- [Reddit](https://www.reddit.com/user/Brajeshwar/)
- [WordPress](https://profiles.wordpress.org/brajeshwar/)
- Find more at https://discoverprofile.com/brajeshwar/
{% endcomment %}