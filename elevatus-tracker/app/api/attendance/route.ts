import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')
    const department = searchParams.get('department')

    return await connectWithRetry(async () => {
      const where: any = {}

      if (date) {
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)
        
        where.date = {
          gte: startDate,
          lt: endDate
        }
      }

      if (employeeId) {
        where.employeeId = employeeId
      }

      if (department) {
        where.employee = {
          department
        }
      }

      const attendance = await prisma.attendance.findMany({
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
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      return NextResponse.json(attendance)
    })
  } catch (error) {
    console.error('Failed to fetch attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      date,
      clockIn,
      clockOut,
      breakDuration = 0,
      totalHours,
      overtimeHours,
      status,
      notes
    } = body

    // Validate required fields
    if (!employeeId || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    return await connectWithRetry(async () => {
      // Check if attendance record already exists for this employee and date
      const existingRecord = await prisma.attendance.findFirst({
        where: {
          employeeId,
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })

      if (existingRecord) {
        return NextResponse.json(
          { error: 'Attendance record already exists for this date' },
          { status: 409 }
        )
      }

      const attendance = await prisma.attendance.create({
        data: {
          employeeId,
          date: new Date(date),
          clockIn: clockIn ? new Date(clockIn) : null,
          clockOut: clockOut ? new Date(clockOut) : null,
          breakDuration: Number(breakDuration),
          totalHours: Number(totalHours) || 0,
          overtimeHours: Number(overtimeHours) || 0,
          status,
          notes: notes || null
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

      return NextResponse.json(attendance, { status: 201 })
    })
  } catch (error) {
    console.error('Failed to create attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}