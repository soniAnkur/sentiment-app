"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityFeed, ActivityItem } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData } from "@/lib/actions"
import type { MentionData } from "@/lib/types"

export function BearishDetails() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBearishData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 20)
        // Filter for bearish sentiment only
        const bearishMentions = mentions.filter(m => m.sentiment === 'bearish')
        
        // If no bearish mentions from API, show empty state
        if (bearishMentions.length === 0) {
          setActivities([{
            id: 'no-bearish',
            platform: 'system',
            content: 'No bearish sentiment found in recent mentions. This could indicate positive market sentiment for the selected stock.',
            sentiment: 'neutral' as const,
            sentimentScore: 5.0,
            author: 'System',
            timestamp: new Date().toISOString(),
            metrics: {}
          }])
          return
        }
        setActivities(bearishMentions.slice(0, 10).map(mention => ({
          id: mention.id,
          platform: mention.platform,
          content: mention.content,
          sentiment: mention.sentiment,
          sentimentScore: mention.sentimentScore,
          author: mention.author,
          timestamp: mention.timestamp,
          metrics: mention.metadata
        })))
      } catch (error) {
        console.error('Error loading bearish data:', error)
        // Show system message on error
        setActivities([{
          id: 'error-loading',
          platform: 'system',
          content: 'Unable to load bearish sentiment data at this time. Please try again later.',
          sentiment: 'neutral' as const,
          sentimentScore: 5.0,
          author: 'System',
          timestamp: new Date().toISOString(),
          metrics: {}
        }])
      } finally {
        setLoading(false)
      }
    }

    loadBearishData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading bearish sentiment data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Bearish Overview */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {">>> BEARISH_METRICS.exe"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="metric-large status-bearish glow-bearish mb-2">
                18%
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [BEARISH_RATIO]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bearish glow-bearish mb-2">
                576
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [NEGATIVE_MENTIONS]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bearish glow-bearish mb-2">
                6.2
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [AVG_CONCERN_LEVEL]
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[TWITTER_BEARISH]</span>
                <span>15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[REDDIT_BEARISH]</span>
                <span>22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[STOCKTWITS_BEARISH]</span>
                <span>19%</span>
              </div>
              <Progress value={19} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Bearish Concerns */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator bottom-right" />
        
        <CardHeader>
          <CardTitle className="console-text">
            📉 [BEARISH_CONCERNS]
          </CardTitle>
        </CardHeader>
        
        <CardContent className="console-text space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="status-bearish font-semibold mb-2">[CHINA_SALES]</div>
              <div className="text-sm text-muted-foreground">
                Declining iPhone sales in Chinese market
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bearish font-semibold mb-2">[COMPETITION]</div>
              <div className="text-sm text-muted-foreground">
                Increased pressure from Android manufacturers
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bearish font-semibold mb-2">[VALUATION]</div>
              <div className="text-sm text-muted-foreground">
                High P/E ratio concerns amid economic uncertainty
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bearish font-semibold mb-2">[REGULATORY_RISK]</div>
              <div className="text-sm text-muted-foreground">
                EU antitrust investigations and App Store changes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Bearish Mentions */}
      <ActivityFeed 
        activities={activities.length > 0 ? activities : []}
      />
    </div>
  )
}