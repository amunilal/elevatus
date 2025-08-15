/**
 * Safari-compatible logger utility
 * Handles console methods being undefined in Safari production mode
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 100
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true'

  private constructor() {
    // Ensure console methods exist (Safari fix)
    this.ensureConsoleMethods()
    
    // Initialize with a startup message
    this.info('Logger initialized', { 
      environment: process.env.NODE_ENV,
      debugEnabled: this.isDebugEnabled,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR'
    })
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private ensureConsoleMethods() {
    if (typeof window === 'undefined') return

    // Safari in production sometimes strips or makes console methods undefined
    const noop = () => {}
    const methods: (keyof Console)[] = ['log', 'debug', 'info', 'warn', 'error', 'group', 'groupEnd', 'groupCollapsed']
    
    methods.forEach(method => {
      if (!window.console) {
        (window as any).console = {}
      }
      if (!window.console[method] || typeof window.console[method] !== 'function') {
        (window.console as any)[method] = noop
      }
    })
  }

  private safeConsoleCall(method: keyof Console, ...args: any[]) {
    try {
      // Double-check the method exists before calling
      if (typeof console !== 'undefined' && console[method] && typeof console[method] === 'function') {
        (console[method] as Function).apply(console, args)
      }
    } catch (error) {
      // Fallback to localStorage if console fails
      this.fallbackLog('error', `Console method ${method} failed: ${error}`)
    }
  }

  private fallbackLog(level: LogLevel, message: string, data?: any) {
    if (typeof window === 'undefined' || !window.localStorage) return

    try {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data
      }

      // Store in memory
      this.logs.push(logEntry)
      if (this.logs.length > this.maxLogs) {
        this.logs.shift()
      }

      // Store in localStorage for debugging
      const storageKey = 'elevatus_logs'
      const existingLogs = localStorage.getItem(storageKey)
      const logs = existingLogs ? JSON.parse(existingLogs) : []
      logs.push(logEntry)
      
      // Keep only recent logs
      if (logs.length > this.maxLogs) {
        logs.splice(0, logs.length - this.maxLogs)
      }
      
      localStorage.setItem(storageKey, JSON.stringify(logs))
    } catch (e) {
      // Silent fail - nothing we can do if localStorage also fails
    }
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    return `${prefix} ${message}`
  }

  debug(message: string, data?: any) {
    if (!this.isDevelopment && !this.isDebugEnabled) return
    
    const formattedMessage = this.formatMessage('debug', message)
    this.safeConsoleCall('debug', formattedMessage, data)
    this.fallbackLog('debug', message, data)
  }

  info(message: string, data?: any) {
    const formattedMessage = this.formatMessage('info', message)
    this.safeConsoleCall('info', formattedMessage, data)
    this.fallbackLog('info', message, data)
  }

  warn(message: string, data?: any) {
    const formattedMessage = this.formatMessage('warn', message)
    this.safeConsoleCall('warn', formattedMessage, data)
    this.fallbackLog('warn', message, data)
  }

  error(message: string, error?: any) {
    const formattedMessage = this.formatMessage('error', message)
    this.safeConsoleCall('error', formattedMessage, error)
    this.fallbackLog('error', message, error)
  }

  // Get stored logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Get logs from localStorage
  getStoredLogs(): LogEntry[] {
    if (typeof window === 'undefined' || !window.localStorage) return []
    
    try {
      const stored = localStorage.getItem('elevatus_logs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Clear stored logs
  clearLogs() {
    this.logs = []
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('elevatus_logs')
      } catch {
        // Silent fail
      }
    }
  }

  // Export logs as JSON for debugging
  exportLogs(): string {
    const allLogs = this.getStoredLogs()
    return JSON.stringify(allLogs, null, 2)
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Export type for use in other files
export type { LogEntry, LogLevel }