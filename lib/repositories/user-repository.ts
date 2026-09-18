import type { User } from "@prisma/client"
import { prisma } from "@/lib/db"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
}

class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  }
}

export const userRepository: UserRepository = new PrismaUserRepository()
