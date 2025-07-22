import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db'

export async function GET() {
  try {
    const dbHealthy = await checkDatabaseHealth()
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealthy ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }, { status: dbHealthy ? 200 : 503 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }, { status: 503 })
  }
}