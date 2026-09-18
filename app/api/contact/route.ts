import { NextResponse } from "next/server"
import { contactFormSchema } from "@/lib/schemas/contact"
import { leadService } from "@/lib/services/lead-service"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contactFormSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
  }

  await leadService.submitInquiry(parsed.data)

  return NextResponse.json({ ok: true })
}
