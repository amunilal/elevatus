# Amazon SES Email Configuration

## Current Configuration

The application has been successfully configured to use Amazon SES SMTP in the EU-WEST-1 region.

### SMTP Details
- **Endpoint**: email-smtp.eu-west-1.amazonaws.com
- **Port**: 587 (STARTTLS)
- **Username**: AKIAYFL3F4G2GRBOIQHF
- **Password**: BO4MlVS+nmkUIdNMTQwg0So1Ep+IvIBZ+rgfs/5DzjxN

## ⚠️ Important: Email Verification Required

Amazon SES requires verification of sender email addresses or domains before you can send emails.

### Current Issue
The email address `noreply@elevatus.co.za` is not verified in Amazon SES EU-WEST-1 region.

### Required Actions

#### Option 1: Verify the Domain (Recommended)
1. Log into AWS Console
2. Navigate to Amazon SES in EU-WEST-1 region
3. Go to "Verified identities" → "Create identity"
4. Choose "Domain" and enter `elevatus.co.za`
5. Follow the DNS verification process (add CNAME records to your domain's DNS)
6. Once verified, all email addresses @elevatus.co.za will be authorized

#### Option 2: Verify Individual Email Address
1. Log into AWS Console
2. Navigate to Amazon SES in EU-WEST-1 region
3. Go to "Verified identities" → "Create identity"
4. Choose "Email address" and enter `noreply@elevatus.co.za`
5. AWS will send a verification email to this address
6. Click the verification link in the email

#### Option 3: Use a Different Verified Email
If you have already verified another email address or domain, update the `SMTP_FROM` environment variable in `.env.production.local` to use that address.

## Testing the Configuration

After verifying the sender email/domain:

```bash
# Test with the provided script
npx tsx scripts/test-ses-email.ts your-email@example.com
```

## Production Considerations

1. **Sandbox Mode**: New SES accounts start in sandbox mode. You can only send emails to verified recipient addresses. Request production access to send to any email address.

2. **Sending Limits**: Monitor your sending quota and rate limits in the AWS SES console.

3. **Bounce and Complaint Handling**: Set up SNS notifications for bounces and complaints to maintain good sender reputation.

4. **DKIM Signing**: Enable DKIM for better deliverability (configured in SES console).

## Troubleshooting

### Error: "Email address is not verified"
- Verify the sender email or domain as described above

### Error: "Sending rate exceeded"
- Check your SES sending limits in AWS console
- Implement rate limiting in your application

### Error: "Message rejected: Email address is not verified" (for recipient)
- Your SES account is in sandbox mode
- Request production access or verify recipient emails for testing