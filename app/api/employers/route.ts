import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireEmployerAuth } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireEmployerAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    // Get all employers with their user information
    const employers = await prisma.employer.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(employers)
  } catch (error) {
    console.error('Error fetching employers:', error)
    return NextResponse.json(
      { message: 'Failed to fetch employers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireEmployerAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { email, role, department } = body

    // Validate required fields
    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user and employer in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate password setup token
      const passwordSetupToken = Math.random().toString(36).substring(2, 15) + 
                                Math.random().toString(36).substring(2, 15)
      const passwordSetupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create user
      const newUser = await tx.user.create({
        data: {
          email,
          userType: 'EMPLOYER',
          password: null, // User will set password via email link
          passwordSetupToken,
          passwordSetupExpires,
          passwordSetupUsed: false,
          isActive: true
        }
      })

      // Create employer
      const newEmployer = await tx.employer.create({
        data: {
          userId: newUser.id,
          role,
          department: department || null,
          permissions: {}
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })

      return { user: newUser, employer: newEmployer, passwordSetupToken }
    })

    // Send welcome email with password setup link
    try {
      await sendWelcomeEmail(
        email,
        `${process.env.NEXTAUTH_URL}/auth/setup-password?token=${result.passwordSetupToken}&type=employer`
      )
      console.log(`Welcome email sent to ${email}`)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails - user was created successfully
    }

    return NextResponse.json(result.employer, { status: 201 })
  } catch (error) {
    console.error('Error creating employer:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { message: 'Failed to create employer' },
      { status: 500 }
    )
  }
}