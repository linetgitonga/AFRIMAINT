import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">404 — Page not found</CardTitle>
          <CardDescription>The page you&apos;re looking for doesn&apos;t exist or has moved.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/landing">View the marketing site</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
