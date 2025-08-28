"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StockOption {
  symbol: string
  name: string
  icon: string
  price: number
  change: number
}

interface StockSelectorProps {
  stocks: StockOption[]
  selectedStock: StockOption
  onStockChange: (stock: StockOption) => void
  className?: string
}

export function StockSelector({ 
  stocks, 
  selectedStock, 
  onStockChange,
  className 
}: StockSelectorProps) {
  return (
    <Card className={cn("glass-card relative", className)}>
      <div className="console-indicator top-left" />
      <div className="console-indicator top-right" />
      
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-card border border-primary/20 flex items-center justify-center text-2xl glow-bullish">
            {selectedStock.icon}
          </div>
          
          <div>
            <h2 className="text-xl font-bold">
              {selectedStock.name}
            </h2>
            <div className="flex items-center gap-3 console-text">
              <span className="status-accent">
                ${selectedStock.price.toFixed(2)}
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  selectedStock.change >= 0 ? "status-bullish" : "status-bearish"
                )}
              >
                {selectedStock.change >= 0 ? "↗" : "↘"} 
                {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="console-text">
              Switch Stock <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-card border-0">
            {stocks.map((stock) => (
              <DropdownMenuItem
                key={stock.symbol}
                onClick={() => onStockChange(stock)}
                className="console-text cursor-pointer"
              >
                <span className="mr-3 text-lg">{stock.icon}</span>
                <div className="flex flex-col">
                  <span>{stock.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ${stock.price.toFixed(2)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}