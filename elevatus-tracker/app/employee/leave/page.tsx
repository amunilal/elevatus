'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaveRequest {
  id: string
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'STUDY' | 'UNPAID'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  appliedDate: string
  approvedBy?: {
    firstName: string
    lastName: string
  }
  approvedDate?: string
  rejectionReason?: string
}

interface LeaveBalance {
  annual: number
  sick: number
  maternity: number
  paternity: number
  study: number
  used: {
    annual: number
    sick: number
    maternity: number
    paternity: number
    study: number
  }
  remaining: {
    annual: number
    sick: number
    maternity: number
    paternity: number
    study: number
  }
}

export default function EmployeeLeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [balance, setBalance] = useState<LeaveBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    fetchLeaveData()
  }, [filterStatus, filterType])

  const fetchLeaveData = async () => {
    try {
      const params = new URLSearchParams({
        ...(filterStatus && { status: filterStatus }),
        ...(filterType && { type: filterType })
      })

      const [requestsResponse, balanceResponse] = await Promise.all([
        fetch(`/api/employee/leave?${params}`),
        fetch('/api/employee/leave/balance')
      ])

      const requestsData = await requestsResponse.json()
      const balanceData = await balanceResponse.json()

      setRequests(requestsData)
      setBalance(balanceData)
    } catch (error) {
      console.error('Failed to fetch leave data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ANNUAL': return 'bg-blue-100 text-blue-800'
      case 'SICK': return 'bg-red-100 text-red-800'
      case 'MATERNITY': return 'bg-pink-100 text-pink-800'
      case 'PATERNITY': return 'bg-purple-100 text-purple-800'
      case 'STUDY': return 'bg-green-100 text-green-800'
      case 'UNPAID': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Leave</h1>
            <p className="text-gray-600">Manage your leave requests and balance</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/employee/leave/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Leave
            </Link>
            <Link
              href="/employee/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Leave Balance Cards */}
        {balance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Annual Leave</p>
                  <p className="text-2xl font-bold text-blue-600">{balance.remaining.annual}</p>
                  <p className="text-xs text-gray-400">of {balance.annual} days</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Used: {balance.used.annual}</div>
                  <div>Remaining: {balance.remaining.annual}</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${balance.annual > 0 ? (balance.used.annual / balance.annual) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sick Leave</p>
                  <p className="text-2xl font-bold text-red-600">{balance.remaining.sick}</p>
                  <p className="text-xs text-gray-400">of {balance.sick} days</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Used: {balance.used.sick}</div>
                  <div>Remaining: {balance.remaining.sick}</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ 
                    width: `${balance.sick > 0 ? (balance.used.sick / balance.sick) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Study Leave</p>
                  <p className="text-2xl font-bold text-green-600">{balance.remaining.study}</p>
                  <p className="text-xs text-gray-400">of {balance.study} days</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Used: {balance.used.study}</div>
                  <div>Remaining: {balance.remaining.study}</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${balance.study > 0 ? (balance.used.study / balance.study) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="ANNUAL">Annual</option>
                <option value="SICK">Sick</option>
                <option value="MATERNITY">Maternity</option>
                <option value="PATERNITY">Paternity</option>
                <option value="STUDY">Study</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('')
                  setFilterType('')
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              My Leave Requests ({requests.length})
            </h2>
            <Link
              href="/employee/leave/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              New Request
            </Link>
          </div>
          
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                          {request.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {new Date(request.startDate).toLocaleDateString('en-ZA')} - 
                            {new Date(request.endDate).toLocaleDateString('en-ZA')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.days} {request.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.status === 'APPROVED' && request.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            by {request.approvedBy.firstName} {request.approvedBy.lastName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.appliedDate).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/employee/leave/${request.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </Link>
                        {request.status === 'PENDING' && (
                          <Link
                            href={`/employee/leave/${request.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏖️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Leave Requests</h3>
              <p className="text-gray-500 mb-4">You haven't submitted any leave requests yet.</p>
              <Link
                href="/employee/leave/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Request Your First Leave
              </Link>
            </div>
          )}
        </div>

        {/* Leave Policies */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Policies (BCEA Compliant)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Annual Leave</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 21 consecutive days per year (3 weeks)</li>
                <li>• Must be taken within 18 months</li>
                <li>• Minimum 7 consecutive days once per year</li>
                <li>• Advance notice required</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sick Leave</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 30 days per 3-year cycle</li>
                <li>• Medical certificate required (3+ days)</li>
                <li>• Cannot be carried forward</li>
                <li>• No payment if exhausted</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Maternity Leave</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 4 consecutive months (17+ weeks)</li>
                <li>• UIF benefits available</li>
                <li>• Medical certificate required</li>
                <li>• Job protection guaranteed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Family Responsibility</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3 days per year for family duties</li>
                <li>• Child illness, spouse death, etc.</li>
                <li>• Proof may be required</li>
                <li>• Cannot be carried forward</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/employee/leave/calendar"
              className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 font-semibold">Leave Calendar</div>
              <div className="text-sm text-gray-600">View company calendar</div>
            </Link>
            <Link
              href="/employee/leave/balance"
              className="bg-green-50 border border-green-200 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 font-semibold">Balance History</div>
              <div className="text-sm text-gray-600">Track your usage</div>
            </Link>
            <Link
              href="/employee/leave/policies"
              className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 font-semibold">Leave Policies</div>
              <div className="text-sm text-gray-600">BCEA guidelines</div>
            </Link>
            <Link
              href="/employee/leave/export"
              className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 font-semibold">Export Records</div>
              <div className="text-sm text-gray-600">Download your data</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}