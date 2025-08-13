'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ToastContainer } from '@/components/ui/Toast'
import { ConfirmDialog, PromptDialog } from '@/components/ui/Dialog'
import { useToast } from '@/hooks/useToast'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null)
  const [deactivating, setDeactivating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Dialog states
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  
  // Toast hook
  const toast = useToast()

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
    setIsEditing(false)
    setEditedEmployee(null)
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

  // Edit functions
  const handleEditClick = () => {
    if (selectedEmployee) {
      setEditedEmployee({ ...selectedEmployee })
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!editedEmployee) return
    
    try {
      // TODO: Make API call to update employee
      const response = await fetch(`/api/employees/${editedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEmployee),
      })
      
      if (response.ok) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp.id === editedEmployee.id ? editedEmployee : emp
        ))
        setSelectedEmployee(editedEmployee)
        setIsEditing(false)
        setEditedEmployee(null)
      } else {
        const errorData = await response.json()
        toast.error('Update Failed', errorData.message || 'Failed to update employee')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error('Update Failed', 'Network error. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedEmployee(null)
  }

  const handleDeactivateEmployee = () => {
    if (!selectedEmployee) return
    setShowDeactivateDialog(true)
  }

  const confirmDeactivateEmployee = async () => {
    if (!selectedEmployee) return
    
    setShowDeactivateDialog(false)
    setDeactivating(true)
    
    try {
      const response = await fetch(`/api/employees/${selectedEmployee.id}?action=deactivate`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Update local state to reflect inactive status
        setEmployees(prev => prev.map(emp => 
          emp.id === selectedEmployee.id 
            ? { ...emp, employmentStatus: 'INACTIVE' as const }
            : emp
        ))
        setSelectedEmployee(prev => prev ? { ...prev, employmentStatus: 'INACTIVE' as const } : null)
        setIsEditing(false)
        toast.success('Employee Deactivated', `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been deactivated`)
      } else {
        const error = await response.json()
        toast.error('Deactivation Failed', error.message || 'Failed to deactivate employee')
      }
    } catch (error) {
      console.error('Error deactivating employee:', error)
      toast.error('Deactivation Failed', 'Network error. Please try again.')
    } finally {
      setDeactivating(false)
    }
  }

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return
    setShowDeleteDialog(true)
  }

  const confirmDeleteEmployee = () => {
    setShowDeleteDialog(false)
    setShowDeletePrompt(true)
  }

  const executeDeleteEmployee = async (confirmation: string) => {
    if (!selectedEmployee) return
    
    if (confirmation !== 'DELETE') {
      toast.error('Deletion Cancelled', 'You must type "DELETE" exactly to confirm.')
      return
    }

    setShowDeletePrompt(false)
    setDeleting(true)
    
    try {
      const response = await fetch(`/api/employees/${selectedEmployee.id}?action=delete`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Remove employee from local state
        setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id))
        closeSidebar()
        toast.success('Employee Deleted', `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been permanently deleted.`)
      } else {
        const error = await response.json()
        toast.error('Deletion Failed', error.message || 'Failed to delete employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast.error('Deletion Failed', 'Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEditFieldChange = (field: keyof Employee, value: string) => {
    if (editedEmployee) {
      setEditedEmployee(prev => prev ? { ...prev, [field]: value } : null)
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
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-secondary-900">Employee List</h1>
            <Link 
              href="/employer/employees/new"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-middle text-white hover:bg-hover-magenta transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
              title="Add New Employee"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Link>
          </div>
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

        {/* Employee Table */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">
              Employees ({filteredEmployees.length})
            </h2>
            
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary-500">No employees found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-4 px-6 font-semibold text-secondary-700 text-sm">Employee</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Department</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Position</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Employee ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr 
                        key={employee.id}
                        onClick={() => openEmployeeSidebar(employee)}
                        className="border-b border-secondary-100 hover:bg-light-purple cursor-pointer transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={employee.profileImage || '/default-avatar.png'} 
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-10 h-10 rounded-full object-cover bg-secondary-200 flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23E5E7EB"/><text x="20" y="26" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="14" font-weight="500">${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}</text></svg>`
                              }}
                            />
                            <div>
                              <div className="font-medium text-secondary-900">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {employee.personalEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-secondary-700">
                            {employee.department}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-secondary-700">
                            {employee.designation}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={employee.employmentStatus === 'ACTIVE' ? 'success' : 
                                    employee.employmentStatus === 'INACTIVE' ? 'warning' : 'error'}
                            size="sm"
                          >
                            {employee.employmentStatus}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-secondary-600 font-mono text-sm">
                            {employee.employeeCode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editedEmployee?.firstName || ''}
                            onChange={(e) => handleEditFieldChange('firstName', e.target.value)}
                            className="text-xl font-bold bg-white border border-secondary-200 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-brand-middle"
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            value={editedEmployee?.lastName || ''}
                            onChange={(e) => handleEditFieldChange('lastName', e.target.value)}
                            className="text-xl font-bold bg-white border border-secondary-200 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-brand-middle"
                            placeholder="Last Name"
                          />
                        </div>
                        <p className="text-secondary-600">{editedEmployee?.designation}</p>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-bold text-secondary-900">
                          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                        </h2>
                        <p className="text-secondary-600">{selectedEmployee?.designation}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    Edit
                  </Button>
                )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEmployee?.designation || ''}
                        onChange={(e) => handleEditFieldChange('designation', e.target.value)}
                        className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      />
                    ) : (
                      <p className="text-sm font-medium text-secondary-900">{selectedEmployee?.designation}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEmployee?.department || ''}
                        onChange={(e) => handleEditFieldChange('department', e.target.value)}
                        className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      />
                    ) : (
                      <p className="text-sm font-medium text-secondary-900">{selectedEmployee?.department}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-secondary-500 mb-1">Hire Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedEmployee?.hiredDate || ''}
                      onChange={(e) => handleEditFieldChange('hiredDate', e.target.value)}
                      className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                    />
                  ) : (
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedEmployee?.hiredDate ? new Date(selectedEmployee.hiredDate).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  )}
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
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedEmployee?.personalEmail || ''}
                        onChange={(e) => handleEditFieldChange('personalEmail', e.target.value)}
                        className="text-sm bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      />
                    ) : (
                      <p className="text-sm text-secondary-900">{selectedEmployee?.personalEmail}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedEmployee?.phoneNumber || ''}
                        onChange={(e) => handleEditFieldChange('phoneNumber', e.target.value)}
                        className="text-sm bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                        placeholder="Phone number"
                      />
                    ) : (
                      <p className="text-sm text-secondary-900">{selectedEmployee?.phoneNumber || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Employee ID</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEmployee?.employeeCode || ''}
                        onChange={(e) => handleEditFieldChange('employeeCode', e.target.value)}
                        className="text-sm bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      />
                    ) : (
                      <p className="text-sm text-secondary-900">{selectedEmployee?.employeeCode}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Account Actions - Only show in edit mode */}
              {isEditing && (
                <div className="border-t border-secondary-200 pt-6 space-y-4">
                  {/* Warning Message */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-yellow-700">
                          <strong>Account Actions:</strong> Use "Deactivate" to preserve data. Use "Delete" to permanently remove all data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deactivate Account Button */}
                  <button
                    onClick={handleDeactivateEmployee}
                    disabled={deactivating || deleting}
                    className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 h-10 px-4 py-2"
                    title="Mark employee as inactive but preserve all data"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    {deactivating ? 'Deactivating...' : 'Deactivate Account'}
                  </button>

                  {/* Delete Account Button */}
                  <button
                    onClick={handleDeleteEmployee}
                    disabled={deleting || deactivating}
                    className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 h-10 px-4 py-2"
                    title="Permanently delete employee and all associated data (cannot be undone)"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onDismiss={toast.removeToast}
        position="top-right"
      />

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={confirmDeactivateEmployee}
        title="Deactivate Employee"
        message={`Are you sure you want to deactivate ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? They will be marked as inactive but their data will be preserved.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmVariant="primary"
        type="warning"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteEmployee}
        title="⚠️ Permanent Deletion Warning"
        message={`Are you sure you want to permanently delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}?

This action:
• Cannot be undone
• Will permanently remove all employee data  
• Will delete their user account
• Will remove all associated records`}
        confirmText="Continue to Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        type="error"
      />

      {/* Delete Confirmation Prompt */}
      <PromptDialog
        isOpen={showDeletePrompt}
        onClose={() => setShowDeletePrompt(false)}
        onConfirm={executeDeleteEmployee}
        title="Confirm Permanent Deletion"
        message="Type 'DELETE' to confirm permanent deletion:"
        placeholder="DELETE"
        confirmText="Delete Permanently"
        cancelText="Cancel"
        required={true}
        validation={(value) => value !== 'DELETE' ? 'You must type "DELETE" exactly to confirm.' : null}
      />
    </div>
  )
}