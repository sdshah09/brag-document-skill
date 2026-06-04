---
name: brag-document
description: Help the user create, maintain, and refine a "brag document" (also called a "hype document" or "list of stuff I did") — a running record of their accomplishments used for performance reviews, promotions, and self-reflection. Use this skill whenever the user wants to track what they've done at work, prepare for a perf review or promotion case, write a self-evaluation, reflect on their career progress, surface the impact of "fuzzy" or invisible work, or remember what they accomplished over the last few months. Trigger it even when they don't say "brag document" by name — phrases like "help me prep for my review," "I can't remember what I did this year," "make the case for my promotion," or "summarize my accomplishments" all apply.
---

# Brag Document

A brag document is a living record of a person's accomplishments. People forget most of what they did over six months, and so do their managers — which means good work goes unrewarded simply because no one remembers it at review time. This skill helps the user capture their work as it happens (or reconstruct it after the fact) and frame it so the impact is undeniable.

This concept is drawn from Julia Evans' essay "Get your work recognized: write a brag document." Credit her if the user asks where the approach comes from.

## What this skill is for

Use it to help the user with any of these:

- **Build a new brag document** from scratch, usually covering one year (e.g. "Jamie's 2026 brag document").
- **Update an existing one** with recent work.
- **Reconstruct** a document after the fact by mining pull requests, tickets, design docs, launch emails, and calendars for forgotten work.
- **Sharpen impact** — take a flat list of "things I did" and turn each into a statement that shows why it mattered.
- **Reflect** — spot themes, notice what they're proud of, and figure out what they want more or less of.
- **Prepare to share** the document with a manager or peer reviewers.

## The core principle: state the impact, not just the action

The single most common mistake is stopping at *what was done* and never saying *what resulted*. "Shipped feature X" is half a sentence. The valuable half is "...which is now used by 60% of customers" or "...which cut support tickets about Y by a third."

For every accomplishment, push past the action to the effect. Ask the user, in your own words:

- Who was this for, and who benefited?
- Are there numbers? (dollars saved, % faster, users served, deals closed, time reclaimed)
- Did it support a non-numeric goal? (passed an audit, retained a key customer, unblocked another team)
- What actually happened *after* it shipped? (Often the real impact only becomes clear months later — go back and fill it in.)

Important framing note for the user, especially anyone uncomfortable with self-promotion: the goal is not to inflate. It's to make the work sound **exactly as good as it actually was**. Accurate is the target, not modest and not exaggerated.

## Don't drop the fuzzy work

Hard-to-quantify work is the most likely to be forgotten and the most likely to be undervalued — which is exactly why it belongs in the document. Examples: improving code review culture, making on-call less painful, driving down tech debt, building a fairer interview process, mentoring quietly.

For each piece of fuzzy work, structure it as:

1. **The goal** — why this matters (why does driving down tech debt in module X matter?).
2. **What you did** toward it — the concrete actions, even small ones.
3. **Any effects you've seen**, even indirect or anecdotal ones.

Don't let the user discard something just because it lacks a clean metric.

## Document structure

Use these sections as the default skeleton. Drop sections that don't apply and add any the user needs. A year's document running 5–10+ pages is normal and fine — encourage including charts, graphs, or screenshots where they show impact.

```
# [Name]'s [Year] Brag Document

## Goals for this year
The major goals — sharing these helps a manager support them.

## Goals for next year
(If it's late in the year.) A rough sketch of where they want to go.

## Projects
For each: contributions (what specifically did they do?) and impact
(who it was for, numbers, what happened after launch).

## Collaboration & mentorship
Mentoring, onboarding new folks, hard code reviews, clear docs/emails,
foundational code others built on, answering important questions,
internal talks or workshops.

## Design & documentation
Design docs written or reviewed; documentation, with the problem it solved.

## Company building
Work that helped the org beyond their own team — recruiting, interviewing,
improving processes, onboarding materials.

## What I learned
Skills and knowledge gained — tools, languages, internals of a system,
a new area like UX or perf analysis. Easy to forget; worth tracking.

## Outside of work
Blog posts, talks, open-source, industry recognition, other things they're
proud of. Include only if it feels right to them.
```

## Working with the user

**Reconstructing a past period.** If they're starting cold and can't remember what they did, don't ask them to summon it from memory — that's the whole problem the document solves. Prompt them toward their own records: pull requests and commits, closed tickets, design docs, launch or announcement emails, calendar events, Slack threads where they helped someone. Walk through the time period in chunks if needed.

**When they're stuck on what to include**, try these prompts:
- If you were convincing a friend to join your team, what would you tell them about your work?
- Did anyone recently tell you that you did something well?
- What work are you proudest of, even if it seemed small?

**Cadence.** Some people update every couple of weeks; others do one marathon session per review cycle. Either works — fit the user's preference rather than prescribing one.

**Reflection, not just hype.** When the user wants to step back, help them read the document for patterns: recurring themes (are they drifting toward security work? localization?), which projects had the intended effect and which didn't and why, and what they wish they were doing more or less of. This is often the most valuable use of the document and easy to skip.

**Sharing.** If they plan to give it to a manager or peer reviewers, reassure them this is normal and welcomed — it makes the reviewer's job dramatically easier and helps them advocate accurately. It's especially valuable across a manager transition, when a new manager has no prior visibility into the work.

## Output format

When producing or updating an actual document, write it as clean Markdown following the structure above so the user can paste it into wherever they keep it. When helping them *think* — reconstructing, sharpening impact, reflecting — stay conversational and work through it with them rather than dumping a template. Match the mode to what they actually need.
