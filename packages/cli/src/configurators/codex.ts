import { readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { getAllReferences, getAllSkills } from "../templates/codex/index.js";
import { ensureDir, writeFile } from "../utils/file-writer.js";

/**
 * Configure Codex by writing skill templates.
 *
 * Output:
 * - .agents/skills/<skill-name>/SKILL.md
 * - .agents/skills/<skill-name>/reference/<file>  (if present)
 *
 * Also cleans up stale skill directories that are no longer in the template set.
 */
export async function configureCodex(cwd: string): Promise<void> {
  const skillsRoot = path.join(cwd, ".agents", "skills");
  ensureDir(skillsRoot);

  const skills = getAllSkills();
  const references = getAllReferences();

  // Build set of valid skill names from templates
  const validSkillNames = new Set(skills.map((s) => s.name));

  // Write SKILL.md for each skill
  for (const skill of skills) {
    const skillDir = path.join(skillsRoot, skill.name);
    ensureDir(skillDir);
    const targetPath = path.join(skillDir, "SKILL.md");
    await writeFile(targetPath, skill.content);
  }

  // Write reference files for each skill
  for (const ref of references) {
    const refDir = path.join(skillsRoot, ref.skillName, "reference");
    ensureDir(refDir);
    const targetPath = path.join(refDir, path.basename(ref.relativePath));
    await writeFile(targetPath, ref.content);
  }

  // Clean up stale skill directories that are no longer in templates
  try {
    const entries = readdirSync(skillsRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !validSkillNames.has(entry.name)) {
        const staleDir = path.join(skillsRoot, entry.name);
        // Only remove if it looks like a skill directory (contains SKILL.md)
        const skillFile = path.join(staleDir, "SKILL.md");
        if (statSync(skillFile).isFile !== undefined) {
          try {
            statSync(skillFile);
            rmSync(staleDir, { recursive: true, force: true });
          } catch {
            // Not a skill directory, skip
          }
        }
      }
    }
  } catch {
    // Directory doesn't exist or not readable, skip cleanup
  }
}
