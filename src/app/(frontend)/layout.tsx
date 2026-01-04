import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Montserrat, Roboto_Slab } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { TenantProvider } from '@/providers/Tenant'
import { AnalyticsProvider } from '@/providers/Analytics'
import { CookieConsent } from '@/providers/Analytics/CookieConsent'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTenantByDomain, getMainTenant } from '@/utilities/getTenant'
import { draftMode, headers } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-slab',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // Get tenant based on current hostname
  const headersList = await headers()
  const host = headersList.get('host') || headersList.get('x-tenant-host') || 'localhost:3000'

  // Try to get tenant by domain, fall back to main tenant
  let tenant = await getTenantByDomain(host)
  if (!tenant) {
    tenant = await getMainTenant()
  }

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        montserrat.variable,
        robotoSlab.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.png" rel="icon" type="image/png" />
      </head>
      <body>
        <Providers>
          <TenantProvider tenant={tenant}>
            <AnalyticsProvider
              config={{
                tenantId: tenant?.id,
                debug: process.env.NODE_ENV === 'development',
              }}
            >
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />

              <Header tenant={tenant} />
              {children}
              <Footer tenant={tenant} />

              {/* Cookie Consent Banner for GDPR/CCPA compliance */}
              <CookieConsent privacyPolicyUrl="/privacy-policy" />
            </AnalyticsProvider>
          </TenantProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  description:
    'Your trusted partner in real estate SEO, AI visibility, and local market domination. Get expert solutions for your real estate business.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@DleBlogFactory',
  },
}
