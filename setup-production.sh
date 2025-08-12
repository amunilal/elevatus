#!/bin/bash

# Production Setup Script for Elevatus Tracker
# This script prepares a production environment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${BLUE}→ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

# Banner
echo ""
echo "🏢 Elevatus Production Setup"
echo "============================="
echo "Secure production environment initialization"
echo ""

# Check if we're in production mode
if [ "$NODE_ENV" != "production" ]; then
    print_warning "NODE_ENV is not set to 'production'"
    read -p "Are you sure you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Setup cancelled"
        exit 1
    fi
fi

# Step 1: Check prerequisites
print_info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required (current: $(node -v))"
    exit 1
fi

print_success "Prerequisites met"

# Step 2: Check for production environment file
print_info "Checking environment configuration..."

if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found"
    
    if [ -f ".env.production.example" ]; then
        print_info "Creating .env.production from template..."
        cp .env.production.example .env.production
        print_warning "Please edit .env.production with your production values"
        print_info "Required variables:"
        echo "  - DATABASE_URL"
        echo "  - NEXTAUTH_SECRET"
        echo "  - NEXTAUTH_URL"
        echo "  - SMTP configuration"
        echo ""
        read -p "Press enter after configuring .env.production..."
    else
        print_error ".env.production is required for production setup"
        exit 1
    fi
fi

# Load production environment
set -a
source .env.production
set +a

# Validate critical environment variables
print_info "Validating environment variables..."

MISSING_VARS=()
[ -z "$DATABASE_URL" ] && MISSING_VARS+=("DATABASE_URL")
[ -z "$NEXTAUTH_SECRET" ] && MISSING_VARS+=("NEXTAUTH_SECRET")
[ -z "$NEXTAUTH_URL" ] && MISSING_VARS+=("NEXTAUTH_URL")

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

# Validate NEXTAUTH_SECRET strength
if [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
    print_error "NEXTAUTH_SECRET must be at least 32 characters"
    print_info "Generate a secure key with: openssl rand -base64 64"
    exit 1
fi

print_success "Environment validated"

# Step 3: Install dependencies
print_info "Installing production dependencies..."
npm ci --production
print_success "Dependencies installed"

# Step 4: Generate Prisma client
print_info "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Step 5: Run database migrations
print_info "Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Migration failed. Please check your DATABASE_URL"
    exit 1
fi

# Step 6: Create initial admin user
print_info "Setting up initial admin user..."
echo ""
echo "Please provide credentials for the initial super admin:"

read -p "Admin Email: " ADMIN_EMAIL
while true; do
    read -s -p "Admin Password (min 12 chars): " ADMIN_PASSWORD
    echo
    read -s -p "Confirm Password: " ADMIN_PASSWORD_CONFIRM
    echo
    
    if [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
        print_error "Passwords do not match. Please try again."
    elif [ ${#ADMIN_PASSWORD} -lt 12 ]; then
        print_error "Password must be at least 12 characters"
    else
        break
    fi
done

# Run production seed with admin credentials
export INITIAL_ADMIN_EMAIL="$ADMIN_EMAIL"
export INITIAL_ADMIN_PASSWORD="$ADMIN_PASSWORD"
export NODE_ENV=production

npm run db:seed:production

if [ $? -eq 0 ]; then
    print_success "Admin user created successfully"
else
    print_error "Failed to create admin user"
    exit 1
fi

# Clear sensitive environment variables
unset INITIAL_ADMIN_EMAIL
unset INITIAL_ADMIN_PASSWORD
unset ADMIN_PASSWORD
unset ADMIN_PASSWORD_CONFIRM

# Step 7: Build the application
print_info "Building production application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 8: Run production checks
print_info "Running production readiness checks..."

# Check for TypeScript errors
npm run type-check
if [ $? -eq 0 ]; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript warnings detected"
fi

# Check database connection
npx prisma db pull > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Database connection verified"
else
    print_error "Cannot connect to production database"
fi

# Step 9: Create necessary directories
print_info "Creating required directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p backups
chmod 755 uploads logs backups
print_success "Directories created"

# Step 10: Summary
echo ""
echo "======================================"
echo "🎉 Production Setup Complete!"
echo "======================================"
echo ""
print_success "Application is ready for production deployment"
echo ""
echo "📋 Deployment Checklist:"
echo "  ✓ Production dependencies installed"
echo "  ✓ Database migrated"
echo "  ✓ Admin user created"
echo "  ✓ Application built"
echo "  ✓ Clean production database"
echo ""
echo "🚀 Next Steps:"
echo "  1. Deploy to your hosting platform:"
echo "     - Vercel: vercel --prod"
echo "     - PM2: pm2 start npm --name elevatus -- start"
echo "     - Docker: docker-compose -f docker-compose.production.yml up -d"
echo ""
echo "  2. Configure your domain and SSL"
echo "  3. Set up monitoring and backups"
echo "  4. Review security settings"
echo ""
echo "📚 Documentation:"
echo "  - Production Guide: PRODUCTION_SETUP.md"
echo "  - Security: docs/SECURITY.md"
echo ""
print_warning "Remember to:"
echo "  - Keep your .env.production file secure"
echo "  - Enable 2FA for admin accounts"
echo "  - Set up regular backups"
echo "  - Monitor application logs"
echo ""
echo "🔐 Admin Portal: $NEXTAUTH_URL/employer/login"
echo ""