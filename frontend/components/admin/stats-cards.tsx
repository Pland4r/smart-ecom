"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, MessageSquare, TrendingUp } from "lucide-react"
import { productService } from "@/lib/services/product.service"
import { userService } from "@/lib/services/user.service"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeUsers: 0,
    totalUsers: 0,
    activeProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [products, users] = await Promise.all([
        productService.getProducts(),
        userService.getUsers(),
      ])

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.is_active).length,
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts.toString(),
      change: `${stats.activeProducts} active`,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toString(),
      change: `${stats.activeUsers} active`,
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Active Products",
      value: loading ? "..." : stats.activeProducts.toString(),
      change: `${Math.round((stats.activeProducts / Math.max(stats.totalProducts, 1)) * 100)}% active`,
      icon: MessageSquare,
      color: "text-chart-3",
    },
    {
      title: "Active Users",
      value: loading ? "..." : stats.activeUsers.toString(),
      change: `${Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}% active`,
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-chart-4">{stat.change}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
