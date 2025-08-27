import { Roboto } from 'next/font/google'
import type { ReactNode } from 'react'
import type { Viewport, Metadata } from 'next'

import StyledComponentsRegistry from '@/lib/registry'
import './global.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  display: 'optional',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://telegram-bot-ui.vercel.app/'),
  openGraph: {
    title: 'Telegram Bot Stats',
    description: 'Chat Statistics for the last 24 hours',
    url: 'https://telegram-bot-ui.vercel.app/',
    siteName: 'Telegram Bot Stats',
    images: '/preview.png',
    locale: 'en',
    type: 'website',
  },
  twitter: {
    images: ['/preview.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <title>Telegram Bot Stats</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
