# Claude Commands

Custom commands for streamlining development workflows in the ElevatUs project.

## Available Commands

### 🚀 release
Automate the complete release process including version bump, changelog update, commit, and push.

**Usage:**
```bash
# Default (patch version bump)
.claude/commands/release.md

# Specify version type
.claude/commands/release.md patch "Fixed critical bug"
.claude/commands/release.md minor "Added new feature"
.claude/commands/release.md major "Breaking changes"

# Interactive changelog entry
.claude/commands/release.md patch
# Then enter changelog items when prompted
```

**What it does:**
1. ✅ Bumps version in package.json (patch/minor/major)
2. ✅ Updates version and release date in lib/version.ts
3. ✅ Updates README.md with changelog entry
4. ✅ Commits all changes with proper message
5. ✅ Pushes to remote repository

**Example:**
```bash
# Quick patch release.md
.claude/commands/release.md patch "Fixed Safari authentication issue"

# Minor release.md with multiple changes
.claude/commands/release.md minor
# Enter changelog items:
# > Added employee review system
# > Improved dashboard performance
# > Fixed navigation bugs
# > (empty line to finish)
```

## Adding New Commands

To add a new command:
1. Create a new file in `.claude/commands/` (e.g., `deploy`)
2. Add shebang: `#!/bin/bash`
3. Make it executable: `chmod +x .claude/commands/deploy`
4. Document it in this README

## Tips

- All commands should be idempotent (safe to run multiple times)
- Use color codes for better visibility
- Include error handling with `set -e`
- Provide clear feedback at each step
- Add confirmation prompts for destructive operations
