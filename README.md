# ElevatUs Employee Tracker

A comprehensive employee management system built with Next.js 14, TypeScript, Prisma, and Neon database. Features dual portal architecture for employers and employees with South African compliance (BCEA, POPIA).

> ✅ **Production Ready**: Fully tested setup with automated CI/CD pipeline and database branching

## 🔒 Security Features

- **No default credentials**: All test/demo users removed for production security
- **Password visibility toggle**: Show/hide password option on all login forms  
- **Password reset system**: Complete forgot password and reset functionality with secure token-based flow
- **Custom authentication flow**: Dedicated login/forgot password pages for each portal
- **Secure middleware**: Custom authentication middleware with proper route protection and authentication redirects
- **JWT-based sessions**: Role-based access control with NextAuth.js
- **Protected routes**: All employer/employee pages require proper authentication and redirect to appropriate login
- **Clean production deployment**: No test data, mock data, or test scripts in production environment

## 🚀 Features

### Employer Portal
- **Employee Management**: Complete CRUD operations with South African ID validation and live database integration
- **Employer Management**: Complete multi-employer system with role-based access control and account administration
- **Dashboard Statistics**: Real-time stats from database - Total Employees, Pending Reviews, Completed Reviews
- **Attendance Tracking**: Real-time monitoring with reports, exports, settings, and bulk operations
- **Leave Management**: BCEA-compliant leave with policies, reports, exports, and bulk operations
- **Quick Actions Dashboard**: Fully functional navigation to all management features including employer administration
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
- **Employee Selection**: Choose from active employees to start reviews with automatic review creation
- **Review History**: Track completed, in-progress, and draft reviews with real-time API integration
- **Complete Task Management**: Full CRUD operations with drag & drop functionality and real-time database sync
- **Interactive Task Creation**: Add tasks directly to any column with dedicated + buttons in headers
- **Inline Task Editing**: Edit task titles and duration with keyboard shortcuts (Enter to save, Escape to cancel)
- **Duration Management**: Editable task duration fields (renamed from "Date Completed" to "Duration")
- **Task Archive System**: Archive completed tasks with toggle view and unarchive functionality
- **Protected Completed Tasks**: Edit and delete buttons removed from completed tasks for data integrity
- **Automatic Save**: All task movements and changes automatically saved to database via API
- **Review Notes System**: Database-persisted notes with automatic saving and loading
- **Review Creation Flow**: Seamless review creation from Start Review page with API integration
- **Complete Review Workflow**: Smart completion with incomplete task warnings and confirmation dialogs
- **Real-time Data**: Connected to Prisma database with proper review, employee, and goal relationships
- **Progress Tracking**: Accurate task completion tracking based on actual database goals
- **Status Management**: Proper review status handling (NOT_STARTED, IN_PROGRESS, COMPLETED)
- **Fixed Column Headers**: Task count badges properly contained within column boundaries
- **Modern Interface**: Consistent design system with intuitive hover effects and transitions

### Technical Features
- **Dual Authentication**: Separate login systems for employers and employees with custom middleware
- **Password Management**: Visibility toggles and complete forgot password flow
- **South African Compliance**: BCEA leave policies, POPIA data protection
- **Real-time Updates**: Live attendance tracking and notifications
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database Branching**: Automatic preview environments with Neon
- **CI/CD Pipeline**: GitHub Actions with automated testing and deployment
- **Production Ready**: Clean deployment without any test data

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon (Serverless Postgres)
- **Authentication**: NextAuth.js
- **Email Service**: Amazon SES (SMTP)
- **UI Components**: Custom React components with TypeScript
- **Notifications**: Custom toast system with Portal API
- **Modals**: Custom dialog system with accessibility features
- **State Management**: React hooks with custom hooks
- **Deployment**: Vercel
- **Database Branching**: Neon Database Branching
- **CI/CD**: GitHub Actions

## 🎨 UI/UX Components

### Toast Notification System
- **Location**: `/components/ui/Toast.tsx`
- **Hook**: `/hooks/useToast.tsx`
- **Features**: 
  - Auto-dismiss with configurable duration
  - Success, error, warning, and info types
  - Smooth slide animations
  - Portal-based rendering
  - Stack management for multiple toasts
  - Accessible with ARIA labels

### Dialog System
- **Location**: `/components/ui/Dialog.tsx`
- **Components**:
  - Base `Dialog` component with full customization
  - `ConfirmDialog` for confirmations with visual icons
  - `PromptDialog` for text input with validation
- **Features**:
  - Escape key and overlay click handling
  - Keyboard navigation support
  - Size variants (sm, md, lg, xl)
  - Custom button variants
  - Input validation for prompts
  - Smooth scale and fade animations

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

# Database is ready for use (no test data included)
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
- ✅ Database migrations
- ✅ Development environment setup
- ✅ Team collaboration configuration

### Manual Setup
1. Follow installation steps above
2. Access employer portal: `/employer/login`
3. Access employee portal: `/employee/login`
4. Create user accounts through admin interface

## 🔐 Authentication System

### Login Flow
- **Employer Portal**: `/employer/login` - Administrative access with management permissions
- **Employee Portal**: `/employee/login` - Self-service employee access
- **Password Visibility**: Toggle show/hide on all password fields
- **Remember Me**: Persistent sessions with secure JWT tokens

### Password Management
- **Forgot Password**: `/employer/forgot-password` and `/employee/forgot-password`
- **Password Reset**: `/employer/reset-password` and `/employee/reset-password` with secure token validation
- **Email Notifications**: HTML email templates with reset links that expire after 1 hour
- **Database Security**: Reset tokens stored securely with expiration timestamps
- **Token Validation**: Comprehensive validation of reset tokens and user authorization

### Route Protection
- **Custom Middleware**: Protects routes based on user type and authentication status
- **Role-Based Access**: Separate dashboards and permissions for employers vs employees with three-tier employer roles
- **API Protection**: Secure endpoints with user type validation

### Employer Roles & Permissions
- **Super Admin**: Complete system access, can manage all employers and employees
- **HR Admin**: Employee management, reviews, leave administration, and HR-related functions
- **Manager**: Team oversight, performance reviews, and departmental employee management

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

# Deploy migrations (for production)
npx prisma migrate deploy

# Apply Prisma migration to Neon database (for existing databases)
DATABASE_URL="postgresql://username:password@your-neon-host/dbname" npx prisma migrate deploy

# Latest migration: 20250813171706_add_password_reset_fields  
# - Adds resetToken and resetTokenExpires fields for password reset functionality
# - Creates unique index for reset tokens
# Previous: 20250812174800_add_password_setup_fields
# - Makes password field nullable for new users
# - Adds passwordSetupToken, passwordSetupExpires, passwordSetupUsed fields
# - Creates unique index for password setup tokens
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

# Email Service - Amazon SES
SMTP_HOST="email-smtp.eu-west-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"
SMTP_FROM="noreply@your-verified-domain.com"
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
- **Complete employee management system** with modern UI design, live database integration, and dual account management options (deactivate vs. delete)
- **Multi-employer administration system** with role-based access control and comprehensive account management
- **Live Dashboard Statistics**: Real-time employee count, pending/completed reviews from database
- **Secure Authentication System**: Protected routes with automatic redirects to appropriate login pages
- Real-time attendance tracking with comprehensive reporting
- BCEA-compliant leave management with policies and bulk operations
- Employee self-service portal with updated design system
- **Email Notifications**: Transactional emails via Amazon SES for password resets, welcome emails, review notifications, and leave requests
- Fully functional Quick Actions dashboard with color-coordinated actions
- Complete performance review system with fully interactive Kanban-style task boards
- Individual review pages with seamless drag & drop task management across all columns
- Comprehensive task operations: create, edit, delete, move, and archive with real-time database sync
- Column-specific add task buttons with color-coded hover states and auto-focus editing
- Task archive system with toggle view for completed tasks and data protection
- Review history dashboard with progress tracking and status management
- Advanced review notes section with database persistence and automatic saving
- Complete Review workflow with smart validation and confirmation dialogs
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
- Production-ready codebase with all test data and scripts removed
- Unified design system with custom icons and coordinated color palette
- Enhanced user experience with consistent navigation and branding

### Latest Production Updates ⚡
- **Authentication Security**: Fixed and enhanced route protection middleware
  - All protected routes now properly redirect unauthenticated users to appropriate login pages
  - Enhanced middleware with proper NextAuth integration and JWT token validation
  - Fixed NEXTAUTH_URL configuration for development server port compatibility
  - Added comprehensive route protection for both employer and employee portals
  - **Last Login Tracking**: Users' lastLoginAt field now updates automatically during successful authentication
- **Dashboard Statistics**: Replaced hardcoded values with live database queries
  - Total Employees count now pulls from active Employee records
  - Pending Reviews count from NOT_STARTED and IN_PROGRESS review statuses
  - Completed Reviews count from COMPLETED review statuses
  - Created secure `/api/dashboard/stats` endpoint with employer authentication
- **Employee List Integration**: Fixed empty employee list with proper API authentication
  - Created missing authentication library with proper NextRequest handling
  - Fixed employee API endpoint authentication to work with NextAuth middleware
  - Employee list now displays real employee data from database
- **Email Notification System**: Complete user onboarding and password management
  - **Password Setup Tokens**: Secure token-based password setup system with 24-hour expiration
  - **Welcome Email Templates**: Professional HTML emails with setup links and branding
  - **Automated User Onboarding**: New employees automatically receive welcome emails with password setup links
  - **Password Setup Page**: Complete UI for secure password setting with validation and error handling
  - **Amazon SES Integration**: Production-ready email service with SMTP configuration
  - **User Account States**: Users created without passwords until they complete setup via email link
  - **Security Features**: Token validation, password complexity requirements, one-time use tokens
  - **Resend Password Setup**: Button in employer/employee lists to resend password setup emails when tokens expire
- **Password Reset System**: Comprehensive password reset functionality with secure token-based flow
  - **Forgot Password Pages**: Dedicated pages for employer and employee password reset requests
  - **Reset Password Pages**: Secure password reset interfaces with token validation and error handling
  - **Reset Token Management**: Database-stored tokens with 1-hour expiration and automatic cleanup
  - **Email Integration**: HTML email templates with reset links and security notices
  - **Comprehensive Validation**: Token verification, password strength requirements, and user authorization
  - **API Endpoints**: Complete `/api/auth/reset-password` endpoint with bcrypt password hashing
- **Enhanced Account Management**: Clear distinction between deactivating and deleting employee accounts
  - **Deactivate Account**: Soft delete that marks employee as inactive while preserving all data
  - **Delete Account**: Hard delete that permanently removes employee and all associated data
  - **Security Safeguards**: Double confirmation required for permanent deletions with typed verification
  - **Transaction Safety**: Database transactions ensure complete removal of both employee and user records
  - **Clear UI Indicators**: Color-coded buttons (yellow for deactivate, red for delete) with explanatory tooltips
  - **Warning System**: Informational panel explaining the difference between deactivate and delete actions
- **Modern UI/UX System**: Replaced all browser alerts with professional toast notifications and modal dialogs
  - **Toast Notification System**: Custom-built toast component with success, error, warning, and info types
  - **Modal Dialog System**: Professional confirmation and prompt dialogs with proper validation
  - **Enhanced User Experience**: Smooth animations, auto-dismiss functionality, and consistent positioning
  - **Improved Error Handling**: Clear, actionable error messages with proper visual feedback
  - **Accessibility Features**: Keyboard navigation, screen reader support, and focus management
  - **Consistent Design**: Color-coded notifications and dialogs that match the application's design system
- **Employer Management System**: Complete multi-employer administration with role-based access control
  - **Employer Creation**: Add new employers with Super Admin, HR Admin, and Manager roles
  - **Role-Based Permissions**: Three-tier permission system with appropriate access levels
  - **Account Management**: Professional employer list with search, filtering, and detailed sidebar
  - **Email Integration**: Automatic welcome emails with secure password setup links
  - **Dual Account Actions**: Deactivate (soft delete) vs Delete (permanent removal) with security safeguards
  - **Dashboard Integration**: New "Manage Employers" quick action tile with consistent design
  - **Toast Notifications**: Modern feedback system integrated throughout employer management workflow
  - **Consistent Department Selection**: Both new employer and employer edit forms use standardized department dropdowns
- **Production Cleanup**: Removed all test data and debugging artifacts
  - Eliminated hardcoded mock data from review pages and history
  - Removed all test scripts and dummy data creation files
  - Cleaned up temporary debugging files and test API endpoints
  - Production-ready codebase with no test artifacts

### Recent UI/UX Improvements ✨
- **Modern Design System Implementation**: Complete UI overhaul with new color palette and typography
  - Applied consistent color scheme across all components (primary/secondary buttons, badges, cards)
  - Updated typography: h1 (36px), h2 (20px), h3 (18px), p (16px), .text-sm (16px)
  - Implemented CSS custom properties for maintainable color system
  - Added gradient borders for Employee Portal badges with professional styling
  - Enhanced dashboard with new color-coded stat cards and hover effects
  - Updated button variants: primary (pink background), secondary (white with pink hover)
  - Applied typography updates to all pages including reviews history and dashboard
  - Removed "Employee Tracker" text from home page for cleaner branding
- **Complete Review System Enhancement**: Comprehensive task management with database integration
  - Archive functionality for completed tasks with toggle view and unarchive options
  - Protected completed tasks (edit/delete buttons removed) for data integrity
  - Real-time database synchronization for all task operations (create, update, delete, move)
  - Smart Complete Review workflow with incomplete task warnings and confirmation
  - Proper API integration with `/api/goals` endpoints for full CRUD operations
  - Refined task count pills with white background, black text, 9px border radius
  - Optimized pill positioning floating at top-right of columns with -20px offset
  - Clean visual design with removed drop shadows for modern appearance
  - Updated archive icon with custom SVG design and optimized sizing for visual consistency
  - Replaced all system alerts with professional custom modal dialogs
  - Enhanced delete task dialog with warning messages and proper confirmation flow
  - Improved archive task dialog with informative notes and consistent styling
  - Added comprehensive error handling with custom error dialogs
- **Employee List Table Enhancement**: Modernized employee list with improved data presentation
  - Converted from card-based layout to professional table format
  - Combined employee image, name, and email into single cohesive "Employee" column
  - Maintained clickable row functionality with purple hover states
  - Preserved employee sidebar with resizable functionality
  - Enhanced visual hierarchy with proper spacing and typography
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
  - Large "ElevatUs" gradient title with proper brand colors and simplified hero layout
  - Redesigned portal buttons with gradient hover effects
  - Exact color matching for feature cards (#B8E6D1, #D4C5F9, #D4E8A8)
  - Professional layout with proper spacing and responsive design
- **Dashboard Redesign**: Removed "Present Today" card, updated card titles for clarity
- **Employee List Enhancements**: Removed actions column, implemented clickable rows with purple hover
- **Right-Side Sidebar**: Full-width (50%) slide-in sidebar with drag-to-resize functionality (30%-90%)
- **Navigation Updates**: Consistent logo design across all pages, dashboard button in nav bar
- **Login Page Enhancements**: Unified employee and employer login page styling
  - Employee login updated to match employer login design system
  - Consistent use of Logo, Button, Input, and Card components
  - Applied brand color scheme and modern styling throughout
  - Added clickable logo navigation to home page on both login pages
  - Professional login system with consistent styling
- **Brand Consistency**: Updated all instances of "ElevateUs" to "ElevatUs" across codebase
  - Consistent branding in 16+ files including components, documentation, and scripts
  - Updated page titles, meta descriptions, and copyright notices
  - Simplified home page hero section by removing "Employee Tracker" subtitle
  - Streamlined brand presentation with focused "ElevatUs" gradient title
- **Search & Filters**: Clean white background design with focus states, removed gradient styling
- **Task Duration Editing**: Enhanced task management with editable duration fields and improved placeholder text
- **Review Notes Redesign**: Non-collapsible form with individual note management, horizontal layout, and trash can delete icons
- **Simplified Notes Display**: Clean design matching form styling with content-hugging backgrounds and silent save functionality
- **Employee Management Enhancements**: 
  - Added circular "Add New Employee" icon button for clean interface design
  - Fully functional employee profile editing with inline field modification
  - Comprehensive edit mode with Save/Cancel functionality and proper error handling
  - Editable employee details: name, role, department, hire date, contact information
  - Secure employee deletion with confirmation dialog (only available in edit mode)
  - Seamless transition between view and edit modes with consistent styling
- **Employee Portal Optimization**: Enhanced employee experience with focused functionality
  - Removed attendance tracking features (clock in/out, hours tracking) from dashboard and navigation
  - Created comprehensive employee review system with dedicated pages
  - Added employee reviews list page showing all assigned performance reviews
  - Implemented detailed review view page with goals, progress tracking, and notes
  - Integrated review access into employee dashboard with pinned latest review section
  - Latest review card shows progress bar, completion percentage, and quick access to details
  - Updated quick actions grid to include "My Reviews" with professional styling
  - Fixed courses completed icon with proper success color scheme (green background)

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

### Authentication Endpoints
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/reset-password` - Validate reset token
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/setup-password` - Validate setup token
- `POST /api/auth/setup-password` - Set password with setup token
- `POST /api/auth/resend-password-setup` - Resend password setup email for expired tokens

### Employee Endpoints
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee  
- `GET /api/employees/[id]` - Get employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee (supports ?action=deactivate|delete)

### Employer Endpoints
- `GET /api/employers` - List all employers with user information
- `POST /api/employers` - Create new employer with email notification
- `GET /api/employers/[id]` - Get specific employer details
- `PUT /api/employers/[id]` - Update employer information and role
- `DELETE /api/employers/[id]` - Delete or deactivate employer (supports ?action=deactivate|delete)

### Attendance Endpoints
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `GET /api/attendance/stats` - Attendance statistics

### Leave Endpoints
- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/[id]` - Update leave status
- `GET /api/leave/stats` - Leave statistics

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Real-time dashboard statistics

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
- **Company**: ElevatUs
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