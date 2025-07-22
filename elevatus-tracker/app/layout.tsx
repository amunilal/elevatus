import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elevatus - Employee Tracker',
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
        {children}
      </body>
    </html>
  )
}