"use client"

import Script from "next/script"

export function GoogleAnalytics({ trackingId }: { trackingId?: string | null }) {
  if (!trackingId?.startsWith("G-")) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
      />
      <Script id={`ga-${trackingId}`} strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}', { page_path: window.location.pathname });
      `}</Script>
    </>
  )
}
