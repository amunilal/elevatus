#!/bin/bash

echo "🚀 ElevatUs Employee Tracker - Vercel Deployment Script"
echo "============================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or later.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed${NC}"
echo ""

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the elevatus-tracker directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment Checklist${NC}"
echo ""
echo "Before deploying, make sure you have:"
echo "1. ✅ Created a Neon database account at https://neon.tech"
echo "2. ✅ Created a Vercel account at https://vercel.com"
echo "3. ✅ Pushed your code to a GitHub repository"
echo "4. ✅ Your Neon database connection string ready"
echo ""

read -p "Have you completed all the above steps? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️ Please complete the prerequisites first, then run this script again.${NC}"
    exit 1
fi

# Get environment variables
echo -e "${BLUE}🔧 Setting up environment variables...${NC}"
echo ""

# Database URL
echo -e "${YELLOW}Please enter your Neon database connection string:${NC}"
echo "It should look like: postgresql://username:password@host/database?sslmode=require"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Database URL is required${NC}"
    exit 1
fi

# NextAuth Secret
echo ""
echo -e "${YELLOW}Please enter a secure secret for NextAuth (minimum 32 characters):${NC}"
echo "You can generate one at: https://generate-secret.vercel.app/32"
read -p "NEXTAUTH_SECRET: " NEXTAUTH_SECRET

if [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
    echo -e "${RED}❌ NextAuth secret must be at least 32 characters${NC}"
    exit 1
fi

# Build and test locally first
echo ""
echo -e "${BLUE}🔨 Building application locally...${NC}"

# Install dependencies
npm install

# Generate Prisma client with Neon adapter
export DATABASE_URL="$DATABASE_URL"
npx prisma generate

# Build the application
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"

# Login to Vercel
echo ""
echo -e "${BLUE}🔐 Logging in to Vercel...${NC}"
vercel login

# Deploy to Vercel
echo ""
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"

# Set environment variables
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"

# Deploy
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📋 Post-deployment steps:${NC}"
    echo "1. Set NEXTAUTH_URL in Vercel dashboard to your deployment URL"
    echo "2. Run database migrations:"
    echo "   - Go to your Vercel project settings"
    echo "   - Add these commands to your build settings:"
    echo "     npx prisma migrate deploy"
    echo "     npx prisma db seed (optional)"
    echo ""
    echo -e "${GREEN}🌐 Your ElevatUs Employee Tracker is now live!${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the error messages above.${NC}"
    exit 1
fi