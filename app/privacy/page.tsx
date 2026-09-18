import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AfriMaint collects, uses, and protects personal data, including compliance with Kenya's Data Protection Act 2019 and GDPR-baseline rights for international visitors.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: <PlaceholderNotice>[NEEDS REAL DATE]</PlaceholderNotice></p>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">1. Who we are</h2>
        <p>
          {siteConfig.productName} is operated by <PlaceholderNotice>{siteConfig.legalEntityName}</PlaceholderNotice>,
          registered at <PlaceholderNotice>{siteConfig.registeredAddress.line1}, {siteConfig.registeredAddress.city},{" "}
          {siteConfig.registeredAddress.country}</PlaceholderNotice>. For any privacy question, contact{" "}
          <PlaceholderNotice>{siteConfig.contact.privacyEmail}</PlaceholderNotice>.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">2. What we collect today</h2>
        <p>
          As currently deployed, this website uses Vercel Analytics for aggregate, cookieless traffic measurement — it
          does not use cookies, does not collect personally identifiable information, and does not track individual
          visitors across sites. No account, sensor, or operational data is collected yet because those features
          have not launched.
        </p>
        <p>
          This section will be updated as new features go live — for example, submitting the contact/inquiry form
          collects the name, email or phone number, company, and message you provide, only for the purpose of
          responding to your inquiry.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">3. Legal basis for processing</h2>
        <p>
          Where we process personal data, we rely on: your consent (e.g. submitting a contact form), our legitimate
          interest in responding to inquiries and operating the site securely, and, once account features launch,
          performance of a contract with you or your organization.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">4. Kenya Data Protection Act, 2019</h2>
        <p>
          {siteConfig.productName} intends to comply with Kenya&apos;s Data Protection Act, 2019 and its regulations.
          Data Protection Commissioner (ODPC) registration number:{" "}
          <PlaceholderNotice>{siteConfig.dataProtectionRegistrationNumber}</PlaceholderNotice>. You have the right to
          access, correct, delete, or object to processing of your personal data, and to lodge a complaint with the
          ODPC.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">5. GDPR baseline (international visitors)</h2>
        <p>
          For visitors from the EU/UK, we apply a GDPR-consistent baseline: a documented lawful basis for each
          processing activity, data minimization, and the rights to access, rectify, erase, restrict, or port your
          data, and to object to processing. To exercise these rights, contact{" "}
          <PlaceholderNotice>{siteConfig.contact.privacyEmail}</PlaceholderNotice>. EU representative (if required):{" "}
          <PlaceholderNotice>{siteConfig.euRepresentative}</PlaceholderNotice>.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">6. Cookies</h2>
        <p>
          See our <a href="/cookies" className="underline underline-offset-4">Cookie Policy</a> for a full account of
          what is and is not set on this site today.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">7. Data retention and security</h2>
        <p>
          We retain personal data only as long as necessary for the purpose it was collected. Security measures
          (encryption in transit, access controls, etc.) will be documented here as each corresponding feature is
          built and deployed — we do not describe protections that are not yet in place.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Contact</h2>
        <p>
          Questions about this policy: <PlaceholderNotice>{siteConfig.contact.privacyEmail}</PlaceholderNotice>
        </p>
      </section>
    </main>
  )
}
