import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'mint' | 'yellow' | 'pink' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-middle focus:ring-offset-2'
    ]

    const variants = {
      default: 'border-transparent bg-secondary-900 text-secondary-50 hover:bg-secondary-900/80',
      primary: 'border-transparent bg-brand-middle text-white hover:bg-hover-magenta',
      secondary: 'border-transparent bg-light-purple text-secondary-900 hover:bg-hover-lavender',
      success: 'border-transparent bg-light-green text-secondary-900 hover:bg-hover-lime',
      warning: 'border-transparent bg-light-yellow text-secondary-900 hover:bg-hover-gold',
      error: 'border-transparent bg-hover-coral text-white hover:bg-error-600',
      outline: 'border-secondary-300 text-secondary-900 hover:bg-light-purple',
      mint: 'border-transparent bg-light-mint text-secondary-900 hover:bg-hover-aqua',
      yellow: 'border-transparent bg-light-yellow text-secondary-900 hover:bg-hover-gold',
      pink: 'border-transparent bg-light-pink text-secondary-900 hover:bg-hover-magenta',
      purple: 'border-transparent bg-light-purple text-secondary-900 hover:bg-hover-lavender'
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm'
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
export default Badge