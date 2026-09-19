import type { ModelVersion } from "@prisma/client"
import { modelVersionRepository } from "@/lib/repositories/model-version-repository"

export const modelVersionService = {
  listAll(): Promise<ModelVersion[]> {
    return modelVersionRepository.listAll()
  },
}
