import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find user with valid setup token
    const user = await prisma.user.findFirst({
      where: {
        passwordSetupToken: token,
        passwordSetupExpires: {
          gt: new Date()
        },
        passwordSetupUsed: false
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired setup token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user with new password and mark token as used
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordSetupToken: null,
        passwordSetupExpires: null,
        passwordSetupUsed: true,
        isActive: true
      }
    })

    return NextResponse.json({
      message: 'Password set successfully',
      userType: user.userType
    })

  } catch (error) {
    console.error('Password setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify token is valid and not expired
    const user = await prisma.user.findFirst({
      where: {
        passwordSetupToken: token,
        passwordSetupExpires: {
          gt: new Date()
        },
        passwordSetupUsed: false
      },
      select: {
        email: true,
        userType: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired setup token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}