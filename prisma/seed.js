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

  console.log("Seed complete.")
  console.log("Demo accounts (password for all: %s):", DEMO_PASSWORD)
  console.log("  Manager:    manager@afrimaint.local")
  console.log("  Technician: tech@afrimaint.local")
  console.log("  Admin:      admin@afrimaint.local")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
