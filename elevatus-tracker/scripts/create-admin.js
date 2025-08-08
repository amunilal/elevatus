#!/usr/bin/env node

/**
 * Interactive Admin User Creation Script
 * Creates a secure admin user for production environments
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function printSuccess(message) { print('green', `✓ ${message}`) }
function printError(message) { print('red', `✗ ${message}`) }
function printWarning(message) { print('yellow', `⚠ ${message}`) }
function printInfo(message) { print('blue', `→ ${message}`) }

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    const stdin = process.stdin
    let password = ''
    
    process.stdout.write(prompt)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    
    stdin.on('data', function listener(ch) {
      ch = ch.toString('utf8')
      
      if (ch === '\n' || ch === '\r') {
        stdin.removeListener('data', listener)
        stdin.setRawMode(false)
        stdin.pause()
        process.stdout.write('\n')
        resolve(password)
      } else if (ch === '\u0003') {
        // Ctrl+C
        process.exit()
      } else if (ch === '\u007f') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write('\b \b')
        }
      } else {
        password += ch
        process.stdout.write('*')
      }
    })
  })
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Invalid email format'
  }
  return null
}

function validatePassword(password) {
  if (password.length < 12) {
    return 'Password must be at least 12 characters long'
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number'
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)'
  }
  
  // Check for common weak passwords
  const weakPasswords = [
    'password123!', 'admin123456!', 'welcome123!', 
    'qwerty123456!', '123456789!', 'password!123'
  ]
  
  if (weakPasswords.includes(password.toLowerCase())) {
    return 'This password is too common and insecure'
  }
  
  return null
}

async function checkExistingAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        userType: 'EMPLOYER',
        employer: {
          role: 'SUPER_ADMIN'
        }
      },
      include: {
        employer: true
      }
    })
    
    return existingAdmin
  } catch (error) {
    printError('Error checking existing admin: ' + error.message)
    throw error
  }
}

async function createAdminUser(email, password, role = 'SUPER_ADMIN') {
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: 'EMPLOYER',
        isActive: true,
        employer: {
          create: {
            role,
            permissions: {
              all: role === 'SUPER_ADMIN',
              canManageUsers: true,
              canManageSettings: role === 'SUPER_ADMIN',
              canViewReports: true,
              canManageReviews: true,
              canManageEmployees: true,
              canManageLeave: role !== 'MANAGER',
              canViewAnalytics: true
            },
            department: role === 'SUPER_ADMIN' ? null : 'Administration'
          }
        }
      },
      include: {
        employer: true
      }
    })
    
    return admin
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new Error('Email already exists in the system')
    }
    throw error
  }
}

async function main() {
  console.log('')
  print('blue', '🔐 Elevatus Admin User Creation')
  console.log('===============================')
  console.log('')
  
  try {
    // Check database connection
    printInfo('Checking database connection...')
    await prisma.$connect()
    printSuccess('Database connected')
    
    // Check for existing admin
    printInfo('Checking for existing admin users...')
    const existingAdmin = await checkExistingAdmin()
    
    if (existingAdmin) {
      printWarning(`Super Admin already exists: ${existingAdmin.email}`)
      const createAnother = await question('Create another admin user? (y/n): ')
      
      if (createAnother.toLowerCase() !== 'y' && createAnother.toLowerCase() !== 'yes') {
        printInfo('Admin creation cancelled')
        return
      }
    }
    
    console.log('')
    printInfo('Creating new admin user...')
    console.log('')
    
    // Get admin details
    let email, password, confirmPassword
    
    // Email input with validation
    while (true) {
      email = await question('Admin Email: ')
      const emailError = validateEmail(email)
      if (emailError) {
        printError(emailError)
        continue
      }
      break
    }
    
    // Role selection
    console.log('')
    printInfo('Available roles:')
    console.log('  1. SUPER_ADMIN - Full system access')
    console.log('  2. HR_ADMIN - HR and employee management')
    console.log('  3. MANAGER - Team management and reviews')
    console.log('')
    
    let role = 'SUPER_ADMIN'
    const roleChoice = await question('Select role (1-3, default: 1): ')
    
    switch (roleChoice) {
      case '2':
        role = 'HR_ADMIN'
        break
      case '3':
        role = 'MANAGER'
        break
      default:
        role = 'SUPER_ADMIN'
    }
    
    printInfo(`Selected role: ${role}`)
    
    // Password input with validation
    console.log('')
    printInfo('Password requirements:')
    console.log('  - At least 12 characters')
    console.log('  - At least one uppercase letter')
    console.log('  - At least one lowercase letter')
    console.log('  - At least one number')
    console.log('  - At least one special character (@$!%*?&)')
    console.log('')
    
    while (true) {
      password = await questionHidden('Admin Password: ')
      const passwordError = validatePassword(password)
      if (passwordError) {
        printError(passwordError)
        continue
      }
      
      confirmPassword = await questionHidden('Confirm Password: ')
      if (password !== confirmPassword) {
        printError('Passwords do not match')
        continue
      }
      
      break
    }
    
    // Confirmation
    console.log('')
    printWarning('Please confirm the details:')
    console.log(`Email: ${email}`)
    console.log(`Role: ${role}`)
    console.log('')
    
    const confirm = await question('Create admin user? (yes/no): ')
    
    if (confirm.toLowerCase() !== 'yes') {
      printInfo('Admin creation cancelled')
      return
    }
    
    // Create admin user
    console.log('')
    printInfo('Creating admin user...')
    
    const admin = await createAdminUser(email, password, role)
    
    console.log('')
    printSuccess('✅ Admin user created successfully!')
    console.log('==================================')
    console.log('')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Role: ${admin.employer.role}`)
    console.log(`🆔 User ID: ${admin.id}`)
    console.log('')
    
    printWarning('⚠️  Security Reminders:')
    console.log('1. Store these credentials securely')
    console.log('2. Change the password after first login')
    console.log('3. Enable 2FA when available')
    console.log('4. Never share admin credentials')
    console.log('')
    
    printInfo(`🚀 Login URL: ${process.env.APP_URL || 'https://your-domain.com'}/employer/login`)
    
  } catch (error) {
    console.log('')
    printError('Failed to create admin user:')
    console.error(error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('')
  printInfo('Admin creation cancelled by user')
  await prisma.$disconnect()
  rl.close()
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main()
}