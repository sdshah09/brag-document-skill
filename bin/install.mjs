#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const SRC = join(pkgRoot, "skills", "brag-document", "SKILL.md");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const has = (name) => args.includes(name);

const scopeFlag = flag("--scope") || (has("--project") ? "project" : has("--global") ? "global" : null);
let tool = flag("--tool");

const HOME = homedir();
const CWD = process.cwd();

const TARGETS = {
  "claude-code": {
    label: "Claude Code",
    global: () => join(HOME, ".claude", "skills", "brag-document", "SKILL.md"),
    project: () => join(CWD, ".claude", "skills", "brag-document", "SKILL.md"),
    transform: (src) => src,
  },
  cursor: {
    label: "Cursor",
    global: () => join(HOME, ".cursor", "rules", "brag-document.mdc"),
    project: () => join(CWD, ".cursor", "rules", "brag-document.mdc"),
    transform: toCursorMdc,
  },
  codex: {
    label: "Codex CLI",
    global: () => join(HOME, ".codex", "AGENTS.md"),
    project: () => join(CWD, "AGENTS.md"),
    transform: toAgentsMd,
    appendIfExists: true,
  },
};

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

function toCursorMdc(src) {
  const { meta, body } = parseFrontmatter(src);
  const desc = (meta.description || "").replace(/"/g, '\\"');
  return `---
description: "${desc}"
globs: ["**/*"]
alwaysApply: false
---

${body}`;
}

function toAgentsMd(src) {
  const { meta, body } = parseFrontmatter(src);
  return `# ${meta.name || "brag-document"}

> ${meta.description || ""}

${body}`;
}

async function pickTool() {
  if (tool) return tool;
  if (existsSync(join(HOME, ".claude"))) return "claude-code";
  if (existsSync(join(HOME, ".cursor"))) return "cursor";
  if (existsSync(join(HOME, ".codex"))) return "codex";
  const rl = createInterface({ input, output });
  const ans = await rl.question("Which tool? [1] Claude Code  [2] Cursor  [3] Codex CLI: ");
  rl.close();
  return { 1: "claude-code", 2: "cursor", 3: "codex" }[ans.trim()] || "claude-code";
}

async function pickScope() {
  if (scopeFlag) return scopeFlag;
  const rl = createInterface({ input, output });
  const ans = await rl.question("Install [g]lobal (default) or [p]roject? ");
  rl.close();
  return ans.trim().toLowerCase().startsWith("p") ? "project" : "global";
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`SKILL.md not found at ${SRC}`);
    process.exit(1);
  }
  tool = await pickTool();
  const target = TARGETS[tool];
  if (!target) {
    console.error(`Unknown tool: ${tool}. Use claude-code | cursor | codex.`);
    process.exit(1);
  }
  const scope = await pickScope();
  const dest = target[scope]();
  const src = readFileSync(SRC, "utf8");
  const content = target.transform(src);

  mkdirSync(dirname(dest), { recursive: true });

  if (target.appendIfExists && existsSync(dest)) {
    const existing = readFileSync(dest, "utf8");
    if (existing.includes("# brag-document")) {
      console.log(`brag-document already present in ${dest} — skipping.`);
    } else {
      writeFileSync(dest, existing.trimEnd() + "\n\n" + content);
      console.log(`Appended brag-document to ${dest}`);
    }
  } else {
    writeFileSync(dest, content);
    console.log(`Installed brag-document (${target.label}, ${scope}) → ${dest}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
