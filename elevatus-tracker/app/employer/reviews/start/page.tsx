'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

interface Employee {
  id: string
  firstName: string
  lastName: string
  personalEmail: string
  employeeCode: string
  designation: string
  department: string
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'TERMINATED'
  hiredDate: string
}

export default function StartReviewPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [creatingReview, setCreatingReview] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      if (response.ok && Array.isArray(data)) {
        // Only show active employees for reviews
        setEmployees(data.filter(emp => emp.employmentStatus === 'ACTIVE'))
      } else {
        console.error('Failed to fetch employees:', data.error || 'Invalid response')
        setEmployees([])
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName} ${employee.personalEmail} ${employee.employeeCode}`
      .toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map(emp => emp.department))]

  const handleStartReview = async (employeeId: string, employeeName: string) => {
    setCreatingReview(employeeId)
    
    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create review')
      }

      const data = await response.json()
      
      if (data.existing) {
        // Review already exists, just redirect
        console.log('Redirecting to existing review:', data.reviewId)
      } else {
        // New review created
        console.log('New review created:', data.reviewId)
      }
      
      // Redirect to the review page
      window.location.href = `/employer/reviews/${data.reviewId}`
      
    } catch (error) {
      console.error('Failed to start review:', error)
      setErrorMessage(`Failed to start review for ${employeeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setShowErrorDialog(true)
      setCreatingReview(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base">
        {/* Header */}
        <div className="bg-nav-white px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <Badge variant="purple" size="sm">Employer Portal</Badge>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-secondary-600">admin@company.co.za</span>
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

        <div className="px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="bg-nav-white rounded-2xl shadow-soft p-6">
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
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="bg-nav-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <Badge variant="purple" size="sm">Employer Portal</Badge>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-secondary-600">admin@company.co.za</span>
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
      <div className="px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">Start Performance Review</h1>
            <p className="text-secondary-700 text-base">
              Select an employee to begin their performance review.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-nav-white rounded-2xl p-6 shadow-soft mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Find Employee</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Search Employees
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or employee number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent transition-all duration-200"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee Selection */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary-100">
            <h2 className="text-xl font-bold text-secondary-900">
              Select Employee for Review ({filteredEmployees.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-100">
              <thead className="bg-light-purple">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-nav-white divide-y divide-secondary-100">
                {filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-light-purple transition-colors duration-150"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-soft">
                            <span className="text-sm font-semibold text-white">
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-secondary-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-secondary-600">#{employee.employeeCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-900 font-medium">
                      {employee.designation}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700">
                      {employee.department}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStartReview(employee.id, `${employee.firstName} ${employee.lastName}`)}
                        disabled={creatingReview === employee.id}
                        className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
                      >
                        {creatingReview === employee.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          'Start Review'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-light-purple mb-6">
                <svg className="w-8 h-8 text-brand-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No employees found</h3>
              <p className="text-secondary-600 mb-6">No active employees match your current search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterDepartment('')
                }}
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-light-blue border border-brand-middle/20 rounded-2xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-brand-middle mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 mb-1">Performance Review Process</h3>
              <p className="text-sm text-secondary-700">
                Select an employee from the list above to begin their performance review. The review process will guide you through evaluating their performance, setting goals, and providing feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Error</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-700">
                {errorMessage}
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowErrorDialog(false)
                  setErrorMessage('')
                }}
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle h-12 px-6 py-3"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}