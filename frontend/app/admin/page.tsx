import { AdminHeader } from "@/components/admin/admin-header"
import { ProductsTable } from "@/components/admin/products-table"
import { StatsCards } from "@/components/admin/stats-cards"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and monitor system activity</p>
        </div>

        <StatsCards />
        <ProductsTable />
      </main>
    </div>
  )
}
