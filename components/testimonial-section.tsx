import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderNotice } from "@/components/placeholder-notice"

// No real customers exist yet — never invent quotes, names, companies, or star ratings.
// Replace this whole section with real, attributable testimonials once collected.
export function TestimonialSection() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center">
        <PlaceholderNotice>[CUSTOMER REVIEWS PENDING — real, attributable testimonials required]</PlaceholderNotice>
        <p className="mt-3 text-sm text-muted-foreground">
          We only publish reviews from verified customers, with their permission.
        </p>
      </CardContent>
    </Card>
  )
}
