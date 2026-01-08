"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"

export function ClientHeader() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/client" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-card-foreground">AI Product Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <Button variant="ghost" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </Button>
            <Button variant="ghost" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
