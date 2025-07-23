'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTestAttendanceRecords, getTestEmployees, isDevelopment } from '../../../../lib/test-data'

interface Employee {
  id: string
  firstName: string
  lastName: string
  employeeNumber: string
  department: string
}

export default function ManualAttendancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    breakDuration: '30',
    status: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-fill with test data in development
  const fillWithTestData = () => {
    const testRecords = getTestAttendanceRecords()
    if (testRecords.length > 0) {
      const randomRecord = testRecords[Math.floor(Math.random() * testRecords.length)]
      setFormData({
        employeeId: randomRecord.employeeId,
        date: randomRecord.date,
        clockIn: randomRecord.clockIn || '08:00',
        clockOut: randomRecord.clockOut || '17:00',
        breakDuration: randomRecord.breakDuration?.toString() || '30',
        status: randomRecord.status,
        notes: randomRecord.notes || ''
      })
      setErrors({})
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.employeeId) newErrors.employeeId = 'Employee is required'
    if (!formData.date) newErrors.date = 'Date is required'
    
    if (formData.status === 'PRESENT') {
      if (!formData.clockIn) newErrors.clockIn = 'Clock in time is required for present status'
      if (!formData.clockOut) newErrors.clockOut = 'Clock out time is required for present status'
      
      if (formData.clockIn && formData.clockOut) {
        const clockInTime = new Date(`${formData.date}T${formData.clockIn}`)
        const clockOutTime = new Date(`${formData.date}T${formData.clockOut}`)
        
        if (clockOutTime <= clockInTime) {
          newErrors.clockOut = 'Clock out time must be after clock in time'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateHours = () => {
    if (!formData.clockIn || !formData.clockOut) return { totalHours: 0, overtimeHours: 0 }
    
    const clockInTime = new Date(`${formData.date}T${formData.clockIn}`)
    const clockOutTime = new Date(`${formData.date}T${formData.clockOut}`)
    const breakMinutes = parseInt(formData.breakDuration) || 0
    
    const totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60) - breakMinutes
    const totalHours = totalMinutes / 60
    
    // Standard working hours is 8 hours
    const standardHours = 8
    const overtimeHours = Math.max(0, totalHours - standardHours)
    
    return {
      totalHours: Math.max(0, totalHours),
      overtimeHours
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const { totalHours, overtimeHours } = calculateHours()
      
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          date: formData.date,
          clockIn: formData.status === 'PRESENT' ? `${formData.date}T${formData.clockIn}` : null,
          clockOut: formData.status === 'PRESENT' ? `${formData.date}T${formData.clockOut}` : null,
          breakDuration: parseInt(formData.breakDuration) || 0,
          totalHours,
          overtimeHours,
          status: formData.status,
          notes: formData.notes
        })
      })

      if (response.ok) {
        router.push('/employer/attendance')
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Failed to create attendance record' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const { totalHours, overtimeHours } = calculateHours()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manual Attendance Entry</h1>
            <p className="text-gray-600 mt-2">Add attendance record manually</p>
          </div>
          <div className="flex space-x-3">
            {isDevelopment() && (
              <button
                type="button"
                onClick={fillWithTestData}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Fill Test Data
              </button>
            )}
            <Link
              href="/employer/attendance"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Attendance
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} (#{emp.employeeNumber}) - {emp.department}
                    </option>
                  ))}
                </select>
                {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
            </div>
          </div>

          {/* Attendance Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Attendance Status</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="HALF_DAY">Half Day</option>
              </select>
            </div>
          </div>

          {/* Time Information - Only show if Present or Late */}
          {(formData.status === 'PRESENT' || formData.status === 'LATE' || formData.status === 'HALF_DAY') && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Time Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clock In Time *
                  </label>
                  <input
                    type="time"
                    name="clockIn"
                    value={formData.clockIn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.clockIn ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clockIn && <p className="text-red-500 text-sm mt-1">{errors.clockIn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clock Out Time *
                  </label>
                  <input
                    type="time"
                    name="clockOut"
                    value={formData.clockOut}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.clockOut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clockOut && <p className="text-red-500 text-sm mt-1">{errors.clockOut}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="breakDuration"
                    value={formData.breakDuration}
                    onChange={handleInputChange}
                    min="0"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Time Calculation Summary */}
              {formData.clockIn && formData.clockOut && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Time Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Hours</p>
                      <p className="font-semibold text-blue-600">{totalHours.toFixed(2)}h</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Break</p>
                      <p className="font-semibold text-gray-900">{formData.breakDuration}min</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Overtime</p>
                      <p className={`font-semibold ${overtimeHours > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {overtimeHours.toFixed(2)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className={`font-semibold ${
                        formData.status === 'PRESENT' ? 'text-green-600' : 
                        formData.status === 'LATE' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {formData.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Notes</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any additional notes about this attendance record..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/employer/attendance"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Attendance Record'}
            </button>
          </div>

          {errors.submit && (
            <div className="text-red-500 text-center mt-4">{errors.submit}</div>
          )}
        </form>
      </div>
    </div>
  )
}