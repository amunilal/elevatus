import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50'
    ]

    const variants = {
      primary: 'bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium',
      secondary: 'bg-light-purple text-secondary-900 hover:bg-hover-lavender focus:ring-brand-middle border border-secondary-200',
      outline: 'border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle',
      ghost: 'text-secondary-900 hover:bg-light-purple focus:ring-brand-middle',
      destructive: 'bg-hover-coral text-white hover:bg-error-600 focus:ring-error-500',
      gradient: 'bg-brand-gradient text-white hover:bg-brand-gradient-hover focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-large'
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8'
    }

    if (asChild) {
      return (
        <span
          className={cn(baseClasses, variants[variant], sizes[size], className)}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
export default Button