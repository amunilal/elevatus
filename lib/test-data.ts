import { testData } from './test-data-raw'

export interface TestEmployee {
  firstName: string
  lastName: string
  email: string
  employeeNumber: string
  position: string
  department: string
  hiredDate: string
  salary: number
  idNumber: string
  phoneNumber: string
  address: string
  taxNumber: string
  bankName: string
  branchCode: string
  bankAccount: string
  emergencyContactName: string
  emergencyContactPhone: string
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED'
}

export interface TestLeaveRequest {
  employeeId: string
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'STUDY' | 'UNPAID'
  startDate: string
  endDate: string
  reason: string
  days: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface TestAttendanceRecord {
  employeeId: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY'
  clockIn?: string
  clockOut?: string
  breakDuration?: number
  notes?: string
}

export const getTestEmployees = (): TestEmployee[] => {
  return testData.employees as TestEmployee[]
}

export const getTestLeaveRequests = (): TestLeaveRequest[] => {
  return testData.leaveRequests as TestLeaveRequest[]
}

export const getTestAttendanceRecords = (): TestAttendanceRecord[] => {
  return testData.attendanceRecords as TestAttendanceRecord[]
}

export const getBankingDetails = () => {
  return testData.bankingDetails
}

export const getAddresses = () => {
  return testData.addresses
}

export const getDepartments = () => {
  return testData.departments
}

export const getPositions = () => {
  return testData.positions
}

export const getPhoneNumberFormats = () => {
  return testData.phoneNumberFormats
}

export const getSouthAfricanIdExamples = () => {
  return testData.southAfricanIdExamples
}

// Utility functions for form auto-fill
export const getRandomEmployee = (): TestEmployee => {
  const employees = getTestEmployees()
  return employees[Math.floor(Math.random() * employees.length)]
}

export const getRandomBankDetails = () => {
  const banks = getBankingDetails()
  return banks[Math.floor(Math.random() * banks.length)]
}

export const getRandomAddress = () => {
  const addresses = getAddresses()
  const province = addresses[Math.floor(Math.random() * addresses.length)]
  const address = province.sampleAddresses[Math.floor(Math.random() * province.sampleAddresses.length)]
  return { province: province.province, address }
}

export const generateRandomPhoneNumber = () => {
  const prefixes = ['+27 82', '+27 83', '+27 84', '+27 76', '+27 78', '+27 81', '+27 71', '+27 72', '+27 73', '+27 74']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 900000) + 100000 // 6 digits
  return `${prefix} ${Math.floor(number / 1000)} ${number % 1000}`
}

export const generateRandomIdNumber = () => {
  // Generate a realistic SA ID number (format: YYMMDDGGGGSAZ)
  const year = Math.floor(Math.random() * 30) + 80 // 80-09 (1980-2009)
  const month = Math.floor(Math.random() * 12) + 1
  const day = Math.floor(Math.random() * 28) + 1
  const gender = Math.floor(Math.random() * 5000) + 5000 // 5000-9999 for male, 0000-4999 for female
  const citizenship = 0 // SA citizen
  const checksum = Math.floor(Math.random() * 10)
  
  return `${year.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${gender}${citizenship}8${checksum}`
}

export const generateRandomEmployeeNumber = () => {
  const nextNumber = Math.floor(Math.random() * 900) + 100 // 100-999
  return `EMP${nextNumber.toString().padStart(3, '0')}`
}

export const generateRandomBankAccount = () => {
  return Math.floor(Math.random() * 900000000) + 100000000 // 9 digits
}

// Check if we're in development environment
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}