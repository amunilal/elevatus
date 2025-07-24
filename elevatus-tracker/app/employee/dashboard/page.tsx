'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'

interface Review {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  reviewType: string
  dueDate: string
  createdAt: string
  summary?: string
  reviewCycle: {
    id: string
    name: string
    year: number
  }
  reviewer: {
    id: string
    firstName: string
    lastName: string
  }
  goals: {
    id: string
    title: string
    status: string
    isArchived: boolean
  }[]
}

export default function EmployeeDashboardPage() {
  const [latestReview, setLatestReview] = useState<Review | null>(null)
  const [loadingReview, setLoadingReview] = useState(true)
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    fetchLatestReview()
  }, [])

  const fetchLatestReview = async () => {
    try {
      // TODO: Get current employee ID from session/auth
      // For now, we'll fetch all reviews and get the latest one
      const response = await fetch('/api/reviews')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data) && data.length > 0) {
        // Get the most recent review (already sorted by createdAt desc)
        setLatestReview(data[0])
      }
    } catch (error) {
      console.error('Failed to fetch latest review:', error)
    } finally {
      setLoadingReview(false)
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

  const getProgressPercentage = (goals: Review['goals']) => {
    if (goals.length === 0) return 0
    const activeGoals = goals.filter(goal => !goal.isArchived)
    if (activeGoals.length === 0) return 100
    const completedGoals = activeGoals.filter(goal => goal.status === 'COMPLETED')
    return Math.round((completedGoals.length / activeGoals.length) * 100)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header - matching modern design */}
      <div className="bg-nav-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <Badge variant="purple" size="sm">Employee Portal</Badge>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-secondary-600">john.doe@company.co.za</span>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('user')
                  sessionStorage.clear()
                  window.location.href = '/employee/login'
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">Good morning, John! 👋</h1>
          <p className="text-secondary-700 text-base">{currentDate}</p>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">

          <div className="bg-nav-white overflow-hidden shadow-soft rounded-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-middle/10 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Annual Leave</p>
                  <p className="text-2xl font-bold text-secondary-900">18 days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-nav-white overflow-hidden shadow-soft rounded-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Courses Completed</p>
                  <p className="text-2xl font-bold text-secondary-900">5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-nav-white overflow-hidden shadow-soft rounded-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Badges Earned</p>
                  <p className="text-2xl font-bold text-secondary-900">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Review Section */}
        <div className="mb-8">
          <div className="bg-nav-white shadow-soft rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Current Performance Review</h2>
              <Link href="/employee/reviews">
                <button className="text-sm text-brand-middle hover:text-hover-magenta font-medium">
                  View All Reviews
                </button>
              </Link>
            </div>

            {loadingReview ? (
              <div className="animate-pulse">
                <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-secondary-200 rounded w-full"></div>
              </div>
            ) : latestReview ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {latestReview.reviewCycle.name}
                      </h3>
                      {getStatusBadge(latestReview.status)}
                    </div>
                    <p className="text-sm text-secondary-600 mb-1">
                      Review Type: {latestReview.reviewType}
                    </p>
                    <p className="text-sm text-secondary-600">
                      Reviewer: {latestReview.reviewer.firstName} {latestReview.reviewer.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-secondary-500 mb-1">Due Date</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {formatDate(latestReview.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary-700">Progress</span>
                    <span className="text-sm font-medium text-secondary-900">
                      {getProgressPercentage(latestReview.goals)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-success-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressPercentage(latestReview.goals)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-secondary-500 mt-2">
                    {latestReview.goals.filter(g => !g.isArchived && g.status === 'COMPLETED').length} of {latestReview.goals.filter(g => !g.isArchived).length} goals completed
                  </p>
                </div>

                {latestReview.summary && (
                  <div className="mb-4">
                    <p className="text-sm text-secondary-700 line-clamp-3">
                      {latestReview.summary}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-500">
                    Goals: {latestReview.goals.filter(g => !g.isArchived).length}
                  </span>
                  <Link href={`/employee/reviews/${latestReview.id}`}>
                    <button className="bg-brand-middle text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hover-magenta transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No reviews yet</h3>
                <p className="text-secondary-500 mb-4">Your performance reviews will appear here when they are assigned.</p>
                <Link href="/employee/reviews">
                  <button className="text-brand-middle hover:text-hover-magenta font-medium">
                    Check for updates
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-nav-white shadow-soft rounded-2xl mb-8">
              <div className="p-8">
                <h3 className="text-xl font-bold text-secondary-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link href="/employee/leave/new" className="block p-6 rounded-2xl bg-light-mint hover:bg-hover-aqua transition-colors">
                    <h4 className="font-semibold text-secondary-900 mb-2">Request Leave</h4>
                    <p className="text-sm text-secondary-600">Submit a leave application</p>
                  </Link>
                  <button className="block p-6 rounded-2xl bg-light-green hover:bg-hover-lime transition-colors text-left">
                    <h4 className="font-semibold text-secondary-900 mb-2">View Payslip</h4>
                    <p className="text-sm text-secondary-600">Download latest payslip</p>
                  </button>
                  <button className="block p-6 rounded-2xl bg-light-purple hover:bg-hover-lavender transition-colors text-left">
                    <h4 className="font-semibold text-secondary-900 mb-2">Browse Courses</h4>
                    <p className="text-sm text-secondary-600">Explore learning opportunities</p>
                  </button>
                  <Link href="/employee/profile" className="block p-6 rounded-2xl bg-light-coral hover:bg-hover-coral transition-colors">
                    <h4 className="font-semibold text-secondary-900 mb-2">Update Profile</h4>
                    <p className="text-sm text-secondary-600">Edit personal information</p>
                  </Link>
                  <Link href="/employee/reviews" className="block p-6 rounded-2xl bg-light-blue hover:bg-hover-blue transition-colors">
                    <h4 className="font-semibold text-secondary-900 mb-2">My Reviews</h4>
                    <p className="text-sm text-secondary-600">View performance reviews</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-nav-white shadow-soft rounded-2xl">
              <div className="p-8">
                <h3 className="text-xl font-bold text-secondary-900 mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-error-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary-900">Performance Review</p>
                      <p className="text-sm text-secondary-600">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-brand-middle rounded-full mt-2"></div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary-900">Team Meeting</p>
                      <p className="text-sm text-secondary-600">Tomorrow at 2 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-success-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary-900">POPIA Training</p>
                      <p className="text-sm text-secondary-600">Next week</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-hover-magenta rounded-full mt-2"></div>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary-900">Public Holiday</p>
                      <p className="text-sm text-secondary-600">Heritage Day - 24 Sept</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}