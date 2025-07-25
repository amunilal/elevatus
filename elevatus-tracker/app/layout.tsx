import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import { ActivityProvider } from '@/contexts/ActivityContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ElevatUs - Employee Tracker',
  description: 'A sophisticated employee management system for South African businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <body className={inter.className}>
        <ActivityProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ActivityProvider>
      </body>
    </html>
  )
}