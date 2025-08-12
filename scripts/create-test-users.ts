import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function createTestUsers() {
  try {
    console.log('Creating test users...')

    // Create an employer user
    const employerPassword = await hashPassword('password123')
    const employer = await prisma.user.create({
      data: {
        email: 'employer@company.com',
        password: employerPassword,
        userType: 'EMPLOYER',
        isActive: true
      }
    })
    console.log('Created employer user:', employer.email)

    // Create an employee user
    const employeePassword = await hashPassword('password123')
    const employee = await prisma.user.create({
      data: {
        email: 'employee@company.com',
        password: employeePassword,
        userType: 'EMPLOYEE',
        isActive: true
      }
    })
    console.log('Created employee user:', employee.email)

    // Create employee profile for the employee user
    const employeeProfile = await prisma.employee.create({
      data: {
        userId: employee.id,
        firstName: 'Test',
        lastName: 'Employee',
        employeeCode: 'EMP001',
        designation: 'Software Developer',
        department: 'Engineering',
        hiredDate: new Date(),
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        personalEmail: 'employee@company.com',
        phoneNumber: '+27123456789',
        idNumber: '9001015800087'
      }
    })
    console.log('Created employee profile for:', employeeProfile.firstName, employeeProfile.lastName)

    console.log('\n✅ Test users created successfully!')
    console.log('\nLogin credentials:')
    console.log('Employer Portal:')
    console.log('  Email: employer@company.com')
    console.log('  Password: password123')
    console.log('\nEmployee Portal:')
    console.log('  Email: employee@company.com')
    console.log('  Password: password123')

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      console.log('ℹ️  Test users already exist')
      console.log('\nLogin credentials:')
      console.log('Employer Portal:')
      console.log('  Email: employer@company.com')
      console.log('  Password: password123')
      console.log('\nEmployee Portal:')
      console.log('  Email: employee@company.com')
      console.log('  Password: password123')
    } else {
      console.error('Error creating test users:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()