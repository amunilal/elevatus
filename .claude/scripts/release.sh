#!/bin/bash

# ElevatUs Release Script
# Performs TypeScript check, version bump, README update, commit and push with user confirmation

set -e  # Exit on any error

echo "🚀 ElevatUs Release Script"
echo "========================="

# Function to get current version
get_current_version() {
    grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/'
}

# Function to increment version
increment_version() {
    local version=$1
    local type=$2

    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}

    case $type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch"|*)
            patch=$((patch + 1))
            ;;
    esac

    echo "$major.$minor.$patch"
}

# Step 1: TypeScript Check
echo "📋 Step 1: Running TypeScript check..."
if npm run type-check; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed. Please fix errors before continuing."
    exit 1
fi

echo ""

# Step 2: Version Selection
current_version=$(get_current_version)
echo "📦 Step 2: Version Management"
echo "Current version: $current_version"
echo ""
echo "Select version increment type:"
echo "1) Patch (${current_version} → $(increment_version $current_version patch))"
echo "2) Minor (${current_version} → $(increment_version $current_version minor))"
echo "3) Major (${current_version} → $(increment_version $current_version major))"
echo "4) Custom version"
echo "5) Skip version update"

read -p "Enter choice (1-5): " version_choice

case $version_choice in
    1)
        new_version=$(increment_version $current_version patch)
        ;;
    2)
        new_version=$(increment_version $current_version minor)
        ;;
    3)
        new_version=$(increment_version $current_version major)
        ;;
    4)
        read -p "Enter custom version: " new_version
        ;;
    5)
        new_version=$current_version
        echo "⏭️  Skipping version update"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

if [ "$new_version" != "$current_version" ]; then
    echo "📝 Updating version to $new_version..."

    # Update package.json
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json

    # Update lib/version.ts
    today=$(date +%Y-%m-%d)
    sed -i '' "s/version: '$current_version'/version: '$new_version'/" lib/version.ts
    sed -i '' "s/releaseDate: '[^']*'/releaseDate: '$today'/" lib/version.ts

    echo "✅ Version updated to $new_version"
fi

echo ""

# Step 3: README Update
echo "📖 Step 3: README Update"
read -p "Do you want to update the README with release notes? (y/N): " update_readme

if [[ $update_readme =~ ^[Yy]$ ]]; then
    echo "📝 Opening README for editing..."
    read -p "Enter release notes summary: " release_notes

    if [ -n "$release_notes" ]; then
        # Add to security updates section if version changed
        if [ "$new_version" != "$current_version" ]; then
            # Create a temporary file with the new entry
            temp_file=$(mktemp)

            # Insert new release.md notes after the Security Updates header
            awk -v version="$new_version" -v date="$today" -v notes="$release_notes" '
            /^## 🔐 Security Updates/ {
                print $0
                print ""
                print "### Release " version " (" date ")"
                print "- " notes
                print ""
                next
            }
            {print}
            ' README.md > "$temp_file"

            mv "$temp_file" README.md
            echo "✅ README updated with release notes"
        fi
    fi
else
    echo "⏭️  Skipping README update"
fi

echo ""

# Step 4: Git Status Check
echo "📊 Step 4: Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📋 Changes to be committed:"
    git status --short
else
    echo "ℹ️  No changes detected"
fi

echo ""

# Step 5: Commit Confirmation
read -p "🤔 Do you want to commit these changes? (y/N): " commit_confirm

if [[ $commit_confirm =~ ^[Yy]$ ]]; then
    # Prepare commit message
    if [ "$new_version" != "$current_version" ]; then
        default_message="Release v$new_version

- Updated version to $new_version
- TypeScript checks passed
$([ -n "$release_notes" ] && echo "- $release_notes")

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    else
        default_message="Update project files

- TypeScript checks passed
$([ -n "$release_notes" ] && echo "- $release_notes")

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    fi

    echo "📝 Commit message preview:"
    echo "------------------------"
    echo "$default_message"
    echo "------------------------"
    echo ""

    read -p "Use this commit message? (Y/n): " use_default_msg

    if [[ $use_default_msg =~ ^[Nn]$ ]]; then
        read -p "Enter custom commit message: " custom_message
        commit_message="$custom_message"
    else
        commit_message="$default_message"
    fi

    # Stage and commit
    git add -A
    git commit -m "$commit_message"
    echo "✅ Changes committed"

    echo ""

    # Step 6: Push Confirmation
    read -p "🚀 Do you want to push to remote? (y/N): " push_confirm

    if [[ $push_confirm =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to remote..."
        git push origin main
        echo "✅ Changes pushed to remote"

        echo ""
        echo "🎉 Release completed successfully!"
        [ "$new_version" != "$current_version" ] && echo "🏷️  Version: $new_version"
        echo "📋 All changes have been committed and pushed"
    else
        echo "⏭️  Skipping push to remote"
        echo "💡 Don't forget to push your changes later with: git push origin main"
    fi
else
    echo "⏭️  Skipping commit"
    echo "💡 Your changes are staged but not committed"
fi

echo ""
echo "✨ Script completed!"
