import Link from "next/link"
import { Button } from "@/components/ui/button"

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Button asChild size="lg" className="w-full">
        <Link href="/contact">Get in touch</Link>
      </Button>
    </div>
  )
}
