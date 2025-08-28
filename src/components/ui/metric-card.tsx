"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  value: string | number
  label: string
  type: "bullish" | "bearish" | "neutral" | "accent"
  onClick?: () => void
  className?: string
}

export function MetricCard({ 
  value, 
  label, 
  type, 
  onClick,
  className 
}: MetricCardProps) {
  const getMetricStyles = (type: string) => {
    switch (type) {
      case "bullish":
        return { color: "status-bullish", glow: "glow-bullish" }
      case "bearish":
        return { color: "status-bearish", glow: "glow-bearish" }
      case "neutral":
        return { color: "status-neutral", glow: "glow-neutral" }
      case "accent":
      default:
        return { color: "status-accent", glow: "glow-accent" }
    }
  }

  const styles = getMetricStyles(type)
  
  return (
    <Card 
      className={cn(
        "glass-card relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <div className="console-indicator top-left" />
      
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className={cn("metric-value mb-2", styles.color, styles.glow)}>
          {value}
        </div>
        
        <div className="console-text text-xs text-muted-foreground">
          [{label}]
        </div>
      </CardContent>
    </Card>
  )
}