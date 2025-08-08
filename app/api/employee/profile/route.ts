import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // Authentication required - no demo data in production
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error fetching employee profile:', error)
    
    // If the error is because the table doesn't exist or database is not initialized,
    // return a 404 instead of 500
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('table') && errorMessage.includes('does not exist')) {
        console.log('Database tables not initialized')
        return NextResponse.json(
          { error: 'Employee profile not found' },
          { status: 404 }
        )
      }
      if (errorMessage.includes('connect') || errorMessage.includes('connection')) {
        console.log('Database connection issue')
        return NextResponse.json(
          { error: 'Employee profile not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch employee profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // Authentication required - no demo data in production
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )

    const updateData: any = {}

    // Only update provided fields
    if (body.firstName) updateData.firstName = body.firstName
    if (body.lastName) updateData.lastName = body.lastName
    if (body.phoneNumber) updateData.phoneNumber = body.phoneNumber
    if (body.personalEmail) updateData.personalEmail = body.personalEmail
    
    if (body.emergencyContactName || body.emergencyContactPhone) {
      updateData.emergencyContact = {
        name: body.emergencyContactName || '',
        phone: body.emergencyContactPhone || ''
      }
    }

    if (body.bankAccount || body.bankName || body.branchCode) {
      updateData.bankDetails = {
        accountNumber: body.bankAccount || '',
        bankName: body.bankName || '',
        branchCode: body.branchCode || ''
      }
    }

    if (body.address) {
      updateData.address = {
        physical: body.address
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employee.id },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            userType: true
          }
        }
      }
    })

    return NextResponse.json({
      id: updatedEmployee.id,
      firstName: updatedEmployee.firstName,
      lastName: updatedEmployee.lastName,
      employeeCode: updatedEmployee.employeeCode,
      email: updatedEmployee.personalEmail || updatedEmployee.user.email,
      designation: updatedEmployee.designation,
      department: updatedEmployee.department,
      phoneNumber: updatedEmployee.phoneNumber,
      idNumber: updatedEmployee.idNumber,
      hiredDate: updatedEmployee.hiredDate.toISOString(),
      employmentType: updatedEmployee.employmentType,
      employmentStatus: updatedEmployee.employmentStatus,
      emergencyContact: updatedEmployee.emergencyContact,
      bankDetails: updatedEmployee.bankDetails,
      address: updatedEmployee.address
    })
  } catch (error) {
    console.error('Error updating employee profile:', error)
    return NextResponse.json(
      { error: 'Failed to update employee profile' },
      { status: 500 }
    )
  }
}