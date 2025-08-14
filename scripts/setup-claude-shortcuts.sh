#!/bin/bash

# Setup Claude Code shortcuts for ElevatUs
# This creates aliases for Claude Code shortcuts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔧 Setting up Claude Code shortcuts for ElevatUs..."
echo ""

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        SHELL_RC="$HOME/.bash_profile"
    else
        SHELL_RC="$HOME/.bashrc"
    fi
    SHELL_NAME="bash"
else
    echo "❌ Unsupported shell. Please add aliases manually."
    exit 1
fi

echo "📋 Claude Code Shortcuts to be added:"
echo "  /commit:  - Quick commit with TypeScript check"
echo "  /patch:   - Patch version bump and release"  
echo "  /deploy:  - Deploy to production with checks"
echo "  /check:   - Run code quality checks"
echo "  /status:  - Show project status"
echo "  /hotfix:  - Emergency hotfix deployment"
echo ""

# Create aliases
SHORTCUTS=(
    "alias '/commit:'='$SCRIPT_DIR/commit'"
    "alias '/patch:'='$SCRIPT_DIR/patch'"
    "alias '/deploy:'='$SCRIPT_DIR/deploy'"
    "alias '/check:'='$SCRIPT_DIR/check'"
    "alias '/status:'='$SCRIPT_DIR/status'"
    "alias '/hotfix:'='$SCRIPT_DIR/hotfix'"
)

# Check if shortcuts already exist
existing_shortcuts=0
for shortcut in "${SHORTCUTS[@]}"; do
    alias_name=$(echo "$shortcut" | cut -d"'" -f2)
    if grep -q "alias '$alias_name'" "$SHELL_RC" 2>/dev/null; then
        existing_shortcuts=$((existing_shortcuts + 1))
    fi
done

if [ $existing_shortcuts -gt 0 ]; then
    echo "⚠️  Found $existing_shortcuts existing Claude shortcuts in $SHELL_RC"
    read -p "Do you want to update them? (y/N): " update_shortcuts
    
    if [[ $update_shortcuts =~ ^[Yy]$ ]]; then
        # Remove old shortcuts
        for shortcut in "${SHORTCUTS[@]}"; do
            alias_name=$(echo "$shortcut" | cut -d"'" -f2)
            sed -i.bak "/alias '$alias_name'/d" "$SHELL_RC"
        done
        echo "🗑️  Removed old shortcuts"
    else
        echo "⏭️  Keeping existing shortcuts"
        exit 0
    fi
fi

# Add new shortcuts
echo "" >> "$SHELL_RC"
echo "# Claude Code Shortcuts for ElevatUs" >> "$SHELL_RC"
for shortcut in "${SHORTCUTS[@]}"; do
    echo "$shortcut" >> "$SHELL_RC"
done

echo "✅ Claude Code shortcuts added to $SHELL_RC"
echo ""

# Create usage documentation
cat << 'EOF' >> "$SHELL_RC"

# Claude Code Shortcut Usage:
# /commit: Your commit message    - Quick commit with TypeScript check
# /patch: Optional release notes  - Patch version bump (1.0.1 → 1.0.2)  
# /deploy:                        - Deploy to production with checks
# /check:                         - Run comprehensive code quality checks
# /status:                        - Show detailed project status
# /hotfix: Critical fix desc      - Emergency hotfix with auto-deploy
EOF

echo "📖 Usage examples:"
echo "  /commit: Fix Safari compatibility issues"
echo "  /patch: Enhanced debugging for production"
echo "  /deploy:"
echo "  /check:"
echo "  /status:"
echo "  /hotfix: Critical database connection fix"
echo ""

# Offer to reload shell config
read -p "Do you want to reload your shell configuration now? (y/N): " reload_shell

if [[ $reload_shell =~ ^[Yy]$ ]]; then
    source "$SHELL_RC"
    echo "✅ Shell configuration reloaded"
    echo ""
    echo "🎉 Claude Code shortcuts are now active!"
    echo "   Try: /status:"
else
    echo "💡 Remember to restart your terminal or run: source $SHELL_RC"
fi

echo ""
echo "🚀 Setup completed! You can now use Claude Code shortcuts in your terminal."