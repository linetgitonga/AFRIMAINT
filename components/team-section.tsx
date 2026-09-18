import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { teamMembers } from "@/lib/site-config"

// Renders real team members from lib/site-config.ts if any are listed; otherwise shows
// an explicit placeholder. Never invent names, roles, or use stock/AI-generated headshots.
export function TeamSection() {
  if (teamMembers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <PlaceholderNotice>[NEEDS REAL TEAM PHOTOS/BIOS — add entries to lib/site-config.ts]</PlaceholderNotice>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <Card key={member.name}>
          <CardContent className="pt-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoUrl}
              alt={`Photo of ${member.name}`}
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
            />
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
