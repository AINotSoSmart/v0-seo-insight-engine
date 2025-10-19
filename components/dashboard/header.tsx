import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-500">
          SEO Insight Engine
        </Link>
        <div className="flex gap-4">
          <Link href="/api/auth/logout">
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
