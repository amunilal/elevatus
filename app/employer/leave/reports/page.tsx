'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LeaveReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisYear')
  const [selectedLeaveType, setSelectedLeaveType] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">BCEA-compliant leave analysis and trends</p>
          </div>
          <Link
            href="/employer/leave"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Leave Management
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Leave Days</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Approved Requests</p>
                <p className="text-2xl font-bold text-green-600">89%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg Processing Time</p>
                <p className="text-2xl font-bold text-purple-600">2.3 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Leave Types</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
                <option value="FAMILY">Family Responsibility</option>
                <option value="STUDY">Study Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
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
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Update Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">BCEA Compliance</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive compliance report against Basic Conditions of Employment Act
            </p>
            <button className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
              Generate BCEA Report
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Leave Utilization</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Analysis of leave usage patterns and employee leave balance utilization
            </p>
            <button className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">
              View Utilization
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Department Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Cross-departmental leave trends and comparative analysis
            </p>
            <button className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors">
              Compare Departments
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Risk Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Identify potential risks and patterns in leave applications
            </p>
            <button className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-md hover:bg-red-100 transition-colors">
              View Risk Report
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Cost Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Financial impact of leave on operations and productivity
            </p>
            <button className="w-full bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-100 transition-colors">
              Calculate Costs
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-lg">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Trends & Forecasting</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Predictive analysis for future leave requirements and planning
            </p>
            <button className="w-full bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors">
              View Forecasts
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">No reports generated yet. Select a report type above to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}