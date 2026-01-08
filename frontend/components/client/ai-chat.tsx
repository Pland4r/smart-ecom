"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, ShoppingCart, Star } from "lucide-react"
import { aiService } from "@/lib/services/ai.service"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  recommendations?: ProductRecommendation[]
}

interface ProductRecommendation {
  id: string
  name: string
  description: string
  category: string
  price: number
  image_url?: string
  stock: number
}

// Component to render individual product recommendation cards
function ProductRecommendationCard({ product }: { product: ProductRecommendation }) {
  return (
    <Card className="w-full max-w-sm bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-card-foreground line-clamp-1">
            {product.name}
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {product.category}
          </span>
        </div>
        <CardDescription className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-card-foreground">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ShoppingCart className="w-3 h-3" />
            {product.stock} in stock
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI shopping assistant. I can help you find the perfect products based on your needs. What are you looking for today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)
    setError("")

    try {
      // For now, we'll use a simple recommendation request
      // In a real implementation, you might want to parse the user's intent
      const response = await aiService.getProductRecommendations({
        preferences: [currentInput]
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.recommendations || `I couldn't find specific recommendations for "${currentInput}". Could you be more specific about what you're looking for?`,
        recommendations: response.products || []
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      }
      setMessages((prev) => [...prev, errorMessage])
      setError(err instanceof Error ? err.message : 'Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border h-[600px] flex flex-col sticky top-8">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>Ask me anything about our products</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-card-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Render product recommendation cards for assistant messages */}
                  {message.role === "assistant" && message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-3 space-y-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Recommended Products:
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {message.recommendations.map((product) => (
                          <ProductRecommendationCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2 w-full"
        >
          <Input
            placeholder="Ask about products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
