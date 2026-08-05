# Spawning does Django

Our team had a discussion yesterday why Spawning might be a good solution for our Python-Django specific Web server. The discussion is still hot on the table and have not come to a conclusion; nonetheless, Spawning does look really promising if we are to extract every ounce of power from a server and utilize its full power. We were questioning if using Apache is like using a "sledgehammer to swat flies".

[Spawning](https://pypi.python.org/pypi/Spawning/) is a [WSGI](https://www.wsgi.org/) server, written using eventlet, which supports multiple processes, multiple threads, non-blocking HTTP io, and automatic graceful upgrading of code. Eventlet is a networking library written using coroutines instead of normal subroutes, which makes writing networked non-blocking IO applications much much simpler.

Spawning will scale to a large number of keep-alive connections easily. However, it also delegates requests using other forms of multiprocessing and is configurable to be useful in a wide variety of situations. It supports multiple Python processes as well as a threadpool.

According to [Donovan Preston](https://ulaluma.com/pyx/), the man behind Spawning, there are lots of advantages of using a server like Spawning -- one of the most obvious being its ability to do "complete graceful code reloading". With the latest release, Spawning can easily run [Django](https://www.djangoproject.com/) apps too. Download Donovan's [Eventlets/Spawning Presentation](https://soundfarmer.com/content/slides/coroutines-nonblocking-io-eventlet-spawning/coros,%20nonblocking%20i:o,%20eventlet,%20spawning.pdf) (PDF).

Eric Florenzano have [more details](https://www.eflorenzano.com/blog/post/spawning-django/) on Installation, usage etc. Read the comments for installation on different platforms.
