import type { ModelVersion } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface ModelVersionRepository {
  listAll(): Promise<ModelVersion[]>
}

class PrismaModelVersionRepository implements ModelVersionRepository {
  async listAll(): Promise<ModelVersion[]> {
    return prisma.modelVersion.findMany({ orderBy: { createdAt: "asc" } })
  }
}

export const modelVersionRepository: ModelVersionRepository = new PrismaModelVersionRepository()
