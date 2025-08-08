import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Production seed script - Creates ONLY essential data
 * No dummy users, no test data, no demo credentials
 */
async function main() {
  console.log('🔐 Production Database Initialization')
  console.log('=====================================')
  
  // Check if this is really a production environment
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Warning: Not running in production mode!')
    console.warn('Set NODE_ENV=production to continue')
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise<string>((resolve) => {
      readline.question('Continue anyway? (yes/no): ', resolve)
    })
    
    readline.close()
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Seed cancelled')
      process.exit(0)
    }
  }
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      userType: 'EMPLOYER',
      employer: {
        role: 'SUPER_ADMIN'
      }
    }
  })
  
  if (existingAdmin) {
    console.log('✅ Super Admin already exists. Skipping creation.')
    console.log('   Use the admin panel to create additional users.')
    return
  }
  
  // Get admin credentials from environment or prompt
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD
  
  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set')
    console.error('   Set these environment variables and run again:')
    console.error('   INITIAL_ADMIN_EMAIL=admin@yourcompany.com \\')
    console.error('   INITIAL_ADMIN_PASSWORD=SecurePassword123! \\')
    console.error('   npm run db:seed:production')
    process.exit(1)
  }
  
  // Validate password strength
  if (adminPassword.length < 12) {
    console.error('❌ Error: Password must be at least 12 characters')
    process.exit(1)
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(adminPassword)) {
    console.error('❌ Error: Password must contain:')
    console.error('   - At least one uppercase letter')
    console.error('   - At least one lowercase letter')
    console.error('   - At least one number')
    console.error('   - At least one special character')
    process.exit(1)
  }
  
  try {
    // Create the initial super admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        userType: 'EMPLOYER',
        isActive: true,
        employer: {
          create: {
            role: 'SUPER_ADMIN',
            permissions: {
              all: true,
              canManageUsers: true,
              canManageSettings: true,
              canViewReports: true,
              canManageReviews: true,
              canManageEmployees: true
            }
          }
        }
      }
    })
    
    console.log('✅ Production setup complete!')
    console.log('================================')
    console.log(`📧 Admin Email: ${admin.email}`)
    console.log('🔑 Password: [Hidden for security]')
    console.log('')
    console.log('⚠️  IMPORTANT: ')
    console.log('1. Store these credentials securely')
    console.log('2. Change the password after first login')
    console.log('3. Enable 2FA if available')
    console.log('4. Clear environment variables after setup')
    console.log('')
    console.log('Next steps:')
    console.log('1. Log in at: ' + (process.env.APP_URL || 'https://your-domain.com') + '/employer/login')
    console.log('2. Create additional admin users from the dashboard')
    console.log('3. Set up departments and teams')
    console.log('4. Import or create employee records')
    
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })