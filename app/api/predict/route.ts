import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { predictRequestSchema } from "@/lib/schemas/predict"
import { predictionService, MlServiceError } from "@/lib/services/prediction-service"

export async function POST(request: Request) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const body = await request.json().catch(() => null)
  const parsed = predictRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const prediction = await predictionService.predictAndPersist(parsed.data, session.user.organizationId)
    if (!prediction) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 })
    }
    return NextResponse.json({ prediction }, { status: 201 })
  } catch (err) {
    if (err instanceof MlServiceError) {
      // Most commonly 503 — the ML service is reachable but the trained artifact
      // hasn't been provided yet (see ml-service/models/README.md).
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    // ML service unreachable entirely (not started, wrong URL, network error).
    return NextResponse.json({ error: "ML service unavailable" }, { status: 502 })
  }
}
