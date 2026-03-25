import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "HisarWeb Starter"
  const description = searchParams.get("description") ?? ""
  const siteName = searchParams.get("site") ?? "HisarWeb"
  const accentColor = searchParams.get("color") ?? "#1664d8"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: `linear-gradient(135deg, #f4efe6 0%, #fff 50%, ${accentColor}11 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#56616f",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {siteName}
          </span>
        </div>

        {/* Center: title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? "48px" : "56px",
              fontWeight: 800,
              color: "#15202b",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: "22px",
                color: "#56616f",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "80%",
              }}
            >
              {description.length > 120
                ? description.slice(0, 117) + "..."
                : description}
            </p>
          )}
        </div>

        {/* Bottom: accent line */}
        <div
          style={{
            height: "4px",
            width: "80px",
            borderRadius: "4px",
            background: accentColor,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
