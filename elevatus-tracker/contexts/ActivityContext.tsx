'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Activity {
  id: string
  type: 'employee_created' | 'employee_updated' | 'review_started' | 'review_completed'
  message: string
  timestamp: string
  user: string
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

interface ActivityProviderProps {
  children: ReactNode
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      ...activityData,
    }

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]) // Keep last 10 activities
  }, [])

  const clearActivities = useCallback(() => {
    setActivities([])
  }, [])

  const contextValue: ActivityContextType = {
    activities,
    addActivity,
    clearActivities,
  }

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}