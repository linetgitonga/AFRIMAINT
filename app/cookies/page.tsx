import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What AfriMaint does and does not use cookies for, and how the consent banner works.",
}

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <Breadcrumbs items={[{ label: "Cookie Policy" }]} />
      <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: <PlaceholderNotice>[NEEDS REAL DATE]</PlaceholderNotice></p>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">What we use</h2>
        <p>
          <strong>Vercel Analytics</strong> provides aggregate traffic measurement on this site. As deployed here, it
          does not set cookies and does not use persistent identifiers to track individual visitors — it is exempt
          from cookie-consent requirements under both Kenya&apos;s Data Protection Act, 2019 and the EU/UK ePrivacy
          rules.
        </p>
        <p>
          Our <a href="/contact" className="underline underline-offset-4">Contact</a> page offers an embedded Google
          Map of our office. Google Maps sets its own cookies once loaded, so the map is not loaded automatically —
          it only loads after you click &quot;Load map&quot; or accept cookies in the banner below.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">The cookie preference banner</h2>
        <p>
          Because of the Maps embed above, we show a cookie preference banner with three categories:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Necessary</strong> — always on; nothing cookie-based is currently required for core site function.</li>
          <li><strong>Analytics</strong> — reserved for future use; not currently tied to any cookie-based analytics tool.</li>
          <li><strong>Marketing</strong> — covers the Google Maps embed on the Contact page.</li>
        </ul>
        <p>
          Your choice is stored in your browser only (not on our servers) and you can change it at any time by
          clearing your browser&apos;s local storage for this site.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Strictly necessary items</h2>
        <p>
          Some non-cookie local storage is used for essential site functionality, such as remembering your
          light/dark theme preference and your cookie choice itself. This does not identify you personally and is
          not used for tracking or advertising.
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
