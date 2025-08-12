import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function getSession() {
  return await getServerSession()
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  return session
}

export async function requireEmployerAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  if (session.user.userType !== 'EMPLOYER') {
    throw new Error('Access denied: Employer access required')
  }
  
  return session
}

export async function requireEmployeeAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  if (session.user.userType !== 'EMPLOYEE') {
    throw new Error('Access denied: Employee access required')
  }
  
  return session
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  userType: 'EMPLOYEE' | 'EMPLOYER'
) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      userType,
      isActive: true
    }
  })
  
  return user
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      employee: true
    }
  })
}

export async function getUserByEmail(email: string, userType?: 'EMPLOYEE' | 'EMPLOYER') {
  return await prisma.user.findFirst({
    where: {
      email,
      ...(userType && { userType })
    },
    include: {
      employee: true
    }
  })
}