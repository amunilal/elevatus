import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const emailType = searchParams.get('emailType')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (emailType && emailType !== 'ALL') {
      where.emailType = emailType
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { to: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const total = await prisma.emailLog.count({ where })

    // Get email logs with pagination
    const emailLogs = await prisma.emailLog.findMany({
      where,
      orderBy: {
        sentAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        to: true,
        subject: true,
        emailType: true,
        status: true,
        templateUsed: true,
        sentAt: true,
        failureReason: true,
        userId: true,
        employeeId: true,
        employerId: true,
        metadata: true
      }
    })

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      emailLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error('Error fetching email logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}