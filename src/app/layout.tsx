import { Roboto } from 'next/font/google'
import type { ReactNode } from 'react'

import StyledComponentsRegistry from '@/lib/registry'
import './global.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  display: 'optional',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Telegram Bot Stats',
  viewport:
    'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=0',
  openGraph: {
    title: 'Telegram Bot Stats',
    description: 'Chat Statistics for the last 24 hours',
    url: 'https://telegram-bot-ui.vercel.app/',
    siteName: 'Telegram Bot Stats',
    images: [
      {
        url: '/preview.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en',
    type: 'website',
  },
  twitter: {
    images: ['/preview.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
