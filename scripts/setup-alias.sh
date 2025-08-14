#!/bin/bash

# Setup script for ElevatUs release alias
# This adds a 'elevatus-release' command to your shell

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
RELEASE_SCRIPT="$PROJECT_ROOT/scripts/release.sh"

echo "🔧 Setting up ElevatUs release alias..."
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
    echo "❌ Unsupported shell. Please add the alias manually."
    exit 1
fi

# Create the alias
ALIAS_COMMAND="alias elevatus-release='$RELEASE_SCRIPT'"

echo "📝 Adding alias to $SHELL_RC..."

# Check if alias already exists
if grep -q "alias elevatus-release=" "$SHELL_RC" 2>/dev/null; then
    echo "⚠️  Alias already exists in $SHELL_RC"
    read -p "Do you want to update it? (y/N): " update_alias
    
    if [[ $update_alias =~ ^[Yy]$ ]]; then
        # Remove old alias and add new one
        sed -i.bak '/alias elevatus-release=/d' "$SHELL_RC"
        echo "" >> "$SHELL_RC"
        echo "# ElevatUs Release Script Alias" >> "$SHELL_RC"
        echo "$ALIAS_COMMAND" >> "$SHELL_RC"
        echo "✅ Alias updated"
    else
        echo "⏭️  Keeping existing alias"
    fi
else
    # Add new alias
    echo "" >> "$SHELL_RC"
    echo "# ElevatUs Release Script Alias" >> "$SHELL_RC"
    echo "$ALIAS_COMMAND" >> "$SHELL_RC"
    echo "✅ Alias added to $SHELL_RC"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Usage:"
echo "  1. Restart your terminal or run: source $SHELL_RC"
echo "  2. Navigate to your ElevatUs project directory"
echo "  3. Run: elevatus-release"
echo ""
echo "💡 Alternative usage:"
echo "  You can also run the script directly: $RELEASE_SCRIPT"
echo ""

# Offer to reload shell config
read -p "Do you want to reload your shell configuration now? (y/N): " reload_shell

if [[ $reload_shell =~ ^[Yy]$ ]]; then
    source "$SHELL_RC"
    echo "✅ Shell configuration reloaded"
    echo "🚀 You can now use 'elevatus-release' command!"
else
    echo "💡 Remember to restart your terminal or run: source $SHELL_RC"
fi