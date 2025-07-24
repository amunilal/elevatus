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
  const [showNotes, setShowNotes] = useState(true)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId)
    }
  }, [reviewId])

  const fetchReview = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // For now, using mock data
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
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '2',
            title: 'Code review for new features',
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '3',
            title: 'Team collaboration assessment',
            dateAdded: '01/0/2025',
            status: 'todo'
          },
          {
            id: '4',
            title: 'Technical skills evaluation',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '5',
            title: 'Leadership development goals',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '6',
            title: 'Client communication review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'in_progress'
          },
          {
            id: '7',
            title: 'Performance goals Q1',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '8',
            title: 'Training completion certificate',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '9',
            title: 'Annual objectives review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'complete'
          },
          {
            id: '10',
            title: 'Salary review discussion',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          },
          {
            id: '11',
            title: 'Department restructure planning',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          },
          {
            id: '12',
            title: 'Remote work policy review',
            dateAdded: '01/0/2025',
            dateCompleted: '3 months',
            status: 'on_hold'
          }
        ]
      }
      
      setReview(mockReview)
    } catch (error) {
      console.error('Failed to fetch review:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStatus = (status: Task['status']) => {
    return review?.tasks.filter(task => task.status === status) || []
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
        return 'bg-gray-50'
      case 'in_progress':
        return 'bg-purple-50'
      case 'complete':
        return 'bg-green-50'
      case 'on_hold':
        return 'bg-yellow-50'
      default:
        return 'bg-gray-50'
    }
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.opacity = '1'
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
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
      }
      
      // TODO: Make API call to update task status
      console.log(`Task ${draggedTask.id} moved to ${newStatus}`)
    }
    
    setDraggedTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditTitle(task.title)
  }

  const handleSaveEdit = (taskId: string) => {
    if (review && editTitle.trim()) {
      const updatedTasks = review.tasks.map(task => 
        task.id === taskId 
          ? { ...task, title: editTitle.trim() }
          : task
      )
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // TODO: Make API call to update task title
      console.log(`Task ${taskId} title updated to: ${editTitle}`)
    }
    
    setEditingTask(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditTitle('')
  }

  const handleDeleteTask = (taskId: string) => {
    if (review && confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = review.tasks.filter(task => task.id !== taskId)
      
      setReview({
        ...review,
        tasks: updatedTasks
      })
      
      // TODO: Make API call to delete task
      console.log(`Task ${taskId} deleted`)
    }
  }

  const handleAddTask = (status: Task['status']) => {
    if (review) {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: 'New Task',
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
      setEditTitle(newTask.title)
      
      // TODO: Make API call to create task
      console.log(`New task created in ${status} column`)
    }
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    try {
      // TODO: Make API call to save review notes
      console.log('Saving review notes:', reviewNotes)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success feedback
      alert('Review notes saved successfully!')
      setShowNotes(false)
    } catch (error) {
      console.error('Failed to save review notes:', error)
      alert('Failed to save review notes. Please try again.')
    } finally {
      setSavingNotes(false)
    }
  }

  const handleCancelNotes = () => {
    setShowNotes(false)
    // Reset to last saved state if needed
    // setReviewNotes(review?.notes || '')
  }

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
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center space-x-2 text-secondary-700 hover:text-secondary-900"
            >
              <span>Review notes</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showNotes ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showNotes && (
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
                  <span className="font-medium">Last saved:</span> Never saved
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleCancelNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-10 px-4 py-2"
                  >
                    Cancel
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
          )}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* To Do Column */}
          <div 
            className={`${getColumnColor('todo')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">To do</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddTask('todo')}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 transition-all duration-200"
                    title="Add new task to To do"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {getTasksByStatus('todo').length}
                  </span>
                </div>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('todo').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('todo')} p-4 rounded-xl border border-secondary-200 group relative hover:shadow-md transition-all duration-200 ${
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
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
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
                            onClick={handleCancelEdit}
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
                    <p>Date completed: 3 months</p>
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
            className={`${getColumnColor('in_progress')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">In Progress</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddTask('in_progress')}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-purple-200 text-purple-600 transition-all duration-200"
                    title="Add new task to In Progress"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  </button>
                  <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {getTasksByStatus('in_progress').length}
                  </span>
                </div>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('in_progress').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('in_progress')} p-4 rounded-xl border border-purple-200 group relative hover:shadow-md transition-all duration-200 ${
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
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
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
                            onClick={handleCancelEdit}
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
                    <p>Date completed: {task.dateCompleted}</p>
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
            className={`${getColumnColor('complete')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'complete')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Complete</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddTask('complete')}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-green-200 text-green-600 transition-all duration-200"
                    title="Add new task to Complete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  </button>
                  <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {getTasksByStatus('complete').length}
                  </span>
                </div>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('complete').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('complete')} p-4 rounded-xl border border-green-200 group relative hover:shadow-md transition-all duration-200 ${
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
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
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
                            onClick={handleCancelEdit}
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
                    <p>Date completed: {task.dateCompleted}</p>
                  </div>
                </div>
              ))}
              {getTasksByStatus('complete').length === 0 && (
                <div className="text-center py-8 text-secondary-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* On Hold Column */}
          <div 
            className={`${getColumnColor('on_hold')} rounded-2xl shadow-soft transition-all duration-200 min-h-96 relative overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'on_hold')}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">On hold</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddTask('on_hold')}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-yellow-200 text-yellow-600 transition-all duration-200"
                    title="Add new task to On hold"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  </button>
                  <span className="bg-secondary-900 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {getTasksByStatus('on_hold').length}
                  </span>
                </div>
              </div>
            <div className="space-y-4">
              {getTasksByStatus('on_hold').map((task) => (
                <div 
                  key={task.id} 
                  className={`${getStatusColor('on_hold')} p-4 rounded-xl border border-yellow-200 group relative hover:shadow-md transition-all duration-200 ${
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
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="font-semibold text-secondary-900 bg-transparent border-b border-secondary-300 focus:outline-none focus:border-brand-middle px-0 py-1 flex-1 mr-2"
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
                            onClick={handleCancelEdit}
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
                    <p>Date completed: {task.dateCompleted}</p>
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
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary-300 bg-white text-secondary-900 hover:bg-light-purple hover:border-hover-lavender focus:ring-brand-middle h-12 px-6 py-3"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task to To do
          </button>
          <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-middle text-white hover:bg-hover-magenta focus:ring-brand-middle transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium h-12 px-6 py-3">
            Complete Review
          </button>
        </div>
      </div>
    </div>
  )
}