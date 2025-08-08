#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Validates required environment variables for different environments
 */

const fs = require('fs')
const path = require('path')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function printSuccess(message) { print('green', `✓ ${message}`) }
function printError(message) { print('red', `✗ ${message}`) }
function printWarning(message) { print('yellow', `⚠ ${message}`) }
function printInfo(message) { print('blue', `→ ${message}`) }

// Environment configurations
const envConfigs = {
  development: {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ],
    optional: [
      'SMTP_HOST',
      'SMTP_PORT',
      'REDIS_URL',
      'APP_URL'
    ]
  },
  production: {
    required: [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'APP_URL',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'SMTP_FROM'
    ],
    optional: [
      'REDIS_URL',
      'SENTRY_DSN',
      'VERCEL_ANALYTICS_ID',
      'BLOB_READ_WRITE_TOKEN',
      'CSP_HEADER'
    ]
  }
}

// Validation rules
const validationRules = {
  DATABASE_URL: (value) => {
    if (!value.startsWith('postgresql://') && !value.startsWith('postgres://')) {
      return 'Must be a valid PostgreSQL connection string'
    }
    if (value.includes('localhost') || value.includes('127.0.0.1')) {
      return 'Warning: Using localhost database in production'
    }
    return null
  },
  
  NEXTAUTH_SECRET: (value) => {
    if (value.length < 32) {
      return 'Must be at least 32 characters long'
    }
    return null
  },
  
  NEXTAUTH_URL: (value) => {
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' && !url.hostname.includes('localhost')) {
        return 'Should use HTTPS in production'
      }
    } catch (e) {
      return 'Must be a valid URL'
    }
    return null
  },
  
  APP_URL: (value) => {
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' && !url.hostname.includes('localhost')) {
        return 'Should use HTTPS in production'
      }
    } catch (e) {
      return 'Must be a valid URL'
    }
    return null
  },
  
  SMTP_PORT: (value) => {
    const port = parseInt(value)
    if (isNaN(port) || port < 1 || port > 65535) {
      return 'Must be a valid port number (1-65535)'
    }
    return null
  }
}

function loadEnvFile(environment) {
  const envFiles = [
    `.env.${environment}`,
    '.env.local',
    '.env'
  ]
  
  const env = {}
  
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      printInfo(`Loading ${file}`)
      const content = fs.readFileSync(file, 'utf8')
      
      // Parse .env file format
      content.split('\n').forEach(line => {
        line = line.trim()
        if (line && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=')
          if (key && valueParts.length > 0) {
            let value = valueParts.join('=')
            // Remove quotes if present
            value = value.replace(/^["'](.*)["']$/, '$1')
            env[key.trim()] = value.trim()
          }
        }
      })
    }
  }
  
  return env
}

function validateEnvironment(environment) {
  console.log('')
  console.log(`🔍 Validating ${environment} environment`)
  console.log('='.repeat(40))
  
  const config = envConfigs[environment]
  if (!config) {
    printError(`Unknown environment: ${environment}`)
    return false
  }
  
  const env = loadEnvFile(environment)
  let isValid = true
  let warningCount = 0
  
  // Check required variables
  console.log('')
  printInfo('Checking required variables...')
  for (const varName of config.required) {
    const value = env[varName]
    
    if (!value) {
      printError(`${varName} is required but not set`)
      isValid = false
    } else {
      const validator = validationRules[varName]
      if (validator) {
        const error = validator(value)
        if (error) {
          if (error.startsWith('Warning:')) {
            printWarning(`${varName}: ${error}`)
            warningCount++
          } else {
            printError(`${varName}: ${error}`)
            isValid = false
          }
        } else {
          printSuccess(`${varName} is valid`)
        }
      } else {
        printSuccess(`${varName} is set`)
      }
    }
  }
  
  // Check optional variables
  console.log('')
  printInfo('Checking optional variables...')
  for (const varName of config.optional) {
    const value = env[varName]
    
    if (!value) {
      printWarning(`${varName} is not set (optional)`)
      warningCount++
    } else {
      const validator = validationRules[varName]
      if (validator) {
        const error = validator(value)
        if (error) {
          if (error.startsWith('Warning:')) {
            printWarning(`${varName}: ${error}`)
            warningCount++
          } else {
            printError(`${varName}: ${error}`)
            isValid = false
          }
        } else {
          printSuccess(`${varName} is valid`)
        }
      } else {
        printSuccess(`${varName} is set`)
      }
    }
  }
  
  // Production-specific checks
  if (environment === 'production') {
    console.log('')
    printInfo('Running production-specific checks...')
    
    // Check for insecure values
    const insecurePatterns = [
      { key: 'NEXTAUTH_SECRET', patterns: ['secret', 'password', 'changeme', 'test'] },
      { key: 'DATABASE_URL', patterns: ['password', 'admin', '123'] }
    ]
    
    for (const check of insecurePatterns) {
      const value = env[check.key]
      if (value) {
        const lowerValue = value.toLowerCase()
        for (const pattern of check.patterns) {
          if (lowerValue.includes(pattern)) {
            printWarning(`${check.key} contains insecure pattern: "${pattern}"`)
            warningCount++
          }
        }
      }
    }
    
    // Check SSL requirements
    if (env.DATABASE_URL && !env.DATABASE_URL.includes('sslmode=require')) {
      printWarning('DATABASE_URL should include sslmode=require for production')
      warningCount++
    }
  }
  
  // Summary
  console.log('')
  console.log('='.repeat(40))
  if (isValid) {
    if (warningCount === 0) {
      printSuccess('✅ All validations passed!')
    } else {
      printWarning(`⚠️  Validation passed with ${warningCount} warning(s)`)
    }
  } else {
    printError('❌ Validation failed!')
  }
  
  if (environment === 'production') {
    console.log('')
    printInfo('Production deployment checklist:')
    console.log('  □ SSL/TLS certificates configured')
    console.log('  □ Domain properly configured')
    console.log('  □ Database backups scheduled')
    console.log('  □ Monitoring and alerting setup')
    console.log('  □ Log aggregation configured')
    console.log('  □ Security headers implemented')
  }
  
  return isValid
}

// Main execution
function main() {
  const environment = process.argv[2] || process.env.NODE_ENV || 'development'
  
  console.log('🔧 Elevatus Environment Validator')
  console.log('================================')
  
  const isValid = validateEnvironment(environment)
  
  if (!isValid) {
    console.log('')
    printError('Fix the above issues before proceeding')
    process.exit(1)
  }
  
  console.log('')
  printSuccess(`Environment "${environment}" is ready!`)
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { validateEnvironment }