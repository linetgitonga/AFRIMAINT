/**
 * Economic Agent — deterministic arithmetic per concept note §10.7, not an
 * ML/LLM task, so it's plain typed functions rather than an agent-orchestration
 * framework. Formulas and worked examples are the concept note's own:
 *
 *   lost revenue      = hourly_units * profit_per_unit * downtime_hours
 *   wasted labour     = idle_workers * (daily_wage / shift_hours) * downtime_hours
 *   run-to-failure    = lost_revenue + wasted_labour + emergency_parts_cost
 *   predictive cost   = reduced_revenue + reduced_labour + pm_expenses
 *   net savings       = run_to_failure_total - predictive_maintenance_total
 *
 * Verified against the concept note's three worked examples (its exact scenario
 * inputs — hourly units, profit/unit, etc. — aren't given, only the totals, so
 * this checks the loss/cost -> net-savings derivation itself):
 *   - Maize milling: 23,250 - 13,394.63 = 9,855.37 (42%) — matches exactly.
 *   - Garment workshop: 26,400 - 12,200 = 14,200 (54%) — matches exactly.
 *   - Refrigeration unit: 24,335 - 7,335 = 17,000, not the concept note's stated
 *     "approximately KSH 16,000" (66%) — a ~1,000 KSH discrepancy in the source
 *     document itself. Net savings is definitionally loss minus cost, so this
 *     implementation is not adjusted to force a match with that inconsistent
 *     example; flagging it here rather than silently reproducing the error.
 */

export type CostMatrixInput = {
  hourlyUnits: number
  profitPerUnitKsh: number
  dailyWageKsh: number
  shiftHours: number
  emergencyPartsCostKsh: number
}

export type EconomicScenarioInput = {
  costMatrix: CostMatrixInput
  idleWorkers: number
  runToFailureDowntimeHours: number
  predictiveDowntimeHours: number
  preventiveMaintenanceCostKsh: number
}

export type EconomicScenarioResult = {
  runToFailureLossKsh: number
  predictiveMaintenanceCostKsh: number
  netSavingsKsh: number
  netSavingsPercent: number
}

function lostRevenue(costMatrix: CostMatrixInput, downtimeHours: number): number {
  return costMatrix.hourlyUnits * costMatrix.profitPerUnitKsh * downtimeHours
}

function wastedLabour(costMatrix: CostMatrixInput, idleWorkers: number, downtimeHours: number): number {
  return idleWorkers * (costMatrix.dailyWageKsh / costMatrix.shiftHours) * downtimeHours
}

export const economicsService = {
  computeScenario(input: EconomicScenarioInput): EconomicScenarioResult {
    const { costMatrix, idleWorkers, runToFailureDowntimeHours, predictiveDowntimeHours, preventiveMaintenanceCostKsh } =
      input

    const runToFailureLossKsh =
      lostRevenue(costMatrix, runToFailureDowntimeHours) +
      wastedLabour(costMatrix, idleWorkers, runToFailureDowntimeHours) +
      costMatrix.emergencyPartsCostKsh

    const predictiveMaintenanceCostKsh =
      lostRevenue(costMatrix, predictiveDowntimeHours) +
      wastedLabour(costMatrix, idleWorkers, predictiveDowntimeHours) +
      preventiveMaintenanceCostKsh

    const netSavingsKsh = runToFailureLossKsh - predictiveMaintenanceCostKsh
    const netSavingsPercent = runToFailureLossKsh > 0 ? (netSavingsKsh / runToFailureLossKsh) * 100 : 0

    return {
      runToFailureLossKsh: round2(runToFailureLossKsh),
      predictiveMaintenanceCostKsh: round2(predictiveMaintenanceCostKsh),
      netSavingsKsh: round2(netSavingsKsh),
      netSavingsPercent: round2(netSavingsPercent),
    }
  },
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
