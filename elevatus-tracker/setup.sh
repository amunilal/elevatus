#!/bin/bash

echo "🚀 Setting up ElevatUs Employee Tracker..."
echo "📋 Team Setup Guide for Collaborative Development"
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

# Generate Prisma client
echo "🔧 Setting up database..."
npx prisma generate

# Run database migrations with explicit DATABASE_URL
echo "🗄️ Running database migrations..."
DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database with sample data..."
if DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npm run db:seed; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Database seeding completed with warnings (this is normal if data already exists)"
fi

# Create uploads directory
echo "📁 Setting up file storage..."
mkdir -p uploads
chmod 755 uploads

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
echo "   - Prisma Studio: DATABASE_URL=\"postgresql://postgres:password@localhost:5432/elevatus_dev\" npx prisma studio"
echo "   - MailHog UI: http://localhost:8025 (Email testing)"
echo "   - Database Reset: npm run db:seed"
echo ""
echo "🔑 Demo login credentials:"
echo "   👨‍💼 Employer Portal:"
echo "      - Super Admin: admin@company.co.za / admin123"
echo "      - HR Admin: hr@company.co.za / hr123"
echo "      - Manager: manager@company.co.za / manager123"
echo ""
echo "   👥 Employee Portal:"
echo "      - Employee 1: john.doe@company.co.za / employee123"
echo "      - Employee 2: jane.smith@company.co.za / employee123"
echo "      - Employee 3: peter.jones@company.co.za / employee123"
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
echo "📚 Documentation:"
echo "   - Implementation Plan: ../IMPLEMENTATION_PLAN.md"
echo "   - Serverless Migration: ../SERVERLESS_MIGRATION_PLAN.md"
echo "   - Project Roadmap: ../ROADMAP.md"
echo ""
echo "🎯 Ready for Phase 2 development!"