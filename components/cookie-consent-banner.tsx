"use client"

// Granular cookie-consent banner. NOT mounted anywhere by default — see
// app/cookies/page.tsx: as of Phase 1, nothing on this site sets cookies
// (Vercel Analytics is cookieless), so showing a consent banner would be
// compliance theater with no real choice behind it. Mount this in
// app/layout.tsx the moment a cookie-setting embed (e.g. Google Maps,
// Google Analytics) actually ships, and update the Cookie Policy at the
// same time.

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const STORAGE_KEY = "afrimaint-cookie-consent"

type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [consent, setConsent] = useState<ConsentState>(defaultConsent)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage unavailable (private browsing, blocked storage) — fail open, don't block the page
      setVisible(true)
    }
  }, [])

  function save(next: ConsentState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // best-effort persistence only
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Cookie preferences</CardTitle>
          <CardDescription>
            We use optional cookies for analytics and marketing. Choose what you&apos;re comfortable with — necessary
            cookies for core site functionality are always on.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Necessary</p>
              <p className="text-xs text-muted-foreground">Required for the site to function. Always on.</p>
            </div>
            <Switch checked disabled aria-label="Necessary cookies (always on)" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Analytics</p>
              <p className="text-xs text-muted-foreground">Helps us understand site usage.</p>
            </div>
            <Switch
              checked={consent.analytics}
              onCheckedChange={(checked) => setConsent((c) => ({ ...c, analytics: checked }))}
              aria-label="Analytics cookies"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Marketing</p>
              <p className="text-xs text-muted-foreground">Used for embeds such as maps or ads.</p>
            </div>
            <Switch
              checked={consent.marketing}
              onCheckedChange={(checked) => setConsent((c) => ({ ...c, marketing: checked }))}
              aria-label="Marketing cookies"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => save(defaultConsent)}>
              Reject non-essential
            </Button>
            <Button variant="secondary" onClick={() => save(consent)}>
              Save preferences
            </Button>
            <Button onClick={() => save({ necessary: true, analytics: true, marketing: true })}>Accept all</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
