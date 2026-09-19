// Local development seed data only — never run against production.
// Creates one demo organization, one user per MVP role (Manager, Technician, Admin),
// and a handful of machines/readings/predictions/work orders so the dashboard has
// something real to render after login.
const { PrismaClient } = require("@prisma/client")
const { hashSync } = require("bcryptjs")

const prisma = new PrismaClient()

const DEMO_PASSWORD = "ChangeMe123!"

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: {
      id: "demo-org",
      name: "Demo Manufacturing Co.",
    },
  })

  await prisma.costMatrix.upsert({
    where: { id: "demo-org-default-cost-matrix" },
    update: {},
    create: {
      id: "demo-org-default-cost-matrix",
      organizationId: organization.id,
      name: "Default",
      hourlyUnits: 50,
      profitPerUnitKsh: 15,
      dailyWageKsh: 1200,
      shiftHours: 8,
      emergencyPartsCostKsh: 5000,
    },
  })

  const passwordHash = hashSync(DEMO_PASSWORD, 10)

  const [manager, technician, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "manager@afrimaint.local" },
      update: {},
      create: {
        organizationId: organization.id,
        name: "Demo Manager",
        email: "manager@afrimaint.local",
        passwordHash,
        role: "MANAGER",
      },
    }),
    prisma.user.upsert({
      where: { email: "tech@afrimaint.local" },
      update: {},
      create: {
        organizationId: organization.id,
        name: "Demo Technician",
        email: "tech@afrimaint.local",
        passwordHash,
        role: "TECHNICIAN",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@afrimaint.local" },
      update: {},
      create: {
        organizationId: organization.id,
        name: "Demo Admin",
        email: "admin@afrimaint.local",
        passwordHash,
        role: "ADMIN",
      },
    }),
  ])

  // Personal account for the project owner — own password, not the shared demo one.
  await prisma.user.upsert({
    where: { email: "linet@gmail.com" },
    update: {},
    create: {
      organizationId: organization.id,
      name: "Linet",
      email: "linet@gmail.com",
      passwordHash: hashSync("Test@123", 10),
      role: "ADMIN",
    },
  })

  const machinesData = [
    {
      code: "M-01",
      name: "Injection Molding Machine A",
      location: "Production Floor 1",
      type: "Injection Molding",
      status: "HEALTHY",
      failureProbability: 0.08,
      airTemperature: 26.5,
      processTemperature: 68,
      rotationalSpeed: 1500,
      torque: 40,
      toolWear: 45,
      workOrder: { priority: "LOW", daysFromNow: 12, status: "SCHEDULED" },
    },
    {
      code: "M-02",
      name: "CNC Lathe B",
      location: "Production Floor 2",
      type: "CNC Lathe",
      status: "ATTENTION",
      failureProbability: 0.35,
      airTemperature: 28,
      processTemperature: 82,
      rotationalSpeed: 1800,
      torque: 55,
      toolWear: 180,
      workOrder: { priority: "MEDIUM", daysFromNow: 3, status: "SCHEDULED" },
    },
    {
      code: "M-03",
      name: "Hydraulic Press C",
      location: "Production Floor 1",
      type: "Hydraulic Press",
      status: "CRITICAL",
      failureProbability: 0.82,
      airTemperature: 31,
      processTemperature: 95,
      rotationalSpeed: 900,
      torque: 78,
      toolWear: 220,
      workOrder: { priority: "URGENT", daysFromNow: -5, status: "OVERDUE" },
    },
    {
      code: "M-04",
      name: "Conveyor System D",
      location: "Assembly Line",
      type: "Conveyor",
      status: "HEALTHY",
      failureProbability: 0.12,
      airTemperature: 25,
      processTemperature: 72,
      rotationalSpeed: 600,
      torque: 20,
      toolWear: 30,
      workOrder: { priority: "LOW", daysFromNow: 8, status: "SCHEDULED" },
    },
  ]

  for (const m of machinesData) {
    const machine = await prisma.machine.upsert({
      where: { organizationId_code: { organizationId: organization.id, code: m.code } },
      update: {},
      create: {
        organizationId: organization.id,
        code: m.code,
        name: m.name,
        location: m.location,
        type: m.type,
        status: m.status,
        installationDate: new Date("2023-01-01"),
      },
    })

    await prisma.sensorReading.create({
      data: {
        machineId: machine.id,
        airTemperature: m.airTemperature,
        processTemperature: m.processTemperature,
        rotationalSpeed: m.rotationalSpeed,
        torque: m.torque,
        toolWear: m.toolWear,
      },
    })

    await prisma.prediction.create({
      data: {
        machineId: machine.id,
        failureProbability: m.failureProbability,
        threshold: 0.5,
      },
    })

    const scheduledFor = new Date()
    scheduledFor.setDate(scheduledFor.getDate() + m.workOrder.daysFromNow)

    await prisma.workOrder.create({
      data: {
        machineId: machine.id,
        assignedTechnicianId: technician.id,
        priority: m.workOrder.priority,
        status: m.workOrder.status,
        scheduledFor,
      },
    })
  }

  // ModelVersion rows reflect the notebook's own reported metrics — including the
  // components that do NOT meet their target and are explicitly not shipped. This
  // feeds the Admin > Models honesty table (app/(dashboard)/admin/models/page.tsx)
  // rather than presenting the concept note's claims as if all were validated.
  const modelVersions = [
    {
      id: "xgb-classifier-ai4i-v1",
      name: "AI4I XGBoost + SMOTE Classifier",
      type: "CLASSIFIER",
      isActive: false, // becomes true once ml-service/models/ai4i_xgb.pkl is provided
      metrics: {
        f1: 0.8599,
        threshold: 0.93,
        target: 0.8,
        status: "beats target",
        dataset: "AI4I 2020",
      },
    },
    {
      id: "weibull-vae-ai4i-v1",
      name: "Weibull-VAE (unconditioned)",
      type: "GENERATOR",
      isActive: false, // becomes true once ml-service/models/vae_ai4i.pt is provided
      metrics: {
        frechetDistance: 0.0688,
        frechetTarget: 0.15,
        tstrF1Gap: 0.125,
        tstrGapTarget: 0.05,
        status: "Frechet PASS, TSTR gap FAILS own criterion",
        usage: "augmentation/visualization only, not a standalone training substitute",
      },
    },
    {
      id: "cvae-cold-start-ai4i-v1",
      name: "Conditional VAE (CVAE) cold-start",
      type: "GENERATOR",
      isActive: false, // intentionally never activated — see metrics.verdict
      metrics: {
        frechetDistance: 0.064,
        vanillaVaeFrechetDistance: 0.031,
        tstrF1: 0.301,
        vanillaVaeTstrF1: 0.806,
        verdict: "underperforms the unconditioned VAE on the notebook's own ablation — NOT shipped as the cold-start path",
      },
    },
    {
      id: "cold-start-k-sweep-ai4i-v1",
      name: "Cold-start k-sweep (beta alternative)",
      type: "CLASSIFIER",
      isActive: false,
      metrics: {
        f1Range: "0.72-0.74",
        coldStartTarget: 0.7,
        status: "marginal pass, beta only",
        note: "use instead of CVAE if a cold-start path must ship for the pilot; re-validate per real pilot machine type",
      },
    },
    {
      id: "wiener-rul-v1",
      name: "Wiener-process RUL Estimator",
      type: "RUL",
      isActive: true, // fully implemented in ml-service, no trained artifact needed
      metrics: {
        weibullBeta: 1.974,
        weibullEta: 187.7,
        note: "population-level Weibull fit; single-snapshot AI4I data means every machine starts in the prior-dominated regime until real per-machine time series accumulate",
      },
    },
  ]

  for (const mv of modelVersions) {
    await prisma.modelVersion.upsert({
      where: { id: mv.id },
      update: {},
      create: mv,
    })
  }

  console.log("Seed complete.")
  console.log("Demo accounts (password for all: %s):", DEMO_PASSWORD)
  console.log("  Manager:    manager@afrimaint.local")
  console.log("  Technician: tech@afrimaint.local")
  console.log("  Admin:      admin@afrimaint.local")
  console.log("  Owner:      linet@gmail.com (password: Test@123)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
