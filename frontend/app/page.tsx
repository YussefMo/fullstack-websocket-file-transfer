import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Header */}
      <header className="container flex items-center justify-end p-4">
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 container flex flex-col items-center justify-center max-w-5xl py-12">
        <div className="text-center space-y-8 w-full max-w-2xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/80 text-xs font-medium">
            WebSocket File Transfer
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Transfer files securely</h1>

          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Fast, reliable, and efficient file transfers with our Axum server.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/send">
              <Button size="lg" className="w-full sm:w-auto group px-6 py-6 rounded-xl hover-lift">
                Send Files
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/receive">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 py-6 rounded-xl hover-lift glass">
                Receive Files
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          <div className="p-6 rounded-xl subtle-border hover-lift bg-background/50">
            <div className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">End-to-End Encrypted</h3>
            <p className="text-muted-foreground text-sm">
              Your files are encrypted during transfer and never stored on any server.
            </p>
          </div>

          <div className="p-6 rounded-xl subtle-border hover-lift bg-background/50">
            <div className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              WebSocket connections provide the fastest possible transfer speeds.
            </p>
          </div>

          <div className="p-6 rounded-xl subtle-border hover-lift bg-background/50">
            <div className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Size Limits</h3>
            <p className="text-muted-foreground text-sm">
              Transfer files of any size without the restrictions of email or cloud storage.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-6 text-center text-sm text-muted-foreground">
        <p>No registration required. Files are transferred through our secure Axum server.</p>
      </footer>
    </div>
  )
}

