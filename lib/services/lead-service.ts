import { leadRepository } from "@/lib/repositories/lead-repository"
import type { ContactFormValues } from "@/lib/schemas/contact"

export const leadService = {
  submitInquiry(input: ContactFormValues) {
    return leadRepository.create({
      name: input.name,
      email: input.email,
      company: input.company || undefined,
      message: input.message,
    })
  },
}
