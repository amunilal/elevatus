import { PrismaClient, UserType, EmployerRole, EmploymentType, EmploymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.co.za' },
    update: {},
    create: {
      email: 'admin@company.co.za',
      password: adminPassword,
      userType: UserType.EMPLOYER,
      employer: {
        create: {
          role: EmployerRole.SUPER_ADMIN,
          permissions: {
            all: true
          }
        }
      }
    }
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create HR admin
  const hrPassword = await bcrypt.hash('hr123', 10)
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@company.co.za' },
    update: {},
    create: {
      email: 'hr@company.co.za',
      password: hrPassword,
      userType: UserType.EMPLOYER,
      employer: {
        create: {
          role: EmployerRole.HR_ADMIN,
          department: 'Human Resources',
          permissions: {
            employees: true,
            attendance: true,
            leave: true,
            reviews: true,
            learning: true
          }
        }
      }
    }
  })

  console.log('✅ Created HR admin:', hrUser.email)

  // Create departments/teams
  const engineeringTeam = await prisma.team.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
      description: 'Software development team'
    }
  })

  const salesTeam = await prisma.team.upsert({
    where: { name: 'Sales' },
    update: {},
    create: {
      name: 'Sales',
      description: 'Sales and business development'
    }
  })

  console.log('✅ Created teams')

  // Create manager
  const managerPassword = await bcrypt.hash('manager123', 10)
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@company.co.za' },
    update: {},
    create: {
      email: 'manager@company.co.za',
      password: managerPassword,
      userType: UserType.EMPLOYER,
      employer: {
        create: {
          role: EmployerRole.MANAGER,
          department: 'Engineering',
          permissions: {
            employees: { view: true, edit: false },
            attendance: { view: true, edit: true },
            leave: { view: true, approve: true },
            reviews: { view: true, create: true, edit: true }
          },
          managedTeams: {
            connect: { id: engineeringTeam.id }
          }
        }
      }
    }
  })

  console.log('✅ Created manager:', managerUser.email)

  // Create employees
  const employeePassword = await bcrypt.hash('employee123', 10)
  
  const employees = [
    {
      email: 'john.doe@company.co.za',
      firstName: 'John',
      lastName: 'Doe',
      employeeCode: 'EMP001',
      idNumber: '9001015800084',
      designation: 'Senior Developer',
      department: 'Backend',
      teamId: engineeringTeam.id,
      phoneNumber: '+27 82 123 4567'
    },
    {
      email: 'jane.smith@company.co.za',
      firstName: 'Jane',
      lastName: 'Smith',
      employeeCode: 'EMP002',
      idNumber: '9203045800085',
      designation: 'Developer',
      department: 'Frontend',
      teamId: engineeringTeam.id,
      phoneNumber: '+27 83 234 5678'
    },
    {
      email: 'peter.jones@company.co.za',
      firstName: 'Peter',
      lastName: 'Jones',
      employeeCode: 'EMP003',
      idNumber: '8801015800086',
      designation: 'Sales Manager',
      department: 'Sales',
      teamId: salesTeam.id,
      phoneNumber: '+27 84 345 6789'
    }
  ]

  for (const emp of employees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        password: employeePassword,
        userType: UserType.EMPLOYEE,
        employee: {
          create: {
            employeeCode: emp.employeeCode,
            firstName: emp.firstName,
            lastName: emp.lastName,
            idNumber: emp.idNumber,
            designation: emp.designation,
            department: emp.department,
            teamId: emp.teamId,
            phoneNumber: emp.phoneNumber,
            employmentType: EmploymentType.FULL_TIME,
            employmentStatus: EmploymentStatus.ACTIVE,
            hiredDate: new Date('2023-01-15'),
            address: {
              street: '123 Main Street',
              suburb: 'Sandton',
              city: 'Johannesburg',
              province: 'Gauteng',
              postalCode: '2196'
            },
            emergencyContact: {
              name: 'Emergency Contact',
              relationship: 'Spouse',
              phone: '+27 81 111 2222'
            }
          }
        }
      }
    })
    console.log('✅ Created employee:', user.email)
  }

  // Create leave balances for current year
  const currentYear = new Date().getFullYear()
  const allEmployees = await prisma.employee.findMany()

  for (const employee of allEmployees) {
    // Annual leave
    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        year: currentYear,
        leaveType: 'ANNUAL',
        entitled: 21,
        taken: 0,
        remaining: 21,
        cycleStart: new Date(`${currentYear}-01-01`),
        cycleEnd: new Date(`${currentYear}-12-31`)
      }
    })

    // Sick leave (30 days per 3-year cycle)
    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        year: currentYear,
        leaveType: 'SICK',
        entitled: 10, // 30 days over 3 years = 10 per year
        taken: 0,
        remaining: 10,
        cycleStart: new Date(`${currentYear}-01-01`),
        cycleEnd: new Date(`${currentYear + 2}-12-31`)
      }
    })

    // Family responsibility leave
    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        year: currentYear,
        leaveType: 'FAMILY',
        entitled: 3,
        taken: 0,
        remaining: 3,
        cycleStart: new Date(`${currentYear}-01-01`),
        cycleEnd: new Date(`${currentYear}-12-31`)
      }
    })
  }

  console.log('✅ Created leave balances')

  // Create review cycle
  const reviewCycle = await prisma.reviewCycle.create({
    data: {
      name: `Annual Review ${currentYear}`,
      year: currentYear,
      startDate: new Date(`${currentYear}-11-01`),
      endDate: new Date(`${currentYear}-12-31`),
      isActive: true
    }
  })

  console.log('✅ Created review cycle')

  // Create sample courses
  const courses = [
    {
      title: 'Company Orientation',
      description: 'Introduction to company policies and procedures',
      category: 'Onboarding',
      duration: 120,
      difficulty: 'BEGINNER' as const,
      isMandatory: true
    },
    {
      title: 'POPIA Compliance Training',
      description: 'Understanding data protection regulations in South Africa',
      category: 'Compliance',
      duration: 60,
      difficulty: 'INTERMEDIATE' as const,
      isMandatory: true
    },
    {
      title: 'Leadership Essentials',
      description: 'Developing leadership skills for managers',
      category: 'Leadership',
      duration: 240,
      difficulty: 'ADVANCED' as const,
      isMandatory: false
    }
  ]

  for (const course of courses) {
    await prisma.course.create({
      data: course
    })
  }

  console.log('✅ Created courses')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })