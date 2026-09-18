import type { WorkOrder } from "@prisma/client"
import { workOrderRepository } from "@/lib/repositories/work-order-repository"
import { machineRepository } from "@/lib/repositories/machine-repository"

export const workOrderService = {
  listForOrganization(organizationId: string): Promise<WorkOrder[]> {
    return workOrderRepository.listByOrganization(organizationId)
  },

  async create(input: {
    machineId: string
    organizationId: string
    priority: WorkOrder["priority"]
    scheduledFor?: Date
    assignedTechnicianId?: string
    notes?: string
  }): Promise<WorkOrder | null> {
    // Scope-check: the machine must belong to the caller's organization, otherwise a
    // work order could be created against another organization's machine by ID guessing.
    const machine = await machineRepository.findById(input.machineId, input.organizationId)
    if (!machine) return null

    return workOrderRepository.create({
      machineId: input.machineId,
      priority: input.priority,
      scheduledFor: input.scheduledFor,
      assignedTechnicianId: input.assignedTechnicianId,
      notes: input.notes,
    })
  },
}
