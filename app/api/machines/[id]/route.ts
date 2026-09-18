import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { machineService } from "@/lib/services/machine-service"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const machine = await machineService.getById(params.id, session.user.organizationId)
  if (!machine) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ machine })
}
