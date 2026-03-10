import React from "react"
import type { Metadata } from 'next'
import { GeistPixelSquare } from 'geist/font/pixel'

import './globals.css'

const _pixel = GeistPixelSquare

export const metadata: Metadata = {
  title: 'DEMO',
  description: 'The experience innovation company',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={_pixel.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
