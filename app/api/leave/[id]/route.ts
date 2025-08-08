import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if leave request exists
    const existingLeave = await prisma.leave.findUnique({
      where: { id: params.id }
    })

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    // Only allow status updates for pending requests
    if (existingLeave.status !== 'PENDING' && body.status) {
      return NextResponse.json(
        { error: 'Can only update status of pending leave requests' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (body.status) {
      updateData.status = body.status
      if (body.status === 'APPROVED' || body.status === 'REJECTED') {
        updateData.approvedDate = new Date()
        updateData.approverId = 'system' // TODO: Get actual approver ID from session
      }
    }

    if (body.rejectionReason) {
      updateData.approverNotes = body.rejectionReason
    }

    const leave = await prisma.leave.update({
      where: { id: params.id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            department: true
          }
        }
      }
    })

    return NextResponse.json(leave)
  } catch (error) {
    console.error('Error updating leave request:', error)
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    )
  }
}