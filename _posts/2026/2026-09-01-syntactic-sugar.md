# Syntactic Sugar

[Peter Landin](https://en.wikipedia.org/wiki/Peter_J._Landin) coined the term [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) in 1964, in the paper, “The Mechanical Evaluation of Expressions.”[^landin]

In the world of programming languages, `a[i]` is sugar for `*(a + i)`. A `for` loop is sugar over a jump and a counter. A class in JavaScript is sugar over prototypes. `async` and `await` are sugar over a state machine someone used to write by hand. In every case a compiler will show you the expansion which we do not have to look into. It makes life easier for all of us.

We’re now in world where AI commoditizes knowledge, nearly everything above the machine has turned into syntactic sugar, and we are left with having to get down to first principles. However, we need to be careful with it, because “just sugar” is the same dismissal people aim at design when they mean decoration. Syntax is a user interface for thought. [Ken Iverson](https://en.wikipedia.org/wiki/Kenneth_E._Iverson) built a [Turing Award](https://en.wikipedia.org/wiki/Turing_Award) lecture around that in 1979, calling notation a tool of thought. Sugar is the part made for humans.

[English](/2025/english/) is, perhaps, now the top layer of syntax, and it is the first one in sixty years with no mechanical *de-sugar-ing*. There is no compiler to read, no guarantee, nothing to check the sweetness against except your own understanding of what should have come out.

**Syntactic salt** is a construct that makes bad code harder to write. **Syntactic saccharin** is sweetness with nothing underneath. Well, nuch of the generated code that we read is saccharin. It runs, it looks like the real thing, and the variables might as well be [foo and bar](/2025/foo-bar/). Telling the difference means knowing what the thing dissolves into, which is the knowledge everyone assumes is now free.

A local uncle once handed me a broken IBM laptop belonging to a church, and I got it back to a usable state by [reloading a fresh AUTOEXEC.BAT](/2026/childhood-computing/). I did not understand much. I understood one layer below the failure, and that was enough. Now, AI raises the ceiling on what we can produce.

We have always written in sugar and have always made things easier for our successors. The problem is the [cargo cult](/2024/cargo-cult/): fluent in the sweet layer, no way down, trusting an expansion nobody can verify.

[^landin]: P. J. Landin, [The Mechanical Evaluation of Expressions](https://www.cs.cmu.edu/~crary/819-f09/Landin64.pdf), appeared in [The Computer Journal](https://en.wikipedia.org/wiki/The_Computer_Journal), Volume 6, Issue 4, January 1964.