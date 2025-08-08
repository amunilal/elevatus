import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // Authentication required - no demo data in production
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
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