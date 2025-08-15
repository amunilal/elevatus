import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logger'

// Enable connection caching for better performance
neonConfig.fetchConnectionCache = true

const createPrismaClient = (): PrismaClient => {
  // Use Neon adapter for serverless environments (Vercel)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // Optimize for serverless with shorter connection timeout
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      max: 20 // Limit concurrent connections
    })
    const adapter = new PrismaNeon(pool)
    
    return new PrismaClient({ 
      adapter: adapter as any,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    } as any)
  }
  
  // Use standard Prisma client for local development
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
}

// Global instance management for serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper function to handle connection retries
export async function connectWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      // Retry on connection errors
      if (error.message.includes('connection') || error.message.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return connectWithRetry(operation, retries - 1)
      }
    }
    throw error
  }
}

// Health check function for database connection
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error('Database health check failed', error)
    return false
  }
}