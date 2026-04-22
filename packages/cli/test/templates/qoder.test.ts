import { describe, expect, it } from "vitest";
import {
  getAllCommands,
  getAllHooks,
  getAllSkills,
  getSettingsTemplate,
} from "../../src/templates/qoder/index.js";

// =============================================================================
// getAllCommands — reads command templates from filesystem
// =============================================================================

const EXPECTED_COMMAND_NAMES = [
  "before-dev",
  "brainstorm",
  "break-loop",
  "check",
  "check-cross-layer",
  "check-testcase",
  "compound",
  "create-command",
  "executing-plans",
  "finish-work",
  "impact",
  "init-plan",
  "integrate-skill",
  "onboard",
  "parallel",
  "record-session",
  "research",
  "resume-plan",
  "review",
  "start",
  "subagent-work",
  "update-spec",
  "write-plan",
  "write-testcase",
];

describe("getAllCommands", () => {
  it("returns the expected command set", () => {
    const commands = getAllCommands();
    const names = commands.map((cmd) => cmd.name);
    expect(names).toEqual(EXPECTED_COMMAND_NAMES);
  });

  it("each command has name and content", () => {
    const commands = getAllCommands();
    for (const cmd of commands) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.content.length).toBeGreaterThan(0);
    }
  });

  it("command names do not include .md extension", () => {
    const commands = getAllCommands();
    for (const cmd of commands) {
      expect(cmd.name).not.toContain(".md");
    }
  });
});

// =============================================================================
// getAllHooks — reads hook templates
// =============================================================================

describe("getAllHooks", () => {
  it("each hook has targetPath and content", () => {
    const hooks = getAllHooks();
    for (const hook of hooks) {
      expect(hook.targetPath.startsWith("hooks/")).toBe(true);
      expect(hook.content.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// getAllSkills — reads skill templates
// =============================================================================

const EXPECTED_SKILL_NAMES = [
  "before-dev",
  "brainstorm",
  "break-loop",
  "check",
  "check-cross-layer",
  "check-testcase",
  "compound",
  "create-command",
  "executing-plans",
  "feature-meta",
  "finish-work",
  "impact",
  "init-plan",
  "integrate-skill",
  "onboard",
  "record-session",
  "research",
  "resume-plan",
  "review",
  "start-task",
  "subagent-work",
  "update-spec",
  "write-plan",
  "write-testcase",
];

describe("getAllSkills", () => {
  it("returns the expected skill set", () => {
    const skills = getAllSkills();
    const names = skills.map((s) => s.name);
    expect(names).toEqual(EXPECTED_SKILL_NAMES);
  });

  it("each skill has non-empty content", () => {
    const skills = getAllSkills();
    for (const skill of skills) {
      expect(skill.name.length).toBeGreaterThan(0);
      expect(skill.content.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// getSettingsTemplate — returns settings as HookTemplate
// =============================================================================

describe("getSettingsTemplate", () => {
  it("returns correct shape with valid JSON", () => {
    const result = getSettingsTemplate();
    expect(result.targetPath).toBe("settings.json");
    expect(result.content.length).toBeGreaterThan(0);
    expect(() => JSON.parse(result.content)).not.toThrow();
  });

  it("uses Qoder hooks events (UserPromptSubmit, PreToolUse, Stop)", () => {
    const result = getSettingsTemplate();
    const settings = JSON.parse(result.content);
    expect(settings.hooks).toBeDefined();
    expect(settings.hooks.UserPromptSubmit).toBeDefined();
    expect(settings.hooks.PreToolUse).toBeDefined();
    expect(settings.hooks.Stop).toBeDefined();
  });

  it("references .qoder paths (not .codebuddy)", () => {
    const result = getSettingsTemplate();
    expect(result.content).not.toContain(".codebuddy/");
    expect(result.content).toContain(".qoder/");
  });

  it("uses {{PYTHON_CMD}} placeholder", () => {
    const result = getSettingsTemplate();
    expect(result.content).toContain("{{PYTHON_CMD}}");
  });
});
