"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityFeed, ActivityItem } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData } from "@/lib/actions"
import type { MentionData } from "@/lib/types"

export function MentionsDetails() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMentionsData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 50)
        setActivities(mentions.map(mention => ({
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
        console.error('Error loading mentions data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMentionsData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading mentions data...</div>
  }

  const allMentions = activities.length > 0 ? activities : [
    {
      id: '1',
      platform: 'twitter',
      content: '@TechAnalyst: Apple\'s Q4 results were impressive! Services revenue growth continues to outpace expectations. $AAPL 📈',
      sentiment: 'bullish' as const,
      sentimentScore: 8.5,
      author: 'TechAnalyst',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      metrics: { likes: 234, retweets: 89 }
    },
    {
      id: '2',
      platform: 'reddit',
      content: 'Apple\'s ecosystem is getting stronger every year. The integration between devices is seamless and keeps me locked in.',
      sentiment: 'bullish' as const,
      sentimentScore: 7.8,
      author: 'AppleFan2023',
      timestamp: new Date(Date.now() - 380000).toISOString(),
      metrics: { upvotes: 156, comments: 34 }
    },
    {
      id: '3',
      platform: 'stocktwits',
      content: '$AAPL testing resistance at $195. Volume is picking up. Could see a breakout if market sentiment improves.',
      sentiment: 'neutral' as const,
      sentimentScore: 5.5,
      author: 'ChartReader',
      timestamp: new Date(Date.now() - 620000).toISOString(),
      metrics: { bullish: 67, bearish: 23 }
    },
    {
      id: '4',
      platform: 'reddit',
      content: 'Concerned about Apple\'s China exposure. Trade tensions and local competition are real headwinds for iPhone sales.',
      sentiment: 'bearish' as const,
      sentimentScore: 3.2,
      author: 'GlobalInvestor',
      timestamp: new Date(Date.now() - 890000).toISOString(),
      metrics: { upvotes: 89, comments: 45 }
    }
  ]

  const twitterMentions = allMentions.filter(m => m.platform === 'twitter')
  const redditMentions = allMentions.filter(m => m.platform === 'reddit')
  const stocktwitsMentions = allMentions.filter(m => m.platform === 'stocktwits')

  return (
    <div className="space-y-6">
      {/* Mentions Overview */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-accent/20 text-accent border-accent/30">
              {">>> MENTIONS_OVERVIEW.exe"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="metric-large status-accent glow-accent mb-2">
                3.2K
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [TOTAL_MENTIONS]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bullish glow-bullish mb-2">
                1.2K
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [TWITTER/X]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-neutral glow-neutral mb-2">
                856
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [REDDIT]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-accent glow-accent mb-2">
                432
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [STOCKTWITS]
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="console-text">
            🌐 [PLATFORM_BREAKDOWN]
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="all" className="console-text">All</TabsTrigger>
              <TabsTrigger value="twitter" className="console-text">Twitter/X</TabsTrigger>
              <TabsTrigger value="reddit" className="console-text">Reddit</TabsTrigger>
              <TabsTrigger value="stocktwits" className="console-text">StockTwits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ActivityFeed activities={allMentions} />
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-6">
              <ActivityFeed activities={twitterMentions} />
            </TabsContent>
            
            <TabsContent value="reddit" className="mt-6">
              <ActivityFeed activities={redditMentions} />
            </TabsContent>
            
            <TabsContent value="stocktwits" className="mt-6">
              <ActivityFeed activities={stocktwitsMentions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}