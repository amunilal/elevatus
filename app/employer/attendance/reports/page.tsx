'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AttendanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
            <p className="text-gray-600 mt-2">Generate comprehensive attendance analytics and insights</p>
          </div>
          <Link
            href="/employer/attendance"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Attendance
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="quarterly">Quarterly Report</option>
                <option value="yearly">Yearly Report</option>
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
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Summary Report</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Overall attendance statistics including present, absent, and late employees
            </p>
            <button className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
              View Summary
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Time & Hours</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Detailed working hours analysis including overtime and break time
            </p>
            <button className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">
              View Hours Report
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Trends Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Attendance patterns and trends over time with visual charts
            </p>
            <button className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors">
              View Trends
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Exceptions Report</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Late arrivals, early departures, and attendance policy violations
            </p>
            <button className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-md hover:bg-red-100 transition-colors">
              View Exceptions
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Department Report</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Department-wise attendance comparison and performance metrics
            </p>
            <button className="w-full bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-100 transition-colors">
              View Departments
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-lg">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Compliance Report</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              BCEA compliance analysis and labour law adherence report
            </p>
            <button className="w-full bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors">
              View Compliance
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">No recent reports available. Generate your first report above.</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Generate New Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}