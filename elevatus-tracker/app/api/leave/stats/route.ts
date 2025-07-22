import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.leaveType = type
    }

    // Get leave request counts by status
    const statusCounts = await prisma.leave.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true
      }
    })

    // Get total days taken
    const totalDaysData = await prisma.leave.aggregate({
      where: {
        ...where,
        status: 'APPROVED'
      },
      _sum: {
        totalDays: true
      }
    })

    const pending = statusCounts.find(s => s.status === 'PENDING')?._count?.status || 0
    const approved = statusCounts.find(s => s.status === 'APPROVED')?._count?.status || 0
    const rejected = statusCounts.find(s => s.status === 'REJECTED')?._count?.status || 0
    
    const stats = {
      pending,
      approved,
      rejected,
      totalDays: totalDaysData._sum.totalDays || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching leave stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave statistics' },
      { status: 500 }
    )
  }
}