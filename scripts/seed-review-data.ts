import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedReviewData() {
  try {
    console.log('🌱 Seeding review data...')

    // Create a test user for employer
    const employerUser = await prisma.user.upsert({
      where: { email: 'admin@company.co.za' },
      update: {},
      create: {
        email: 'admin@company.co.za',
        password: 'password123', // In production, this should be hashed
        userType: 'EMPLOYER'
      }
    })

    // Create a test user for employee
    const employeeUser = await prisma.user.upsert({
      where: { email: 'john.doe@company.co.za' },
      update: {},
      create: {
        email: 'john.doe@company.co.za',
        password: 'password123', // In production, this should be hashed
        userType: 'EMPLOYEE'
      }
    })

    // Create employer record
    const employer = await prisma.employer.upsert({
      where: { userId: employerUser.id },
      update: {},
      create: {
        userId: employerUser.id,
        role: 'HR_ADMIN',
        department: 'Human Resources'
      }
    })

    // Create employee record
    const employee = await prisma.employee.upsert({
      where: { userId: employeeUser.id },
      update: {},
      create: {
        userId: employeeUser.id,
        employeeCode: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        designation: 'Senior Developer',
        department: 'Engineering',
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        hiredDate: new Date('2023-01-15'),
        idNumber: '8501015800088'
      }
    })

    // Create reviewer (could be the same as employee for self-review or different)
    const reviewer = employee // Using the same employee as reviewer for simplicity

    // Create a review cycle
    const reviewCycle = await prisma.reviewCycle.upsert({
      where: { id: 'rc-2025-annual' },
      update: {},
      create: {
        id: 'rc-2025-annual',
        name: '2025 Annual Review',
        year: 2025,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isActive: true
      }
    })

    // Create a review record
    const review = await prisma.review.upsert({
      where: { id: 'review-john-doe-2025' },
      update: {},
      create: {
        id: 'review-john-doe-2025',
        employeeId: employee.id,
        reviewerId: reviewer.id,
        reviewCycleId: reviewCycle.id,
        reviewType: 'ANNUAL',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-03-31'),
        summary: 'Annual performance review for John Doe',
        managerReview: {
          notes: [
            {
              id: 'note_1736031600000',
              content: 'John has shown excellent technical skills this year and has been a valuable team member.',
              type: 'general',
              timestamp: '2025-01-05T09:00:00.000Z',
              createdAt: '2025/01/05, 10:00:00'
            },
            {
              id: 'note_1736118000000',
              content: 'Areas for improvement include communication with stakeholders and project management skills.',
              type: 'general', 
              timestamp: '2025-01-06T09:00:00.000Z',
              createdAt: '2025/01/06, 10:00:00'
            }
          ]
        }
      }
    })

    // Create some goals for the review
    const goals = [
      {
        id: 'goal-1',
        reviewId: review.id,
        title: 'Complete project documentation',
        description: 'Finish documentation for the new feature development',
        targetDate: new Date('2025-02-28'),
        status: 'NOT_STARTED' as const
      },
      {
        id: 'goal-2',
        reviewId: review.id,
        title: 'Code review for new features',
        description: 'Review and provide feedback on team member code submissions',
        targetDate: new Date('2025-03-15'),
        status: 'IN_PROGRESS' as const
      },
      {
        id: 'goal-3',
        reviewId: review.id,
        title: 'Technical skills evaluation',
        description: 'Complete technical assessment and identify areas for growth',
        targetDate: new Date('2025-03-31'),
        status: 'IN_PROGRESS' as const
      },
      {
        id: 'goal-4',
        reviewId: review.id,
        title: 'Performance goals Q1',
        description: 'Achieve Q1 performance targets',
        targetDate: new Date('2025-03-31'),
        status: 'COMPLETED' as const
      }
    ]

    for (const goalData of goals) {
      await prisma.goal.upsert({
        where: { id: goalData.id },
        update: {},
        create: goalData
      })
    }

    console.log('✅ Review data seeded successfully!')
    console.log(`📊 Created review: ${review.id}`)
    console.log(`👤 Employee: ${employee.firstName} ${employee.lastName}`)
    console.log(`📅 Review cycle: ${reviewCycle.name}`)
    console.log(`🎯 Goals created: ${goals.length}`)
    
    return {
      employee,
      review,
      reviewCycle,
      goals: goals.length
    }

  } catch (error) {
    console.error('❌ Error seeding review data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
if (require.main === module) {
  seedReviewData()
    .then(() => {
      console.log('🎉 Review data seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Review data seeding failed:', error)
      process.exit(1)
    })
}

export default seedReviewData