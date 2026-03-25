import Script from "next/script"

import { getAnalyticsConfig } from "@/lib/analytics"

export function AnalyticsScripts() {
  const analytics = getAnalyticsConfig()

  if (analytics.enabledProviders.length === 0) {
    return null
  }

  return (
    <>
      {analytics.googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics.googleAnalyticsId}');
            `}
          </Script>
        </>
      ) : null}

      {analytics.plausibleDomain ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={analytics.plausibleDomain}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  )
}
