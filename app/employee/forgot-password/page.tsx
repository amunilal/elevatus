'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function EmployeeForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulate API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: 'EMPLOYEE' })
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError('An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
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
              Check your email
            </h2>
            <p className="text-secondary-600">
              We've sent password reset instructions to your email address.
            </p>
          </div>

          {/* Success Card */}
          <Card className="bg-nav-white shadow-medium">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-secondary-700">
                    If an account exists for <strong>{email}</strong>, you will receive an email with instructions on how to reset your password.
                  </p>
                  <p className="text-sm text-secondary-600">
                    If you don't receive an email within 5 minutes, check your spam folder or try again.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/employee/login">
                    <Button variant="gradient" className="w-full">
                      Return to login
                    </Button>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                    className="w-full text-sm text-brand-middle hover:text-hover-magenta transition-colors"
                  >
                    Try another email
                  </button>
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
            Forgot Password?
          </h2>
          <p className="text-secondary-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>
        
        {/* Reset Form */}
        <Card className="bg-nav-white shadow-medium">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@company.co.za"
                      error={!!error}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
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

              <Button
                type="submit"
                variant="gradient"
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send reset instructions'
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
          <div className="inline-flex items-center bg-secondary-50 rounded-lg px-4 py-3">
            <svg className="h-5 w-5 text-secondary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-secondary-700">
              For security, reset links expire after 1 hour
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}