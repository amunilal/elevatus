#!/bin/bash

echo "🚀 Setting up ElevatUs Employee Management System..."
echo "📋 Complete Setup Guide with Authentication & Email Configuration"
echo ""

# Function to get local IP address
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        # Linux
        hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost"
    else
        echo "localhost"
    fi
}

# Check if Node.js is installed
echo "🔍 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or later."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js installed: $NODE_VERSION"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL manually."
    echo "   Download from: https://docker.com/get-started"
else
    echo "✅ Docker installed"
    echo "🐳 Starting Docker services..."
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 15
    
    # Verify Docker containers are running
    echo "📋 Docker container status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "⚠️  Dependency installation failed. Trying with legacy peer deps..."
    npm install --legacy-peer-deps
fi

# Load environment variables from .env.local
if [ -f .env.local ]; then
    echo "🔧 Loading environment variables from .env.local..."
    export $(cat .env.local | grep -v '^#' | grep '=' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  .env.local not found, using default DATABASE_URL"
    export DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev"
fi

# Generate Prisma client
echo "🔧 Setting up database..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
if npx prisma migrate deploy; then
    echo "✅ Database migrations applied successfully"
elif npx prisma migrate dev --name auto-migration; then
    echo "✅ Database migrations created and applied successfully"
else
    echo "⚠️  Database migration failed. Please check Docker containers are running."
    echo "    Try: docker-compose down && docker-compose up -d"
    echo "    Or manually apply: npx prisma db push --accept-data-loss"
fi

# Seed the database
echo "🌱 Seeding database with demo users..."
if npm run db:seed; then
    echo "✅ Demo users created successfully"
else
    echo "⚠️  Database seeding failed. You may need to set up users manually."
    echo "    Try: npm run db:seed"
fi

# Create uploads directory
echo "📁 Setting up file storage..."
mkdir -p uploads
chmod 755 uploads

# Setup environment files if needed
echo "🔐 Setting up environment configuration..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Email Configuration (Local Development - MailHog)
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@elevatus.local"
EOF
    echo "✅ Created .env.local with development settings"
fi

# Get local IP for team access
LOCAL_IP=$(get_local_ip)

echo ""
echo "🎉 Setup complete!"
echo "=================================="
echo ""
echo "🖥️  LOCAL DEVELOPMENT ACCESS:"
echo "   npm run dev"
echo ""
echo "📱 Application URLs (Local):"
echo "   - Main site: http://localhost:3000"
echo "   - Employer Portal: http://localhost:3000/employer/login"
echo "   - Employee Portal: http://localhost:3000/employee/login"
echo ""
echo "🌐 TEAM ACCESS URLs (Network):"
echo "   - Main site: http://$LOCAL_IP:3000"
echo "   - Employer Portal: http://$LOCAL_IP:3000/employer/login"
echo "   - Employee Portal: http://$LOCAL_IP:3000/employee/login"
echo ""
echo "🛠️  DEVELOPMENT TOOLS:"
echo "   - Prisma Studio: npx prisma studio"
echo "   - Database Migrations: npm run db:migrate"
echo "   - Database Seeding: npm run db:seed"
echo "   - MailHog UI: http://localhost:8025 (Email testing)"
echo ""
echo "🔑 Authentication System:"
echo "   ✨ Using NextAuth.js with JWT sessions"
echo "   🔒 Separate login portals for Employers and Employees"
echo "   📧 Email notifications via Amazon SES (production) / MailHog (local)"
echo ""
echo "🔑 Demo login credentials:"
echo "   👨‍💼 Employer Portal:"
echo "      - Admin: admin@elevatus.co.za / Admin123!@#"
echo "      - HR Manager: hr@elevatus.co.za / HR123!@#"
echo "      - Manager: manager@elevatus.co.za / Manager123!@#"
echo ""
echo "   👥 Employee Portal:"
echo "      - Employee 1: john.doe@elevatus.co.za / Employee123!@#"
echo "      - Employee 2: jane.smith@elevatus.co.za / Employee123!@#"
echo "      - Employee 3: sarah.jones@elevatus.co.za / Employee123!@#"
echo ""
echo "📋 TEAM COLLABORATION SETUP:"
echo "   1. Share this IP address with team: $LOCAL_IP"
echo "   2. Ensure all team members are on same network (WiFi/LAN)"
echo "   3. Firewall may need to allow port 3000"
echo "   4. For external access, consider using ngrok or similar tunneling service"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "   - Port conflicts: lsof -i :3000 (kill process if needed)"
echo "   - Docker issues: docker-compose down && docker-compose up -d"
echo "   - Database reset: docker-compose down -v && ./setup.sh"
echo "   - Clear Next.js cache: rm -rf .next && npm run dev"
echo ""
echo "📧 EMAIL CONFIGURATION:"
echo "   🔹 Local Development: MailHog (SMTP on port 1025)"
echo "   🔹 Production: Amazon SES (EU-WEST-1 region)"
echo "   🔹 View test emails: http://localhost:8025"
echo ""
echo "   For production SES setup:"
echo "   1. Verify sender domain/email in AWS SES console"
echo "   2. Update SMTP credentials in .env.production.local"
echo "   3. Test with: npx tsx scripts/test-ses-email.ts <email>"
echo ""
echo "📚 Documentation:"
echo "   - README: ./README.md"
echo "   - SES Setup: ./SES_SETUP.md"
echo "   - Implementation Plan: ./IMPLEMENTATION_PLAN.md"
echo "   - Project Roadmap: ./ROADMAP.md"
echo ""
echo "🎯 Setup Complete! Your development environment is ready."
echo ""
echo "🚀 To start developing:"
echo "   npm run dev"
echo ""
echo "💡 Pro Tips:"
echo "   - Use 'npm run lint' to check code quality"
echo "   - Use 'npm run typecheck' for TypeScript validation"
echo "   - Database viewer: npx prisma studio"
echo "   - Email testing: http://localhost:8025"