'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  employee: {
    id: string
    firstName: string
    lastName: string
    employeeNumber: string
    department: string
  }
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
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  avgWorkingHours: number
  totalOvertimeHours: number
}

export default function AttendancePage() {
  const searchParams = useSearchParams()
  const selectedEmployeeId = searchParams?.get('employee')
  
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [filterEmployee, setFilterEmployee] = useState(selectedEmployeeId || '')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [employees, setEmployees] = useState<Array<{ id: string; firstName: string; lastName: string; employeeNumber: string; department: string }>>([])

  useEffect(() => {
    fetchAttendanceData()
    fetchEmployees()
  }, [selectedDate, filterEmployee, filterDepartment])

  const fetchAttendanceData = async () => {
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        ...(filterEmployee && { employeeId: filterEmployee }),
        ...(filterDepartment && { department: filterDepartment })
      })

      const [recordsResponse, statsResponse] = await Promise.all([
        fetch(`/api/attendance?${params}`),
        fetch(`/api/attendance/stats?${params}`)
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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }

  const departments = [...new Set(employees.map(emp => emp.department))]

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <Link
            href="/employer/attendance/manual"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Manual Entry
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Present Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-semibold text-sm">❌</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Absent Today</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">⏰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Avg Hours</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgWorkingHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee
              </label>
              <select
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} (#{emp.employeeNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split('T')[0])
                  setFilterEmployee('')
                  setFilterDepartment('')
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Records ({records.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {record.employee.firstName.charAt(0)}{record.employee.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {record.employee.firstName} {record.employee.lastName}
                          </div>
                          <div className="text-xs text-gray-500">#{record.employee.employeeNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.clockIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.clockOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.totalHours.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.overtimeHours > 0 ? (
                        <span className="text-orange-600 font-medium">
                          {record.overtimeHours.toFixed(2)}h
                        </span>
                      ) : (
                        '0h'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/employer/attendance/${record.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendance records found for the selected criteria.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/employer/attendance/reports"
              className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 font-semibold">View Reports</div>
              <div className="text-sm text-gray-600">Monthly reports</div>
            </Link>
            <Link
              href="/employer/attendance/export"
              className="bg-green-50 border border-green-200 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 font-semibold">Export Data</div>
              <div className="text-sm text-gray-600">CSV/Excel export</div>
            </Link>
            <Link
              href="/employer/attendance/settings"
              className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 font-semibold">Settings</div>
              <div className="text-sm text-gray-600">Work hours & rules</div>
            </Link>
            <Link
              href="/employer/attendance/bulk"
              className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 font-semibold">Bulk Import</div>
              <div className="text-sm text-gray-600">Upload CSV data</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}