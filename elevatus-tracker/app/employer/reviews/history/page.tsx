'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

interface ReviewHistory {
  id: string
  employee: {
    firstName: string
    lastName: string
    designation: string
    department: string
  }
  date: string
  status: 'completed' | 'in_progress' | 'draft'
  completedTasks: number
  totalTasks: number
}

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<ReviewHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          // Transform API data to match our interface
          const transformedReviews: ReviewHistory[] = data.map(review => ({
            id: review.id,
            employee: {
              firstName: review.employee?.firstName || 'Unknown',
              lastName: review.employee?.lastName || 'Employee',
              designation: review.employee?.designation || 'Unknown Position',
              department: review.employee?.department || 'Unknown Department'
            },
            date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: review.status === 'COMPLETED' ? 'completed' : 
                   review.status === 'IN_PROGRESS' ? 'in_progress' : 'draft',
            completedTasks: review.goals?.filter((g: any) => g.status === 'COMPLETED').length || 0,
            totalTasks: review.goals?.length || 0
          }))
          setReviews(transformedReviews)
        } else {
          console.error('Invalid response format:', data)
          setReviews([])
        }
      } else {
        console.error('Failed to fetch reviews:', response.status)
        // Fallback to mock data if API fails
        const mockReviews: ReviewHistory[] = [
          {
            id: 'review-john-doe-2025',
            employee: {
              firstName: 'John',
              lastName: 'Doe',
              designation: 'Senior Developer',
              department: 'Engineering'
            },
            date: '2025-01-15',
            status: 'completed',
            completedTasks: 12,
            totalTasks: 12
          },
          {
            id: 'mock-review-2',
            employee: {
              firstName: 'Jane',
              lastName: 'Smith',
              designation: 'Product Manager',
              department: 'Product'
            },
            date: '2025-01-10',
            status: 'in_progress',
            completedTasks: 8,
            totalTasks: 15
          }
        ]
        setReviews(mockReviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = `${review.employee.firstName} ${review.employee.lastName} ${review.employee.designation}`
      .toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || review.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700'
      case 'in_progress':
        return 'bg-brand-middle/10 text-brand-middle'
      case 'draft':
        return 'bg-warning-100 text-warning-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      case 'draft':
        return 'Draft'
      default:
        return status
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
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">Review History</h1>
            <p className="text-secondary-700 text-base">
              View and manage all completed and ongoing performance reviews.
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
              href="/employer/reviews/start"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
            >
              Start New Review
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-nav-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Completed Reviews</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {reviews.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-nav-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-middle/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {reviews.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-nav-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Draft Reviews</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {reviews.filter(r => r.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-nav-white rounded-2xl p-6 shadow-soft mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Filter Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Search Reviews
              </label>
              <input
                type="text"
                placeholder="Search by employee name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent transition-all duration-200"
              />
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
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary-100">
            <h2 className="text-xl font-bold text-secondary-900">
              Reviews ({filteredReviews.length})
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
                    Review Date
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-nav-white divide-y divide-secondary-100">
                {filteredReviews.map((review) => (
                  <tr 
                    key={review.id} 
                    className="hover:bg-light-purple transition-colors duration-150"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-soft">
                            <span className="text-sm font-semibold text-white">
                              {review.employee.firstName.charAt(0)}{review.employee.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-secondary-900">
                            {review.employee.firstName} {review.employee.lastName}
                          </div>
                          <div className="text-sm text-secondary-600">{review.employee.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-900 font-medium">
                      {review.employee.designation}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700">
                      {new Date(review.date).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-brand-middle h-2 rounded-full" 
                            style={{ width: `${(review.completedTasks / review.totalTasks) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-secondary-600">
                          {review.completedTasks}/{review.totalTasks}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                        {getStatusText(review.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/employer/reviews/${review.id}`}
                          className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-8 px-3 py-1 text-xs"
                        >
                          {review.status === 'completed' ? 'View' : 'Continue'}
                        </Link>
                        {review.status === 'completed' && (
                          <button
                            onClick={() => {
                              // Export or download review functionality can be added here
                              alert('Export functionality will be implemented')
                            }}
                            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle h-8 px-3 py-1 text-xs"
                          >
                            Export
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-light-purple mb-6">
                <svg className="w-8 h-8 text-brand-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No reviews found</h3>
              <p className="text-secondary-600 mb-6">No reviews match your current search criteria.</p>
              <Link
                href="/employer/reviews/start"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
              >
                Start Your First Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}