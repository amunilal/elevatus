import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDummyEmployees() {
  try {
    console.log('🌱 Creating dummy employees...')

    // Create dummy users first
    const dummyUsers = [
      {
        email: 'sarah.johnson@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'mike.thompson@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'lisa.williams@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'david.brown@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'emma.davis@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'james.wilson@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'amy.taylor@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      },
      {
        email: 'robert.anderson@company.co.za',
        password: 'password123',
        userType: 'EMPLOYEE' as const
      }
    ]

    const createdUsers = []
    for (const userData of dummyUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      })
      createdUsers.push(user)
    }

    // Create dummy employees
    const dummyEmployees = [
      {
        userId: createdUsers[0].id,
        employeeCode: 'EMP002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        designation: 'Product Manager',
        department: 'Product',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2022-03-15'),
        idNumber: '9203155800088',
        personalEmail: 'sarah.johnson@company.co.za'
      },
      {
        userId: createdUsers[1].id,
        employeeCode: 'EMP003',
        firstName: 'Mike',
        lastName: 'Thompson',
        designation: 'Senior Developer',
        department: 'Engineering',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2021-08-10'),
        idNumber: '8808105800087',
        personalEmail: 'mike.thompson@company.co.za'
      },
      {
        userId: createdUsers[2].id,
        employeeCode: 'EMP004',
        firstName: 'Lisa',
        lastName: 'Williams',
        designation: 'UX Designer',
        department: 'Design',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2023-01-20'),
        idNumber: '9501205800089',
        personalEmail: 'lisa.williams@company.co.za'
      },
      {
        userId: createdUsers[3].id,
        employeeCode: 'EMP005',
        firstName: 'David',
        lastName: 'Brown',
        designation: 'Marketing Specialist',
        department: 'Marketing',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2022-11-05'),
        idNumber: '9011055800086',
        personalEmail: 'david.brown@company.co.za'
      },
      {
        userId: createdUsers[4].id,
        employeeCode: 'EMP006',
        firstName: 'Emma',
        lastName: 'Davis',
        designation: 'HR Coordinator',
        department: 'Human Resources',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2023-05-12'),
        idNumber: '9605125800085',
        personalEmail: 'emma.davis@company.co.za'
      },
      {
        userId: createdUsers[5].id,
        employeeCode: 'EMP007',
        firstName: 'James',
        lastName: 'Wilson',
        designation: 'DevOps Engineer',
        department: 'Engineering',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2021-12-08'),
        idNumber: '8712085800084',
        personalEmail: 'james.wilson@company.co.za'
      },
      {
        userId: createdUsers[6].id,
        employeeCode: 'EMP008',
        firstName: 'Amy',
        lastName: 'Taylor',
        designation: 'Sales Manager',
        department: 'Sales',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2022-07-18'),
        idNumber: '9107185800083',
        personalEmail: 'amy.taylor@company.co.za'
      },
      {
        userId: createdUsers[7].id,
        employeeCode: 'EMP009',
        firstName: 'Robert',
        lastName: 'Anderson',
        designation: 'Finance Manager',
        department: 'Finance',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        hiredDate: new Date('2020-04-22'),
        idNumber: '8004225800082',
        personalEmail: 'robert.anderson@company.co.za'
      }
    ]

    const createdEmployees = []
    for (const employeeData of dummyEmployees) {
      const employee = await prisma.employee.upsert({
        where: { userId: employeeData.userId },
        update: {},
        create: employeeData
      })
      createdEmployees.push(employee)
      console.log(`✅ Created employee: ${employee.firstName} ${employee.lastName} (${employee.employeeCode})`)
    }

    console.log(`🎉 Successfully created ${createdEmployees.length} dummy employees!`)

    return createdEmployees

  } catch (error) {
    console.error('❌ Error creating dummy employees:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
if (require.main === module) {
  createDummyEmployees()
    .then(() => {
      console.log('🎉 Dummy employee creation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Dummy employee creation failed:', error)
      process.exit(1)
    })
}

export default createDummyEmployees