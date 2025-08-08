import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT /api/goals/[id] - Update a goal/task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, title, description, targetDate } = body

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id }
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    
    if (status) updateData.status = status
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (targetDate) updateData.targetDate = new Date(targetDate)

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        ...updateData,
        updatedAt: new Date()
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
      goal: updatedGoal,
      message: 'Goal updated successfully'
    })

  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

// GET /api/goals/[id] - Get a specific goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
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

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(goal)

  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    )
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id }
    })

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Delete the goal
    await prisma.goal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}