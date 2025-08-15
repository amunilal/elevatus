'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import type { LogEntry } from '@/lib/logger'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  useEffect(() => {
    // Only show debug panel in development or when debug mode is enabled
    const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true' || process.env.NODE_ENV === 'development'
    setShowDebugPanel(isDebugEnabled)
    
    if (isDebugEnabled) {
      // Load logs on mount
      setLogs(logger.getStoredLogs())
      
      // Refresh logs periodically
      const interval = setInterval(() => {
        setLogs(logger.getStoredLogs())
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [])

  if (!showDebugPanel) return null

  const clearLogs = () => {
    logger.clearLogs()
    setLogs([])
  }

  const exportLogs = () => {
    const logData = logger.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `elevatus-logs-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600'
      case 'warn': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      case 'debug': return 'text-gray-600'
      default: return 'text-gray-800'
    }
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Toggle Debug Panel"
      >
        🐛 Debug ({logs.length})
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
            <h3 className="font-semibold">Debug Logs</h3>
            <div className="flex gap-2">
              <button
                onClick={exportLogs}
                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                title="Export Logs"
              >
                Export
              </button>
              <button
                onClick={clearLogs}
                className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                title="Clear Logs"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80 p-4 bg-gray-50">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No logs available</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 flex-shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`font-semibold uppercase ${getLogColor(log.level)}`}>
                        [{log.level}]
                      </span>
                      <span className="text-gray-800 break-all">
                        {log.message}
                      </span>
                    </div>
                    {log.data && (
                      <pre className="mt-1 ml-4 text-gray-600 bg-gray-100 p-1 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}