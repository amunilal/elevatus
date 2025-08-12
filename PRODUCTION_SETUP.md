# Production Setup Guide for Elevatus Tracker

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Initial Deployment](#initial-deployment)
6. [Security Configuration](#security-configuration)
7. [Post-Deployment Tasks](#post-deployment-tasks)
8. [Maintenance & Operations](#maintenance--operations)
9. [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive instructions for deploying the Elevatus Employee Tracker application to a production environment. This setup ensures a secure, scalable deployment.

### Key Principles
- **Clean database**: Production starts with a clean database
- **Secure by default**: All credentials must be properly secured
- **Audit ready**: Full logging and compliance features enabled
- **Performance optimized**: Proper caching and database indexing

## Prerequisites

### Required Services
- **Database**: PostgreSQL 14+ (Neon, Supabase, or self-hosted)
- **Hosting**: Vercel, AWS, or Docker-capable infrastructure
- **Email Service**: SendGrid, AWS SES, or SMTP provider
- **Domain**: Custom domain with SSL certificate
- **Storage**: Vercel Blob, AWS S3, or compatible object storage (optional)

### Technical Requirements
- Node.js 18+ installed locally
- Git for version control
- Access to production hosting platform
- SSL/TLS certificates configured

## Environment Configuration

### 1. Create Production Environment File

Create a `.env.production` file in the root directory:

```bash
# Database Configuration (PostgreSQL/Neon)
DATABASE_URL="postgresql://username:password@host:5432/database_name?sslmode=require"

# Application Settings
NODE_ENV="production"
APP_URL="https://your-domain.com"

# NextAuth Configuration (REQUIRED - Generate secure keys)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-64-character-secret-key-here"

# Email Configuration (SendGrid Example)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="noreply@your-domain.com"

# South African Localization
TIMEZONE="Africa/Johannesburg"
LOCALE="en-ZA"
CURRENCY="ZAR"

# Optional: Monitoring
SENTRY_DSN="your-sentry-dsn"
VERCEL_ANALYTICS_ID="your-analytics-id"

# Optional: Storage (for file uploads)
BLOB_READ_WRITE_TOKEN="your-storage-token"
```

### 2. Generate Secure Keys

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 64
```

### 3. Validate Environment Variables

Run validation script:
```bash
node scripts/validate-env.js production
```

## Database Setup

### 1. Create Production Database

#### Option A: Using Neon (Recommended for Vercel)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project with production settings
3. Copy connection string to `DATABASE_URL`

#### Option B: Self-Hosted PostgreSQL
```bash
# Create production database
sudo -u postgres psql
CREATE DATABASE elevatus_production;
CREATE USER elevatus_admin WITH ENCRYPTED PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE elevatus_production TO elevatus_admin;
\q
```

### 2. Run Database Migrations

```bash
# Set production environment
export NODE_ENV=production

# Run migrations
npx prisma migrate deploy

# Verify database schema
npx prisma db pull
```

### 3. Create Initial Admin User

Create a secure production seed script `scripts/create-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function createAdmin() {
  console.log('🔐 Creating Production Admin User')
  
  const email = await question('Admin email: ')
  const password = await question('Admin password (min 12 chars): ', true)
  
  // Validate password strength
  if (password.length < 12) {
    console.error('❌ Password must be at least 12 characters')
    process.exit(1)
  }
  
  const hashedPassword = await bcrypt.hash(password, 12)
  
  try {
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: 'EMPLOYER',
        employer: {
          create: {
            role: 'SUPER_ADMIN',
            permissions: { all: true }
          }
        }
      }
    })
    
    console.log('✅ Admin user created:', admin.email)
    console.log('⚠️  Please store these credentials securely')
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

function question(prompt, hidden = false) {
  return new Promise((resolve) => {
    if (hidden) {
      const stdin = process.stdin
      stdin.setRawMode(true)
      stdin.resume()
      stdin.setEncoding('utf8')
      
      let password = ''
      process.stdout.write(prompt)
      
      stdin.on('data', function(ch) {
        ch = ch.toString('utf8')
        
        if (ch === '\n' || ch === '\r') {
          stdin.setRawMode(false)
          stdin.pause()
          process.stdout.write('\n')
          resolve(password)
        } else if (ch === '\u0003') {
          process.exit()
        } else if (ch === '\u007f') {
          if (password.length > 0) {
            password = password.slice(0, -1)
          }
        } else {
          password += ch
        }
      })
    } else {
      rl.question(prompt, resolve)
    }
  })
}

createAdmin()
```

Run the script:
```bash
node scripts/create-admin.js
```

## Initial Deployment

### Option 1: Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Project**
   ```bash
   vercel link
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   # Add all other production variables
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Docker Deployment

1. **Build Production Image**
   ```bash
   docker build -t elevatus:production -f Dockerfile.production .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name elevatus-prod \
     --env-file .env.production \
     -p 3000:3000 \
     elevatus:production
   ```

### Option 3: Traditional Server Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Install PM2**
   ```bash
   npm install -g pm2
   ```

3. **Start Application**
   ```bash
   pm2 start npm --name "elevatus" -- start
   pm2 save
   pm2 startup
   ```

## Security Configuration

### 1. Password Policy

Configure minimum password requirements in `lib/auth/password-policy.ts`:

```typescript
export const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfo: true
}
```

### 2. Session Security

Update `lib/auth/session-config.ts`:

```typescript
export const sessionConfig = {
  maxAge: 8 * 60 * 60, // 8 hours
  updateAge: 60 * 60,  // 1 hour
  secureCookie: true,
  sameSite: 'strict',
  httpOnly: true
}
```

### 3. Rate Limiting

Configure rate limiting for login attempts:

```typescript
// lib/auth/rate-limit.ts
export const rateLimits = {
  login: {
    max: 5,        // max attempts
    window: 900000 // 15 minutes
  },
  api: {
    max: 100,      // requests
    window: 60000  // 1 minute
  }
}
```

### 4. Security Headers

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

## Post-Deployment Tasks

### 1. Verify Deployment

Run health check:
```bash
curl https://your-domain.com/api/health
```

### 2. Configure Monitoring

#### Set up Uptime Monitoring
- Use services like UptimeRobot, Pingdom, or Better Uptime
- Configure alerts for downtime

#### Application Monitoring
```javascript
// Install Sentry
npm install @sentry/nextjs

// Configure in sentry.client.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1
})
```

### 3. Set Up Backups

Create automated backup script `scripts/backup.sh`:

```bash
#!/bin/bash
# Production Database Backup Script

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/elevatus"
DB_NAME="elevatus_production"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz s3://your-backup-bucket/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: backup_$TIMESTAMP.sql.gz"
```

Schedule with cron:
```bash
# Add to crontab
0 2 * * * /path/to/scripts/backup.sh
```

### 4. Create Additional Users

After deployment, create additional admin users through the application UI or using the admin script.

## Maintenance & Operations

### 1. Regular Tasks

#### Daily
- [ ] Check application health status
- [ ] Review error logs
- [ ] Monitor disk space

#### Weekly
- [ ] Review security logs
- [ ] Check backup integrity
- [ ] Update dependencies (security patches)

#### Monthly
- [ ] Performance review
- [ ] Database optimization
- [ ] Security audit
- [ ] Update documentation

### 2. Update Procedures

```bash
# 1. Backup current state
./scripts/backup.sh

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci

# 4. Run migrations
npx prisma migrate deploy

# 5. Build application
npm run build

# 6. Restart application
pm2 restart elevatus

# 7. Verify deployment
curl https://your-domain.com/api/health
```

### 3. Database Maintenance

```sql
-- Analyze tables for performance
ANALYZE;

-- Reindex for optimal performance
REINDEX DATABASE elevatus_production;

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

### 4. Scaling Considerations

#### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Configure session sharing (Redis)
- Set up read replicas for database

#### Vertical Scaling
- Monitor resource usage
- Upgrade server specifications as needed
- Optimize database queries

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Test connection
npx prisma db pull

# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
pg_isready -h localhost -p 5432
```

#### 2. Authentication Issues
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 64

# Clear session storage
redis-cli FLUSHDB
```

#### 3. Performance Issues
```bash
# Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

# Monitor connections
SELECT count(*) FROM pg_stat_activity;
```

### Log Locations

- **Application Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **PostgreSQL Logs**: `/var/log/postgresql/`
- **System Logs**: `/var/log/syslog`

### Debug Mode

Enable debug mode temporarily:
```bash
# Set debug environment
export DEBUG=*
export NODE_ENV=development

# Run with verbose logging
npm run dev
```

## Security Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET is unique and secure
- [ ] Database uses SSL connection
- [ ] No default passwords
- [ ] No debug mode in production
- [ ] Dependencies updated
- [ ] Security headers configured

### Post-Deployment
- [ ] HTTPS enforced
- [ ] Admin account secured
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Rate limiting active
- [ ] Audit logging enabled
- [ ] Error tracking setup

## Support & Resources

### Documentation
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Performance_Optimization)

### Emergency Contacts
- **System Administrator**: [Configure]
- **Database Administrator**: [Configure]
- **Security Team**: [Configure]

### Useful Commands

```bash
# Check application status
pm2 status

# View real-time logs
pm2 logs elevatus --lines 100

# Restart application
pm2 restart elevatus

# Database console
psql $DATABASE_URL

# Check disk usage
df -h

# Monitor system resources
htop
```

## Compliance & Auditing

### POPIA Compliance (South Africa)
- Ensure data encryption at rest and in transit
- Implement data retention policies
- Configure audit trails for data access
- Set up user consent management

### Audit Trail Configuration

Enable comprehensive audit logging:

```javascript
// lib/audit/logger.ts
export async function logActivity(userId, action, details) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      details,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      timestamp: new Date()
    }
  })
}
```

---

## Quick Start Checklist

1. [ ] Clone repository
2. [ ] Create `.env.production` file
3. [ ] Set up production database
4. [ ] Run migrations: `npx prisma migrate deploy`
5. [ ] Create admin user: `node scripts/create-admin.js`
6. [ ] Build application: `npm run build`
7. [ ] Deploy to hosting platform
8. [ ] Configure domain and SSL
9. [ ] Set up monitoring
10. [ ] Schedule backups
11. [ ] Test all critical paths
12. [ ] Go live! 🚀

---

*Last Updated: [Current Date]*
*Version: 1.0.0*