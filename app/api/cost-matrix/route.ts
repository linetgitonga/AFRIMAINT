import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { costMatrixUpdateSchema } from "@/lib/schemas/cost-matrix"
import { economicReportService } from "@/lib/services/economic-report-service"

const CAN_EDIT_ROLES = ["FINANCE", "ADMIN"]

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const costMatrix = await economicReportService.getCostMatrix(session.user.organizationId)
  const summary = await economicReportService.getSummary(session.user.organizationId)
  return NextResponse.json({ costMatrix, summary })
}

export async function PUT(request: Request) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  if (!CAN_EDIT_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = costMatrixUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }

  const costMatrix = await economicReportService.updateCostMatrix(session.user.organizationId, parsed.data)
  if (!costMatrix) {
    return NextResponse.json({ error: "No cost matrix configured for this organization" }, { status: 404 })
  }

  return NextResponse.json({ costMatrix })
}
