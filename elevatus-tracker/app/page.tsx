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
                  className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48" 
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
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-brand-left via-brand-middle to-brand-right bg-clip-text text-transparent">
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
              <div className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-secondary-200 text-secondary-900 hover:bg-brand-gradient hover:text-white hover:border-transparent focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-large h-11 px-8">
                <Link href="/employer/login" className="flex items-center justify-start w-full">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Employer Portal</span>
                </Link>
              </div>
              <div className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-secondary-200 text-secondary-900 hover:bg-brand-gradient hover:text-white hover:border-transparent focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-large h-11 px-8">
                <Link href="/employee/login" className="flex items-center justify-start w-full">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Employee Portal</span>
                </Link>
              </div>
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
            <Card className="hover:shadow-medium transition-shadow" style={{ backgroundColor: '#B8E6D1' }}>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#5CBAA0' }}>
                  <svg width="36" height="39" viewBox="0 0 36 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.63146 5.87216C9.15019 5.1146 10.8625 4.95878 12.4748 5.43142C13.2593 5.6614 13.7248 6.54362 13.5146 7.40192C13.3044 8.26022 12.4981 8.76957 11.7135 8.53959C10.7608 8.26031 9.74901 8.35239 8.85158 8.80003C7.95415 9.24768 7.22705 10.023 6.79497 10.993C6.36289 11.963 6.25277 13.0673 6.48349 14.1165C6.71421 15.1656 7.2714 16.0942 8.05948 16.743C8.48703 17.0951 8.70608 17.6734 8.63144 18.253C8.5568 18.8327 8.20025 19.3223 7.70046 19.5314C6.70142 19.9493 5.78366 20.5949 5.01282 21.4382C4.75312 21.7223 4.514 22.0246 4.29646 22.3424C3.84319 23.0045 3.87274 23.5591 4.11129 24.0557C4.39297 24.6422 5.04021 25.2502 5.95573 25.5653C6.73049 25.8319 7.16098 26.7352 6.91727 27.5828C6.67355 28.4305 5.84792 28.9015 5.07317 28.6348C3.57052 28.1177 2.21941 27.0343 1.50771 25.5526C0.752878 23.9811 0.794017 22.0907 1.94243 20.4133C2.24336 19.9737 2.57408 19.5557 2.93309 19.1629C3.48663 18.5573 4.095 18.0254 4.74541 17.5731C4.2219 16.7637 3.83905 15.8474 3.62392 14.8692C3.23347 13.0937 3.41983 11.2249 4.15103 9.58337C4.88224 7.94179 6.11273 6.62971 7.63146 5.87216ZM26.4422 8.80003C25.5447 8.35239 24.5329 8.26031 23.5802 8.53959C22.7957 8.76957 21.9893 8.26022 21.7791 7.40192C21.5689 6.54362 22.0345 5.6614 22.819 5.43142C24.4312 4.95878 26.1436 5.1146 27.6623 5.87216C29.181 6.62971 30.4115 7.94179 31.1427 9.58337C31.8739 11.2249 32.0603 13.0937 31.6698 14.8692C31.4547 15.8474 31.0719 16.7637 30.5483 17.5731C31.1988 18.0254 31.8071 18.5573 32.3607 19.1629C32.7197 19.5557 33.0504 19.9737 33.3513 20.4133C34.4997 22.0907 34.5409 23.9811 33.7861 25.5526C33.0744 27.0343 31.7232 28.1177 30.2206 28.6348C29.4458 28.9015 28.6202 28.4305 28.3765 27.5828C28.1328 26.7352 28.5633 25.8319 29.338 25.5653C30.2536 25.2502 30.9008 24.6422 31.1825 24.0557C31.421 23.5591 31.4506 23.0045 30.9973 22.3424C30.7798 22.0246 30.5406 21.7223 30.2809 21.4382C29.5101 20.5949 28.5923 19.9493 27.5933 19.5314C27.0935 19.3223 26.737 18.8327 26.6623 18.253C26.5877 17.6734 26.8067 17.0951 27.2343 16.743C28.0224 16.0942 28.5796 15.1656 28.8103 14.1165C29.041 13.0673 28.9309 11.963 28.4988 10.993C28.0667 10.023 27.3396 9.24768 26.4422 8.80003ZM17.6471 11.599C15.3008 11.599 13.3987 13.68 13.3987 16.247C13.3987 18.814 15.3008 20.8951 17.6471 20.8951C19.9934 20.8951 21.8954 18.814 21.8954 16.247C21.8954 13.68 19.9934 11.599 17.6471 11.599ZM22.4168 22.1327C23.9012 20.6917 24.8366 18.5889 24.8366 16.247C24.8366 11.9028 21.6177 8.38121 17.6471 8.38121C13.6764 8.38121 10.4575 11.9028 10.4575 16.247C10.4575 18.5889 11.393 20.6917 12.8774 22.1327C11.8733 22.6848 10.9465 23.4128 10.137 24.2984C9.77796 24.6912 9.44725 25.1093 9.14632 25.5489C8.47187 26.534 8.15427 27.632 8.21019 28.74C8.26526 29.831 8.67545 30.8078 9.26186 31.5964C10.4158 33.1481 12.3507 34.1239 14.3791 34.1239H20.9151C22.9435 34.1239 24.8784 33.1481 26.0323 31.5964C26.6188 30.8078 27.0289 29.831 27.084 28.74C27.1399 27.632 26.8223 26.534 26.1479 25.5489C25.847 25.1093 25.5162 24.6912 25.1572 24.2984C24.3477 23.4128 23.4209 22.6848 22.4168 22.1327ZM17.6471 24.1129C15.6103 24.1129 13.6569 24.9981 12.2167 26.5738C11.957 26.8579 11.7179 27.1602 11.5004 27.478C11.201 27.9152 11.1326 28.2786 11.1469 28.5626C11.1621 28.8636 11.2784 29.2094 11.5433 29.5656C12.092 30.3034 13.1588 30.9061 14.3791 30.9061H20.9151C22.1354 30.9061 23.2022 30.3034 23.7509 29.5656C24.0158 29.2094 24.1321 28.8636 24.1473 28.5626C24.1616 28.2786 24.0932 27.9152 23.7938 27.478C23.5763 27.1602 23.3372 26.8579 23.0775 26.5738C21.6373 24.9981 19.6839 24.1129 17.6471 24.1129Z" fill="white"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Employee Management</h3>
                <p className="text-secondary-600">
                  Comprehensive employee profiles, document management, and organizational structure tracking.
                </p>
              </CardContent>
            </Card>

            {/* Performance Reviews */}
            <Card className="hover:shadow-medium transition-shadow" style={{ backgroundColor: '#D4C5F9' }}>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#B393F0' }}>
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
            <Card className="hover:shadow-medium transition-shadow" style={{ backgroundColor: '#D4E8A8' }}>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: '#B8D975' }}>
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