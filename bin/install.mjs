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
const SKILL_NAME = "brag-document";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const has = (name) => args.includes(name);
const scopeFlag = flag("--scope") || (has("--project") ? "project" : has("--global") ? "global" : null);
const toolFlag = flag("--tool");

const HOME = homedir();
const CWD = process.cwd();

const BEGIN = `<!-- BEGIN ${SKILL_NAME} skill -->`;
const END = `<!-- END ${SKILL_NAME} skill -->`;

const TARGETS = {
  "claude-code": {
    label: "Claude Code",
    mode: "folder",
    global: () => join(HOME, ".claude", "skills", SKILL_NAME, "SKILL.md"),
    project: () => join(CWD, ".claude", "skills", SKILL_NAME, "SKILL.md"),
    detect: () => existsSync(join(HOME, ".claude")),
  },
  cursor: {
    label: "Cursor",
    mode: "folder",
    global: () => join(HOME, ".cursor", "skills-cursor", SKILL_NAME, "SKILL.md"),
    project: () => join(CWD, ".cursor", "skills-cursor", SKILL_NAME, "SKILL.md"),
    detect: () => existsSync(join(HOME, ".cursor")),
  },
  codex: {
    label: "Codex CLI",
    mode: "folder",
    global: () => join(HOME, ".codex", "skills", SKILL_NAME, "SKILL.md"),
    project: () => join(CWD, ".codex", "skills", SKILL_NAME, "SKILL.md"),
    detect: () => existsSync(join(HOME, ".codex")),
  },
  gemini: {
    label: "Gemini CLI",
    mode: "append",
    global: () => join(HOME, ".gemini", "GEMINI.md"),
    project: () => join(CWD, "GEMINI.md"),
    detect: () => existsSync(join(HOME, ".gemini")),
  },
  antigravity: {
    label: "Antigravity (Gemini)",
    mode: "append",
    global: () => join(HOME, ".gemini", "GEMINI.md"),
    project: () => join(CWD, "GEMINI.md"),
    detect: () => existsSync(join(HOME, ".antigravity")) || existsSync(join(HOME, ".gemini", "antigravity")),
  },
  windsurf: {
    label: "Windsurf",
    mode: "append",
    global: () => join(HOME, ".codeium", "windsurf", "memories", "global_rules.md"),
    project: () => join(CWD, ".windsurfrules"),
    detect: () => existsSync(join(HOME, ".codeium", "windsurf")) || existsSync(join(HOME, ".windsurf")),
  },
  copilot: {
    label: "GitHub Copilot",
    mode: "append",
    global: null,
    project: () => join(CWD, ".github", "copilot-instructions.md"),
    detect: () => existsSync(join(HOME, ".copilot")),
  },
  goose: {
    label: "Goose (Block)",
    mode: "append",
    global: () => join(HOME, ".config", "goose", ".goosehints"),
    project: () => join(CWD, ".goosehints"),
    detect: () => existsSync(join(HOME, ".config", "goose")),
  },
};

const TOOL_KEYS = Object.keys(TARGETS);

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

function appendBlock(src) {
  const { meta, body } = parseFrontmatter(src);
  return `${BEGIN}
# ${meta.name || SKILL_NAME}

> ${meta.description || ""}

${body}
${END}`;
}

async function pickTool() {
  if (toolFlag) return toolFlag.split(",").map((s) => s.trim());
  const rl = createInterface({ input, output });
  const lines = TOOL_KEYS.map((k, i) => {
    const mark = TARGETS[k].detect() ? " (detected)" : "";
    return `  [${i + 1}] ${TARGETS[k].label}${mark}`;
  });
  const ans = await rl.question(
    `Which tool?\n${lines.join("\n")}\n  [a] All detected\n  [A] All known\nChoice: `
  );
  rl.close();
  const choice = ans.trim();
  if (choice === "a") return TOOL_KEYS.filter((k) => TARGETS[k].detect());
  if (choice === "A") return TOOL_KEYS;
  const idx = parseInt(choice, 10);
  if (idx >= 1 && idx <= TOOL_KEYS.length) return [TOOL_KEYS[idx - 1]];
  if (TOOL_KEYS.includes(choice)) return [choice];
  console.error(`Invalid choice: ${choice}`);
  process.exit(1);
}

async function pickScope() {
  if (scopeFlag) return scopeFlag;
  const rl = createInterface({ input, output });
  const ans = await rl.question("Install [g]lobal (default) or [p]roject? ");
  rl.close();
  return ans.trim().toLowerCase().startsWith("p") ? "project" : "global";
}

function installFolder(target, scope, src) {
  const dest = target[scope]();
  if (!dest) {
    console.log(`${target.label}: no ${scope} install path — skipping.`);
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, src);
  console.log(`Installed ${SKILL_NAME} (${target.label}, ${scope}) → ${dest}`);
}

function installAppend(target, scope, src) {
  const dest = target[scope]();
  if (!dest) {
    console.log(`${target.label}: no ${scope} install path — skipping.`);
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  const block = appendBlock(src);
  const existing = existsSync(dest) ? readFileSync(dest, "utf8") : "";
  const beginIdx = existing.indexOf(BEGIN);
  const endIdx = existing.indexOf(END);
  let updated;
  if (beginIdx >= 0 && endIdx > beginIdx) {
    updated = existing.slice(0, beginIdx) + block + existing.slice(endIdx + END.length);
    console.log(`Updated ${SKILL_NAME} block in ${dest}`);
  } else {
    updated = (existing ? existing.trimEnd() + "\n\n" : "") + block + "\n";
    console.log(`Appended ${SKILL_NAME} block to ${dest}`);
  }
  writeFileSync(dest, updated);
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`SKILL.md not found at ${SRC}`);
    process.exit(1);
  }
  const tools = await pickTool();
  const scope = await pickScope();
  const src = readFileSync(SRC, "utf8");

  for (const t of tools) {
    const target = TARGETS[t];
    if (!target) {
      console.error(`Unknown tool: ${t}. Skipping.`);
      continue;
    }
    if (target.mode === "folder") installFolder(target, scope, src);
    else installAppend(target, scope, src);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
