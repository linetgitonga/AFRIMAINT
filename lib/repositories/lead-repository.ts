import type { Lead, Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface LeadRepository {
  create(data: Prisma.LeadCreateInput): Promise<Lead>
}

class PrismaLeadRepository implements LeadRepository {
  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return prisma.lead.create({ data })
  }
}

export const leadRepository: LeadRepository = new PrismaLeadRepository()
