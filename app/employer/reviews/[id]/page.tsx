'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Logo } from '@/components/ui/Logo'
import { useParams } from 'next/navigation'

interface Task {
  id: string
  title: string
  dateAdded: string
  dateCompleted?: string
  status: 'todo' | 'in_progress' | 'complete' | 'on_hold'
  archived?: boolean
}

interface SavedNote {
  id: string
  content: string
  timestamp: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  designation: string
  department: string
}

interface Review {
  id: string
  employee: Employee
  date: string
  tasks: Task[]
}

export default function ReviewPage() {
  const params = useParams()
  const reviewId = params?.id as string
  
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDateCompleted, setEditDateCompleted] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [completingReview, setCompletingReview] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [incompleteTasksCount, setIncompleteTasksCount] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [taskToArchive, setTaskToArchive] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId)
    }
  }, [reviewId])

  const fetchReview = async (id: string) => {
    try {
      // Try to fetch real review data from API
      const reviewResponse = await fetch(`/api/reviews/${id}`)
      
      if (reviewResponse.ok) {
        const reviewData = await reviewResponse.json()
        
        // Convert API data to our Review interface format
        const apiReview: Review = {
          id: reviewData.id,
          employee: {
            id: reviewData.employee.id,
            firstName: reviewData.employee.firstName,
            lastName: reviewData.employee.lastName,
            designation: reviewData.employee.designation,
            department: reviewData.employee.department
          },
          date: new Date(reviewData.createdAt).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
          }),
          tasks: reviewData.goals?.map((goal: any) => ({
            id: goal.id,
            title: goal.title,
            dateAdded: new Date(goal.createdAt).toLocaleDateString('en-ZA'),
            dateCompleted: goal.targetDate ? '3 months' : undefined,
            status: goal.status === 'NOT_STARTED' ? 'todo' as const :
                   goal.status === 'IN_PROGRESS' ? 'in_progress' as const :
                   goal.status === 'COMPLETED' ? 'complete' as const : 'on_hold' as const
          })) || []
        }
        
        setReview(apiReview)
        
        // Fetch existing notes
        const notesResponse = await fetch(`/api/reviews/${id}/notes`)
        if (notesResponse.ok) {
          const notesData = await notesResponse.json()
          setSavedNotes(notesData.notes || [])
        }
        
      } else {
        // Fallback to mock data if API fails
        console.warn('API call failed, using mock data')
        const mockReview: Review = {
          id: id,
          employee: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            designation: 'Senior Developer',
            department: 'Engineering'
          },
          date: '1 January 2025',
          tasks: [
            {
              id: '1',
              title: 'Complete project documentation',
              dateAdded: '01/01/2025',
              status: 'todo'
            },
            {
              id: '2',
              title: 'Code review for new features',
              dateAdded: '01/01/2025',
              status: 'todo'
            },
            {
              id: '3',
              title: 'Team collaboration assessment',
              dateAdded: '01/01/2025',
              status: 'todo'
            },
            {
              id: '4',
              title: 'Technical skills evaluation',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'in_progress'
            },
            {
              id: '5',
              title: 'Leadership development goals',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'in_progress'
            },
            {
              id: '6',
              title: 'Client communication review',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'in_progress'
            },
            {
              id: '7',
              title: 'Performance goals Q1',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'complete'
            },
            {
              id: '8',
              title: 'Training completion certificate',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'complete'
            },
            {
              id: '9',
              title: 'Annual objectives review',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'complete'
            },
            {
              id: '10',
              title: 'Salary review discussion',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'on_hold'
            },
            {
              id: '11',
              title: 'Department restructure planning',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'on_hold'
            },
            {
              id: '12',
              title: 'Remote work policy review',
              dateAdded: '01/01/2025',
              dateCompleted: '3 months',
              status: 'on_hold'
            }
          ]
        }
        
        setReview(mockReview)
      }
    } catch (error) {
      console.error('Failed to fetch review:', error)
      // Use mock data as fallback
      const mockReview: Review = {
        id: id,
        employee: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          designation: 'Senior Developer',
          department: 'Engineering'
        },
        date: '1 January 2025',
        tasks: []
      }
      setReview(mockReview)
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStatus = (status: Task['status']) => {
    if (status === 'complete') {
      // For complete tasks, filter by archived status based on showArchived toggle
      return review?.tasks.filter(task => 
        task.status === status && (showArchived ? task.archived === true : !task.archived)
      ) || []
    }
    // For other statuses, just filter by status (archived doesn't apply)
    return review?.tasks.filter(task => task.status === status && !task.archived) || []
  }

  const getArchivedTasksCount = () => {
    return review?.tasks.filter(task => task.status === 'complete' && task.archived === true).length || 0
  }

  const getActiveCompleteTasksCount = () => {
    return review?.tasks.filter(task => task.status === 'complete' && !task.archived).length || 0
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100'
      case 'in_progress':
        return 'bg-purple-100'
      case 'complete':
        return 'bg-green-100'
      case 'on_hold':
        return 'bg-yellow-100'
      default:
        return 'bg-gray-100'
    }
  }

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-white'
      case 'in_progress':
        return 'bg-white'
      case 'complete':
        return 'bg-white'
      case 'on_hold':
        return 'bg-white'
      default:
        return 'bg-white'
    }
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', (e.currentTarget as HTMLElement).outerHTML)
    ;(e.currentTarget as HTMLElement).style.opacity = '0.5'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1'
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault()
    
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update the task status
      const updatedTasks = review?.tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus, dateCompleted: newStatus === 'complete' ? '3 months' : task.dateCompleted }
          : task
      ) || []
      
      if (review) {
        setReview({
          ...review,
          tasks: updatedTasks
        })

        // Save the task status update to the database
        await saveTaskStatusUpdate(draggedTask.id, newStatus)
      }
      
      console.log(`Task ${draggedTask.id} moved to ${newStatus}`)
    }
    
    setDraggedTask(null)
  }

  const saveTaskStatusUpdate = async (taskId: string, newStatus: Task['status']) => {
    try {
      // Map UI status to database status
      const dbStatus = newStatus === 'todo' ? 'NOT_STARTED' :
                      newStatus === 'in_progress' ? 'IN_PROGRESS' :
                      newStatus === 'complete' ? 'COMPLETED' : 'ON_HOLD'

      const response = await fetch(`/api/goals/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: dbStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to update task status:', errorData.error)
        // You could show a toast notification here
        return
      }

      const data = await response.json()
      console.log('Task status updated successfully:', data.message)
    } catch (error) {
      console.error('Error updating task status:', error)
      // You could show a toast notification here
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditTitle(task.title)
    setEditDateCompleted(task.dateCompleted || '')
  }

  const handleSaveEdit = async (taskId: string) => {
    if (review && editTitle.trim()) {
      const updatedTasks = review.tasks.map(task => 
        task.id === taskId 
          ? { ...task, title: editTitle.trim(), dateCompleted: editDateCompleted.trim() || undefined }
          : task
      )
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // Save to database - check if this is a new task or existing task
      if (taskId.startsWith('task_')) {
        // This is a new task, create it in the database
        await createNewTask(taskId, editTitle.trim())
      } else {
        // This is an existing task, update it
        await updateTask(taskId, editTitle.trim())
      }
    }
    
    setEditingTask(null)
    setEditTitle('')
    setEditDateCompleted('')
  }

  const createNewTask = async (tempId: string, title: string) => {
    if (!review) return

    try {
      // Map UI status to database status
      const task = review.tasks.find(t => t.id === tempId)
      if (!task) return

      const dbStatus = task.status === 'todo' ? 'NOT_STARTED' :
                      task.status === 'in_progress' ? 'IN_PROGRESS' :
                      task.status === 'complete' ? 'COMPLETED' : 'ON_HOLD'

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: review.id,
          title: title,
          status: dbStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to create task:', errorData.error)
        return
      }

      const data = await response.json()
      
      // Update the task with the real database ID
      const updatedTasks = review.tasks.map(t => 
        t.id === tempId ? { ...t, id: data.goal.id } : t
      )
      
      setReview({
        ...review,
        tasks: updatedTasks
      })

      console.log('Task created successfully:', data.message)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTask = async (taskId: string, title: string) => {
    try {
      const response = await fetch(`/api/goals/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to update task:', errorData.error)
        return
      }

      const data = await response.json()
      console.log('Task updated successfully:', data.message)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleCancelEdit = (taskId?: string) => {
    // If task is being cancelled and has empty title, delete it
    if (taskId && review && editTitle.trim() === '') {
      const taskToCheck = review.tasks.find(task => task.id === taskId)
      if (taskToCheck && taskToCheck.title === '') {
        // This is a new task with no content, delete it
        const updatedTasks = review.tasks.filter(task => task.id !== taskId)
        setReview({
          ...review,
          tasks: updatedTasks
        })
      }
    }
    
    setEditingTask(null)
    setEditTitle('')
    setEditDateCompleted('')
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteTask = async () => {
    if (review && taskToDelete) {
      const updatedTasks = review.tasks.filter(task => task.id !== taskToDelete)
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // Delete task from database
      await deleteTask(taskToDelete)
    }
    setShowDeleteDialog(false)
    setTaskToDelete(null)
  }

  const cancelDeleteTask = () => {
    setShowDeleteDialog(false)
    setTaskToDelete(null)
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/goals/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to delete task:', errorData.error)
        return
      }

      const data = await response.json()
      console.log('Task deleted successfully:', data.message)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleAddTask = async (status: Task['status']) => {
    if (review) {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: '',
        dateAdded: new Date().toLocaleDateString('en-ZA').replace(/\//g, '/'),
        status: status,
        dateCompleted: status === 'complete' ? '3 months' : undefined
      }
      
      setReview({
        ...review,
        tasks: [...review.tasks, newTask]
      })
      
      // Automatically start editing the new task
      setEditingTask(newTask.id)
      setEditTitle('')
      setEditDateCompleted('')
      
      console.log(`New task created in ${status} column`)
    }
  }

  const handleArchiveTask = (taskId: string) => {
    setTaskToArchive(taskId)
    setShowArchiveDialog(true)
  }

  const confirmArchiveTask = () => {
    if (review && taskToArchive) {
      const updatedTasks = review.tasks.map(task => 
        task.id === taskToArchive ? { ...task, archived: true } : task
      )
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // TODO: Make API call to archive task
      console.log(`Task ${taskToArchive} archived`)
    }
    setShowArchiveDialog(false)
    setTaskToArchive(null)
  }

  const cancelArchiveTask = () => {
    setShowArchiveDialog(false)
    setTaskToArchive(null)
  }

  const handleUnarchiveTask = (taskId: string) => {
    if (review) {
      const updatedTasks = review.tasks.map(task => 
        task.id === taskId ? { ...task, archived: false } : task
      )
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // TODO: Make API call to unarchive task
      console.log(`Task ${taskId} unarchived`)
    }
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    try {
      // Make API call to save review notes
      const response = await fetch(`/api/reviews/${reviewId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: reviewNotes,
          noteType: 'general'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save review notes')
      }

      const data = await response.json()
      
      // Success feedback and add new note to array
      const newNote: SavedNote = {
        id: data.note.id,
        content: data.note.content,
        timestamp: data.note.createdAt
      }
      setSavedNotes(prev => [...prev, newNote])
      setReviewNotes('') // Clear the form after saving
      
      console.log('Review notes saved successfully:', data.message)
    } catch (error) {
      console.error('Failed to save review notes:', error)
      setErrorMessage(`Failed to save review notes: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setShowErrorDialog(true)
    } finally {
      setSavingNotes(false)
    }
  }

  const handleCompleteReview = () => {
    if (!review) return

    // Check if there are any incomplete tasks
    const incompleteTasks = review.tasks.filter(task => 
      task.status !== 'complete' && !task.archived
    )

    setIncompleteTasksCount(incompleteTasks.length)
    setShowCompleteDialog(true)
  }

  const confirmCompleteReview = async () => {
    setShowCompleteDialog(false)
    setCompletingReview(true)
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to complete review:', errorData.error || 'Failed to complete review')
        return
      }

      const data = await response.json()
      
      // Update local state
      setReview(prev => prev ? { ...prev, status: 'complete' as any } : null)
      
      // Redirect to review history
      window.location.href = '/employer/reviews/history'
      
    } catch (error) {
      console.error('Failed to complete review:', error)
    } finally {
      setCompletingReview(false)
    }
  }

  const cancelCompleteReview = () => {
    setShowCompleteDialog(false)
    setIncompleteTasksCount(0)
  }

  // Function removed - no longer needed as notes are not collapsible

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base">
        {/* Header */}
        <div className="bg-nav-white px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <Badge variant="purple" size="sm">Employer Portal</Badge>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-secondary-600">User</span>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('user')
                    sessionStorage.clear()
                    window.location.href = '/employer/login'
                  }
                }}
                className="text-sm text-hover-magenta hover:text-brand-middle font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-nav-white rounded-2xl shadow-soft p-6 h-96">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-bg-base">
        {/* Header */}
        <div className="bg-nav-white px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <Badge variant="purple" size="sm">Employer Portal</Badge>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-secondary-600">User</span>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('user')
                    sessionStorage.clear()
                    window.location.href = '/employer/login'
                  }
                }}
                className="text-sm text-hover-magenta hover:text-brand-middle font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Review Not Found</h1>
          <p className="text-secondary-600 mb-6">The requested review could not be found.</p>
          <Link
            href="/employer/reviews/start"
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
          >
            Back to Reviews
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="bg-nav-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <Badge variant="purple" size="sm">Employer Portal</Badge>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-secondary-600">admin@company.co.za</span>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('user')
                  sessionStorage.clear()
                  window.location.href = '/employer/login'
                }
              }}
              className="text-sm text-hover-magenta hover:text-brand-middle font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Employee Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-secondary-900">
              {review.employee.firstName} {review.employee.lastName}
            </h1>
            <Link
              href="/employer/reviews/start"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
            >
              Back to Reviews
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <p className="text-lg text-secondary-700">Date: {review.date}</p>
            <span className="text-lg font-medium text-secondary-900">Review Notes</span>
          </div>

          {/* Review Notes Form */}
          <div className="bg-light-blue border border-brand-middle/20 rounded-2xl p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add detailed review notes, feedback, goals, and observations here..."
                  className="w-full h-32 p-4 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-middle focus:border-transparent resize-none transition-all duration-200"
                  disabled={savingNotes}
                />
                <p className="text-xs text-secondary-500 mt-2">
                  {reviewNotes.length} characters • Use this space for performance feedback, development goals, and review summaries
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-secondary-600">
                  <span className="font-medium">{savedNotes.length} notes saved</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setReviewNotes('')}
                    disabled={savingNotes}
                    className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleSaveNotes}
                    disabled={savingNotes || reviewNotes.trim().length === 0}
                    className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-10 px-4 py-2"
                  >
                    {savingNotes ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Notes'
                    )}
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* Saved Notes Display */}
        {savedNotes.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-secondary-600 mb-3">Previous Notes ({savedNotes.length})</h4>
            <div className="flex flex-wrap gap-3">
              {savedNotes.map((note) => (
                <div key={note.id} className="bg-white border border-brand-middle/20 rounded-2xl p-4 group relative inline-block">
                  <div className="flex items-center">
                    <div className="text-sm text-secondary-700 whitespace-pre-wrap pr-8">
                      {note.content}
                    </div>
                    <button
                      onClick={() => {
                        setSavedNotes(prev => prev.filter(n => n.id !== note.id))
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary-400 hover:text-red-500 ml-2"
                      title="Delete this note"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear floated notes */}
        <div className="clear-both"></div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{paddingTop: '30px'}}>
          {/* To Do Column */}
          <div 
            className={`${getColumnColor('todo')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-visible`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <span className="absolute bg-white text-black text-sm font-semibold px-3 py-1 z-10" style={{borderRadius: '9px', top: '-20px', right: '12px'}}>
              {getTasksByStatus('todo').length}
            </span>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-secondary-900">To do</h2>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('todo').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('todo')} p-4 rounded-xl border-2 border-gray-200 group relative hover:shadow-md transition-all duration-200 ${
                    editingTask === task.id ? 'cursor-default' : 'cursor-move hover:-translate-y-1'
                  }`}
                  draggable={editingTask !== task.id}
                  onDragStart={(e) => editingTask !== task.id && handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id)
                          if (e.key === 'Escape') handleCancelEdit(task.id)
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
                        placeholder="Enter task title..."
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-secondary-900">{task.title}</h3>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      {editingTask === task.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-success-100 text-success-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCancelEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-error-100 text-error-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-100 text-blue-600 transition-all duration-200"
                            title="Edit task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 text-red-600 transition-all duration-200"
                            title="Delete task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    {editingTask === task.id ? (
                      <div className="flex items-center">
                        <span className="mr-2">Duration:</span>
                        <input
                          type="text"
                          value={editDateCompleted}
                          onChange={(e) => setEditDateCompleted(e.target.value)}
                          className="bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-1 py-0 text-sm flex-1"
                          placeholder="e.g. 3 months, 2 weeks..."
                        />
                      </div>
                    ) : (
                      <p>Duration: {task.dateCompleted || 'Not set'}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTasksByStatus('todo').length === 0 && (
                <div className="text-center py-8 text-secondary-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div 
            className={`${getColumnColor('in_progress')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-visible`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <span className="absolute bg-white text-black text-sm font-semibold px-3 py-1 z-10" style={{borderRadius: '9px', top: '-20px', right: '12px'}}>
              {getTasksByStatus('in_progress').length}
            </span>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-secondary-900">In Progress</h2>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('in_progress').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('in_progress')} p-4 rounded-xl border-2 border-purple-200 group relative hover:shadow-md transition-all duration-200 ${
                    editingTask === task.id ? 'cursor-default' : 'cursor-move hover:-translate-y-1'
                  }`}
                  draggable={editingTask !== task.id}
                  onDragStart={(e) => editingTask !== task.id && handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id)
                          if (e.key === 'Escape') handleCancelEdit(task.id)
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
                        placeholder="Enter task title..."
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-secondary-900">{task.title}</h3>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      {editingTask === task.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-success-100 text-success-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCancelEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-error-100 text-error-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-100 text-blue-600 transition-all duration-200"
                            title="Edit task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 text-red-600 transition-all duration-200"
                            title="Delete task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    {editingTask === task.id ? (
                      <div className="flex items-center">
                        <span className="mr-2">Duration:</span>
                        <input
                          type="text"
                          value={editDateCompleted}
                          onChange={(e) => setEditDateCompleted(e.target.value)}
                          className="bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-1 py-0 text-sm flex-1"
                          placeholder="e.g. 3 months, 2 weeks..."
                        />
                      </div>
                    ) : (
                      <p>Duration: {task.dateCompleted || 'Not set'}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTasksByStatus('in_progress').length === 0 && (
                <div className="text-center py-8 text-secondary-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Complete Column */}
          <div 
            className={`${getColumnColor('complete')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-visible`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'complete')}
          >
            <span className="absolute bg-white text-black text-sm font-semibold px-3 py-1 z-10" style={{borderRadius: '9px', top: '-20px', right: '12px'}}>
              {showArchived ? getArchivedTasksCount() : getActiveCompleteTasksCount()}
            </span>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-secondary-900">Complete</h2>
                  {getArchivedTasksCount() > 0 && (
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                        showArchived 
                          ? 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      title={showArchived ? 'Show active tasks' : 'Show archived tasks'}
                    >
                      {showArchived ? `Archived (${getArchivedTasksCount()})` : `Archive (${getArchivedTasksCount()})`}
                    </button>
                  )}
                </div>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('complete').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('complete')} p-4 rounded-xl border-2 border-green-200 group relative hover:shadow-md transition-all duration-200 ${
                    editingTask === task.id ? 'cursor-default' : 'cursor-move hover:-translate-y-1'
                  } ${task.archived ? 'opacity-75' : ''}`}
                  draggable={editingTask !== task.id && !task.archived}
                  onDragStart={(e) => editingTask !== task.id && !task.archived && handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id)
                          if (e.key === 'Escape') handleCancelEdit(task.id)
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
                        placeholder="Enter task title..."
                        autoFocus
                      />
                    ) : (
                      <h3 className={`font-semibold text-secondary-900 ${task.archived ? 'line-through' : ''}`}>{task.title}</h3>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      {editingTask === task.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-success-100 text-success-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCancelEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-error-100 text-error-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          {!showArchived ? (
                            <button
                              onClick={() => handleArchiveTask(task.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-100 text-orange-600 transition-all duration-200"
                              title="Archive task"
                            >
                              <svg className="w-5 h-5" style={{transform: 'scale(1.1)'}} fill="currentColor" viewBox="0 0 370 570">
                                <path d="M185.3,129.6c34.4,0,68.7,0,103.1.1,4.2,0,8.6.8,12.4,2.4,10.8,4.5,15.9,13.6,16.6,24.8.6,11,.3,22.1,0,33.1-.2,10.4-5.1,18.5-14.2,23.7-3.4,2-4.7,4.2-4.7,8.2.2,44.7,0,89.3.2,134,0,13.4-10.1,26.9-21.4,29.2-3,.6-6.2,1-9.3,1-55,0-110.1,0-165.1,0-3.1,0-6.2-.4-9.3-1-11.1-2.1-21.7-15.7-21.6-29.1.3-44.8,0-89.6.2-134.4,0-3.9-1.2-6.1-4.5-7.9-9.4-5.3-14.2-13.6-14.4-24.3-.2-10.5-.3-21.1,0-31.6.4-15.4,11.9-28.3,28.5-28.2,34.5,0,69,0,103.5,0ZM90.8,218.5c0,1.5,0,2.7,0,3.8,0,44,0,88.1,0,132.1,0,8.8,3.4,12.2,12.3,12.2,54.9,0,109.9,0,164.8,0,8.6,0,12-3.5,12-12.1,0-44,0-88.1,0-132.1,0-1.3,0-2.6,0-3.9H90.8ZM185.8,149.1c-34.5,0-69,0-103.4,0-6.9,0-10.4,3.5-10.4,10.4,0,9.4,0,18.8,0,28.2,0,7.2,4.1,11.2,11.1,11.2,68.2,0,136.4,0,204.6,0,7.1,0,11.1-4,11.2-11.1,0-9.2,0-18.3,0-27.5,0-7.9-3.3-11.2-11.1-11.2-34,0-68,0-101.9,0Z"/>
                                <path d="M185.3,247.7c9.1,0,18.3.2,27.4,0,6.8-.2,9.7,4.3,10.2,10,.4,5-4,9.4-9.7,9.4-18.7.2-37.3.2-56,0-5.6,0-10.1-4.5-9.7-9.4.5-5.7,3.4-10.2,10.2-10,9.1.2,18.3,0,27.4,0Z"/>
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnarchiveTask(task.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-green-100 text-green-600 transition-all duration-200"
                              title="Unarchive task"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3 3 3M7 8l3 3 3-3" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    {editingTask === task.id ? (
                      <div className="flex items-center">
                        <span className="mr-2">Duration:</span>
                        <input
                          type="text"
                          value={editDateCompleted}
                          onChange={(e) => setEditDateCompleted(e.target.value)}
                          className="bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-1 py-0 text-sm flex-1"
                          placeholder="e.g. 3 months, 2 weeks..."
                        />
                      </div>
                    ) : (
                      <p>Duration: {task.dateCompleted || 'Not set'}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTasksByStatus('complete').length === 0 && (
                <div className="text-center py-8 text-secondary-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* On Hold Column */}
          <div 
            className={`${getColumnColor('on_hold')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-visible`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'on_hold')}
          >
            <span className="absolute bg-white text-black text-sm font-semibold px-3 py-1 z-10" style={{borderRadius: '9px', top: '-20px', right: '12px'}}>
              {getTasksByStatus('on_hold').length}
            </span>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-secondary-900">On hold</h2>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('on_hold').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('on_hold')} p-4 rounded-xl border-2 border-yellow-200 group relative hover:shadow-md transition-all duration-200 ${
                    editingTask === task.id ? 'cursor-default' : 'cursor-move hover:-translate-y-1'
                  }`}
                  draggable={editingTask !== task.id}
                  onDragStart={(e) => editingTask !== task.id && handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id)
                          if (e.key === 'Escape') handleCancelEdit(task.id)
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
                        placeholder="Enter task title..."
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-secondary-900">{task.title}</h3>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      {editingTask === task.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-success-100 text-success-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCancelEdit(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-error-100 text-error-600"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-blue-100 text-blue-600 transition-all duration-200"
                            title="Edit task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 text-red-600 transition-all duration-200"
                            title="Delete task"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Date added: {task.dateAdded}</p>
                    {editingTask === task.id ? (
                      <div className="flex items-center">
                        <span className="mr-2">Duration:</span>
                        <input
                          type="text"
                          value={editDateCompleted}
                          onChange={(e) => setEditDateCompleted(e.target.value)}
                          className="bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-1 py-0 text-sm flex-1"
                          placeholder="e.g. 3 months, 2 weeks..."
                        />
                      </div>
                    ) : (
                      <p>Duration: {task.dateCompleted || 'Not set'}</p>
                    )}
                  </div>
                </div>
              ))}
              {getTasksByStatus('on_hold').length === 0 && (
                <div className="text-center py-8 text-secondary-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            onClick={() => handleAddTask('todo')}
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 focus:ring-brand-middle h-12 px-6 py-3"
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(238, 125, 189, 0.1)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'white'}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </button>
          {review && (review as any).status !== 'COMPLETED' ? (
            <button 
              onClick={handleCompleteReview}
              disabled={completingReview}
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-12 px-6 py-3"
            >
              {completingReview ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Review
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center justify-center rounded-lg font-medium h-12 px-6 py-3 bg-green-100 text-green-800 border border-green-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Review Completed
            </div>
          )}
        </div>
      </div>

      {/* Complete Review Confirmation Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Complete Review</h3>
            </div>
            
            <div className="mb-6">
              {incompleteTasksCount > 0 ? (
                <div className="mb-4">
                  <p className="text-secondary-700 mb-2">
                    There are <span className="font-semibold text-orange-600">{incompleteTasksCount} incomplete tasks</span>.
                  </p>
                  <p className="text-secondary-600 text-sm">
                    You can still complete this review, but consider finishing outstanding tasks first.
                  </p>
                </div>
              ) : (
                <p className="text-secondary-700 mb-2">
                  All tasks have been completed. Ready to finalize this review.
                </p>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Important:</span> Once completed, this review cannot be edited. Make sure all information is accurate.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelCompleteReview}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-secondary-300 bg-white text-secondary-900 hover:bg-secondary-50 focus:ring-secondary-500 h-12 px-6 py-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmCompleteReview}
                disabled={completingReview}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle h-12 px-6 py-3"
              >
                {completingReview ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="leading-tight">Completing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-tight">Complete<br />Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Delete Task</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-700 mb-2">
                Are you sure you want to delete this task?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">Warning:</span> This action cannot be undone. The task will be permanently removed.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteTask}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-secondary-300 bg-white text-secondary-900 hover:bg-secondary-50 focus:ring-secondary-500 h-12 px-6 py-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 h-12 px-6 py-3"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Task Confirmation Dialog */}
      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 370 570">
                  <path d="M185.3,129.6c34.4,0,68.7,0,103.1.1,4.2,0,8.6.8,12.4,2.4,10.8,4.5,15.9,13.6,16.6,24.8.6,11,.3,22.1,0,33.1-.2,10.4-5.1,18.5-14.2,23.7-3.4,2-4.7,4.2-4.7,8.2.2,44.7,0,89.3.2,134,0,13.4-10.1,26.9-21.4,29.2-3,.6-6.2,1-9.3,1-55,0-110.1,0-165.1,0-3.1,0-6.2-.4-9.3-1-11.1-2.1-21.7-15.7-21.6-29.1.3-44.8,0-89.6.2-134.4,0-3.9-1.2-6.1-4.5-7.9-9.4-5.3-14.2-13.6-14.4-24.3-.2-10.5-.3-21.1,0-31.6.4-15.4,11.9-28.3,28.5-28.2,34.5,0,69,0,103.5,0ZM90.8,218.5c0,1.5,0,2.7,0,3.8,0,44,0,88.1,0,132.1,0,8.8,3.4,12.2,12.3,12.2,54.9,0,109.9,0,164.8,0,8.6,0,12-3.5,12-12.1,0-44,0-88.1,0-132.1,0-1.3,0-2.6,0-3.9H90.8ZM185.8,149.1c-34.5,0-69,0-103.4,0-6.9,0-10.4,3.5-10.4,10.4,0,9.4,0,18.8,0,28.2,0,7.2,4.1,11.2,11.1,11.2,68.2,0,136.4,0,204.6,0,7.1,0,11.1-4,11.2-11.1,0-9.2,0-18.3,0-27.5,0-7.9-3.3-11.2-11.1-11.2-34,0-68,0-101.9,0Z"/>
                  <path d="M185.3,247.7c9.1,0,18.3.2,27.4,0,6.8-.2,9.7,4.3,10.2,10,.4,5-4,9.4-9.7,9.4-18.7.2-37.3.2-56,0-5.6,0-10.1-4.5-9.7-9.4.5-5.7,3.4-10.2,10.2-10,9.1.2,18.3,0,27.4,0Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Archive Task</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-700 mb-2">
                Are you sure you want to archive this completed task?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> Archived tasks can be restored later and will be hidden from the main view.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelArchiveTask}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-secondary-300 bg-white text-secondary-900 hover:bg-secondary-50 focus:ring-secondary-500 h-12 px-6 py-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchiveTask}
                className="flex-1 inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 h-12 px-6 py-3"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 370 570">
                  <path d="M185.3,129.6c34.4,0,68.7,0,103.1.1,4.2,0,8.6.8,12.4,2.4,10.8,4.5,15.9,13.6,16.6,24.8.6,11,.3,22.1,0,33.1-.2,10.4-5.1,18.5-14.2,23.7-3.4,2-4.7,4.2-4.7,8.2.2,44.7,0,89.3.2,134,0,13.4-10.1,26.9-21.4,29.2-3,.6-6.2,1-9.3,1-55,0-110.1,0-165.1,0-3.1,0-6.2-.4-9.3-1-11.1-2.1-21.7-15.7-21.6-29.1.3-44.8,0-89.6.2-134.4,0-3.9-1.2-6.1-4.5-7.9-9.4-5.3-14.2-13.6-14.4-24.3-.2-10.5-.3-21.1,0-31.6.4-15.4,11.9-28.3,28.5-28.2,34.5,0,69,0,103.5,0ZM90.8,218.5c0,1.5,0,2.7,0,3.8,0,44,0,88.1,0,132.1,0,8.8,3.4,12.2,12.3,12.2,54.9,0,109.9,0,164.8,0,8.6,0,12-3.5,12-12.1,0-44,0-88.1,0-132.1,0-1.3,0-2.6,0-3.9H90.8ZM185.8,149.1c-34.5,0-69,0-103.4,0-6.9,0-10.4,3.5-10.4,10.4,0,9.4,0,18.8,0,28.2,0,7.2,4.1,11.2,11.1,11.2,68.2,0,136.4,0,204.6,0,7.1,0,11.1-4,11.2-11.1,0-9.2,0-18.3,0-27.5,0-7.9-3.3-11.2-11.1-11.2-34,0-68,0-101.9,0Z"/>
                  <path d="M185.3,247.7c9.1,0,18.3.2,27.4,0,6.8-.2,9.7,4.3,10.2,10,.4,5-4,9.4-9.7,9.4-18.7.2-37.3.2-56,0-5.6,0-10.1-4.5-9.7-9.4.5-5.7,3.4-10.2,10.2-10,9.1.2,18.3,0,27.4,0Z"/>
                </svg>
                Archive Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Error</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-700">
                {errorMessage}
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowErrorDialog(false)
                  setErrorMessage('')
                }}
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle h-12 px-6 py-3"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}