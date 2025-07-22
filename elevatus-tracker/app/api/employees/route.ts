import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
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
        idNumber: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'employeeNumber', 'position', 'department']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
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

    // Create user first
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Default password: password
        userType: 'EMPLOYEE',
        isActive: true
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
        } : null,
        bankDetails: body.bankAccount ? {
          accountNumber: body.bankAccount,
          bankName: body.bankName || '',
          branchCode: body.branchCode || ''
        } : null,
        taxDetails: body.taxNumber ? {
          taxNumber: body.taxNumber
        } : null,
        address: body.address ? {
          physical: body.address
        } : null
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}