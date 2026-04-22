/**
 * Codex skill templates
 *
 * These are GENERIC templates for user projects.
 * Do NOT use feature project's own .agents/skills directory (which may be customized).
 *
 * Directory structure:
 *   codex/
 *   └── skills/
 *       └── <skill-name>/
 *           ├── SKILL.md
 *           └── reference/    (optional, supporting files)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readTemplate(relativePath: string): string {
  return readFileSync(join(__dirname, relativePath), "utf-8");
}

function listSkillNames(): string[] {
  try {
    return readdirSync(join(__dirname, "skills"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

export interface SkillTemplate {
  name: string;
  content: string;
}

/**
 * Reference file template with relative path and content
 */
export interface ReferenceTemplate {
  skillName: string;
  relativePath: string;
  content: string;
}

export function getAllSkills(): SkillTemplate[] {
  const skills: SkillTemplate[] = [];

  for (const name of listSkillNames()) {
    const content = readTemplate(`skills/${name}/SKILL.md`);
    skills.push({ name, content });
  }

  return skills;
}

/**
 * Get all reference files for all skills.
 * Reference files are stored in skills/<skill-name>/reference/ subdirectory.
 */
export function getAllReferences(): ReferenceTemplate[] {
  const refs: ReferenceTemplate[] = [];

  for (const skillName of listSkillNames()) {
    const refDir = join(__dirname, "skills", skillName, "reference");
    try {
      const entries = readdirSync(refDir);
      for (const entry of entries) {
        const fullPath = join(refDir, entry);
        if (statSync(fullPath).isFile()) {
          const content = readFileSync(fullPath, "utf-8");
          refs.push({
            skillName,
            relativePath: `reference/${entry}`,
            content,
          });
        }
      }
    } catch {
      // No reference directory for this skill
    }
  }

  return refs;
}
