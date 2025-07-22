'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LeaveExportPage() {
  const [exportFormat, setExportFormat] = useState('excel')
  const [dateRange, setDateRange] = useState('thisYear')
  const [leaveType, setLeaveType] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [includeOptions, setIncludeOptions] = useState({
    balances: true,
    approvals: true,
    documents: false,
    calculations: true
  })

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Leave export functionality will be implemented with backend integration')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Export Leave Data</h1>
            <p className="text-gray-600 mt-2">Download leave records and analytics in various formats</p>
          </div>
          <Link
            href="/employer/leave"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Leave Management
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Export Configuration */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Export Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Excel (.xlsx)</p>
                      <p className="text-xs text-gray-500">Formatted spreadsheet with multiple sheets</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">CSV (.csv)</p>
                      <p className="text-xs text-gray-500">Comma-separated values for data processing</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">PDF (.pdf)</p>
                      <p className="text-xs text-gray-500">Formatted report for printing and sharing</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisQuarter">This Quarter</option>
                  <option value="thisYear">This Year</option>
                  <option value="lastYear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>

                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Leave Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Leave Type Filter
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Leave Types</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="FAMILY">Family Responsibility</option>
                  <option value="STUDY">Study Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Department Filter
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
          </div>

          {/* Include Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Include in Export</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={includeOptions.balances}
                  onChange={(e) => setIncludeOptions({...includeOptions, balances: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Leave Balances</p>
                  <p className="text-xs text-gray-500">Current and remaining leave balances per employee</p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={includeOptions.approvals}
                  onChange={(e) => setIncludeOptions({...includeOptions, approvals: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Approval History</p>
                  <p className="text-xs text-gray-500">Approval status and manager comments</p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={includeOptions.documents}
                  onChange={(e) => setIncludeOptions({...includeOptions, documents: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Supporting Documents</p>
                  <p className="text-xs text-gray-500">Links to uploaded medical certificates and forms</p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={includeOptions.calculations}
                  onChange={(e) => setIncludeOptions({...includeOptions, calculations: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">BCEA Calculations</p>
                  <p className="text-xs text-gray-500">Leave accrual calculations and compliance metrics</p>
                </div>
              </label>
            </div>
          </div>

          {/* Export Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Preview</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600"><strong>Format:</strong> {exportFormat.toUpperCase()}</p>
                  <p className="text-gray-600"><strong>Date Range:</strong> {dateRange.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-gray-600"><strong>Leave Type:</strong> {leaveType || 'All Types'}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Department:</strong> {selectedDepartment || 'All Departments'}</p>
                  <p className="text-gray-600"><strong>Estimated Records:</strong> ~245 leave records</p>
                  <p className="text-gray-600"><strong>Estimated File Size:</strong> ~1.8 MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Export Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleExport}
                className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="text-blue-600 text-2xl mb-2">📊</div>
                <h4 className="font-medium text-gray-900 mb-1">BCEA Compliance Report</h4>
                <p className="text-xs text-gray-600">Full compliance analysis with all leave types</p>
              </button>

              <button
                onClick={handleExport}
                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="text-green-600 text-2xl mb-2">💰</div>
                <h4 className="font-medium text-gray-900 mb-1">Payroll Integration</h4>
                <p className="text-xs text-gray-600">Leave data formatted for payroll systems</p>
              </button>

              <button
                onClick={handleExport}
                className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="text-purple-600 text-2xl mb-2">📈</div>
                <h4 className="font-medium text-gray-900 mb-1">Analytics Dataset</h4>
                <p className="text-xs text-gray-600">Detailed data for external analytics tools</p>
              </button>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-4 border-t pt-6">
            <Link
              href="/employer/leave"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Export
            </button>
          </div>

          {/* Recent Exports */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No recent exports found</p>
              <p className="text-sm">Your exported leave data files will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}