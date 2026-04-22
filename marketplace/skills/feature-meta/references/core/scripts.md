# Core Scripts

Platform-independent Python scripts for feature automation.

---

## Overview

These scripts work on all platforms - they only read/write files and don't require Claude Code's hook system.

```
.feature/scripts/
├── common/                 # Shared utilities
│   ├── paths.py
│   ├── developer.py
│   ├── config.py
│   ├── task_utils.py
│   ├── phase.py
│   └── git_context.py
│
├── init_developer.py       # Initialize developer
├── get_developer.py        # Get developer name
├── get_context.py          # Get session context
├── task.py                 # Task management CLI
└── add_session.py          # Record session
```

---

## Developer Scripts

### `init_developer.py`

Initialize developer identity.

```bash
python3 .feature/scripts/init_developer.py <name>
```

**Creates:**

- `.feature/.developer`
- `.feature/workspace/<name>/`
- `.feature/workspace/<name>/index.md`
- `.feature/workspace/<name>/journal-1.md`

---

### `get_developer.py`

Get current developer name.

```bash
python3 .feature/scripts/get_developer.py
# Output: taosu
```

**Exit codes:**

- `0` - Success
- `1` - Not initialized

---

## Context Scripts

### `get_context.py`

Get session context for AI consumption.

```bash
python3 .feature/scripts/get_context.py
```

**Output includes:**

- Developer identity
- Git status and recent commits
- Current task (if any)
- Workspace summary

---

### `add_session.py`

Record session entry to journal.

```bash
python3 .feature/scripts/add_session.py \
  --title "Session Title" \
  --commit "hash1,hash2" \
  --summary "Brief summary"
```

**Options:**

- `--title` - Session title (required)
- `--commit` - Comma-separated commit hashes
- `--summary` - Brief summary
- `--content-file` - Path to file with detailed content
- `--no-commit` - Skip auto-commit of workspace changes

**Actions:**

1. Appends to current journal
2. Updates index markers
3. Rotates journal if >max_journal_lines
4. Auto-commits `.feature/workspace` changes (unless `--no-commit`)

---

## Task Scripts

### `task.py`

Task management CLI.

#### Create Task

```bash
python3 .feature/scripts/task.py create "Task name" --slug task-slug
```

**Options:**

- `--slug` - URL-safe identifier
- `--assignee` - Developer name (default: current)
- `--type` - Dev type: frontend, backend, fullstack

#### List Tasks

```bash
python3 .feature/scripts/task.py list
```

**Output:**

```
Active Tasks:
  01-31-add-login-taosu (active)
  01-30-fix-api-cursor-agent (paused)
```

#### Start Task

```bash
python3 .feature/scripts/task.py start <task-dir>
```

Sets `.feature/.current-task` to the task directory.

#### Stop Task

```bash
python3 .feature/scripts/task.py stop
```

Clears `.feature/.current-task`.

#### Initialize Context

```bash
python3 .feature/scripts/task.py init-context <task-dir> <dev-type>
```

**Dev types:** `frontend`, `backend`, `fullstack`

Creates JSONL files with appropriate spec references.

#### Set Branch

```bash
python3 .feature/scripts/task.py set-branch <task-dir> <branch-name>
```

Updates `branch` field in task.json.

#### Archive Task

```bash
python3 .feature/scripts/task.py archive <task-dir>
```

Moves task to `.feature/tasks/archive/YYYY-MM/`.

#### List Archive

```bash
python3 .feature/scripts/task.py list-archive [month]
```

---

## Common Utilities

### `common/paths.py`

Path constants and utilities.

```python
from common.paths import (
    feature_DIR,      # .feature/
    WORKSPACE_DIR,    # .feature/workspace/
    TASKS_DIR,        # .feature/tasks/
    SPEC_DIR,         # .feature/spec/
)
```

### `common/developer.py`

Developer management.

```python
from common.developer import (
    get_developer,     # Get current developer name
    get_workspace_dir, # Get developer's workspace directory
)
```

### `common/task_utils.py`

Task lookup functions.

```python
from common.task_utils import (
    get_current_task,  # Get current task directory
    load_task_json,    # Load task.json
    save_task_json,    # Save task.json
)
```

### `common/phase.py`

Phase tracking.

```python
from common.phase import (
    get_current_phase,  # Get current phase number
    advance_phase,      # Move to next phase
)
```

### `common/config.py`

Project-level configuration reader.

```python
from common.config import (
    get_session_commit_message,  # Commit message for auto-commit
    get_max_journal_lines,       # Max lines per journal file
)
```

Reads from `.feature/config.yaml` with hardcoded fallback defaults.

### `common/git_context.py`

Git context generation.

```python
from common.git_context import (
    get_git_status,     # Get git status
    get_recent_commits, # Get recent commit messages
    get_branch_name,    # Get current branch
)
```

---

## Usage Examples

### Initialize New Developer

```bash
cd /path/to/project
python3 .feature/scripts/init_developer.py john-doe
```

### Create and Start Task

```bash
# Create task
python3 .feature/scripts/task.py create "Add user login" --slug add-login

# Initialize context for fullstack work
python3 .feature/scripts/task.py init-context \
  .feature/tasks/01-31-add-login-john-doe fullstack

# Start task
python3 .feature/scripts/task.py start \
  .feature/tasks/01-31-add-login-john-doe
```

### Record Session

```bash
python3 .feature/scripts/add_session.py \
  --title "Implement login form" \
  --commit "abc1234" \
  --summary "Added login form, pending API integration"
```

### Archive Completed Task

```bash
python3 .feature/scripts/task.py archive \
  .feature/tasks/01-31-add-login-john-doe
```
