"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  platform: string
  content: string
  sentiment: "bullish" | "bearish" | "neutral"
  sentimentScore: number
  author: string
  timestamp: string
  metrics: {
    likes?: number
    retweets?: number
    upvotes?: number
    comments?: number
    bullish?: number
    bearish?: number
  }
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "status-bullish"
      case "bearish":
        return "status-bearish"
      case "neutral":
        return "status-neutral"
      default:
        return "status-accent"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "🐦"
      case "reddit":
        return "📱"
      case "stocktwits":
        return "📊"
      default:
        return "💬"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    
    const minutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (minutes < 60) {
      return `${minutes.toString().padStart(2, '0')}:00`
    } else {
      const remainingMinutes = minutes % 60
      return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`
    }
  }

  const renderMetrics = (platform: string, metrics: ActivityItem['metrics']) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <>
            <span>LIKES: {metrics.likes || 0}</span>
            <span>RT: {metrics.retweets || 0}</span>
          </>
        )
      case "reddit":
        return (
          <>
            <span>UP: {metrics.upvotes || 0}</span>
            <span>COMM: {metrics.comments || 0}</span>
          </>
        )
      case "stocktwits":
        return (
          <>
            <span>BULL: {metrics.bullish || 0}</span>
            <span>BEAR: {metrics.bearish || 0}</span>
          </>
        )
      default:
        return <span>SCORE: {metrics.likes || 0}</span>
    }
  }

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between console-text">
          <span>{"📱 >>> DATA_STREAM.log"}</span>
          <Badge className="animate-blink status-bullish bg-transparent border-0">
            ● ONLINE
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "glass-card p-4 border-l-4 transition-all duration-300 hover:translate-x-1",
              activity.sentiment === "bullish" && "border-l-green-400/60",
              activity.sentiment === "bearish" && "border-l-red-400/60",
              activity.sentiment === "neutral" && "border-l-yellow-400/60"
            )}
            style={{
              animation: `slide-in 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between mb-3 console-text text-xs">
              <span className="status-accent">
                [{activity.platform.toUpperCase()}_API]
              </span>
              <span className="text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
            
            <p className="text-sm mb-3 leading-relaxed">
              {getPlatformIcon(activity.platform)} {activity.content}
            </p>
            
            <div className="flex items-center justify-between console-text text-xs">
              <div className="flex items-center gap-4 text-muted-foreground">
                {renderMetrics(activity.platform, activity.metrics)}
              </div>
              
              <Badge 
                variant="outline"
                className={cn("text-xs", getSentimentColor(activity.sentiment))}
              >
                [{activity.sentiment.toUpperCase()}: {activity.sentimentScore.toFixed(1)}/10]
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}