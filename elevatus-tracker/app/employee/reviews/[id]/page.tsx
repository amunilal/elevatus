'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

interface Goal {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  duration?: string
  isArchived: boolean
}

interface Review {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  reviewType: string
  dueDate: string
  createdAt: string
  summary?: string
  managerReview?: string
  employee: {
    id: string
    firstName: string
    lastName: string
    designation: string
    department: string
  }
  reviewer: {
    id: string
    firstName: string
    lastName: string
  }
  reviewCycle: {
    id: string
    name: string
    year: number
  }
  goals: Goal[]
  notes: {
    id: string
    content: string
    createdAt: string
  }[]
}

export default function EmployeeReviewDetailPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    fetchReview()
  }, [params.id])

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/reviews/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setReview(data)
      } else {
        console.error('Failed to fetch review:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch review:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return <Badge variant="secondary" size="sm">Not Started</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="warning" size="sm">In Progress</Badge>
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>
    }
  }

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Badge variant="secondary" size="sm">To Do</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="warning" size="sm">In Progress</Badge>
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>
      case 'ON_HOLD':
        return <Badge variant="error" size="sm">On Hold</Badge>
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const activeGoals = review?.goals.filter(goal => !goal.isArchived) || []
  const archivedGoals = review?.goals.filter(goal => goal.isArchived) || []
  const goalsToShow = showArchived ? archivedGoals : activeGoals

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-8"></div>
            <div className="bg-nav-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-secondary-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-bg-base p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Review Not Found</h1>
            <p className="text-secondary-600 mb-6">The review you're looking for doesn't exist or you don't have access to it.</p>
            <Link href="/employee/reviews">
              <button className="bg-brand-middle text-white px-6 py-3 rounded-lg font-semibold hover:bg-hover-magenta transition-colors">
                Back to Reviews
              </button>
            </Link>
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
            <Badge variant="purple" size="sm">Employee Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/employee/reviews">
              <button className="text-sm text-secondary-600 hover:text-brand-middle font-medium">
                Back to Reviews
              </button>
            </Link>
            <Link href="/employee/dashboard">
              <button className="text-sm text-secondary-600 hover:text-brand-middle font-medium">
                Dashboard
              </button>
            </Link>
            <button className="text-sm text-hover-magenta font-medium">Sign out</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Review Header */}
        <div className="bg-nav-white shadow-soft rounded-2xl p-8 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-2xl font-bold text-secondary-900">{review.reviewCycle.name}</h1>
                {getStatusBadge(review.status)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary-500 mb-1">Employee</p>
                  <p className="font-medium text-secondary-900">
                    {review.employee.firstName} {review.employee.lastName}
                  </p>
                  <p className="text-secondary-600">{review.employee.designation}</p>
                </div>
                <div>
                  <p className="text-secondary-500 mb-1">Reviewer</p>
                  <p className="font-medium text-secondary-900">
                    {review.reviewer.firstName} {review.reviewer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-500 mb-1">Due Date</p>
                  <p className="font-medium text-secondary-900">{formatDate(review.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {review.summary && (
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Review Summary</h3>
              <p className="text-secondary-700">{review.summary}</p>
            </div>
          )}

          {review.managerReview && (
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Manager's Review</h3>
              <p className="text-secondary-700">{review.managerReview}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <div className="bg-nav-white shadow-soft rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary-900">
                  {showArchived ? 'Archived Goals' : 'Goals'}
                </h2>
                <div className="flex items-center space-x-3">
                  {archivedGoals.length > 0 && (
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className="text-sm text-brand-middle hover:text-hover-magenta font-medium"
                    >
                      {showArchived ? 'Show Active Goals' : `Show Archived (${archivedGoals.length})`}
                    </button>
                  )}
                </div>
              </div>

              {goalsToShow.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-secondary-500">
                    {showArchived ? 'No archived goals yet.' : 'No goals assigned yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goalsToShow.map((goal) => (
                    <div key={goal.id} className="border border-secondary-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-secondary-900 flex-1">{goal.title}</h3>
                        {getGoalStatusBadge(goal.status)}
                      </div>
                      {goal.duration && (
                        <div className="text-sm text-secondary-600">
                          Duration: {goal.duration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="bg-nav-white shadow-soft rounded-2xl p-8">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">Review Notes</h2>
              
              {review.notes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-8 w-8 text-secondary-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <p className="text-sm text-secondary-500">No notes yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {review.notes.map((note) => (
                    <div key={note.id} className="bg-secondary-50 rounded-lg p-4">
                      <p className="text-sm text-secondary-900 mb-2">{note.content}</p>
                      <p className="text-xs text-secondary-500">{formatDateTime(note.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}