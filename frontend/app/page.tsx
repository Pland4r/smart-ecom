import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ShoppingBag, Users, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Product Hub</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
            AI-Powered Product Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance">
            Intelligent Product Discovery with <span className="text-primary">AI Assistance</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Manage your product catalog and let our AI agent help customers find exactly what they need through natural
            conversation.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-base">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Product Management</h3>
            <p className="text-muted-foreground">
              Complete CRUD operations for managing your product catalog with an intuitive admin interface.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">AI Chat Agent</h3>
            <p className="text-muted-foreground">
              Intelligent conversational AI that understands customer needs and recommends the perfect products.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Secure authentication with separate admin and client roles for streamlined workflows.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Ready to transform your product management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses using AI to enhance their customer experience.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-base">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 AI Product Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
