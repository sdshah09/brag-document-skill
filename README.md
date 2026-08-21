# brag-document-skill

[![npm](https://img.shields.io/npm/v/brag-document-skill.svg)](https://www.npmjs.com/package/brag-document-skill)
[![license](https://img.shields.io/npm/l/brag-document-skill.svg)](LICENSE)

**An agent skill that helps you remember what you actually did at work, and write it down so it
survives a performance review.**

Six months after you ship something, you will not remember it. Neither will your manager. That is
how good work goes unrewarded — not because it wasn't good, but because at review time nobody can
name it. This skill turns your coding assistant into something that reconstructs that record with
you and then sharpens it into statements a reviewer can act on.

Based on [Get your work recognized: write a brag document](https://jvns.ca/blog/brag-documents/)
by Julia Evans.

Works with Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, Windsurf, GitHub Copilot, and
Goose.

## Install

```sh
npx brag-document-skill
```

You get a menu of every supported tool, with `(detected)` next to the ones already on your
machine. Pick one, `a` for all detected, or `A` for all known.

Skip the prompt with flags:

```sh
npx brag-document-skill --tool claude-code              --scope global
npx brag-document-skill --tool cursor                   --scope project
npx brag-document-skill --tool claude-code,cursor,codex --scope global
```

Then just talk to your agent normally. It triggers on things like *"help me prep for my review"*,
*"I can't remember what I did this year"*, *"make the case for my promotion"*, or *"summarize my
accomplishments"* — you don't have to say "brag document" by name.

## Why this one

Plenty of prompts will hand you a brag-document template. The template is the easy part; you can
write the headings yourself in a minute. The three things that actually make the document hard are
the three things this skill is built around:

1. **You can't remember.** Asking someone to recall a year of work from memory is asking them to
   solve the exact problem the document exists to solve. So the skill doesn't ask. It walks you
   through your own records — merged PRs, closed tickets, design docs, launch emails, calendar
   entries, Slack threads where you unblocked someone — a quarter at a time.
2. **You stop at the action.** "Shipped the billing migration" is half a sentence. The half that
   matters is what happened afterward. The skill pushes every entry past *what you did* to *what
   resulted*, and asks for the number when a number exists.
3. **You drop the fuzzy work.** Making on-call less painful, fixing the interview loop, mentoring
   two juniors — the hardest work to quantify is the most likely to be left out and the most
   likely to be undervalued. The skill keeps it in, structured as goal → what you did → effects
   observed, so it reads as substantial even without a metric.

It is explicit that the target is **accurate, not inflated**. The goal is to make the work sound
exactly as good as it actually was — which is a useful framing if self-promotion makes you
uncomfortable.

## What the output looks like

The most common thing it does is take a flat line you wrote and push it until it has an edge.
Ask it to *"sharpen these"* and you get back the question, not just a rewrite:

> **"Shipped the billing migration."**
>
> This tells a reviewer nothing they can weigh. Three questions before we rewrite it:
> - How long was the migration projected to take, and how long did it take?
> - Was there downtime? What did the previous migration of this size cost in downtime?
> - Who was unblocked by it finishing — did another team's roadmap depend on it?
>
> If the answers are "6 weeks projected, 4 actual", "zero downtime vs. 3 hours last time", and
> "the payments team's usage-based pricing work", the entry becomes:
>
> *Led the billing migration off the legacy ledger, delivered in 4 weeks against a 6-week
> estimate with zero customer-facing downtime — the previous migration of comparable size took
> the system down for 3 hours. Completing it in Q2 unblocked the payments team's usage-based
> pricing launch, which had been waiting on the new schema since January.*

And when you ask it to build the document, it produces markdown you can paste straight into
wherever you keep it:

> # Jamie's 2026 Brag Document
>
> ## Projects
>
> ### Webhook delivery rewrite
> **What I did.** Designed and led the replacement of the 60-second cron sweep with a durable
> queue and worker pool. Wrote the design doc, ran the review with the platform team, and
> implemented the worker pool and the backfill path myself.
>
> **Impact.** p99 delivery latency dropped from 94s to 3.2s. Contractual sub-10-second delivery
> went from 12% of events to 99.97%, which closed the compliance gap on the Acme renewal ($240k
> ARR). Support tickets tagged `webhooks-slow` fell from 11 in Q1 to 1 in Q3.
>
> ## Collaboration & mentorship
>
> - Onboarded two engineers to the payments service. Both shipped to production in week two;
>   the previous median for that service was five weeks.
> - Took over the on-call handoff doc after a bad week in February. Rewrote the top ten runbooks
>   around symptoms rather than subsystems. Pages requiring escalation to a second responder
>   went from roughly one in three to one in eight over the following two quarters.
>
> ## What I learned
>
> - Queue semantics in earnest — at-least-once delivery, idempotency keys, and why the outbox
>   pattern is worth the write amplification.
> - Enough Postgres query planning to read an `EXPLAIN ANALYZE` without help, which came out of
>   debugging the sweep before deciding to replace it.

It also works in the other direction. Point it at a document you've been keeping and ask what's
missing, and it reads for patterns — which themes keep recurring, which projects had the effect
you intended and which didn't, and what you'd want more or less of next year. That reflection pass
is usually the most valuable part and the easiest one to skip.

## Where it installs

| Tool | Mode | Global | Project |
|---|---|---|---|
| Claude Code | Native skill | `~/.claude/skills/brag-document/SKILL.md` | `.claude/skills/brag-document/SKILL.md` |
| Cursor | Native skill | `~/.cursor/skills-cursor/brag-document/SKILL.md` | `.cursor/skills-cursor/brag-document/SKILL.md` |
| Codex CLI | Native skill | `~/.codex/skills/brag-document/SKILL.md` | `.codex/skills/brag-document/SKILL.md` |
| Gemini CLI | Appended block | `~/.gemini/GEMINI.md` | `./GEMINI.md` |
| Antigravity | Appended block | `~/.gemini/GEMINI.md` | `./GEMINI.md` |
| Windsurf | Appended block | `~/.codeium/windsurf/memories/global_rules.md` | `./.windsurfrules` |
| GitHub Copilot | Appended block | *(not supported — IDE-config based)* | `.github/copilot-instructions.md` |
| Goose | Appended block | `~/.config/goose/.goosehints` | `./.goosehints` |

Appended blocks are wrapped in `<!-- BEGIN brag-document skill -->` / `<!-- END brag-document
skill -->` markers, so re-running the installer replaces the block instead of duplicating it.

## As a Claude Code plugin

If you'd rather manage it through `/plugin`:

```
/plugin marketplace add sdshah09/brag-document-skill
/plugin install brag-document
```

## Use it without installing

The skill is plain markdown with no code in it. Read
[`skills/brag-document/SKILL.md`](skills/brag-document/SKILL.md) and paste it wherever your tool
takes custom instructions.

## The document structure it uses

Goals for this year, goals for next year, projects (contributions and impact separately),
collaboration & mentorship, design & documentation, company building, what I learned, and outside
of work. Sections that don't apply get dropped rather than padded.

## Related

- [amazon-design-doc](https://github.com/sdshah09/design-doc-agent-skill) — an agent skill that
  makes your assistant write and review software design docs in Amazon's format. Design docs are
  one of the richest sources of forgotten work when you're reconstructing a brag document, and
  the two skills are built to be used together.

## Credit

The approach comes from [Julia Evans' brag document essay](https://jvns.ca/blog/brag-documents/).
This package packages it for coding agents.

## License

MIT
