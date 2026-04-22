import { describe, expect, it } from "vitest";
import {
  getAllCommands,
  getAllAgents,
  getAllHooks,
  getSettingsTemplate,
} from "../../src/templates/codebuddy/index.js";

// =============================================================================
// getAllCommands ！ reads command templates from filesystem
// =============================================================================

describe("getAllCommands", () => {
  it("returns a non-empty array", () => {
    const commands = getAllCommands();
    expect(commands.length).toBeGreaterThan(0);
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
// getAllAgents ！ reads agent templates
// =============================================================================

describe("getAllAgents", () => {
  it("returns a non-empty array", () => {
    const agents = getAllAgents();
    expect(agents.length).toBeGreaterThan(0);
  });

  it("each agent has name and content", () => {
    const agents = getAllAgents();
    for (const agent of agents) {
      expect(agent.name.length).toBeGreaterThan(0);
      expect(agent.content.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// getAllHooks ！ reads hook templates
// =============================================================================

describe("getAllHooks", () => {
  it("returns a non-empty array", () => {
    const hooks = getAllHooks();
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("each hook has targetPath and content", () => {
    const hooks = getAllHooks();
    for (const hook of hooks) {
      expect(hook.targetPath.startsWith("hooks/")).toBe(true);
      expect(hook.content.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// getSettingsTemplate ！ returns settings as HookTemplate
// =============================================================================

describe("getSettingsTemplate", () => {
  it("returns correct shape with valid JSON", () => {
    const result = getSettingsTemplate();
    expect(result.targetPath).toBe("settings.json");
    expect(result.content.length).toBeGreaterThan(0);
    expect(() => JSON.parse(result.content)).not.toThrow();
  });

  it("settings contains {{PYTHON_CMD}} placeholder", () => {
    const result = getSettingsTemplate();
    expect(result.content).toContain("{{PYTHON_CMD}}");
  });
});
