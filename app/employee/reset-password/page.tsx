'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      setError('Invalid or missing reset token')
    } else {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid reset token')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, userType: 'EMPLOYEE' })
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const data = await response.json()
        setError(data.error || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Logo size="lg" />
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Password Reset Successful
            </h2>
            <p className="text-secondary-600">
              Your password has been successfully updated.
            </p>
          </div>

          {/* Success Card */}
          <Card className="bg-nav-white shadow-medium">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-secondary-700">
                    You can now log in with your new password.
                  </p>
                </div>

                <Link href="/employee/login">
                  <Button variant="gradient" className="w-full">
                    Go to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Logo size="lg" />
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-secondary-600 mb-4">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Card className="bg-nav-white shadow-medium">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/employee/forgot-password">
                    <Button variant="gradient" className="w-full">
                      Request new reset link
                    </Button>
                  </Link>
                  
                  <Link href="/employee/login">
                    <Button variant="outline" className="w-full">
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-secondary-600">
            Enter your new password below.
          </p>
        </div>
        
        {/* Reset Form */}
        <Card className="bg-nav-white shadow-medium">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      error={!!error}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      error={!!error}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-light-pink border border-hover-coral p-4">
                  <p className="text-sm text-secondary-900">{error}</p>
                </div>
              )}

              <div className="text-sm text-secondary-600">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>At least 8 characters long</li>
                  <li>Mix of letters and numbers recommended</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="gradient"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-nav-white text-secondary-500">Or</span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <Link href="/employee/login" className="flex items-center justify-center text-sm font-medium text-brand-middle hover:text-hover-magenta transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to login
                </Link>
                <div className="pt-2 border-t border-secondary-100">
                  <span className="text-sm text-secondary-600">
                    Are you an employer?{' '}
                    <Link href="/employer/forgot-password" className="font-medium text-brand-middle hover:text-hover-magenta transition-colors">
                      Reset employer password
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Notice */}
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-50 rounded-lg px-4 py-3">
            <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">
              Reset links expire after 1 hour for security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Logo size="lg" />
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}