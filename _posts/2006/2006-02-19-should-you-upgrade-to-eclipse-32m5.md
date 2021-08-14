---
layout: post
title: Should you upgrade to Eclipse 3.2M5?
---

[Eclipse Grand Challenge](http://www.eclipsezone.com/eclipse/forums/t20738.html) cuts the memory footprint in half with the upcoming 3.2M5 Eclipse SDK milestone.

JAR files are now read more selectively, and thus interesting portions remain in the cache longer without consuming lots of memory. User editing experience is thus significantly improved on large workspaces containing big JARs. As a consequence, our experiments show that the memory requirement for developing Eclipse in Eclipse can be lowered to 128MB only (i.e. passing -Xmx128m to the VM) as opposed to 256MB as currently specified in the eclipse.ini file.