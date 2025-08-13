'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

export default function NewEmployerPage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    role: 'MANAGER' as 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER',
    department: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(
          'Employer Created', 
          `${formData.email} has been added as an employer. They will receive a welcome email with password setup instructions.`
        )
        router.push('/employer/employers')
      } else {
        toast.error('Creation Failed', data.message || 'Failed to create employer')
        setErrors({ submit: data.message || 'Failed to create employer' })
      }
    } catch (error) {
      console.error('Error creating employer:', error)
      toast.error('Creation Failed', 'Network error. Please try again.')
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const fillTestData = () => {
    const testEmails = [
      'admin@elevatus.co.za',
      'hr.manager@elevatus.co.za', 
      'team.lead@elevatus.co.za',
      'department.head@elevatus.co.za',
      'supervisor@elevatus.co.za'
    ]
    const testDepartments = [
      'Human Resources',
      'Information Technology', 
      'Finance',
      'Marketing',
      'Operations',
      'Customer Service'
    ]
    const roles = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] as const

    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)]
    const randomDepartment = testDepartments[Math.floor(Math.random() * testDepartments.length)]
    const randomRole = roles[Math.floor(Math.random() * roles.length)]

    setFormData({
      email: randomEmail,
      role: randomRole,
      department: randomDepartment
    })
    
    // Clear any existing errors
    setErrors({})
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Full system access with all administrative privileges'
      case 'HR_ADMIN':
        return 'Human resources management and employee administration'
      case 'MANAGER':
        return 'Team management and departmental oversight'
      default:
        return ''
    }
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
            <Button variant="secondary" size="sm" asChild>
              <Link href="/employer/employers">Back to Employers</Link>
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
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary-900">Add New Employer</h1>
            <p className="text-secondary-600 mt-2">
              Create a new employer account with administrative access to the system.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employer Information */}
            <div className="bg-nav-white p-6 rounded-2xl shadow-soft">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Employer Information</h2>
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillTestData}
                  >
                    Fill Test Data
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-secondary-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle placeholder-secondary-500 text-secondary-900 ${
                      errors.email ? 'border-red-500' : 'border-secondary-200'
                    }`}
                    placeholder="employer@company.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  <p className="text-xs text-secondary-500 mt-1">
                    The employer will receive a welcome email with password setup instructions.
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-secondary-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle text-secondary-900 ${
                      errors.role ? 'border-red-500' : 'border-secondary-200'
                    }`}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="HR_ADMIN">HR Admin</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  <p className="text-xs text-secondary-500 mt-1">
                    {getRoleDescription(formData.role)}
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-brand-middle placeholder-secondary-500 text-secondary-900"
                    placeholder="e.g., Human Resources, IT, Finance"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Optional: Specify the department this employer will manage or belong to.
                  </p>
                </div>
              </div>
            </div>

            {/* Role Permissions Info */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Role Permissions</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="space-y-1">
                      <li><strong>Super Admin:</strong> Complete system access, can manage all employers and employees</li>
                      <li><strong>HR Admin:</strong> Employee management, reviews, leave, and HR-related functions</li>
                      <li><strong>Manager:</strong> Team oversight, reviews, and departmental employee management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/employer/employers">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? 'Creating...' : 'Create Employer'}
              </Button>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onDismiss={toast.removeToast}
        position="top-right"
      />
    </div>
  )
}