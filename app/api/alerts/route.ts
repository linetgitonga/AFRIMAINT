import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { alertService } from "@/lib/services/alert-service"

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const alerts = await alertService.listForOrganization(session.user.organizationId)
  return NextResponse.json({ alerts })
}
