import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')
    const department = searchParams.get('department')

    const where: any = {}
    
    if (date) {
      const targetDate = new Date(date)
      where.date = {
        gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
        lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
      }
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (department) {
      where.employee = {
        department: department
      }
    }

    const attendances = await prisma.attendance.findMany({
      where,
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
      },
      orderBy: { date: 'desc' }
    })

    // Transform the data to match frontend expectations
    const transformedData = attendances.map(record => ({
      id: record.id,
      employee: {
        id: record.employee.id,
        firstName: record.employee.firstName,
        lastName: record.employee.lastName,
        employeeNumber: record.employee.employeeCode,
        department: record.employee.department
      },
      date: record.date.toISOString().split('T')[0],
      clockIn: record.checkIn?.toISOString() || null,
      clockOut: record.checkOut?.toISOString() || null,
      breakDuration: 0, // Not in schema yet
      totalHours: record.workingHours || 0,
      overtimeHours: record.overtimeHours || 0,
      status: record.status,
      notes: record.notes
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    
    // If the error is because the table doesn't exist or database is not initialized,
    // return an empty array instead of an error
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('table') && errorMessage.includes('does not exist')) {
        console.log('Database tables not initialized, returning empty array')
        return NextResponse.json([])
      }
      if (errorMessage.includes('connect') || errorMessage.includes('connection')) {
        console.log('Database connection issue, returning empty array')
        return NextResponse.json([])
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.employeeId || !body.date) {
      return NextResponse.json(
        { error: 'Employee ID and date are required' },
        { status: 400 }
      )
    }

    // Check if attendance record already exists for this date
    const existingRecord = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: body.employeeId,
          date: new Date(body.date)
        }
      }
    })

    if (existingRecord) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this date' },
        { status: 409 }
      )
    }

    // Calculate working hours if both check in and check out are provided
    let workingHours = 0
    let overtimeHours = 0
    
    if (body.checkIn && body.checkOut) {
      const checkIn = new Date(body.checkIn)
      const checkOut = new Date(body.checkOut)
      const totalMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
      workingHours = Math.max(0, totalMinutes / 60)
      
      // Calculate overtime (over 8 hours)
      if (workingHours > 8) {
        overtimeHours = workingHours - 8
      }
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: body.employeeId,
        date: new Date(body.date),
        checkIn: body.checkIn ? new Date(body.checkIn) : null,
        checkOut: body.checkOut ? new Date(body.checkOut) : null,
        workingHours,
        overtimeHours,
        status: body.status || 'PRESENT',
        notes: body.notes || null,
        location: body.location ? JSON.parse(body.location) : null
      },
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

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}