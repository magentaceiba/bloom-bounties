import React from 'react'
import type { Metadata } from 'next'
import Providers from '../providers'
import { RouteProgressBar, Navbar } from '../components'
import { cookies } from 'next/headers'
import { initialTheme } from '../styles'
import Analytics from '../providers/Analytics'
import '../styles/global.css'
import 'swiper/css'
import 'swiper/css/effect-cards'

const title = 'Inverter Network'
const { description, applicationName, images } = {
  applicationName: `${title} | Bounty Dapp`,
  description: 'Create Bounty => View => Submit Claim => Get Verified.',
  images: 'https://bloomnetwork.earth/img/bloomBannerBounties.png',
}

export const metadata: Metadata = {
  title,
  applicationName,
  description,
  openGraph: {
    type: 'website',
    title,
    siteName: applicationName,
    description,
    images,
  },
  twitter: {
    card: 'summary_large_image',
    title: applicationName,
    description,
    images,
  },
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const theme =
    (cookies().get('theme')?.value as 'light' | 'dark' | undefined) ??
    initialTheme
  return (
    <html lang="en" data-theme={theme}>
      {/* PWA config */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Inverter PWA" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="viewport"
        content="width=device-width height=device-height initial-scale=1"
      />
      <link rel="icon" href="/icon-512x512.png" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <body>
        <Analytics />
        <Providers theme={theme}>
          <RouteProgressBar />
          {/* CONTENT */}
          <Navbar />
          <div className="flex flex-col items-center gap-6 mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
