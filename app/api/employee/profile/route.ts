import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireEmployeeAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  let session
  try {
    session = await requireEmployeeAuth()
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

    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
            isActive: true
          }
        }
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
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
  let session
  try {
    session = await requireEmployeeAuth()
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

    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee profile not found' },
        { status: 404 }
      )
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employee.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        personalEmail: body.personalEmail,
        address: body.address,
        emergencyContact: body.emergencyContact,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            email: true,
            isActive: true
          }
        }
      }
    })

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error('Error updating employee profile:', error)
    return NextResponse.json(
      { error: 'Failed to update employee profile' },
      { status: 500 }
    )
  }
}