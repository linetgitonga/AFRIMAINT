import type { Prediction, Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface PredictionRepository {
  create(data: Prisma.PredictionUncheckedCreateInput): Promise<Prediction>
}

class PrismaPredictionRepository implements PredictionRepository {
  async create(data: Prisma.PredictionUncheckedCreateInput): Promise<Prediction> {
    return prisma.prediction.create({ data })
  }
}

export const predictionRepository: PredictionRepository = new PrismaPredictionRepository()
