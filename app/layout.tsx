import React from "react"
import type { Metadata } from 'next'
import { Inter, DM_Sans, Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { ChatLoader } from '@/components/explore/chat-loader'
import { NinetailedWrapper } from '@/components/providers/ninetailed-wrapper'

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
  title: 'HARTMANN | Hilft. Pflegt. Sch\u00fctzt. -- Sitecore AI Showcase',
  description: 'PAUL HARTMANN AG -- Innovative Medizin- und Pflegeprodukte. Entdecken Sie unsere Sitecore AI-gest\u00fctzten Content-Management-L\u00f6sungen.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${playfair.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NinetailedWrapper>
          {children}
          <ChatLoader />
        </NinetailedWrapper>
        <SpeedInsights />
      </body>
    </html>
  )
}
