import React from "react"
import type { Metadata } from 'next'
import { Inter, DM_Sans, Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'

import './globals.css'
import { HartmannChatLoader } from '@/components/hartmann/hartmann-chat-loader'
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
  title: 'HARTMANN | Hilft. Pflegt. Schutzt.',
  description: 'Die HARTMANN GRUPPE ist ein fuhrender europaischer Anbieter von Systemlosungen fur Medizin und Pflege. Medizinisches Fachpersonal und Patienten verlassen sich tagtaglich auf unsere Produkte.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${dmSans.variable} ${playfair.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NinetailedWrapper>
          {children}
          <HartmannChatLoader />
        </NinetailedWrapper>
      </body>
    </html>
  )
}
