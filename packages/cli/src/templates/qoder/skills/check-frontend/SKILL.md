---
name: check-frontend
description: "Check if the code you just wrote follows the frontend development guidelines."
---

Check if the code you just wrote follows the frontend development guidelines.

Execute these steps:
1. Run `git status` to see modified files
2. Read `.feature/spec/frontend/index.md` to understand which guidelines apply
3. Based on what you changed, read the relevant guideline files:
   - Component changes → `.feature/spec/frontend/component-guidelines.md`
   - Hook changes → `.feature/spec/frontend/hook-guidelines.md`
   - State changes → `.feature/spec/frontend/state-management.md`
   - Type changes → `.feature/spec/frontend/type-safety.md`
   - Any changes → `.feature/spec/frontend/quality-guidelines.md`
4. Review your code against the guidelines
5. Report any violations and fix them if found
