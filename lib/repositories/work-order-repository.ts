import type { Prisma, WorkOrder } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface WorkOrderRepository {
  listByOrganization(organizationId: string): Promise<WorkOrder[]>
  create(data: Prisma.WorkOrderUncheckedCreateInput): Promise<WorkOrder>
}

class PrismaWorkOrderRepository implements WorkOrderRepository {
  async listByOrganization(organizationId: string): Promise<WorkOrder[]> {
    return prisma.workOrder.findMany({
      where: { machine: { organizationId } },
      orderBy: { scheduledFor: "asc" },
    })
  }

  async create(data: Prisma.WorkOrderUncheckedCreateInput): Promise<WorkOrder> {
    return prisma.workOrder.create({ data })
  }
}

export const workOrderRepository: WorkOrderRepository = new PrismaWorkOrderRepository()
