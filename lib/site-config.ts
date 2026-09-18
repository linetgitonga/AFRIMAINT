// Single source of truth for business/legal details shown across the site
// (footer, legal pages, structured data). Every value below is a placeholder —
// replace all of them with real, verified information before launch.
export const siteConfig = {
  productName: "AfriMaint",
  legalEntityName: "[NEEDS REAL DATA — registered legal entity name, e.g. \"AfriMaint Ltd.\"]",
  businessRegistrationNumber: "[NEEDS REAL DATA — Kenya business registration / CR12 number]",
  dataProtectionRegistrationNumber:
    "[NEEDS REAL DATA — Office of the Data Protection Commissioner (ODPC) registration number]",
  registeredAddress: {
    line1: "[NEEDS REAL DATA — street address]",
    city: "Nairobi",
    country: "Kenya",
    postalCode: "[NEEDS REAL DATA — postal code]",
  },
  contact: {
    supportEmail: "[NEEDS REAL DATA — support email address]",
    privacyEmail: "[NEEDS REAL DATA — privacy/DPO contact email]",
    phone: "[NEEDS REAL DATA — support phone number]",
  },
  siteUrl: "[NEEDS REAL DATA — production domain, e.g. https://afrimaint.com]",
  euRepresentative: "[NEEDS REAL DATA — only required if the site knowingly serves EU/UK users at scale]",
  responseTimePromise: "[NEEDS REAL SLA — e.g. \"we respond to every inquiry within 1 business day\"]",
  mapEmbedQuery: "[NEEDS REAL DATA — office address to search for on the map, e.g. \"Westlands, Nairobi, Kenya\"]",
} as const

// Team roster for the About page. Empty by design — see components/team-section.tsx,
// which renders an explicit "needs real content" placeholder when this is empty rather
// than inventing names, bios, or headshots.
export const teamMembers: { name: string; role: string; photoUrl: string }[] = []

// siteConfig.siteUrl is a placeholder until a real domain is set; fall back to a
// syntactically valid URL so robots.txt/sitemap.xml don't ship broken links.
export function getSiteBaseUrl(): string {
  return siteConfig.siteUrl.startsWith("http") ? siteConfig.siteUrl : "https://example.com"
}
