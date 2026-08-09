---
description: Work the queue in CLAUDE.local.md, top-down
---

Read `CLAUDE.local.md` at the repo root and work it.

⚠️ **THE WHOLE FILE IS THE QUEUE.** There are no sections — no `## DO`, no
`## MAYBE / LATER / ICEBOX`, no `## DONE`. Everything below the H1 is work.
*(2026-08-09: "Do away with even the '## DO' as anything in this file is now a do. …
Do away with the whole '## MAYBE / LATER / ICEBOX' thing.")*

The finished-item log lives in **`CLAUDE.local.log.md`**. Do not read it to decide what to do —
it is a record, not an inbox. It moved out because ~1.4k tokens of completed work were being
read into context every session.

**Order — TOP-DOWN.** Take the first open item and work down. He keeps adding while you are
running, and top-down means what he types next does not change what is being worked on right
now. *(Reversed from bottom-up on 2026-08-08, at his word.)*

**What counts as an item**

- A `- ` bullet, a bare sentence or a paragraph. All count; one paragraph is one item. He types
  straight into this file, so do not make him remember a bullet, and do not rewrite what he
  wrote into a list.
- **Leave the file as its H1 plus THREE blank lines when the queue is empty** — his cursor lands
  on the middle one, with a line of air above and below. Exactly this:

  ```
  # brajeshwar.com (CLAUDE.Local)



  ```

**What to skip**

- ⚠️ **`WIP` AT THE START OF A LINE means leave it alone.** He is still writing it. Do not start
  it, do not ask about it, do not tick it — step over it and take the next one down.
  *(2026-08-09: "If I'm in a `WIP`, I will add it in the beginning of the line, anyway.")*
- **`WIP` cascades to anything nested beneath it.** A daughter list inherits from its mother.

**How to work**

- One item at a time. Finish it — built, verified, committed — before starting the next.
- ⚠️ **DO NOT STOP BETWEEN ITEMS.** Finish one, take the next, keep going until the file is
  empty. Do not report back and wait after each item, and do not ask whether to continue — the
  queue having items in it IS the instruction to work them. *(2026-08-09: "When there are items
  in '## DO', do it without stopping unless you need to ask me a question blocking you.")*
- **The only reason to stop early is a genuinely blocking question** — one where proceeding
  under any assumption would be unsafe or would waste the work if wrong. A judgement call with a
  defensible default is not blocking: make the call, do the work, and say what you chose in the
  report at the end.
- Do not reorder, reword or delete his lines.
- **Do not push.** Guardrail 7 is unchanged: commit, report, wait to be asked.

**As each item is finished**

Move it out of `CLAUDE.local.md` and into `CLAUDE.local.log.md` as
`- [x] [HH:MM] <his original text, unchanged>`, using 24-hour local time, under today's
`- YYYY-MM-DD` root item, newest date first. Create today's date item if it does not exist.

A prose item becomes a list item only at this point — the log wants one shape, the inbox does
not. If an item is abandoned rather than finished, strike it through with a one-line reason
instead of deleting it. **Log history, never erase it.**

If the file holds nothing but blank lines and `WIP` items, it is empty for our purposes: say so
and stop — do not go looking for work elsewhere.
