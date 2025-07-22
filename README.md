# Elevatus Employee Tracker

A sophisticated, user-friendly employee management system designed for South African businesses under the Catalyst brand. The application fosters continuous growth, streamlines performance management, and aligns individual development with company objectives while ensuring full compliance with South African labour laws.

## 🚀 Features

### Dual Portal Architecture
- **Employer Portal**: Comprehensive management interface for HR admins, managers, and administrators
- **Employee Portal**: Self-service interface for individual employees with simplified, mobile-first design

### Core Modules
- **Employee Management**: Complete employee lifecycle management with document handling
- **Attendance Tracking**: Real-time attendance monitoring with BCEA-compliant overtime calculations
- **Leave Management**: Full BCEA compliance with automated leave balance calculations
- **Performance Reviews**: Modern review interface with 360-degree feedback and goal tracking
- **Learning & Development**: Course management with badge system and skill tracking

### South African Compliance
- **POPIA Compliance**: Full data protection compliance
- **BCEA Compliance**: Labour law compliance for leave, overtime, and working hours
- **South African Localization**: ZAR currency, SA date formats, public holidays
- **UIF Integration**: Unemployment Insurance Fund documentation

### Deployment Flexibility
- **Traditional Hosting**: Docker-based development with VPS/cloud hosting
- **Serverless Ready**: Vercel deployment with 50-75% cost savings
- **Global Performance**: Edge network optimization for South African users
- **Auto-scaling**: Handle traffic spikes without infrastructure management

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Development**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- Docker Desktop (recommended)
- Git

## 📊 Development Status

![Development Progress](https://img.shields.io/badge/Phase%201-Complete-green)
![Application Status](https://img.shields.io/badge/Status-Running-brightgreen)
![Next Phase](https://img.shields.io/badge/Phase%202-Ready-yellow)
![Overall Progress](https://img.shields.io/badge/Overall-20%25-blue)

### ✅ Phase 1 Complete: Foundation & Setup (Week 1-2)
- ✅ Next.js 14+ project setup with TypeScript
- ✅ Dual portal architecture implementation
- ✅ Complete database schema with South African compliance
- ✅ Docker development environment running
- ✅ Authentication system foundation
- ✅ Basic UI components and layouts
- ✅ Database migrations and seed data complete
- ✅ **Application successfully running on localhost:3000**

### 🎯 Application Ready for Development
- **Landing Page**: Portal selection with feature overview ✅ 
- **Authentication**: Separate login flows for employer/employee portals ✅
- **Dashboards**: Basic dashboard layouts with demo data ✅
- **Database**: Complete schema with 20+ models running on PostgreSQL ✅
- **Development Environment**: Docker services operational ✅
- **Setup Automation**: One-command setup script working ✅

### 🚀 Live Demo Access
- **Main Application**: http://localhost:3000
- **Employer Portal**: http://localhost:3000/employer/login
- **Employee Portal**: http://localhost:3000/employee/login
- **Email Testing**: http://localhost:8025 (MailHog UI)

### 🔑 Demo Credentials
**Employer Portal:**
- Super Admin: admin@company.co.za / admin123
- HR Admin: hr@company.co.za / hr123
- Manager: manager@company.co.za / manager123

**Employee Portal:**
- Employee: john.doe@company.co.za / employee123
- Employee: jane.smith@company.co.za / employee123

### 🚧 Current Development Focus
Ready to begin Phase 2: Core UI Components and Infrastructure

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/amunilal/elevatus.git
   cd elevatus
   ```

2. **Run the setup script**
   ```bash
   cd elevatus-tracker
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Main site: http://localhost:3000
   - Employer Portal: http://localhost:3000/employer/login
   - Employee Portal: http://localhost:3000/employee/login
   - Prisma Studio: http://localhost:5555 (run: `npm run db:studio`)
   - MailHog UI: http://localhost:8025

## 👥 Team Development Setup

### For Team Members (Network Access)
1. **Get the host's IP address** from setup.sh output
2. **Access the application** using the network IP:
   - Main site: http://[HOST-IP]:3000
   - Employer Portal: http://[HOST-IP]:3000/employer/login
   - Employee Portal: http://[HOST-IP]:3000/employee/login

### Prerequisites for Team Members
- Same WiFi/LAN network as the host machine
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Demo credentials (provided in setup output)

### External Team Access (Optional)
For remote team members, consider using:
- **ngrok**: `npx ngrok http 3000` (requires ngrok account)
- **cloudflared**: Cloudflare tunnel for secure access
- **VSCode Live Share**: For collaborative coding sessions

## 🔑 Demo Credentials

### Employer Portal
- **Super Admin**: admin@company.co.za / admin123
- **HR Admin**: hr@company.co.za / hr123
- **Manager**: manager@company.co.za / manager123

### Employee Portal
- **Employee**: john.doe@company.co.za / employee123
- **Employee**: jane.smith@company.co.za / employee123

## 🛠 Development Tools

- **Prisma Studio**: `DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npx prisma studio`
- **MailHog**: Email testing UI (http://localhost:8025)
- **Database Migrations**: `DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npx prisma migrate dev`
- **Database Seeding**: `npm run db:seed`
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`

## 🔧 Troubleshooting

### Common Setup Issues

**Dependency conflicts:**
```bash
# If you encounter date-fns version conflicts
npm install --legacy-peer-deps
```

**Docker not running:**
```bash
# Start Docker services
docker-compose up -d

# Check if containers are running
docker ps
```

**Database connection issues:**
```bash
# Reset database
docker-compose down
docker-compose up -d
sleep 10
DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npx prisma migrate dev --name init
npm run db:seed
```

**CSS/Tailwind issues:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🏗️ Architecture Options

The application is designed to support both traditional and serverless deployments:

### Current: Traditional Server Architecture
- **Development**: Docker with PostgreSQL, Redis, MailHog
- **Production**: VPS/Server hosting with managed databases
- **Cost**: R3,800-R10,070/month

### Available: Serverless Architecture
- **Platform**: Vercel + Neon PostgreSQL (recommended)
- **Benefits**: 50-75% cost reduction, auto-scaling, global edge network
- **Cost**: R950-R2,375/month
- **Migration**: See [SERVERLESS_MIGRATION_PLAN.md](./SERVERLESS_MIGRATION_PLAN.md)

## 📁 Project Structure

```
elevatus-tracker/
├── app/                    # Next.js app directory
│   ├── employer/          # Employer portal pages
│   ├── employee/          # Employee portal pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── employer/         # Employer-specific components
│   └── employee/         # Employee-specific components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 📚 Documentation

- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Complete 16-week development roadmap
- **[ROADMAP.md](./ROADMAP.md)** - GitHub-compatible project roadmap with milestones
- **[SERVERLESS_MIGRATION_PLAN.md](./SERVERLESS_MIGRATION_PLAN.md)** - Comprehensive serverless deployment guide

## 🗺 Development Roadmap

The project follows a structured 16-week development plan:

1. **Weeks 1-2**: Project setup and foundation
2. **Weeks 3-4**: Core UI components and infrastructure
3. **Weeks 5-6**: Employee management module
4. **Weeks 7-8**: Attendance and leave management
5. **Weeks 9-10**: Performance review system
6. **Weeks 11-12**: Learning & development module
7. **Weeks 13-14**: Integration and polish
8. **Weeks 15-16**: Testing and deployment

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed milestones.

## 🧪 Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`

## 📊 Database Schema

The application uses a comprehensive database schema designed for South African businesses:

- User management with dual portal support
- Employee profiles with SA-specific fields (ID numbers, UIF, etc.)
- BCEA-compliant leave management
- Performance review workflows
- Learning management with badge system
- Audit trails for compliance

## 🔒 Security

- HTTPS everywhere
- Data encryption at rest
- POPIA compliance
- Role-based access control
- Session isolation between portals
- Audit trails for all actions

## 🌍 Localization

- South African English (en-ZA)
- ZAR currency formatting
- South African date formats (DD/MM/YYYY)
- Public holidays calendar
- BCEA labour law compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, please contact:
- Email: support@catalyst.co.za
- GitHub Issues: [Report bugs and request features](https://github.com/yourusername/elevatus/issues)

---

Made with ❤️ in South Africa 🇿🇦