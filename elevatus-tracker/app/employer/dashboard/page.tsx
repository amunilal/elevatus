'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'

export default function EmployerDashboardPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Simple Header - matching Figma */}
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">Dashboard</h1>
          <p className="text-secondary-700 text-base">
            Welcome back! Here's an overview of your organization.
          </p>
        </div>

        {/* Stats Grid - Simplified like Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Employees */}
          <Link href="/employer/employees" className="block">
            <div className="bg-nav-white rounded-2xl p-6 hover:shadow-medium transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-hover-teal rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-hover-teal mb-1">Total Employees</p>
                  <p className="text-2xl font-bold text-secondary-900">24</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Pending Reviews */}
          <div className="bg-nav-white rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-middle rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-middle mb-1">Pending reviews</p>
                <p className="text-2xl font-bold text-secondary-900">6</p>
              </div>
            </div>
          </div>

          {/* Completed Reviews */}
          <div className="bg-nav-white rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-hover-lime rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-success-600 mb-1">Completed reviews</p>
                <p className="text-2xl font-bold text-secondary-900">18</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Matching Figma layout */}
        <div className="bg-nav-white rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/employer/employees/new"
              className="block p-6 rounded-2xl bg-light-mint hover:bg-hover-aqua transition-colors"
            >
              <h3 className="font-semibold text-secondary-900 mb-2">Add Employee</h3>
              <p className="text-sm text-secondary-600">Create new employee profile</p>
            </Link>
            
            <Link 
              href="/employer/reviews/start"
              className="block p-6 rounded-2xl bg-light-purple hover:bg-hover-lavender transition-colors"
            >
              <h3 className="font-semibold text-secondary-900 mb-2">Start Review</h3>
              <p className="text-sm text-secondary-600">Begin performance review</p>
            </Link>
            
            <Link 
              href="/employer/reviews/history"
              className="block p-6 rounded-2xl bg-light-green hover:bg-hover-lime transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Review History</h3>
                  <p className="text-lg font-bold text-secondary-900">18</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity - Clean minimal style */}
        <div className="bg-nav-white rounded-2xl p-8">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">Recent activity</h2>
          <div className="space-y-1">
            <p className="text-sm text-secondary-600">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  )
}