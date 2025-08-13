'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { ToastContainer } from '@/components/ui/Toast'
import { ConfirmDialog, PromptDialog } from '@/components/ui/Dialog'
import { useToast } from '@/hooks/useToast'

interface Employer {
  id: string
  role: 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER'
  department: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    lastLoginAt: string | null
  }
}

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(50)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployer, setEditedEmployer] = useState<Employer | null>(null)
  const [deactivating, setDeactivating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Dialog states
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  
  // Toast hook
  const toast = useToast()

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      const response = await fetch('/api/employers')
      const data = await response.json()
      if (response.ok && Array.isArray(data)) {
        setEmployers(data)
      } else {
        console.error('Failed to fetch employers:', data.message || 'Invalid response')
        toast.error('Fetch Failed', data.message || 'Failed to fetch employers')
        setEmployers([])
      }
    } catch (error) {
      console.error('Failed to fetch employers:', error)
      toast.error('Fetch Failed', 'Network error. Please try again.')
      setEmployers([])
    } finally {
      setLoading(false)
    }
  }

  const openEmployerSidebar = (employer: Employer) => {
    setSelectedEmployer(employer)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedEmployer(null)
    setSidebarWidth(50)
    setIsEditing(false)
    setEditedEmployer(null)
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
    if (selectedEmployer) {
      setEditedEmployer({ ...selectedEmployer })
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!editedEmployer) return
    
    try {
      const response = await fetch(`/api/employers/${editedEmployer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editedEmployer.user.email,
          role: editedEmployer.role,
          department: editedEmployer.department,
          isActive: editedEmployer.user.isActive
        }),
      })
      
      if (response.ok) {
        const updatedEmployer = await response.json()
        setEmployers(prev => prev.map(emp => 
          emp.id === editedEmployer.id ? updatedEmployer : emp
        ))
        setSelectedEmployer(updatedEmployer)
        setIsEditing(false)
        setEditedEmployer(null)
        toast.success('Employer Updated', 'Employer information has been updated successfully')
      } else {
        const errorData = await response.json()
        toast.error('Update Failed', errorData.message || 'Failed to update employer')
      }
    } catch (error) {
      console.error('Error updating employer:', error)
      toast.error('Update Failed', 'Network error. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedEmployer(null)
  }

  const handleDeactivateEmployer = () => {
    if (!selectedEmployer) return
    setShowDeactivateDialog(true)
  }

  const confirmDeactivateEmployer = async () => {
    if (!selectedEmployer) return
    
    setShowDeactivateDialog(false)
    setDeactivating(true)
    
    try {
      const response = await fetch(`/api/employers/${selectedEmployer.id}?action=deactivate`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setEmployers(prev => prev.map(emp => 
          emp.id === selectedEmployer.id 
            ? { ...emp, user: { ...emp.user, isActive: false } }
            : emp
        ))
        setSelectedEmployer(prev => prev ? { ...prev, user: { ...prev.user, isActive: false } } : null)
        setIsEditing(false)
        toast.success('Employer Deactivated', `${selectedEmployer.user.email} has been deactivated`)
      } else {
        const error = await response.json()
        toast.error('Deactivation Failed', error.message || 'Failed to deactivate employer')
      }
    } catch (error) {
      console.error('Error deactivating employer:', error)
      toast.error('Deactivation Failed', 'Network error. Please try again.')
    } finally {
      setDeactivating(false)
    }
  }

  const handleDeleteEmployer = () => {
    if (!selectedEmployer) return
    setShowDeleteDialog(true)
  }

  const confirmDeleteEmployer = () => {
    setShowDeleteDialog(false)
    setShowDeletePrompt(true)
  }

  const executeDeleteEmployer = async (confirmation: string) => {
    if (!selectedEmployer) return
    
    if (confirmation !== 'DELETE') {
      toast.error('Deletion Cancelled', 'You must type "DELETE" exactly to confirm.')
      return
    }

    setShowDeletePrompt(false)
    setDeleting(true)
    
    try {
      const response = await fetch(`/api/employers/${selectedEmployer.id}?action=delete`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setEmployers(prev => prev.filter(emp => emp.id !== selectedEmployer.id))
        closeSidebar()
        toast.success('Employer Deleted', `${selectedEmployer.user.email} has been permanently deleted.`)
      } else {
        const error = await response.json()
        toast.error('Deletion Failed', error.message || 'Failed to delete employer')
      }
    } catch (error) {
      console.error('Error deleting employer:', error)
      toast.error('Deletion Failed', 'Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEditFieldChange = (field: string, value: string | boolean) => {
    if (editedEmployer) {
      if (field.startsWith('user.')) {
        const userField = field.replace('user.', '')
        setEditedEmployer(prev => prev ? { 
          ...prev, 
          user: { ...prev.user, [userField]: value } 
        } : null)
      } else {
        setEditedEmployer(prev => prev ? { ...prev, [field]: value } : null)
      }
    }
  }

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = `${employer.user.email} ${employer.role} ${employer.department || ''}`
      .toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || employer.role === filterRole
    const matchesStatus = !filterStatus || 
      (filterStatus === 'ACTIVE' && employer.user.isActive) ||
      (filterStatus === 'INACTIVE' && !employer.user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error'
      case 'HR_ADMIN': return 'warning' 
      case 'MANAGER': return 'primary'
      default: return 'secondary'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin'
      case 'HR_ADMIN': return 'HR Admin'
      case 'MANAGER': return 'Manager'
      default: return role
    }
  }

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
            <h1 className="text-2xl font-bold text-secondary-900">Employer Management</h1>
            <Link 
              href="/employer/employers/new"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-middle text-white hover:bg-hover-magenta transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
              title="Add New Employer"
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
                placeholder="Search by email, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle placeholder-secondary-500 text-secondary-900"
              />
            </div>
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900"
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="HR_ADMIN">HR Admin</option>
                <option value="MANAGER">Manager</option>
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
              </select>
            </div>
          </div>
        </div>

        {/* Employer Table */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">
              Employers ({filteredEmployers.length})
            </h2>
            
            {filteredEmployers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary-500">No employers found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-4 px-6 font-semibold text-secondary-700 text-sm">Email</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Role</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Department</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployers.map((employer) => (
                      <tr 
                        key={employer.id}
                        onClick={() => openEmployerSidebar(employer)}
                        className="border-b border-secondary-100 hover:bg-light-purple cursor-pointer transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-middle to-hover-magenta flex items-center justify-center text-white font-semibold text-sm">
                              {employer.user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-secondary-900">
                                {employer.user.email}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {employer.user.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={getRoleBadgeVariant(employer.role)}
                            size="sm"
                          >
                            {getRoleDisplayName(employer.role)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-secondary-700">
                            {employer.department || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={employer.user.isActive ? 'success' : 'warning'}
                            size="sm"
                          >
                            {employer.user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-secondary-600 text-sm">
                            {employer.user.lastLoginAt 
                              ? new Date(employer.user.lastLoginAt).toLocaleDateString('en-GB')
                              : 'Never'
                            }
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
              <nav className="text-sm text-secondary-600">
                <span>Employers</span>
                <span className="mx-2">/</span>
                <span className="text-secondary-900">{selectedEmployer?.user.email}</span>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-middle to-hover-magenta flex items-center justify-center text-white font-semibold text-xl">
                    {selectedEmployer?.user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="email"
                          value={editedEmployer?.user.email || ''}
                          onChange={(e) => handleEditFieldChange('user.email', e.target.value)}
                          className="text-xl font-bold bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                          placeholder="Email"
                        />
                        <p className="text-secondary-600">{getRoleDisplayName(editedEmployer?.role || '')}</p>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-bold text-secondary-900">
                          {selectedEmployer?.user.email}
                        </h2>
                        <p className="text-secondary-600">{getRoleDisplayName(selectedEmployer?.role || '')}</p>
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
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Role</p>
                    {isEditing ? (
                      <select
                        value={editedEmployer?.role || ''}
                        onChange={(e) => handleEditFieldChange('role', e.target.value)}
                        className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="HR_ADMIN">HR Admin</option>
                        <option value="MANAGER">Manager</option>
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-secondary-900">{getRoleDisplayName(selectedEmployer?.role || '')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEmployer?.department || ''}
                        onChange={(e) => handleEditFieldChange('department', e.target.value)}
                        className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                        placeholder="Department"
                      />
                    ) : (
                      <p className="text-sm font-medium text-secondary-900">{selectedEmployer?.department || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Status</p>
                    {isEditing ? (
                      <select
                        value={editedEmployer?.user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        onChange={(e) => handleEditFieldChange('user.isActive', e.target.value === 'ACTIVE')}
                        className="text-sm font-medium bg-white border border-secondary-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-brand-middle"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    ) : (
                      <Badge 
                        variant={selectedEmployer?.user.isActive ? 'success' : 'warning'}
                        size="sm"
                      >
                        {selectedEmployer?.user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Created</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedEmployer?.createdAt ? new Date(selectedEmployer.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Last Login</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedEmployer?.user.lastLoginAt 
                        ? new Date(selectedEmployer.user.lastLoginAt).toLocaleDateString('en-GB')
                        : 'Never'
                      }
                    </p>
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
                    onClick={handleDeactivateEmployer}
                    disabled={deactivating || deleting}
                    className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 h-10 px-4 py-2"
                    title="Mark employer as inactive but preserve all data"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    {deactivating ? 'Deactivating...' : 'Deactivate Account'}
                  </button>

                  {/* Delete Account Button */}
                  <button
                    onClick={handleDeleteEmployer}
                    disabled={deleting || deactivating}
                    className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 h-10 px-4 py-2"
                    title="Permanently delete employer and all associated data (cannot be undone)"
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
        onConfirm={confirmDeactivateEmployer}
        title="Deactivate Employer"
        message={`Are you sure you want to deactivate ${selectedEmployer?.user.email}? They will be marked as inactive but their data will be preserved.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmVariant="primary"
        type="warning"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteEmployer}
        title="⚠️ Permanent Deletion Warning"
        message={`Are you sure you want to permanently delete ${selectedEmployer?.user.email}?

This action:
• Cannot be undone
• Will permanently remove all employer data  
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
        onConfirm={executeDeleteEmployer}
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