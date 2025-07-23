'use client'

import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'

export default function EmployeeDashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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

        {/* Clock In/Out Section */}
        <div className="bg-brand-gradient rounded-2xl p-8 mb-12 text-white shadow-soft">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Attendance</h3>
              <p className="text-white/90">Clock in to start your day</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-brand-middle px-6 py-3 rounded-lg font-semibold hover:bg-light-purple transition-colors shadow-soft">
                Clock In
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
                Clock Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-nav-white overflow-hidden shadow-soft rounded-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Hours This Week</p>
                  <p className="text-2xl font-bold text-secondary-900">38.5</p>
                </div>
              </div>
            </div>
          </div>

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
                <div className="w-10 h-10 bg-hover-lavender rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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