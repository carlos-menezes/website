---
title: My sentiment on AI, March 2026
date: 2026-03-07
---

My view on AI has evolved a bit over the past few weeks as I've started using it more in day-to-day development.

I've found it's most useful once most of the work is already done. In greenfield projects, you still have to go through the usual hoops: defining the architecture, understanding the constraints, and building the mental model of the system. AI doesn't really shortcut that phase.

But once the foundations are in place and the context is clear in your head, AI becomes great at small, self-contained tasks: utilities, refactors, or bits of functionality that don't require deep knowledge of the whole system.

So far, the pattern that works best for me is simple. Your mileage may vary:

- Humans design the system and hold the context (and tweak AGENTS.md when needed);
- AI helps fill in the small pieces.

On the other hand, in brownfield projects it can be amazing. I've built a few small Apple Watch apps with essentially zero Swift knowledge: things like a score tracker for my weekend 5-a-side football matches or a rough tennis service speed approximator. They're trivial apps, but AI is surprisingly(?) good at one-shotting contained pieces of functionality and does a good job of following the following prompts.

I'm still not convinced that AI will replace software engineers. The work doesn't disappear, but the parts that used to take hours sometimes take minutes.
