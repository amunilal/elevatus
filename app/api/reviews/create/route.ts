import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/reviews/create - Create a new review and return the review ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId } = body

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Check if there's already an active review for this employee
    const existingReview = await prisma.review.findFirst({
      where: {
        employeeId: employeeId,
        status: {
          in: ['NOT_STARTED', 'IN_PROGRESS']
        }
      }
    })

    if (existingReview) {
      // Return existing review if found
      return NextResponse.json({
        reviewId: existingReview.id,
        existing: true,
        message: 'Active review already exists for this employee'
      })
    }

    // Create or get current review cycle
    const currentYear = new Date().getFullYear()
    let reviewCycle = await prisma.reviewCycle.findFirst({
      where: {
        year: currentYear,
        isActive: true
      }
    })

    if (!reviewCycle) {
      // Create a new review cycle for this year
      reviewCycle = await prisma.reviewCycle.create({
        data: {
          name: `${currentYear} Annual Review`,
          year: currentYear,
          startDate: new Date(`${currentYear}-01-01`),
          endDate: new Date(`${currentYear}-12-31`),
          isActive: true
        }
      })
    }

    // For now, we'll assume the reviewer is the first employee (in a real app, this would be based on auth)
    // In a production environment, you'd get the reviewer from the authenticated user
    let reviewer = await prisma.employee.findFirst({
      where: {
        employmentStatus: 'ACTIVE'
      }
    })

    if (!reviewer) {
      reviewer = employee // Fallback to self-review
    }

    // Create new review
    const newReview = await prisma.review.create({
      data: {
        employeeId: employeeId,
        reviewerId: reviewer.id,
        reviewCycleId: reviewCycle.id,
        reviewType: 'ANNUAL',
        status: 'NOT_STARTED',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        summary: `Annual performance review for ${employee.firstName} ${employee.lastName}`,
        managerReview: {
          notes: [],
          status: 'not_started',
          createdAt: new Date().toISOString()
        }
      }
    })

    // Create some default goals for the review
    const defaultGoals = [
      {
        title: 'Performance evaluation and feedback',
        description: 'Complete comprehensive performance assessment based on current role responsibilities',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'NOT_STARTED' as const
      },
      {
        title: 'Goal setting for next period',
        description: 'Establish clear, measurable goals for the next performance cycle',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        status: 'NOT_STARTED' as const
      },
      {
        title: 'Development planning',
        description: 'Identify skills development opportunities and create learning plan',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        status: 'NOT_STARTED' as const
      }
    ]

    for (const goalData of defaultGoals) {
      await prisma.goal.create({
        data: {
          reviewId: newReview.id,
          ...goalData
        }
      })
    }

    return NextResponse.json({
      reviewId: newReview.id,
      existing: false,
      message: 'New review created successfully',
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        designation: employee.designation
      },
      dueDate: newReview.dueDate
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}