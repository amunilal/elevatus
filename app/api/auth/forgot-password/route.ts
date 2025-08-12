import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, userType } = await request.json()

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email and user type are required' },
        { status: 400 }
      )
    }

    // Find user by email and type
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        userType: userType
      }
    })

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a password reset email has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database (you'd need to add these fields to your User model)
    // For now, we'll just simulate this
    console.log('Reset token generated for user:', email)
    console.log('Token:', resetToken)
    console.log('Expiry:', resetTokenExpiry)

    // Determine the portal URL based on user type
    const portalType = userType === 'EMPLOYER' ? 'employer' : 'employee'
    const resetUrl = `${process.env.NEXTAUTH_URL}/${portalType}/reset-password?token=${resetToken}`

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Request - ElevatUs',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #F2A5A3 0%, #EE7DBD 50%, #816CC4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #F2A5A3 0%, #EE7DBD 50%, #816CC4 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px; }
                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  
                  <p>We received a request to reset your password for your ${userType.toLowerCase()} account at ElevatUs.</p>
                  
                  <p>Click the button below to reset your password:</p>
                  
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                  </div>
                  
                  <div class="warning">
                    <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                  </div>
                  
                  <p>If you didn't request this password reset, please ignore this email or contact your administrator if you have concerns.</p>
                  
                  <p>For security reasons, please do not share this email or the reset link with anyone.</p>
                  
                  <div class="footer">
                    <p>This is an automated email from ElevatUs. Please do not reply to this email.</p>
                    <p>© 2024 ElevatUs - Employee Management System</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
          Password Reset Request
          
          Hello,
          
          We received a request to reset your password for your ${userType.toLowerCase()} account at ElevatUs.
          
          To reset your password, visit the following link:
          ${resetUrl}
          
          This link will expire in 1 hour for security reasons.
          
          If you didn't request this password reset, please ignore this email or contact your administrator if you have concerns.
          
          For security reasons, please do not share this email or the reset link with anyone.
          
          This is an automated email from ElevatUs. Please do not reply to this email.
          © 2024 ElevatUs - Employee Management System
        `
      })
      
      console.log('Password reset email sent successfully to:', email)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Still return success to avoid revealing whether email exists
    }

    return NextResponse.json(
      { message: 'If an account exists, a password reset email has been sent.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}