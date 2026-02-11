import React from "react"
import type { Metadata } from 'next'
import { Inter, DM_Serif_Display, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif' })
const _mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Design System',
  description: 'A reusable design system built with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_serif.variable} ${_mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
