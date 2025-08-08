'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement actual authentication
      console.log('Login attempt:', { email, password })
      
      // For now, simulate login
      if (email === 'john.doe@company.co.za' && password === 'employee123') {
        router.push('/employee/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            Employee Portal
          </h2>
          <p className="text-secondary-600">
            Access your personal dashboard
          </p>
        </div>
        
        {/* Login Form */}
        <Card className="bg-nav-white shadow-medium">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email address
                  </label>
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
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    error={!!error}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-light-pink border border-hover-coral p-4">
                  <p className="text-sm text-secondary-900">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-middle focus:ring-brand-middle border-secondary-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-middle hover:text-hover-magenta transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center">
                <span className="text-sm text-secondary-600">
                  Are you an employer?{' '}
                  <Link href="/employer/login" className="font-medium text-brand-middle hover:text-hover-magenta transition-colors">
                    Sign in here
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="text-center">
          <div className="inline-block bg-light-yellow rounded-lg px-4 py-3">
            <p className="text-sm font-medium text-secondary-900 mb-1">Demo credentials:</p>
            <p className="text-sm font-mono text-secondary-700">john.doe@company.co.za / employee123</p>
          </div>
        </div>
      </div>
    </div>
  )
}