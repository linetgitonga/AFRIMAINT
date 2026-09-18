import { ImageResponse } from "next/og"

// Default (nodejs) runtime for @vercel/og resolves its bundled font via a relative
// file URL that breaks on Windows during static export — edge runtime avoids that path.
export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #16a34a 0%, #2563eb 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>AfriMaint</div>
        <div style={{ fontSize: 36, marginTop: 16, opacity: 0.9 }}>AI-Powered Predictive Maintenance</div>
      </div>
    ),
    { ...size }
  )
}
