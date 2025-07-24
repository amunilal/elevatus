# ElevateUs Employee Tracker

A comprehensive employee management system built with Next.js 14, TypeScript, Prisma, and Neon database. Features dual portal architecture for employers and employees with South African compliance (BCEA, POPIA).

> ✅ **Production Ready**: Fully tested setup with automated CI/CD pipeline and database branching

## 🚀 Features

### Employer Portal
- **Employee Management**: Complete CRUD operations with South African ID validation
- **Attendance Tracking**: Real-time monitoring with reports, exports, settings, and bulk operations
- **Leave Management**: BCEA-compliant leave with policies, reports, exports, and bulk operations
- **Quick Actions Dashboard**: Fully functional navigation to all management features
- **Performance Reviews**: Complete Kanban-style review system with task management
- **Learning & Development**: Training and development tracking (planned)
- **Reports & Analytics**: Comprehensive reporting dashboard (planned)

### Employee Portal  
- **Profile Management**: Self-service profile updates with banking details
- **Attendance View**: Personal attendance history and statistics
- **Leave Requests**: Submit and track leave applications
- **Performance View**: Review personal performance metrics (planned)
- **Learning Portal**: Access training materials and progress (planned)

### Performance Review System
- **Kanban Task Board**: Visual task management with To do/In Progress/Complete/On hold columns
- **Employee Selection**: Choose from active employees to start reviews
- **Review History**: Track completed, in-progress, and draft reviews with progress indicators
- **Complete Task Management**: Full CRUD operations with drag & drop functionality
- **Interactive Task Creation**: Add tasks directly to any column with dedicated + buttons in headers
- **Inline Task Editing**: Edit task titles and duration with keyboard shortcuts (Enter to save, Escape to cancel)
- **Duration Management**: Editable task duration fields (renamed from "Date Completed" to "Duration")
- **Task Operations**: Delete tasks with confirmation dialogs and visual feedback
- **Review Notes System**: Non-collapsible notes form with individual saved notes management, horizontal layout, and silent save functionality
- **Fixed Column Headers**: Task count badges properly contained within column boundaries
- **Status Tracking**: Visual progress bars and color-coded status indicators
- **Modern Interface**: Consistent design system with intuitive hover effects and transitions

### Technical Features
- **Dual Authentication**: Separate login systems for employers and employees
- **South African Compliance**: BCEA leave policies, POPIA data protection
- **Real-time Updates**: Live attendance tracking and notifications
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database Branching**: Automatic preview environments with Neon
- **CI/CD Pipeline**: GitHub Actions with automated testing and deployment
- **Development Test Data**: Auto-fill forms with realistic South African test data

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon (Serverless Postgres)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Database Branching**: Neon Database Branching
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 20.x or later
- npm or yarn
- Git
- Neon database account
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd elevatus-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production deployment
VERCEL_URL="your-vercel-domain"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database with sample data
npx tsx prisma/seed-simple.ts
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Quick Start

### 🚀 Quick Start (Recommended)
```bash
./setup.sh
```
This automated script handles:
- ✅ Dependency installation
- ✅ Docker services (PostgreSQL, Redis, MailHog)  
- ✅ Database migrations and seeding
- ✅ Development environment setup
- ✅ Team collaboration configuration

### Manual Setup
1. Follow installation steps above
2. Access employer portal: `/employer/login`
3. Access employee portal: `/employee/login`
4. Use seeded credentials or create new accounts

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and basic user info
- **Employee**: Employee profiles with South African compliance
- **Attendance**: Daily attendance tracking
- **LeaveRequest**: BCEA-compliant leave management
- **PerformanceReview**: Employee evaluations (planned)
- **LearningModule**: Training and development (planned)

### South African Compliance
- **ID Number Validation**: 13-digit SA ID format
- **BCEA Leave Types**: Annual, Sick, Maternity, Paternity, Study
- **Banking Details**: SA bank account validation
- **Currency**: ZAR (South African Rand)

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
```

### Development Test Data
In development mode (`NODE_ENV=development`), forms include "Fill Test Data" buttons that automatically populate forms with realistic South African data:

- **Employee Forms**: Names, SA ID numbers, banking details, addresses across provinces
- **Attendance Forms**: Realistic attendance records with different statuses  
- **Leave Forms**: BCEA-compliant leave requests with proper reasons
- **Smart Dropdowns**: Department-specific positions, major SA banks, realistic addresses

This feature speeds up testing and development by eliminating manual data entry.

### Database Management
```bash
# View database in browser
npx prisma studio

# Reset database (destructive)
npx prisma db push --force-reset

# Generate migration
npx prisma migrate dev

# Deploy migrations
npx prisma migrate deploy
```

### Docker Development
```bash
# Start local database
docker-compose up -d

# Stop database
docker-compose down
```

## 🚀 Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard

### Automated Deployment Script
```bash
./scripts/deploy.sh
```

### Environment Variables for Production
```env
DATABASE_URL="your-neon-database-url"
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 🔄 GitHub Actions Workflow

### Automatic Database Branching
The repository includes a GitHub Actions workflow that:

1. **Creates database branch** for each pull request
2. **Runs migrations** on the branch database  
3. **Seeds test data** automatically
4. **Deploys preview** environment to Vercel
5. **Posts schema diff** comments on PRs
6. **Cleans up** database branch when PR is closed

### Required Secrets & Variables

#### Repository Variables
- `NEON_PROJECT_ID`: Your Neon project ID

#### Repository Secrets  
- `NEON_API_KEY`: Neon database API key
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Workflow Features
- **Concurrency Control**: Prevents multiple runs per PR
- **Schema Diff Comments**: Shows database changes in PR comments
- **Preview Environments**: Isolated database for each PR
- **Automatic Cleanup**: Database branches deleted when PR closes
- **Status Updates**: PR comments with deployment status

### Setting Up the Workflow

1. **Configure Neon Database**:
   - Create a Neon project
   - Get your project ID and API key
   - Add as repository variables/secrets

2. **Configure Vercel**:
   - Create Vercel project
   - Get deployment tokens and IDs
   - Add as repository secrets

3. **Enable Workflow**:
   - Workflow runs automatically on PR events
   - Creates preview environment for testing
   - Provides isolated database for each PR

## 📱 Features Overview

### Current Features ✅
- Complete employee management system with modern UI design
- Real-time attendance tracking with comprehensive reporting
- BCEA-compliant leave management with policies and bulk operations
- Employee self-service portal with updated design system
- Fully functional Quick Actions dashboard with color-coordinated actions
- Complete performance review system with fully interactive Kanban-style task boards
- Individual review pages with seamless drag & drop task management across all columns
- Comprehensive task operations: create, edit, delete, and move with real-time updates
- Column-specific add task buttons with color-coded hover states and auto-focus editing
- Review history dashboard with progress tracking and status management
- Advanced review notes section with character counting, save states, and loading indicators
- **Report Analyst Dashboard**: Comprehensive reporting interface with 6 report types
  - Attendance Report: Track employee attendance patterns and trends
  - Leave Analysis: Analyze leave patterns and balances
  - Performance Overview: Review performance metrics and reviews
  - Payroll Summary: Employee compensation and deductions
  - Compliance Report: BCEA and POPIA compliance status
  - Custom Report: Build custom reports with flexible parameters
- Advanced export and import capabilities
- South African compliance features
- Responsive mobile-first design with brand-consistent styling
- Modern design system with consistent bg-bg-base, nav-white theming
- Updated form containers with white backgrounds across all pages
- Database branching for PRs
- Automated CI/CD pipeline
- Development test data with auto-fill functionality
- Unified design system with custom icons and coordinated color palette
- Enhanced user experience with consistent navigation and branding

### Recent UI/UX Improvements ✨
- **Report Analyst Dashboard**: Complete reporting interface implementation
  - 6 comprehensive report types with color-coded cards and descriptions
  - Interactive date range selector (week, month, quarter, year)
  - Visual report selection with hover effects and generate functionality
  - Professional layout with consistent design system integration
- **Navigation Fix**: Fixed "Report Analyst page errors out" issue in employer dashboard
- **Build System Improvements**: Resolved all TypeScript compilation errors and JSX structure issues
- **Badge Component Updates**: Corrected variant types for employee status indicators (success/warning/error)
- **Review Page Optimization**: Clean, maintainable code structure with proper drag & drop functionality
- **Home Page Redesign**: Complete visual overhaul to match elevatus.mad.app reference design
  - Custom SVG logo with gradient stroke in circular design
  - Large "ElevateUs" gradient title with proper brand colors
  - "Employee Tracker" subtitle with improved typography
  - Redesigned portal buttons with gradient hover effects
  - Exact color matching for feature cards (#B8E6D1, #D4C5F9, #D4E8A8)
  - Professional layout with proper spacing and responsive design
- **Dashboard Redesign**: Removed "Present Today" card, updated card titles for clarity
- **Employee List Enhancements**: Removed actions column, implemented clickable rows with purple hover
- **Right-Side Sidebar**: Full-width (50%) slide-in sidebar with drag-to-resize functionality (30%-90%)
- **Navigation Updates**: Consistent logo design across all pages, dashboard button in nav bar
- **Search & Filters**: Clean white background design with focus states, removed gradient styling
- **Task Duration Editing**: Enhanced task management with editable duration fields and improved placeholder text
- **Review Notes Redesign**: Non-collapsible form with individual note management, horizontal layout, and trash can delete icons
- **Simplified Notes Display**: Clean design matching form styling with content-hugging backgrounds and silent save functionality

### Planned Features 🚧
- Advanced review analytics and reporting features
- Review templates and automated task generation
- Learning & development portal
- Advanced reporting and analytics
- Mobile app (React Native)
- Integration with payroll systems
- Advanced compliance reporting

## 🧪 Testing

### Run Tests
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Database Testing
Each PR gets its own isolated database branch for testing, ensuring:
- No test data pollution
- Safe schema changes
- Parallel development
- Clean environments

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
If you see `password authentication failed for user 'neondb_owner'`:

1. **Check environment files**: The `.env.development.local` file (created by Vercel CLI) may be overriding local settings
   ```bash
   mv .env.development.local .env.development.local.backup
   ```

2. **Ensure Docker is running**: Start Docker Desktop and run:
   ```bash
   docker-compose up -d
   ```

3. **Apply database schema**:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npx prisma db push
   ```

4. **Seed the database**:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/elevatus_dev" npm run db:seed
   ```

#### Port Conflicts
If port 3000 is in use:
- The app will automatically try port 3001
- Or manually kill the process: `lsof -i :3000` then `kill -9 <PID>`

#### Docker Issues
```bash
# Reset Docker services
docker-compose down -v
docker-compose up -d
```

#### Environment Variables Not Loading
Ensure you're in the correct directory and the `.env.local` file exists:
```bash
pwd  # Should be /path/to/elevatus-tracker
ls -la .env*  # Should show .env.local
```

## 📖 API Documentation

### Employee Endpoints
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee  
- `GET /api/employees/[id]` - Get employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Attendance Endpoints
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `GET /api/attendance/stats` - Attendance statistics

### Leave Endpoints
- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/[id]` - Update leave status
- `GET /api/leave/stats` - Leave statistics

### Health Check
- `GET /api/health` - Application and database health

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open pull request

### Development Workflow
1. **Create PR**: Automatic database branch created
2. **Review Changes**: Schema diff posted to PR
3. **Test Preview**: Isolated environment with test data
4. **Merge**: Database branch automatically cleaned up

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/elevatus-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/elevatus-tracker/discussions)
- **Email**: support@elevatus-tracker.com

## 📞 Contact

- **Developer**: Ashveer Munil
- **Company**: ElevateUs
- **Email**: ashveer@elevatus.co.za
- **Website**: [elevatus.co.za](https://elevatus.co.za)

## 📈 Status

- ✅ **Core Features**: Complete employee management, attendance tracking, leave management
- ✅ **Quick Actions**: All employer dashboard quick actions fully functional with color coordination
- ✅ **Performance Reviews**: Complete interactive Kanban system with full task lifecycle management
- ✅ **Report Analyst**: Comprehensive reporting dashboard with 6 report types and date filtering
- ✅ **Modern Design**: Consistent design system applied across all pages
- ✅ **Advanced Operations**: Bulk operations, exports, reports, and policy management
- ✅ **CI/CD Pipeline**: GitHub Actions with Neon database branching
- ✅ **Production Ready**: Fully tested and documented
- ✅ **Setup Verified**: Automated installation with `./setup.sh`
- ⚠️ **In Progress**: Advanced review analytics, learning modules (Phase 2)

---

**Built with ❤️ for South African businesses**