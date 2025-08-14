import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { isValidDepartmentPosition } from '@/lib/departmentPositions'
import { requireEmployerAuth } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    await requireEmployerAuth(request)
  } catch (authError) {
    if (authError instanceof Error) {
      if (authError.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (authError.message.includes('Access denied')) {
        return NextResponse.json({ error: authError.message }, { status: 403 })
      }
    }
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { personalEmail: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (department) {
      where.department = department
    }

    if (status) {
      where.employmentStatus = status
    }

    const employees = await prisma.employee.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        personalEmail: true,
        employeeCode: true,
        designation: true,
        department: true,
        employmentType: true,
        employmentStatus: true,
        hiredDate: true,
        phoneNumber: true,
        idNumber: true,
        user: {
          select: {
            id: true,
            lastLoginAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    
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
    
    // For other errors, still return 500
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireEmployerAuth(request)
  } catch (authError) {
    if (authError instanceof Error) {
      if (authError.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (authError.message.includes('Access denied')) {
        return NextResponse.json({ error: authError.message }, { status: 403 })
      }
    }
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
  }

  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'employeeNumber', 'position', 'department', 'hireDate']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate hireDate is a valid date
    if (body.hireDate && isNaN(new Date(body.hireDate).getTime())) {
      return NextResponse.json(
        { error: 'Invalid hire date format' },
        { status: 400 }
      )
    }

    // Validate department-position combination
    if (!isValidDepartmentPosition(body.department, body.position)) {
      return NextResponse.json(
        { error: `Invalid position "${body.position}" for department "${body.department}"` },
        { status: 400 }
      )
    }

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if employee code already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: { employeeCode: body.employeeNumber }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this employee number already exists' },
        { status: 409 }
      )
    }

    // Create user first (without password - will be set via email link)
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: null, // No password initially
        userType: 'EMPLOYEE',
        isActive: false // Will be activated when they set their password
      }
    })

    // Create employee linked to user
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        employeeCode: body.employeeNumber,
        designation: body.position,
        department: body.department,
        hiredDate: body.hireDate ? new Date(body.hireDate) : new Date(),
        employmentType: 'FULL_TIME',
        employmentStatus: body.status || 'ACTIVE',
        phoneNumber: body.phoneNumber || null,
        personalEmail: body.email,
        idNumber: body.idNumber || null,
        emergencyContact: body.emergencyContactName ? {
          name: body.emergencyContactName,
          phone: body.emergencyContactPhone || ''
        } : undefined,
        bankDetails: body.bankAccount ? {
          accountNumber: body.bankAccount,
          bankName: body.bankName || '',
          branchCode: body.branchCode || ''
        } : undefined,
        taxDetails: body.taxNumber ? {
          taxNumber: body.taxNumber
        } : undefined,
        address: body.address ? {
          physical: body.address
        } : undefined
      }
    })

    // Send welcome email with password setup link
    try {
      const fullName = `${body.firstName} ${body.lastName}`
      await sendWelcomeEmail(user.id, body.email, fullName, 'EMPLOYEE')
      console.log(`Welcome email sent to ${body.email}`)
    } catch (emailError) {
      console.error(`Failed to send welcome email to ${body.email}:`, emailError)
      // Don't fail the employee creation if email fails
    }

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        if (error.message.includes('employeeCode')) {
          return NextResponse.json(
            { error: 'Employee number already exists' },
            { status: 409 }
          )
        }
        if (error.message.includes('email')) {
          return NextResponse.json(
            { error: 'Email address already exists' },
            { status: 409 }
          )
        }
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { error: `Failed to create employee: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}