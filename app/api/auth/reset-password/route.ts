import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { token, password, userType } = await request.json()

    if (!token || !password || !userType) {
      return NextResponse.json(
        { error: 'Token, password, and user type are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        userType: userType,
        resetTokenExpires: {
          gt: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}