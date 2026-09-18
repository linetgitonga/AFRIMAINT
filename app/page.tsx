import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaqAccordion } from "@/components/faq-accordion"
import { CaseStudyCard } from "@/components/case-study-card"
import { StickyMobileCta } from "@/components/sticky-mobile-cta"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "AfriMaint — AI Predictive Maintenance for African Manufacturers",
  description:
    "Predict machine failures before they happen. AfriMaint brings AI-powered predictive maintenance to African manufacturing, mining, and processing industries.",
}

const faqs = [
  {
    question: "What does AfriMaint actually predict?",
    answer:
      "AfriMaint analyzes sensor data (temperature, vibration, tool wear, and similar signals) to estimate the probability of failure and the remaining useful life of a machine, so maintenance can be scheduled before a breakdown happens.",
  },
  {
    question: "Do I need to already have sensors installed?",
    answer:
      "No. Part of onboarding is helping you identify which machines and signals matter most and getting sensors deployed on them.",
  },
  {
    question: "How does AfriMaint handle machines with little failure history?",
    answer:
      "We use statistical and generative modeling techniques to work with limited historical data, and accuracy improves as more real operating data is collected from your machines over time.",
  },
  {
    question: "Does AfriMaint work with unreliable power or internet connectivity?",
    answer:
      "The product is being built with offline-first, low-bandwidth use in mind, since that's the operating reality for many African manufacturers — this is an active area of development.",
  },
  {
    question: "What does it cost?",
    answer:
      "Pricing depends on the number of machines and sensors involved. Reach out through our contact page and we'll walk through it with you directly.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20 dark:from-green-950 dark:to-blue-950 md:pb-0">
      {/* Hero Section — above the fold */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Maintenance Solutions
          </Badge>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-6xl">
            Predictive maintenance built for African industry
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
            AfriMaint helps manufacturers catch machine failures before they cause downtime — with predictions
            translated into real Kenyan Shilling cost impact, not just an anomaly score.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link href="/contact">Talk to us</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {siteConfig.responseTimePromise}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Why manufacturers choose AfriMaint
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Built for accurate machine fault detection, tailored for African industrial environments.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI-Powered Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Machine learning models analyze vibration, temperature, and wear data to flag maintenance needs
                before failures occur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏭</span>
                Industry Optimized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Designed for African manufacturing, mining, and processing industries, with local environmental
                considerations in mind.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Real-Time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Continuous monitoring with alerts intended to minimize downtime and support proactive scheduling.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Cost Translated to KSH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Predictions are translated into Kenyan Shilling cost impact, so decisions can be made in financial
                terms, not just technical ones.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Local Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with an understanding of local power, connectivity, and operational realities in mind.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Actionable Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboards and reports built to support day-to-day maintenance and operational decision-making.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Simple, powerful, and effective maintenance prediction in three steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Install Sensors</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deploy sensors on your machinery to collect real-time data on vibration, temperature, and
                performance.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Models continuously analyze the data to detect anomalies and estimate failure risk.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Take Action</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive alerts and recommendations, so maintenance can be scheduled proactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section (placeholder-scaffolded) */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Results</h2>
        </div>
        <div className="mx-auto max-w-2xl">
          <CaseStudyCard />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center text-white md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Transform Your Maintenance Strategy?</h2>
          <p className="mb-8 text-xl opacity-90">Bring AI-powered predictive maintenance to your operation.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="px-8 py-3 text-lg">
              <Link href="/contact">Talk to sales</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-green-600"
            >
              <Link href="/about">Learn about us</Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyMobileCta />
    </div>
  )
}
