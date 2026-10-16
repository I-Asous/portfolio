import './global.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from './components/header'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Islams Portfolio',
    template: '%s | Islam Asous Portfolio',
  },
  description: 'Welcome in, this is me',
  openGraph: {
    title: 'Islams Portfolio',
    description: 'Welcome in, this is me',
    url: baseUrl,
    siteName: 'Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="text-black bg-white">
      <body className="antialiased font-sans min-h-screen flex flex-col md:h-screen">
        <Header />
        <main className="flex-1 min-h-0 flex flex-col">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
