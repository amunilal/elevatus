'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { useParams } from 'next/navigation'

interface Task {
  id: string
  title: string
  dateAdded: string
  dateCompleted?: string
  status: 'todo' | 'in_progress' | 'complete' | 'on_hold'
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  designation: string
  department: string
}

interface Review {
  id: string
  employee: Employee
  date: string
  tasks: Task[]
}

export default function ReviewPage() {
  const params = useParams()
  const reviewId = params?.id as string
  
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId)
    }
  }, [reviewId])

  const fetchReview = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // For now, using mock data
      const mockReview: Review = {
        id: id,
        employee: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          designation: 'Senior Developer',
          department: 'Engineering'
        },
        date: '1 January 2025',
        tasks: [
          {
            id: '1',
            title: 'Complete project documentation',
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '2',
            title: 'Code review for new features',
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '3',
            title: 'Team collaboration assessment',
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '4',
            title: 'Technical skills evaluation',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '5',
            title: 'Leadership development goals',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '6',
            title: 'Client communication review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '7',
            title: 'Performance goals Q1',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '8',
            title: 'Training completion certificate',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '9',
            title: 'Annual objectives review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '10',
            title: 'Salary review discussion',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          },
          {
            id: '11',
            title: 'Department restructure planning',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          },
          {
            id: '12',
            title: 'Remote work policy review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          }
        ]
      }
      
      setReview(mockReview)
    } catch (error) {
      console.error('Failed to fetch review:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStatus = (status: Task['status']) => {
    return review?.tasks.filter(task => task.status === status) || []
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100'
      case 'in_progress':
        return 'bg-purple-100'
      case 'complete':
        return 'bg-green-100'
      case 'on_hold':
        return 'bg-yellow-100'
      default:
        return 'bg-gray-100'
    }
  }

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-50'
      case 'in_progress':
        return 'bg-purple-50'
      case 'complete':
        return 'bg-green-50'
      case 'on_hold':
        return 'bg-yellow-50'
      default:
        return 'bg-gray-50'
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
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-nav-white rounded-2xl shadow-soft p-6 h-96">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!review) {
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

        <div className="px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Review Not Found</h1>
          <p className="text-secondary-600 mb-6">The requested review could not be found.</p>
          <Link
            href="/employer/reviews/start"
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
          >
            Back to Reviews
          </Link>
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
        {/* Employee Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-secondary-900">
              {review.employee.firstName} {review.employee.lastName}
            </h1>
            <Link
              href="/employer/reviews/start"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
            >
              Back to Reviews
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <p className="text-lg text-secondary-700">Date: {review.date}</p>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center space-x-2 text-secondary-700 hover:text-secondary-900"
            >
              <span>Review notes</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showNotes ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showNotes && (
            <div className="bg-light-blue border border-brand-middle/20 rounded-2xl p-6 mb-6">
              <textarea
                placeholder="Add review notes here..."
                className="w-full h-32 p-4 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-4 space-x-3">
                <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2">
                  Cancel
                </button>
                <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* To Do Column */}
          <div className={`${getColumnColor('todo')} rounded-2xl p-6 shadow-soft`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">To do</h2>
              <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {getTasksByStatus('todo').length}
              </span>
            </div>
            <div className="space-y-4">
              {getTasksByStatus('todo').map((task) => (
                <div key={task.id} className={`${getStatusColor('todo')} p-4 rounded-xl border border-secondary-200`}>
                  <h3 className="font-semibold text-secondary-900 mb-2">Task</h3>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    <p>Date completed: 3 months</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className={`${getColumnColor('in_progress')} rounded-2xl p-6 shadow-soft`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">In Progress</h2>
              <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {getTasksByStatus('in_progress').length}
              </span>
            </div>
            <div className="space-y-4">
              {getTasksByStatus('in_progress').map((task, index) => (
                <div key={task.id} className={`${getStatusColor('in_progress')} p-4 rounded-xl border border-purple-200`}>
                  <h3 className="font-semibold text-secondary-900 mb-2">Task</h3>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    <p>Date completed: {task.dateCompleted}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Column */}
          <div className={`${getColumnColor('complete')} rounded-2xl p-6 shadow-soft`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Complete</h2>
              <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {getTasksByStatus('complete').length}
              </span>
            </div>
            <div className="space-y-4">
              {getTasksByStatus('complete').map((task) => (
                <div key={task.id} className={`${getStatusColor('complete')} p-4 rounded-xl border border-green-200`}>
                  <h3 className="font-semibold text-secondary-900 mb-2">Task</h3>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    <p>Date completed: {task.dateCompleted}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On Hold Column */}
          <div className={`${getColumnColor('on_hold')} rounded-2xl p-6 shadow-soft`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">On hold</h2>
              <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {getTasksByStatus('on_hold').length}
              </span>
            </div>
            <div className="space-y-4">
              {getTasksByStatus('on_hold').map((task) => (
                <div key={task.id} className={`${getStatusColor('on_hold')} p-4 rounded-xl border border-yellow-200`}>
                  <h3 className="font-semibold text-secondary-900 mb-2">Task</h3>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    <p>Date completed: {task.dateCompleted}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-12 px-6 py-3">
            Add Task
          </button>
          <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-12 px-6 py-3">
            Complete Review
          </button>
        </div>
      </div>
    </div>
  )
}