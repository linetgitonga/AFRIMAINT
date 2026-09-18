import { machineRepository, type MachineWithLatest } from "@/lib/repositories/machine-repository"

export const machineService = {
  listForOrganization(organizationId: string): Promise<MachineWithLatest[]> {
    return machineRepository.listByOrganization(organizationId)
  },

  getById(id: string, organizationId: string): Promise<MachineWithLatest | null> {
    return machineRepository.findById(id, organizationId)
  },
}
