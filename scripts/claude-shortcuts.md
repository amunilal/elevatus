# Claude Code Shortcuts for ElevatUs

These shortcuts can be used in Claude Code conversations with the `/shortcut:` syntax.

## 🚀 Release Management Shortcuts

### `/commit:`
Quick commit with type checking and push
```bash
npm run type-check && git add -A && git commit -m "$1" && git push origin main
```

### `/release:`
Full release workflow with version bump
```bash
./scripts/release.sh
```

### `/patch:`
Patch version release (1.0.1 → 1.0.2)
```bash
npm run type-check && \
current_version=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/') && \
IFS='.' read -ra VERSION_PARTS <<< "$current_version" && \
new_version="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$((${VERSION_PARTS[2]} + 1))" && \
echo "Updating version to $new_version" && \
sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json && \
sed -i '' "s/version: '$current_version'/version: '$new_version'/" lib/version.ts && \
sed -i '' "s/releaseDate: '[^']*'/releaseDate: '$(date +%Y-%m-%d)'/" lib/version.ts && \
git add -A && \
git commit -m "Release v$new_version

- Updated version to $new_version
- TypeScript checks passed
- Patch release with bug fixes

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" && \
git push origin main && \
echo "✅ Released v$new_version"
```

### `/minor:`
Minor version release (1.0.1 → 1.1.0)
```bash
npm run type-check && \
current_version=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/') && \
IFS='.' read -ra VERSION_PARTS <<< "$current_version" && \
new_version="${VERSION_PARTS[0]}.$((${VERSION_PARTS[1]} + 1)).0" && \
echo "Updating version to $new_version" && \
sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json && \
sed -i '' "s/version: '$current_version'/version: '$new_version'/" lib/version.ts && \
sed -i '' "s/releaseDate: '[^']*'/releaseDate: '$(date +%Y-%m-%d)'/" lib/version.ts && \
git add -A && \
git commit -m "Release v$new_version

- Updated version to $new_version
- TypeScript checks passed
- Minor release with new features

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" && \
git push origin main && \
echo "✅ Released v$new_version"
```

### `/hotfix:`
Quick hotfix with automatic patch bump
```bash
npm run type-check && \
current_version=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/') && \
IFS='.' read -ra VERSION_PARTS <<< "$current_version" && \
new_version="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$((${VERSION_PARTS[2]} + 1))" && \
echo "Creating hotfix v$new_version" && \
sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json && \
sed -i '' "s/version: '$current_version'/version: '$new_version'/" lib/version.ts && \
sed -i '' "s/releaseDate: '[^']*'/releaseDate: '$(date +%Y-%m-%d)'/" lib/version.ts && \
git add -A && \
git commit -m "Hotfix v$new_version

- Critical bug fix
- TypeScript checks passed
- Immediate deployment required

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" && \
git push origin main && \
vercel --prod && \
echo "🚨 Hotfix v$new_version deployed to production"
```

## 🔧 Development Shortcuts

### `/check:`
Run all code quality checks
```bash
echo "🔍 Running TypeScript check..." && \
npm run type-check && \
echo "✅ TypeScript passed" && \
echo "🧹 Checking git status..." && \
git status --short && \
echo "✅ All checks completed"
```

### `/build:`
Build and test production build
```bash
echo "🏗️  Building for production..." && \
npm run build && \
echo "✅ Production build successful"
```

### `/dev:`
Start development server with clean slate
```bash
echo "🧹 Cleaning up..." && \
rm -rf .next && \
echo "🚀 Starting development server..." && \
npm run dev
```

### `/deploy:`
Deploy to production (Vercel)
```bash
echo "🔍 Pre-deployment checks..." && \
npm run type-check && \
echo "🚀 Deploying to production..." && \
vercel --prod && \
echo "✅ Deployment completed"
```

## 📊 Database Shortcuts

### `/db-push:`
Push schema changes to database
```bash
echo "📊 Pushing database schema..." && \
npx prisma db push && \
echo "✅ Database schema updated"
```

### `/db-studio:`
Open Prisma Studio
```bash
echo "🎯 Opening Prisma Studio..." && \
npx prisma studio --port 5556
```

### `/db-reset:`
Reset database (DESTRUCTIVE)
```bash
echo "⚠️  WARNING: This will reset your database!" && \
read -p "Are you sure? (y/N): " confirm && \
if [[ $confirm =~ ^[Yy]$ ]]; then \
  echo "💥 Resetting database..." && \
  npx prisma db push --force-reset && \
  echo "✅ Database reset completed"; \
else \
  echo "❌ Database reset cancelled"; \
fi
```

## 🧪 Testing Shortcuts

### `/test:`
Run all tests
```bash
echo "🧪 Running tests..." && \
npm test && \
echo "✅ All tests passed"
```

### `/test-watch:`
Run tests in watch mode
```bash
echo "👀 Starting test watcher..." && \
npm run test:watch
```

## 📝 Documentation Shortcuts

### `/docs:`
Generate and update documentation
```bash
echo "📝 Updating documentation..." && \
echo "Current version: $(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')" && \
echo "Last commit: $(git log -1 --pretty=format:'%h - %s')" && \
echo "✅ Documentation context ready"
```

### `/changelog:`
Generate changelog from git history
```bash
echo "📋 Recent changes:" && \
git log --oneline -10 && \
echo "" && \
echo "Current version: $(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')"
```

## 🔒 Security Shortcuts

### `/audit:`
Security audit and fix
```bash
echo "🔒 Running security audit..." && \
npm audit && \
echo "🔧 Attempting to fix vulnerabilities..." && \
npm audit fix && \
echo "✅ Security audit completed"
```

### `/clean:`
Clean up node_modules and reinstall
```bash
echo "🧹 Cleaning node_modules..." && \
rm -rf node_modules package-lock.json && \
echo "📦 Reinstalling dependencies..." && \
npm install && \
echo "✅ Clean installation completed"
```

## 🎯 Utility Shortcuts

### `/status:`
Comprehensive project status
```bash
echo "📊 ElevatUs Project Status" && \
echo "=========================" && \
echo "Version: $(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')" && \
echo "Branch: $(git branch --show-current)" && \
echo "Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)')" && \
echo "Git status:" && \
git status --short && \
echo "Node version: $(node --version)" && \
echo "NPM version: $(npm --version)" && \
echo "✅ Status check completed"
```

### `/backup:`
Create local backup of current changes
```bash
backup_name="elevatus-backup-$(date +%Y%m%d-%H%M%S)" && \
echo "💾 Creating backup: $backup_name" && \
git add -A && \
git stash push -m "$backup_name" && \
echo "✅ Backup created: $backup_name" && \
echo "Restore with: git stash apply stash@{0}"
```

## 📱 Usage Examples

In Claude Code, you can use these shortcuts like:

```
/commit: Fix Safari compatibility issue with token extraction
/patch: 
/deploy:
/check:
/status:
```

## 🛠️ Customization

To add custom shortcuts:

1. Copy any of the above patterns
2. Modify the commands for your needs  
3. Use with `/shortcut-name:` in Claude Code

## ⚡ Pro Tips

- **Combine shortcuts**: Use multiple shortcuts in sequence
- **Custom messages**: Add parameters to `/commit:` for custom messages
- **Error handling**: Scripts include basic error checking
- **Safety first**: Destructive operations include confirmations
- **Version aware**: Most scripts automatically detect current version

## 🔗 Integration

These shortcuts work with:
- ✅ ElevatUs project structure
- ✅ Next.js and TypeScript
- ✅ Prisma database
- ✅ Vercel deployment
- ✅ Git workflows
- ✅ NPM scripts