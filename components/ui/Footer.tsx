import React from 'react'
import { Logo } from './Logo'
import { getVersionString } from '@/lib/version'

interface FooterProps {
  className?: string
  showLogo?: boolean
  showVersion?: boolean
}

export function Footer({ 
  className = '', 
  showLogo = true,
  showVersion = true 
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const versionString = getVersionString()

  return (
    <footer className={`bg-secondary-900 text-nav-white py-12 mt-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {showLogo && (
            <div className="flex justify-center mb-4">
              <Logo size="sm" variant="icon" />
            </div>
          )}
          <p className="text-secondary-400 text-sm">
            © {currentYear} ElevatUs. Empowering South African businesses through effective employee management.
          </p>
          {showVersion && (
            <p className="text-secondary-500 text-xs mt-2">
              {versionString}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}