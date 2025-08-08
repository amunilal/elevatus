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
      // Return empty array if no employee found instead of error
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      employeeId: employee.id
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const attendances = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 30 // Limit to last 30 records
    })

    // Transform data to match frontend expectations
    const transformedData = attendances.map(record => ({
      id: record.id,
      date: record.date.toISOString().split('T')[0],
      checkIn: record.checkIn?.toISOString(),
      checkOut: record.checkOut?.toISOString(),
      workingHours: record.workingHours || 0,
      overtimeHours: record.overtimeHours || 0,
      status: record.status,
      notes: record.notes
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching employee attendance:', error)
    
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