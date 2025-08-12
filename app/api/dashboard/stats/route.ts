import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (token.userType !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }
  try {
    // Get total active employees
    const totalEmployees = await prisma.employee.count({
      where: {
        employmentStatus: 'ACTIVE'
      }
    })

    // Get pending reviews
    const pendingReviews = await prisma.review.count({
      where: {
        status: {
          in: ['NOT_STARTED', 'IN_PROGRESS']
        }
      }
    })

    // Get completed reviews
    const completedReviews = await prisma.review.count({
      where: {
        status: 'COMPLETED'
      }
    })

    const stats = {
      totalEmployees,
      pendingReviews,
      completedReviews
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}