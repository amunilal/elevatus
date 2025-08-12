import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function requireEmployerAuth(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    throw new Error('Unauthorized')
  }

  if (token.userType !== 'EMPLOYER') {
    throw new Error('Access denied: Employer access required')
  }

  return token
}

export async function requireEmployeeAuth(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    throw new Error('Unauthorized')
  }

  if (token.userType !== 'EMPLOYEE') {
    throw new Error('Access denied: Employee access required')
  }

  return token
}

export async function requireAuth(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    throw new Error('Unauthorized')
  }

  return token
}