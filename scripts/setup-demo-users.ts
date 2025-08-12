#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Setting up demo users for development...')
  
  try {
    // Create demo employers
    const employers = [
      {
        email: 'admin@elevatus.co.za',
        password: 'Admin123!@#',
        name: 'Admin User',
        userType: 'EMPLOYER' as const,
        role: 'ADMIN'
      },
      {
        email: 'hr@elevatus.co.za',
        password: 'HR123!@#',
        name: 'HR Manager',
        userType: 'EMPLOYER' as const,
        role: 'HR_ADMIN'
      },
      {
        email: 'manager@elevatus.co.za',
        password: 'Manager123!@#',
        name: 'Department Manager',
        userType: 'EMPLOYER' as const,
        role: 'MANAGER'
      }
    ]

    for (const employer of employers) {
      const hashedPassword = await bcrypt.hash(employer.password, 10)
      
      await prisma.user.upsert({
        where: { email: employer.email },
        update: {},
        create: {
          email: employer.email,
          password: hashedPassword,
          name: employer.name,
          userType: employer.userType,
          role: employer.role,
          emailVerified: new Date()
        }
      })
      
      console.log(`✅ Created employer: ${employer.email}`)
    }

    // Create demo employees with Employee records
    const employees = [
      {
        email: 'john.doe@elevatus.co.za',
        password: 'Employee123!@#',
        firstName: 'John',
        lastName: 'Doe',
        employeeCode: 'EMP001',
        position: 'Senior Developer',
        department: 'ENGINEERING'
      },
      {
        email: 'jane.smith@elevatus.co.za',
        password: 'Employee123!@#',
        firstName: 'Jane',
        lastName: 'Smith',
        employeeCode: 'EMP002',
        position: 'Marketing Manager',
        department: 'MARKETING'
      },
      {
        email: 'sarah.jones@elevatus.co.za',
        password: 'Employee123!@#',
        firstName: 'Sarah',
        lastName: 'Jones',
        employeeCode: 'EMP003',
        position: 'Financial Analyst',
        department: 'FINANCE'
      }
    ]

    for (const emp of employees) {
      const hashedPassword = await bcrypt.hash(emp.password, 10)
      
      // Create User record
      const user = await prisma.user.upsert({
        where: { email: emp.email },
        update: {},
        create: {
          email: emp.email,
          password: hashedPassword,
          name: `${emp.firstName} ${emp.lastName}`,
          userType: 'EMPLOYEE',
          emailVerified: new Date()
        }
      })
      
      // Create Employee record
      await prisma.employee.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          employeeCode: emp.employeeCode,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          position: emp.position,
          department: emp.department,
          dateOfBirth: new Date('1990-01-01'),
          phoneNumber: '0821234567',
          address: '123 Main Street, Cape Town',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          country: 'South Africa',
          idNumber: '9001015009087',
          taxNumber: 'TAX123456',
          employmentStatus: 'ACTIVE',
          hireDate: new Date('2020-01-15'),
          employmentType: 'FULL_TIME',
          workLocation: 'OFFICE',
          annualLeaveDays: 21,
          sickLeaveDays: 30,
          bankName: 'Standard Bank',
          accountNumber: '1234567890',
          branchCode: '051001'
        }
      })
      
      console.log(`✅ Created employee: ${emp.email}`)
    }

    console.log('\n✨ Demo users created successfully!')
    console.log('\n📝 Login credentials:')
    console.log('\nEmployers:')
    employers.forEach(e => {
      console.log(`  ${e.email} / ${e.password}`)
    })
    console.log('\nEmployees:')
    employees.forEach(e => {
      console.log(`  ${e.email} / ${e.password}`)
    })
    
  } catch (error) {
    console.error('❌ Error creating demo users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})