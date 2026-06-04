# brag-document

A reusable **brag document** skill — a running record of your accomplishments used for performance reviews, promotions, and self-reflection. Works in every major agentic coding tool.

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

## Install (any tool)

```bash
npx brag-document-skill
```

You'll be shown a menu of every supported tool, marked `(detected)` if found on your machine. Pick one, `a` for all detected, or `A` for all known.

Skip the prompt with flags:

```bash
npx brag-document-skill --tool claude-code              --scope global
npx brag-document-skill --tool cursor                   --scope project
npx brag-document-skill --tool claude-code,cursor,codex --scope global
```

## Supported tools

| Tool                  | Install mode     | Global location                                              | Project location                              |
|-----------------------|------------------|--------------------------------------------------------------|-----------------------------------------------|
| Claude Code           | Native skill     | `~/.claude/skills/brag-document/SKILL.md`                    | `.claude/skills/brag-document/SKILL.md`       |
| Cursor                | Native skill     | `~/.cursor/skills-cursor/brag-document/SKILL.md`             | `.cursor/skills-cursor/brag-document/SKILL.md`|
| Codex CLI             | Native skill     | `~/.codex/skills/brag-document/SKILL.md`                     | `.codex/skills/brag-document/SKILL.md`        |
| Gemini CLI            | Appended block   | `~/.gemini/GEMINI.md`                                        | `./GEMINI.md`                                 |
| Antigravity (Google)  | Appended block   | `~/.gemini/GEMINI.md` (same as Gemini)                       | `./GEMINI.md`                                 |
| Windsurf              | Appended block   | `~/.codeium/windsurf/memories/global_rules.md`               | `./.windsurfrules`                            |
| GitHub Copilot        | Appended block   | *(global not supported — IDE-config based)*                  | `.github/copilot-instructions.md`             |
| Goose (Block)         | Appended block   | `~/.config/goose/.goosehints`                                | `./.goosehints`                               |

Appended blocks are wrapped in `<!-- BEGIN brag-document skill -->` / `<!-- END brag-document skill -->` markers — re-running the installer replaces the block cleanly, no duplicates.

## Install (Claude Code plugin alternative)

If you'd rather install as a Claude Code plugin (manageable via `/plugin`):

```
/plugin marketplace add sdshah09/brag-document-skill
/plugin install brag-document
```

## License

MIT
