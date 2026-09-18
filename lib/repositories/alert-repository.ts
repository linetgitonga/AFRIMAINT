import type { Alert } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface AlertRepository {
  listByOrganization(organizationId: string): Promise<Alert[]>
  updateStatus(id: string, organizationId: string, status: Alert["status"]): Promise<Alert | null>
}

class PrismaAlertRepository implements AlertRepository {
  async listByOrganization(organizationId: string): Promise<Alert[]> {
    return prisma.alert.findMany({
      where: { machine: { organizationId } },
      orderBy: { createdAt: "desc" },
    })
  }

  async updateStatus(id: string, organizationId: string, status: Alert["status"]): Promise<Alert | null> {
    const alert = await prisma.alert.findFirst({ where: { id, machine: { organizationId } } })
    if (!alert) return null

    return prisma.alert.update({ where: { id }, data: { status } })
  }
}

export const alertRepository: AlertRepository = new PrismaAlertRepository()
