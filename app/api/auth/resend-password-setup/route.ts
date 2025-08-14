import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendWelcomeEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        employer: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has a password set (has logged in before)
    if (user.password && user.lastLoginAt) {
      return NextResponse.json(
        { error: 'User already has a password set. Use password reset instead.' },
        { status: 400 }
      )
    }

    // Determine user name and type
    let userName = user.email
    let userType: 'EMPLOYEE' | 'EMPLOYER' = 'EMPLOYEE'

    if (user.employee) {
      userName = `${user.employee.firstName} ${user.employee.lastName}`
      userType = 'EMPLOYEE'
    } else if (user.employer) {
      userName = user.email
      userType = 'EMPLOYER'
    }

    // Send the welcome email with new password setup token
    const success = await sendWelcomeEmail(
      user.id,
      user.email,
      userName,
      userType
    )

    if (success) {
      return NextResponse.json({
        message: 'Password setup email sent successfully',
        userEmail: user.email,
        userType
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send password setup email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Resend password setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}