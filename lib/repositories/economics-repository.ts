import type { CostMatrix, EconomicReport, Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface EconomicsRepository {
  getDefaultCostMatrix(organizationId: string): Promise<CostMatrix | null>
  updateCostMatrix(id: string, organizationId: string, data: Prisma.CostMatrixUpdateInput): Promise<CostMatrix | null>
  createReport(data: Prisma.EconomicReportUncheckedCreateInput): Promise<EconomicReport>
  listReportsByOrganization(organizationId: string): Promise<EconomicReport[]>
}

class PrismaEconomicsRepository implements EconomicsRepository {
  async getDefaultCostMatrix(organizationId: string): Promise<CostMatrix | null> {
    return prisma.costMatrix.findFirst({ where: { organizationId }, orderBy: { createdAt: "asc" } })
  }

  async updateCostMatrix(
    id: string,
    organizationId: string,
    data: Prisma.CostMatrixUpdateInput
  ): Promise<CostMatrix | null> {
    const existing = await prisma.costMatrix.findFirst({ where: { id, organizationId } })
    if (!existing) return null
    return prisma.costMatrix.update({ where: { id }, data })
  }

  async createReport(data: Prisma.EconomicReportUncheckedCreateInput): Promise<EconomicReport> {
    return prisma.economicReport.create({ data })
  }

  async listReportsByOrganization(organizationId: string): Promise<EconomicReport[]> {
    return prisma.economicReport.findMany({
      where: { machine: { organizationId } },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { machine: { select: { name: true } } },
    })
  }
}

export const economicsRepository: EconomicsRepository = new PrismaEconomicsRepository()
