import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: true },
}

export default function ContactThankYouPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Thanks for reaching out</CardTitle>
          <CardDescription>{siteConfig.responseTimePromise}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
