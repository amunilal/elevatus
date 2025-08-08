'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer, ToastMessage } from '@/components/ui/Toast'

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
  position?: ToastMessage['position']
  maxToasts?: number
}

export function ToastProvider({ 
  children, 
  position = 'top-right', 
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    
    const newToast: ToastMessage = {
      id,
      duration: 4000, // Default 4 seconds
      position,
      ...toastData,
    }

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast]
      // Limit the number of toasts
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(-maxToasts)
      }
      return updatedToasts
    })
  }, [position, maxToasts])

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const dismissAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const contextValue: ToastContextType = {
    showToast,
    dismissToast,
    dismissAllToasts,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={dismissToast} 
        position={position}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}