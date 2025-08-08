import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            userType: true
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
  } catch (error) {
    console.error('Error fetching employee:', error)
    
    // If the error is because the table doesn't exist or database is not initialized,
    // return a 404 instead of 500
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('table') && errorMessage.includes('does not exist')) {
        console.log('Database tables not initialized')
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }
      if (errorMessage.includes('connect') || errorMessage.includes('connection')) {
        console.log('Database connection issue')
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: params.id }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Check for duplicate email or employee code (excluding current employee)
    if (body.email || body.employeeNumber) {
      const duplicateCheck = await prisma.employee.findFirst({
        where: {
          AND: [
            { id: { not: params.id } },
            {
              OR: [
                ...(body.email ? [{ user: { email: body.email } }] : []),
                ...(body.employeeNumber ? [{ employeeCode: body.employeeNumber }] : [])
              ]
            }
          ]
        }
      })

      if (duplicateCheck) {
        return NextResponse.json(
          { error: 'Employee with this email or employee number already exists' },
          { status: 409 }
        )
      }
    }

    // Update employee
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.email && { email: body.email, personalEmail: body.email }),
        ...(body.employeeNumber && { employeeCode: body.employeeNumber }),
        ...(body.position && { designation: body.position }),
        ...(body.department && { department: body.department }),
        ...(body.hireDate && { hiredDate: new Date(body.hireDate) }),
        ...(body.status && { employmentStatus: body.status }),
        ...(body.phoneNumber && { phoneNumber: body.phoneNumber }),
        ...(body.idNumber && { idNumber: body.idNumber }),
        ...(body.taxNumber && { taxNumber: body.taxNumber }),
        ...(body.emergencyContactName && { emergencyContactName: body.emergencyContactName }),
        ...(body.emergencyContactPhone && { emergencyContactPhone: body.emergencyContactPhone }),
        ...(body.bankAccount && { bankAccountNumber: body.bankAccount }),
        ...(body.bankName && { bankName: body.bankName }),
        ...(body.branchCode && { bankBranchCode: body.branchCode }),
        ...(body.address && { address: body.address }),
        ...(body.salary && { salary: parseFloat(body.salary) })
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: params.id }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Soft delete - update status to INACTIVE instead of hard delete
    await prisma.employee.update({
      where: { id: params.id },
      data: {
        employmentStatus: 'INACTIVE'
      }
    })

    return NextResponse.json({ message: 'Employee deactivated successfully' })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}