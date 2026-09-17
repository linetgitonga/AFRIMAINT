import type { Metadata } from "next"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms & Conditions | AfriMaint",
  description: "The terms governing use of AfriMaint's predictive maintenance service, subscriptions, and website.",
}

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: <PlaceholderNotice>[NEEDS REAL DATE]</PlaceholderNotice></p>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">1. Agreement</h2>
        <p>
          These Terms & Conditions govern your use of the {siteConfig.productName} website and, once available, the{" "}
          {siteConfig.productName} subscription service (&quot;Service&quot;), provided by{" "}
          <PlaceholderNotice>{siteConfig.legalEntityName}</PlaceholderNotice> (&quot;we&quot;, &quot;us&quot;). By
          using the site or Service, you agree to these terms.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">2. The Service</h2>
        <p>
          {siteConfig.productName} is a predictive-maintenance software service for industrial and manufacturing
          organizations. Features described on this site that are not yet available are marked as such; nothing on
          this site constitutes a guarantee of specific savings, uptime, or accuracy figures unless stated in a
          signed service agreement.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">3. Subscriptions and billing</h2>
        <p>
          Subscription plans, pricing, and billing cycles will be set out in an order form or in-product checkout
          once the Service launches commercially. See our{" "}
          <a href="/refund" className="underline underline-offset-4">Refund Policy</a> for cancellation and refund
          terms.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">4. Acceptable use</h2>
        <p>
          You agree not to misuse the Service, including attempting to access data belonging to another
          organization, reverse-engineering the software, or using the Service in a way that violates applicable
          law.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">5. Data ownership</h2>
        <p>
          Machine, sensor, and operational data you submit to the Service remains your property. We process it only
          to provide and improve the Service, as described in our{" "}
          <a href="/privacy" className="underline underline-offset-4">Privacy Policy</a>.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">6. Disclaimers and limitation of liability</h2>
        <p>
          Predictive maintenance outputs (failure probability, remaining useful life, cost estimates) are
          decision-support tools, not guarantees. To the maximum extent permitted by law, we are not liable for
          indirect, incidental, or consequential damages arising from reliance on these outputs. Nothing in these
          terms limits liability that cannot be limited under Kenyan law.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">7. Governing law</h2>
        <p>
          These terms are governed by the laws of Kenya. Disputes will be subject to the exclusive jurisdiction of
          the courts of Kenya, without prejudice to any mandatory consumer-protection rights you may have in your
          own jurisdiction.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Contact</h2>
        <p>
          Questions about these terms: <PlaceholderNotice>{siteConfig.contact.supportEmail}</PlaceholderNotice>
        </p>
      </section>
    </main>
  )
}
