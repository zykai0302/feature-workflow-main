/**
 * Qoder configurator
 *
 * Configures Qoder by copying templates from src/templates/qoder/.
 * Qoder supports commands, hooks, rules, skills, and settings.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { getQoderTemplatePath } from "../templates/extract.js";
import { ensureDir, writeFile } from "../utils/file-writer.js";
import { resolvePlaceholders } from "./shared.js";

const EXCLUDE_PATTERNS = [
  ".d.ts",
  ".d.ts.map",
  ".js",
  ".js.map",
  "__pycache__",
  "node_modules",
  "bun.lock",
  ".gitignore",
];

function shouldExclude(filename: string): boolean {
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filename.endsWith(pattern) || filename === pattern) {
      return true;
    }
  }
  return false;
}

async function copyDirFiltered(src: string, dest: string): Promise<void> {
  ensureDir(dest);

  for (const entry of readdirSync(src)) {
    if (shouldExclude(entry)) {
      continue;
    }

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      await copyDirFiltered(srcPath, destPath);
    } else {
      let content = readFileSync(srcPath, "utf-8");
      // Replace placeholders in settings.json
      if (entry === "settings.json") {
        content = resolvePlaceholders(content);
      }
      await writeFile(destPath, content);
    }
  }
}

export async function configureQoder(cwd: string): Promise<void> {
  const sourcePath = getQoderTemplatePath();
  const destPath = path.join(cwd, ".qoder");

  await copyDirFiltered(sourcePath, destPath);
}
