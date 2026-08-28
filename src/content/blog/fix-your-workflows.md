---
title: "If you can't fix the models you use, fix your workflows"
description: 'Every polish run brought back more issues: 48, then 22 more, then another 10. I traced two sessions back through git history and found the fixes themselves had created almost half of what the next review caught.'
pubDate: 2026-08-28
draft: false
---

It started as a small feature I wanted to implement for
[cuttle](https://github.com/glim-sh/cuttle), a browser for agents. I
spent some time planning it out, and then I thought that I could just
get some Opus agents to implement it, and even if there would be some
major problems, I would just do a few polish runs and it would work.

[polish](https://github.com/tenequm/skills/tree/main/skills/polish) is my
pre-release review skill that hands the diff out to
different review agents, then validates what they find and fixes
everything after my approval. It was the thing I trusted most in my
workflow.

The first round found 48 issues. I approved everything, everything
checked green, and the next round found 22 more. Then I reviewed just
the fixes that were applied, and that's where I found another 10. Each
new polish run was just bringing me back more and more issues, and at
some point it started feeling unbearable. I needed to dig in and figure
out what was wrong.

I don't like doing something based purely on my feeling. I always
prefer to have some data to make decisions on. So I picked two of my
last sessions, the ones where it felt most unbearable and were
freshest, and decided to analyze them, to see what actually happened.
Every issue a later review found got traced back through git history,
to check whether the code existed before review time or was created by
a fix, and whether an agent found it and lost it on the way.

I was confident the issue was with the lack of depth of what the
subagents dig into. It had completely slipped my mind that the fixes
themselves were so leaky. Transcript analysis showed that in reality
everything in the initial report was actually fixed, but the fixes
themselves had created almost half, or more, of the issues that the
next review found.

The most ridiculous case was where each iteration of the reviewing
agents was discovering the same masking issue, and each iteration of
the fix agents was just rewriting the same code without fixing the
actual issue. And that happened three times in a row. Especially when
it was on a pretty critical path: masking the sensitive credentials.

It looks like the problem is the context getting bigger and bigger all
the time, and the model just cannot hold attention on everything that
is going on. It inevitably leads to the moment where it loses track of
important stuff. Without a clear checkpoint, it's just impossible to
expect the model not to forget anything.

What I learned is that no review can be trusted without two core
pillars satisfied. First, there should be a ledger that tracks all of
the issues and is persistent through all of the stages. Second, the
review isn't done until a review of the fixes actually finds no more
fixes left to be covered.

That's when I decided to create
[polish-new](https://github.com/tenequm/skills/tree/main/skills/polish-new),
a new version of my polish skill. It tries to improve on what the
previous version did, with two main additions: a clean file ledger that
gets maintained through all of the stages, and a new fix-review flow
that keeps looping until all of the issues that were identified
actually have the corresponding fixes.

I'm not sure whether my workflows changed or the models changed. But in
any case, the only instrument I have to deal with that is to change my
workflows.
