import { describe, expect, it } from "vitest"
import { diagnosticAgent, weibullConditionalFailProb } from "@/lib/agents/diagnostic-agent"

describe("diagnosticAgent.evaluate", () => {
  // Thresholds ported verbatim from the notebook's "CELL 8.6 — Machine Risk
  // Advisory Table": CRITICAL if HI>=0.85 or RUL<30; WARN if HI>=0.15 or
  // personalised_risk>=0.15 or RUL<100; otherwise OK.

  it("is CRITICAL when HI alone crosses 0.85, regardless of RUL", () => {
    const result = diagnosticAgent.evaluate({
      failureProbability: 0.9,
      toolWear: 50,
      pseudoRulWearMinutes: 500, // high RUL shouldn't matter once HI crosses the threshold
    })
    expect(result.alertLevel).toBe("CRITICAL")
  })

  it("is CRITICAL when RUL alone drops below 30 wear-minutes, regardless of HI", () => {
    const result = diagnosticAgent.evaluate({
      failureProbability: 0.05, // low HI shouldn't matter once RUL crosses the threshold
      toolWear: 50,
      pseudoRulWearMinutes: 20,
    })
    expect(result.alertLevel).toBe("CRITICAL")
  })

  it("is WARN when HI is between 0.15 and 0.85 with healthy RUL", () => {
    const result = diagnosticAgent.evaluate({
      failureProbability: 0.35,
      toolWear: 50,
      pseudoRulWearMinutes: 500,
    })
    expect(result.alertLevel).toBe("WARN")
  })

  it("is WARN when RUL is between 30 and 100 wear-minutes even with low HI", () => {
    const result = diagnosticAgent.evaluate({
      failureProbability: 0.05,
      toolWear: 50,
      pseudoRulWearMinutes: 80,
    })
    expect(result.alertLevel).toBe("WARN")
  })

  it("is OK only when HI is low, RUL is healthy, and personalised risk is low", () => {
    const result = diagnosticAgent.evaluate({
      failureProbability: 0.05,
      toolWear: 10, // low wear keeps P(fail in 60) low too
      pseudoRulWearMinutes: 500,
    })
    expect(result.alertLevel).toBe("OK")
  })

  it("gives CRITICAL a stop-machine action and WARN a schedule-maintenance action", () => {
    const critical = diagnosticAgent.evaluate({ failureProbability: 0.9, toolWear: 50, pseudoRulWearMinutes: 500 })
    const warn = diagnosticAgent.evaluate({ failureProbability: 0.35, toolWear: 50, pseudoRulWearMinutes: 500 })
    expect(critical.recommendedAction).toMatch(/stop machine/i)
    expect(warn.recommendedAction).toMatch(/schedule maintenance/i)
  })
})

describe("weibullConditionalFailProb", () => {
  // Ported from notebook cell 17 Step 4: P(fail within deltaT | survived to
  // current_wear) = 1 - exp(-[(w+dt)/eta]^beta + [w/eta]^beta).
  const beta = 1.974
  const eta = 187.7

  it("is 0 at zero elapsed time", () => {
    expect(weibullConditionalFailProb(50, 0, beta, eta)).toBeCloseTo(0, 6)
  })

  it("increases with more wear already accumulated (increasing hazard)", () => {
    const pLowWear = weibullConditionalFailProb(10, 60, beta, eta)
    const pHighWear = weibullConditionalFailProb(150, 60, beta, eta)
    expect(pHighWear).toBeGreaterThan(pLowWear)
  })

  it("stays within [0, 1]", () => {
    const p = weibullConditionalFailProb(180, 60, beta, eta)
    expect(p).toBeGreaterThanOrEqual(0)
    expect(p).toBeLessThanOrEqual(1)
  })
})
