import type { Alert } from "@prisma/client"
import { alertRepository } from "@/lib/repositories/alert-repository"

const VALID_STATUSES: Alert["status"][] = ["OPEN", "ACKNOWLEDGED", "RESOLVED"]

export const alertService = {
  listForOrganization(organizationId: string): Promise<Alert[]> {
    return alertRepository.listByOrganization(organizationId)
  },

  updateStatus(id: string, organizationId: string, status: string): Promise<Alert | null> {
    if (!VALID_STATUSES.includes(status as Alert["status"])) {
      throw new Error(`Invalid alert status: ${status}`)
    }
    return alertRepository.updateStatus(id, organizationId, status as Alert["status"])
  },
}
