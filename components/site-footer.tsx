import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import { siteConfig } from "@/lib/site-config"

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund", label: "Refund Policy" },
]

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold mb-4">{siteConfig.productName}</h3>
            <p className="text-gray-400">AI-powered predictive maintenance solutions for African industries.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <PlaceholderNotice>{siteConfig.contact.supportEmail}</PlaceholderNotice>
              </li>
              <li>
                <PlaceholderNotice>{siteConfig.contact.phone}</PlaceholderNotice>
              </li>
              <li>
                <PlaceholderNotice>{siteConfig.registeredAddress.line1}</PlaceholderNotice>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} <PlaceholderNotice>{siteConfig.legalEntityName}</PlaceholderNotice>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
