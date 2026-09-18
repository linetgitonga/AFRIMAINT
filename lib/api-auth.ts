import { getServerSession, type Session } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

type AuthorizedSession = Session & { user: NonNullable<Session["user"]> }

// Shared by API route handlers: returns the session or a 401 response to return
// immediately, so every route enforces auth the same way instead of reimplementing it.
export async function requireSession(): Promise<AuthorizedSession | NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return session as AuthorizedSession
}

export function isAuthResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse
}
