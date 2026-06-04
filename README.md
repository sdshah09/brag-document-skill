# brag-document

A reusable **brag document** skill — a running record of your accomplishments used for performance reviews, promotions, and self-reflection. Works in Claude Code, Cursor, and Codex CLI.

Inspired by Julia Evans' essay *"Get your work recognized: write a brag document."*

## What it does

Triggers when you ask the assistant things like:

- "Help me prep for my review"
- "I can't remember what I did this year"
- "Make the case for my promotion"
- "Summarize my accomplishments"
- "Start a brag document"

It guides you through:

- Building a new brag document from scratch
- Updating an existing one with recent work
- Reconstructing forgotten work from PRs, tickets, design docs, calendars
- Sharpening flat "things I did" into impact statements
- Spotting themes and reflecting on direction
- Preparing to share with a manager or reviewers

## Install (any tool — recommended)

```bash
npx brag-document-skill
```

The installer auto-detects your tool and writes the skill to the right place. Force a target with flags:

```bash
npx brag-document-skill --tool claude-code --scope global
npx brag-document-skill --tool cursor      --scope project
npx brag-document-skill --tool codex       --scope global
```

| Tool        | Where it lands (global)                          | Format                              |
|-------------|--------------------------------------------------|-------------------------------------|
| Claude Code | `~/.claude/skills/brag-document/SKILL.md`        | Native SKILL.md                     |
| Cursor      | `~/.cursor/rules/brag-document.mdc`              | Cursor rule (`.mdc`)                |
| Codex CLI   | `~/.codex/AGENTS.md` (appended if exists)        | AGENTS.md section                   |

`--scope project` writes into the current directory instead (`.claude/`, `.cursor/`, `./AGENTS.md`).

## Install (Claude Code plugin)

If you'd rather install as a Claude Code plugin (auto-updates, manageable via `/plugin`):

```
/plugin marketplace add sdshah09/brag-document-skill
/plugin install brag-document
```

## License

MIT
