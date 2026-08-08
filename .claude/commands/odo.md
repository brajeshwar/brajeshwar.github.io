---
description: Work the ## DO queue in CLAUDE.local.md, top-down
---

Read `CLAUDE.local.md` at the repo root and work its **`## DO`** section.

**Order — TOP-DOWN.** Take the first open item and work down. The whole section is the work
queue, so there is no need to hunt for the end of it: Brajeshwar keeps adding while Claude
Code is running, and top-down means what he types next does not change what is being worked
on right now. *(This reversed the original bottom-up rule on 2026-08-08, at his word:
"Agree with starting from the top and not bottom up as we already ahve a dedicated '## DO'
section to focus on.")*

**What counts as an item**

- A `- ` bullet, a bare sentence or a paragraph. All count; one paragraph is one item. He
  types straight into this file, so do not make him remember a bullet, and do not rewrite
  what he wrote into a list.
- **Leave `## DO` empty when you finish — a blank line, not a bare `-`.** He writes either a
  list or prose, and a `-` presumes the bullet. Nothing to skip, nothing to tick.

**What to skip**

- **`WIP` on an item means leave it alone.** He is still writing it. Do not start it, do not
  ask about it, do not tick it — step over it and take the next one down.
- **`WIP` cascades to any nested list beneath it.** A daughter list inherits from its mother:
  if the parent is marked `WIP`, every sub-item under it is `WIP` too, whether or not each
  one says so.
- **Ignore `## MAYBE / LATER / ICEBOX` entirely.** Those are not instructions.

**How to work**

- One item at a time. Finish it — built, verified, committed — before starting the next.
- ⚠️ **DO NOT STOP BETWEEN ITEMS.** Finish one, take the next, keep going until `## DO` is
  empty. Do not report back and wait after each item, and do not ask whether to continue —
  the queue having items in it IS the instruction to work them. *(His words, 2026-08-09:
  "When there are items in '## DO', do it without stopping unless you need to ask me a
  question blocking you.")*
- **The only reason to stop early is a genuinely blocking question** — one where proceeding
  under any assumption would be unsafe or would waste the work if wrong. A judgement call with
  a defensible default is not blocking: make the call, do the work, and say what you chose in
  the report at the end.
- Do not reorder, reword or delete his lines.
- **Do not push.** Guardrail 7 is unchanged: commit, report, wait to be asked.

**As each item is finished**

Mark it in place as `- [x] [HH:MM] <his original text, unchanged>` using 24-hour local time,
then move the line under today's `- YYYY-MM-DD` root item in `## DONE`, newest date first.
Create today's date item if it does not exist. If an item is abandoned rather than finished,
strike it through with a one-line reason instead of deleting it.

A prose item becomes a list item only when it moves to `## DONE`, which is a log and wants one
shape. `## DO` is an inbox and does not.

If `## DO` holds nothing but blank lines and `WIP` items, it is empty for our purposes: say so
and stop — do not go looking for work elsewhere.
