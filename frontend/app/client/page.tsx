import { ClientHeader } from "@/components/client/client-header"
import { ProductGrid } from "@/components/client/product-grid"
import { AIChat } from "@/components/client/ai-chat"

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover our collection or chat with our AI assistant for personalized recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductGrid />
          </div>
          <div className="lg:col-span-1">
            <AIChat />
          </div>
        </div>
      </main>
    </div>
  )
}
