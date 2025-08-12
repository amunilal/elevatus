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
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') // 'deactivate' or 'delete'

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    if (action === 'deactivate') {
      // Soft delete - update status to INACTIVE
      await prisma.employee.update({
        where: { id: params.id },
        data: {
          employmentStatus: 'INACTIVE'
        }
      })
      return NextResponse.json({ message: 'Employee deactivated successfully' })
    } else {
      // Hard delete - permanently remove employee and associated user
      await prisma.$transaction(async (tx) => {
        // First, check for foreign key dependencies that would prevent deletion
        const reviewsAsReviewer = await tx.review.count({
          where: { reviewerId: params.id }
        })
        
        const reviewsAsEmployee = await tx.review.count({
          where: { employeeId: params.id }
        })

        // If employee has reviews as reviewer, we need to handle this
        if (reviewsAsReviewer > 0) {
          throw new Error(`Cannot delete employee: They are assigned as reviewer for ${reviewsAsReviewer} review(s). Please reassign or complete these reviews first.`)
        }

        // Delete reviews where employee is the subject
        if (reviewsAsEmployee > 0) {
          // First delete goals associated with reviews
          await tx.goal.deleteMany({
            where: {
              review: {
                employeeId: params.id
              }
            }
          })
          
          // Then delete the reviews
          await tx.review.deleteMany({
            where: { employeeId: params.id }
          })
        }

        // Delete other associated records
        await tx.userBadge.deleteMany({
          where: { employeeId: params.id }
        })

        await tx.enrollment.deleteMany({
          where: { employeeId: params.id }
        })

        await tx.document.deleteMany({
          where: { employeeId: params.id }
        })

        await tx.leave.deleteMany({
          where: { employeeId: params.id }
        })

        await tx.attendance.deleteMany({
          where: { employeeId: params.id }
        })

        // Delete employee record
        await tx.employee.delete({
          where: { id: params.id }
        })
        
        // Delete associated user
        if (existingEmployee.userId) {
          await tx.user.delete({
            where: { id: existingEmployee.userId }
          })
        }
      })
      
      return NextResponse.json({ message: 'Employee deleted permanently' })
    }
  } catch (error) {
    console.error('Error processing employee deletion:', error)
    
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