'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  date: string
  clockIn: string | null
  clockOut: string | null
  breakDuration: number
  totalHours: number
  overtimeHours: number
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY'
  notes: string | null
}

interface AttendanceStats {
  totalWorkingDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  totalHours: number
  averageHours: number
  overtimeHours: number
}

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    fetchAttendanceData()
  }, [selectedMonth])

  const fetchAttendanceData = async () => {
    try {
      const [year, month] = selectedMonth.split('-')
      
      const [recordsResponse, statsResponse] = await Promise.all([
        fetch(`/api/employee/attendance?year=${year}&month=${month}`),
        fetch(`/api/employee/attendance/stats?year=${year}&month=${month}`)
      ])

      const recordsData = await recordsResponse.json()
      const statsData = await statsResponse.json()

      setRecords(recordsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A'
    return new Date(timeString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800'
      case 'LATE': return 'bg-yellow-100 text-yellow-800'
      case 'ABSENT': return 'bg-red-100 text-red-800'
      case 'HALF_DAY': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return '✅'
      case 'LATE': return '⏰'
      case 'ABSENT': return '❌'
      case 'HALF_DAY': return '🕐'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-gray-600">Track your work hours and attendance</p>
          </div>
          <Link
            href="/employee/dashboard"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Month Selector */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Working Days</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalWorkingDays}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">⏰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Overtime</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.overtimeHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Records */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Records ({records.length})
            </h2>
          </div>
          
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Break
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overtime
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-ZA')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString('en-ZA', { weekday: 'long' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          <span className="mr-1">{getStatusIcon(record.status)}</span>
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.clockIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.clockOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.breakDuration}min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.totalHours.toFixed(2)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.overtimeHours > 0 ? (
                          <span className="text-orange-600 font-medium">
                            {record.overtimeHours.toFixed(2)}h
                          </span>
                        ) : (
                          <span className="text-gray-500">0h</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
              <p className="text-gray-500">No attendance records found for the selected month.</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Attendance Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
            {stats && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance Rate:</span>
                  <span className="font-semibold text-green-600">
                    {stats.totalWorkingDays > 0 
                      ? Math.round((stats.presentDays / stats.totalWorkingDays) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Daily Hours:</span>
                  <span className="font-semibold">{stats.averageHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Days:</span>
                  <span className="font-semibold text-yellow-600">{stats.lateDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absent Days:</span>
                  <span className="font-semibold text-red-600">{stats.absentDays}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/employee/attendance/clock"
                className="block w-full bg-blue-50 border border-blue-200 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <div className="text-blue-600 font-semibold">Clock In/Out</div>
                <div className="text-sm text-gray-600">Mark your attendance</div>
              </Link>
              <Link
                href="/employee/attendance/export"
                className="block w-full bg-green-50 border border-green-200 p-3 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <div className="text-green-600 font-semibold">Export Records</div>
                <div className="text-sm text-gray-600">Download your data</div>
              </Link>
              <Link
                href="/employee/leave"
                className="block w-full bg-purple-50 border border-purple-200 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <div className="text-purple-600 font-semibold">Request Leave</div>
                <div className="text-sm text-gray-600">Apply for time off</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}