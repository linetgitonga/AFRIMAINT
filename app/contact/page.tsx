import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ContactForm } from "@/components/contact-form"
import { MapEmbed } from "@/components/map-embed"
import { StructuredData } from "@/components/structured-data"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AfriMaint team about predictive maintenance for your operation.",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <StructuredData />
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <h1 className="mb-2 text-4xl font-bold">Contact Us</h1>
      <p className="mb-10 text-muted-foreground">{siteConfig.responseTimePromise}</p>

      <div className="mb-12">
        <ContactForm />
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Our office</h2>
      <MapEmbed />
    </main>
  )
}
