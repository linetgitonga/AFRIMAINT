import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { alertService } from "@/lib/services/alert-service"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const body = await request.json().catch(() => null)
  if (!body?.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 })
  }

  try {
    const alert = await alertService.updateStatus(params.id, session.user.organizationId, body.status)
    if (!alert) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ alert })
  } catch {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }
}
