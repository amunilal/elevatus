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
  phoneNumber: string | null
  idNumber: string | null
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

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
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName} ${employee.personalEmail} ${employee.employeeCode}`
      .toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment
    const matchesStatus = !filterStatus || employee.employmentStatus === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = [...new Set(employees.map(emp => emp.department))]

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
      {/* Header - matching Figma */}
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
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">Employee Management</h1>
            <p className="text-secondary-700 text-base">
              Manage your team members and their information.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/employer/employees/new"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
            >
              Add New Employee
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-nav-white rounded-2xl p-6 shadow-soft mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Filter Employees</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary-100">
            <h2 className="text-xl font-bold text-secondary-900">
              Employees ({filteredEmployees.length})
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
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-nav-white divide-y divide-secondary-100">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-light-purple transition-colors duration-150">
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
                          <div className="text-sm text-secondary-600">{employee.personalEmail}</div>
                          <div className="text-xs text-secondary-500 font-mono">#{employee.employeeCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-900 font-medium">
                      {employee.designation}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700">
                      {employee.department}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        employee.employmentStatus === 'ACTIVE' 
                          ? 'bg-success-100 text-success-700'
                          : employee.employmentStatus === 'INACTIVE'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-error-100 text-error-700'
                      }`}>
                        {employee.employmentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700">
                      {new Date(employee.hiredDate).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700">
                      {employee.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        href={`/employer/employees/${employee.id}`}
                        className="text-brand-middle hover:text-hover-magenta font-medium transition-colors duration-150"
                      >
                        View
                      </Link>
                      <Link
                        href={`/employer/employees/${employee.id}/edit`}
                        className="text-hover-teal hover:text-success-600 font-medium transition-colors duration-150"
                      >
                        Edit
                      </Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No employees found</h3>
              <p className="text-secondary-600 mb-6">No employees match your current search criteria.</p>
              <Link
                href="/employer/employees/new"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
              >
                Add Your First Employee
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}