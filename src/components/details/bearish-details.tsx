"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityFeed, ActivityItem } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData, type MentionData } from "@/lib/actions"

export function BearishDetails() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBearishData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 20)
        // Filter for bearish sentiment only
        const bearishMentions = mentions.filter(m => m.sentiment === 'bearish')
        setActivities(bearishMentions.map(mention => ({
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
        activities={activities.length > 0 ? activities : [
          {
            id: '1',
            platform: 'reddit',
            content: 'AAPL is looking overvalued at these levels. China sales are declining and competition is heating up. Might be time to take profits.',
            sentiment: 'bearish' as const,
            sentimentScore: 3.2,
            author: 'ValueInvestor',
            timestamp: new Date(Date.now() - 450000).toISOString(),
            metrics: { upvotes: 78, comments: 23 }
          },
          {
            id: '2',
            platform: 'stocktwits',
            content: '$AAPL facing headwinds in China. iPhone 15 sales disappointing vs expectations. Technical indicators showing weakness.',
            sentiment: 'bearish' as const,
            sentimentScore: 2.8,
            author: 'BearTrader',
            timestamp: new Date(Date.now() - 750000).toISOString(),
            metrics: { bullish: 23, bearish: 87 }
          },
          {
            id: '3',
            platform: 'twitter',
            content: 'Apple\'s growth story is getting tired. Services revenue growth slowing, hardware innovation lacking. Time to rotate out of $AAPL',
            sentiment: 'bearish' as const,
            sentimentScore: 2.5,
            author: 'TechSkeptic',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            metrics: { likes: 89, retweets: 34 }
          }
        ]}
      />
    </div>
  )
}