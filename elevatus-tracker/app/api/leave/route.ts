import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const employeeId = searchParams.get('employeeId')

    return await connectWithRetry(async () => {
      const where: any = {}

      if (status) {
        where.status = status
      }

      if (type) {
        where.type = type
      }

      if (employeeId) {
        where.employeeId = employeeId
      }

      const leaveRequests = await prisma.leaveRequest.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
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
        },
        orderBy: {
          appliedDate: 'desc'
        }
      })

      return NextResponse.json(leaveRequests)
    })
  } catch (error) {
    console.error('Failed to fetch leave requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      type,
      startDate,
      endDate,
      reason,
      days
    } = body

    // Validate required fields
    if (!employeeId || !type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Calculate working days if not provided
    let calculatedDays = days
    if (!calculatedDays) {
      const timeDiff = end.getTime() - start.getTime()
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      
      // Simple calculation - exclude weekends (more sophisticated logic can be added)
      let workingDays = 0
      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
          workingDays++
        }
      }
      calculatedDays = workingDays
    }

    return await connectWithRetry(async () => {
      // Check for overlapping leave requests
      const overlapping = await prisma.leaveRequest.findFirst({
        where: {
          employeeId,
          status: {
            in: ['PENDING', 'APPROVED']
          },
          OR: [
            {
              AND: [
                { startDate: { lte: start } },
                { endDate: { gte: start } }
              ]
            },
            {
              AND: [
                { startDate: { lte: end } },
                { endDate: { gte: end } }
              ]
            },
            {
              AND: [
                { startDate: { gte: start } },
                { endDate: { lte: end } }
              ]
            }
          ]
        }
      })

      if (overlapping) {
        return NextResponse.json(
          { error: 'Leave request overlaps with existing leave' },
          { status: 409 }
        )
      }

      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employeeId,
          type,
          startDate: start,
          endDate: end,
          days: calculatedDays,
          reason,
          status: 'PENDING',
          appliedDate: new Date()
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeNumber: true,
              department: true
            }
          }
        }
      })

      return NextResponse.json(leaveRequest, { status: 201 })
    })
  } catch (error) {
    console.error('Failed to create leave request:', error)
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    )
  }
}