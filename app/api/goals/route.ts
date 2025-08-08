import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/goals - Create a new goal/task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId, title, description, status = 'NOT_STARTED', targetDate } = body

    // Validate required fields
    if (!reviewId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewId and title' },
        { status: 400 }
      )
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Create the goal
    const newGoal = await prisma.goal.create({
      data: {
        reviewId,
        title,
        description: description || '',
        status,
        targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Default to 90 days from now
      },
      include: {
        review: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      goal: newGoal,
      message: 'Goal created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

// GET /api/goals - Get all goals (optionally filtered by reviewId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')

    const goals = await prisma.goal.findMany({
      where: reviewId ? { reviewId } : {},
      include: {
        review: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(goals)

  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}