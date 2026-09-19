import { machineRepository } from "@/lib/repositories/machine-repository"
import { predictionRepository } from "@/lib/repositories/prediction-repository"
import { alertRepository } from "@/lib/repositories/alert-repository"
import { diagnosticAgent, type AlertLevel } from "@/lib/agents/diagnostic-agent"
import type { PredictRequestValues } from "@/lib/schemas/predict"
import type { Alert } from "@prisma/client"

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000"

type MlPredictResponse = {
  machine_id: string
  failure_probability: number
  threshold: number
  model_version?: string | null
}

type MlRulResponse = {
  rul_p10_wear_minutes: number
  rul_p50_wear_minutes: number
  rul_p90_wear_minutes: number
  regime: string
}

// diagnostic-agent.ts uses "WARN" (matching the notebook's own vocabulary);
// prisma/schema.prisma's AlertSeverity enum spells it "WARNING". Map once here
// rather than let the two vocabularies drift against each other silently.
const ALERT_LEVEL_TO_SEVERITY: Record<AlertLevel, Alert["severity"]> = {
  CRITICAL: "CRITICAL",
  WARN: "WARNING",
  OK: "OK",
}

async function fetchRul(machineId: string, toolWear: number, healthIndicator: number): Promise<MlRulResponse | null> {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/rul`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machine_id: machineId, tool_wear: toolWear, health_indicator: healthIndicator }),
    })
    if (!res.ok) return null
    return (await res.json()) as MlRulResponse
  } catch {
    // RUL/diagnostic step is a secondary enrichment — its failure shouldn't
    // fail the primary prediction, which has already been computed and persisted.
    return null
  }
}

export const predictionService = {
  async predictAndPersist(input: PredictRequestValues, organizationId: string) {
    // Scope-check, same pattern as work-order-service: the machine must belong
    // to the caller's organization before we call out to the ML service for it.
    const machine = await machineRepository.findById(input.machineId, organizationId)
    if (!machine) return null

    const res = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machine_id: input.machineId,
        reading: {
          air_temperature: input.reading.airTemperature,
          process_temperature: input.reading.processTemperature,
          rotational_speed: input.reading.rotationalSpeed,
          torque: input.reading.torque,
          tool_wear: input.reading.toolWear,
          machine_type: input.reading.machineType,
        },
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: res.statusText }))
      throw new MlServiceError(res.status, body.detail ?? "ML service request failed")
    }

    const result = (await res.json()) as MlPredictResponse

    const prediction = await predictionRepository.create({
      machineId: input.machineId,
      failureProbability: result.failure_probability,
      threshold: result.threshold,
    })

    // Concept note §7.5 "Agent Background Flow": XGBoost -> Wiener RUL ->
    // Diagnostic Agent -> alert. RUL needs no trained artifact (see
    // ml-service/app/models/wiener_rul.py), so this runs regardless of whether
    // the XGBoost/VAE artifacts have been provided yet.
    const rul = await fetchRul(input.machineId, input.reading.toolWear, result.failure_probability)
    if (rul) {
      const diagnosis = diagnosticAgent.evaluate({
        failureProbability: result.failure_probability,
        toolWear: input.reading.toolWear,
        pseudoRulWearMinutes: rul.rul_p50_wear_minutes,
      })

      if (diagnosis.alertLevel !== "OK") {
        await alertRepository.create({
          machineId: input.machineId,
          predictionId: prediction.id,
          severity: ALERT_LEVEL_TO_SEVERITY[diagnosis.alertLevel],
          message: diagnosis.recommendedAction,
        })
      }
    }

    return prediction
  },
}

export class MlServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "MlServiceError"
  }
}
