import { z } from "zod"

export const economicScenarioSchema = z.object({
  machineId: z.string().min(1),
  idleWorkers: z.number().min(0),
  runToFailureDowntimeHours: z.number().min(0),
  predictiveDowntimeHours: z.number().min(0),
  preventiveMaintenanceCostKsh: z.number().min(0),
})

export type EconomicScenarioValues = z.infer<typeof economicScenarioSchema>
