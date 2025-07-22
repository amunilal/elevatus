import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual employee ID from session
    // For now, use the first employee as demo
    const employee = await prisma.employee.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employee.id
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match frontend expectations
    const transformedData = leaves.map(leave => ({
      id: leave.id,
      type: leave.leaveType,
      startDate: leave.startDate.toISOString(),
      endDate: leave.endDate.toISOString(),
      days: leave.totalDays,
      reason: leave.reason,
      status: leave.status,
      appliedDate: leave.createdAt.toISOString(),
      approvedDate: leave.approvedDate?.toISOString(),
      rejectionReason: leave.approverNotes
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching employee leave:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Get actual employee ID from session
    const employee = await prisma.employee.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Use the existing leave creation logic
    const requiredFields = ['leaveType', 'startDate', 'endDate', 'reason']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const timeDiff = endDate.getTime() - startDate.getTime()
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leave.findFirst({
      where: {
        employeeId: employee.id,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate }
          }
        ],
        status: {
          in: ['PENDING', 'APPROVED']
        }
      }
    })

    if (overlappingLeave) {
      return NextResponse.json(
        { error: 'You already have a leave request for overlapping dates' },
        { status: 409 }
      )
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType: body.leaveType,
        startDate,
        endDate,
        totalDays,
        reason: body.reason,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      id: leave.id,
      type: leave.leaveType,
      startDate: leave.startDate.toISOString(),
      endDate: leave.endDate.toISOString(),
      days: leave.totalDays,
      reason: leave.reason,
      status: leave.status,
      appliedDate: leave.createdAt.toISOString()
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating leave request:', error)
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    )
  }
}