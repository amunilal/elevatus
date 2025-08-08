import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/reviews/[id]/notes - Save review notes
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { notes, noteType = 'general' } = body

    if (!notes || notes.trim().length === 0) {
      return NextResponse.json(
        { error: 'Notes content is required' },
        { status: 400 }
      )
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
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
        }
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Parse existing manager review or create new structure
    let managerReview = existingReview.managerReview as any || {}
    
    // Initialize notes array if it doesn't exist
    if (!managerReview.notes) {
      managerReview.notes = []
    }

    // Add new note with timestamp
    const newNote = {
      id: `note_${Date.now()}`,
      content: notes.trim(),
      type: noteType,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toLocaleString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Johannesburg'
      })
    }

    managerReview.notes.push(newNote)

    // Update the review with new notes
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        managerReview: managerReview,
        status: existingReview.status === 'NOT_STARTED' ? 'IN_PROGRESS' : existingReview.status,
        updatedAt: new Date()
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      note: newNote,
      review: updatedReview,
      message: 'Review note saved successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving review notes:', error)
    return NextResponse.json(
      { error: 'Failed to save review notes' },
      { status: 500 }
    )
  }
}

// GET /api/reviews/[id]/notes - Get all notes for a review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        managerReview: true,
        selfAssessment: true,
        summary: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Extract notes from managerReview
    const managerReview = review.managerReview as any || {}
    const notes = managerReview.notes || []

    return NextResponse.json({
      reviewId: review.id,
      employee: review.employee,
      notes: notes,
      summary: review.summary,
      totalNotes: notes.length
    })

  } catch (error) {
    console.error('Error fetching review notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review notes' },
      { status: 500 }
    )
  }
}