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

    // Get attendance counts by status
    const statusCounts = await prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true
      }
    })

    // Get total hours data
    const totalHoursData = await prisma.attendance.aggregate({
      where,
      _avg: {
        workingHours: true
      }
    })

    // Get total overtime hours
    const totalOvertimeData = await prisma.attendance.aggregate({
      where,
      _sum: {
        overtimeHours: true
      }
    })

    // Get total employees count
    let totalEmployees = 0
    if (employeeId) {
      totalEmployees = 1
    } else {
      const employeeWhere: any = {}
      if (department) {
        employeeWhere.department = department
      }
      totalEmployees = await prisma.employee.count({
        where: employeeWhere
      })
    }

    // Process status counts
    const presentCount = statusCounts.find(s => s.status === 'PRESENT')?._count?.status || 0
    const absentCount = statusCounts.find(s => s.status === 'ABSENT')?._count?.status || 0
    const lateCount = 0 // We don't have a separate "LATE" status in the enum, this would need to be calculated
    
    const stats = {
      totalEmployees: employeeId ? 1 : totalEmployees,
      presentToday: presentCount,
      absentToday: absentCount,
      lateToday: lateCount,
      avgWorkingHours: totalHoursData._avg.workingHours || 0,
      totalOvertimeHours: totalOvertimeData._sum.overtimeHours || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    
    // If the error is because the table doesn't exist or database is not initialized,
    // return default stats instead of an error
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('table') && errorMessage.includes('does not exist')) {
        console.log('Database tables not initialized, returning default stats')
        return NextResponse.json({
          totalEmployees: 0,
          presentToday: 0,
          absentToday: 0,
          lateToday: 0,
          avgWorkingHours: 0,
          totalOvertimeHours: 0
        })
      }
      if (errorMessage.includes('connect') || errorMessage.includes('connection')) {
        console.log('Database connection issue, returning default stats')
        return NextResponse.json({
          totalEmployees: 0,
          presentToday: 0,
          absentToday: 0,
          lateToday: 0,
          avgWorkingHours: 0,
          totalOvertimeHours: 0
        })
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch attendance statistics' },
      { status: 500 }
    )
  }
}