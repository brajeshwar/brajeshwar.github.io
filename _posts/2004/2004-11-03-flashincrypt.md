---
layout: post
title: FlashInCrypt
---

A very cool tool was found recently and it went away with a thumbs up on all tested counts. Even [ASV](http://buraks.com/asv/) and [Flasm](http://flasm.sourceforge.net/) were left bewildered and they cannot open the file obfuscated with FlashInCrypt. No obfuscater was able to escape ASV or Flasm before but this one is proving to be a must-have, real obfuscater.

But then, there was one worry before we embark on the test, "What if it could not read and interact with the external configuration xml file" that usually happen on all projects here. Fortunately, the swfs obfuscated with FlashInCrypt was able to work very well with the external config xml. So, it proved successful in this scenario too where the internal ActionScript interact with the external raw config data (settings, defaults).

In our lab tests, we were  unable to see the source code in any format, probably once ASV comes out with a patch/fix to account for this obfuscation then things might be different (Burak should stand up a bit and take notice of this!). Flasm was confused by this obfuscater, so there isn't any means of see the DMM (Dynamic Memory Modification) in action. Well, the best bet here is that, it might be doing some code wrapping to confuse ASV.

A minor hiccup with the app was their English on the Dialogs, Confirmations, etcetera. On the overall, this is a real cool tool at such cheap rate.
