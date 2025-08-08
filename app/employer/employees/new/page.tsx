'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { useActivity } from '@/contexts/ActivityContext'
import { getDepartments, getPositionsForDepartment, isValidDepartmentPosition } from '@/lib/departmentPositions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { 
  getRandomEmployee, 
  getRandomBankDetails, 
  getRandomAddress, 
  generateRandomPhoneNumber,
  generateRandomIdNumber,
  generateRandomEmployeeNumber,
  generateRandomBankAccount,
  getBankingDetails,
  isDevelopment
} from '../../../../lib/test-data'

export default function NewEmployeePage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { addActivity } = useActivity()
  const [loading, setLoading] = useState(false)
  const bankingDetails = getBankingDetails()
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
    status: 'ACTIVE'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availablePositions, setAvailablePositions] = useState<string[]>([])
  const [departments] = useState<string[]>(getDepartments())

  // Update available positions when department changes
  useEffect(() => {
    if (formData.department) {
      const positions = getPositionsForDepartment(formData.department)
      setAvailablePositions(positions)
      
      // Clear position if it's not valid for the new department
      if (formData.position && !positions.includes(formData.position)) {
        setFormData(prev => ({ ...prev, position: '' }))
      }
    } else {
      setAvailablePositions([])
      setFormData(prev => ({ ...prev, position: '' }))
    }
  }, [formData.department, formData.position])

  // Auto-fill with test data in development
  const fillWithTestData = () => {
    const randomEmployee = getRandomEmployee()
    const randomBank = getRandomBankDetails()
    const randomAddress = getRandomAddress()
    
    setFormData({
      firstName: randomEmployee.firstName,
      lastName: randomEmployee.lastName,
      email: randomEmployee.email,
      employeeNumber: generateRandomEmployeeNumber(),
      position: randomEmployee.position,
      department: randomEmployee.department,
      hireDate: randomEmployee.hiredDate,
      salary: randomEmployee.salary.toString(),
      phoneNumber: generateRandomPhoneNumber(),
      address: randomAddress.address,
      idNumber: generateRandomIdNumber(),
      taxNumber: generateRandomIdNumber(),
      bankAccount: generateRandomBankAccount().toString(),
      bankName: randomBank.bankName,
      branchCode: randomBank.branchCode,
      emergencyContactName: `${randomEmployee.firstName} Emergency Contact`,
      emergencyContactPhone: generateRandomPhoneNumber(),
      status: 'ACTIVE'
    })
    
    // Clear any existing errors
    setErrors({})
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
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    else if (formData.department && !isValidDepartmentPosition(formData.department, formData.position)) {
      newErrors.position = 'Invalid position for selected department'
    }
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

    setLoading(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary)
        })
      })

      if (response.ok) {
        const createdEmployee = await response.json()
        
        // Add activity
        addActivity({
          type: 'employee_created',
          message: `New employee ${formData.firstName} ${formData.lastName} added to ${formData.department}`,
          user: 'Admin'
        })
        
        showToast({
          type: 'success',
          title: 'Employee created successfully',
          duration: 4000
        })
        router.push('/employer/employees')
      } else {
        const error = await response.json()
        showToast({
          type: 'error',
          title: 'Failed to create employee',
          message: error.error || 'Please check the form and try again',
          duration: 6000
        })
        setErrors({ submit: error.error || 'Failed to create employee' })
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to create employee',
        message: 'Network error. Please try again.',
        duration: 6000
      })
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="bg-nav-white border-b border-secondary-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <Badge variant="purple" size="sm">Employer Portal</Badge>
              <Badge variant="mint" size="sm">Add Employee</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/employer/dashboard">Dashboard</Link>
              </Button>
              {isDevelopment() && (
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={fillWithTestData}
                >
                  Fill Test Data
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/employer/employees">Back to Employees</Link>
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
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900">Add New Employee</h1>
          <p className="text-secondary-600 mt-2">Create a new employee profile with all required information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-light-purple">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic employee details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className="bg-light-purple">
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>Job role, department, and employment details</CardDescription>
            </CardHeader>
            <CardContent>
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
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  disabled={!formData.department}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">
                    {formData.department ? 'Select Position' : 'Select Department First'}
                  </option>
                  {availablePositions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
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
                  {departments.map(department => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
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
                </select>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card className="bg-light-purple">
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
              <CardDescription>Bank account details for salary payments</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {bankingDetails.map(bank => (
                    <option key={bank.bankName} value={bank.bankName}>{bank.bankName}</option>
                  ))}
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
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-light-purple">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Contact information for emergencies</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/employer/employees">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={loading}
                  className="min-w-[160px]"
                >
                  {loading ? 'Creating...' : 'Create Employee'}
                </Button>
              </div>

              {errors.submit && (
                <div className="mt-4 p-3 bg-hover-coral text-white rounded-lg text-center">
                  {errors.submit}
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}