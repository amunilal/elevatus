# ElevatUs Development Scripts

Core development and deployment scripts for the ElevatUs project.

## 🚀 Available Scripts

### Main Release Script
```bash
# Interactive release.md workflow
./scripts/release.md.sh
```

### Shell Alias Setup
```bash
# Setup elevatus-release.md command
./scripts/setup-alias.sh
```

## 📂 Claude Code Integration

**Claude Code aliases have been moved to `.claude/` directory:**
- Claude aliases: `.claude/aliases/`
- Standalone scripts: `.claude/scripts-*`
- Setup script: `.claude/setup-shortcuts.sh`
- Documentation: `.claude/README.md`

For Claude Code workflows, see the `.claude/README.md` file.

## 📋 What the Script Does

### 1. **TypeScript Check** ✅
- Runs `npm run type-check`
- Fails fast if TypeScript errors are found
- Ensures code quality before release

### 2. **Version Management** 📦
- Shows current version from `package.json`
- Offers version increment options:
  - **Patch**: Bug fixes (1.0.1 → 1.0.2)
  - **Minor**: New features (1.0.1 → 1.1.0) 
  - **Major**: Breaking changes (1.0.1 → 2.0.0)
  - **Custom**: Enter any version
  - **Skip**: Keep current version
- Updates both `package.json` and `lib/version.ts`
- Updates release date automatically

### 3. **README Updates** 📖
- Optional README update with release notes
- Automatically adds entry to Security Updates section
- Preserves existing content structure

### 4. **Git Operations** 🔄
- Shows git status before committing
- User confirmation for each step:
  - Commit changes
  - Push to remote
- Auto-generates commit messages with Claude Code attribution
- Option to customize commit messages

## 🎯 Interactive Workflow

```bash
🚀 ElevatUs Release Script
=========================

📋 Step 1: Running TypeScript check...
✅ TypeScript check passed

📦 Step 2: Version Management
Current version: 1.0.2

Select version increment type:
1) Patch (1.0.2 → 1.0.3)
2) Minor (1.0.2 → 1.1.0)
3) Major (1.0.2 → 2.0.0)
4) Custom version
5) Skip version update

Enter choice (1-5): 1

📖 Step 3: README Update
Do you want to update the README with release.md notes? (y/N): y
Enter release.md notes summary: Fixed Safari compatibility issues

📊 Step 4: Checking git status...
📋 Changes to be committed:
M  README.md
M  lib/version.ts
M  package.json

🤔 Do you want to commit these changes? (y/N): y

📝 Commit message preview:
------------------------
Release v1.0.3

- Updated version to 1.0.3
- TypeScript checks passed
- Fixed Safari compatibility issues

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
------------------------

Use this commit message? (Y/n): y
✅ Changes committed

🚀 Do you want to push to remote? (y/N): y
📤 Pushing to remote...
✅ Changes pushed to remote

🎉 Release completed successfully!
🏷️  Version: 1.0.3
📋 All changes have been committed and pushed
```

## 🛠️ Setup Instructions

### 1. Make Scripts Executable (if needed)
```bash
chmod +x scripts/*.sh
chmod +x scripts/claude-release.md
```

### 2. Setup Shell Alias (Optional)
```bash
./scripts/setup-alias.sh
```

This adds `elevatus-release` command to your shell configuration.

### 3. Verify Setup
```bash
# Test direct execution
./scripts/release.md.sh

# Test alias (if set up)
elevatus-release.md

# Test Claude Code integration
./scripts/claude-release.md
```

## 🔧 Configuration

### Version Pattern
- Format: `MAJOR.MINOR.PATCH` (semantic versioning)
- Auto-updates: `package.json` and `lib/version.ts`
- Release date: Automatically set to current date

### Commit Message Template
```
Release v{VERSION}

- Updated version to {VERSION}
- TypeScript checks passed
- {RELEASE_NOTES}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 📁 File Structure
```
scripts/
├── README.md           # This documentation
├── release.sh          # Main release script
├── setup-alias.sh      # Shell alias setup
└── claude-release      # Claude Code integration
```

## 🚨 Requirements

- Node.js and npm
- Git repository
- `package.json` with version field
- `lib/version.ts` file
- `npm run type-check` script configured

## 🆘 Troubleshooting

### Script Won't Run
```bash
# Make executable
chmod +x scripts/release.md.sh

# Check if in project root
ls package.json lib/version.ts
```

### TypeScript Errors
```bash
# Fix TypeScript errors first
npm run type-check

# Then run release.md script
./scripts/release.md.sh
```

### Alias Not Found
```bash
# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc, ~/.bash_profile

# Or restart terminal
```

## 💡 Tips

- **Run from project root**: Scripts detect project structure
- **Review changes**: Always review git status before committing
- **Backup important work**: Scripts modify version files automatically
- **Test TypeScript**: Fix all type errors before releasing
- **Custom messages**: You can always customize commit messages

## 🎯 Use Cases

- **Quick patch releases**: Bug fixes with automated versioning
- **Feature releases**: Minor version bumps with release notes
- **Major releases**: Breaking changes with comprehensive documentation
- **Claude Code workflow**: Integrated into AI-assisted development
- **CI/CD preparation**: Consistent versioning for automated deployments
