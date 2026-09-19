import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { economicScenarioSchema } from "@/lib/schemas/economics"
import { economicReportService } from "@/lib/services/economic-report-service"

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const reports = await economicReportService.listForOrganization(session.user.organizationId)
  return NextResponse.json({ reports })
}

export async function POST(request: Request) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const body = await request.json().catch(() => null)
  const parsed = economicScenarioSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }

  const outcome = await economicReportService.computeAndPersist({
    ...parsed.data,
    organizationId: session.user.organizationId,
  })

  if ("error" in outcome) {
    const status = outcome.error === "machine-not-found" ? 404 : 409
    const message = outcome.error === "machine-not-found" ? "Machine not found" : "No cost matrix configured for this organization"
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({ report: outcome.report, result: outcome.result }, { status: 201 })
}
