import type { Metadata } from "next"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Refund Policy | AfriMaint",
  description: "Subscription cancellation and refund terms for the AfriMaint predictive maintenance service.",
}

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: <PlaceholderNotice>[NEEDS REAL DATE]</PlaceholderNotice></p>

      <section className="space-y-4 mb-10">
        <p>
          {siteConfig.productName} is a subscription software service, not a physical or one-time digital purchase —
          the terms below reflect that. This page will be finalized with real values before the Service launches
          commercially; nothing here should be treated as a binding offer until then.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Free trial</h2>
        <p>
          If a free trial is offered, no payment is collected during the trial period and no refund is applicable to
          it. Trial length: <PlaceholderNotice>[NEEDS REAL DATA]</PlaceholderNotice>.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Cancellation</h2>
        <p>
          You may cancel your subscription at any time. Cancellation stops future billing; it does not itself
          retroactively refund the current billing period unless stated otherwise below.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Refunds</h2>
        <p>
          Refund window and pro-rata terms: <PlaceholderNotice>[NEEDS REAL DATA — e.g. "full refund within 14 days of
          first payment; pro-rata refund for unused months on annual plans cancelled early"]</PlaceholderNotice>.
        </p>
        <p>
          Refunds, where applicable, are issued to the original payment method within a reasonable time after
          approval.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Service issues</h2>
        <p>
          If the Service fails to perform materially as described in your order form for a sustained period, contact
          us — service-credit or refund remedies for verified outages will be handled case by case and documented in
          your service agreement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Billing questions: <PlaceholderNotice>{siteConfig.contact.supportEmail}</PlaceholderNotice>
        </p>
      </section>
    </main>
  )
}
