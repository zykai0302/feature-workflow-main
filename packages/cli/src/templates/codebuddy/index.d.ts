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
/**
 * Command template with name and content
 */
export interface CommandTemplate {
    name: string;
    content: string;
}
/**
 * Agent template with name and content
 */
export interface AgentTemplate {
    name: string;
    content: string;
}
/**
 * Hook template with target path and content
 */
export interface HookTemplate {
    targetPath: string;
    content: string;
}
/**
 * Skill template with name and content
 */
export interface SkillTemplate {
    name: string;
    content: string;
}
/**
 * Get all command templates from commands/feature/ directory
 * Commands use feature prefix in filename (e.g., start.md ? /feature:start)
 */
export declare function getAllCommands(): CommandTemplate[];
/**
 * Get all agent templates
 */
export declare function getAllAgents(): AgentTemplate[];
/**
 * Get all hook templates
 * Hooks are in the hooks/ directory and map to .codebuddy/ subdirectories
 */
export declare function getAllHooks(): HookTemplate[];
/**
 * Get all skill templates
 */
export declare function getAllSkills(): SkillTemplate[];
/**
 * Get settings template for CodeBuddy
 * Contains {{PYTHON_CMD}} placeholder that will be resolved by the configurator.
 */
export declare function getSettingsTemplate(): HookTemplate;
//# sourceMappingURL=index.d.ts.map