#!/bin/bash

# Claude Command: release
# Automate version bump, changelog update, commit and push
# Usage: .claude/commands/release [patch|minor|major] "changelog message"

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to patch if no version type specified
VERSION_TYPE=${1:-patch}
CHANGELOG_MESSAGE=${2:-""}

echo -e "${BLUE}🚀 ElevatUs Release Script${NC}"
echo "================================"

# Get current version
CURRENT_VERSION=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')
echo -e "Current version: ${YELLOW}$CURRENT_VERSION${NC}"

# Calculate new version
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
    *)
        echo -e "${RED}Invalid version type. Use: patch, minor, or major${NC}"
        exit 1
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo -e "New version: ${GREEN}$NEW_VERSION${NC}"

# Step 1: Bump version in package.json and lib/version.ts
echo ""
echo -e "${YELLOW}📦 Step 1: Bumping version in package.json and lib/version.ts...${NC}"

# Update package.json
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
echo -e "${GREEN}✓ package.json updated${NC}"

# Update lib/version.ts
if [ -f "lib/version.ts" ]; then
    # Update version
    sed -i '' "s/version: '$CURRENT_VERSION'/version: '$NEW_VERSION'/" lib/version.ts
    # Update release date to today
    sed -i '' "s/releaseDate: '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}'/releaseDate: '$TODAY'/" lib/version.ts
    echo -e "${GREEN}✓ lib/version.ts updated${NC}"
else
    echo -e "${YELLOW}⚠ lib/version.ts not found, skipping${NC}"
fi

echo -e "${GREEN}✓ Version bumped to $NEW_VERSION${NC}"

# Step 2: Update README with changelog
echo ""
echo -e "${YELLOW}📝 Step 2: Updating README with changelog...${NC}"

# Get today's date
TODAY=$(date +"%Y-%m-%d")

# Prepare changelog entry
if [ -z "$CHANGELOG_MESSAGE" ]; then
    echo -e "${YELLOW}Enter changelog items (one per line, empty line to finish):${NC}"
    CHANGELOG_ITEMS=""
    while IFS= read -r line; do
        [ -z "$line" ] && break
        CHANGELOG_ITEMS="${CHANGELOG_ITEMS}- ${line}\n"
    done
else
    CHANGELOG_ITEMS="- ${CHANGELOG_MESSAGE}\n"
fi

# Check if Changelog section exists
if grep -q "## 📝 Changelog" README.md; then
    # Insert new version entry after the Changelog header
    TEMP_FILE=$(mktemp)
    awk -v version="$NEW_VERSION" -v date="$TODAY" -v items="$CHANGELOG_ITEMS" '
    /## 📝 Changelog/ {
        print
        print ""
        print "### Version " version " (" date ")"
        printf items
        next
    }
    {print}
    ' README.md > "$TEMP_FILE"
    mv "$TEMP_FILE" README.md
else
    # Add Changelog section before Planned Features
    TEMP_FILE=$(mktemp)
    awk -v version="$NEW_VERSION" -v date="$TODAY" -v items="$CHANGELOG_ITEMS" '
    /### Planned Features/ {
        print "## 📝 Changelog"
        print ""
        print "### Version " version " (" date ")"
        printf items
        print ""
    }
    {print}
    ' README.md > "$TEMP_FILE"
    mv "$TEMP_FILE" README.md
fi

echo -e "${GREEN}✓ Changelog updated${NC}"

# Step 3: Commit all changes
echo ""
echo -e "${YELLOW}💾 Step 3: Committing changes...${NC}"

# Stage all changes
git add -A

# Show what's being committed
echo -e "${BLUE}Changes to be committed:${NC}"
git status --short

# Create commit message
COMMIT_MESSAGE="Release v${NEW_VERSION}

${CHANGELOG_ITEMS}
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓ Changes committed${NC}"

# Step 4: Push to remote repository
echo ""
echo -e "${YELLOW}🚀 Step 4: Pushing to remote repository...${NC}"

# Get current branch
BRANCH=$(git branch --show-current)
echo -e "Pushing to ${BLUE}origin/$BRANCH${NC}..."

git push origin "$BRANCH"
echo -e "${GREEN}✓ Pushed to remote repository${NC}"

# Summary
echo ""
echo "================================"
echo -e "${GREEN}🎉 Release v${NEW_VERSION} completed successfully!${NC}"
echo ""
echo "Summary:"
echo -e "  • Version: ${YELLOW}${CURRENT_VERSION}${NC} → ${GREEN}${NEW_VERSION}${NC}"
echo -e "  • Branch: ${BLUE}${BRANCH}${NC}"
echo -e "  • Commit: $(git rev-parse --short HEAD)"
echo ""
echo -e "${BLUE}View deployment at: https://elevatus.mad.app${NC}"