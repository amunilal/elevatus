'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { useActivity } from '@/contexts/ActivityContext'

export default function EmployerDashboardPage() {
  const { activities } = useActivity()

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

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
                  <svg width="36" height="39" viewBox="0 0 36 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.63146 5.87216C9.15019 5.1146 10.8625 4.95878 12.4748 5.43142C13.2593 5.6614 13.7248 6.54362 13.5146 7.40192C13.3044 8.26022 12.4981 8.76957 11.7135 8.53959C10.7608 8.26031 9.74901 8.35239 8.85158 8.80003C7.95415 9.24768 7.22705 10.023 6.79497 10.993C6.36289 11.963 6.25277 13.0673 6.48349 14.1165C6.71421 15.1656 7.2714 16.0942 8.05948 16.743C8.48703 17.0951 8.70608 17.6734 8.63144 18.253C8.5568 18.8327 8.20025 19.3223 7.70046 19.5314C6.70142 19.9493 5.78366 20.5949 5.01282 21.4382C4.75312 21.7223 4.514 22.0246 4.29646 22.3424C3.84319 23.0045 3.87274 23.5591 4.11129 24.0557C4.39297 24.6422 5.04021 25.2502 5.95573 25.5653C6.73049 25.8319 7.16098 26.7352 6.91727 27.5828C6.67355 28.4305 5.84792 28.9015 5.07317 28.6348C3.57052 28.1177 2.21941 27.0343 1.50771 25.5526C0.752878 23.9811 0.794017 22.0907 1.94243 20.4133C2.24336 19.9737 2.57408 19.5557 2.93309 19.1629C3.48663 18.5573 4.095 18.0254 4.74541 17.5731C4.2219 16.7637 3.83905 15.8474 3.62392 14.8692C3.23347 13.0937 3.41983 11.2249 4.15103 9.58337C4.88224 7.94179 6.11273 6.62971 7.63146 5.87216ZM26.4422 8.80003C25.5447 8.35239 24.5329 8.26031 23.5802 8.53959C22.7957 8.76957 21.9893 8.26022 21.7791 7.40192C21.5689 6.54362 22.0345 5.6614 22.819 5.43142C24.4312 4.95878 26.1436 5.1146 27.6623 5.87216C29.181 6.62971 30.4115 7.94179 31.1427 9.58337C31.8739 11.2249 32.0603 13.0937 31.6698 14.8692C31.4547 15.8474 31.0719 16.7637 30.5483 17.5731C31.1988 18.0254 31.8071 18.5573 32.3607 19.1629C32.7197 19.5557 33.0504 19.9737 33.3513 20.4133C34.4997 22.0907 34.5409 23.9811 33.7861 25.5526C33.0744 27.0343 31.7232 28.1177 30.2206 28.6348C29.4458 28.9015 28.6202 28.4305 28.3765 27.5828C28.1328 26.7352 28.5633 25.8319 29.338 25.5653C30.2536 25.2502 30.9008 24.6422 31.1825 24.0557C31.421 23.5591 31.4506 23.0045 30.9973 22.3424C30.7798 22.0246 30.5406 21.7223 30.2809 21.4382C29.5101 20.5949 28.5923 19.9493 27.5933 19.5314C27.0935 19.3223 26.737 18.8327 26.6623 18.253C26.5877 17.6734 26.8067 17.0951 27.2343 16.743C28.0224 16.0942 28.5796 15.1656 28.8103 14.1165C29.041 13.0673 28.9309 11.963 28.4988 10.993C28.0667 10.023 27.3396 9.24768 26.4422 8.80003ZM17.6471 11.599C15.3008 11.599 13.3987 13.68 13.3987 16.247C13.3987 18.814 15.3008 20.8951 17.6471 20.8951C19.9934 20.8951 21.8954 18.814 21.8954 16.247C21.8954 13.68 19.9934 11.599 17.6471 11.599ZM22.4168 22.1327C23.9012 20.6917 24.8366 18.5889 24.8366 16.247C24.8366 11.9028 21.6177 8.38121 17.6471 8.38121C13.6764 8.38121 10.4575 11.9028 10.4575 16.247C10.4575 18.5889 11.393 20.6917 12.8774 22.1327C11.8733 22.6848 10.9465 23.4128 10.137 24.2984C9.77796 24.6912 9.44725 25.1093 9.14632 25.5489C8.47187 26.534 8.15427 27.632 8.21019 28.74C8.26526 29.831 8.67545 30.8078 9.26186 31.5964C10.4158 33.1481 12.3507 34.1239 14.3791 34.1239H20.9151C22.9435 34.1239 24.8784 33.1481 26.0323 31.5964C26.6188 30.8078 27.0289 29.831 27.084 28.74C27.1399 27.632 26.8223 26.534 26.1479 25.5489C25.847 25.1093 25.5162 24.6912 25.1572 24.2984C24.3477 23.4128 23.4209 22.6848 22.4168 22.1327ZM17.6471 24.1129C15.6103 24.1129 13.6569 24.9981 12.2167 26.5738C11.957 26.8579 11.7179 27.1602 11.5004 27.478C11.201 27.9152 11.1326 28.2786 11.1469 28.5626C11.1621 28.8636 11.2784 29.2094 11.5433 29.5656C12.092 30.3034 13.1588 30.9061 14.3791 30.9061H20.9151C22.1354 30.9061 23.2022 30.3034 23.7509 29.5656C24.0158 29.2094 24.1321 28.8636 24.1473 28.5626C24.1616 28.2786 24.0932 27.9152 23.7938 27.478C23.5763 27.1602 23.3372 26.8579 23.0775 26.5738C21.6373 24.9981 19.6839 24.1129 17.6471 24.1129Z" fill="white"/>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-sm text-secondary-600">Begin employee performance review</p>
            </Link>
            
            <Link 
              href="/employer/reviews/history"
              className="block p-6 rounded-2xl bg-light-green hover:bg-hover-lime transition-colors"
            >
              <h3 className="font-semibold text-secondary-900 mb-2">Review History</h3>
              <p className="text-sm text-secondary-600">List of past employee reviews</p>
            </Link>
            
            <Link 
              href="/employer/reports"
              className="block p-6 rounded-2xl bg-light-coral hover:bg-hover-coral transition-colors"
            >
              <h3 className="font-semibold text-secondary-900 mb-2">Report Analyst</h3>
              <p className="text-sm text-secondary-600">Generate and analyze reports</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity - Clean minimal style */}
        <div className="bg-nav-white rounded-2xl p-8">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">Recent activity</h2>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-light-purple transition-colors">
                  <div className="w-8 h-8 bg-brand-middle rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'employee_created' && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    {activity.type === 'employee_updated' && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                    {activity.type === 'review_started' && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {activity.type === 'review_completed' && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-secondary-500">by {activity.user}</span>
                      <span className="text-xs text-secondary-400">•</span>
                      <span className="text-xs text-secondary-500">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-secondary-600">No recent activity to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}