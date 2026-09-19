import { z } from "zod"

// Mirrors ml-service/app/schemas.py's SensorReadingIn/PredictRequest.
export const predictRequestSchema = z.object({
  machineId: z.string().min(1),
  reading: z.object({
    airTemperature: z.number(),
    processTemperature: z.number(),
    rotationalSpeed: z.number(),
    torque: z.number(),
    toolWear: z.number(),
    machineType: z.enum(["L", "M", "H"]),
  }),
})

export type PredictRequestValues = z.infer<typeof predictRequestSchema>
