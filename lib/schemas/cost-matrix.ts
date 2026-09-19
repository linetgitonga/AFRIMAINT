import { z } from "zod"

export const costMatrixUpdateSchema = z.object({
  hourlyUnits: z.number().min(0),
  profitPerUnitKsh: z.number().min(0),
  dailyWageKsh: z.number().min(0),
  shiftHours: z.number().min(1),
  emergencyPartsCostKsh: z.number().min(0),
})

export type CostMatrixUpdateValues = z.infer<typeof costMatrixUpdateSchema>
