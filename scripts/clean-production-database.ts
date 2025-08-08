import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * DANGER: This script will DELETE ALL DATA from the production database
 * Only run this if you're absolutely sure you want to start fresh
 */
async function cleanDatabase() {
  console.log('⚠️  WARNING: Production Database Clean')
  console.log('=====================================')
  console.log('This will DELETE ALL DATA from your database!')
  console.log('')
  
  // Safety check
  if (process.env.CONFIRM_CLEAN !== 'YES_DELETE_EVERYTHING') {
    console.error('❌ Safety check failed!')
    console.error('To run this script, set environment variable:')
    console.error('CONFIRM_CLEAN=YES_DELETE_EVERYTHING')
    console.error('')
    console.error('Example:')
    console.error('CONFIRM_CLEAN=YES_DELETE_EVERYTHING DATABASE_URL="your-db-url" npx tsx scripts/clean-production-database.ts')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is required')
    process.exit(1)
  }

  console.log('🗑️  Starting database cleanup...')
  console.log('')

  try {
    // Delete in correct order to respect foreign key constraints
    console.log('Deleting audit logs...')
    await prisma.auditLog.deleteMany()
    
    console.log('Deleting documents...')
    await prisma.document.deleteMany()
    
    console.log('Deleting user badges...')
    await prisma.userBadge.deleteMany()
    
    console.log('Deleting badges...')
    await prisma.badge.deleteMany()
    
    console.log('Deleting enrollments...')
    await prisma.enrollment.deleteMany()
    
    console.log('Deleting course materials...')
    await prisma.courseMaterial.deleteMany()
    
    console.log('Deleting courses...')
    await prisma.course.deleteMany()
    
    console.log('Deleting goals...')
    await prisma.goal.deleteMany()
    
    console.log('Deleting reviews...')
    await prisma.review.deleteMany()
    
    console.log('Deleting review cycles...')
    await prisma.reviewCycle.deleteMany()
    
    console.log('Deleting leave balances...')
    await prisma.leaveBalance.deleteMany()
    
    console.log('Deleting leaves...')
    await prisma.leave.deleteMany()
    
    console.log('Deleting attendance records...')
    await prisma.attendance.deleteMany()
    
    console.log('Deleting teams...')
    await prisma.team.deleteMany()
    
    console.log('Deleting employees...')
    await prisma.employee.deleteMany()
    
    console.log('Deleting employers...')
    await prisma.employer.deleteMany()
    
    console.log('Deleting sessions...')
    await prisma.session.deleteMany()
    
    console.log('Deleting users...')
    await prisma.user.deleteMany()
    
    console.log('')
    console.log('✅ Database cleaned successfully!')
    console.log('   All tables are now empty.')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run production seed to create admin user:')
    console.log('   INITIAL_ADMIN_EMAIL=admin@yourcompany.com \\')
    console.log('   INITIAL_ADMIN_PASSWORD=YourSecurePassword123! \\')
    console.log('   NODE_ENV=production npm run db:seed:production')
    console.log('')
    console.log('2. Deploy the cleaned application')
    console.log('3. Log in with your new admin credentials')
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    process.exit(1)
  }
}

cleanDatabase()
  .catch((e) => {
    console.error('❌ Clean failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })