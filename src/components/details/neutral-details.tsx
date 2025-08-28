"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData, type MentionData } from "@/lib/actions"

export function NeutralDetails() {
  const [activities, setActivities] = useState<MentionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNeutralData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 20)
        // Filter for neutral sentiment only
        const neutralMentions = mentions.filter(m => m.sentiment === 'neutral')
        setActivities(neutralMentions.map(mention => ({
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
        console.error('Error loading neutral data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNeutralData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading neutral sentiment data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Neutral Overview */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {">>> NEUTRAL_METRICS.exe"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="metric-large status-neutral glow-neutral mb-2">
                6%
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [NEUTRAL_RATIO]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-neutral glow-neutral mb-2">
                192
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [NEUTRAL_MENTIONS]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-neutral glow-neutral mb-2">
                5.0
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [AVG_NEUTRALITY]
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[TWITTER_NEUTRAL]</span>
                <span>3%</span>
              </div>
              <Progress value={3} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[REDDIT_NEUTRAL]</span>
                <span>4%</span>
              </div>
              <Progress value={4} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[STOCKTWITS_NEUTRAL]</span>
                <span>13%</span>
              </div>
              <Progress value={13} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neutral Factors */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator bottom-right" />
        
        <CardHeader>
          <CardTitle className="console-text">
            ⚖️ [NEUTRAL_FACTORS]
          </CardTitle>
        </CardHeader>
        
        <CardContent className="console-text space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="status-neutral font-semibold mb-2">[WAIT_AND_SEE]</div>
              <div className="text-sm text-muted-foreground">
                Investors waiting for more clarity on guidance
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-neutral font-semibold mb-2">[MIXED_SIGNALS]</div>
              <div className="text-sm text-muted-foreground">
                Conflicting analyst opinions creating uncertainty
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-neutral font-semibold mb-2">[TECHNICAL_CONSOLIDATION]</div>
              <div className="text-sm text-muted-foreground">
                Price consolidating in trading range
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="status-neutral font-semibold mb-2">[MACRO_UNCERTAINTY]</div>
              <div className="text-sm text-muted-foreground">
                Broader market conditions creating caution
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Neutral Mentions */}
      <ActivityFeed 
        activities={activities.length > 0 ? activities : [
          {
            id: '1',
            platform: 'stocktwits',
            content: '$AAPL consolidating around $195. Waiting for breakout confirmation before adding to position. Need to see how China sales develop.',
            sentiment: 'neutral' as const,
            sentimentScore: 5.2,
            author: 'TechnicalTrader',
            timestamp: new Date(Date.now() - 360000).toISOString(),
            metrics: { bullish: 45, bearish: 33 }
          },
          {
            id: '2',
            platform: 'reddit',
            content: 'Apple earnings were decent but nothing spectacular. Services growth is good but hardware is flat. Holding my position for now.',
            sentiment: 'neutral' as const,
            sentimentScore: 4.8,
            author: 'LongTermHolder',
            timestamp: new Date(Date.now() - 680000).toISOString(),
            metrics: { upvotes: 56, comments: 18 }
          },
          {
            id: '3',
            platform: 'twitter',
            content: '$AAPL sitting at resistance. Could go either way from here. Watching volume for direction clues. No position yet.',
            sentiment: 'neutral' as const,
            sentimentScore: 5.0,
            author: 'MarketWatcher',
            timestamp: new Date(Date.now() - 950000).toISOString(),
            metrics: { likes: 23, retweets: 8 }
          }
        ]}
      />
    </div>
  )
}