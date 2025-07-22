'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LeaveBulkPage() {
  const [activeTab, setActiveTab] = useState('import')
  const [file, setFile] = useState<File | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [bulkLeaveType, setBulkLeaveType] = useState('')
  const [bulkDateFrom, setBulkDateFrom] = useState('')
  const [bulkDateTo, setBulkDateTo] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleBulkAction = () => {
    // TODO: Implement bulk action functionality
    alert('Bulk leave action functionality will be implemented with backend integration')
  }

  const employees = [
    { id: '1', name: 'John Doe', department: 'Engineering', annualBalance: 15, sickBalance: 22 },
    { id: '2', name: 'Jane Smith', department: 'Sales', annualBalance: 12, sickBalance: 18 },
    { id: '3', name: 'Mike Johnson', department: 'Marketing', annualBalance: 20, sickBalance: 30 },
    { id: '4', name: 'Sarah Wilson', department: 'HR', annualBalance: 8, sickBalance: 25 },
    { id: '5', name: 'David Brown', department: 'Finance', annualBalance: 18, sickBalance: 14 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Leave Operations</h1>
            <p className="text-gray-600 mt-2">Import/export leave data and perform bulk leave management</p>
          </div>
          <Link
            href="/employer/leave"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Leave Management
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
              Import Leave Data
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bulk'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bulk Leave Actions
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'balance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Balance Adjustments
            </button>
          </div>

          <div className="p-6">
            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Leave Applications</h2>
                  <p className="text-gray-600 mb-6">
                    Upload leave applications from CSV or Excel files. Ensure your file follows the required format with BCEA compliance.
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                        <span className="ml-2 text-sm text-gray-900">Auto-approve valid applications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Validate against leave balances</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Check BCEA compliance</span>
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
                        <span className="ml-2 text-sm text-gray-900">Update leave balances automatically</span>
                      </label>
                    </div>

                    <button
                      onClick={handleBulkAction}
                      disabled={!file}
                      className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Import Leave Applications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions Tab */}
            {activeTab === 'bulk' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Leave Actions</h2>
                  <p className="text-gray-600 mb-6">
                    Apply leave to multiple employees at once. Useful for company-wide holidays or department shutdowns.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Employee Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Employees</h3>
                    <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
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
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
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
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <p>Annual: {employee.annualBalance} days</p>
                              <p>Sick: {employee.sickBalance} days</p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedEmployees.length} employees selected
                    </p>
                  </div>

                  {/* Bulk Leave Configuration */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Leave Type
                        </label>
                        <select
                          value={bulkLeaveType}
                          onChange={(e) => setBulkLeaveType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select leave type</option>
                          <option value="ANNUAL">Annual Leave</option>
                          <option value="SICK">Sick Leave</option>
                          <option value="FAMILY">Family Responsibility</option>
                          <option value="STUDY">Study Leave</option>
                          <option value="UNPAID">Unpaid Leave</option>
                          <option value="COMPANY">Company Holiday</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Date
                          </label>
                          <input
                            type="date"
                            value={bulkDateFrom}
                            onChange={(e) => setBulkDateFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            To Date
                          </label>
                          <input
                            type="date"
                            value={bulkDateTo}
                            onChange={(e) => setBulkDateTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason/Notes
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Optional reason for bulk leave application..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">Auto-approve applications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">Send notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">Validate balances</span>
                        </label>
                      </div>

                      <button
                        onClick={handleBulkAction}
                        disabled={selectedEmployees.length === 0 || !bulkLeaveType || !bulkDateFrom || !bulkDateTo}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Apply Bulk Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Adjustments Tab */}
            {activeTab === 'balance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Balance Adjustments</h2>
                  <p className="text-gray-600 mb-6">
                    Adjust leave balances for multiple employees. Useful for annual balance updates or corrections.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Employee Selection for Balance */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Employees</h3>
                    <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                      {employees.map((employee) => (
                        <div key={employee.id} className="p-4 border-b last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.department}</p>
                            </div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </label>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-blue-700 font-medium">Annual: {employee.annualBalance} days</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-green-700 font-medium">Sick: {employee.sickBalance} days</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Balance Adjustment Options */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Adjustment Options</h3>
                    <div className="space-y-6">
                      {/* Annual Leave Adjustment */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Annual Leave Balance</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Action</label>
                            <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                              <option value="">Select action</option>
                              <option value="set">Set to</option>
                              <option value="add">Add</option>
                              <option value="subtract">Subtract</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Days</label>
                            <input
                              type="number"
                              placeholder="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleBulkAction}
                          className="mt-3 w-full bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors"
                        >
                          Apply Annual Leave Adjustment
                        </button>
                      </div>

                      {/* Sick Leave Adjustment */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Sick Leave Balance</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Action</label>
                            <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                              <option value="">Select action</option>
                              <option value="set">Set to</option>
                              <option value="add">Add</option>
                              <option value="subtract">Subtract</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Days</label>
                            <input
                              type="number"
                              placeholder="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleBulkAction}
                          className="mt-3 w-full bg-green-50 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-100 transition-colors"
                        >
                          Apply Sick Leave Adjustment
                        </button>
                      </div>

                      {/* Reset Balances */}
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="text-sm font-medium text-red-900 mb-3">⚠️ Reset All Balances</h4>
                        <p className="text-xs text-red-700 mb-3">
                          Reset all leave balances to BCEA standard allocations. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleBulkAction}
                          className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Reset to BCEA Standards
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}