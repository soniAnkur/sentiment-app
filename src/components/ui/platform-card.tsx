"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PlatformCardProps {
  name: string
  icon: string
  mentions: number
  onClick?: () => void
  className?: string
}

export function PlatformCard({ 
  name, 
  icon, 
  mentions, 
  onClick,
  className 
}: PlatformCardProps) {
  const formatMentions = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card 
      className={cn(
        "glass-card relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <div className="console-indicator top-left" />
      
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        <div className="text-2xl mb-3 animate-float">
          {icon}
        </div>
        
        <div className="console-text text-xs font-semibold mb-2">
          [{name}]
        </div>
        
        <Badge variant="secondary" className="console-text">
          {formatMentions(mentions)} signals
        </Badge>
      </CardContent>
    </Card>
  )
}