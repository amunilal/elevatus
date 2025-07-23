'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  getRandomEmployee,
  getRandomBankDetails,
  generateRandomPhoneNumber,
  getDepartments,
  getPositions,
  getBankingDetails,
  isDevelopment
} from '../../../../../lib/test-data'

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
  salary: number
  phoneNumber: string
  address: string
  idNumber: string
  taxNumber: string
  bankAccount: string
  bankName: string
  branchCode: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()
  const departments = getDepartments()
  const positions = getPositions()
  const bankingDetails = getBankingDetails()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeNumber: '',
    position: '',
    department: '',
    hireDate: '',
    salary: '',
    phoneNumber: '',
    address: '',
    idNumber: '',
    taxNumber: '',
    bankAccount: '',
    bankName: '',
    branchCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'TERMINATED'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchEmployee()
  }, [params.id])

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/employees/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEmployee(data)
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          employeeNumber: data.employeeNumber,
          position: data.position,
          department: data.department,
          hireDate: data.hireDate.split('T')[0], // Convert to YYYY-MM-DD format
          salary: data.salary.toString(),
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          idNumber: data.idNumber,
          taxNumber: data.taxNumber || '',
          bankAccount: data.bankAccount || '',
          bankName: data.bankName || '',
          branchCode: data.branchCode || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
          status: data.status
        })
      } else {
        setErrors({ fetch: 'Employee not found' })
      }
    } catch (error) {
      setErrors({ fetch: 'Failed to fetch employee details' })
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.employeeNumber.trim()) newErrors.employeeNumber = 'Employee number is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required'
    if (!formData.salary) newErrors.salary = 'Salary is required'
    else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a valid positive number'
    }
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required'
    else if (!/^\d{13}$/.test(formData.idNumber)) newErrors.idNumber = 'ID number must be 13 digits'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/employees/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary)
        })
      })

      if (response.ok) {
        router.push(`/employer/employees/${params.id}`)
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Failed to update employee' })
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
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
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

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600 mb-8">{errors.fetch}</p>
          <Link
            href="/employer/employees"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Employees
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-gray-600 mt-2">Update employee information</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/employer/employees/${params.id}`}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              View Details
            </Link>
            <Link
              href="/employer/employees"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  South African ID Number *
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="13 digits"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.idNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Number
                </label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Employment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Number *
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., EMP001"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employeeNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.employeeNumber && <p className="text-red-500 text-sm mt-1">{errors.employeeNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hireDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Salary (ZAR) *
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., 25000"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Banking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/employer/employees/${params.id}`}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Update Employee'}
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