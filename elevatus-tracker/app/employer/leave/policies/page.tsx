'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LeavePoliciesPage() {
  const [activeTab, setActiveTab] = useState('annual')

  const policies = {
    annual: {
      title: 'Annual Leave',
      description: 'Annual leave entitlements as per BCEA requirements',
      details: [
        '21 consecutive days annual leave per year for employees working 5+ days per week',
        '15 days annual leave per year for employees working fewer than 5 days per week', 
        'Leave accrues from the first day of employment',
        'Annual leave may be taken in periods agreed between employer and employee',
        'Cash payment for untaken leave only on termination of employment',
        'Leave year runs from date of employment or January 1st'
      ],
      legal: 'Basic Conditions of Employment Act, Section 20-22'
    },
    sick: {
      title: 'Sick Leave',
      description: 'Sick leave entitlements during every three-year cycle',
      details: [
        '30 days paid sick leave during every three-year cycle',
        'Sick leave accrues at 1 day for every 26 days worked',
        'Medical certificate required for absences exceeding 2 consecutive days',
        'Medical certificate required for absences on Mondays, Fridays, or before/after public holidays',
        'Unused sick leave does not carry over after the three-year cycle',
        'No cash payment for unused sick leave'
      ],
      legal: 'Basic Conditions of Employment Act, Section 22'
    },
    family: {
      title: 'Family Responsibility Leave',
      description: 'Leave for family obligations and responsibilities',
      details: [
        '3 days family responsibility leave per year',
        'Available to employees working 4+ days per week for 12+ months',
        'For birth/adoption of child, serious illness/death of family member',
        'Family member includes spouse, parent, grandparent, child, grandchild, sibling',
        'Proof may be required (birth certificate, death certificate, medical certificate)',
        'Cannot be taken in conjunction with annual leave'
      ],
      legal: 'Basic Conditions of Employment Act, Section 27'
    },
    maternity: {
      title: 'Maternity Leave',
      description: 'Maternity benefits as per labour legislation',
      details: [
        '4 consecutive months unpaid maternity leave',
        '6 weeks must be taken after birth of child',
        'Written notice required at least 4 weeks before intended start date',
        'Medical certificate from registered medical practitioner required',
        'Job protection during maternity leave period',
        'May not work for 6 weeks after birth unless certified fit by medical practitioner'
      ],
      legal: 'Basic Conditions of Employment Act, Section 25-26'
    },
    parental: {
      title: 'Parental Leave',
      description: 'Parental leave for fathers and adoptive parents',
      details: [
        '10 consecutive days parental leave for fathers',
        '10 weeks adoption leave for primary caregiver',
        'Leave must be taken within 6 months of birth/adoption',
        'Written notice required with supporting documentation',
        'Unpaid leave unless otherwise agreed',
        'Job protection during leave period'
      ],
      legal: 'Basic Conditions of Employment Amendment Act, 2018'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Policies</h1>
            <p className="text-gray-600 mt-2">BCEA-compliant leave policies and procedures</p>
          </div>
          <Link
            href="/employer/leave"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Leave Management
          </Link>
        </div>

        {/* Policy Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            {Object.entries(policies).map(([key, policy]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {policy.title}
              </button>
            ))}
          </div>

          {/* Policy Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {policies[activeTab as keyof typeof policies].title}
              </h2>
              <p className="text-gray-600">
                {policies[activeTab as keyof typeof policies].description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Policy Details */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Details</h3>
                <ul className="space-y-3">
                  {policies[activeTab as keyof typeof policies].details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <p className="ml-3 text-gray-700">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Reference & Actions */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Legal Reference</h4>
                  <p className="text-sm text-blue-700">
                    {policies[activeTab as keyof typeof policies].legal}
                  </p>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Download Policy Document
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    View Application Form
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    Edit Policy Settings
                  </button>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important Note</h4>
                  <p className="text-sm text-yellow-700">
                    These policies are based on South African labour law. Consult with legal counsel for specific situations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">21</div>
            <p className="text-sm text-gray-600">Annual Leave Days</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">30</div>
            <p className="text-sm text-gray-600">Sick Days (3-year cycle)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <p className="text-sm text-gray-600">Family Responsibility Days</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">4</div>
            <p className="text-sm text-gray-600">Maternity Leave Months</p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Additional Resources</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Leave Application Forms</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Standardized forms for different types of leave applications
                  </p>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    Download Forms →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-lg">📖</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Employee Handbook</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Comprehensive guide to all company policies and procedures
                  </p>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    View Handbook →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-lg">⚖️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Legal Compliance</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Latest updates on South African labour law and compliance requirements
                  </p>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    View Updates →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-lg">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">HR Support</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Contact HR for assistance with leave policy questions
                  </p>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    Contact HR →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}