'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
  createdAt: string
  updatedAt: string
}

export default function EmployeeDetailsPage() {
  const params = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployee()
  }, [params.id])

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/employees/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEmployee(data)
      } else {
        setError('Employee not found')
      }
    } catch (error) {
      setError('Failed to fetch employee details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
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

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested employee could not be found.'}</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600">Employee #{employee.employeeNumber}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/employer/employees/${employee.id}/edit`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Employee
            </Link>
            <Link
              href="/employer/employees"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </div>

        {/* Employee Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-semibold">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : employee.status === 'INACTIVE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
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
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{employee.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID Number:</span>
                <span className="font-medium">{employee.idNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax Number:</span>
                <span className="font-medium">{employee.taxNumber || 'N/A'}</span>
              </div>
              {employee.address && (
                <div>
                  <span className="text-gray-500">Address:</span>
                  <p className="font-medium mt-1">{employee.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Employment Information</h2>
            <div className="space-y-3">
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
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Salary:</span>
                <span className="font-medium text-green-600">
                  R{employee.salary.toLocaleString('en-ZA')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Employment Status:</span>
                <span className={`font-medium ${
                  employee.status === 'ACTIVE' 
                    ? 'text-green-600'
                    : employee.status === 'INACTIVE'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Banking Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name:</span>
                <span className="font-medium">{employee.bankName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Branch Code:</span>
                <span className="font-medium">{employee.branchCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number:</span>
                <span className="font-medium">{employee.bankAccount || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Contact Name:</span>
                <span className="font-medium">{employee.emergencyContactName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact Phone:</span>
                <span className="font-medium">{employee.emergencyContactPhone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/employer/attendance?employee=${employee.id}`}
              className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
            >
              <div className="text-blue-600 font-semibold">View Attendance</div>
              <div className="text-sm text-gray-600">Track work hours</div>
            </Link>
            <Link
              href={`/employer/leave?employee=${employee.id}`}
              className="bg-green-50 border border-green-200 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
            >
              <div className="text-green-600 font-semibold">Leave History</div>
              <div className="text-sm text-gray-600">View leave records</div>
            </Link>
            <Link
              href={`/employer/reviews?employee=${employee.id}`}
              className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
            >
              <div className="text-purple-600 font-semibold">Performance</div>
              <div className="text-sm text-gray-600">Review history</div>
            </Link>
            <Link
              href={`/employer/learning?employee=${employee.id}`}
              className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors"
            >
              <div className="text-orange-600 font-semibold">Learning</div>
              <div className="text-sm text-gray-600">Courses & badges</div>
            </Link>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Created:</span> {new Date(employee.createdAt).toLocaleString('en-ZA')}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(employee.updatedAt).toLocaleString('en-ZA')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}