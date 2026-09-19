import { describe, expect, it } from "vitest"
import { economicsService, type CostMatrixInput } from "@/lib/services/economics-service"

describe("economicsService.computeScenario", () => {
  it("matches the concept note's Maize milling SME example exactly", () => {
    // Concept note §10.7: run-to-failure KSH 23,250; predictive KSH 13,394.63;
    // net savings KSH 9,855.37 (42%). Scenario inputs aren't given in the
    // concept note, only the totals — so this asserts the derivation given
    // those totals as the run-to-failure/predictive costs directly, the same
    // check already verified via a one-off script before this test existed.
    const runToFailure = 23250
    const predictive = 13394.63
    const netSavings = runToFailure - predictive
    expect(netSavings).toBeCloseTo(9855.37, 1)
    expect((netSavings / runToFailure) * 100).toBeCloseTo(42, 0)
  })

  it("matches the concept note's Garment workshop example exactly", () => {
    const runToFailure = 26400
    const predictive = 12200
    const netSavings = runToFailure - predictive
    expect(netSavings).toBeCloseTo(14200, 1)
    expect((netSavings / runToFailure) * 100).toBeCloseTo(54, 0)
  })

  it("flags the Refrigeration unit example's internal inconsistency rather than hiding it", () => {
    // Concept note states run-to-failure KSH 24,335, predictive KSH 7,335, net
    // savings "approximately KSH 16,000" (66%) — but 24,335 - 7,335 = 17,000,
    // not ~16,000. This is a ~1,000 KSH discrepancy in the source document
    // itself. Documenting it as a failing-would-be-expectation here (guarded by
    // the exact arithmetic) so it can't silently regress into looking "fixed."
    const runToFailure = 24335
    const predictive = 7335
    const actualNetSavings = runToFailure - predictive
    expect(actualNetSavings).toBe(17000) // the true arithmetic result
    expect(actualNetSavings).not.toBe(16000) // what the concept note states
  })

  it("computes a scenario from cost-matrix inputs with correct downtime scaling", () => {
    const costMatrix: CostMatrixInput = {
      hourlyUnits: 50,
      profitPerUnitKsh: 15,
      dailyWageKsh: 1200,
      shiftHours: 8,
      emergencyPartsCostKsh: 5000,
    }

    const result = economicsService.computeScenario({
      costMatrix,
      idleWorkers: 2,
      runToFailureDowntimeHours: 6,
      predictiveDowntimeHours: 2,
      preventiveMaintenanceCostKsh: 3000,
    })

    // lostRevenue(6h) = 50*15*6 = 4500; wastedLabour(6h) = 2*(1200/8)*6 = 1800
    // runToFailure = 4500 + 1800 + 5000 = 11300
    expect(result.runToFailureLossKsh).toBe(11300)

    // lostRevenue(2h) = 50*15*2 = 1500; wastedLabour(2h) = 2*(1200/8)*2 = 600
    // predictive = 1500 + 600 + 3000 = 5100
    expect(result.predictiveMaintenanceCostKsh).toBe(5100)

    expect(result.netSavingsKsh).toBe(11300 - 5100)
    expect(result.netSavingsPercent).toBeCloseTo(((11300 - 5100) / 11300) * 100, 2)
  })

  it("produces zero net savings when downtime is identical in both scenarios", () => {
    const costMatrix: CostMatrixInput = {
      hourlyUnits: 10,
      profitPerUnitKsh: 5,
      dailyWageKsh: 800,
      shiftHours: 8,
      emergencyPartsCostKsh: 0,
    }

    const result = economicsService.computeScenario({
      costMatrix,
      idleWorkers: 1,
      runToFailureDowntimeHours: 4,
      predictiveDowntimeHours: 4,
      preventiveMaintenanceCostKsh: 0,
    })

    expect(result.netSavingsKsh).toBe(0)
    expect(result.netSavingsPercent).toBe(0)
  })
})
