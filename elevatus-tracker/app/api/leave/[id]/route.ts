import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    return await connectWithRetry(async () => {
      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              department: true,
              position: true
            }
          },
          approvedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      if (!leaveRequest) {
        return NextResponse.json(
          { error: 'Leave request not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(leaveRequest)
    })
  } catch (error) {
    console.error('Failed to fetch leave request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave request' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, rejectionReason, approvedById } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    return await connectWithRetry(async () => {
      const existingRequest = await prisma.leaveRequest.findUnique({
        where: { id }
      })

      if (!existingRequest) {
        return NextResponse.json(
          { error: 'Leave request not found' },
          { status: 404 }
        )
      }

      if (existingRequest.status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Can only update pending leave requests' },
          { status: 400 }
        )
      }

      const updateData: any = {
        status,
        approvedDate: new Date()
      }

      if (status === 'APPROVED' && approvedById) {
        updateData.approvedById = approvedById
      }

      if (status === 'REJECTED' && rejectionReason) {
        updateData.rejectionReason = rejectionReason
      }

      const updatedRequest = await prisma.leaveRequest.update({
        where: { id },
        data: updateData,
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeNumber: true,
              department: true
            }
          },
          approvedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return NextResponse.json(updatedRequest)
    })
  } catch (error) {
    console.error('Failed to update leave request:', error)
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    return await connectWithRetry(async () => {
      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id }
      })

      if (!leaveRequest) {
        return NextResponse.json(
          { error: 'Leave request not found' },
          { status: 404 }
        )
      }

      if (leaveRequest.status === 'APPROVED') {
        return NextResponse.json(
          { error: 'Cannot delete approved leave requests' },
          { status: 400 }
        )
      }

      await prisma.leaveRequest.delete({
        where: { id }
      })

      return NextResponse.json({ message: 'Leave request deleted successfully' })
    })
  } catch (error) {
    console.error('Failed to delete leave request:', error)
    return NextResponse.json(
      { error: 'Failed to delete leave request' },
      { status: 500 }
    )
  }
}