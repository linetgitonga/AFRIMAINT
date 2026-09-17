import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFooter } from "@/components/site-footer"
import { Suspense } from "react"
import { getSiteBaseUrl, siteConfig } from "@/lib/site-config"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: {
    default: "AfriMaint - AI Predictive Maintenance",
    template: `%s | ${siteConfig.productName}`,
  },
  description: "AI-powered predictive maintenance for African SMEs",
  openGraph: {
    title: "AfriMaint - AI Predictive Maintenance",
    description: "AI-powered predictive maintenance for African SMEs",
    siteName: siteConfig.productName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfriMaint - AI Predictive Maintenance",
    description: "AI-powered predictive maintenance for African SMEs",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <SiteFooter />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
