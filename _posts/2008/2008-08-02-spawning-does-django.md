---
layout: post
title: Spawning does Django
---

Our team had a discussion yesterday why Spawning might be a good solution for our Python-Django specific Web server. The discussion is still hot on the table and have not come to a conclusion; nonetheless, Spawning does look really promising if we are to extract every ounce of power from a server and utilize its full power. We were questioning if using Apache is like using a "sledgehammer to swat flies".

<a href="http://pypi.python.org/pypi/Spawning/">Spawning</a> is a <a href="http://www.wsgi.org/">WSGI</a> server, written using eventlet, which supports multiple processes, multiple threads, non-blocking HTTP io, and automatic graceful upgrading of code. Eventlet is a networking library written using coroutines instead of normal subroutes, which makes writing networked non-blocking IO applications much much simpler.

Spawning will scale to a large number of keep-alive connections easily. However, it also delegates requests using other forms of multiprocessing and is configurable to be useful in a wide variety of situations. It supports multiple Python processes as well as a threadpool.

According to <a href="http://ulaluma.com/pyx/">Donovan Preston</a>, the man behind Spawning, there are lots of advantages of using a server like Spawning -- one of the most obvious being its ability to do "complete graceful code reloading". With the latest release, Spawning can easily run <a href="http://www.djangoproject.com/">Django</a> apps too. Download Donovan's <a href="http://soundfarmer.com/content/slides/coroutines-nonblocking-io-eventlet-spawning/coros,%20nonblocking%20i:o,%20eventlet,%20spawning.pdf">Eventlets/Spawning Presentation</a> (PDF).

Eric Florenzano have <a href="http://www.eflorenzano.com/blog/post/spawning-django/">more details</a> on Installation, usage etc. Read the comments for installation on different platforms.
