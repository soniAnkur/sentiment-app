"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData, type MentionData } from "@/lib/actions"

export function BullishDetails() {
  const [activities, setActivities] = useState<MentionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBullishData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 20)
        // Filter for bullish sentiment only
        const bullishMentions = mentions.filter(m => m.sentiment === 'bullish')
        setActivities(bullishMentions.map(mention => ({
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
        console.error('Error loading bullish data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBullishData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading bullish sentiment data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Bullish Overview */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {">>> BULLISH_METRICS.exe"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="metric-large status-bullish glow-bullish mb-2">
                76%
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [BULLISH_RATIO]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bullish glow-bullish mb-2">
                2.4K
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [POSITIVE_MENTIONS]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bullish glow-bullish mb-2">
                8.7
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [AVG_CONFIDENCE]
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[TWITTER_BULLISH]</span>
                <span>82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[REDDIT_BULLISH]</span>
                <span>74%</span>
              </div>
              <Progress value={74} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[STOCKTWITS_BULLISH]</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Bullish Indicators */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator bottom-right" />
        
        <CardHeader>
          <CardTitle className="console-text">
            📈 [BULLISH_INDICATORS]
          </CardTitle>
        </CardHeader>
        
        <CardContent className="console-text space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="status-bullish font-semibold mb-2">[EARNINGS_BEAT]</div>
              <div className="text-sm text-muted-foreground">
                Q4 earnings exceeded expectations by 15%
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bullish font-semibold mb-2">[PRODUCT_LAUNCH]</div>
              <div className="text-sm text-muted-foreground">
                iPhone 16 Pro receiving positive market response
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bullish font-semibold mb-2">[AI_INTEGRATION]</div>
              <div className="text-sm text-muted-foreground">
                Apple Intelligence features driving optimism
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-bullish font-semibold mb-2">[ANALYST_UPGRADES]</div>
              <div className="text-sm text-muted-foreground">
                12 analyst price target increases this week
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Bullish Mentions */}
      <ActivityFeed 
        activities={activities.length > 0 ? activities : [
          {
            id: '1',
            platform: 'twitter',
            content: '@TechAnalyst: Apple\'s AI integration is revolutionary! The new iPhone features are going to drive massive adoption. $AAPL is heading to $220+ 🚀📱',
            sentiment: 'bullish' as const,
            sentimentScore: 9.5,
            author: 'TechAnalyst',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            metrics: { likes: 450, retweets: 230 }
          },
          {
            id: '2',
            platform: 'reddit',
            content: 'Apple\'s ecosystem lock-in is getting stronger. Services revenue growth is unstoppable and margins keep improving. This is a long-term hold for sure.',
            sentiment: 'bullish' as const,
            sentimentScore: 8.8,
            author: 'InvestorPro',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            metrics: { upvotes: 156, comments: 45 }
          },
          {
            id: '3',
            platform: 'stocktwits',
            content: '$AAPL breaking out of consolidation pattern. Volume is increasing and institutional buying is evident. Target $210 by year-end.',
            sentiment: 'bullish' as const,
            sentimentScore: 9.1,
            author: 'ChartMaster',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            metrics: { bullish: 89, bearish: 12 }
          }
        ]}
      />
    </div>
  )
}