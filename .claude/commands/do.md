---
description: Work the ## DO queue in CLAUDE.local.md, bottom-up
---

Read `CLAUDE.local.md` at the repo root and work its **`## DO`** section.

- Take the **BOTTOM-MOST** open item first and work upward. Position is Brajeshwar's
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

If the `## DO` section is empty, say so and stop — do not go looking for work elsewhere.
