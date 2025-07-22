#!/bin/bash

echo "🚀 Setting up Elevatus Employee Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or later."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL manually."
else
    echo "🐳 Starting Docker services..."
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
fi

# Navigate to the tracker directory
cd elevatus-tracker

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Setting up database..."
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the development server:"
echo "   cd elevatus-tracker"
echo "   npm run dev"
echo ""
echo "📱 The application will be available at:"
echo "   - Main site: http://localhost:3000"
echo "   - Employer Portal: http://localhost:3000/employer/login"
echo "   - Employee Portal: http://localhost:3000/employee/login"
echo "   - Prisma Studio: http://localhost:5555 (run: npm run db:studio)"
echo "   - MailHog UI: http://localhost:8025"
echo ""
echo "🔑 Demo login credentials:"
echo "   Employer: admin@company.co.za / admin123"
echo "   Employee: john.doe@company.co.za / employee123"