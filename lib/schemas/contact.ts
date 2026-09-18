import { z } from "zod"

// Data-minimized: only fields actually needed to respond to an inquiry.
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(5000),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted about your inquiry",
  }),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
