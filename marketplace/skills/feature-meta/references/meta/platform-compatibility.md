# Platform Compatibility Reference

Detailed guide on feature feature availability across 10 AI coding platforms.

---

## Overview

feature v0.3.0 supports **10 platforms**. The key differentiator is **hook support** — Claude Code, iFlow, and CodeBuddy have Python hook systems that enable automatic context injection and quality enforcement. Other platforms use commands/skills with manual context loading.

| Platform    | Config Directory              | CLI Flag        | Hooks | Command Format |
| ----------- | ----------------------------- | --------------- | ----- | -------------- |
| Claude Code | `.claude/`                    | (default)       | ✅    | Markdown       |
| iFlow       | `.iflow/`                     | `--iflow`       | ✅    | Markdown       |
| CodeBuddy   | `.codebuddy/`                 | `--codebuddy`   | ✅    | Markdown       |
| Cursor      | `.cursor/`                    | `--cursor`      | ❌    | Markdown       |
| OpenCode    | `.opencode/`                  | `--opencode`    | ❌    | Markdown       |
| Codex       | `.agents/skills/`             | `--codex`       | ❌    | Skills         |
| Kilo        | `.kilocode/commands/feature/` | `--kilo`        | ❌    | Markdown       |
| Kiro        | `.kiro/skills/`               | `--kiro`        | ❌    | Skills         |
| Gemini CLI  | `.gemini/commands/feature/`   | `--gemini`      | ❌    | TOML           |
| Antigravity | `.agent/workflows/`           | `--antigravity` | ❌    | Markdown       |
| Qoder       | `.qoder/skills/`              | `--qoder`       | ❌    | Skills         |

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         feature FEATURE LAYERS                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    LAYER 3: AUTOMATION                              │ │
│  │  Hooks, Ralph Loop, Auto-injection, Multi-Session                  │ │
│  │  ─────────────────────────────────────────────────────────────────│ │
│  │  Platform: Claude Code + iFlow + CodeBuddy                          │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│  ┌────────────────────────────────▼───────────────────────────────────┐ │
│  │                    LAYER 2: AGENTS                                  │ │
│  │  Agent definitions, Task tool, Subagent invocation                 │ │
│  │  ─────────────────────────────────────────────────────────────────│ │
│  │  Platform: Claude Code + iFlow + CodeBuddy (full), others (manual)             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│  ┌────────────────────────────────▼───────────────────────────────────┐ │
│  │                    LAYER 1: PERSISTENCE                             │ │
│  │  Workspace, Tasks, Specs, Commands/Skills, JSONL files             │ │
│  │  ─────────────────────────────────────────────────────────────────│ │
│  │  Platform: ALL 10 (file-based, portable)                           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Feature Breakdown

### Layer 1: Persistence (All 10 Platforms)

These features work on all platforms because they're file-based.

| Feature            | Location                 | Description                               |
| ------------------ | ------------------------ | ----------------------------------------- |
| Workspace system   | `.feature/workspace/`    | Journals, session history                 |
| Task system        | `.feature/tasks/`        | Task tracking, requirements               |
| Spec system        | `.feature/spec/`         | Coding guidelines                         |
| Commands/Skills    | Platform-specific dirs   | Command prompts in each platform's format |
| JSONL context      | `*.jsonl` in task dirs   | Context file lists                        |
| Developer identity | `.feature/.developer`    | Who is working                            |
| Current task       | `.feature/.current-task` | Active task pointer                       |

### Layer 2: Agents (Claude Code + iFlow + CodeBuddy Full, Others Manual)

| Feature            | Claude Code / iFlow / CodeBuddy   | Other Platforms           |
| ------------------ | -------------------------------- | ------------------------- |
| Agent definitions  | Auto-loaded via `--agent` flag   | Read agent files manually |
| Task tool          | Full subagent support            | No Task tool              |
| Context injection  | Automatic via hooks              | Manual copy-paste         |
| Agent restrictions | Enforced by definition           | Honor code only           |

### Layer 3: Automation (Claude Code + iFlow + CodeBuddy Only)

| Feature                | Dependency         | Why Hook-Platforms Only          |
| ---------------------- | ------------------ | -------------------------------- |
| SessionStart hook      | `settings.json`    | Hook system for lifecycle events |
| PreToolUse hook        | Hook system        | Intercepts tool calls            |
| SubagentStop hook      | Hook system        | Controls agent lifecycle         |
| Auto context injection | PreToolUse:Task    | Hooks inject JSONL content       |
| Ralph Loop             | SubagentStop:check | Blocks agent until verify passes |
| Multi-Session          | CLI + hooks        | Session resume, worktree scripts |

**No workaround**: These features fundamentally require a hook system.

---

## Platform Usage Guides

### Claude Code + iFlow + CodeBuddy (Full Support)

All features work automatically. Hooks provide context injection and quality enforcement.

```bash
# Initialize
feature init -u your-name           # Claude Code (default)
feature init --iflow -u your-name   # iFlow
feature init --codebuddy -u your-name # CodeBuddy
```

### Cursor

```bash
feature init --cursor -u your-name
```

- **Works**: Workspace, tasks, specs, commands (read via `.cursor/commands/feature-*.md`)
- **Doesn't work**: Hooks, auto-injection, Ralph Loop, Multi-Session
- **Workaround**: Manually read spec files at session start

### OpenCode

```bash
feature init --opencode -u your-name
```

- **Works**: Workspace, tasks, specs, agents, commands
- **Note**: Full subagent context injection requires [oh-my-opencode](https://github.com/nicepkg/oh-my-opencode). Without it, agents use Self-Loading fallback.

### Codex

```bash
feature init --codex -u your-name
```

- Commands mapped to Codex Skills format under `.agents/skills/`
- Use `$start`, `$finish-work`, `$brainstorm` etc. to invoke

### Kilo, Kiro, Gemini CLI, Antigravity

```bash
feature init --kilo -u your-name
feature init --kiro -u your-name
feature init --gemini -u your-name
feature init --antigravity -u your-name
```

- Each platform uses its native command format
- Core file-based systems work the same across all platforms

---

## Version Compatibility Matrix

| feature Version | Platforms Supported |
| --------------- | ------------------- |
| 0.2.x           | Claude Code, Cursor |
| 0.3.0           | All 9 platforms     |

---

## Checking Your Platform

### Claude Code

```bash
claude --version
cat .claude/settings.json | grep -A 5 '"hooks"'
```

### Other Platforms

```bash
# Check if platform config directory exists
ls -la .cursor/ .opencode/ .iflow/ .agents/ .kilocode/ .kiro/ .gemini/ .agent/ 2>/dev/null
```

### Determining Support Level

```
Does the platform have hook support?
├── YES (Claude Code, iFlow, CodeBuddy) → Full feature support
└── NO  (all others) → Partial support
         ├── Can read files → Layer 1 works
         └── Has agent system → Layer 2 partial
```
