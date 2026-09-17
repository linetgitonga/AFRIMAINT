import type { MetadataRoute } from "next"
import { getSiteBaseUrl } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteBaseUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
