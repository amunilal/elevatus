import { NextResponse } from 'next/server'
import { verifyEmailConfig, sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // Check if this is a test environment or development
    if (process.env.NODE_ENV === 'production' && !request.headers.get('x-test-auth')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { to, type = 'test' } = await request.json()

    if (!to) {
      return NextResponse.json({ error: 'Email recipient required' }, { status: 400 })
    }

    // Verify email configuration first
    const isConfigured = await verifyEmailConfig()
    if (!isConfigured) {
      return NextResponse.json({ 
        error: 'Email service not configured. Please check SMTP settings.' 
      }, { status: 500 })
    }

    // Send test email
    const subject = `Test Email from Elevatus - ${new Date().toLocaleString()}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Test Email from Elevatus</h1>
        <p>This is a test email to verify that the Mailjet SMTP configuration is working correctly.</p>
        <p>Email sent at: ${new Date().toLocaleString()}</p>
        <p style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
          <strong>Configuration Details:</strong><br>
          SMTP Host: ${process.env.SMTP_HOST}<br>
          SMTP Port: ${process.env.SMTP_PORT}<br>
          From Address: ${process.env.SMTP_FROM || 'noreply@elevatus.co.za'}
        </p>
        <p>If you received this email, your email configuration is working correctly!</p>
      </div>
    `
    const text = `Test Email from Elevatus\n\nThis is a test email sent at ${new Date().toLocaleString()}\n\nIf you received this email, your email configuration is working correctly!`

    const success = await sendEmail({
      to,
      subject,
      html,
      text,
    })

    if (success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully',
        to,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email. Check server logs for details.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  // Verify email configuration
  const isConfigured = await verifyEmailConfig()
  
  return NextResponse.json({
    configured: isConfigured,
    smtp_host: process.env.SMTP_HOST || 'not set',
    smtp_port: process.env.SMTP_PORT || 'not set',
    smtp_user: process.env.SMTP_USER ? 'configured' : 'not set',
    smtp_pass: process.env.SMTP_PASS ? 'configured' : 'not set',
    smtp_from: process.env.SMTP_FROM || 'not set',
  })
}