import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'in-v3.mailjet.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })
}

// Verify SMTP connection configuration
export async function verifyEmailConfig(): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Email configuration missing: SMTP_USER or SMTP_PASS not set')
    return false
  }

  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email server connection verified successfully')
    return true
  } catch (error) {
    console.error('Email server connection failed:', error)
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
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Email configuration missing: Cannot send email')
    return false
  }

  const transporter = createTransporter()
  
  const mailOptions: SendMailOptions = {
    from: options.from || process.env.SMTP_FROM || 'noreply@elevatus.co.za',
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email for new employees
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