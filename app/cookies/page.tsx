import type { Metadata } from "next"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Cookie Policy | AfriMaint",
  description: "What AfriMaint does and does not use cookies for, and when a consent banner applies.",
}

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: <PlaceholderNotice>[NEEDS REAL DATE]</PlaceholderNotice></p>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Current status: no cookie consent banner is shown</h2>
        <p>
          This site currently uses <strong>Vercel Analytics</strong> for aggregate traffic measurement. As deployed
          here, Vercel Analytics does not set cookies and does not use persistent client-side identifiers to track
          individual visitors — it is exempt from cookie-consent requirements under both Kenya&apos;s Data Protection
          Act, 2019 and the EU/UK ePrivacy rules. For that reason, {siteConfig.productName} does not currently show a
          cookie consent banner, because there is nothing cookie-based to consent to.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">What would change this</h2>
        <p>
          If a third-party embed that sets cookies is added in the future — for example a Google Maps embed on the
          contact page, or an analytics tool like Google Analytics — this policy will be updated to name that
          service and its cookies, and a consent banner with granular opt-in (Necessary / Analytics / Marketing)
          will be shown to visitors before that service loads. That component already exists in the codebase
          (currently unmounted) and is activated the moment such an embed ships.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Strictly necessary items</h2>
        <p>
          Some non-cookie local storage may be used for essential site functionality, such as remembering your
          light/dark theme preference in your browser. This does not identify you personally and is not used for
          tracking or advertising.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Questions about this policy: <PlaceholderNotice>{siteConfig.contact.privacyEmail}</PlaceholderNotice>
        </p>
      </section>
    </main>
  )
}
