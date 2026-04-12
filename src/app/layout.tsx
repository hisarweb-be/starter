import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { IBM_Plex_Mono, Inter, Manrope, Sora } from "next/font/google"

import { AnalyticsScripts } from "@/components/providers/analytics-scripts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { siteConfig } from "@/lib/site"

import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const metadataBase = new URL(siteConfig.url)

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase,
  manifest: "/manifest.webmanifest",
  applicationName: siteConfig.name,
  authors: [
    { name: "H. Altuner - www.hisarweb.be", url: siteConfig.ownerUrl },
    { name: "Hisar Group BV", url: siteConfig.url },
  ],
  creator: "H. Altuner",
  publisher: "Hisar Group BV",
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "HisarWeb",
    locale: "nl_BE",
    url: siteConfig.url,
  },
  other: {
    copyright: "H. Altuner",
    "og:see_also": siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/*
          HisarWeb — Hisar Group BV
          Eigenaar: H. Altuner
          https://www.hisarweb.be
          © Alle rechten voorbehouden
        */}
        <link rel="author" href="https://www.hisarweb.be" />
        <link rel="author" type="text/plain" href="/humans.txt" />
      </head>
      <body
        className={`${manrope.variable} ${sora.variable} ${inter.variable} ${GeistSans.variable} ${ibmPlexMono.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AnalyticsScripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
