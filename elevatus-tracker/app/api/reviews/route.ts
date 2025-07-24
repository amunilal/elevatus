import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/reviews - Get all reviews or filter by employee
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    const reviews = await prisma.review.findMany({
      where: employeeId ? { employeeId } : {},
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: true
          }
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        reviewCycle: {
          select: {
            id: true,
            name: true,
            year: true
          }
        },
        goals: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      reviewerId,
      reviewCycleId,
      reviewType = 'ANNUAL',
      dueDate,
      summary,
      managerReview
    } = body

    // Validate required fields
    if (!employeeId || !reviewerId || !reviewCycleId || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, reviewerId, reviewCycleId, dueDate' },
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

    // Check if reviewer exists
    const reviewer = await prisma.employee.findUnique({
      where: { id: reviewerId }
    })

    if (!reviewer) {
      return NextResponse.json(
        { error: 'Reviewer not found' },
        { status: 404 }
      )
    }

    // Create or find review cycle
    let reviewCycle = await prisma.reviewCycle.findUnique({
      where: { id: reviewCycleId }
    })

    if (!reviewCycle) {
      // Create a default review cycle if not found
      const currentYear = new Date().getFullYear()
      reviewCycle = await prisma.reviewCycle.create({
        data: {
          id: reviewCycleId,
          name: `${currentYear} Annual Review`,
          year: currentYear,
          startDate: new Date(`${currentYear}-01-01`),
          endDate: new Date(`${currentYear}-12-31`),
          isActive: true
        }
      })
    }

    const review = await prisma.review.create({
      data: {
        employeeId,
        reviewerId,
        reviewCycleId,
        reviewType,
        dueDate: new Date(dueDate),
        summary,
        managerReview,
        status: 'IN_PROGRESS'
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: true
          }
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        reviewCycle: {
          select: {
            id: true,
            name: true,
            year: true
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}