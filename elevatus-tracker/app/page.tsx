import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="flex flex-col items-center mb-12">
              <div className="mb-6">
                <svg 
                  className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96" 
                  viewBox="0 0 488 488" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M408.958 219.563L289.681 305.482M205.84 176.563L86.5632 262.482M419.5 266C279.125 393.908 218.826 405.627 117 299M371.501 194C237.5 65.4999 195 128 17.5 264.5M479 244C479 373.787 373.787 479 244 479C114.213 479 9 373.787 9 244C9 114.213 114.213 9 244 9C373.787 9 479 114.213 479 244ZM323 242C323 284.526 288.526 319 246 319C203.474 319 169 284.526 169 242C169 199.474 203.474 165 246 165C288.526 165 323 199.474 323 242Z" 
                    stroke="url(#paint0_linear_62_289)" 
                    strokeWidth="18" 
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient 
                      id="paint0_linear_62_289" 
                      x1="61.5" 
                      y1="95.5" 
                      x2="421" 
                      y2="403" 
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F2A5A3"/>
                      <stop offset="0.581731" stopColor="#EE7DBD"/>
                      <stop offset="1" stopColor="#816CC4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent">
                ElevateUs
              </h1>
            </div>
            
            {/* Hero Text */}
            <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl md:text-5xl mb-4">
              Employee Tracker
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-secondary-600 md:text-xl">
              A comprehensive employee management system designed for South African businesses. 
              Foster continuous growth and streamline performance management.
            </p>
            
            {/* Portal Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/employer/login">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Employer Portal
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/employee/login">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Employee Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-nav-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900">Powerful Features</h2>
            <p className="mt-4 text-lg text-secondary-600">Everything you need to manage your workforce effectively</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Employee Management */}
            <Card className="bg-light-mint hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-hover-teal rounded-2xl mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Employee Management</h3>
                <p className="text-secondary-600">
                  Comprehensive employee profiles, document management, and organizational structure tracking.
                </p>
              </CardContent>
            </Card>

            {/* Performance Reviews */}
            <Card className="bg-light-purple hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-middle rounded-2xl mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Performance Reviews</h3>
                <p className="text-secondary-600">
                  Modern review interface with 360-degree feedback, goal tracking, and performance analytics.
                </p>
              </CardContent>
            </Card>

            {/* Growth Tracking */}
            <Card className="bg-light-green hover:shadow-medium transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-hover-lime rounded-2xl mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Growth Tracking</h3>
                <p className="text-secondary-600">
                  Monitor individual development, set career goals, and align personal growth with company objectives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-secondary-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="sm" variant="icon" />
            </div>
            <p className="text-secondary-400 text-sm">
              © 2024 ElevateUs. Empowering South African businesses through effective employee management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}