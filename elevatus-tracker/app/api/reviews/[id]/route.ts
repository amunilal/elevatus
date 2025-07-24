import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
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
        goals: true
      }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PUT /api/reviews/[id] - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      summary,
      managerReview,
      selfAssessment,
      finalRating,
      status
    } = body

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: params.id }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (summary !== undefined) updateData.summary = summary
    if (managerReview !== undefined) updateData.managerReview = managerReview
    if (selfAssessment !== undefined) updateData.selfAssessment = selfAssessment
    if (finalRating !== undefined) updateData.finalRating = finalRating
    if (status !== undefined) updateData.status = status

    // Update timestamps based on status
    if (status === 'SUBMITTED' && !existingReview.submittedAt) {
      updateData.submittedAt = new Date()
    }
    if (status === 'COMPLETED' && !existingReview.completedAt) {
      updateData.completedAt = new Date()
    }

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: updateData,
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
        goals: true
      }
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: params.id }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Delete the review (goals will be cascade deleted)
    await prisma.review.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}