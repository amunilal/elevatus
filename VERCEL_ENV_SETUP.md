# Vercel Environment Variables Setup Guide

This guide will help you properly configure environment variables for your Elevatus deployment on Vercel.

## Required Environment Variables

You need to set up the following environment variables in your Vercel project:

1. **DATABASE_URL** - Your Neon PostgreSQL connection string
2. **NEXTAUTH_URL** - Your application URL
3. **NEXTAUTH_SECRET** - A secure random string for NextAuth.js

## Step-by-Step Setup

### 1. Get Your Neon Database URL

1. Log in to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to the "Connection Details" section
4. Copy the connection string (it should look like):
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Generate NEXTAUTH_SECRET

Run this command in your terminal to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 3. Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to "Settings" → "Environment Variables"
4. Add each variable:

   **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string (from step 1)
   - Environment: ✓ Production, ✓ Preview, ✓ Development

   **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: 
     - For production: `https://your-project-name.vercel.app`
     - For preview: Leave it empty (Vercel will auto-generate)
   - Environment: ✓ Production only

   **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: Your generated secret (from step 2)
   - Environment: ✓ Production, ✓ Preview, ✓ Development

### 4. Important Notes

- **DO NOT** use the format `@database_url` or reference secrets - just paste the actual values
- Make sure there are no extra spaces or quotes around your values
- The DATABASE_URL must include `?sslmode=require` at the end
- After adding all variables, redeploy your project

### 5. Verify Your Setup

After deployment, you can verify everything is working by:
1. Checking the deployment logs for any errors
2. Visiting your deployed site
3. Testing the login functionality

## Troubleshooting

If you see "Environment Variable references Secret which does not exist":
- You're using the `@secret_name` format instead of the actual value
- Remove the `@` and enter the actual connection string

If you see database connection errors:
- Verify your DATABASE_URL is correct
- Ensure your Neon database is active
- Check that SSL mode is set to `require`

## Local Development

For local development, create a `.env.local` file in the `elevatus-tracker` directory:
```env
DATABASE_URL=your-neon-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
```

Never commit `.env.local` to version control!