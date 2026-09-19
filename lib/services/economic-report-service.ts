import { machineRepository } from "@/lib/repositories/machine-repository"
import { economicsRepository } from "@/lib/repositories/economics-repository"
import { economicsService } from "@/lib/services/economics-service"

export type ComputeReportInput = {
  machineId: string
  organizationId: string
  idleWorkers: number
  runToFailureDowntimeHours: number
  predictiveDowntimeHours: number
  preventiveMaintenanceCostKsh: number
}

export const economicReportService = {
  async computeAndPersist(input: ComputeReportInput) {
    // Scope-check, same pattern as work-order-service and prediction-service.
    const machine = await machineRepository.findById(input.machineId, input.organizationId)
    if (!machine) return { error: "machine-not-found" as const }

    const costMatrix = await economicsRepository.getDefaultCostMatrix(input.organizationId)
    if (!costMatrix) return { error: "no-cost-matrix" as const }

    const result = economicsService.computeScenario({
      costMatrix,
      idleWorkers: input.idleWorkers,
      runToFailureDowntimeHours: input.runToFailureDowntimeHours,
      predictiveDowntimeHours: input.predictiveDowntimeHours,
      preventiveMaintenanceCostKsh: input.preventiveMaintenanceCostKsh,
    })

    const report = await economicsRepository.createReport({
      machineId: input.machineId,
      costMatrixId: costMatrix.id,
      runToFailureLossKsh: result.runToFailureLossKsh,
      predictiveMaintenanceCostKsh: result.predictiveMaintenanceCostKsh,
      netSavingsKsh: result.netSavingsKsh,
    })

    return { report, result }
  },

  listForOrganization(organizationId: string) {
    return economicsRepository.listReportsByOrganization(organizationId)
  },

  getCostMatrix(organizationId: string) {
    return economicsRepository.getDefaultCostMatrix(organizationId)
  },

  async updateCostMatrix(
    organizationId: string,
    data: {
      hourlyUnits: number
      profitPerUnitKsh: number
      dailyWageKsh: number
      shiftHours: number
      emergencyPartsCostKsh: number
    }
  ) {
    const existing = await economicsRepository.getDefaultCostMatrix(organizationId)
    if (!existing) return null
    return economicsRepository.updateCostMatrix(existing.id, organizationId, data)
  },

  async getSummary(organizationId: string) {
    const reports = await economicsRepository.listReportsByOrganization(organizationId)
    const totalNetSavingsKsh = reports.reduce((sum, r) => sum + r.netSavingsKsh, 0)
    const totalRunToFailureLossKsh = reports.reduce((sum, r) => sum + r.runToFailureLossKsh, 0)
    return {
      reportCount: reports.length,
      totalNetSavingsKsh,
      totalRunToFailureLossKsh,
      averageSavingsPercent:
        totalRunToFailureLossKsh > 0 ? (totalNetSavingsKsh / totalRunToFailureLossKsh) * 100 : 0,
    }
  },
}
