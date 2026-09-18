import type { Machine, Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"

// Interface + Prisma implementation, kept separate so a future backend (Django,
// per the migration plan) can swap the implementation without services or API
// routes changing — they only ever depend on this interface.
export interface MachineWithLatest extends Machine {
  latestPrediction: { failureProbability: number; timestamp: Date } | null
  latestSensorReading: {
    airTemperature: number
    processTemperature: number
    rotationalSpeed: number
    torque: number
    toolWear: number
    timestamp: Date
  } | null
  nextWorkOrder: { scheduledFor: Date | null; status: string } | null
}

export interface MachineRepository {
  listByOrganization(organizationId: string): Promise<MachineWithLatest[]>
  findById(id: string, organizationId: string): Promise<MachineWithLatest | null>
  create(data: Prisma.MachineUncheckedCreateInput): Promise<Machine>
}

class PrismaMachineRepository implements MachineRepository {
  async listByOrganization(organizationId: string): Promise<MachineWithLatest[]> {
    const machines = await prisma.machine.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      include: {
        predictions: { orderBy: { timestamp: "desc" }, take: 1 },
        sensorReadings: { orderBy: { timestamp: "desc" }, take: 1 },
        workOrders: {
          where: { status: { in: ["SCHEDULED", "IN_PROGRESS", "OVERDUE"] } },
          orderBy: { scheduledFor: "asc" },
          take: 1,
        },
      },
    })

    return machines.map(mapMachineWithLatest)
  }

  async findById(id: string, organizationId: string): Promise<MachineWithLatest | null> {
    const machine = await prisma.machine.findFirst({
      where: { id, organizationId },
      include: {
        predictions: { orderBy: { timestamp: "desc" }, take: 1 },
        sensorReadings: { orderBy: { timestamp: "desc" }, take: 1 },
        workOrders: {
          where: { status: { in: ["SCHEDULED", "IN_PROGRESS", "OVERDUE"] } },
          orderBy: { scheduledFor: "asc" },
          take: 1,
        },
      },
    })

    return machine ? mapMachineWithLatest(machine) : null
  }

  async create(data: Prisma.MachineUncheckedCreateInput): Promise<Machine> {
    return prisma.machine.create({ data })
  }
}

type MachineQueryResult = Prisma.MachineGetPayload<{
  include: {
    predictions: true
    sensorReadings: true
    workOrders: true
  }
}>

function mapMachineWithLatest(machine: MachineQueryResult): MachineWithLatest {
  const { predictions, sensorReadings, workOrders, ...rest } = machine
  const prediction = predictions[0]
  const reading = sensorReadings[0]
  const workOrder = workOrders[0]

  return {
    ...rest,
    latestPrediction: prediction
      ? { failureProbability: prediction.failureProbability, timestamp: prediction.timestamp }
      : null,
    latestSensorReading: reading
      ? {
          airTemperature: reading.airTemperature,
          processTemperature: reading.processTemperature,
          rotationalSpeed: reading.rotationalSpeed,
          torque: reading.torque,
          toolWear: reading.toolWear,
          timestamp: reading.timestamp,
        }
      : null,
    nextWorkOrder: workOrder ? { scheduledFor: workOrder.scheduledFor, status: workOrder.status } : null,
  }
}

export const machineRepository: MachineRepository = new PrismaMachineRepository()
