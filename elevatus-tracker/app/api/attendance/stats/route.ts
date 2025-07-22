import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const employeeId = searchParams.get('employeeId')
    const department = searchParams.get('department')

    return await connectWithRetry(async () => {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)

      const where: any = {
        date: {
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

      // Get attendance statistics
      const [
        totalEmployees,
        attendanceRecords,
        presentCount,
        absentCount,
        lateCount,
        totalHoursData,
        totalOvertimeData
      ] = await Promise.all([
        // Total employees (active only)
        prisma.employee.count({
          where: {
            status: 'ACTIVE',
            ...(department && { department })
          }
        }),
        
        // All attendance records for the date
        prisma.attendance.findMany({
          where,
          select: {
            status: true,
            totalHours: true,
            overtimeHours: true
          }
        }),
        
        // Present employees
        prisma.attendance.count({
          where: {
            ...where,
            status: 'PRESENT'
          }
        }),
        
        // Absent employees
        prisma.attendance.count({
          where: {
            ...where,
            status: 'ABSENT'
          }
        }),
        
        // Late employees
        prisma.attendance.count({
          where: {
            ...where,
            status: 'LATE'
          }
        }),
        
        // Average working hours
        prisma.attendance.aggregate({
          where: {
            ...where,
            status: {
              in: ['PRESENT', 'LATE', 'HALF_DAY']
            }
          },
          _avg: {
            totalHours: true
          }
        }),
        
        // Total overtime hours
        prisma.attendance.aggregate({
          where: {
            ...where,
            overtimeHours: {
              gt: 0
            }
          },
          _sum: {
            overtimeHours: true
          }
        })
      ])

      const stats = {
        totalEmployees: employeeId ? 1 : totalEmployees,
        presentToday: presentCount,
        absentToday: absentCount,
        lateToday: lateCount,
        avgWorkingHours: totalHoursData._avg.totalHours || 0,
        totalOvertimeHours: totalOvertimeData._sum.overtimeHours || 0
      }

      return NextResponse.json(stats)
    })
  } catch (error) {
    console.error('Failed to fetch attendance stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance stats' },
      { status: 500 }
    )
  }
}