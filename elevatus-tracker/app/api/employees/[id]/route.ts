import { NextRequest, NextResponse } from 'next/server'
import { prisma, connectWithRetry } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    return await connectWithRetry(async () => {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              isActive: true,
              lastLoginAt: true
            }
          }
        }
      })

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(employee)
    })
  } catch (error) {
    console.error('Failed to fetch employee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
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
      status
    } = body

    return await connectWithRetry(async () => {
      // Check if employee exists
      const existingEmployee = await prisma.employee.findUnique({
        where: { id }
      })

      if (!existingEmployee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }

      // Check if email or employee number conflicts with other employees
      if (email !== existingEmployee.email || employeeNumber !== existingEmployee.employeeNumber) {
        const conflictingEmployee = await prisma.employee.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              {
                OR: [
                  { email },
                  { employeeNumber }
                ]
              }
            ]
          }
        })

        if (conflictingEmployee) {
          return NextResponse.json(
            { error: 'Another employee with this email or employee number already exists' },
            { status: 409 }
          )
        }
      }

      // Update employee and user email in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const employee = await tx.employee.update({
          where: { id },
          data: {
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

        // Update user email if it changed
        if (email !== existingEmployee.email) {
          await tx.user.update({
            where: { id: existingEmployee.userId },
            data: { email }
          })
        }

        return employee
      })

      return NextResponse.json(result)
    })
  } catch (error) {
    console.error('Failed to update employee:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    return await connectWithRetry(async () => {
      const employee = await prisma.employee.findUnique({
        where: { id }
      })

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }

      // Soft delete by updating status instead of hard delete
      // This preserves historical data for attendance, leave, etc.
      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          status: 'TERMINATED'
        }
      })

      // Also deactivate the user account
      await prisma.user.update({
        where: { id: employee.userId },
        data: {
          isActive: false
        }
      })

      return NextResponse.json({ message: 'Employee terminated successfully' })
    })
  } catch (error) {
    console.error('Failed to delete employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}