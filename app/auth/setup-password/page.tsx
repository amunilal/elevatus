'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface TokenValidation {
  valid: boolean
  email?: string
  userType?: string
  createdAt?: string
}

function SetupPasswordContent() {
  // Basic browser compatibility check
  if (typeof window !== 'undefined') {
    console.log('SAFARI DEBUG: Window object available')
    console.log('SAFARI DEBUG: User Agent:', navigator.userAgent)
    console.log('SAFARI DEBUG: URL:', window.location.href)
    console.log('SAFARI DEBUG: Search params:', window.location.search)
    
    // Try to write to document title to see if basic DOM manipulation works
    try {
      document.title = 'ElevatUs - Setup Password (Debug)'
      console.log('SAFARI DEBUG: Document title update successful')
    } catch (e) {
      console.error('SAFARI DEBUG: Document title update failed:', e)
    }
  }
  
  console.log('=== SetupPasswordContent Rendering ===')
  console.log('Initial render at:', new Date().toISOString())
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  console.log('searchParams immediately after useSearchParams():', searchParams)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tokenValid, setTokenValid] = useState<TokenValidation | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    console.log('=== Password Setup Debug ===')
    console.log('1. Component mounted')
    console.log('2. searchParams object:', searchParams)
    console.log('3. typeof window:', typeof window)
    
    // Safari Compatibility: Multiple extraction methods
    let tokenParam: string | null = null
    const extractionMethods = []
    
    // Method 1: Try searchParams if available
    try {
      if (searchParams) {
        console.log('4. Trying searchParams.get("token")')
        tokenParam = searchParams.get('token')
        console.log('5. Token from searchParams:', tokenParam)
        extractionMethods.push('searchParams: ' + (tokenParam || 'null'))
      } else {
        console.log('4. searchParams is null/undefined')
        extractionMethods.push('searchParams: unavailable')
      }
    } catch (e) {
      console.error('SAFARI DEBUG: searchParams failed:', e)
      extractionMethods.push('searchParams: error - ' + (e instanceof Error ? e.message : String(e)))
    }
    
    // Method 2: Direct window.location parsing
    if (!tokenParam && typeof window !== 'undefined') {
      try {
        console.log('6. Trying window.location fallback')
        console.log('7. window.location.href:', window.location.href)
        console.log('8. window.location.search:', window.location.search)
        
        const urlParams = new URLSearchParams(window.location.search)
        tokenParam = urlParams.get('token')
        console.log('9. Token from window.location:', tokenParam)
        extractionMethods.push('window.location: ' + (tokenParam || 'null'))
      } catch (e) {
        console.error('SAFARI DEBUG: window.location parsing failed:', e)
        extractionMethods.push('window.location: error - ' + (e instanceof Error ? e.message : String(e)))
      }
    }
    
    // Method 3: Manual regex parsing as last resort
    if (!tokenParam && typeof window !== 'undefined') {
      try {
        const url = window.location.href
        const tokenMatch = url.match(/[?&]token=([^&]+)/)
        if (tokenMatch) {
          tokenParam = decodeURIComponent(tokenMatch[1])
          console.log('10. Token from regex parsing:', tokenParam)
          extractionMethods.push('regex: ' + tokenParam)
        } else {
          extractionMethods.push('regex: no match')
        }
      } catch (e) {
        console.error('SAFARI DEBUG: regex parsing failed:', e)
        extractionMethods.push('regex: error - ' + (e instanceof Error ? e.message : String(e)))
      }
    }
    
    console.log('SAFARI DEBUG: All extraction methods attempted:', extractionMethods)
    console.log('10. Final token value:', tokenParam)
    setToken(tokenParam)
    
    if (tokenParam) {
      console.log('11. Calling validateToken with:', tokenParam)
      validateToken(tokenParam)
    } else {
      console.log('11. No token found, showing error')
      setLoading(false)
      setErrors({ token: 'Invalid setup link' })
    }
  }, [searchParams])

  const validateToken = async (tokenValue: string) => {
    console.log('=== ValidateToken Debug ===')
    console.log('1. Starting validation with token:', tokenValue)
    
    try {
      const url = `/api/auth/setup-password?token=${tokenValue}`
      console.log('2. Fetching URL:', url)
      
      const response = await fetch(url)
      console.log('3. Response status:', response.status)
      console.log('4. Response ok:', response.ok)
      
      const data = await response.json()
      console.log('5. Response data:', data)

      if (response.ok && data.valid) {
        console.log('6. Token is valid, setting tokenValid')
        setTokenValid(data)
      } else {
        console.log('6. Token is invalid, error:', data.error)
        setErrors({ token: data.error || 'Invalid or expired setup link' })
      }
    } catch (error) {
      console.log('7. Caught error during validation:', error)
      setErrors({ token: 'Failed to validate setup link' })
    } finally {
      console.log('8. Setting loading to false')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)

    // Validation
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect to appropriate login page after 3 seconds
        setTimeout(() => {
          const loginUrl = data.userType === 'EMPLOYER' ? '/employer/login' : '/employee/login'
          router.push(loginUrl)
        }, 3000)
      } else {
        setErrors({ submit: data.error || 'Failed to set password' })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while setting your password' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating setup link...</p>
          {/* Safari Debug Info */}
          {typeof window !== 'undefined' && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg text-left text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>URL: {window.location.href}</p>
              <p>Search: {window.location.search}</p>
              <p>User Agent: {navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</p>
              <p>Token State: {token ? 'Found' : 'Not Found'}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (errors.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Invalid Setup Link</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 mb-4">{errors.token}</p>
                <p className="text-sm text-gray-600 mb-6">
                  The password setup link may have expired or been used already. Please contact your administrator for a new setup link.
                </p>
                {/* Safari Debug Info in Error State */}
                {typeof window !== 'undefined' && (
                  <div className="mb-4 p-3 bg-yellow-100 rounded text-left text-xs">
                    <p><strong>Safari Debug:</strong></p>
                    <p>URL: {window.location.href}</p>
                    <p>Search: {window.location.search}</p>
                    <p>Token Found: {token || 'None'}</p>
                    <p>Browser: {navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</p>
                  </div>
                )}
                <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                  Return to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Password Set Successfully!</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 mb-4">Your password has been set successfully!</p>
                <p className="text-sm text-gray-600 mb-6">
                  You will be redirected to the login page in a few seconds...
                </p>
                <div className="space-y-2">
                  <Link 
                    href={tokenValid?.userType === 'EMPLOYER' ? '/employer/login' : '/employee/login'}
                    className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Login Now
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo size="md" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Set Your Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to ElevatUs! Please set your password to complete your account setup.
          </p>
        </div>

        {tokenValid && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Account:</strong> {tokenValid.email}<br />
                  <strong>Role:</strong> {tokenValid.userType}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Setting Password...' : 'Set Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SetupPasswordContent />
    </Suspense>
  )
}