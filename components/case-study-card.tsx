import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceholderNotice } from "@/components/placeholder-notice"

// No real pilot/customer results exist yet. Renders an explicit placeholder rather
// than an invented case study — replace with real customer data once available
// (see Phase 5's pilot in the concept note / implementation plan).
export function CaseStudyCard() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Case study coming soon</CardTitle>
        <CardDescription>
          <PlaceholderNotice>[CASE STUDY PENDING — real customer data required before publishing]</PlaceholderNotice>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          We&apos;ll publish a real customer outcome here once our pilot program produces verified results.
        </p>
      </CardContent>
    </Card>
  )
}
