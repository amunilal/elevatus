'use client'

import { useState, useEffect, Suspense } from 'react'
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

function AttendanceContent() {
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
      
      if (response.ok && Array.isArray(data)) {
        setEmployees(data)
      } else {
        console.error('Failed to fetch employees:', data.error || 'Invalid response')
        setEmployees([])
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      setEmployees([])
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
          <div className="flex space-x-3">
            <Link
              href="/employer/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/employer/attendance/manual"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Manual Entry
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg width="36" height="39" viewBox="0 0 36 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.63146 5.87216C9.15019 5.1146 10.8625 4.95878 12.4748 5.43142C13.2593 5.6614 13.7248 6.54362 13.5146 7.40192C13.3044 8.26022 12.4981 8.76957 11.7135 8.53959C10.7608 8.26031 9.74901 8.35239 8.85158 8.80003C7.95415 9.24768 7.22705 10.023 6.79497 10.993C6.36289 11.963 6.25277 13.0673 6.48349 14.1165C6.71421 15.1656 7.2714 16.0942 8.05948 16.743C8.48703 17.0951 8.70608 17.6734 8.63144 18.253C8.5568 18.8327 8.20025 19.3223 7.70046 19.5314C6.70142 19.9493 5.78366 20.5949 5.01282 21.4382C4.75312 21.7223 4.514 22.0246 4.29646 22.3424C3.84319 23.0045 3.87274 23.5591 4.11129 24.0557C4.39297 24.6422 5.04021 25.2502 5.95573 25.5653C6.73049 25.8319 7.16098 26.7352 6.91727 27.5828C6.67355 28.4305 5.84792 28.9015 5.07317 28.6348C3.57052 28.1177 2.21941 27.0343 1.50771 25.5526C0.752878 23.9811 0.794017 22.0907 1.94243 20.4133C2.24336 19.9737 2.57408 19.5557 2.93309 19.1629C3.48663 18.5573 4.095 18.0254 4.74541 17.5731C4.2219 16.7637 3.83905 15.8474 3.62392 14.8692C3.23347 13.0937 3.41983 11.2249 4.15103 9.58337C4.88224 7.94179 6.11273 6.62971 7.63146 5.87216ZM26.4422 8.80003C25.5447 8.35239 24.5329 8.26031 23.5802 8.53959C22.7957 8.76957 21.9893 8.26022 21.7791 7.40192C21.5689 6.54362 22.0345 5.6614 22.819 5.43142C24.4312 4.95878 26.1436 5.1146 27.6623 5.87216C29.181 6.62971 30.4115 7.94179 31.1427 9.58337C31.8739 11.2249 32.0603 13.0937 31.6698 14.8692C31.4547 15.8474 31.0719 16.7637 30.5483 17.5731C31.1988 18.0254 31.8071 18.5573 32.3607 19.1629C32.7197 19.5557 33.0504 19.9737 33.3513 20.4133C34.4997 22.0907 34.5409 23.9811 33.7861 25.5526C33.0744 27.0343 31.7232 28.1177 30.2206 28.6348C29.4458 28.9015 28.6202 28.4305 28.3765 27.5828C28.1328 26.7352 28.5633 25.8319 29.338 25.5653C30.2536 25.2502 30.9008 24.6422 31.1825 24.0557C31.421 23.5591 31.4506 23.0045 30.9973 22.3424C30.7798 22.0246 30.5406 21.7223 30.2809 21.4382C29.5101 20.5949 28.5923 19.9493 27.5933 19.5314C27.0935 19.3223 26.737 18.8327 26.6623 18.253C26.5877 17.6734 26.8067 17.0951 27.2343 16.743C28.0224 16.0942 28.5796 15.1656 28.8103 14.1165C29.041 13.0673 28.9309 11.963 28.4988 10.993C28.0667 10.023 27.3396 9.24768 26.4422 8.80003ZM17.6471 11.599C15.3008 11.599 13.3987 13.68 13.3987 16.247C13.3987 18.814 15.3008 20.8951 17.6471 20.8951C19.9934 20.8951 21.8954 18.814 21.8954 16.247C21.8954 13.68 19.9934 11.599 17.6471 11.599ZM22.4168 22.1327C23.9012 20.6917 24.8366 18.5889 24.8366 16.247C24.8366 11.9028 21.6177 8.38121 17.6471 8.38121C13.6764 8.38121 10.4575 11.9028 10.4575 16.247C10.4575 18.5889 11.393 20.6917 12.8774 22.1327C11.8733 22.6848 10.9465 23.4128 10.137 24.2984C9.77796 24.6912 9.44725 25.1093 9.14632 25.5489C8.47187 26.534 8.15427 27.632 8.21019 28.74C8.26526 29.831 8.67545 30.8078 9.26186 31.5964C10.4158 33.1481 12.3507 34.1239 14.3791 34.1239H20.9151C22.9435 34.1239 24.8784 33.1481 26.0323 31.5964C26.6188 30.8078 27.0289 29.831 27.084 28.74C27.1399 27.632 26.8223 26.534 26.1479 25.5489C25.847 25.1093 25.5162 24.6912 25.1572 24.2984C24.3477 23.4128 23.4209 22.6848 22.4168 22.1327ZM17.6471 24.1129C15.6103 24.1129 13.6569 24.9981 12.2167 26.5738C11.957 26.8579 11.7179 27.1602 11.5004 27.478C11.201 27.9152 11.1326 28.2786 11.1469 28.5626C11.1621 28.8636 11.2784 29.2094 11.5433 29.5656C12.092 30.3034 13.1588 30.9061 14.3791 30.9061H20.9151C22.1354 30.9061 23.2022 30.3034 23.7509 29.5656C24.0158 29.2094 24.1321 28.8636 24.1473 28.5626C24.1616 28.2786 24.0932 27.9152 23.7938 27.478C23.5763 27.1602 23.3372 26.8579 23.0775 26.5738C21.6373 24.9981 19.6839 24.1129 17.6471 24.1129Z" fill="white"/>
                    </svg>
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

export default function AttendancePage() {
  return (
    <Suspense fallback={
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
    }>
      <AttendanceContent />
    </Suspense>
  )
}