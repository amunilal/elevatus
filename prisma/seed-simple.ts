import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simplified database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.co.za' },
    update: {
      password: adminPassword,
    },
    create: {
      email: 'admin@company.co.za',
      password: adminPassword,
      userType: 'EMPLOYER',
    }
  })

  console.log('✅ Created/Updated admin user:', adminUser.email)

  // Create HR admin
  const hrPassword = await bcrypt.hash('hr123', 10)
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@company.co.za' },
    update: {
      password: hrPassword,
    },
    create: {
      email: 'hr@company.co.za',
      password: hrPassword,
      userType: 'EMPLOYER',
    }
  })

  console.log('✅ Created/Updated HR admin:', hrUser.email)

  // Create manager
  const managerPassword = await bcrypt.hash('manager123', 10)
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@company.co.za' },
    update: {
      password: managerPassword,
    },
    create: {
      email: 'manager@company.co.za',
      password: managerPassword,
      userType: 'EMPLOYER',
    }
  })

  console.log('✅ Created/Updated manager:', managerUser.email)

  // Create employees
  const employeePassword = await bcrypt.hash('employee123', 10)
  
  const employees = [
    {
      email: 'john.doe@company.co.za',
      firstName: 'John',
      lastName: 'Doe',
      employeeCode: 'EMP001',
      designation: 'Senior Developer',
      department: 'Backend',
      hiredDate: new Date('2023-01-15'),
      idNumber: '9001015800084'
    },
    {
      email: 'jane.smith@company.co.za',
      firstName: 'Jane',
      lastName: 'Smith',
      employeeCode: 'EMP002',
      designation: 'Developer',
      department: 'Frontend',
      hiredDate: new Date('2023-02-01'),
      idNumber: '9203045800085'
    },
    {
      email: 'peter.jones@company.co.za',
      firstName: 'Peter',
      lastName: 'Jones',
      employeeCode: 'EMP003',
      designation: 'Sales Manager',
      department: 'Sales',
      hiredDate: new Date('2023-03-01'),
      idNumber: '8801015800086'
    }
  ]

  for (const emp of employees) {
    // Create/update user
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {
        password: employeePassword,
      },
      create: {
        email: emp.email,
        password: employeePassword,
        userType: 'EMPLOYEE',
      }
    })

    // Create/update employee record
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {
        firstName: emp.firstName,
        lastName: emp.lastName,
      },
      create: {
        userId: user.id,
        employeeCode: emp.employeeCode,
        firstName: emp.firstName,
        lastName: emp.lastName,
        designation: emp.designation,
        department: emp.department,
        hiredDate: emp.hiredDate,
        idNumber: emp.idNumber,
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
      }
    })

    console.log('✅ Created/Updated employee:', emp.email)
  }

  console.log('🎉 Simplified seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })