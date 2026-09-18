import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { TeamSection } from "@/components/team-section"
import { StructuredData } from "@/components/structured-data"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AfriMaint builds AI-powered predictive maintenance software for manufacturers, miners, and processors across Africa.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <StructuredData />
      <Breadcrumbs items={[{ label: "About" }]} />

      <h1 className="mb-6 text-4xl font-bold">About {siteConfig.productName}</h1>

      <div className="space-y-4 mb-12">
        <p>
          {siteConfig.productName} builds predictive maintenance software for manufacturers, miners, and processors
          operating in Kenya and similar markets. Our goal is to turn machine sensor data into maintenance decisions
          that make financial sense, not just technical alerts.
        </p>
        <p>
          We&apos;re based in {siteConfig.registeredAddress.city}, {siteConfig.registeredAddress.country}, and
          building with the operating realities of African industry in mind — including inconsistent power,
          bandwidth constraints, and limited historical failure data.
        </p>
      </div>

      <h2 className="mb-6 text-2xl font-semibold">Our team</h2>
      <TeamSection />
    </main>
  )
}
