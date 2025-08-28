"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SentimentScoreProps {
  score: number
  change: number
  lastUpdated?: string
  className?: string
}

export function SentimentScore({ 
  score, 
  change, 
  lastUpdated,
  className 
}: SentimentScoreProps) {
  const getSentimentLevel = (score: number) => {
    if (score >= 70) return { level: "Bullish", color: "status-bullish", glow: "glow-bullish" }
    if (score >= 50) return { level: "Neutral", color: "status-neutral", glow: "glow-neutral" }
    return { level: "Bearish", color: "status-bearish", glow: "glow-bearish" }
  }

  const sentiment = getSentimentLevel(score)
  
  return (
    <Card className={cn("glass-card relative animate-pulse-glow", className)}>
      <div className="console-indicator top-left" />
      <div className="console-indicator top-right" />
      <div className="console-indicator bottom-left" />
      <div className="console-indicator bottom-right" />
      
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className={cn("metric-large mb-2", sentiment.color, sentiment.glow)}>
          {score}
        </div>
        
        <div className="console-text text-muted-foreground mb-3">
          {">>> SENTIMENT_ANALYSIS.exe"}
        </div>
        
        <Badge variant="outline" className={sentiment.color}>
          {sentiment.level}
        </Badge>
        
        <div className="flex items-center gap-2 mt-4 console-text">
          <span 
            className={cn(
              "text-sm font-medium",
              change >= 0 ? "status-bullish" : "status-bearish"
            )}
          >
            {change >= 0 ? "↗" : "↘"} {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">
            from yesterday
          </span>
        </div>
        
        {lastUpdated && (
          <div className="console-text text-xs text-muted-foreground mt-2">
            Last update: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}