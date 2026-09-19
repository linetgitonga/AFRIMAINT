/**
 * Diagnostic Agent — validates failure probability + RUL against the exact
 * thresholds from the notebook's "CELL 8.6 — Machine Risk Advisory Table":
 *
 *   CRITICAL: HI >= 0.85  OR  pseudo_rul < 30
 *   WARN:     HI >= 0.15  OR  personalised_risk >= 0.15  OR  pseudo_rul < 100
 *   OK:       otherwise
 *
 * personalised_risk = HI * P(failure within 60 wear-minutes), where the P(60)
 * term is the notebook's Weibull conditional-failure formula (cell 17, Step 4)
 * — pure math over the fitted beta/eta, same as ml-service's wiener_rul.py.
 */

const CRIT_HI = 0.85
const WARN_HI = 0.15
const WARN_PERSONALISED_RISK = 0.15
const CRIT_RUL_WEAR_MINUTES = 30
const WARN_RUL_WEAR_MINUTES = 100

const DEFAULT_BETA_W = 1.974
const DEFAULT_ETA_W = 187.7

export type AlertLevel = "CRITICAL" | "WARN" | "OK"

export type DiagnosticInput = {
  failureProbability: number // HI, from the XGBoost classifier (0-1)
  toolWear: number
  pseudoRulWearMinutes: number // e.g. rul_p50 from ml-service's /rul endpoint
  betaW?: number
  etaW?: number
}

export type DiagnosticResult = {
  alertLevel: AlertLevel
  recommendedAction: string
  personalisedRisk: number
  pFailWithin60WearMinutes: number
}

/** Weibull conditional failure probability, ported verbatim from notebook cell 17 Step 4. */
export function weibullConditionalFailProb(
  currentWear: number,
  deltaT: number,
  beta: number = DEFAULT_BETA_W,
  eta: number = DEFAULT_ETA_W
): number {
  const t1 = (currentWear / eta) ** beta
  const t2 = ((currentWear + deltaT) / eta) ** beta
  return 1.0 - Math.exp(-(t2 - t1))
}

function assignAlert(hi: number, personalisedRisk: number, rul: number): AlertLevel {
  if (hi >= CRIT_HI || rul < CRIT_RUL_WEAR_MINUTES) return "CRITICAL"
  if (hi >= WARN_HI || personalisedRisk >= WARN_PERSONALISED_RISK || rul < WARN_RUL_WEAR_MINUTES) return "WARN"
  return "OK"
}

function recommendedAction(level: AlertLevel): string {
  switch (level) {
    case "CRITICAL":
      return "Stop machine — schedule immediate inspection"
    case "WARN":
      return "Schedule maintenance within next shift"
    case "OK":
      return "Continue operating — re-check at next wear interval"
  }
}

export const diagnosticAgent = {
  evaluate(input: DiagnosticInput): DiagnosticResult {
    const pFail60 = weibullConditionalFailProb(input.toolWear, 60, input.betaW, input.etaW)
    const personalisedRisk = input.failureProbability * pFail60
    const alertLevel = assignAlert(input.failureProbability, personalisedRisk, input.pseudoRulWearMinutes)

    return {
      alertLevel,
      recommendedAction: recommendedAction(alertLevel),
      personalisedRisk,
      pFailWithin60WearMinutes: pFail60,
    }
  },
}
