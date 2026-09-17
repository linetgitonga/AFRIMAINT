import type { MetadataRoute } from "next"
import { getSiteBaseUrl } from "@/lib/site-config"

const publicRoutes = ["/", "/landing", "/privacy", "/terms", "/cookies", "/refund"]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl()

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
