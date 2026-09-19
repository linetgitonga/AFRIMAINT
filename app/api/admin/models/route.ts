import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { modelVersionService } from "@/lib/services/model-version-service"

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const modelVersions = await modelVersionService.listAll()
  return NextResponse.json({ modelVersions })
}
