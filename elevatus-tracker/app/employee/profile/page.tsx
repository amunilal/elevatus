'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  employeeNumber: string
  position: string
  department: string
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED'
  hireDate: string
  phoneNumber: string
  address: string
  idNumber: string
  bankAccount: string
  bankName: string
  branchCode: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    bankAccount: '',
    bankName: '',
    branchCode: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // TODO: Get current user's employee ID from session
      const response = await fetch('/api/employee/profile')
      if (response.ok) {
        const data = await response.json()
        setEmployee(data)
        setFormData({
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          bankAccount: data.bankAccount || '',
          bankName: data.bankName || '',
          branchCode: data.branchCode || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSaving(true)
    try {
      const response = await fetch('/api/employee/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedEmployee = await response.json()
        setEmployee(updatedEmployee)
        setEditing(false)
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Failed to update profile' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="h-20 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">Unable to load your profile information.</p>
          <Link
            href="/employee/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            <Link
              href="/employee/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">#{employee.employeeNumber} • {employee.department}</p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  employee.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information - Read Only */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name:</span>
                <span className="font-medium">{employee.firstName} {employee.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{employee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID Number:</span>
                <span className="font-medium">{employee.idNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Employee Number:</span>
                <span className="font-medium">{employee.employeeNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Position:</span>
                <span className="font-medium">{employee.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium">{employee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hire Date:</span>
                <span className="font-medium">
                  {new Date(employee.hireDate).toLocaleDateString('en-ZA')}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                <strong>Note:</strong> To update personal information, please contact HR.
              </p>
            </div>
          </div>

          {/* Contact Information - Editable */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            {editing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+27 XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{employee.phoneNumber || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <p className="font-medium mt-1">{employee.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Banking Information - Editable */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
            {editing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bank</option>
                    <option value="ABSA Bank">ABSA Bank</option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="First National Bank">First National Bank</option>
                    <option value="Nedbank">Nedbank</option>
                    <option value="Capitec Bank">Capitec Bank</option>
                    <option value="Investec">Investec</option>
                    <option value="Discovery Bank">Discovery Bank</option>
                    <option value="African Bank">African Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
                    placeholder="6 digits"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <span className="font-medium">{employee.bankName || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch Code:</span>
                  <span className="font-medium">{employee.branchCode || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-medium">
                    {employee.bankAccount ? '***' + employee.bankAccount.slice(-4) : 'Not provided'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact - Editable */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            {editing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="+27 XX XXX XXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Name:</span>
                  <span className="font-medium">{employee.emergencyContactName || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Phone:</span>
                  <span className="font-medium">{employee.emergencyContactPhone || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {!editing && (
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/employee/attendance"
                className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <div className="text-blue-600 font-semibold">View Attendance</div>
                <div className="text-sm text-gray-600">Track work hours</div>
              </Link>
              <Link
                href="/employee/leave"
                className="bg-green-50 border border-green-200 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <div className="text-green-600 font-semibold">Leave Requests</div>
                <div className="text-sm text-gray-600">Apply for leave</div>
              </Link>
              <Link
                href="/employee/reviews"
                className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
              >
                <div className="text-purple-600 font-semibold">Performance</div>
                <div className="text-sm text-gray-600">View reviews</div>
              </Link>
              <Link
                href="/employee/learning"
                className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors"
              >
                <div className="text-orange-600 font-semibold">Learning</div>
                <div className="text-sm text-gray-600">Courses & badges</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}