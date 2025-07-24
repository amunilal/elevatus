'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

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
  salary: number | null
  address: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  profileImage?: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(50) // percentage
  const [isResizing, setIsResizing] = useState(false)

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

  const openEmployeeSidebar = (employee: Employee) => {
    setSelectedEmployee(employee)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedEmployee(null)
    setSidebarWidth(50) // Reset to default width
  }

  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const windowWidth = window.innerWidth
      const mouseX = e.clientX
      const newWidth = ((windowWidth - mouseX) / windowWidth) * 100
      
      // Constrain between 30% and 90%
      const constrainedWidth = Math.min(Math.max(newWidth, 30), 90)
      setSidebarWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

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
      <div className="min-h-screen bg-bg-base p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-8"></div>
            <div className="bg-nav-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-secondary-200 rounded"></div>
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
      <div className="bg-nav-white px-6 py-4 border-b border-secondary-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <Badge variant="purple" size="sm">Employer Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/employer/dashboard">Dashboard</Link>
            </Button>
            <button className="text-sm text-hover-magenta font-medium">Sign out</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Employee List</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-nav-white rounded-2xl p-6 mb-6 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, email, or employee number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle placeholder-secondary-500 text-secondary-900"
              />
            </div>
            <div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900"
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
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">
              Employees ({filteredEmployees.length})
            </h2>
            
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <div 
                  key={employee.id} 
                  onClick={() => openEmployeeSidebar(employee)}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-light-purple cursor-pointer transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={employee.profileImage || '/default-avatar.png'} 
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-12 h-12 rounded-full object-cover bg-secondary-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23E5E7EB"/><text x="24" y="30" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="16" font-weight="500">${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}</text></svg>`
                      }}
                    />
                    <div>
                      <p className="font-semibold text-secondary-900 text-base">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {employee.designation} • {employee.department}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant={employee.employmentStatus === 'ACTIVE' ? 'green' : 
                              employee.employmentStatus === 'INACTIVE' ? 'yellow' : 'red'}
                      size="sm"
                    >
                      {employee.employmentStatus}
                    </Badge>
                    <svg 
                      className="w-5 h-5 text-secondary-400 group-hover:text-brand-middle transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-500">No employees found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div 
            className={`fixed inset-y-0 right-0 bg-nav-white shadow-xl transform ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out z-50`}
            style={{ width: `${sidebarWidth}%` }}
          >
            {/* Resize Handle */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 bg-transparent hover:bg-brand-middle transition-colors cursor-ew-resize group ${
                isResizing ? 'bg-brand-middle' : ''
              }`}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-secondary-300 group-hover:bg-brand-middle transition-colors">
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-white opacity-50"></div>
              </div>
            </div>
            
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-secondary-200">
              {/* Breadcrumb */}
              <nav className="text-sm text-secondary-600">
                <span>Employees</span>
                <span className="mx-2">/</span>
                <span className="text-secondary-900">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</span>
              </nav>
              
              <button 
                onClick={closeSidebar}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedEmployee?.profileImage || '/default-avatar.png'} 
                    alt={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
                    className="w-16 h-16 rounded-full object-cover bg-secondary-200"
                    onError={(e) => {
                      if (selectedEmployee) {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23E5E7EB"/><text x="32" y="40" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="20" font-weight="500">${selectedEmployee.firstName.charAt(0)}${selectedEmployee.lastName.charAt(0)}</text></svg>`
                      }
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900">
                      {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                    </h2>
                    <p className="text-secondary-600">{selectedEmployee?.designation}</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Role</p>
                    <p className="text-sm font-medium text-secondary-900">{selectedEmployee?.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-secondary-900">{selectedEmployee?.department}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-secondary-500 mb-1">Hire Date</p>
                  <p className="text-sm font-medium text-secondary-900">
                    {selectedEmployee?.hiredDate ? new Date(selectedEmployee.hiredDate).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Performance Reviews */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Performance Reviews</h3>
                  <Button variant="outline" size="sm">
                    Add review
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="w-6 h-6 bg-secondary-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">2023-12-15</p>
                      <p className="text-xs text-secondary-600 mt-1">Key Outcomes: Exceeded expectations in project delivery and code quality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="w-6 h-6 bg-secondary-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">2023-06-15</p>
                      <p className="text-xs text-secondary-600 mt-1">Key Outcomes: Met expectations in project delivery and code quality</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotions & Role Changes */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Promotions & Role Changes</h3>
                
                <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">2023-01-01</p>
                    <p className="text-xs text-secondary-600 mt-1">Promoted to {selectedEmployee?.designation}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Progress</h3>
                
                <div>
                  <p className="text-sm text-secondary-500 mb-2">Overall Progress</p>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-brand-middle h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">75% Complete</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Email</p>
                    <p className="text-sm text-secondary-900">{selectedEmployee?.personalEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Phone</p>
                    <p className="text-sm text-secondary-900">{selectedEmployee?.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Employee ID</p>
                    <p className="text-sm text-secondary-900">{selectedEmployee?.employeeCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}