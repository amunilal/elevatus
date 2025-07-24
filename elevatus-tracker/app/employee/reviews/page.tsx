'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

interface Review {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  reviewType: string
  dueDate: string
  createdAt: string
  summary?: string
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
  goals: {
    id: string
    title: string
    status: string
  }[]
}

export default function EmployeeReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      // TODO: Get current employee ID from session/auth
      // For now, we'll fetch all reviews and filter on the frontend
      const response = await fetch('/api/reviews')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        // TODO: Filter by current employee ID when auth is implemented
        setReviews(data)
      } else {
        console.error('Failed to fetch reviews:', data.error || 'Invalid response')
        setReviews([])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      setReviews([])
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
            <Link href="/employee/dashboard">
              <button className="text-sm text-secondary-600 hover:text-brand-middle font-medium">
                Dashboard
              </button>
            </Link>
            <Link href="/employee/profile">
              <button className="text-sm text-secondary-600 hover:text-brand-middle font-medium">
                Profile
              </button>
            </Link>
            <button className="text-sm text-hover-magenta font-medium">Sign out</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">My Performance Reviews</h1>
          <p className="text-secondary-600">Track your performance reviews and development goals</p>
        </div>

        {/* Reviews List */}
        <div className="bg-nav-white shadow-soft rounded-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">
              Reviews ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No reviews yet</h3>
                <p className="text-secondary-500">Your performance reviews will appear here when they are assigned.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/employee/reviews/${review.id}`}
                    className="block"
                  >
                    <div className="border border-secondary-200 rounded-xl p-6 hover:border-brand-middle hover:bg-light-purple transition-all duration-200 cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {review.reviewCycle.name}
                            </h3>
                            {getStatusBadge(review.status)}
                          </div>
                          <p className="text-sm text-secondary-600 mb-1">
                            Review Type: {review.reviewType}
                          </p>
                          <p className="text-sm text-secondary-600">
                            Reviewer: {review.reviewer.firstName} {review.reviewer.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-500 mb-1">Due Date</p>
                          <p className="text-sm font-medium text-secondary-900">
                            {formatDate(review.dueDate)}
                          </p>
                        </div>
                      </div>

                      {review.summary && (
                        <div className="mb-4">
                          <p className="text-sm text-secondary-700 line-clamp-2">
                            {review.summary}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-secondary-500">
                        <span>
                          Goals: {review.goals.length}
                        </span>
                        <span>
                          Created: {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}