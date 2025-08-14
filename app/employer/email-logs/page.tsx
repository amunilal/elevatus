'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

interface EmailLog {
  id: string
  to: string
  subject: string
  emailType: string
  status: string
  templateUsed: string | null
  sentAt: string
  failureReason: string | null
  userId: string | null
  employeeId: string | null
  employerId: string | null
  metadata: any
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export default function EmailLogsPage() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEmailType, setFilterEmailType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasMore: false
  })
  const [selectedEmailLog, setSelectedEmailLog] = useState<EmailLog | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toast = useToast()

  useEffect(() => {
    fetchEmailLogs()
  }, [searchTerm, filterEmailType, filterStatus, pagination.page])

  const fetchEmailLogs = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (filterEmailType) params.append('emailType', filterEmailType)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/email-logs?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setEmailLogs(data.emailLogs)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch email logs:', data.error)
        toast.error('Failed to load email logs', data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Failed to fetch email logs:', error)
      toast.error('Failed to load email logs', 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (type: 'emailType' | 'status', value: string) => {
    if (type === 'emailType') {
      setFilterEmailType(value)
    } else {
      setFilterStatus(value)
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const openEmailDetails = (emailLog: EmailLog) => {
    setSelectedEmailLog(emailLog)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedEmailLog(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'success'
      case 'FAILED':
        return 'error'
      case 'PENDING':
        return 'warning'
      case 'DELIVERED':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getEmailTypeColor = (emailType: string) => {
    switch (emailType) {
      case 'WELCOME':
        return 'success'
      case 'PASSWORD_SETUP':
        return 'purple'
      case 'PASSWORD_RESET':
        return 'warning'
      case 'REVIEW_NOTIFICATION':
        return 'blue'
      case 'LEAVE_REQUEST':
        return 'orange'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading && emailLogs.length === 0) {
    return (
      <div className="min-h-screen bg-bg-base p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-8"></div>
            <div className="bg-nav-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-secondary-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="bg-nav-white px-6 py-4 border-b border-secondary-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <Badge variant="purple" size="sm">Employer Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/employer/dashboard">Dashboard</Link>
            </Button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('user')
                  sessionStorage.clear()
                  window.location.href = '/employer/login'
                }
              }}
              className="text-sm text-hover-magenta hover:text-brand-middle font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Email Logs</h1>
              <p className="text-secondary-600 mt-1">Track all emails sent from the system</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" size="sm">
                Total: {pagination.total}
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchEmailLogs}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-nav-white rounded-2xl p-6 mb-6 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by email or subject..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle placeholder-secondary-500 text-secondary-900"
              />
            </div>
            <div>
              <select
                value={filterEmailType}
                onChange={(e) => handleFilterChange('emailType', e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900"
              >
                <option value="">All Email Types</option>
                <option value="WELCOME">Welcome</option>
                <option value="PASSWORD_SETUP">Password Setup</option>
                <option value="PASSWORD_RESET">Password Reset</option>
                <option value="REVIEW_NOTIFICATION">Review Notification</option>
                <option value="LEAVE_REQUEST">Leave Request</option>
                <option value="SYSTEM_NOTIFICATION">System Notification</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900"
              >
                <option value="">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Logs Table */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">
              Email Logs ({pagination.total})
            </h2>
            
            {emailLogs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-secondary-500">No email logs found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-4 px-6 font-semibold text-secondary-700 text-sm">Recipient</th>
                        <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Subject</th>
                        <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Type</th>
                        <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Sent At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map((log) => (
                        <tr 
                          key={log.id}
                          onClick={() => openEmailDetails(log)}
                          className="border-b border-secondary-100 hover:bg-light-purple cursor-pointer transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-secondary-900">
                              {log.to}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-secondary-700 truncate max-w-xs">
                              {log.subject}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={getEmailTypeColor(log.emailType) as any}
                              size="sm"
                            >
                              {log.emailType.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={getStatusColor(log.status) as any}
                              size="sm"
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-secondary-600 text-sm">
                              {formatDate(log.sentAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-secondary-200">
                    <div className="text-sm text-secondary-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} entries
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasMore}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Email Details Sidebar */}
      {sidebarOpen && selectedEmailLog && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div 
            className={`fixed inset-y-0 right-0 bg-nav-white shadow-xl transform ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out z-50 w-1/2`}
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">Email Details</h3>
              <button 
                onClick={closeSidebar}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-semibold text-secondary-900 mb-3">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Recipient</p>
                    <p className="text-sm font-medium text-secondary-900">{selectedEmailLog.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Subject</p>
                    <p className="text-sm font-medium text-secondary-900">{selectedEmailLog.subject}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-secondary-500 mb-1">Email Type</p>
                      <Badge variant={getEmailTypeColor(selectedEmailLog.emailType) as any} size="sm">
                        {selectedEmailLog.emailType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500 mb-1">Status</p>
                      <Badge variant={getStatusColor(selectedEmailLog.status) as any} size="sm">
                        {selectedEmailLog.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Sent At</p>
                    <p className="text-sm font-medium text-secondary-900">{formatDate(selectedEmailLog.sentAt)}</p>
                  </div>
                  {selectedEmailLog.templateUsed && (
                    <div>
                      <p className="text-sm text-secondary-500 mb-1">Template Used</p>
                      <p className="text-sm font-medium text-secondary-900">{selectedEmailLog.templateUsed}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Failure Information */}
              {selectedEmailLog.status === 'FAILED' && selectedEmailLog.failureReason && (
                <div>
                  <h4 className="text-md font-semibold text-error-600 mb-3">Failure Information</h4>
                  <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                    <p className="text-sm text-error-800">{selectedEmailLog.failureReason}</p>
                  </div>
                </div>
              )}

              {/* User Information */}
              {(selectedEmailLog.userId || selectedEmailLog.employeeId || selectedEmailLog.employerId) && (
                <div>
                  <h4 className="text-md font-semibold text-secondary-900 mb-3">Related User</h4>
                  <div className="space-y-2">
                    {selectedEmailLog.userId && (
                      <div>
                        <p className="text-sm text-secondary-500 mb-1">User ID</p>
                        <p className="text-sm font-mono text-secondary-900">{selectedEmailLog.userId}</p>
                      </div>
                    )}
                    {selectedEmailLog.employeeId && (
                      <div>
                        <p className="text-sm text-secondary-500 mb-1">Employee ID</p>
                        <p className="text-sm font-mono text-secondary-900">{selectedEmailLog.employeeId}</p>
                      </div>
                    )}
                    {selectedEmailLog.employerId && (
                      <div>
                        <p className="text-sm text-secondary-500 mb-1">Employer ID</p>
                        <p className="text-sm font-mono text-secondary-900">{selectedEmailLog.employerId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedEmailLog.metadata && (
                <div>
                  <h4 className="text-md font-semibold text-secondary-900 mb-3">Metadata</h4>
                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                    <pre className="text-sm text-secondary-800 whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(selectedEmailLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onDismiss={toast.removeToast}
        position="top-right"
      />
    </div>
  )
}