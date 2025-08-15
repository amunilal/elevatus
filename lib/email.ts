import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'
import { PrismaClient, EmailType, EmailStatus } from '@prisma/client'
import crypto from 'crypto'
import { logger } from '@/lib/logger'

const prisma = new PrismaClient()

// Create reusable transporter object using Amazon SES SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'email-smtp.eu-west-1.amazonaws.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Required for SES
      rejectUnauthorized: true,
    },
  })
}

// Verify SMTP connection configuration
export async function verifyEmailConfig(): Promise<boolean> {
  // For development with MailHog, SMTP_USER and SMTP_PASS can be empty
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isMailHog = process.env.SMTP_HOST === 'localhost' && process.env.SMTP_PORT === '1025'
  
  if (!isDevelopment && !isMailHog && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    logger.error('Email configuration missing: SMTP_USER or SMTP_PASS not set')
    return false
  }

  try {
    const transporter = createTransporter()
    await transporter.verify()
    logger.info('Email server connection verified successfully')
    return true
  } catch (error) {
    logger.error('Email server connection failed', error)
    return false
  }
}

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
  emailType?: EmailType
  templateUsed?: string
  userId?: string
  employeeId?: string
  employerId?: string
  metadata?: any
}

// Log email to database
async function logEmail(options: EmailOptions, status: EmailStatus, failureReason?: string): Promise<void> {
  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to]
    
    // Log each recipient separately for better tracking
    for (const recipient of recipients) {
      await prisma.emailLog.create({
        data: {
          to: recipient,
          subject: options.subject,
          emailType: options.emailType || EmailType.OTHER,
          status: status,
          templateUsed: options.templateUsed,
          userId: options.userId,
          employeeId: options.employeeId,
          employerId: options.employerId,
          failureReason: failureReason,
          metadata: options.metadata ? JSON.parse(JSON.stringify(options.metadata)) : null,
        }
      })
    }
  } catch (error) {
    logger.error('Failed to log email', error)
  }
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // For development with MailHog, SMTP_USER and SMTP_PASS can be empty
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isMailHog = process.env.SMTP_HOST === 'localhost' && process.env.SMTP_PORT === '1025'
  
  if (!isDevelopment && !isMailHog && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    logger.error('Email configuration missing: Cannot send email')
    await logEmail(options, EmailStatus.FAILED, 'Email configuration missing')
    return false
  }

  const transporter = createTransporter()
  
  const mailOptions: SendMailOptions = {
    from: options.from || process.env.SMTP_FROM || 'noreply@mad.app',
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    logger.info('Email sent successfully', { messageId: info.messageId })
    await logEmail(options, EmailStatus.SENT)
    return true
  } catch (error) {
    logger.error('Failed to send email', error)
    await logEmail(options, EmailStatus.FAILED, error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email for new users with password setup
  welcomeNewUser: (name: string, email: string, setupUrl: string, userType: string) => ({
    subject: 'Welcome to ElevatUs - Set Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2D1B69; font-size: 32px; margin: 0;">ElevatUs</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Employee Performance Management</p>
          </div>
          
          <h2 style="color: #2D1B69; font-size: 24px; margin-bottom: 20px;">Welcome to ElevatUs!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            Dear ${name},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            Your ${userType.toLowerCase()} account has been created in our ElevatUs system. To get started, you'll need to set up your password.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;"><strong>Account Details:</strong></p>
            <p style="margin: 5px 0; color: #333;">Email: ${email}</p>
            <p style="margin: 5px 0; color: #333;">Role: ${userType}</p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin: 20px 0;">
            Click the button below to set your password and access your account:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" style="background: linear-gradient(135deg, #E91E63, #9C27B0); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">
              Set Your Password
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ Important:</strong> This setup link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            If you have any questions or need assistance, please contact your administrator or HR department.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
            Best regards,<br>
            <strong>The ElevatUs Team</strong><br>
            <em>Elevating Performance, Empowering Growth</em>
          </p>
        </div>
        
        <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
          This email was sent to ${email}. If you received this in error, please contact your administrator.
        </p>
      </div>
    `,
    text: `Welcome to ElevatUs!\n\nDear ${name},\n\nYour ${userType.toLowerCase()} account has been created in our ElevatUs system.\n\nAccount Details:\nEmail: ${email}\nRole: ${userType}\n\nTo get started, please set your password by visiting:\n${setupUrl}\n\nImportant: This setup link will expire in 24 hours for security reasons.\n\nIf you have any questions, please contact your administrator or HR department.\n\nBest regards,\nThe ElevatUs Team\nElevating Performance, Empowering Growth`,
  }),

  // Welcome email for existing users (legacy)
  welcomeEmployee: (name: string, loginUrl: string) => ({
    subject: 'Welcome to Elevatus',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Welcome to Elevatus!</h1>
        <p>Dear ${name},</p>
        <p>Your account has been created successfully. You can now log in to access your employee portal.</p>
        <p style="margin: 20px 0;">
          <a href="${loginUrl}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Login to Your Account
          </a>
        </p>
        <p>If you have any questions, please contact your HR department.</p>
        <p>Best regards,<br>The Elevatus Team</p>
      </div>
    `,
    text: `Welcome to Elevatus!\n\nDear ${name},\n\nYour account has been created successfully. You can now log in at ${loginUrl} to access your employee portal.\n\nBest regards,\nThe Elevatus Team`,
  }),

  // Password reset email
  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Password Reset Request - Elevatus',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Password Reset Request</h1>
        <p>Dear ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Elevatus Team</p>
      </div>
    `,
    text: `Password Reset Request\n\nDear ${name},\n\nWe received a request to reset your password. Visit this link to set a new password: ${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request this, please ignore this email.\n\nBest regards,\nThe Elevatus Team`,
  }),

  // Review notification
  reviewNotification: (name: string, reviewUrl: string, dueDate: string) => ({
    subject: 'Performance Review Due - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Performance Review Reminder</h1>
        <p>Dear ${name},</p>
        <p>You have a performance review that requires your attention. Please complete it by <strong>${dueDate}</strong>.</p>
        <p style="margin: 20px 0;">
          <a href="${reviewUrl}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Review
          </a>
        </p>
        <p>Thank you for your cooperation.</p>
        <p>Best regards,<br>The Elevatus Team</p>
      </div>
    `,
    text: `Performance Review Reminder\n\nDear ${name},\n\nYou have a performance review that requires your attention. Please complete it by ${dueDate}.\n\nVisit: ${reviewUrl}\n\nThank you for your cooperation.\n\nBest regards,\nThe Elevatus Team`,
  }),

  // Leave request notification
  leaveRequestNotification: (managerName: string, employeeName: string, leaveType: string, dates: string, approveUrl: string) => ({
    subject: `Leave Request from ${employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Leave Request Notification</h1>
        <p>Dear ${managerName},</p>
        <p><strong>${employeeName}</strong> has submitted a ${leaveType} leave request for:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${dates}</p>
        <p style="margin: 20px 0;">
          <a href="${approveUrl}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Review Request
          </a>
        </p>
        <p>Please review and respond to this request at your earliest convenience.</p>
        <p>Best regards,<br>The Elevatus Team</p>
      </div>
    `,
    text: `Leave Request Notification\n\nDear ${managerName},\n\n${employeeName} has submitted a ${leaveType} leave request for: ${dates}\n\nPlease review this request at: ${approveUrl}\n\nBest regards,\nThe Elevatus Team`,
  }),
}

// Helper functions for user management
export async function generatePasswordSetupToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date()
  expires.setDate(expires.getDate() + 1) // 24 hours from now

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordSetupToken: token,
      passwordSetupExpires: expires,
      passwordSetupUsed: false
    }
  })

  return token
}

export async function sendWelcomeEmail(
  userId: string,
  userEmail: string,
  userName: string,
  userType: 'EMPLOYEE' | 'EMPLOYER'
): Promise<boolean> {
  try {
    // Generate password setup token
    const token = await generatePasswordSetupToken(userId)
    
    // Create setup URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const setupUrl = `${baseUrl}/auth/setup-password?token=${token}`
    
    // Get email template
    const emailTemplate = emailTemplates.welcomeNewUser(
      userName,
      userEmail,
      setupUrl,
      userType
    )
    
    // Send email
    const success = await sendEmail({
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      emailType: EmailType.PASSWORD_SETUP,
      templateUsed: 'welcomeNewUser',
      userId: userId,
      metadata: {
        userType,
        setupUrl,
        tokenGenerated: true
      }
    })
    
    if (success) {
      logger.info(`Welcome email sent successfully to ${userEmail}`)
      return true
    } else {
      logger.error(`Failed to send welcome email to ${userEmail}`)
      return false
    }
  } catch (error) {
    logger.error('Error sending welcome email', error)
    return false
  }
}