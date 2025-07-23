import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'filled'
  selectSize?: 'sm' | 'md' | 'lg'
  error?: boolean
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant = 'default', 
    selectSize = 'md', 
    error = false,
    placeholder,
    children,
    ...props 
  }, ref) => {
    const baseClasses = [
      'flex w-full rounded-lg border bg-nav-white pr-8 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-brand-middle focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'appearance-none bg-no-repeat',
      'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
      'bg-[position:right_0.5rem_center] bg-[size:1.5em_1.5em]'
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

    return (
      <select
        className={cn(baseClasses, variants[variant], sizes[selectSize], className)}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export { Select }
export default Select