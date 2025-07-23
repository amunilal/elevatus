import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled'
  inputSize?: 'sm' | 'md' | 'lg'
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    variant = 'default', 
    inputSize = 'md', 
    error = false, 
    leftIcon, 
    rightIcon, 
    ...props 
  }, ref) => {
    const baseClasses = [
      'flex w-full rounded-lg border bg-nav-white transition-all duration-200',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-secondary-500',
      'focus:outline-none focus:ring-2 focus:ring-brand-middle focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ]

    const variants = {
      default: error 
        ? 'border-hover-coral focus:border-hover-coral focus:ring-hover-coral' 
        : 'border-secondary-300 focus:border-brand-middle hover:border-secondary-400',
      filled: error
        ? 'border-hover-coral bg-light-pink focus:border-hover-coral focus:ring-hover-coral'
        : 'border-secondary-200 bg-light-purple focus:border-brand-middle hover:bg-hover-lavender'
    }

    const sizes = {
      sm: 'h-8 px-3 py-1 text-sm',
      md: 'h-10 px-3 py-2 text-sm',
      lg: 'h-11 px-4 py-2 text-base'
    }

    const hasIcons = leftIcon || rightIcon

    if (hasIcons) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(baseClasses, variants[variant], sizes[inputSize], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
export default Input