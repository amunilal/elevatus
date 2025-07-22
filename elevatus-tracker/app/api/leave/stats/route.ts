import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const type = searchParams.get('type')

    return await connectWithRetry(async () => {
      const where: any = {}

      if (employeeId) {
        where.employeeId = employeeId
      }

      if (type) {
        where.type = type
      }

      // Get leave statistics
      const [
        pendingCount,
        approvedCount,
        rejectedCount,
        totalDaysData
      ] = await Promise.all([
        // Pending requests
        prisma.leaveRequest.count({
          where: {
            ...where,
            status: 'PENDING'
          }
        }),
        
        // Approved requests
        prisma.leaveRequest.count({
          where: {
            ...where,
            status: 'APPROVED'
          }
        }),
        
        // Rejected requests
        prisma.leaveRequest.count({
          where: {
            ...where,
            status: 'REJECTED'
          }
        }),
        
        // Total days taken (approved only)
        prisma.leaveRequest.aggregate({
          where: {
            ...where,
            status: 'APPROVED'
          },
          _sum: {
            days: true
          }
        })
      ])

      const stats = {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalDays: totalDaysData._sum.days || 0
      }

      return NextResponse.json(stats)
    })
  } catch (error) {
    console.error('Failed to fetch leave stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave stats' },
      { status: 500 }
    )
  }
}