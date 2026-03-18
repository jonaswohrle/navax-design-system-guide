import React from "react"
import type { Metadata } from 'next'
import { Inter, DM_Sans, Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'

import './globals.css'
import { ChatLoader } from '@/components/explore/chat-loader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
})

const geistMono = GeistMono

export const metadata: Metadata = {
  title: 'Book Adventure Travel & Small Group Tours | Explore',
  description: 'Explore offers small group adventure holidays to over 100 countries worldwide. Award-winning tours with expert leaders. Book your next adventure today.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${playfair.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <ChatLoader />
      </body>
    </html>
  )
}
