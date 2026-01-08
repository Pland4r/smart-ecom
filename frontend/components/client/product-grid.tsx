"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart } from "lucide-react"
import { Product, productService } from "@/lib/services/product.service"

export function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      // Filter only active products for client view
      setProducts(data.filter(product => product.is_active))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading products...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              {searchQuery ? "No products found matching your search." : "No products available."}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="bg-card border-border overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-card-foreground">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  {product.stock === 0 && (
                    <p className="text-sm text-red-500 mt-2">Out of stock</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2" 
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
