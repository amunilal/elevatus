'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AttendanceBulkPage() {
  const [activeTab, setActiveTab] = useState('import')
  const [file, setFile] = useState<File | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleBulkAction = () => {
    // TODO: Implement bulk action functionality
    alert('Bulk action functionality will be implemented with backend integration')
  }

  const employees = [
    { id: '1', name: 'John Doe', department: 'Engineering', status: 'Active' },
    { id: '2', name: 'Jane Smith', department: 'Sales', status: 'Active' },
    { id: '3', name: 'Mike Johnson', department: 'Marketing', status: 'Active' },
    { id: '4', name: 'Sarah Wilson', department: 'HR', status: 'Active' },
    { id: '5', name: 'David Brown', department: 'Finance', status: 'Active' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Attendance Operations</h1>
            <p className="text-gray-600 mt-2">Import/export attendance data and perform bulk actions</p>
          </div>
          <Link
            href="/employer/attendance"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Attendance
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'import'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Import Attendance
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bulk'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bulk Actions
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates
            </button>
          </div>

          <div className="p-6">
            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Attendance Data</h2>
                  <p className="text-gray-600 mb-6">
                    Upload attendance records from CSV or Excel files. Ensure your file follows the required format.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {file ? file.name : 'Click to upload or drag and drop'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">CSV, XLSX up to 10MB</span>
                      </label>
                    </div>
                  </div>

                  {/* Import Options */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Import Options</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Skip duplicate entries</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Update existing records</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Send notifications to employees</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Validate against working hours</span>
                      </label>
                    </div>

                    <button
                      onClick={handleBulkAction}
                      disabled={!file}
                      className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Import Attendance Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions Tab */}
            {activeTab === 'bulk' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Actions</h2>
                  <p className="text-gray-600 mb-6">
                    Perform actions on multiple employees at once. Select employees and choose an action.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Employee Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Employees</h3>
                    <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                      <div className="p-3 border-b">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees(employees.map(emp => emp.id))
                              } else {
                                setSelectedEmployees([])
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                        </label>
                      </div>
                      {employees.map((employee) => (
                        <div key={employee.id} className="p-3 border-b last:border-b-0">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmployees([...selectedEmployees, employee.id])
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id))
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.department}</p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedEmployees.length} employees selected
                    </p>
                  </div>

                  {/* Bulk Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Available Actions</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Mark Present</h4>
                        <p className="text-xs text-gray-600 mb-3">Mark selected employees as present for today</p>
                        <button
                          onClick={handleBulkAction}
                          disabled={selectedEmployees.length === 0}
                          className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          Mark Present
                        </button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Mark Absent</h4>
                        <p className="text-xs text-gray-600 mb-3">Mark selected employees as absent for today</p>
                        <button
                          onClick={handleBulkAction}
                          disabled={selectedEmployees.length === 0}
                          className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          Mark Absent
                        </button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Add Time Entry</h4>
                        <p className="text-xs text-gray-600 mb-3">Add manual time entry for selected employees</p>
                        <button
                          onClick={handleBulkAction}
                          disabled={selectedEmployees.length === 0}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          Add Time Entry
                        </button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Send Notification</h4>
                        <p className="text-xs text-gray-600 mb-3">Send attendance reminder to selected employees</p>
                        <button
                          onClick={handleBulkAction}
                          disabled={selectedEmployees.length === 0}
                          className="w-full bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Templates</h2>
                  <p className="text-gray-600 mb-6">
                    Download pre-formatted templates to ensure your data imports correctly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-green-600 text-xl">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Attendance</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Template for importing daily attendance records with check-in/check-out times
                    </p>
                    <button className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">
                      Download Template
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-blue-600 text-xl">⏰</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Hours</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Template for importing weekly working hours and overtime calculations
                    </p>
                    <button className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                      Download Template
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-purple-600 text-xl">📅</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Records</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Template for importing leave applications and approved absences
                    </p>
                    <button className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors">
                      Download Template
                    </button>
                  </div>
                </div>

                {/* Template Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-yellow-900 mb-3">📋 Template Instructions</h3>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• Do not modify column headers or their order</li>
                    <li>• Use the exact date format shown in the template (YYYY-MM-DD)</li>
                    <li>• Time entries should be in 24-hour format (HH:MM)</li>
                    <li>• Employee codes must match existing employee records</li>
                    <li>• Leave empty cells blank, do not use placeholders like "N/A"</li>
                    <li>• Maximum file size is 10MB with up to 10,000 records</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}