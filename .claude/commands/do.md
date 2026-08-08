---
description: Work the ## DO queue in CLAUDE.local.md, bottom-up
---

Read `CLAUDE.local.md` at the repo root and work its **`## DO`** section.

- **An item may be a `- ` bullet, a bare sentence or a paragraph.** All count; one paragraph
  is one item. He types straight into this file, so do not make him remember a bullet and do
  not rewrite what he wrote into a list.
- **A bare `-` alone on a line is his typing slot, not work.** Skip it, never tick it, and
  leave one at the top of `## DO` when you are done.
- Take the **BOTTOM-MOST** open item first and work upward — bottom-most meaning the last
  line or paragraph that is neither blank nor the bare `-`. Position is Brajeshwar's
  instruction: he stacks new work at the top, so the bottom is the oldest ask, and an item
  dropped part-way down is one he wants pulled forward.
- **Ignore `## MAYBE / LATER / ICEBOX` entirely.** Those are not instructions.
- One item at a time. Finish it — built, verified, committed — before starting the next.
- Do not reorder, reword or delete his lines.
- **Do not push.** Guardrail 7 is unchanged: commit, report, wait to be asked.

As each item is finished, mark it in place as `- [x] [HH:MM] <his original text, unchanged>`
using 24-hour local time, then move the line under today's `- YYYY-MM-DD` root item in
`## DONE`, newest date first. Create today's date item if it does not exist. If an item is
abandoned rather than finished, strike it through with a one-line reason instead of deleting
it.

A prose item becomes a list item only when it moves to `## DONE`, which is a log and wants one
shape. `## DO` is an inbox and does not.

If `## DO` holds nothing but the bare `-` and blank lines, it is empty: say so and stop — do
not go looking for work elsewhere.
