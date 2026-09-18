"use client"

// Google's map embed sets its own cookies, so this is gated behind the same consent
// state as components/cookie-consent-banner.tsx rather than loading unconditionally —
// until the visitor has accepted (or the banner isn't shown yet), we show a click-to-load
// placeholder instead of silently setting third-party cookies.

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

const STORAGE_KEY = "afrimaint-cookie-consent"

export function MapEmbed() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const consent = JSON.parse(stored) as { marketing?: boolean }
        if (consent.marketing) setLoaded(true)
      }
    } catch {
      // no stored consent — leave unloaded, require explicit click
    }
  }, [])

  if (!loaded) {
    return (
      <Card className="flex aspect-video items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <MapPin className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading the map sets cookies from Google. See our{" "}
            <a href="/cookies" className="underline underline-offset-4">
              Cookie Policy
            </a>
            .
          </p>
          <Button onClick={() => setLoaded(true)}>Load map</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <iframe
      title="Office location map"
      src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapEmbedQuery)}&output=embed`}
      className="aspect-video w-full rounded-lg border"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
