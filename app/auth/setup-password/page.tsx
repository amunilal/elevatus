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
  // Production-friendly debugging methods
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    console.log('SAFARI DEBUG:', message)
    
    // Also store in localStorage for persistent debugging
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem('safari-debug') || '[]'
        const logs = JSON.parse(existing)
        logs.push(`${new Date().toISOString()}: ${message}`)
        // Keep only last 50 entries
        if (logs.length > 50) logs.splice(0, logs.length - 50)
        localStorage.setItem('safari-debug', JSON.stringify(logs))
      } catch (e) {
        console.warn('Could not write to localStorage:', e)
      }
    }
  }
  
  // Basic browser compatibility check
  if (typeof window !== 'undefined') {
    addDebugInfo('Window object available')
    addDebugInfo(`User Agent: ${navigator.userAgent}`)
    addDebugInfo(`URL: ${window.location.href}`)
    addDebugInfo(`Search params: ${window.location.search}`)
    
    // Try to write to document title to see if basic DOM manipulation works
    try {
      document.title = 'ElevatUs - Setup Password (Debug)'
      addDebugInfo('Document title update successful')
    } catch (e) {
      addDebugInfo(`Document title update failed: ${e}`)
    }
  }
  
  addDebugInfo('=== SetupPasswordContent Rendering ===')
  addDebugInfo('Component mounted and starting initialization')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  addDebugInfo(`searchParams object: ${searchParams ? 'available' : 'null/undefined'}`)
  
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
    addDebugInfo('=== Starting useEffect ===')
    addDebugInfo('useEffect triggered by searchParams change')
    addDebugInfo(`typeof window: ${typeof window}`)
    
    // Safari Compatibility: Multiple extraction methods
    let tokenParam: string | null = null
    const extractionMethods = []
    
    // Method 1: Try searchParams if available
    try {
      if (searchParams) {
        addDebugInfo('Method 1: Trying searchParams.get("token")')
        tokenParam = searchParams.get('token')
        addDebugInfo(`Token from searchParams: ${tokenParam}`)
        extractionMethods.push('searchParams: ' + (tokenParam || 'null'))
      } else {
        addDebugInfo('Method 1: searchParams is null/undefined')
        extractionMethods.push('searchParams: unavailable')
      }
    } catch (e) {
      addDebugInfo(`Method 1 failed: ${e instanceof Error ? e.message : String(e)}`)
      extractionMethods.push('searchParams: error - ' + (e instanceof Error ? e.message : String(e)))
    }
    
    // Method 2: Direct window.location parsing
    if (!tokenParam && typeof window !== 'undefined') {
      try {
        addDebugInfo('Method 2: Trying window.location fallback')
        addDebugInfo(`window.location.href: ${window.location.href}`)
        addDebugInfo(`window.location.search: ${window.location.search}`)
        
        const urlParams = new URLSearchParams(window.location.search)
        tokenParam = urlParams.get('token')
        addDebugInfo(`Token from window.location: ${tokenParam}`)
        extractionMethods.push('window.location: ' + (tokenParam || 'null'))
      } catch (e) {
        addDebugInfo(`Method 2 failed: ${e instanceof Error ? e.message : String(e)}`)
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
          addDebugInfo(`Token from regex parsing: ${tokenParam}`)
          extractionMethods.push('regex: ' + tokenParam)
        } else {
          addDebugInfo('Method 3: No regex match found')
          extractionMethods.push('regex: no match')
        }
      } catch (e) {
        addDebugInfo(`Method 3 failed: ${e instanceof Error ? e.message : String(e)}`)
        extractionMethods.push('regex: error - ' + (e instanceof Error ? e.message : String(e)))
      }
    }
    
    addDebugInfo(`All extraction methods: ${extractionMethods.join(', ')}`)
    addDebugInfo(`Final token value: ${tokenParam}`)
    setToken(tokenParam)
    
    if (tokenParam) {
      addDebugInfo('Token found - calling validateToken')
      validateToken(tokenParam)
    } else {
      addDebugInfo('No token found - showing error state')
      setLoading(false)
      setErrors({ token: 'Invalid setup link' })
    }
  }, [searchParams])

  const validateToken = async (tokenValue: string) => {
    addDebugInfo('=== Starting Token Validation ===')
    addDebugInfo(`Validating token: ${tokenValue.substring(0, 10)}...`)
    
    try {
      const url = `/api/auth/setup-password?token=${tokenValue}`
      addDebugInfo(`API URL: ${url.substring(0, 50)}...`)
      
      const response = await fetch(url)
      addDebugInfo(`Response status: ${response.status}`)
      addDebugInfo(`Response ok: ${response.ok}`)
      
      const data = await response.json()
      addDebugInfo(`Response data keys: ${Object.keys(data).join(', ')}`)

      if (response.ok && data.valid) {
        addDebugInfo('Token is valid - proceeding to form')
        setTokenValid(data)
      } else {
        addDebugInfo(`Token validation failed: ${data.error || 'Unknown error'}`)
        setErrors({ token: data.error || 'Invalid or expired setup link' })
      }
    } catch (error) {
      addDebugInfo(`API call failed: ${error instanceof Error ? error.message : String(error)}`)
      setErrors({ token: 'Failed to validate setup link' })
    } finally {
      addDebugInfo('Token validation completed - hiding loading')
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
          {/* Production Debug Panel */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs max-w-md mx-auto">
            <details>
              <summary className="font-semibold text-blue-800 cursor-pointer">🔍 Debug Information (Click to expand)</summary>
              <div className="mt-3 space-y-2">
                {debugInfo.length > 0 ? (
                  <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
                    {debugInfo.map((info, index) => (
                      <div key={index} className="text-xs text-gray-600 border-b border-gray-100 py-1">
                        {info}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-600">No debug info available yet...</p>
                )}
                <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                  <p><strong>Current State:</strong></p>
                  <p>Token: {token ? `${token.substring(0, 15)}...` : 'None'}</p>
                  <p>Loading: {loading ? 'Yes' : 'No'}</p>
                  <p>Errors: {Object.keys(errors).length > 0 ? 'Yes' : 'No'}</p>
                  <p>Time: {new Date().toISOString()}</p>
                </div>
                {typeof window !== 'undefined' && (
                  <button 
                    onClick={() => {
                      const logs = localStorage.getItem('safari-debug')
                      if (logs) {
                        console.log('Safari Debug Logs:', JSON.parse(logs))
                        alert('Debug logs printed to console. Check developer tools.')
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    Export Logs to Console
                  </button>
                )}
              </div>
            </details>
          </div>
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
                {/* Production Debug Panel */}
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left text-xs">
                  <details>
                    <summary className="font-semibold text-red-800 cursor-pointer">🔍 Debug Information (Click to expand)</summary>
                    <div className="mt-3 space-y-2">
                      {debugInfo.length > 0 ? (
                        <div className="bg-white p-3 rounded border max-h-48 overflow-y-auto">
                          {debugInfo.map((info, index) => (
                            <div key={index} className="text-xs text-gray-600 border-b border-gray-100 py-1">
                              {info}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-red-600">No debug info available...</p>
                      )}
                      <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                        <p><strong>Error State Info:</strong></p>
                        <p>Token: {token ? `${token.substring(0, 15)}...` : 'None'}</p>
                        <p>Error: {errors.token || 'None'}</p>
                        <p>URL: {typeof window !== 'undefined' ? window.location.href.substring(0, 50) + '...' : 'N/A'}</p>
                        <p>User Agent: {typeof window !== 'undefined' ? (navigator.userAgent.includes('Safari') ? 'Safari' : 'Other') : 'N/A'}</p>
                      </div>
                      {typeof window !== 'undefined' && (
                        <button 
                          onClick={() => {
                            const logs = localStorage.getItem('safari-debug')
                            if (logs) {
                              console.log('Safari Debug Logs:', JSON.parse(logs))
                              alert('Debug logs printed to console. Check developer tools.')
                            }
                          }}
                          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Export Logs to Console
                        </button>
                      )}
                    </div>
                  </details>
                </div>
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