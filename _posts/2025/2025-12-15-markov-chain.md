# Markov Chain - Russian Math Feud That Now Predicts Your Life

As a normal person, I subscribed to, and love to watch [Veritasium](https://www.veritasium.com) YouTube Videos. Recently, I watched another brilliant video - [The Strange Math That Predicts (Almost) Anything](https://www.youtube.com/watch?v=KZeIEiBrT_w).

In 1905, Russian mathematicians picked sides in a political and philosophical brawl. One camp tried to use probability to defend free will. The other insisted that Math should model the world as it is, not as scripture says. Out of that fight came a simple idea with absurd reach: the next thing often depends mainly on the current thing.

Today, that idea ranks web pages, simulates nukes, powers recommendations, and helps machines guess the next word you’ll type. 

## Two Men, Two Worldviews

[Pavel Nekrasov](https://en.wikipedia.org/wiki/Pavel_Nekrasov), a prominent Moscow academic and devout believer, sought to reconcile probability with theology and free will. His work leaned on independence assumptions where they didn’t belong. [Andrey Markov](https://en.wikipedia.org/wiki/Andrey_Markov), his rival in St. Petersburg, publicly called this out and relentlessly pursued it. Markov argued that dependence can be modeled directly and still perform real probability calculations. That argument led to the development of [Markov chains](https://en.wikipedia.org/wiki/Markov_chain).

## From Poetry to Chains

To prove the point, Markov counted letters in Pushkin’s Eugene Onegin: vowels vs. consonants, then pairs, then longer runs. He demonstrated that the likelihood of the following letter depends on the current one. You don’t need the whole history to make a good prediction; only the present state is necessary.

A Markov chain is just:

- A set of states.
- Probabilities for jumping from one state to the next.
- A “memoryless” rule: the next step depends on “now,” not the entire past.

It’s austere and, in practice, wildly useful.

## Why it Matters Now

### PageRank and the “Random Surfer”

Google’s original [ranking algorithm](https://en.wikipedia.org/wiki/PageRank) envisioned a user clicking links endlessly. Each page is a state. Outbound links are transitions. The probability of ending up on a page after many clicks is a measure of its importance. That’s a Markov chain dressed in web clothes.

### Monte Carlo simulations

After WWII, [Stanisław Ulam](https://en.wikipedia.org/wiki/Stanisław_Ulam) and [John von Neumann](https://en.wikipedia.org/wiki/John_von_Neumann) formalized simulation by random sampling to solve physics problems that were too complex for closed-form math, including neutron transport in bomb design. These simulations often walk through states with transition rules, again, Markov thinking.

#### Shuffling cards

How many riffle shuffles randomize a deck? Bayer and Diaconis showed “about seven” in the standard model. The proof machinery runs through Markov-chain mixing.

### Next-word prediction

Veritasium’s video uses “predicting the next word” as an intuitive hook. Classical Markov text models do precisely that with short memory. Modern [large language models](https://en.wikipedia.org/wiki/Large_language_model) also perform next-token prediction, but they are **NOT** Markov chains; instead, they condition on long context via neural networks. The rhyme is conceptual, involving sequences and transition probabilities, rather than mechanical.

## The Core Ideas are;

1. **State**: Your current situation.
2. **Transition**: Probabilities of where you land next.
3. **Stationary distribution**: Where the system spends its time in the long run.
4. **Mixing time**: How fast you forget where you started.

That quartet explains why a simple model can be so powerful: many complex systems forget their past quickly and behave predictably once mixed.

## So…

1. Model the **present state** cleanly. Many systems don’t need the whole history to be forecastable.
2. Know your **mixing**: if your process forgets its past fast, you can make bold predictions with compact data.
3. Watch for **hidden dependence**. Nekrasov assumed independence where it didn’t exist; that mistake still burns dashboards today.
4. Separate **concept from implementation**. PageRank and [Monte Carlo](https://en.wikipedia.org/wiki/Monte_Carlo_method) are fundamentally Markovian. LLMs are sequence predictors too, but with long-range memory. Don’t conflate the family resemblance with identity.

<iframe width="100%" height="auto" src="https://www.youtube.com/embed/KZeIEiBrT_w?si=WUPoQRkrwpHwJpZq" title="Markov Chain" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>