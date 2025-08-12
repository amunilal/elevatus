#!/usr/bin/env tsx
import { verifyEmailConfig, sendEmail } from '../lib/email'

// This script is for local testing only
// Environment variables should be loaded by the runtime

async function testSESEmail() {
  console.log('Amazon SES SMTP Configuration Test')
  console.log('===================================')
  console.log('Host:', process.env.SMTP_HOST)
  console.log('Port:', process.env.SMTP_PORT)
  console.log('User:', process.env.SMTP_USER)
  console.log('From:', process.env.SMTP_FROM)
  console.log('')

  // Verify configuration
  console.log('Verifying email configuration...')
  const isConfigured = await verifyEmailConfig()
  
  if (!isConfigured) {
    console.error('❌ Email configuration verification failed')
    console.error('Please check your Amazon SES SMTP credentials')
    process.exit(1)
  }
  
  console.log('✅ Email configuration verified successfully')
  console.log('')

  // Get test email address from command line argument
  const testEmail = process.argv[2]
  
  if (!testEmail) {
    console.log('Usage: npx tsx scripts/test-ses-email.ts <your-email@example.com>')
    console.log('')
    console.log('Please provide a test email address to send to.')
    process.exit(1)
  }

  // Send test email
  console.log(`Sending test email to ${testEmail}...`)
  
  const success = await sendEmail({
    to: testEmail,
    subject: `Amazon SES Test - ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2D1B69;">Amazon SES SMTP Test Successful!</h1>
        <p>This test email confirms that your Amazon SES SMTP configuration is working correctly.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>Region: EU-WEST-1 (Ireland)</li>
          <li>Endpoint: ${process.env.SMTP_HOST}</li>
          <li>Port: ${process.env.SMTP_PORT}</li>
          <li>Authentication: SMTP credentials</li>
        </ul>
        <p>Sent at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
        <hr style="margin: 20px 0; border: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated test email from the Elevatus application.
        </p>
      </div>
    `,
    text: `Amazon SES SMTP Test Successful!

This test email confirms that your Amazon SES SMTP configuration is working correctly.

Configuration Details:
- Region: EU-WEST-1 (Ireland)
- Endpoint: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT}
- Authentication: SMTP credentials

Sent at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}

This is an automated test email from the Elevatus application.`
  })

  if (success) {
    console.log('✅ Test email sent successfully!')
    console.log(`Check ${testEmail} for the test message.`)
  } else {
    console.error('❌ Failed to send test email')
    console.error('Check the logs above for error details')
    process.exit(1)
  }
}

// Run the test
testSESEmail().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})