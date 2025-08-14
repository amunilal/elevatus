# Claude Code Aliases for ElevatUs

This directory contains Claude Code aliases that can be used directly in Claude conversations for streamlined development workflows.

## 🚀 Available Aliases

### Release Management
- **`/commit <message>`** - Quick commit with TypeScript check and push
- **`/patch [notes]`** - Automatic patch version bump and release  
- **`/hotfix <description>`** - Emergency hotfix with immediate deployment

### Development
- **`/check`** - Comprehensive code quality checks
- **`/status`** - Detailed project status overview
- **`/build`** - Build project for production
- **`/dev`** - Start development server with clean cache
- **`/deploy`** - Deploy to production with pre-flight checks

### Database
- **`/db-push`** - Push database schema changes
- **`/db-studio`** - Open Prisma Studio on port 5556

## 💡 Usage Examples

```bash
# Quick commit and push
/commit Fix Safari compatibility issues in password reset

# Patch version release  
/patch Enhanced production debugging capabilities

# Emergency deployment
/hotfix Critical authentication bug fix

# Check project status
/status

# Run quality checks
/check

# Deploy to production
/deploy
```

## 🔧 How It Works

Claude Code automatically recognizes aliases in the `.claude/aliases/` directory and executes them when called with the `/alias-name` syntax in conversations.

Each alias is a shell script that can:
- Run multiple commands in sequence
- Include error handling and validation
- Access project files and git repository
- Interact with external services (Vercel, npm, etc.)

## ⚡ Features

### Automatic TypeScript Validation
Most aliases include `npm run type-check` to ensure code quality before operations.

### Version Management
- **`/patch`** - Increments patch version (1.0.1 → 1.0.2)
- Updates both `package.json` and `lib/version.ts`
- Sets release date automatically
- Follows semantic versioning

### Git Integration
- Automatic staging with `git add -A`
- Standardized commit messages with Claude attribution
- Push to main branch with `git push origin main`

### Production Safety
- Pre-deployment checks for uncommitted changes
- TypeScript validation before releases
- Clear success/error messaging

## 📋 Alias Structure

Each alias follows this pattern:
```bash
# Claude Alias: name
# Description of what the alias does
# Usage: /name [parameters]

echo "🚀 Starting operation..."
# Commands here
echo "✅ Operation completed!"
```

## 🛠️ Customization

To create new aliases:

1. Create a new file in `.claude/aliases/`
2. Add your shell commands
3. Include appropriate error handling
4. Test with `/your-alias-name` in Claude conversations

## 🔒 Security Notes

- Aliases run in the project root directory
- They have access to your git repository and npm scripts
- Always review alias contents before use
- Be cautious with aliases that modify files or deploy to production

## 📊 Integration

These aliases integrate with:
- ✅ Next.js and TypeScript development
- ✅ Git version control workflows  
- ✅ Vercel deployment platform
- ✅ Prisma database management
- ✅ NPM package management
- ✅ ElevatUs project structure

## 🎯 Best Practices

1. **Use `/check`** before major changes
2. **Use `/status`** to understand current state
3. **Use `/patch`** for regular releases
4. **Use `/hotfix`** only for critical issues
5. **Review git status** before deploying
6. **Test locally** before production deployment