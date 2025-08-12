import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import type { User as NextAuthUser } from 'next-auth'

const prisma = new PrismaClient()

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    userType: 'EMPLOYEE' | 'EMPLOYER'
    employeeId?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      userType: 'EMPLOYEE' | 'EMPLOYER'
      employeeId?: string
    }
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.userType) {
          return null
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
              userType: credentials.userType as 'EMPLOYEE' | 'EMPLOYER'
            },
            include: {
              employee: true
            }
          })

          if (!user) {
            return null
          }

          // Check if user has a password set (new users won't have one until they set it via email)
          if (!user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user.email,
            userType: user.userType,
            employeeId: user.employee?.id
          } as NextAuthUser
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
        token.employeeId = user.employeeId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.userType = token.userType as 'EMPLOYEE' | 'EMPLOYER'
        session.user.employeeId = token.employeeId as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }