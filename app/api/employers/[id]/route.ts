import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireEmployerAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireEmployerAuth(request)
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Unauthorized' },
        { status: 401 }
      )
    }

    const employer = await prisma.employer.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!employer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employer)
  } catch (error) {
    console.error('Error fetching employer:', error)
    return NextResponse.json(
      { message: 'Failed to fetch employer' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireEmployerAuth(request)
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, role, department, isActive } = body

    // Check if employer exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!existingEmployer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 }
      )
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { message: 'Invalid role specified' },
          { status: 400 }
        )
      }
    }

    // Validate email if provided
    if (email && email !== existingEmployer.user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: 'Invalid email format' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: existingEmployer.userId }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { message: 'Email is already taken by another user' },
          { status: 409 }
        )
      }
    }

    // Update in transaction
    const updatedEmployer = await prisma.$transaction(async (tx) => {
      // Update user fields
      const userUpdateData: any = {}
      if (email !== undefined && email !== existingEmployer.user.email) {
        userUpdateData.email = email
      }
      if (isActive !== undefined) {
        userUpdateData.isActive = isActive
      }

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingEmployer.userId },
          data: userUpdateData
        })
      }

      // Update employer fields
      const employerUpdateData: any = {}
      if (role !== undefined && role !== existingEmployer.role) {
        employerUpdateData.role = role
      }
      if (department !== undefined) {
        employerUpdateData.department = department || null
      }

      if (Object.keys(employerUpdateData).length > 0) {
        return await tx.employer.update({
          where: { id: params.id },
          data: employerUpdateData,
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
          }
        })
      } else {
        // Return current data if no employer fields were updated
        return await tx.employer.findUnique({
          where: { id: params.id },
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
          }
        })
      }
    })

    return NextResponse.json(updatedEmployer)
  } catch (error) {
    console.error('Error updating employer:', error)
    return NextResponse.json(
      { message: 'Failed to update employer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireEmployerAuth(request)
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') // 'deactivate' or 'delete'

    // Check if employer exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!existingEmployer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 }
      )
    }

    if (action === 'deactivate') {
      // Soft delete - update status to inactive
      await prisma.user.update({
        where: { id: existingEmployer.userId },
        data: {
          isActive: false
        }
      })
      return NextResponse.json({ message: 'Employer deactivated successfully' })
    } else {
      // Hard delete - permanently remove employer and associated user
      await prisma.$transaction(async (tx) => {
        // Delete employer record first
        await tx.employer.delete({
          where: { id: params.id }
        })
        
        // Delete associated user (this will cascade to sessions via schema)
        await tx.user.delete({
          where: { id: existingEmployer.userId }
        })
      })
      
      return NextResponse.json({ message: 'Employer deleted permanently' })
    }
  } catch (error) {
    console.error('Error processing employer deletion:', error)
    
    // Return specific error messages for better user experience
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    )
  }
}