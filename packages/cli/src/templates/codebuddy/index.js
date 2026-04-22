/**
 * CodeBuddy templates
 *
 * These are GENERIC templates for user projects.
 * Do NOT use feature project's own .codebuddy/ directory (which may be customized).
 *
 * Directory structure:
 *   codebuddy/
 *   ??? commands/       # Slash commands
 *   ??? agents/         # Agent definitions
 *   ??? hooks/          # Python hook scripts
 *   ??? skills/         # Skill definitions
 *   ??? settings.json   # Settings configuration (with {{PYTHON_CMD}} placeholder)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function readTemplate(relativePath) {
    return readFileSync(join(__dirname, relativePath), "utf-8");
}
function listFiles(dir) {
    try {
        return readdirSync(join(__dirname, dir));
    }
    catch {
        return [];
    }
}
// Settings template (contains {{PYTHON_CMD}} placeholder for cross-platform compatibility)
const settingsTemplate = readTemplate("settings.json");
/**
 * Get all command templates from commands/feature/ directory
 * Commands use feature prefix in filename (e.g., start.md ? /feature:start)
 */
export function getAllCommands() {
    const commands = [];
    const files = listFiles("commands/feature");
    for (const file of files) {
        if (file.endsWith(".md")) {
            const name = file.replace(".md", "");
            const content = readTemplate(`commands/feature/${file}`);
            commands.push({ name, content });
        }
    }
    return commands;
}
/**
 * Get all agent templates
 */
export function getAllAgents() {
    const agents = [];
    const files = listFiles("agents");
    for (const file of files) {
        if (file.endsWith(".md")) {
            const name = file.replace(".md", "");
            const content = readTemplate(`agents/${file}`);
            agents.push({ name, content });
        }
    }
    return agents;
}
/**
 * Get all hook templates
 * Hooks are in the hooks/ directory and map to .codebuddy/ subdirectories
 */
export function getAllHooks() {
    const hooks = [];
    const files = listFiles("hooks");
    for (const file of files) {
        // Map hooks to their target paths in .codebuddy/
        const targetPath = `hooks/${file}`;
        const content = readTemplate(`hooks/${file}`);
        hooks.push({ targetPath, content });
    }
    return hooks;
}
/**
 * Get all skill templates
 */
export function getAllSkills() {
    const skills = [];
    const skillDirs = listFiles("skills");
    for (const skillDir of skillDirs) {
        // Each skill directory contains a SKILL.md file
        const skillPath = join(__dirname, "skills", skillDir);
        const skillFile = join(skillPath, "SKILL.md");
        try {
            const content = readFileSync(skillFile, "utf-8");
            skills.push({ name: skillDir, content });
        }
        catch {
            // Skip if SKILL.md doesn't exist
        }
    }
    return skills;
}
/**
 * Get settings template for CodeBuddy
 * Contains {{PYTHON_CMD}} placeholder that will be resolved by the configurator.
 */
export function getSettingsTemplate() {
    return {
        targetPath: "settings.json",
        content: settingsTemplate,
    };
}
//# sourceMappingURL=index.js.map