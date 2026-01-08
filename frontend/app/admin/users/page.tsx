import { AdminHeader } from "@/components/admin/admin-header"
import { UsersTable } from "@/components/admin/users-table"

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">View and manage registered users</p>
        </div>

        <UsersTable />
      </main>
    </div>
  )
}
