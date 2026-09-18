import { getSiteBaseUrl, siteConfig } from "@/lib/site-config"

// Renders schema.org JSON-LD sourced from lib/site-config.ts. Field values are
// placeholders until real business details are filled in there — the markup is
// syntactically valid either way, but should not be trusted for real SEO/rich-results
// purposes until those placeholders are replaced.
export function StructuredData() {
  const baseUrl = getSiteBaseUrl()

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.productName,
    legalName: siteConfig.legalEntityName,
    url: baseUrl,
    email: siteConfig.contact.supportEmail,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.registeredAddress.line1,
      addressLocality: siteConfig.registeredAddress.city,
      postalCode: siteConfig.registeredAddress.postalCode,
      addressCountry: siteConfig.registeredAddress.country,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
