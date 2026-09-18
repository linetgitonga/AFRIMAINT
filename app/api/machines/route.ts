import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { machineService } from "@/lib/services/machine-service"

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const machines = await machineService.listForOrganization(session.user.organizationId)
  return NextResponse.json({ machines })
}
