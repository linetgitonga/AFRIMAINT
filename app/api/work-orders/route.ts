import { NextResponse } from "next/server"
import { isAuthResponse, requireSession } from "@/lib/api-auth"
import { workOrderService } from "@/lib/services/work-order-service"

const CAN_CREATE_ROLES = ["MANAGER", "ADMIN"]

export async function GET() {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  const workOrders = await workOrderService.listForOrganization(session.user.organizationId)
  return NextResponse.json({ workOrders })
}

export async function POST(request: Request) {
  const session = await requireSession()
  if (isAuthResponse(session)) return session

  if (!CAN_CREATE_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.machineId || !body?.priority) {
    return NextResponse.json({ error: "machineId and priority are required" }, { status: 400 })
  }

  const workOrder = await workOrderService.create({
    machineId: body.machineId,
    organizationId: session.user.organizationId,
    priority: body.priority,
    scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
    assignedTechnicianId: body.assignedTechnicianId,
    notes: body.notes,
  })

  if (!workOrder) {
    return NextResponse.json({ error: "Machine not found" }, { status: 404 })
  }

  return NextResponse.json({ workOrder }, { status: 201 })
}
