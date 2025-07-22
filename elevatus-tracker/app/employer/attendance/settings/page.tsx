'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AttendanceSettingsPage() {
  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: '60',
    daysPerWeek: '5'
  })

  const [latePolicy, setLatePolicy] = useState({
    graceMinutes: '15',
    penaltyAfter: '30',
    autoDeduction: true
  })

  const [overtimePolicy, setOvertimePolicy] = useState({
    enabled: true,
    threshold: '40',
    rate: '1.5'
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    alert('Settings will be saved when backend is integrated')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Settings</h1>
            <p className="text-gray-600 mt-2">Configure attendance policies and working hours</p>
          </div>
          <Link
            href="/employer/attendance"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Attendance
          </Link>
        </div>

        <div className="space-y-8">
          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Standard Working Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={workingHours.startTime}
                  onChange={(e) => setWorkingHours({...workingHours, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={workingHours.endTime}
                  onChange={(e) => setWorkingHours({...workingHours, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={workingHours.breakDuration}
                  onChange={(e) => setWorkingHours({...workingHours, breakDuration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Days per Week
                </label>
                <select
                  value={workingHours.daysPerWeek}
                  onChange={(e) => setWorkingHours({...workingHours, daysPerWeek: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 Days (Monday-Friday)</option>
                  <option value="6">6 Days (Monday-Saturday)</option>
                  <option value="7">7 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Late Policy */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Late Arrival Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grace Period (minutes)
                </label>
                <input
                  type="number"
                  value={latePolicy.graceMinutes}
                  onChange={(e) => setLatePolicy({...latePolicy, graceMinutes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Minutes before marking as late</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty After (minutes)
                </label>
                <input
                  type="number"
                  value={latePolicy.penaltyAfter}
                  onChange={(e) => setLatePolicy({...latePolicy, penaltyAfter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Apply penalty deductions</p>
              </div>
              <div>
                <label className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    checked={latePolicy.autoDeduction}
                    onChange={(e) => setLatePolicy({...latePolicy, autoDeduction: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Auto salary deduction</span>
                </label>
              </div>
            </div>
          </div>

          {/* Overtime Policy */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overtime Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={overtimePolicy.enabled}
                    onChange={(e) => setOvertimePolicy({...overtimePolicy, enabled: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Enable overtime tracking</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Threshold (hours)
                </label>
                <input
                  type="number"
                  value={overtimePolicy.threshold}
                  onChange={(e) => setOvertimePolicy({...overtimePolicy, threshold: e.target.value})}
                  disabled={!overtimePolicy.enabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Rate (multiplier)
                </label>
                <select
                  value={overtimePolicy.rate}
                  onChange={(e) => setOvertimePolicy({...overtimePolicy, rate: e.target.value})}
                  disabled={!overtimePolicy.enabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="1.5">1.5x (BCEA Standard)</option>
                  <option value="2.0">2.0x (Double Time)</option>
                  <option value="1.25">1.25x (Time and Quarter)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Send daily attendance summary</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Alert on excessive late arrivals</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Notify on overtime threshold reached</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Weekly attendance report</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/employer/attendance"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}