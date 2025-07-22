import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const status = searchParams.get('status')

    return await connectWithRetry(async () => {
      const where: any = {}

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeNumber: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (department) {
        where.department = department
      }

      if (status) {
        where.status = status
      }

      const employees = await prisma.employee.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              isActive: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json(employees)
    })
  } catch (error) {
    console.error('Failed to fetch employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      employeeNumber,
      position,
      department,
      hireDate,
      salary,
      phoneNumber,
      address,
      idNumber,
      taxNumber,
      bankAccount,
      bankName,
      branchCode,
      emergencyContactName,
      emergencyContactPhone,
      status = 'ACTIVE'
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !employeeNumber || !position || !department || !hireDate || !salary || !idNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    return await connectWithRetry(async () => {
      // Check if email or employee number already exists
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          OR: [
            { email },
            { employeeNumber }
          ]
        }
      })

      if (existingEmployee) {
        return NextResponse.json(
          { error: 'Employee with this email or employee number already exists' },
          { status: 409 }
        )
      }

      // Generate a temporary password (employee can change it on first login)
      const tempPassword = 'employee123' // TODO: Generate random password and send via email
      const hashedPassword = await bcrypt.hash(tempPassword, 10)

      // Create user account and employee record in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            userType: 'EMPLOYEE'
          }
        })

        const employee = await tx.employee.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            email,
            employeeNumber,
            position,
            department,
            hireDate: new Date(hireDate),
            salary: Number(salary),
            phoneNumber: phoneNumber || null,
            address: address || null,
            idNumber,
            taxNumber: taxNumber || null,
            bankAccount: bankAccount || null,
            bankName: bankName || null,
            branchCode: branchCode || null,
            emergencyContactName: emergencyContactName || null,
            emergencyContactPhone: emergencyContactPhone || null,
            status
          }
        })

        return { user, employee }
      })

      return NextResponse.json(result.employee, { status: 201 })
    })
  } catch (error) {
    console.error('Failed to create employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}